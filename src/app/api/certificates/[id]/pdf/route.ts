import { type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const download = req.nextUrl.searchParams.get("download") === "1";

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

  // ─── Real PDF generation when ?download=1 ──────────────────────────────
  if (download) {
    const pdfBytes = await renderCertificatePdf({
      userName,
      courseName,
      instructorName,
      completionDate,
      certificateNumber: cert.certificateNumber,
      verificationUrl: cert.verificationUrl,
    });
    const safeCourseName = courseName.replace(/[^a-z0-9]/gi, "_").slice(0, 40);
    return new Response(Buffer.from(pdfBytes) as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="LearnAI_Certificate_${safeCourseName}.pdf"`,
        "Cache-Control": "private, no-cache",
      },
    });
  }

  // ─── HTML preview (default) ────────────────────────────────────────────
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
    body { font-family: 'Inter', sans-serif; background: #f5f0ff; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; color: #1a1a2e; }
    .page { background: white; width: 960px; min-height: 680px; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 60px rgba(109, 40, 217, 0.18); position: relative; }
    .top-band { background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 60%, #7c3aed 100%); padding: 36px 60px 32px; display: flex; align-items: center; justify-content: space-between; }
    .brand { display: flex; align-items: center; gap: 10px; }
    .brand-icon { width: 42px; height: 42px; background: rgba(255,255,255,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .brand-name { font-family: 'Playfair Display', serif; color: white; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }
    .badge { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); color: white; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; padding: 6px 14px; border-radius: 100px; }
    .content { padding: 48px 60px 40px; text-align: center; }
    .trophy-wrap { display: inline-flex; align-items: center; justify-content: center; width: 72px; height: 72px; background: linear-gradient(135deg, #fbbf24, #f59e0b); border-radius: 50%; margin-bottom: 24px; box-shadow: 0 8px 20px rgba(251, 191, 36, 0.4); }
    .title-cert { font-family: 'Playfair Display', serif; font-size: 13px; font-weight: 600; color: #7c3aed; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px; }
    .title-main { font-family: 'Playfair Display', serif; font-size: 34px; font-weight: 700; color: #1a1a2e; margin-bottom: 28px; line-height: 1.2; }
    .certifies-text { font-size: 14px; color: #6b7280; margin-bottom: 14px; }
    .student-name { font-family: 'Playfair Display', serif; font-size: 40px; font-weight: 700; color: #1a1a2e; margin-bottom: 14px; line-height: 1.1; }
    .completed-text { font-size: 14px; color: #6b7280; margin-bottom: 16px; }
    .divider { display: flex; align-items: center; justify-content: center; gap: 16px; margin: 16px 0; }
    .divider-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, #e5e7eb, transparent); max-width: 180px; }
    .divider-dot { width: 8px; height: 8px; background: #7c3aed; border-radius: 50%; }
    .course-name { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 600; color: #7c3aed; margin-bottom: 32px; line-height: 1.3; padding: 0 40px; }
    .meta-row { display: flex; align-items: stretch; justify-content: center; gap: 0; margin: 0 auto 32px; max-width: 600px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; }
    .meta-item { flex: 1; padding: 16px 20px; text-align: center; }
    .meta-item + .meta-item { border-left: 1px solid #e5e7eb; }
    .meta-label { font-size: 10px; color: #9ca3af; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 5px; }
    .meta-value { font-size: 13px; font-weight: 600; color: #1a1a2e; }
    .cert-id { font-size: 11px; color: #9ca3af; font-family: 'Inter', monospace; letter-spacing: 0.5px; margin-bottom: 12px; }
    .bottom-band { background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 60%, #7c3aed 100%); padding: 18px 60px; display: flex; align-items: center; justify-content: space-between; }
    .bottom-text { font-size: 11px; color: rgba(255,255,255,0.7); }
    .verify-link { font-size: 11px; color: rgba(255,255,255,0.9); text-decoration: none; font-weight: 500; }
    .actions { position: fixed; bottom: 28px; right: 28px; display: flex; gap: 10px; }
    .action-btn { background: white; color: #7c3aed; border: 1px solid #ddd6fe; padding: 12px 20px; border-radius: 100px; font-size: 13px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 14px rgba(109, 40, 217, 0.15); display: inline-flex; align-items: center; gap: 6px; font-family: 'Inter', sans-serif; text-decoration: none; transition: transform 0.15s; }
    .action-btn:hover { transform: translateY(-1px); }
    .action-btn.primary { background: linear-gradient(135deg, #7c3aed, #4f46e5); color: white; border-color: transparent; box-shadow: 0 8px 24px rgba(109, 40, 217, 0.4); }
    @media print { body { background: white; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; } .page { width: 100%; min-height: 100vh; border-radius: 0; box-shadow: none; } .actions { display: none !important; } }
  </style>
</head>
<body>
  <div class="page">
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
    <div class="content">
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
      <div class="divider"><div class="divider-line"></div><div class="divider-dot"></div><div class="divider-line"></div></div>
      <div class="course-name">${esc(courseName)}</div>
      <div class="meta-row">
        <div class="meta-item"><div class="meta-label">Instructor</div><div class="meta-value">${esc(instructorName)}</div></div>
        <div class="meta-item"><div class="meta-label">Issued On</div><div class="meta-value">${esc(completionDate)}</div></div>
        <div class="meta-item"><div class="meta-label">Platform</div><div class="meta-value">LearnAI</div></div>
      </div>
      <div class="cert-id">Certificate ID: ${esc(cert.certificateNumber)}</div>
    </div>
    <div class="bottom-band">
      <span class="bottom-text">Verify this certificate at learnai.in/verify/${esc(cert.certificateNumber)}</span>
      <a href="${esc(cert.verificationUrl)}" class="verify-link" target="_blank">Verify Online →</a>
    </div>
  </div>
  <div class="actions">
    <a class="action-btn" href="?">Print</a>
    <a class="action-btn primary" href="?download=1" download>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
      </svg>
      Download PDF
    </a>
  </div>
  <script>
    (function() {
      var p = new URLSearchParams(window.location.search).get('print');
      if (p === '1') setTimeout(function() { window.print(); }, 600);
      // The Print button above sets ?print=1 via location, then triggers print
      document.querySelectorAll('.action-btn').forEach(function(a) {
        if (a.getAttribute('href') === '?') {
          a.addEventListener('click', function(ev) {
            ev.preventDefault();
            window.print();
          });
        }
      });
    })();
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

// ────────────────────────────────────────────────────────────────────────────
// Real PDF rendering using pdf-lib (no headless browser required).
// Outputs a single-page A4 landscape certificate that mirrors the HTML design.
// ────────────────────────────────────────────────────────────────────────────
async function renderCertificatePdf(input: {
  userName: string;
  courseName: string;
  instructorName: string;
  completionDate: string;
  certificateNumber: string;
  verificationUrl: string;
}): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();

  // A4 landscape: 842 × 595 pts
  const page = pdf.addPage([842, 595]);
  const { width, height } = page.getSize();

  const helv      = await pdf.embedFont(StandardFonts.Helvetica);
  const helvBold  = await pdf.embedFont(StandardFonts.HelveticaBold);
  const tsRoman   = await pdf.embedFont(StandardFonts.TimesRomanBold);

  const violet = rgb(0.486, 0.227, 0.929);     // #7c3aed
  const indigo = rgb(0.310, 0.275, 0.898);     // #4f46e5
  const dark   = rgb(0.10,  0.10,  0.18);
  const grey   = rgb(0.42,  0.45,  0.50);
  const greyL  = rgb(0.61,  0.64,  0.69);
  const card   = rgb(0.98,  0.98,  0.99);
  const gold   = rgb(0.98,  0.75,  0.14);

  // Top gradient band (approximated with a solid violet rect)
  page.drawRectangle({ x: 0, y: height - 70, width, height: 70, color: violet });
  page.drawRectangle({ x: width / 2, y: height - 70, width: width / 2, height: 70, color: indigo });

  page.drawText("LearnAI", {
    x: 50, y: height - 45, size: 22, font: tsRoman, color: rgb(1, 1, 1),
  });
  page.drawText("OFFICIAL CERTIFICATE", {
    x: width - 200, y: height - 42, size: 10, font: helvBold, color: rgb(1, 1, 1),
  });

  // Trophy circle (simple)
  const cx = width / 2;
  page.drawCircle({ x: cx, y: height - 130, size: 28, color: gold });
  page.drawText("🏆", { x: cx - 12, y: height - 140, size: 24, font: helv });

  // Title
  drawCentered(page, "CERTIFICATE OF COMPLETION", height - 195, 12, helvBold, violet);
  drawCentered(page, "Achievement Unlocked",        height - 230, 28, tsRoman, dark);

  // Recipient
  drawCentered(page, "This is to certify that",     height - 275, 12, helv, grey);
  drawCentered(page, input.userName,                height - 315, 32, tsRoman, dark);

  drawCentered(page, "has successfully completed the course", height - 350, 12, helv, grey);

  // Course name (truncate visually if too long)
  const courseLine = input.courseName.length > 70
    ? input.courseName.slice(0, 67) + "…"
    : input.courseName;
  drawCentered(page, courseLine, height - 388, 18, tsRoman, violet);

  // Meta box
  const metaY = height - 470;
  const boxW  = 540;
  const boxX  = (width - boxW) / 2;
  page.drawRectangle({ x: boxX, y: metaY, width: boxW, height: 60, color: card, borderColor: rgb(0.9, 0.9, 0.93), borderWidth: 1 });

  // Three columns
  drawColumn(page, "INSTRUCTOR", input.instructorName,    boxX + 30,  metaY, helv, helvBold, greyL, dark);
  drawColumn(page, "ISSUED ON",  input.completionDate,    boxX + 210, metaY, helv, helvBold, greyL, dark);
  drawColumn(page, "PLATFORM",   "LearnAI",               boxX + 390, metaY, helv, helvBold, greyL, dark);

  // Certificate number
  drawCentered(page, `Certificate ID: ${input.certificateNumber}`, metaY - 25, 9, helv, greyL);

  // Bottom band
  page.drawRectangle({ x: 0, y: 0, width, height: 40, color: violet });
  page.drawRectangle({ x: width / 2, y: 0, width: width / 2, height: 40, color: indigo });
  page.drawText(`Verify this certificate at: ${input.verificationUrl}`, {
    x: 50, y: 16, size: 9, font: helv, color: rgb(1, 1, 1),
  });

  return pdf.save();
}

function drawCentered(
  page: import("pdf-lib").PDFPage,
  text: string,
  y: number,
  size: number,
  font: import("pdf-lib").PDFFont,
  color: import("pdf-lib").RGB,
) {
  const w = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: (page.getWidth() - w) / 2, y, size, font, color });
}

function drawColumn(
  page: import("pdf-lib").PDFPage,
  label: string,
  value: string,
  x: number,
  yBase: number,
  labelFont: import("pdf-lib").PDFFont,
  valueFont: import("pdf-lib").PDFFont,
  labelColor: import("pdf-lib").RGB,
  valueColor: import("pdf-lib").RGB,
) {
  page.drawText(label, { x, y: yBase + 38, size: 8, font: labelFont, color: labelColor });
  // Truncate value if too long for the column (~150 pts wide)
  const safeValue = value.length > 24 ? value.slice(0, 22) + "…" : value;
  page.drawText(safeValue, { x, y: yBase + 18, size: 11, font: valueFont, color: valueColor });
}
