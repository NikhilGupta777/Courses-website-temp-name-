import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "@/lib/trpc/server";
import { markLessonComplete, enrollFree, checkCourseAccess } from "@/server/services/enrollment";

export const enrollmentRouter = router({
  // Enroll in a free course
  enrollFree: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return enrollFree(ctx.session.user.id, input.courseId);
    }),

  // Get all enrollments for current user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.enrollment.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        course: {
          select: {
            id: true, title: true, slug: true,
            thumbnail: true, duration: true, totalStudents: true,
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });
  }),

  // Get detailed progress for a single course
  getProgress: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ ctx, input }) => {
      const enrollment = await ctx.db.enrollment.findUnique({
        where: { userId_courseId: { userId: ctx.session.user.id, courseId: input.courseId } },
      });

      if (!enrollment) throw new TRPCError({ code: "NOT_FOUND", message: "Not enrolled in this course" });

      const modules = await ctx.db.module.findMany({
        where: { courseId: input.courseId },
        orderBy: { position: "asc" },
        include: {
          lessons: {
            orderBy: { position: "asc" },
            include: {
              progress: {
                where: { userId: ctx.session.user.id },
                select: { isCompleted: true, lastPosition: true },
              },
            },
          },
        },
      });

      return { enrollment, modules };
    }),

  // Mark a lesson as complete and update course progress
  markComplete: protectedProcedure
    .input(z.object({ lessonId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const newProgress = await markLessonComplete(ctx.session.user.id, input.lessonId);
      return { progress: newProgress };
    }),

  // Save video playback position
  saveVideoPosition: protectedProcedure
    .input(z.object({ lessonId: z.string(), position: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.lessonProgress.upsert({
        where: { userId_lessonId: { userId: ctx.session.user.id, lessonId: input.lessonId } },
        create: { userId: ctx.session.user.id, lessonId: input.lessonId, lastPosition: input.position },
        update: { lastPosition: input.position },
      });
      return { saved: true };
    }),

  // Check if user has access to a course
  checkAccess: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ ctx, input }) => {
      const hasAccess = await checkCourseAccess(ctx.session.user.id, input.courseId);
      return { hasAccess };
    }),
});
