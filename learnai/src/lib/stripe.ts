import Stripe from "stripe";

// Singleton Stripe client — safe for serverless environments
const globalForStripe = globalThis as unknown as { stripe: Stripe | undefined };

export const stripe =
  globalForStripe.stripe ??
  new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder", {
    apiVersion: "2025-02-24.acacia",
    typescript: true,
  });

if (process.env.NODE_ENV !== "production") globalForStripe.stripe = stripe;

// ─── Price IDs (set in .env) ────────────────────────────────
export const STRIPE_PRICES = {
  PRO_MONTHLY: process.env.STRIPE_PRO_MONTHLY_PRICE_ID ?? "price_pro_monthly",
  PRO_ANNUAL:  process.env.STRIPE_PRO_ANNUAL_PRICE_ID  ?? "price_pro_annual",
} as const;

// ─── Helpers ────────────────────────────────────────────────

/** Create or retrieve a Stripe Customer for a user */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string | null
): Promise<string> {
  // Check if customer already exists (search by email)
  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data.length > 0) return existing.data[0].id;

  const customer = await stripe.customers.create({
    email,
    name: name ?? undefined,
    metadata: { userId },
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
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?enrolled=${courseId}`,
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
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscribed=true`,
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
