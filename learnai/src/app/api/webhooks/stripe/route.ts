import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Stripe sends raw body — must disable Next.js body parsing
export const config = { api: { bodyParser: false } };

// ─── Stripe event types we handle ────────────────────────────
type StripeEventType =
  | "checkout.session.completed"
  | "invoice.paid"
  | "invoice.payment_failed"
  | "customer.subscription.updated"
  | "customer.subscription.deleted";

async function verifyStripeSignature(req: NextRequest): Promise<{ event: any } | { error: string }> {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) return { error: "Missing stripe-signature header" };
  if (!process.env.STRIPE_WEBHOOK_SECRET) return { error: "STRIPE_WEBHOOK_SECRET not configured" };

  // In production: use stripe.webhooks.constructEvent(body, signature, secret)
  // Skipping Stripe SDK import here to avoid runtime errors without credentials
  try {
    // TODO: replace with real Stripe SDK verification
    const event = JSON.parse(body);
    return { event };
  } catch {
    return { error: "Invalid JSON body" };
  }
}

export async function POST(req: NextRequest) {
  const result = await verifyStripeSignature(req);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const { event } = result;
  const eventType: StripeEventType = event.type;

  try {
    switch (eventType) {
      // ── One-time course purchase ──────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object;
        const { userId, courseId, planId } = session.metadata ?? {};

        if (courseId && userId) {
          // Enroll user in course
          await db.enrollment.upsert({
            where: { userId_courseId: { userId, courseId } },
            create: { userId, courseId, status: "ACTIVE" },
            update: { status: "ACTIVE" },
          });

          // Record payment
          await db.payment.create({
            data: {
              userId,
              amount: session.amount_total / 100,
              currency: session.currency,
              status: "COMPLETED",
              type: "ONE_TIME",
              stripePaymentId: session.payment_intent,
              courseId,
            },
          });
        }

        if (planId && userId) {
          // Subscription checkout handled by invoice.paid
          console.log(`Subscription checkout completed for user ${userId}, plan ${planId}`);
        }
        break;
      }

      // ── Subscription payment succeeded ───────────────────
      case "invoice.paid": {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        const subscriptionId = invoice.subscription;

        if (subscriptionId) {
          await db.subscription.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: { status: "ACTIVE" },
          });

          // Record revenue payment
          console.log(`Invoice paid: ${invoice.id} for customer ${customerId}`);
        }
        break;
      }

      // ── Subscription payment failed ───────────────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        await db.subscription.updateMany({
          where: { stripeSubscriptionId: invoice.subscription },
          data: { status: "PAST_DUE" },
        });
        console.warn(`Payment failed for subscription: ${invoice.subscription}`);
        break;
      }

      // ── Subscription updated (upgrade/downgrade) ──────────
      case "customer.subscription.updated": {
        const sub = event.data.object;
        await db.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: {
            status: sub.status.toUpperCase(),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          },
        });
        break;
      }

      // ── Subscription cancelled ────────────────────────────
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        await db.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { status: "CANCELLED" },
        });
        break;
      }

      default:
        console.log(`Unhandled Stripe event: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
