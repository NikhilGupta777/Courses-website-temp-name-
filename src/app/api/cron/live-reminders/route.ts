// GET /api/cron/live-reminders
// Vercel Cron job — runs every 15 min to send reminder emails to RSVP'd users.
// Two reminders per session: 24h before (T-24h) and 30 min before (T-30m).
//
// Triggered by Vercel Cron (vercel.json) or any scheduler that hits this URL
// with the `Authorization: Bearer ${CRON_SECRET}` header.

import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendLiveClassReminder } from "@/server/services/email";

type ReminderKind = "24h" | "30m";

// Two reminder windows. Each window is +/- 7 minutes wide so a 15-min cron
// catches every session exactly twice. We use the LiveClass.metadata is not
// available, so we rely on the absence of duplicate-notification tracking
// in the DB. To stay idempotent, we record the reminder as a Notification
// row with a deterministic dedup key (we re-use Notification.message field
// to encode `[remind:24h:{id}]` and skip if it already exists).
const WINDOW_MS = 7.5 * 60 * 1000; // 7.5 minutes either side of target

function dedupTag(kind: ReminderKind, liveClassId: string) {
  return `[remind:${kind}:${liveClassId}]`;
}

async function sendRemindersForKind(kind: ReminderKind) {
  const now = Date.now();
  const offsetMs = kind === "24h" ? 24 * 60 * 60 * 1000 : 30 * 60 * 1000;
  const targetTime = new Date(now + offsetMs);
  const windowStart = new Date(targetTime.getTime() - WINDOW_MS);
  const windowEnd   = new Date(targetTime.getTime() + WINDOW_MS);

  const sessions = await db.liveClass.findMany({
    where: {
      status: "SCHEDULED",
      scheduledAt: { gte: windowStart, lte: windowEnd },
    },
    include: {
      rsvps: {
        include: {
          user: { select: { id: true, email: true, name: true, notificationPrefs: true } },
        },
      },
    },
  });

  let sent = 0;
  for (const session of sessions) {
    const tag = dedupTag(kind, session.id);
    const dateStr = session.scheduledAt.toLocaleString("en-IN", {
      weekday: "short",
      day:     "numeric",
      month:   "long",
      hour:    "2-digit",
      minute:  "2-digit",
    });
    const joinUrl = session.meetingUrl
      ?? `${process.env.NEXT_PUBLIC_APP_URL ?? "https://learnai.in"}/live`;

    for (const rsvp of session.rsvps) {
      if (!rsvp.user.email) continue;

      // Respect user notification preference
      const prefs = rsvp.user.notificationPrefs as { liveClassReminders?: boolean } | null;
      if (prefs && prefs.liveClassReminders === false) continue;

      // Idempotency: skip if we already sent this exact reminder
      const existing = await db.notification.findFirst({
        where: { userId: rsvp.userId, message: { contains: tag } },
        select: { id: true },
      });
      if (existing) continue;

      try {
        await sendLiveClassReminder(rsvp.user.email, rsvp.user.name ?? "Learner", session.title, dateStr, joinUrl);
        sent++;
      } catch (err) {
        console.error(`[cron] reminder send failed for ${rsvp.user.email}:`, err);
      }

      // Record dedup notification
      await db.notification.create({
        data: {
          userId:  rsvp.userId,
          type:    "LIVE_SESSION_REMINDER",
          title:   kind === "24h" ? "📅 Live class tomorrow" : "🔴 Live class starts in 30 minutes",
          message: `${tag} "${session.title}" — ${dateStr}`,
          link:    "/live",
        },
      });
    }
  }

  return { kind, sent, sessionsExamined: sessions.length };
}

export async function GET(req: NextRequest) {
  // Auth: require either Vercel Cron secret or a manual CRON_SECRET match
  const auth = req.headers.get("authorization") ?? "";
  const expected = process.env.CRON_SECRET;

  // Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}` automatically.
  if (expected && auth !== `Bearer ${expected}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const [r24, r30] = await Promise.all([
      sendRemindersForKind("24h"),
      sendRemindersForKind("30m"),
    ]);
    return NextResponse.json({ ok: true, results: [r24, r30] });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[cron] live-reminders failed:", err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
