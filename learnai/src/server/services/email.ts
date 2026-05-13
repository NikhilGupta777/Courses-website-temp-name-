// Email service using Resend
// https://resend.com/docs

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: EmailPayload): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured — email not sent:", subject);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "LearnAI <noreply@learnai.in>",
      to,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Email send failed:", err);
    throw new Error(`Email failed: ${res.status}`);
  }
}

// ─── Email Templates ──────────────────────────────────────────

export async function sendWelcomeEmail(to: string, name: string) {
  await sendEmail({
    to,
    subject: "Welcome to LearnAI 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #7c3aed, #4f46e5); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to LearnAI!</h1>
        </div>
        <div style="background: #ffffff; padding: 32px; border-radius: 0 0 16px 16px; border: 1px solid #e5e7eb;">
          <p style="font-size: 16px; color: #374151;">Hi <strong>${name}</strong>,</p>
          <p style="color: #6b7280;">You've successfully joined 50,000+ learners mastering AI on LearnAI. Your 3 free courses are waiting for you:</p>
          <ul style="color: #6b7280; line-height: 1.8;">
            <li>✅ AI Prompting Fundamentals</li>
            <li>✅ ChatGPT Basics for Everyone</li>
            <li>✅ AI Tools for Everyday Use</li>
          </ul>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
             style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #4f46e5); color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 16px;">
            Start Learning →
          </a>
        </div>
      </div>
    `,
  });
}

export async function sendPaymentConfirmation(
  to: string,
  name: string,
  amount: string,
  plan: string,
  invoiceUrl?: string
) {
  await sendEmail({
    to,
    subject: `Payment Confirmed — LearnAI ${plan}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 24px; border-radius: 12px;">
          <h2 style="color: #166534;">✅ Payment Successful</h2>
          <p style="color: #374151;">Hi <strong>${name}</strong>, your payment of <strong>${amount}</strong> for <strong>LearnAI ${plan}</strong> was successful.</p>
          <p style="color: #6b7280; font-size: 14px;">A GST invoice has been generated for this transaction.${invoiceUrl ? ` <a href="${invoiceUrl}">Download Invoice</a>` : ""}</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
             style="display: inline-block; background: #16a34a; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: bold; margin-top: 16px;">
            Go to Dashboard →
          </a>
        </div>
      </div>
    `,
  });
}

export async function sendCertificateEmail(
  to: string,
  name: string,
  courseTitle: string,
  certNumber: string,
  verificationUrl: string
) {
  await sendEmail({
    to,
    subject: `🎉 Your Certificate is Ready — ${courseTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #7c3aed, #4f46e5); padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
          <div style="font-size: 48px;">🏆</div>
          <h1 style="color: white; margin: 8px 0;">Certificate Earned!</h1>
        </div>
        <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px; border: 1px solid #e5e7eb;">
          <p style="font-size: 16px; color: #374151;">Congratulations, <strong>${name}</strong>!</p>
          <p style="color: #6b7280;">You have successfully completed <strong>${courseTitle}</strong> on LearnAI.</p>
          <div style="background: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 10px; padding: 16px; margin: 20px 0;">
            <div style="font-size: 12px; color: #7c3aed; font-weight: bold;">CERTIFICATE ID</div>
            <div style="font-family: monospace; font-size: 16px; color: #1f2937; margin-top: 4px;">${certNumber}</div>
          </div>
          <div style="display: flex; gap: 12px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/certificates"
               style="background: linear-gradient(135deg, #7c3aed, #4f46e5); color: white; padding: 12px 20px; border-radius: 10px; text-decoration: none; font-weight: bold;">
              Download Certificate
            </a>
            <a href="${verificationUrl}"
               style="background: #f3f4f6; color: #374151; padding: 12px 20px; border-radius: 10px; text-decoration: none;">
              Verify Online
            </a>
          </div>
        </div>
      </div>
    `,
  });
}

export async function sendLiveClassReminder(
  to: string,
  name: string,
  classTitle: string,
  classDate: string,
  joinUrl: string
) {
  await sendEmail({
    to,
    subject: `⏰ Reminder: "${classTitle}" starts soon`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #7c3aed, #4f46e5); padding: 24px 32px;">
          <h2 style="color: white; margin: 0;">📹 Live Class Reminder</h2>
        </div>
        <div style="padding: 32px;">
          <p style="color: #374151;">Hi <strong>${name}</strong>,</p>
          <p style="color: #6b7280;">Your live class <strong>"${classTitle}"</strong> is starting on <strong>${classDate}</strong>.</p>
          <a href="${joinUrl}"
             style="display: inline-block; background: #dc2626; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 12px;">
            🔴 Join Live Session
          </a>
        </div>
      </div>
    `,
  });
}
