import { z } from "zod";
import { router, adminProcedure } from "@/lib/trpc/server";
import type { Prisma } from "@prisma/client";

export const adminRouter = router({
  getStats: adminProcedure.query(async ({ ctx }) => {
    const [totalUsers, totalCourses, totalEnrollments, payments, recentUsers, recentPayments] = await Promise.all([
      ctx.db.user.count(),
      ctx.db.course.count(),
      ctx.db.enrollment.count(),
      ctx.db.payment.findMany({ where: { status: "COMPLETED" }, select: { amount: true } }),
      ctx.db.user.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, email: true, role: true, createdAt: true, image: true } }),
      ctx.db.payment.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { user: { select: { name: true, email: true } } } }),
    ]);
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    return { totalUsers, totalCourses, totalEnrollments, totalRevenue, recentUsers, recentPayments };
  }),

  getUsers: adminProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().default(20),
      search: z.string().optional(),
      role: z.enum(["STUDENT", "INSTRUCTOR", "ADMIN"]).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const skip = (input.page - 1) * input.limit;
      const where: Prisma.UserWhereInput = {};
      if (input.search) {
        where.OR = [
          { name: { contains: input.search, mode: "insensitive" } },
          { email: { contains: input.search, mode: "insensitive" } },
        ];
      }
      if (input.role) where.role = input.role;
      const [users, total] = await Promise.all([
        ctx.db.user.findMany({
          where,
          skip,
          take: input.limit,
          orderBy: { createdAt: "desc" },
          select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true, image: true, _count: { select: { enrollments: true } } },
        }),
        ctx.db.user.count({ where }),
      ]);
      return { users, total, pages: Math.ceil(total / input.limit), currentPage: input.page };
    }),

  updateUser: adminProcedure
    .input(z.object({
      id: z.string(),
      role: z.enum(["STUDENT", "INSTRUCTOR", "ADMIN"]).optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.user.update({ where: { id }, data });
    }),

  getCourses: adminProcedure
    .input(z.object({ status: z.enum(["DRAFT", "UNDER_REVIEW", "PUBLISHED", "ARCHIVED"]).optional() }))
    .query(async ({ ctx, input }) => {
      const where: Prisma.CourseWhereInput = {};
      if (input.status) where.status = input.status;
      return ctx.db.course.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          instructor: { select: { displayName: true, user: { select: { name: true, email: true } } } },
          category: { select: { name: true } },
          _count: { select: { enrollments: true, reviews: true } },
        },
      });
    }),

  updateCourseStatus: adminProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(["PUBLISHED", "UNDER_REVIEW", "DRAFT", "ARCHIVED"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const course = await ctx.db.course.update({
        where: { id: input.id },
        data: {
          status: input.status,
          ...(input.status === "PUBLISHED" ? { publishedAt: new Date() } : {}),
        },
        include: { instructor: { select: { userId: true, displayName: true } } },
      });

      const notifTitle = input.status === "PUBLISHED" ? "Course Approved! 🎉" : input.status === "ARCHIVED" ? "Course Archived" : "Course Status Updated";
      const notifMsg = input.status === "PUBLISHED"
        ? `Your course "${course.title}" has been approved and is now live!`
        : `Your course "${course.title}" status has been updated to ${input.status}.`;

      await ctx.db.notification.create({
        data: {
          userId: course.instructor.userId,
          type: "COURSE_UPDATE",
          title: notifTitle,
          message: notifMsg,
          link: `/studio/courses/${course.id}`,
        },
      });

      return course;
    }),

  getRevenue: adminProcedure.query(async ({ ctx }) => {
    const payments = await ctx.db.payment.findMany({
      where: { status: "COMPLETED" },
      orderBy: { createdAt: "asc" },
      select: { amount: true, createdAt: true, type: true },
    });

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    const monthMap = new Map<string, number>();
    payments.forEach((p) => {
      const key = `${p.createdAt.getFullYear()}-${String(p.createdAt.getMonth() + 1).padStart(2, "0")}`;
      monthMap.set(key, (monthMap.get(key) ?? 0) + p.amount);
    });

    const paymentsByMonth = Array.from(monthMap.entries()).map(([month, revenue]) => ({ month, revenue }));

    const subscriptions = await ctx.db.subscription.groupBy({
      by: ["plan"],
      _count: { plan: true },
    });

    const planBreakdown = subscriptions.map((s) => ({
      plan: s.plan,
      count: s._count.plan,
    }));

    const mrr = paymentsByMonth.length > 0 ? paymentsByMonth[paymentsByMonth.length - 1]?.revenue ?? 0 : 0;

    return { mrr, totalRevenue, paymentsByMonth, planBreakdown };
  }),
});
