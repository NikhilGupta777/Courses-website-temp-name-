import { z } from "zod";
import { router, protectedProcedure } from "@/lib/trpc/server";

const notifPrefsSchema = z.object({
  liveClassReminders:   z.boolean().default(true),
  newCourseLaunches:    z.boolean().default(true),
  quizResults:          z.boolean().default(true),
  certificateIssued:    z.boolean().default(true),
  promotionalOffers:    z.boolean().default(false),
  weeklyProgressReport: z.boolean().default(false),
});

export type NotificationPrefs = z.infer<typeof notifPrefsSchema>;

const DEFAULT_PREFS: NotificationPrefs = {
  liveClassReminders:   true,
  newCourseLaunches:    true,
  quizResults:          true,
  certificateIssued:    true,
  promotionalOffers:    false,
  weeklyProgressReport: false,
};

export const userRouter = router({
  // ─── Get current user profile ───────────────────────────────────────────────
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
        notificationPrefs: true,
      },
    });
  }),

  // ─── Update profile fields ──────────────────────────────────────────────────
  updateProfile: protectedProcedure
    .input(z.object({
      name:     z.string().min(2).optional(),
      bio:      z.string().max(500).optional(),
      headline: z.string().max(100).optional(),
      image:    z.string().url().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: input,
        select: { id: true, name: true, bio: true, headline: true, image: true, email: true },
      });
    }),

  // ─── Dashboard data ─────────────────────────────────────────────────────────
  getDashboard: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Pull the last 60 days of completed lessons in a single query so we can
    // compute a real "current day streak" instead of a hardcoded number.
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const [enrollments, certificates, recentQuizzes, totalEnrolledCount, recentCompletions] = await Promise.all([
      ctx.db.enrollment.findMany({
        where: { userId },
        include: {
          course: {
            select: { id: true, title: true, slug: true, thumbnail: true, duration: true },
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
      ctx.db.enrollment.count({ where: { userId } }),
      ctx.db.lessonProgress.findMany({
        where: {
          userId,
          isCompleted: true,
          completedAt: { gte: sixtyDaysAgo, not: null },
        },
        select: { completedAt: true },
        orderBy: { completedAt: "desc" },
      }),
    ]);

    // ── Streak calculation ─────────────────────────────────────────────────
    // A "day" is any day on which at least one lesson was completed.
    // Streak = consecutive days ending today (or yesterday — counts as
    // active so users don't lose their streak before they log in).
    const completionDays = new Set<string>();
    for (const c of recentCompletions) {
      if (c.completedAt) {
        completionDays.add(c.completedAt.toISOString().slice(0, 10));
      }
    }

    let dayStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = today.toISOString().slice(0, 10);
    const yesterdayKey = new Date(today.getTime() - 86_400_000).toISOString().slice(0, 10);

    if (completionDays.has(todayKey) || completionDays.has(yesterdayKey)) {
      // Walk back day by day until we hit a gap
      const cursor = new Date(today);
      // If they haven't completed anything today, start counting from yesterday
      if (!completionDays.has(todayKey)) cursor.setDate(cursor.getDate() - 1);
      while (completionDays.has(cursor.toISOString().slice(0, 10))) {
        dayStreak++;
        cursor.setDate(cursor.getDate() - 1);
      }
    }

    return {
      enrollments,
      certificates,
      recentQuizzes,
      stats: {
        totalEnrolled:     totalEnrolledCount,
        totalCertificates: certificates.length,
        dayStreak,
      },
    };
  }),

  // ─── Get notification preferences ───────────────────────────────────────────
  getNotificationPrefs: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { notificationPrefs: true },
    });
    if (!user?.notificationPrefs) return DEFAULT_PREFS;
    try {
      return notifPrefsSchema.parse(user.notificationPrefs);
    } catch {
      return DEFAULT_PREFS;
    }
  }),

  // ─── Save notification preferences ─────────────────────────────────────────
  saveNotificationPrefs: protectedProcedure
    .input(notifPrefsSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { notificationPrefs: input },
      });
      return { saved: true };
    }),

  // FIX BUG #3: real deleteAccount mutation
  deleteAccount: protectedProcedure
    .input(z.object({ confirmation: z.literal("DELETE MY ACCOUNT") }))
    .mutation(async ({ ctx }) => {
      const userId = ctx.session.user.id;

      // Cascade delete: Prisma handles related records via onDelete: Cascade on FK
      // We explicitly cancel Stripe subscriptions before deleting the user
      const subscriptions = await ctx.db.subscription.findMany({
        where: { userId, status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] } },
        select: { stripeSubscriptionId: true },
      });

      // Best-effort Stripe cancellation (don't block account deletion on failure)
      if (process.env.STRIPE_SECRET_KEY && subscriptions.length > 0) {
        try {
          const { stripe } = await import("@/lib/stripe");
          await Promise.allSettled(
            subscriptions
              .filter((s) => s.stripeSubscriptionId)
              .map((s) => stripe.subscriptions.cancel(s.stripeSubscriptionId!))
          );
        } catch (err) {
          console.error("Failed to cancel Stripe subscriptions on account delete:", err);
        }
      }

      // Hard delete — cascade removes sessions, accounts, enrollments, progress, etc.
      await ctx.db.user.delete({ where: { id: userId } });

      return { deleted: true };
    }),
});
