import { type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  const cert = await db.certificate.findUnique({
    where: { id },
    include: {
      user: { select: { name: true } },
      course: { select: { title: true } },
    },
  });

  if (!cert) {
    return new Response("Certificate not found", { status: 404 });
  }
  if (cert.userId !== session.user.id) {
    return new Response("Forbidden", { status: 403 });
  }

  type CertMeta = {
    userName?: string;
    courseName?: string;
    instructorName?: string;
    completionDate?: string;
  };

  const meta = cert.metadata as CertMeta | null;
  const userName = meta?.userName ?? cert.user.name ?? "Learner";
  const courseName = meta?.courseName ?? cert.course.title;
  const instructorName = meta?.instructorName ?? "LearnAI Instructor";
  const rawDate = meta?.completionDate
    ? new Date(meta.completionDate)
    : new Date(cert.issuedAt);
  const completionDate = rawDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Certificate of Completion — ${esc(courseName)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', sans-serif;
      background: #f5f0ff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      color: #1a1a2e;
    }

    .page {
      background: white;
      width: 960px;
      min-height: 680px;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(109, 40, 217, 0.18);
      position: relative;
    }

    /* Purple gradient top band */
    .top-band {
      background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 60%, #7c3aed 100%);
      padding: 36px 60px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-icon {
      width: 42px;
      height: 42px;
      background: rgba(255,255,255,0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .brand-name {
      font-family: 'Playfair Display', serif;
      color: white;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    .badge {
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.3);
      color: white;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      padding: 6px 14px;
      border-radius: 100px;
    }

    /* Main content */
    .content {
      padding: 48px 60px 40px;
      text-align: center;
    }

    /* Trophy / award icon */
    .trophy-wrap {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 72px;
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      border-radius: 50%;
      margin-bottom: 24px;
      box-shadow: 0 8px 20px rgba(251, 191, 36, 0.4);
    }

    .title-cert {
      font-family: 'Playfair Display', serif;
      font-size: 13px;
      font-weight: 600;
      color: #7c3aed;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .title-main {
      font-family: 'Playfair Display', serif;
      font-size: 34px;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 28px;
      line-height: 1.2;
    }

    .certifies-text {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 14px;
    }

    .student-name {
      font-family: 'Playfair Display', serif;
      font-size: 40px;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 14px;
      line-height: 1.1;
    }

    .completed-text {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 16px;
    }

    /* Decorative divider */
    .divider {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin: 16px 0;
    }
    .divider-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
      max-width: 180px;
    }
    .divider-dot {
      width: 8px;
      height: 8px;
      background: #7c3aed;
      border-radius: 50%;
    }

    .course-name {
      font-family: 'Playfair Display', serif;
      font-size: 22px;
      font-weight: 600;
      color: #7c3aed;
      margin-bottom: 32px;
      line-height: 1.3;
      padding: 0 40px;
    }

    /* Meta row */
    .meta-row {
      display: flex;
      align-items: stretch;
      justify-content: center;
      gap: 0;
      margin: 0 auto 32px;
      max-width: 600px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      overflow: hidden;
    }
    .meta-item {
      flex: 1;
      padding: 16px 20px;
      text-align: center;
    }
    .meta-item + .meta-item {
      border-left: 1px solid #e5e7eb;
    }
    .meta-label {
      font-size: 10px;
      color: #9ca3af;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .meta-value {
      font-size: 13px;
      font-weight: 600;
      color: #1a1a2e;
    }

    /* Cert number */
    .cert-id {
      font-size: 11px;
      color: #9ca3af;
      font-family: 'Inter', monospace;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }

    /* Footer / bottom band */
    .bottom-band {
      background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 60%, #7c3aed 100%);
      padding: 18px 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .bottom-text {
      font-size: 11px;
      color: rgba(255,255,255,0.7);
    }
    .verify-link {
      font-size: 11px;
      color: rgba(255,255,255,0.9);
      text-decoration: none;
      font-weight: 500;
    }

    /* Print / Download button — visible on screen, hidden when printing */
    .print-btn {
      position: fixed;
      bottom: 28px;
      right: 28px;
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      color: white;
      border: none;
      padding: 14px 28px;
      border-radius: 100px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(109, 40, 217, 0.4);
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'Inter', sans-serif;
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .print-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(109, 40, 217, 0.5);
    }

    /* ── Print styles ─────────────────────────────────── */
    @media print {
      @page {
        size: A4 landscape;
        margin: 0;
      }
      body {
        background: white;
        padding: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .page {
        width: 100%;
        min-height: 100vh;
        border-radius: 0;
        box-shadow: none;
      }
      .print-btn {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Top band -->
    <div class="top-band">
      <div class="brand">
        <div class="brand-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </div>
        <span class="brand-name">LearnAI</span>
      </div>
      <span class="badge">Official Certificate</span>
    </div>

    <!-- Main content -->
    <div class="content">
      <!-- Trophy icon -->
      <div class="trophy-wrap">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 010-5H6"/>
          <path d="M18 9h1.5a2.5 2.5 0 000-5H18"/>
          <path d="M4 22h16"/>
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
          <path d="M18 2H6v7a6 6 0 0012 0V2z"/>
        </svg>
      </div>

      <div class="title-cert">Certificate of Completion</div>
      <div class="title-main">Achievement Unlocked</div>

      <div class="certifies-text">This is to certify that</div>
      <div class="student-name">${esc(userName)}</div>
      <div class="completed-text">has successfully completed the course</div>

      <div class="divider">
        <div class="divider-line"></div>
        <div class="divider-dot"></div>
        <div class="divider-line"></div>
      </div>

      <div class="course-name">${esc(courseName)}</div>

      <div class="meta-row">
        <div class="meta-item">
          <div class="meta-label">Instructor</div>
          <div class="meta-value">${esc(instructorName)}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Issued On</div>
          <div class="meta-value">${esc(completionDate)}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Platform</div>
          <div class="meta-value">LearnAI</div>
        </div>
      </div>

      <div class="cert-id">Certificate ID: ${esc(cert.certificateNumber)}</div>
    </div>

    <!-- Bottom band -->
    <div class="bottom-band">
      <span class="bottom-text">Verify this certificate at learnai.in/verify/${esc(cert.certificateNumber)}</span>
      <a href="${esc(cert.verificationUrl)}" class="verify-link" target="_blank">Verify Online →</a>
    </div>
  </div>

  <!-- Print/Download button (hidden during printing) -->
  <button class="print-btn" onclick="window.print()">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 6 2 18 2 18 9"/>
      <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
      <rect x="6" y="14" width="12" height="8"/>
    </svg>
    Download / Print PDF
  </button>

  <script>
    // Auto-open print dialog after fonts load
    window.addEventListener('load', function() {
      setTimeout(function() { window.print(); }, 800);
    });
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-cache",
    },
  });
}
