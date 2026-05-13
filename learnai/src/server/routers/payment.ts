import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "@/lib/trpc/server";
import {
  createCourseCheckout,
  createSubscriptionCheckout,
  createPortalSession,
  getOrCreateStripeCustomer,
} from "@/lib/stripe";

export const paymentRouter = router({
  // Create Stripe Checkout for one-time course purchase
  createCourseCheckout: protectedProcedure
    .input(z.object({ courseId: z.string(), couponCode: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({ where: { id: ctx.session.user.id } });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const course = await ctx.db.course.findUnique({ where: { id: input.courseId } });
      if (!course) throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });
      if (course.isFree) throw new TRPCError({ code: "BAD_REQUEST", message: "Course is free — no payment needed" });
      if (!course.price) throw new TRPCError({ code: "BAD_REQUEST" });

      const customerId = await getOrCreateStripeCustomer(user.id, user.email!, user.name);
      const url = await createCourseCheckout({
        customerId,
        userId: user.id,
        courseId: course.id,
        courseTitle: course.title,
        priceInPaise: course.price * 100, // INR paise
        couponId: input.couponCode,
      });

      return { checkoutUrl: url };
    }),

  // Create Stripe Checkout for Pro subscription
  createSubscription: protectedProcedure
    .input(z.object({
      plan: z.enum(["PRO_MONTHLY", "PRO_ANNUAL"]),
      couponCode: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({ where: { id: ctx.session.user.id } });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const customerId = await getOrCreateStripeCustomer(user.id, user.email!, user.name);
      const url = await createSubscriptionCheckout({
        customerId,
        userId: user.id,
        plan: input.plan,
        couponId: input.couponCode,
      });

      return { checkoutUrl: url };
    }),

  // Get Stripe Customer Portal URL for managing subscription
  getPortalUrl: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({ where: { id: ctx.session.user.id } });
    if (!user) throw new TRPCError({ code: "NOT_FOUND" });

    // Look up Stripe customer ID from active subscription
    const subscription = await ctx.db.subscription.findFirst({
      where: { userId: user.id },
    });

    if (!subscription?.stripeCustomerId) {
      throw new TRPCError({ code: "NOT_FOUND", message: "No active subscription found" });
    }

    const url = await createPortalSession(subscription.stripeCustomerId);
    return { portalUrl: url };
  }),

  // Get payment history
  getHistory: protectedProcedure
    .input(z.object({ page: z.number().default(1), limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      const skip = (input.page - 1) * input.limit;
      const [payments, total] = await Promise.all([
        ctx.db.payment.findMany({
          where: { userId: ctx.session.user.id },
          orderBy: { createdAt: "desc" },
          skip,
          take: input.limit,
        }),
        ctx.db.payment.count({ where: { userId: ctx.session.user.id } }),
      ]);
      return { payments, total, pages: Math.ceil(total / input.limit) };
    }),

  // Get current subscription
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.subscription.findFirst({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Validate coupon code
  validateCoupon: protectedProcedure
    .input(z.object({ code: z.string(), courseId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const coupon = await ctx.db.coupon.findUnique({ where: { code: input.code } });
      if (!coupon || !coupon.isActive) {
        return { valid: false, message: "Invalid or expired coupon code" };
      }
      if (coupon.validUntil && coupon.validUntil < new Date()) {
        return { valid: false, message: "This coupon has expired" };
      }
      if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
        return { valid: false, message: "This coupon has reached its usage limit" };
      }
      return {
        valid: true,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        message: `${coupon.discountType === "percentage" ? `${coupon.discountValue}% off` : `₹${coupon.discountValue} off`} applied!`,
      };
    }),
});
