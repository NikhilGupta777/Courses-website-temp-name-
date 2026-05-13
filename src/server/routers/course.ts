import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { router, publicProcedure } from "@/lib/trpc/server";

export const courseRouter = router({
  // Get all published courses with filters
  getAll: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(12),
        category: z.string().optional(),
        level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]).optional(),
        deliveryMode: z.enum(["LIVE_ONLINE", "OFFLINE_WORKSHOP", "PRE_RECORDED", "HYBRID"]).optional(),
        isFree: z.boolean().optional(),
        sortBy: z.enum(["popular", "newest", "rating", "price_low", "price_high"]).default("popular"),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 12;
      const skip = (page - 1) * limit;

      const where: Prisma.CourseWhereInput = { status: "PUBLISHED" };

      if (input?.category) where.category = { slug: input.category };
      if (input?.level) where.level = input.level;
      if (input?.deliveryMode) where.deliveryMode = input.deliveryMode;
      if (input?.isFree !== undefined) where.isFree = input.isFree;
      if (input?.search) {
        where.OR = [
          { title: { contains: input.search, mode: "insensitive" } },
          { description: { contains: input.search, mode: "insensitive" } },
        ];
      }

      const orderBy: Prisma.CourseOrderByWithRelationInput = (() => {
        switch (input?.sortBy) {
          case "newest": return { createdAt: "desc" };
          case "rating": return { averageRating: "desc" };
          case "price_low": return { price: "asc" };
          case "price_high": return { price: "desc" };
          default: return { totalStudents: "desc" };
        }
      })();

      const [courses, total] = await Promise.all([
        ctx.db.course.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          include: {
            instructor: { select: { displayName: true, userId: true } },
            category: { select: { name: true, slug: true } },
          },
        }),
        ctx.db.course.count({ where }),
      ]);

      return {
        courses,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      };
    }),

  // Get single course by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const course = await ctx.db.course.findUnique({
        where: { slug: input.slug },
        include: {
          instructor: {
            include: { user: { select: { name: true, image: true } } },
          },
          category: true,
          modules: {
            orderBy: { position: "asc" },
            include: {
              lessons: {
                orderBy: { position: "asc" },
                select: {
                  id: true,
                  title: true,
                  type: true,
                  duration: true,
                  isFree: true,
                },
              },
            },
          },
          reviews: {
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { name: true, image: true } } },
          },
        },
      });

      return course;
    }),

  // Get featured courses for homepage
  getFeatured: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.course.findMany({
      where: { status: "PUBLISHED", isFeatured: true },
      take: 6,
      orderBy: { totalStudents: "desc" },
      include: {
        instructor: { select: { displayName: true } },
        category: { select: { name: true, slug: true } },
      },
    });
  }),

  // Get all categories
  getCategories: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.category.findMany({
      where: { parentId: null },
      include: { children: true, _count: { select: { courses: true } } },
    });
  }),
});
