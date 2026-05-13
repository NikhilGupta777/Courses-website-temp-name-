import Link from "next/link";
import { verifyCertificate } from "@/server/services/certificate";
import type { Metadata } from "next";

// Public certificate verification page — no auth required
// URL: /verify/LEARNAI-2026-001234

interface Props {
  params: { certNumber: string };
}

// Dynamic metadata so OG preview shows the student's name
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Verify Certificate ${params.certNumber} | LearnAI`,
    description: "Verify the authenticity of a LearnAI completion certificate.",
    robots: { index: false }, // Don't index individual cert pages
  };
}

// FIX #7: replaced hardcoded mock data with real DB lookup via verifyCertificate service
export default async function VerifyCertificatePage({ params }: Props) {
  // verifyCertificate queries the DB — returns null if not found
  const record = await verifyCertificate(params.certNumber);

  // Shape the cert data from DB record
  const cert = record
    ? {
        valid:        true,
        studentName:  record.user?.name ?? "Learner",
        courseTitle:  record.course?.title ?? "Unknown Course",
        issuedAt:     new Date(record.issuedAt).toLocaleDateString("en-IN", {
          day: "numeric", month: "long", year: "numeric",
        }),
        instructor:   (record.metadata as any)?.instructorName ?? "LearnAI Instructor",
        duration:     record.course?.duration
          ? `${Math.floor(record.course.duration / 60)}h ${record.course.duration % 60}m`
          : null,
        score:        (record.metadata as any)?.score as number | undefined,
      }
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-2xl">

        {/* LearnAI branding */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              LearnAI
            </span>
          </Link>
          <p className="text-gray-500 text-sm">Certificate Verification Portal</p>
        </div>

        {cert ? (
          /* ── Valid Certificate ── */
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Green verified banner */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="text-white font-bold text-lg">Certificate Verified ✓</div>
                <div className="text-green-100 text-sm">This certificate is authentic and was issued by LearnAI</div>
              </div>
            </div>

            {/* Certificate body */}
            <div className="p-8">
              {/* Visual certificate */}
              <div className="relative bg-gradient-to-br from-violet-600 via-indigo-700 to-purple-800 rounded-2xl p-8 mb-8 text-center overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-400/20 border-2 border-yellow-300/50 mb-4">
                    <svg className="w-8 h-8 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-violet-200 mb-2">
                    Certificate of Completion
                  </div>
                  <div className="text-white font-bold text-2xl sm:text-3xl mb-1">{cert.studentName}</div>
                  <div className="text-violet-200 text-sm mb-4">has successfully completed</div>
                  <div className="text-yellow-300 font-bold text-xl sm:text-2xl mb-4">{cert.courseTitle}</div>
                  <div className="flex items-center justify-center gap-6 text-xs text-violet-200 flex-wrap">
                    {cert.score && <span>Score: <strong className="text-white">{cert.score}%</strong></span>}
                    <span>Issued: <strong className="text-white">{cert.issuedAt}</strong></span>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between text-xs text-violet-300">
                    <span>LearnAI Platform</span>
                    <span className="font-mono">{params.certNumber}</span>
                  </div>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Student",    value: cert.studentName },
                  { label: "Course",     value: cert.courseTitle },
                  { label: "Instructor", value: cert.instructor },
                  { label: "Issue Date", value: cert.issuedAt },
                  ...(cert.duration ? [{ label: "Duration", value: cert.duration }] : []),
                  { label: "Platform",   value: "LearnAI" },
                  { label: "Status",     value: "Valid ✓" },
                ].map((d) => (
                  <div key={d.label} className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-400 mb-0.5">{d.label}</div>
                    <div className="text-sm font-semibold text-gray-900 leading-snug">{d.value}</div>
                  </div>
                ))}
              </div>

              {/* Certificate number */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <svg className="w-5 h-5 text-violet-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500">Certificate ID</div>
                  <div className="text-sm font-mono font-semibold text-gray-900">{params.certNumber}</div>
                </div>
                <span className="text-xs text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full font-semibold">
                  Verified
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* ── Invalid / Not Found Certificate ── */
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 px-8 py-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <div className="text-white font-bold text-lg">Certificate Not Found</div>
                <div className="text-red-100 text-sm">This certificate ID is invalid or does not exist</div>
              </div>
            </div>
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid Certificate ID</h2>
              <p className="text-gray-500 text-sm mb-2">
                Certificate{" "}
                <code className="bg-gray-100 px-2 py-0.5 rounded text-red-600 font-mono text-xs">
                  {params.certNumber}
                </code>{" "}
                was not found in our records.
              </p>
              <p className="text-gray-400 text-xs mb-6">
                Please double-check the certificate ID. If the issue persists, contact{" "}
                <a href="mailto:support@learnai.in" className="text-violet-600 hover:underline">
                  support@learnai.in
                </a>
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors"
              >
                ← Back to LearnAI
              </Link>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">
          LearnAI Certificate Verification ·{" "}
          <a href="mailto:support@learnai.in" className="hover:text-violet-600">
            support@learnai.in
          </a>
        </p>
      </div>
    </div>
  );
}
