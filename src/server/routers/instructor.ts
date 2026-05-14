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

  getAnalytics: instructorProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db.instructorProfile.findUnique({ where: { userId: ctx.session.user.id } });
    if (!profile) throw new TRPCError({ code: "NOT_FOUND" });

    const courses = await ctx.db.course.findMany({
      where: { instructorId: profile.id },
      include: { _count: { select: { enrollments: true } } },
    });

    const courseIds = courses.map((c) => c.id);
    const [enrollments, payments] = await Promise.all([
      ctx.db.enrollment.count({ where: { courseId: { in: courseIds } } }),
      ctx.db.payment.findMany({ where: { courseId: { in: courseIds }, status: "COMPLETED" }, select: { amount: true } }),
    ]);

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount * 0.7, 0);

    const recentEnrollments = await ctx.db.enrollment.findMany({
      where: { courseId: { in: courseIds } },
      orderBy: { enrolledAt: "desc" },
      take: 10,
      include: {
        user: { select: { name: true, email: true, image: true } },
        course: { select: { title: true } },
      },
    });

    const courseStats = courses.map((c) => ({
      id: c.id,
      title: c.title,
      status: c.status,
      totalStudents: c._count.enrollments,
      averageRating: c.averageRating,
      totalReviews: c.totalReviews,
      revenue: payments.filter((p) => p.amount > 0).reduce((sum) => sum, 0),
    }));

    return { totalStudents: enrollments, totalRevenue, courseStats, recentEnrollments };
  }),

  getPayouts: instructorProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db.instructorProfile.findUnique({ where: { userId: ctx.session.user.id } });
    if (!profile) throw new TRPCError({ code: "NOT_FOUND" });
    return ctx.db.payout.findMany({
      where: { instructorId: profile.id },
      orderBy: { createdAt: "desc" },
    });
  }),
});
