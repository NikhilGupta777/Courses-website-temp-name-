"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc/client";

const CERT_COLORS = [
  "from-violet-400 to-indigo-500",
  "from-orange-400 to-amber-500",
  "from-green-400 to-emerald-500",
  "from-pink-400 to-rose-500",
  "from-blue-400 to-cyan-500",
];

export default function CertificatesPage() {
  const { data: session } = useSession();
  const [shareModal, setShareModal] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: certificates, isLoading } = useQuery(trpc.certificate.getAll.queryOptions());

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/dashboard" className="flex items-center gap-1 text-sm text-gray-500 hover:text-violet-600 transition-colors mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
            <p className="text-gray-500 mt-1">You have earned <strong className="text-violet-600">{certificates?.length ?? 0}</strong> certificate{(certificates?.length ?? 0) !== 1 ? "s" : ""} so far.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({length: 2}).map((_,i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : !certificates || certificates.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Certificates Yet</h2>
            <p className="text-gray-500 mb-6">Complete a course to earn your first verifiable certificate.</p>
            <Link href="/courses" className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert, idx) => {
              const color = CERT_COLORS[idx % CERT_COLORS.length]!;
              const issuedDate = new Date(cert.issuedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
              return (
                <div key={cert.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group">
                  <div className={`relative h-44 bg-gradient-to-br ${color} flex flex-col items-center justify-center p-6`}>
                    <div className="absolute top-4 right-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                      </div>
                    </div>
                    <div className="text-white text-center">
                      <div className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">Certificate of Completion</div>
                      <div className="text-lg font-bold leading-tight">{cert.course.title}</div>
                      <div className="text-xs text-white/70 mt-1">LearnAI Platform</div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="text-center p-2 bg-gray-50 rounded-xl">
                        <div className="text-sm font-bold text-gray-900">Verified</div>
                        <div className="text-xs text-gray-500">Status</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-xl">
                        <div className="text-sm font-bold text-gray-900">{issuedDate.split(" ")[2]}</div>
                        <div className="text-xs text-gray-500">Year</div>
                      </div>
                    </div>
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        Issued {issuedDate}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
                        {cert.certificateNumber}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {(() => {
                        const downloadUrl = cert.pdfUrl ?? `/api/certificates/${cert.id}/pdf`;
                        return (
                          <a
                            href={downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download / Print
                          </a>
                        );
                      })()}
                      <button onClick={() => setShareModal(cert.verificationUrl)}
                        className="px-3 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                      </button>
                      <Link href={`/verify/${cert.certificateNumber}`}
                        className="px-3 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-10 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl p-6 border border-violet-100 flex items-center justify-between gap-6 flex-wrap">
          <div>
            <h3 className="font-bold text-gray-900">Complete more courses to earn certificates</h3>
            <p className="text-sm text-gray-500 mt-1">Certificates are auto-generated when you finish 100% of a course.</p>
          </div>
          <Link href="/courses" className="flex-shrink-0 px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors text-sm">
            Browse Courses →
          </Link>
        </div>
      </div>

      {shareModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4" onClick={() => setShareModal(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 text-lg mb-4">Share Certificate</h3>
            <div className="flex gap-3 mb-5">
              {[
                { label: "LinkedIn", bg: "bg-blue-700", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareModal)}` },
                { label: "WhatsApp", bg: "bg-green-500", href: `https://wa.me/?text=${encodeURIComponent("I just earned a certificate on LearnAI! Verify it here: " + shareModal)}` },
                { label: "Twitter", bg: "bg-sky-500", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent("Just earned a verified AI certificate on @LearnAI_India! " + shareModal)}` },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className={`flex-1 py-2.5 ${s.bg} text-white text-sm font-semibold rounded-xl text-center hover:opacity-90 transition-opacity`}>
                  {s.label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3 border border-gray-200">
              <span className="flex-1 text-xs text-gray-600 truncate font-mono">{shareModal}</span>
              <button onClick={() => handleCopy(shareModal)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${copied ? "bg-green-100 text-green-700" : "bg-violet-100 text-violet-700 hover:bg-violet-200"}`}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <button onClick={() => setShareModal(null)} className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-gray-700">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
