import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, instructorProcedure, protectedProcedure } from "@/lib/trpc/server";
import { checkCourseAccess } from "@/server/services/enrollment";

export const lessonRouter = router({
  create: instructorProcedure
    .input(z.object({
      moduleId: z.string(),
      title: z.string().min(1),
      type: z.enum(["VIDEO", "ARTICLE", "QUIZ", "ASSIGNMENT", "LIVE_SESSION", "RESOURCE"]),
      isFree: z.boolean().optional().default(false),
      content: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.db.instructorProfile.findUnique({ where: { userId: ctx.session.user.id } });
      if (!profile) throw new TRPCError({ code: "NOT_FOUND" });
      const mod = await ctx.db.module.findUnique({ where: { id: input.moduleId }, include: { course: true } });
      if (!mod) throw new TRPCError({ code: "NOT_FOUND" });
      if (mod.course.instructorId !== profile.id) throw new TRPCError({ code: "FORBIDDEN" });
      const maxPos = await ctx.db.lesson.aggregate({ where: { moduleId: input.moduleId }, _max: { position: true } });
      const position = (maxPos._max.position ?? 0) + 1;
      return ctx.db.lesson.create({
        data: { moduleId: input.moduleId, title: input.title, type: input.type, isFree: input.isFree ?? false, content: input.content, position },
      });
    }),

  update: instructorProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      type: z.enum(["VIDEO", "ARTICLE", "QUIZ", "ASSIGNMENT", "LIVE_SESSION", "RESOURCE"]).optional(),
      isFree: z.boolean().optional(),
      content: z.string().optional(),
      isPublished: z.boolean().optional(),
      duration: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.db.instructorProfile.findUnique({ where: { userId: ctx.session.user.id } });
      if (!profile) throw new TRPCError({ code: "NOT_FOUND" });
      const lesson = await ctx.db.lesson.findUnique({ where: { id: input.id }, include: { module: { include: { course: true } } } });
      if (!lesson) throw new TRPCError({ code: "NOT_FOUND" });
      if (lesson.module.course.instructorId !== profile.id) throw new TRPCError({ code: "FORBIDDEN" });
      const { id, ...data } = input;
      return ctx.db.lesson.update({ where: { id }, data });
    }),

  delete: instructorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.db.instructorProfile.findUnique({ where: { userId: ctx.session.user.id } });
      if (!profile) throw new TRPCError({ code: "NOT_FOUND" });
      const lesson = await ctx.db.lesson.findUnique({ where: { id: input.id }, include: { module: { include: { course: true } } } });
      if (!lesson) throw new TRPCError({ code: "NOT_FOUND" });
      if (lesson.module.course.instructorId !== profile.id) throw new TRPCError({ code: "FORBIDDEN" });
      return ctx.db.lesson.delete({ where: { id: input.id } });
    }),

  reorder: instructorProcedure
    .input(z.object({ moduleId: z.string(), orderedIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.db.instructorProfile.findUnique({ where: { userId: ctx.session.user.id } });
      if (!profile) throw new TRPCError({ code: "NOT_FOUND" });
      const mod = await ctx.db.module.findUnique({ where: { id: input.moduleId }, include: { course: true } });
      if (!mod || mod.course.instructorId !== profile.id) throw new TRPCError({ code: "FORBIDDEN" });
      const uniqueIds = new Set(input.orderedIds);
      if (uniqueIds.size !== input.orderedIds.length) throw new TRPCError({ code: "BAD_REQUEST", message: "Duplicate lesson IDs" });
      const matchingLessons = await ctx.db.lesson.count({
        where: { id: { in: input.orderedIds }, moduleId: input.moduleId },
      });
      if (matchingLessons !== input.orderedIds.length) throw new TRPCError({ code: "FORBIDDEN", message: "Invalid lesson order" });

      await ctx.db.$transaction(
        input.orderedIds.map((id, index) => ctx.db.lesson.update({ where: { id }, data: { position: index + 1 } }))
      );
      return { success: true };
    }),

  getContent: protectedProcedure
    .input(z.object({ lessonId: z.string(), courseId: z.string() }))
    .query(async ({ ctx, input }) => {
      const lesson = await ctx.db.lesson.findUnique({
        where: { id: input.lessonId },
        include: {
          module: { include: { course: { select: { id: true, status: true } } } },
          quiz: { include: { questions: { orderBy: { position: "asc" }, select: { id: true, type: true, text: true, options: true, points: true, position: true } } } },
        },
      });
      if (!lesson) throw new TRPCError({ code: "NOT_FOUND" });

      const actualCourseId = lesson.module.courseId;
      const hasAccess = await checkCourseAccess(ctx.session.user.id, actualCourseId);
      if (!hasAccess) {
        const canPreviewFreeLesson = lesson.isFree && lesson.isPublished && lesson.module.course.status === "PUBLISHED";
        if (!canPreviewFreeLesson) throw new TRPCError({ code: "FORBIDDEN", message: "You do not have access to this lesson" });
      }
      return lesson;
    }),

  // BUG #6 FIX: save the Mux uploadId as videoUrl immediately after upload starts,
  // so the Mux webhook (video.upload.asset_created) can find the lesson via
  // `where: { videoUrl: upload_id }` and update muxAssetId + videoStatus.
  saveVideoUrl: instructorProcedure
    .input(z.object({ lessonId: z.string(), uploadId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.db.instructorProfile.findUnique({ where: { userId: ctx.session.user.id } });
      if (!profile) throw new TRPCError({ code: "NOT_FOUND" });
      const lesson = await ctx.db.lesson.findUnique({
        where: { id: input.lessonId },
        include: { module: { include: { course: true } } },
      });
      if (!lesson) throw new TRPCError({ code: "NOT_FOUND" });
      if (lesson.module.course.instructorId !== profile.id) throw new TRPCError({ code: "FORBIDDEN" });
      return ctx.db.lesson.update({
        where: { id: input.lessonId },
        data: { videoUrl: input.uploadId, videoStatus: "preparing" },
      });
    }),
});
