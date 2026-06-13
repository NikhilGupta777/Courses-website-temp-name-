"use client";

// ─── AuthBrandPanel ─────────────────────────────────────────────────────────
// The left-hand brand panel shown on the auth pages (login / register / etc.).
// Deep-violet gradient with a live neural-net motif, an auto-rotating
// testimonial, and trust stats — so the auth screens feel like part of the
// same premium product as the homepage rather than a bare form.

import Link from "next/link";
import { useEffect, useState } from "react";

const QUOTES = [
  {
    quote: "LearnAI's RAG course got me my first AI engineering role. The live classes were the turning point.",
    name: "Ankit Verma",
    role: "ML Engineer · Razorpay",
  },
  {
    quote: "I went from zero ML background to shipping production AI at work in four months. Worth every rupee.",
    name: "Divya Nair",
    role: "Lead Marketer · Swiggy",
  },
  {
    quote: "The AI Tutor is like having a senior engineer on call 24/7. I learned faster than any bootcamp.",
    name: "Rohit Gupta",
    role: "AI Engineer · Flipkart",
  },
];

const STATS = [
  { value: "10,000+", label: "Learners" },
  { value: "4.9★", label: "Avg rating" },
  { value: "94%", label: "Completion" },
];

export function AuthBrandPanel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % QUOTES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const current = QUOTES[active]!;

  return (
    <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800 p-12 text-white">
      {/* Animated orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-pink-400/20 blur-3xl animate-blob-1" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-violet-400/20 blur-3xl animate-blob-2" />

      {/* Dotted grid */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Brand */}
      <div className="relative">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <span className="text-xl font-bold">LearnAI</span>
        </Link>
      </div>

      {/* Headline + rotating testimonial */}
      <div className="relative max-w-md">
        <h2 className="text-3xl font-bold leading-tight tracking-tight">
          India&apos;s most-loved<br />place to master AI.
        </h2>

        <div className="mt-8 min-h-[150px]">
          <svg className="w-8 h-8 text-white/30 mb-3" fill="currentColor" viewBox="0 0 32 32">
            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
          </svg>
          <p key={active} className="text-lg text-violet-50 leading-relaxed animate-fade-in">
            &ldquo;{current.quote}&rdquo;
          </p>
          <div key={`a-${active}`} className="mt-4 flex items-center gap-3 animate-fade-in">
            <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-bold text-sm">
              {current.name.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-semibold">{current.name}</div>
              <div className="text-xs text-violet-200">{current.role}</div>
            </div>
          </div>
        </div>

        {/* Carousel dots */}
        <div className="mt-5 flex gap-1.5">
          {QUOTES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Testimonial ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === active ? "w-6 bg-white" : "w-1.5 bg-white/40"}`}
            />
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="relative grid grid-cols-3 gap-4 pt-8 border-t border-white/15">
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-violet-200 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
