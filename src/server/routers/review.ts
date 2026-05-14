import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, publicProcedure } from "@/lib/trpc/server";

export const reviewRouter = router({
  create: protectedProcedure
    .input(z.object({
      courseId: z.string(),
      rating: z.number().min(1).max(5),
      title: z.string().optional(),
      comment: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.review.findUnique({ where: { userId_courseId: { userId: ctx.session.user.id, courseId: input.courseId } } });
      if (existing) throw new TRPCError({ code: "CONFLICT", message: "You have already reviewed this course" });

      const review = await ctx.db.review.create({
        data: { userId: ctx.session.user.id, courseId: input.courseId, rating: input.rating, title: input.title, comment: input.comment },
      });

      const agg = await ctx.db.review.aggregate({ where: { courseId: input.courseId }, _avg: { rating: true }, _count: { id: true } });
      await ctx.db.course.update({
        where: { id: input.courseId },
        data: { averageRating: agg._avg.rating ?? 0, totalReviews: agg._count.id },
      });
      return review;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      rating: z.number().min(1).max(5).optional(),
      title: z.string().optional(),
      comment: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.db.review.findUnique({ where: { id: input.id } });
      if (!review) throw new TRPCError({ code: "NOT_FOUND" });
      if (review.userId !== ctx.session.user.id) throw new TRPCError({ code: "FORBIDDEN" });
      const { id, ...data } = input;
      const updated = await ctx.db.review.update({ where: { id }, data });
      const agg = await ctx.db.review.aggregate({ where: { courseId: review.courseId }, _avg: { rating: true }, _count: { id: true } });
      await ctx.db.course.update({ where: { id: review.courseId }, data: { averageRating: agg._avg.rating ?? 0, totalReviews: agg._count.id } });
      return updated;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.db.review.findUnique({ where: { id: input.id } });
      if (!review) throw new TRPCError({ code: "NOT_FOUND" });
      if (review.userId !== ctx.session.user.id) throw new TRPCError({ code: "FORBIDDEN" });
      await ctx.db.review.delete({ where: { id: input.id } });
      const agg = await ctx.db.review.aggregate({ where: { courseId: review.courseId }, _avg: { rating: true }, _count: { id: true } });
      await ctx.db.course.update({ where: { id: review.courseId }, data: { averageRating: agg._avg.rating ?? 0, totalReviews: agg._count.id } });
      return { success: true };
    }),

  getByCourse: publicProcedure
    .input(z.object({
      courseId: z.string(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(50).default(10),
    }))
    .query(async ({ ctx, input }) => {
      const skip = (input.page - 1) * input.limit;
      const [reviews, total, agg] = await Promise.all([
        ctx.db.review.findMany({
          where: { courseId: input.courseId },
          orderBy: { createdAt: "desc" },
          skip,
          take: input.limit,
          include: { user: { select: { name: true, image: true } } },
        }),
        ctx.db.review.count({ where: { courseId: input.courseId } }),
        ctx.db.review.groupBy({ by: ["rating"], where: { courseId: input.courseId }, _count: { rating: true } }),
      ]);

      const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      agg.forEach((a) => { distribution[a.rating] = a._count.rating; });

      const avgAgg = await ctx.db.review.aggregate({ where: { courseId: input.courseId }, _avg: { rating: true } });

      return {
        reviews,
        total,
        pages: Math.ceil(total / input.limit),
        averageRating: avgAgg._avg.rating ?? 0,
        distribution,
      };
    }),
});
