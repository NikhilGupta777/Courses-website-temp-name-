import { db } from "@/lib/db";
import { NextRequest } from "next/server";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ certNumber: string }> }
) {
  const { certNumber } = await params;

  const cert = await db.certificate.findUnique({
    where: { certificateNumber: certNumber },
    include: {
      user:   { select: { name: true } },
      course: { select: { title: true } },
    },
  });

  if (!cert) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Certificate Not Found — LearnAI</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: #f5f0ff; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
    .card { background: white; border-radius: 20px; padding: 48px; max-width: 480px; width: 100%; text-align: center; box-shadow: 0 20px 50px rgba(109, 40, 217, 0.12); }
    .icon { width: 64px; height: 64px; background: #fee2e2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
    h1 { font-size: 22px; font-weight: 700; color: #1a1a2e; margin-bottom: 8px; }
    p { color: #6b7280; font-size: 14px; line-height: 1.6; }
    .cert-id { font-family: monospace; background: #f3f4f6; padding: 8px 16px; border-radius: 8px; font-size: 13px; color: #374151; margin-top: 16px; display: inline-block; }
    .link { display: inline-block; margin-top: 24px; color: #7c3aed; font-weight: 600; text-decoration: none; font-size: 14px; }
    .link:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </div>
    <h1>Certificate Not Found</h1>
    <p>We could not find a certificate with the ID below. Please check the ID and try again.</p>
    <div class="cert-id">${esc(certNumber)}</div>
    <br />
    <a href="https://learnai.in" class="link">← Back to LearnAI</a>
  </div>
</body>
</html>`;
    return new Response(html, {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  type CertMeta = { instructorName?: string; completionDate?: string };
  const meta = cert.metadata as CertMeta | null;
  const instructorName = meta?.instructorName ?? "LearnAI Instructor";
  const issuedDate = new Date(cert.issuedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Certificate Verified — LearnAI</title>
  <meta name="description" content="Certificate verification for ${esc(cert.course.title)} completed by ${esc(cert.user.name ?? "Learner")}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #f5f0ff 0%, #ede9fe 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
    .wrapper { max-width: 560px; width: 100%; }
    /* Verified badge */
    .verified-badge {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      background: #10b981; color: white; font-size: 13px; font-weight: 600;
      padding: 8px 20px; border-radius: 100px; margin-bottom: 24px; width: fit-content; margin-left: auto; margin-right: auto;
    }
    /* Card */
    .card {
      background: white; border-radius: 24px; overflow: hidden;
      box-shadow: 0 25px 60px rgba(109, 40, 217, 0.15);
    }
    .card-header {
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      padding: 32px; text-align: center;
    }
    .brand { font-family: 'Playfair Display', serif; color: white; font-size: 24px; font-weight: 700; margin-bottom: 4px; }
    .subtitle { color: rgba(255,255,255,0.75); font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; }
    .card-body { padding: 32px; }
    .section-label { font-size: 11px; color: #9ca3af; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 6px; }
    .section-value { font-size: 18px; font-weight: 700; color: #1a1a2e; margin-bottom: 20px; }
    .course-name { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #7c3aed; margin-bottom: 24px; line-height: 1.3; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .meta-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px 16px; }
    .cert-id-row { margin-top: 20px; padding: 12px 16px; background: #f3f4f6; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; }
    .cert-id-label { font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; }
    .cert-id-value { font-family: monospace; font-size: 13px; font-weight: 600; color: #374151; }
    .footer { padding: 20px 32px; border-top: 1px solid #f3f4f6; text-align: center; }
    .footer p { font-size: 12px; color: #9ca3af; }
    .footer a { color: #7c3aed; text-decoration: none; font-weight: 600; }
    .footer a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="verified-badge">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      Certificate Verified
    </div>

    <div class="card">
      <div class="card-header">
        <div class="brand">LearnAI</div>
        <div class="subtitle">Certificate of Completion</div>
      </div>

      <div class="card-body">
        <div class="section-label">Awarded to</div>
        <div class="section-value">${esc(cert.user.name ?? "Learner")}</div>

        <div class="section-label">For completing</div>
        <div class="course-name">${esc(cert.course.title)}</div>

        <div class="grid">
          <div class="meta-box">
            <div class="section-label">Instructor</div>
            <div style="font-size:14px;font-weight:600;color:#374151;">${esc(instructorName)}</div>
          </div>
          <div class="meta-box">
            <div class="section-label">Issue Date</div>
            <div style="font-size:14px;font-weight:600;color:#374151;">${esc(issuedDate)}</div>
          </div>
        </div>

        <div class="cert-id-row">
          <span class="cert-id-label">Certificate ID</span>
          <span class="cert-id-value">${esc(cert.certificateNumber)}</span>
        </div>
      </div>

      <div class="footer">
        <p>This certificate was issued by <a href="https://learnai.in">LearnAI</a> · Verification URL is permanent</p>
      </div>
    </div>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
