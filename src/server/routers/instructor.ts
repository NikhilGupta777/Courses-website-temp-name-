import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, instructorProcedure } from "@/lib/trpc/server";

export const instructorRouter = router({
  getProfile: instructorProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db.instructorProfile.findUnique({
      where: { userId: ctx.session.user.id },
      include: { user: { select: { name: true, email: true, image: true } } },
    });
    if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "Instructor profile not found" });
    return profile;
  }),

  updateProfile: instructorProcedure
    .input(z.object({
      displayName: z.string().min(2).optional(),
      bio: z.string().optional(),
      expertise: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.db.instructorProfile.findUnique({ where: { userId: ctx.session.user.id } });
      if (!profile) throw new TRPCError({ code: "NOT_FOUND" });
      return ctx.db.instructorProfile.update({ where: { userId: ctx.session.user.id }, data: input });
    }),

  getCourses: instructorProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db.instructorProfile.findUnique({ where: { userId: ctx.session.user.id } });
    if (!profile) throw new TRPCError({ code: "NOT_FOUND" });
    return ctx.db.course.findMany({
      where: { instructorId: profile.id },
      include: {
        category: { select: { name: true, slug: true } },
        _count: { select: { enrollments: true, modules: true } },
        modules: { include: { _count: { select: { lessons: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  // FIX BUG #1: broken reduce accumulator + missing per-course revenue filter
  getAnalytics: instructorProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db.instructorProfile.findUnique({ where: { userId: ctx.session.user.id } });
    if (!profile) throw new TRPCError({ code: "NOT_FOUND" });

    const courses = await ctx.db.course.findMany({
      where: { instructorId: profile.id },
      include: { _count: { select: { enrollments: true } } },
    });

    const courseIds = courses.map((c) => c.id);

    const [totalEnrollments, allPayments] = await Promise.all([
      ctx.db.enrollment.count({ where: { courseId: { in: courseIds } } }),
      ctx.db.payment.findMany({
        where: { courseId: { in: courseIds }, status: "COMPLETED" },
        select: { amount: true, courseId: true },
      }),
    ]);

    // FIX: correct accumulator — was `(sum) => sum` (ignores p), now `(sum, p) => sum + p.amount`
    const totalRevenue = allPayments.reduce((sum, p) => sum + p.amount * 0.7, 0);

    const recentEnrollments = await ctx.db.enrollment.findMany({
      where: { courseId: { in: courseIds } },
      orderBy: { enrolledAt: "desc" },
      take: 10,
      include: {
        user: { select: { name: true, email: true, image: true } },
        course: { select: { title: true } },
      },
    });

    // FIX: filter payments per-course for individual course revenue
    const courseStats = courses.map((c) => {
      const coursePayments = allPayments.filter((p) => p.courseId === c.id);
      const courseRevenue = coursePayments.reduce((sum, p) => sum + p.amount * 0.7, 0);
      return {
        id: c.id,
        title: c.title,
        status: c.status,
        totalStudents: c._count.enrollments,
        averageRating: c.averageRating,
        totalReviews: c.totalReviews,
        revenue: courseRevenue,
      };
    });

    return { totalStudents: totalEnrollments, totalRevenue, courseStats, recentEnrollments };
  }),

  getPayouts: instructorProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db.instructorProfile.findUnique({ where: { userId: ctx.session.user.id } });
    if (!profile) throw new TRPCError({ code: "NOT_FOUND" });
    return ctx.db.payout.findMany({
      where: { instructorId: profile.id },
      orderBy: { createdAt: "desc" },
    });
  }),

  // FIX BUG #2: real requestPayout mutation that creates a Payout record
  requestPayout: instructorProcedure
    .input(z.object({
      amount: z.number().positive(),
    }))
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.db.instructorProfile.findUnique({ where: { userId: ctx.session.user.id } });
      if (!profile) throw new TRPCError({ code: "NOT_FOUND" });

      // Prevent duplicate pending requests
      const existing = await ctx.db.payout.findFirst({
        where: { instructorId: profile.id, status: "pending" },
      });
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You already have a pending payout request",
        });
      }

      const now = new Date();
      const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);    // first of this month
      const periodEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 0); // last of this month

      const payout = await ctx.db.payout.create({
        data: {
          instructorId: profile.id,
          amount: input.amount,
          currency: "inr",
          status: "pending",
          periodStart,
          periodEnd,
        },
      });

      return payout;
    }),
});
