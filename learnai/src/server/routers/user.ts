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

  // Get dashboard data
  getDashboard: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const [enrollments, certificates, recentQuizzes] = await Promise.all([
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
    ]);

    return {
      enrollments,
      certificates,
      recentQuizzes,
      stats: {
        totalEnrolled: enrollments.length,
        totalCertificates: certificates.length,
      },
    };
  }),
});
