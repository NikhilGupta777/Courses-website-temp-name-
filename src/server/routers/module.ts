import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, instructorProcedure } from "@/lib/trpc/server";

export const moduleRouter = router({
  create: instructorProcedure
    .input(z.object({
      courseId: z.string(),
      title: z.string().min(1),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.db.instructorProfile.findUnique({
        where: { userId: ctx.session.user.id },
      });
      if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "Instructor profile not found" });

      const course = await ctx.db.course.findUnique({ where: { id: input.courseId } });
      if (!course) throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });
      if (course.instructorId !== profile.id) throw new TRPCError({ code: "FORBIDDEN", message: "Not your course" });

      const maxPos = await ctx.db.module.aggregate({
        where: { courseId: input.courseId },
        _max: { position: true },
      });
      const position = (maxPos._max.position ?? 0) + 1;

      return ctx.db.module.create({
        data: { courseId: input.courseId, title: input.title, description: input.description, position },
      });
    }),

  update: instructorProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().min(1).optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.db.instructorProfile.findUnique({ where: { userId: ctx.session.user.id } });
      if (!profile) throw new TRPCError({ code: "NOT_FOUND" });
      const mod = await ctx.db.module.findUnique({ where: { id: input.id }, include: { course: true } });
      if (!mod) throw new TRPCError({ code: "NOT_FOUND" });
      if (mod.course.instructorId !== profile.id) throw new TRPCError({ code: "FORBIDDEN" });
      const { id, ...data } = input;
      return ctx.db.module.update({ where: { id }, data });
    }),

  delete: instructorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.db.instructorProfile.findUnique({ where: { userId: ctx.session.user.id } });
      if (!profile) throw new TRPCError({ code: "NOT_FOUND" });
      const mod = await ctx.db.module.findUnique({ where: { id: input.id }, include: { course: true } });
      if (!mod) throw new TRPCError({ code: "NOT_FOUND" });
      if (mod.course.instructorId !== profile.id) throw new TRPCError({ code: "FORBIDDEN" });
      return ctx.db.module.delete({ where: { id: input.id } });
    }),

  reorder: instructorProcedure
    .input(z.object({
      courseId: z.string(),
      orderedIds: z.array(z.string()),
    }))
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.db.instructorProfile.findUnique({ where: { userId: ctx.session.user.id } });
      if (!profile) throw new TRPCError({ code: "NOT_FOUND" });
      const course = await ctx.db.course.findUnique({ where: { id: input.courseId } });
      if (!course || course.instructorId !== profile.id) throw new TRPCError({ code: "FORBIDDEN" });

      const uniqueIds = new Set(input.orderedIds);
      if (uniqueIds.size !== input.orderedIds.length) throw new TRPCError({ code: "BAD_REQUEST", message: "Duplicate module IDs" });
      const matchingModules = await ctx.db.module.count({
        where: { id: { in: input.orderedIds }, courseId: input.courseId },
      });
      if (matchingModules !== input.orderedIds.length) throw new TRPCError({ code: "FORBIDDEN", message: "Invalid module order" });

      await ctx.db.$transaction(
        input.orderedIds.map((id, index) =>
          ctx.db.module.update({ where: { id }, data: { position: index + 1 } })
        )
      );
      return { success: true };
    }),
});
