// GET /api/cron/live-reminders
// Daily cron — sends "your live class is coming up" reminder emails to RSVP'd
// users for any session happening in the next ~28 hours.
//
// Why daily (not every 15 min): Vercel's Hobby plan only allows one cron run
// per day. A single daily run still reliably reaches every learner the day
// before their session. Teams on Vercel Pro (or an external scheduler such as
// cron-job.org / GitHub Actions) can call this endpoint more frequently — the
// dedup logic below makes repeated calls safe, and passing `?window=30m` lets
// a finer-grained scheduler also send 30-minute reminders.
//
// Triggered by Vercel Cron (vercel.json) or any scheduler that hits this URL
// with the `Authorization: Bearer ${CRON_SECRET}` header.

import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendLiveClassReminder } from "@/server/services/email";

type ReminderKind = "day" | "30m";

// Look-ahead windows per reminder kind:
//  • "day"  — catches sessions in the next 28 h (daily cron, day-before nudge)
//  • "30m"  — catches sessions ~30 min out (needs a sub-hourly scheduler)
const WINDOWS: Record<ReminderKind, { lookAheadMs: number; floorMs: number }> = {
  day: { lookAheadMs: 28 * 60 * 60 * 1000, floorMs: 0 },
  "30m": { lookAheadMs: 35 * 60 * 1000, floorMs: 20 * 60 * 1000 },
};

function dedupTag(kind: ReminderKind, liveClassId: string) {
  return `[remind:${kind}:${liveClassId}]`;
}

async function sendRemindersForKind(kind: ReminderKind) {
  const now = Date.now();
  const { lookAheadMs, floorMs } = WINDOWS[kind];
  const windowStart = new Date(now + floorMs);
  const windowEnd = new Date(now + lookAheadMs);

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
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
    const joinUrl =
      session.meetingUrl ?? `${process.env.NEXT_PUBLIC_APP_URL ?? "https://learnai.in"}/live`;

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
        await sendLiveClassReminder(
          rsvp.user.email,
          rsvp.user.name ?? "Learner",
          session.title,
          dateStr,
          joinUrl,
        );
        sent++;
      } catch (err) {
        console.error(`[cron] reminder send failed for ${rsvp.user.email}:`, err);
      }

      // Record dedup notification
      await db.notification.create({
        data: {
          userId: rsvp.userId,
          type: "LIVE_SESSION_REMINDER",
          title: kind === "day" ? "📅 Your live class is coming up" : "🔴 Live class starts soon",
          message: `${tag} "${session.title}" — ${dateStr}`,
          link: "/live",
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

  // Allow a finer-grained external scheduler to request the 30-minute window
  // via ?window=30m. The default (Vercel daily cron) sends day-before nudges.
  const windowParam = req.nextUrl.searchParams.get("window");
  const kinds: ReminderKind[] = windowParam === "30m" ? ["30m"] : ["day"];

  try {
    const results = await Promise.all(kinds.map((k) => sendRemindersForKind(k)));
    return NextResponse.json({ ok: true, results });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[cron] live-reminders failed:", err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
