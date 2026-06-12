"use client";

// ─── Floating 3D certificate showcase ───────────────────────────────────────
// Three certificate cards stacked with offset rotation. The middle one is
// front-and-centre, the others tilt away. Tilts back as the user moves the
// mouse over the container.

import { useRef } from "react";

interface CertCard {
  course: string;
  student: string;
  date: string;
  hue: number;  // base hue for the gradient
  certId: string;
}

const CERTS: CertCard[] = [
  { course: "ChatGPT Mastery", student: "Priya Sharma",    date: "12 May 2026", hue: 270, certId: "LA-104752" },
  { course: "Gemini AI Pro",   student: "Ankit Verma",     date: "08 Apr 2026", hue: 220, certId: "LA-097218" },
  { course: "LLM Fundamentals", student: "Divya Nair",     date: "21 Mar 2026", hue: 320, certId: "LA-088301" },
];

export function CertificateShowcase() {
  const ref = useRef<HTMLDivElement | null>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width  - 0.5;
    const py = (e.clientY - rect.top)  / rect.height - 0.5;
    node.style.setProperty("--rx", `${(-py * 8).toFixed(2)}deg`);
    node.style.setProperty("--ry", `${(px * 12).toFixed(2)}deg`);
  }

  function onLeave() {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--rx", "0deg");
    node.style.setProperty("--ry", "0deg");
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative perspective-1000"
      style={{
        ["--rx" as string]: "0deg",
        ["--ry" as string]: "0deg",
      } as React.CSSProperties}
    >
      <div
        className="relative h-[420px] flex items-center justify-center"
        style={{
          transform: "rotateX(var(--rx)) rotateY(var(--ry))",
          transformStyle: "preserve-3d",
          transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {CERTS.map((c, i) => {
          // Stack offset: -1 (left), 0 (center), 1 (right)
          const off = i - 1;
          return (
            <div
              key={c.course}
              className="absolute w-[340px] h-[230px] rounded-2xl shadow-2xl overflow-hidden border border-white/40 animate-float-sway"
              style={{
                transform: `translateX(${off * 90}px) translateY(${Math.abs(off) * 10}px) translateZ(${-Math.abs(off) * 60}px) rotate(${off * 5}deg)`,
                zIndex: 10 - Math.abs(off),
                animationDelay: `${i * 0.7}s`,
              }}
            >
              {/* Gradient background */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, hsl(${c.hue} 90% 95%) 0%, hsl(${c.hue + 30} 95% 90%) 100%)`,
                }}
              />
              {/* Top band */}
              <div
                className="absolute top-0 inset-x-0 h-12 px-4 flex items-center justify-between"
                style={{ background: `linear-gradient(135deg, hsl(${c.hue} 75% 50%), hsl(${c.hue + 30} 70% 55%))` }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                  </div>
                  <span className="text-white text-sm font-bold tracking-wide">LearnAI</span>
                </div>
                <span className="text-[9px] text-white/80 uppercase tracking-widest font-bold">Certificate</span>
              </div>

              {/* Body */}
              <div className="absolute inset-x-0 top-12 bottom-0 p-4 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center shadow-md mb-2">
                  <svg className="w-5 h-5 text-yellow-900" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9H4.5a2.5 2.5 0 010-5H6" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9h1.5a2.5 2.5 0 000-5H18" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 22h16" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 2H6v7a6 6 0 0012 0V2z" />
                  </svg>
                </div>
                <div className="text-[9px] tracking-widest font-semibold text-gray-500 uppercase">Certificate of Completion</div>
                <div className="text-base font-bold text-gray-900 mt-1">{c.student}</div>
                <div className="text-[10px] text-gray-500">has completed</div>
                <div className="text-sm font-bold mt-1" style={{ color: `hsl(${c.hue} 65% 45%)` }}>{c.course}</div>
                <div className="text-[9px] text-gray-400 mt-2">{c.date} · ID #{c.certId}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Verified-by row */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Recognised by</div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {["Razorpay", "Flipkart", "Swiggy", "Infosys", "TCS"].map((c) => (
            <div key={c} className="px-3 py-1.5 bg-white border border-gray-100 rounded-full text-xs font-bold text-gray-600 shadow-sm">
              {c}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
