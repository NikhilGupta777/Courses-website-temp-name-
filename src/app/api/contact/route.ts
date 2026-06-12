// POST /api/contact
// Receives the contact form submission and sends it via email.
// FIX: rate-limited per IP and honeypot-protected to prevent spam.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ContactSchema = z.object({
  name:    z.string().min(2).max(100),
  email:   z.string().email(),
  reason:  z.string().min(1).max(100),
  message: z.string().min(10).max(2000),
  // Honeypot: hidden field bots fill in but humans don't
  website: z.string().optional(),
});

// ─── Simple in-memory rate limiter (5 submissions per IP per 10 minutes) ────
// For multi-region/serverless deployments, swap with Upstash/Redis. Single
// region serverless is fine for a contact form — abuse just gets dropped.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const submissions = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (submissions.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    submissions.set(ip, recent);
    return true;
  }
  recent.push(now);
  submissions.set(ip, recent);
  return false;
}

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please wait a few minutes and try again." },
        { status: 429 }
      );
    }

    const body   = await req.json();
    const parsed = ContactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { name, email, reason, message, website } = parsed.data;

    // Honeypot tripped — silently accept (bots think they succeeded)
    if (website && website.trim().length > 0) {
      console.warn(`[Contact] Honeypot triggered from ${ip}`);
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Escape for safe interpolation into email HTML
    const safe = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

    if (process.env.RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "LearnAI Contact Form <noreply@learnai.in>",
          to:   "support@learnai.in",
          replyTo: email,
          subject: `[Contact] ${reason} — from ${name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <table style="border-collapse: collapse; width: 100%;">
              <tr><td style="padding: 8px; font-weight: bold; border: 1px solid #e5e7eb;">Name</td><td style="padding: 8px; border: 1px solid #e5e7eb;">${safe(name)}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold; border: 1px solid #e5e7eb;">Email</td><td style="padding: 8px; border: 1px solid #e5e7eb;">${safe(email)}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold; border: 1px solid #e5e7eb;">Reason</td><td style="padding: 8px; border: 1px solid #e5e7eb;">${safe(reason)}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold; border: 1px solid #e5e7eb; vertical-align: top;">Message</td><td style="padding: 8px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${safe(message)}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold; border: 1px solid #e5e7eb;">Source IP</td><td style="padding: 8px; border: 1px solid #e5e7eb; font-family: monospace; font-size: 12px;">${safe(ip)}</td></tr>
            </table>
          `,
        }),
      });
    } else {
      // Log to console in development if Resend is not configured
      console.log("[Contact Form]", { name, email, reason, message });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }
}
