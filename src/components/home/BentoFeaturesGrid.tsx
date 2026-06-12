"use client";

// ─── Bento Features Grid ────────────────────────────────────────────────────
// A diverse-shape layout showcasing the platform's killer features. Each tile
// has its own micro-illustration built from inline SVG.

import Link from "next/link";
import { useEffect, useState } from "react";

// ── Tile: AI Tutor (big, takes the left column) ──────────────────────────
function TutorTile() {
  const messages = [
    "What is RAG?",
    "Explain transformers",
    "Help with my quiz",
    "Build a chatbot",
  ];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % messages.length), 2200);
    return () => clearInterval(t);
  }, [messages.length]);

  return (
    <div className="relative bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 rounded-3xl p-7 lg:p-8 text-white overflow-hidden h-full min-h-[280px]">
      <div className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full border-2 border-white/10 animate-spin-slow" />
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full border border-white/10 animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "30s" }} />
      <div className="absolute top-10 right-12 w-3 h-3 rounded-full bg-white/40 animate-pulse-strong" />

      <div className="relative">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-xs font-bold mb-4">
          <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse-strong" />
          AI Tutor · Pro
        </div>
        <h3 className="text-2xl lg:text-3xl font-bold leading-tight">
          Your personal<br />AI mentor.<br />24/7. Instant.
        </h3>
        <p className="mt-3 text-violet-200 text-sm max-w-xs leading-relaxed">
          Stuck on a concept? Get an explanation in 2 seconds. Need a code example? Done. Want a quiz hint? Sorted.
        </p>

        {/* Cycling chat preview */}
        <div className="mt-5 inline-flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 max-w-fit">
          <span className="text-xs text-violet-200">Ask:</span>
          <span key={active} className="text-sm font-medium" style={{ animation: "fade-in 0.4s ease-out" }}>
            &ldquo;{messages[active]}&rdquo;
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Tile: Live Classes ────────────────────────────────────────────────────
function LiveClassTile() {
  return (
    <div className="relative bg-white rounded-3xl p-6 border border-gray-100 shadow-sm overflow-hidden h-full">
      <div className="flex items-center gap-2 mb-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse-strong" />
          LIVE
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-900">Weekly live classes</h3>
      <p className="mt-1 text-sm text-gray-500 leading-relaxed">
        Real-time Q&amp;A with India&rsquo;s top AI engineers. Watch on any device.
      </p>

      {/* Mini calendar preview */}
      <div className="mt-4 grid grid-cols-7 gap-1">
        {Array.from({ length: 14 }).map((_, i) => {
          const isLive = i === 3 || i === 8 || i === 11;
          return (
            <div
              key={i}
              className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-bold ${
                isLive
                  ? "bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow"
                  : "bg-gray-50 text-gray-300"
              }`}
            >
              {i + 5}
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-xs text-violet-600 font-semibold flex items-center gap-1">
        <span>3 sessions this week</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}

// ── Tile: Quizzes ─────────────────────────────────────────────────────────
function QuizTile() {
  return (
    <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-100 h-full overflow-hidden">
      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-200/40 rounded-full blur-2xl" />
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md mb-3">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900">Hands-on quizzes</h3>
        <p className="mt-1 text-xs text-gray-600">Multi-choice, code, T/F, short-answer. Per-question feedback.</p>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-3xl font-bold text-orange-600">240+</span>
          <span className="text-xs text-gray-500">questions</span>
        </div>
      </div>
    </div>
  );
}

// ── Tile: Certificates ────────────────────────────────────────────────────
function CertTile() {
  return (
    <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 border border-emerald-100 h-full overflow-hidden">
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-200/40 rounded-full blur-2xl" />
      <svg className="absolute right-4 bottom-4 w-20 h-20 text-emerald-300 opacity-40" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28z" />
      </svg>
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md mb-3">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900">Verified certificates</h3>
        <p className="mt-1 text-xs text-gray-600">Public verification URLs. PDF download. LinkedIn-ready.</p>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-3xl font-bold text-emerald-600">5,000+</span>
          <span className="text-xs text-gray-500">issued</span>
        </div>
      </div>
    </div>
  );
}

// ── Tile: Mobile / Cross-device ───────────────────────────────────────────
function MobileTile() {
  return (
    <div className="relative bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-full overflow-hidden">
      <h3 className="text-lg font-bold text-gray-900">Learn anywhere</h3>
      <p className="mt-1 text-xs text-gray-500">Phone. Tablet. Laptop. Picks up where you left off.</p>

      <div className="mt-6 flex justify-center items-end gap-2">
        {/* Phone */}
        <div className="w-14 h-24 rounded-xl border-2 border-gray-300 bg-gradient-to-b from-violet-100 to-indigo-100 relative overflow-hidden">
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-5 h-1 bg-gray-400 rounded" />
          <div className="absolute inset-3 bg-violet-500/20 rounded" />
        </div>
        {/* Tablet */}
        <div className="w-20 h-28 rounded-xl border-2 border-gray-300 bg-gradient-to-b from-pink-100 to-violet-100 relative overflow-hidden">
          <div className="absolute inset-2 bg-violet-500/20 rounded" />
        </div>
        {/* Laptop */}
        <div className="relative">
          <div className="w-32 h-20 rounded-md border-2 border-gray-300 bg-gradient-to-b from-indigo-100 to-blue-100 relative overflow-hidden">
            <div className="absolute inset-2 bg-violet-500/20 rounded" />
          </div>
          <div className="w-36 h-1 bg-gray-300 rounded-b -mt-px -ml-2" />
        </div>
      </div>

      <div className="mt-3 text-xs text-violet-600 font-semibold text-center">Sync across all devices</div>
    </div>
  );
}

// ── Tile: Community ───────────────────────────────────────────────────────
function CommunityTile() {
  return (
    <div className="relative bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-600 rounded-3xl p-6 text-white h-full overflow-hidden">
      <div className="absolute -top-12 -left-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
      <div className="relative">
        <h3 className="text-lg font-bold">10k+ active learners</h3>
        <p className="mt-1 text-xs text-pink-100">Discord community. Weekly challenges. Peer reviews.</p>

        {/* Avatar wall */}
        <div className="mt-5 flex flex-wrap gap-1.5 max-w-[200px]">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-full border-2 border-rose-500"
              style={{
                background: `linear-gradient(135deg, hsl(${(i * 27) % 360} 75% 75%), hsl(${(i * 41) % 360} 70% 80%))`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function BentoFeaturesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* Big AI Tutor tile, spans 2 columns */}
      <div className="md:col-span-2 lg:col-span-2 lg:row-span-2">
        <Link href="/dashboard" className="block h-full">
          <TutorTile />
        </Link>
      </div>

      {/* Top right: live classes */}
      <div className="md:col-span-1 lg:col-span-2">
        <Link href="/live" className="block h-full">
          <LiveClassTile />
        </Link>
      </div>

      {/* Bottom row */}
      <div>
        <Link href="/courses" className="block h-full">
          <QuizTile />
        </Link>
      </div>
      <div>
        <Link href="/dashboard/certificates" className="block h-full">
          <CertTile />
        </Link>
      </div>
      <div className="md:col-span-1 lg:col-span-2">
        <Link href="/courses" className="block h-full">
          <MobileTile />
        </Link>
      </div>
      <div className="md:col-span-3 lg:col-span-2">
        <Link href="/community" className="block h-full">
          <CommunityTile />
        </Link>
      </div>
    </div>
  );
}
