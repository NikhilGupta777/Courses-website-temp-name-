import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { escapeHtml } from "@/lib/security";
import crypto from "crypto";

const Schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
    const { email } = parsed.data;

    // ─── Fix #4: DB-backed rate limit ────────────────────────────────────────
    // The original module-level Map is per-serverless-instance, so it is trivially
    // bypassed on multi-instance / Vercel deployments.  We now store attempt counts
    // in the DB using the VerificationToken table (keyed by "ratelimit:<email>") so
    // the limit is enforced across all instances.
    const RATE_KEY    = `ratelimit:${email}`;
    const RATE_WINDOW = 15 * 60 * 1000;  // 15 minutes in ms
    const MAX_ATTEMPTS = 3;

    const existing = await db.verificationToken.findFirst({
      where: { identifier: RATE_KEY },
    });

    if (existing) {
      const isExpired = existing.expires < new Date();
      if (isExpired) {
        // Window has passed — delete stale record so we start fresh
        await db.verificationToken.deleteMany({ where: { identifier: RATE_KEY } });
      } else {
        // Count attempts encoded in the token field as a numeric string
        const count = parseInt(existing.token, 10) || 0;
        if (count >= MAX_ATTEMPTS) {
          return NextResponse.json(
            { error: "Too many requests. Please wait 15 minutes before trying again." },
            { status: 429 }
          );
        }
        // Increment counter
        await db.verificationToken.update({
          where: { identifier_token: { identifier: RATE_KEY, token: existing.token } },
          data: { token: String(count + 1) },
        });
      }
    } else {
      // First attempt in this window
      await db.verificationToken.create({
        data: {
          identifier: RATE_KEY,
          token:     "1",
          expires:   new Date(Date.now() + RATE_WINDOW),
        },
      });
    }

    // Look up user — always return 200 to prevent email enumeration
    const user = await db.user.findUnique({
      where:  { email },
      select: { id: true, name: true },
    });

    if (user) {
      // ─── Fix #6: delete ALL existing tokens for this email before creating ──
      // The original code used upsert with a freshly generated random token, so
      // the where clause could never match — it was effectively always a create.
      // This left multiple valid tokens in the DB simultaneously.  We now delete
      // all prior tokens for the identifier first, then do a single create so
      // only the newest token is ever valid.
      await db.verificationToken.deleteMany({
        where: { identifier: email },
      });

      const token   = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await db.verificationToken.create({
        data: { identifier: email, token, expires },
      });

      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://learnai.in"}/reset-password?token=${token}`;
      const greetingName = escapeHtml(user.name ?? "there");

      // ─── Fix #5: check Resend response status ─────────────────────────────
      // The original code awaited the fetch but never inspected res.ok, so a
      // failed send (invalid key, unverified domain, rate limit, etc.) would
      // silently succeed from the user's perspective.
      if (process.env.RESEND_API_KEY) {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method:  "POST",
          headers: {
            Authorization:  `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from:    "LearnAI <noreply@learnai.in>",
            to:      email,
            subject: "Reset your LearnAI password",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg,#7c3aed,#4f46e5); padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 22px;">Reset your password</h1>
                </div>
                <div style="background: #fff; padding: 32px; border-radius: 0 0 16px 16px; border: 1px solid #e5e7eb;">
                  <p style="color: #374151; margin: 0 0 16px;">Hi ${greetingName},</p>
                  <p style="color: #6b7280; margin: 0 0 24px;">Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
                  <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg,#7c3aed,#4f46e5); color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold;">Reset Password</a>
                  <p style="color: #9ca3af; font-size: 12px; margin: 24px 0 0;">If you did not request this, you can safely ignore this email.</p>
                </div>
              </div>
            `,
          }),
        });

        if (!emailRes.ok) {
          // Log for observability but do NOT leak the error to the client
          // (that would allow email enumeration via error-vs-success responses).
          const errBody = await emailRes.text().catch(() => "(unreadable)");
          console.error(
            `[forgot-password] Resend returned ${emailRes.status} for ${email}:`,
            errBody
          );
        }
      } else {
        // Development: log the URL so the developer can test without Resend
        console.log("[Password Reset URL]", resetUrl);
      }
    }

    // Always return 200 regardless of whether the email was found
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
