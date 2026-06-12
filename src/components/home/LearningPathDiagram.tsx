"use client";

// ─── Learning Path Diagram ──────────────────────────────────────────────────
// SVG curved path with stops at each milestone. Hovering a stop expands
// course chips beneath it. Animated path-draw on scroll-into-view.

import { useEffect, useRef, useState } from "react";

interface Stop {
  id: string;
  label: string;
  level: string;
  hours: string;
  courses: string[];
  outcomes: string;
  colour: string;
  emoji: string;
}

const STOPS: Stop[] = [
  {
    id: "start",
    label: "Start Here",
    level: "Beginner",
    hours: "10 hrs",
    courses: ["AI Prompting Fundamentals", "ChatGPT Basics", "AI Tools for Everyday"],
    outcomes: "Understand AI vocabulary, write your first prompts, automate daily tasks.",
    colour: "from-emerald-400 to-teal-500",
    emoji: "1",
  },
  {
    id: "build",
    label: "Build Skills",
    level: "Intermediate",
    hours: "40 hrs",
    courses: ["Prompt Engineering", "Gemini AI Mastery", "Image Generation", "Midjourney Pro"],
    outcomes: "Build real workflows, ship images & content, save 10+ hrs/week.",
    colour: "from-violet-400 to-indigo-500",
    emoji: "2",
  },
  {
    id: "advance",
    label: "Go Advanced",
    level: "Advanced",
    hours: "80 hrs",
    courses: ["LLM Fundamentals", "Embeddings & RAG", "AI Chatbot Builder", "Voice AI"],
    outcomes: "Build custom AI apps, fine-tune models, deploy production agents.",
    colour: "from-fuchsia-400 to-pink-500",
    emoji: "3",
  },
  {
    id: "career",
    label: "Land a Job",
    level: "Career",
    hours: "Live + projects",
    courses: ["AI for Business", "Career Mentorship", "Portfolio Reviews", "Mock Interviews"],
    outcomes: "₹3.2L average salary bump · 78% land an AI role within 6 months.",
    colour: "from-amber-400 to-orange-500",
    emoji: "★",
  },
];

export function LearningPathDiagram() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [drawn, setDrawn] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setDrawn(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  const W = 1100;
  const H = 320;

  // Stop positions along the path
  const stopPos = STOPS.map((_, i) => {
    const x = 110 + (i * (W - 220)) / (STOPS.length - 1);
    const y = i % 2 === 0 ? 100 : 200;
    return { x, y };
  });

  // Build a smooth bezier path through the stops
  const pathD = stopPos.reduce((acc, p, i, arr) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = arr[i - 1]!;
    const cp1x = prev.x + (p.x - prev.x) / 2;
    const cp2x = prev.x + (p.x - prev.x) / 2;
    return `${acc} C ${cp1x} ${prev.y}, ${cp2x} ${p.y}, ${p.x} ${p.y}`;
  }, "");

  return (
    <div ref={ref} className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        <defs>
          <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#10b981" />
            <stop offset="33%"  stopColor="#7c3aed" />
            <stop offset="66%"  stopColor="#ec4899" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        {/* Background dashed track */}
        <path d={pathD} fill="none" stroke="#e5e7eb" strokeWidth="3" strokeDasharray="8 6" strokeLinecap="round" />

        {/* Coloured drawing path */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#pathGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="3000"
          strokeDashoffset={drawn ? 0 : 3000}
          style={{ transition: "stroke-dashoffset 2.6s cubic-bezier(0.22, 1, 0.36, 1)" }}
        />

        {/* Walking dot along the path */}
        {drawn && (
          <circle r="8" fill="white" stroke="#7c3aed" strokeWidth="3">
            <animateMotion dur="6s" repeatCount="indefinite" path={pathD} rotate="auto" />
          </circle>
        )}

        {/* Stops */}
        {stopPos.map((p, i) => {
          const s = STOPS[i]!;
          const isHovered = hovered === s.id;
          return (
            <g key={s.id} onMouseEnter={() => setHovered(s.id)} onMouseLeave={() => setHovered(null)} style={{ cursor: "pointer" }}>
              {/* Pulsing ring */}
              <circle cx={p.x} cy={p.y} r={isHovered ? 36 : 28} fill="none" stroke="url(#pathGrad)" strokeWidth="2" opacity={isHovered ? 0.7 : 0.3} style={{ transition: "all 0.3s" }} />
              {/* Filled circle */}
              <circle cx={p.x} cy={p.y} r={isHovered ? 26 : 22} fill="white" stroke="#7c3aed" strokeWidth="3" style={{ transition: "all 0.3s" }} />
              <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill="#7c3aed" fontFamily="system-ui">{s.emoji}</text>
              {/* Label */}
              <text x={p.x} y={p.y + 50} textAnchor="middle" fontSize="13" fontWeight="700" fill="#1f2937" fontFamily="system-ui">{s.label}</text>
              <text x={p.x} y={p.y + 66} textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily="system-ui">{s.level} · {s.hours}</text>
            </g>
          );
        })}
      </svg>

      {/* Hover-tooltip card (positioned beneath the diagram) */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        {STOPS.map((s) => (
          <div
            key={s.id}
            onMouseEnter={() => setHovered(s.id)}
            onMouseLeave={() => setHovered(null)}
            className={`group rounded-2xl p-4 border transition-all cursor-pointer ${
              hovered === s.id
                ? "border-violet-300 shadow-lg scale-[1.02] bg-white"
                : "border-gray-100 bg-white/70 hover:bg-white"
            }`}
          >
            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br ${s.colour} text-white font-bold text-sm mb-2 shadow`}>
              {s.emoji}
            </div>
            <div className="font-bold text-gray-900 text-sm">{s.label}</div>
            <div className="text-[11px] text-violet-600 font-semibold uppercase tracking-wide mb-2">{s.level}</div>
            <div className="space-y-1 mb-3">
              {s.courses.map((c) => (
                <div key={c} className="text-xs text-gray-600 flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {c}
                </div>
              ))}
            </div>
            <div className="text-[11px] text-gray-500 italic leading-snug">{s.outcomes}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
