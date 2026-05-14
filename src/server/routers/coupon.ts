import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, adminProcedure } from "@/lib/trpc/server";

export const couponRouter = router({
  // ── Admin: get all coupons with usage stats ───────────────────────────────
  getAll: adminProcedure.query(async ({ ctx }) => {
    const coupons = await ctx.db.coupon.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        course: { select: { id: true, title: true } },
      },
    });

    // Aggregate stats
    const totalCoupons = coupons.length;
    const activeCoupons = coupons.filter((c) => c.isActive).length;
    const totalRedemptions = coupons.reduce((sum, c) => sum + c.currentUses, 0);

    return { coupons, stats: { totalCoupons, activeCoupons, totalRedemptions } };
  }),

  // ── Admin: create a new coupon ────────────────────────────────────────────
  create: adminProcedure
    .input(z.object({
      code:          z.string().min(3).max(30).toUpperCase(),
      description:   z.string().optional(),
      discountType:  z.enum(["percentage", "fixed"]),
      discountValue: z.number().positive(),
      maxUses:       z.number().int().positive().optional(),
      validUntil:    z.string().optional(), // ISO date string
      courseId:      z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check code uniqueness
      const existing = await ctx.db.coupon.findUnique({ where: { code: input.code } });
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: `Coupon code "${input.code}" already exists` });
      }

      // Validate percentage is <= 100
      if (input.discountType === "percentage" && input.discountValue > 100) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Percentage discount cannot exceed 100%" });
      }

      return ctx.db.coupon.create({
        data: {
          code:          input.code,
          description:   input.description,
          discountType:  input.discountType,
          discountValue: input.discountValue,
          maxUses:       input.maxUses ?? null,
          validUntil:    input.validUntil ? new Date(input.validUntil) : null,
          courseId:      input.courseId ?? null,
          isActive:      true,
        },
      });
    }),

  // ── Admin: toggle active/inactive ────────────────────────────────────────
  toggle: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const coupon = await ctx.db.coupon.findUnique({ where: { id: input.id } });
      if (!coupon) throw new TRPCError({ code: "NOT_FOUND", message: "Coupon not found" });

      return ctx.db.coupon.update({
        where: { id: input.id },
        data: { isActive: !coupon.isActive },
      });
    }),

  // ── Admin: delete a coupon ────────────────────────────────────────────────
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const coupon = await ctx.db.coupon.findUnique({ where: { id: input.id } });
      if (!coupon) throw new TRPCError({ code: "NOT_FOUND", message: "Coupon not found" });

      await ctx.db.coupon.delete({ where: { id: input.id } });
      return { deleted: true };
    }),
});
