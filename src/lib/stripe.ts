import Stripe from "stripe";
import { db } from "@/lib/db";

// ─── Stripe API version ──────────────────────────────────────────────────────
const STRIPE_API_VERSION = "2026-04-22.dahlia" as const;

// Singleton Stripe client — safe for serverless / edge environments
const globalForStripe = globalThis as unknown as { stripe: Stripe | undefined };

export const stripe =
  globalForStripe.stripe ??
  new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder", {
    apiVersion: STRIPE_API_VERSION,
    typescript: true,
  });

if (process.env.NODE_ENV !== "production") globalForStripe.stripe = stripe;

// ─── Price IDs (set in .env) ─────────────────────────────────────────────────
export const STRIPE_PRICES = {
  PRO_MONTHLY: process.env.STRIPE_PRO_MONTHLY_PRICE_ID ?? "price_pro_monthly",
  PRO_ANNUAL:  process.env.STRIPE_PRO_ANNUAL_PRICE_ID  ?? "price_pro_annual",
} as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Issue #005 fix: look up the Stripe customer ID from the Subscription record
 * first (stored by the webhook), then fall back to a live Stripe email search,
 * and finally create a new customer — storing the ID so subsequent calls are O(1).
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string | null
): Promise<string> {
  // 1. Check our DB first — fastest path
  const existingSubscription = await db.subscription.findFirst({
    where: { userId, stripeCustomerId: { not: null } },
    select: { stripeCustomerId: true },
  });
  if (existingSubscription?.stripeCustomerId) {
    return existingSubscription.stripeCustomerId;
  }

  // 2. Search Stripe by email (handles accounts created outside our flow)
  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data.length > 0) {
    const customerId = existing.data[0].id;
    // Persist so we don't hit Stripe again
    await db.subscription.updateMany({
      where: { userId },
      data: { stripeCustomerId: customerId },
    });
    return customerId;
  }

  // 3. Create a fresh Stripe customer and persist immediately
  const customer = await stripe.customers.create({
    email,
    name: name ?? undefined,
    metadata: { userId },
  });

  await db.subscription.updateMany({
    where: { userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

/** Create a Checkout Session for a one-time course purchase */
export async function createCourseCheckout({
  customerId,
  userId,
  courseId,
  courseTitle,
  priceInPaise,
  couponId,
}: {
  customerId: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  priceInPaise: number;
  couponId?: string;
}): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: { name: courseTitle, metadata: { courseId } },
          unit_amount: priceInPaise,
        },
        quantity: 1,
      },
    ],
    metadata: { userId, courseId },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?enrolled=${courseId}`,
    cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}`,
    ...(couponId ? { discounts: [{ coupon: couponId }] } : {}),
  });

  return session.url!;
}

/** Create a Checkout Session for a Pro subscription */
export async function createSubscriptionCheckout({
  customerId,
  userId,
  plan,
  couponId,
}: {
  customerId: string;
  userId: string;
  plan: "PRO_MONTHLY" | "PRO_ANNUAL";
  couponId?: string;
}): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [{ price: STRIPE_PRICES[plan], quantity: 1 }],
    metadata: { userId, planId: plan },
    subscription_data: {
      trial_period_days: 7,
      metadata: { userId, plan },
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?subscribed=true`,
    cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    ...(couponId ? { discounts: [{ coupon: couponId }] } : {}),
  });

  return session.url!;
}

/** Generate a Stripe Customer Portal session URL */
export async function createPortalSession(customerId: string): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/profile`,
  });
  return session.url;
}
