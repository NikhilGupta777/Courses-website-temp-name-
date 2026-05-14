import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

// ─── Issue #008 fix: `export const config` is a Pages Router pattern. ─────────
// In Next.js App Router, raw body access works natively — no config needed.
// We read the raw text body for signature verification below.

// ─── Stripe subscription status → our DB enum ────────────────────────────────
// Issue #010 fix: Stripe statuses are lowercase ("active", "past_due", etc.).
// Our DB enum is UPPER_CASE. Map explicitly instead of blindly calling
// .toUpperCase() which breaks on Stripe values like "past_due" → "PAST_DUE" ✓
// but "unpaid" → "UNPAID" which doesn't exist in our schema.
type SubscriptionStatusValue = "ACTIVE" | "PAST_DUE" | "CANCELLED" | "EXPIRED" | "TRIALING";

type StripeInvoiceWithSubscription = Stripe.Invoice & {
  subscription?: string | Stripe.Subscription | null;
};

type StripeSubscriptionWithPeriods = Stripe.Subscription & {
  current_period_start: number;
  current_period_end: number;
};

const STRIPE_STATUS_MAP: Record<string, SubscriptionStatusValue> = {
  active:             "ACTIVE",
  past_due:           "PAST_DUE",
  canceled:           "CANCELLED",   // Stripe spells it "canceled"
  cancelled:          "CANCELLED",
  unpaid:             "PAST_DUE",    // treat unpaid the same as past_due
  incomplete:         "PAST_DUE",
  incomplete_expired: "EXPIRED",
  trialing:           "TRIALING",
  paused:             "PAST_DUE",
};

function mapStripeStatus(stripeStatus: string): SubscriptionStatusValue {
  return STRIPE_STATUS_MAP[stripeStatus] ?? "PAST_DUE";
}

function getSubscriptionId(invoice: StripeInvoiceWithSubscription): string | null {
  const subscription = invoice.subscription;
  if (typeof subscription === "string") return subscription;
  return subscription?.id ?? null;
}

export async function POST(req: NextRequest) {
  // ─── Issue #007 fix: perform real HMAC signature verification ───────────────
  // Reading the raw body as text is mandatory — any JSON.parse before this
  // would corrupt the body and cause signature verification to fail.
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: ReturnType<typeof stripe.webhooks.constructEvent>;

  try {
    // This verifies the HMAC-SHA256 signature — rejects tampered or replayed events
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown signature verification error";
    console.error("Stripe webhook signature verification failed:", message);
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      // ── One-time course purchase ──────────────────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object;
        const { userId, courseId, planId } = (session.metadata ?? {}) as Record<string, string>;

        if (courseId && userId) {
          await db.enrollment.upsert({
            where: { userId_courseId: { userId, courseId } },
            create: { userId, courseId, status: "ACTIVE" },
            update: { status: "ACTIVE" },
          });

          // Increment totalStudents for paid enrolments too
          await db.course.update({
            where: { id: courseId },
            data: { totalStudents: { increment: 1 } },
          }).catch(() => { /* ignore if course not found — enrollment already saved */ });

          // ─── Issue #009 fix: amount_total is in the smallest currency unit ─
          // For INR, Stripe uses paise (1/100 of a rupee), so divide by 100.
          const amountInRupees = (session.amount_total ?? 0) / 100;

          await db.payment.create({
            data: {
              userId,
              amount: amountInRupees,
              currency: session.currency ?? "inr",
              status: "COMPLETED",
              type: "ONE_TIME",
              stripePaymentId: session.payment_intent as string | undefined,
              courseId,
            },
          });

          // BUG #10 FIX: fire payment confirmation email (best-effort)
          db.user.findUnique({ where: { id: userId }, select: { email: true, name: true } })
            .then(async (u) => {
              if (!u?.email) return;
              const { sendPaymentConfirmation } = await import("@/server/services/email");
              const course = await db.course.findUnique({ where: { id: courseId }, select: { title: true } });
              sendPaymentConfirmation(
                u.email,
                u.name ?? "there",
                `₹${amountInRupees.toLocaleString("en-IN")}`,
                course?.title ?? "Course"
              ).catch((err) => console.error("Payment email failed:", err));
            })
            .catch(() => { /* non-fatal */ });
        }

        if (planId && userId) {
          // Subscription checkout started — invoice.paid will activate it
          console.log(`Subscription checkout completed: user=${userId} plan=${planId}`);
        }
        break;
      }

      // ── Subscription payment succeeded ────────────────────────────────────
      case "invoice.paid": {
        const invoice = event.data.object as StripeInvoiceWithSubscription;
        const subscriptionId = getSubscriptionId(invoice);

        if (subscriptionId) {
          // ─── Issue #010 fix: also update period dates on renewal ──────────
          const stripeSub = await stripe.subscriptions.retrieve(subscriptionId) as unknown as StripeSubscriptionWithPeriods;
          await db.subscription.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: {
              status: "ACTIVE",
              currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
              currentPeriodEnd:   new Date(stripeSub.current_period_end   * 1000),
            },
          });
        }
        break;
      }

      // ── Subscription payment failed ───────────────────────────────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object as StripeInvoiceWithSubscription;
        const subscriptionId = getSubscriptionId(invoice);
        if (subscriptionId) {
          await db.subscription.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: { status: "PAST_DUE" },
          });
        }
        break;
      }

      // ── Subscription updated (upgrade / downgrade / trial end) ────────────
      case "customer.subscription.updated": {
        const sub = event.data.object as StripeSubscriptionWithPeriods;
        await db.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: {
            status:             mapStripeStatus(sub.status),
            currentPeriodStart: new Date(sub.current_period_start * 1000),
            currentPeriodEnd:   new Date(sub.current_period_end   * 1000),
            cancelAtPeriodEnd:  sub.cancel_at_period_end,
          },
        });
        break;
      }

      // ── Subscription cancelled ────────────────────────────────────────────
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        await db.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { status: "CANCELLED" },
        });
        break;
      }

      default:
        // Log unknown events but always return 200 so Stripe stops retrying
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook handler error:", error);
    // Return 500 so Stripe retries — don't swallow processing errors
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
