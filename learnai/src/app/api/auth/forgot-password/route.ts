import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import crypto from "crypto";

const Schema = z.object({ email: z.string().email() });

// In-memory rate limit: 3 attempts per email per 15 min
const emailLimits = new Map<string, { count: number; resetAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
    const { email } = parsed.data;

    // Rate limit per email
    const now = Date.now();
    const limit = emailLimits.get(email);
    if (limit && now < limit.resetAt && limit.count >= 3) {
      return NextResponse.json(
        { error: "Too many requests. Please wait 15 minutes before trying again." },
        { status: 429 }
      );
    }
    emailLimits.set(email, {
      count: (limit && now < limit.resetAt ? limit.count : 0) + 1,
      resetAt: limit && now < limit.resetAt ? limit.resetAt : now + 15 * 60 * 1000,
    });

    // Look up user — always return success to prevent email enumeration
    const user = await db.user.findUnique({ where: { email }, select: { id: true, name: true } });

    if (user) {
      // Generate a secure random token
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store in VerificationToken (reusing Auth.js table)
      await db.verificationToken.upsert({
        where: { identifier_token: { identifier: email, token } },
        create: { identifier: email, token, expires },
        update: { expires },
      });

      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://learnai.in"}/reset-password?token=${token}`;

      // Send email via Resend
      if (process.env.RESEND_API_KEY) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "LearnAI <noreply@learnai.in>",
            to: email,
            subject: "Reset your LearnAI password",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg,#7c3aed,#4f46e5); padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 22px;">Reset your password</h1>
                </div>
                <div style="background: #fff; padding: 32px; border-radius: 0 0 16px 16px; border: 1px solid #e5e7eb;">
                  <p style="color: #374151; margin: 0 0 16px;">Hi ${user.name ?? "there"},</p>
                  <p style="color: #6b7280; margin: 0 0 24px;">We received a request to reset your LearnAI password. Click the button below to set a new one. This link expires in <strong>1 hour</strong>.</p>
                  <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg,#7c3aed,#4f46e5); color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold;">Reset Password</a>
                  <p style="color: #9ca3af; font-size: 12px; margin: 24px 0 0;">If you didn&apos;t request this, you can safely ignore this email. Your password won&apos;t change.</p>
                </div>
              </div>
            `,
          }),
        });
      } else {
        // Development: log the reset URL
        console.log("[Password Reset URL]", resetUrl);
      }
    }

    // Always return 200 — never reveal whether an email is registered
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
