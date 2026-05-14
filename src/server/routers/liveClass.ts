import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure, instructorProcedure } from "@/lib/trpc/server";

export const liveClassRouter = router({
  // ── Public: upcoming live classes (scheduled + live, next 10) ────────────
  getUpcoming: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.liveClass.findMany({
      where: {
        scheduledAt: { gte: new Date() },
        status: { in: ["SCHEDULED", "LIVE"] },
      },
      orderBy: { scheduledAt: "asc" },
      take: 10,
      include: {
        instructor: { select: { displayName: true } },
        _count: { select: { rsvps: true } },
      },
    });
  }),

  // ── Public: paginated list with optional status filter ───────────────────
  getAll: publicProcedure
    .input(z.object({
      page:   z.number().int().min(1).default(1),
      limit:  z.number().int().min(1).max(50).default(10),
      status: z.enum(["SCHEDULED", "LIVE", "COMPLETED", "CANCELLED"]).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { page, limit, status } = input;
      const skip = (page - 1) * limit;

      const where = status ? { status } : {};

      const [total, items] = await Promise.all([
        ctx.db.liveClass.count({ where }),
        ctx.db.liveClass.findMany({
          where,
          skip,
          take: limit,
          orderBy: { scheduledAt: "asc" },
          include: {
            instructor: { select: { displayName: true } },
            _count: { select: { rsvps: true } },
          },
        }),
      ]);

      return {
        items,
        total,
        pages: Math.ceil(total / limit),
        page,
      };
    }),

  // ── Public: single live class by ID ──────────────────────────────────────
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const liveClass = await ctx.db.liveClass.findUnique({
        where: { id: input.id },
        include: {
          instructor: { select: { displayName: true, bio: true } },
          _count: { select: { rsvps: true } },
        },
      });
      if (!liveClass) throw new TRPCError({ code: "NOT_FOUND", message: "Live class not found" });
      return liveClass;
    }),

  // ── Instructor: create a new live class ──────────────────────────────────
  create: instructorProcedure
    .input(z.object({
      title:        z.string().min(1),
      description:  z.string().optional(),
      topic:        z.string().optional(),
      platform:     z.string().optional().default("Zoom"),
      meetingUrl:   z.string().url().optional().or(z.literal("")),
      scheduledAt:  z.string(), // ISO date string
      durationMins: z.number().int().min(15).max(480).optional().default(90),
      maxSeats:     z.number().int().min(1).max(10000).optional().default(500),
      isProOnly:    z.boolean().optional().default(true),
    }))
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.db.instructorProfile.findUnique({
        where: { userId: ctx.session.user.id },
      });
      if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "Instructor profile not found" });

      return ctx.db.liveClass.create({
        data: {
          title:        input.title,
          description:  input.description,
          topic:        input.topic,
          platform:     input.platform ?? "Zoom",
          meetingUrl:   input.meetingUrl || null,
          scheduledAt:  new Date(input.scheduledAt),
          durationMins: input.durationMins ?? 90,
          maxSeats:     input.maxSeats ?? 500,
          isProOnly:    input.isProOnly ?? true,
          instructorId: profile.id,
          status:       "SCHEDULED",
        },
      });
    }),

  // ── Instructor: update a live class ──────────────────────────────────────
  update: instructorProcedure
    .input(z.object({
      id:           z.string(),
      title:        z.string().min(1).optional(),
      description:  z.string().optional(),
      topic:        z.string().optional(),
      platform:     z.string().optional(),
      meetingUrl:   z.string().url().optional().or(z.literal("")).optional(),
      scheduledAt:  z.string().optional(),
      durationMins: z.number().int().min(15).max(480).optional(),
      status:       z.enum(["SCHEDULED", "LIVE", "COMPLETED", "CANCELLED"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.db.instructorProfile.findUnique({
        where: { userId: ctx.session.user.id },
      });
      if (!profile) throw new TRPCError({ code: "NOT_FOUND" });

      const existing = await ctx.db.liveClass.findUnique({ where: { id: input.id } });
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Live class not found" });
      if (existing.instructorId !== profile.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You do not own this live class" });
      }

      const { id, scheduledAt, meetingUrl, ...rest } = input;

      return ctx.db.liveClass.update({
        where: { id },
        data: {
          ...rest,
          ...(scheduledAt ? { scheduledAt: new Date(scheduledAt) } : {}),
          ...(meetingUrl !== undefined ? { meetingUrl: meetingUrl || null } : {}),
        },
      });
    }),

  // ── Protected: RSVP to a live class ──────────────────────────────────────
  rsvp: protectedProcedure
    .input(z.object({ liveClassId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const liveClass = await ctx.db.liveClass.findUnique({
        where: { id: input.liveClassId },
        select: { id: true, title: true, scheduledAt: true, status: true },
      });
      if (!liveClass) throw new TRPCError({ code: "NOT_FOUND", message: "Live class not found" });
      if (liveClass.status === "CANCELLED") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "This session has been cancelled" });
      }

      const rsvp = await ctx.db.liveClassRsvp.upsert({
        where: { userId_liveClassId: { userId, liveClassId: input.liveClassId } },
        create: { userId, liveClassId: input.liveClassId },
        update: {},
      });

      // Create in-app reminder notification
      await ctx.db.notification.create({
        data: {
          userId,
          type:    "LIVE_SESSION_REMINDER",
          title:   "📅 Live Class RSVP Confirmed",
          message: `You're registered for "${liveClass.title}" on ${new Date(liveClass.scheduledAt).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}.`,
          link:    `/live`,
        },
      });

      return rsvp;
    }),

  // ── Protected: cancel RSVP ────────────────────────────────────────────────
  cancelRsvp: protectedProcedure
    .input(z.object({ liveClassId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      await ctx.db.liveClassRsvp.deleteMany({
        where: { userId, liveClassId: input.liveClassId },
      });
      return { cancelled: true };
    }),

  // ── Protected: get current user's RSVPs ──────────────────────────────────
  getMyRsvps: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.liveClassRsvp.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        liveClass: {
          include: {
            instructor: { select: { displayName: true } },
            _count: { select: { rsvps: true } },
          },
        },
      },
      orderBy: { liveClass: { scheduledAt: "asc" } },
    });
  }),

  // ── Instructor: get all live classes for this instructor ──────────────────
  getInstructorClasses: instructorProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db.instructorProfile.findUnique({
      where: { userId: ctx.session.user.id },
    });
    if (!profile) throw new TRPCError({ code: "NOT_FOUND" });

    return ctx.db.liveClass.findMany({
      where: { instructorId: profile.id },
      orderBy: { scheduledAt: "desc" },
      include: {
        _count: { select: { rsvps: true } },
      },
    });
  }),
});
