// POST /api/contact
// Receives the contact form submission and sends it via email.
// FIX #22: replaces the fake setTimeout in contact/page.tsx with a real API call.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ContactSchema = z.object({
  name:    z.string().min(2).max(100),
  email:   z.string().email(),
  reason:  z.string().min(1).max(100),
  message: z.string().min(10).max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const parsed = ContactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { name, email, reason, message } = parsed.data;

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
