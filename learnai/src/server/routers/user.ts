import { z } from "zod";
import { router, protectedProcedure } from "@/lib/trpc/server";

export const userRouter = router({
  // Get current user profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        bio: true,
        headline: true,
        createdAt: true,
      },
    });
  }),

  // Update profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).optional(),
        bio: z.string().max(500).optional(),
        headline: z.string().max(100).optional(),
        image: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: input,
      });
    }),

  // FIX #25: get actual total enrollment count, not just the count of the first 10 returned
  getDashboard: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const [enrollments, certificates, recentQuizzes, totalEnrolledCount] = await Promise.all([
      ctx.db.enrollment.findMany({
        where: { userId },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              thumbnail: true,
              duration: true,
            },
          },
        },
        orderBy: { enrolledAt: "desc" },
        take: 10,
      }),
      ctx.db.certificate.findMany({
        where: { userId },
        include: { course: { select: { title: true } } },
        orderBy: { issuedAt: "desc" },
        take: 5,
      }),
      ctx.db.quizAttempt.findMany({
        where: { userId },
        include: { quiz: { select: { title: true } } },
        orderBy: { startedAt: "desc" },
        take: 5,
      }),
      // Separate count query so stats.totalEnrolled is accurate regardless of `take`
      ctx.db.enrollment.count({ where: { userId } }),
    ]);

    return {
      enrollments,
      certificates,
      recentQuizzes,
      stats: {
        totalEnrolled:    totalEnrolledCount,      // actual total, not capped at 10
        totalCertificates: certificates.length,
      },
    };
  }),
});
