import { z } from "zod";
import { TRPCError } from "@trpc/server";
import type { Prisma } from "@prisma/client";
import { router, publicProcedure, instructorProcedure } from "@/lib/trpc/server";
import { nanoid } from "nanoid";
import { slugify } from "@/lib/utils";

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

  // Get course by ID (for editor)
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.course.findUnique({
        where: { id: input.id },
        include: {
          instructor: { include: { user: { select: { name: true, image: true } } } },
          category: true,
          modules: {
            orderBy: { position: "asc" },
            include: {
              lessons: { orderBy: { position: "asc" } },
            },
          },
        },
      });
    }),

  // Create a new course draft (instructor)
  create: instructorProcedure
    .input(z.object({
      title: z.string().min(3),
      subtitle: z.string().optional(),
      description: z.string().min(10),
      categoryId: z.string().optional(),
      level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]).default("BEGINNER"),
      deliveryMode: z.enum(["LIVE_ONLINE", "OFFLINE_WORKSHOP", "PRE_RECORDED", "HYBRID"]).default("PRE_RECORDED"),
      price: z.number().optional(),
      originalPrice: z.number().optional(),
      isFree: z.boolean().default(false),
      tags: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      let profile = await ctx.db.instructorProfile.findUnique({ where: { userId: ctx.session.user.id } });
      if (!profile) {
        const user = await ctx.db.user.findUnique({ where: { id: ctx.session.user.id }, select: { name: true } });
        profile = await ctx.db.instructorProfile.create({
          data: { userId: ctx.session.user.id, displayName: user?.name ?? "Instructor", bio: "", expertise: [] },
        });
      }

      const baseSlug = slugify(input.title);
      const slug = `${baseSlug}-${nanoid(6)}`;

      return ctx.db.course.create({
        data: {
          title: input.title,
          subtitle: input.subtitle,
          description: input.description,
          slug,
          categoryId: input.categoryId,
          level: input.level,
          deliveryMode: input.deliveryMode,
          price: input.isFree ? 0 : (input.price ?? null),
          originalPrice: input.originalPrice ?? null,
          isFree: input.isFree,
          tags: input.tags ?? [],
          status: "DRAFT",
          instructorId: profile.id,
        },
      });
    }),

  // Update an existing course (instructor)
  update: instructorProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      subtitle: z.string().optional(),
      description: z.string().optional(),
      categoryId: z.string().optional(),
      level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]).optional(),
      deliveryMode: z.enum(["LIVE_ONLINE", "OFFLINE_WORKSHOP", "PRE_RECORDED", "HYBRID"]).optional(),
      price: z.number().optional(),
      originalPrice: z.number().optional(),
      isFree: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      tags: z.array(z.string()).optional(),
      learningOutcomes: z.array(z.string()).optional(),
      prerequisites: z.array(z.string()).optional(),
      thumbnail: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.db.instructorProfile.findUnique({ where: { userId: ctx.session.user.id } });
      if (!profile) throw new TRPCError({ code: "NOT_FOUND" });
      const course = await ctx.db.course.findUnique({ where: { id: input.id } });
      if (!course) throw new TRPCError({ code: "NOT_FOUND" });
      if (course.instructorId !== profile.id) throw new TRPCError({ code: "FORBIDDEN" });
      const { id, ...data } = input;
      return ctx.db.course.update({ where: { id }, data });
    }),

  // Submit for review (instructor)
  publish: instructorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.db.instructorProfile.findUnique({ where: { userId: ctx.session.user.id } });
      if (!profile) throw new TRPCError({ code: "NOT_FOUND" });
      const course = await ctx.db.course.findUnique({ where: { id: input.id } });
      if (!course) throw new TRPCError({ code: "NOT_FOUND" });
      if (course.instructorId !== profile.id) throw new TRPCError({ code: "FORBIDDEN" });
      return ctx.db.course.update({ where: { id: input.id }, data: { status: "UNDER_REVIEW" } });
    }),

  // Delete course (instructor)
  delete: instructorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.db.instructorProfile.findUnique({ where: { userId: ctx.session.user.id } });
      if (!profile) throw new TRPCError({ code: "NOT_FOUND" });
      const course = await ctx.db.course.findUnique({ where: { id: input.id } });
      if (!course) throw new TRPCError({ code: "NOT_FOUND" });
      if (course.instructorId !== profile.id) throw new TRPCError({ code: "FORBIDDEN" });
      return ctx.db.course.delete({ where: { id: input.id } });
    }),

  // Get courses for instructor
  getForInstructor: instructorProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db.instructorProfile.findUnique({ where: { userId: ctx.session.user.id } });
    if (!profile) throw new TRPCError({ code: "NOT_FOUND" });
    return ctx.db.course.findMany({
      where: { instructorId: profile.id },
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { name: true } },
        _count: { select: { enrollments: true } },
        modules: {
          include: { _count: { select: { lessons: true } } },
        },
      },
    });
  }),
});
