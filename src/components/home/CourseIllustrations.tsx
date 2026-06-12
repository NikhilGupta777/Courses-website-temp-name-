"use client";

// ─── CourseIllustrations ────────────────────────────────────────────────────
// Bespoke per-category SVG illustrations used as course-card thumbnails.
// They share a common 16:9 viewBox and the same "playful but technical"
// aesthetic — wireframe shapes, accent dots, subtle grid backgrounds.
//
// Each illustration is a pure component, no props, no state — they're meant
// to be composed inside <TiltCourseCard visual={...} />.

import type { ReactNode } from "react";

interface IllustrationProps {
  /** Tailwind gradient `from`/`to` classes for the BG (overrides default). */
  fromClass?: string;
  toClass?: string;
}

function Frame({ children, fromClass = "from-violet-500", toClass = "to-indigo-600" }: { children: ReactNode } & IllustrationProps) {
  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${fromClass} ${toClass} overflow-hidden`}>
      {/* Grid pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-25" aria-hidden>
        <defs>
          <pattern id="ill-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="white" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ill-grid)" />
      </svg>
      {/* Soft orbs */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/20 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
      {children}
    </div>
  );
}

// ─── ChatGPT category ────────────────────────────────────────────────────
export function ChatGptIllustration() {
  return (
    <Frame fromClass="from-emerald-500" toClass="to-teal-600">
      <svg viewBox="0 0 320 180" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
        {/* Chat bubble row */}
        <g transform="translate(28, 30)">
          {/* Incoming bubble */}
          <rect x="0" y="0" width="180" height="32" rx="14" fill="white" fillOpacity="0.9" />
          <text x="14" y="20" fontFamily="system-ui" fontSize="11" fontWeight="500" fill="#0f766e">How do I write a great prompt?</text>
        </g>
        <g transform="translate(60, 80)">
          <rect x="0" y="0" width="220" height="40" rx="14" fill="white" />
          <text x="14" y="16" fontFamily="system-ui" fontSize="10" fontWeight="500" fill="#0f766e">1. Be specific about the role</text>
          <text x="14" y="30" fontFamily="system-ui" fontSize="10" fontWeight="500" fill="#0f766e">2. Show examples (few-shot)</text>
        </g>
        {/* Sparkle marks */}
        <g fill="white">
          <path d="M 280 30 L 282 35 L 287 36 L 282 38 L 280 43 L 278 38 L 273 36 L 278 35 Z" />
          <path d="M 30 140 L 32 144 L 36 145 L 32 146 L 30 150 L 28 146 L 24 145 L 28 144 Z" />
        </g>
        {/* Cursor blink */}
        <rect x="270" y="92" width="2" height="14" fill="white" className="animate-caret" />
      </svg>
      {/* Logo badge */}
      <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-md text-white text-[10px] font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
        ChatGPT
      </div>
    </Frame>
  );
}

// ─── Image Generation ────────────────────────────────────────────────────
export function ImageGenIllustration() {
  return (
    <Frame fromClass="from-pink-500" toClass="to-fuchsia-700">
      <svg viewBox="0 0 320 180" className="absolute inset-0 w-full h-full">
        {/* Three image tiles fanned out */}
        <g transform="translate(160, 90)">
          {[-1, 0, 1].map((off) => (
            <g key={off} transform={`translate(${off * 70}, ${Math.abs(off) * 6}) rotate(${off * 6})`}>
              <rect x="-44" y="-32" width="88" height="64" rx="6" fill="white" stroke="#f9a8d4" strokeWidth="1" />
              {/* Mock landscape inside */}
              <rect x="-44" y="-32" width="88" height="44" fill="#fdba74" rx="6" />
              <rect x="-44" y="12" width="88" height="20" fill="#86efac" />
              {/* Sun */}
              <circle cx="-22" cy="-14" r="6" fill="#fde047" />
              {/* Mountains */}
              <path d="M -44 12 L -22 -8 L -2 12 Z M 0 12 L 18 -2 L 38 12 Z" fill="#fb923c" />
            </g>
          ))}
        </g>
        {/* Prompt input bubble */}
        <g transform="translate(20, 18)">
          <rect width="180" height="22" rx="11" fill="white" fillOpacity="0.95" />
          <text x="10" y="15" fontFamily="ui-monospace" fontSize="10" fill="#a21caf">
            <tspan fill="#86198f" fontWeight="bold">prompt:</tspan> sunrise mountain
          </text>
        </g>
        {/* Sparkles around the centre tile */}
        <g fill="white">
          <path d="M 160 28 L 162 33 L 167 34 L 162 35 L 160 40 L 158 35 L 153 34 L 158 33 Z" />
          <path d="M 240 130 L 242 134 L 246 135 L 242 136 L 240 140 L 238 136 L 234 135 L 238 134 Z" />
        </g>
      </svg>
      <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-md text-white text-[10px] font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-pink-300" />
        Image Gen
      </div>
    </Frame>
  );
}

// ─── LLMs / Embeddings / RAG ─────────────────────────────────────────────
export function LlmIllustration() {
  return (
    <Frame fromClass="from-violet-600" toClass="to-indigo-800">
      <svg viewBox="0 0 320 180" className="absolute inset-0 w-full h-full">
        {/* Tokenisation visualisation */}
        <g transform="translate(20, 70)">
          {["The", "model", "thinks", "in", "tokens"].map((tok, i) => (
            <g key={tok} transform={`translate(${i * 56}, 0)`}>
              <rect width="48" height="22" rx="4" fill="white" fillOpacity="0.95" />
              <text x="24" y="15" textAnchor="middle" fontFamily="ui-monospace" fontSize="10" fontWeight="600" fill="#5b21b6">{tok}</text>
              {/* Vector arrow below */}
              <line x1="24" y1="22" x2="24" y2="36" stroke="white" strokeWidth="1" strokeDasharray="2 2" />
              <rect x="14" y="36" width="20" height="12" rx="2" fill="white" fillOpacity="0.4" />
            </g>
          ))}
        </g>
        {/* Embedding space dots */}
        <g transform="translate(170, 30)" fill="white">
          {[
            [0, 0], [12, 6], [24, 14], [8, 18], [22, 24], [14, 30], [4, 26],
            [30, 8], [18, 12],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 3 : 2} opacity={0.85} />
          ))}
          {/* Connecting lines (knn) */}
          <line x1="0" y1="0" x2="12" y2="6" stroke="white" strokeWidth="0.5" opacity="0.4" />
          <line x1="12" y1="6" x2="22" y2="24" stroke="white" strokeWidth="0.5" opacity="0.4" />
          <line x1="22" y1="24" x2="30" y2="8" stroke="white" strokeWidth="0.5" opacity="0.4" />
        </g>
      </svg>
      <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-md text-white text-[10px] font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-300" />
        LLM Engineering
      </div>
    </Frame>
  );
}

// ─── Gemini / Multimodal ─────────────────────────────────────────────────
export function GeminiIllustration() {
  return (
    <Frame fromClass="from-blue-500" toClass="to-cyan-600">
      <svg viewBox="0 0 320 180" className="absolute inset-0 w-full h-full">
        {/* Multimodal inputs feeding a star */}
        <g transform="translate(160, 90)">
          {/* Central star */}
          <path d="M 0 -28 L 6 -8 L 28 -4 L 12 8 L 18 28 L 0 18 L -18 28 L -12 8 L -28 -4 L -6 -8 Z" fill="white" />
          {/* Input branches: text, image, audio */}
          <g stroke="white" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.7">
            <line x1="-28" y1="0" x2="-90" y2="-50" />
            <line x1="-28" y1="0" x2="-90" y2="50" />
            <line x1="28" y1="0" x2="90" y2="0" />
          </g>
          {/* Text node */}
          <g transform="translate(-100, -56)">
            <rect width="40" height="14" rx="3" fill="white" />
            <text x="20" y="10" textAnchor="middle" fontFamily="ui-monospace" fontSize="8" fontWeight="700" fill="#1e40af">TEXT</text>
          </g>
          {/* Image node */}
          <g transform="translate(-100, 42)">
            <rect width="40" height="14" rx="3" fill="white" />
            <text x="20" y="10" textAnchor="middle" fontFamily="ui-monospace" fontSize="8" fontWeight="700" fill="#1e40af">IMAGE</text>
          </g>
          {/* Audio node */}
          <g transform="translate(80, -7)">
            <rect width="40" height="14" rx="3" fill="white" />
            <text x="20" y="10" textAnchor="middle" fontFamily="ui-monospace" fontSize="8" fontWeight="700" fill="#1e40af">AUDIO</text>
          </g>
        </g>
      </svg>
      <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-md text-white text-[10px] font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />
        Gemini · Multimodal
      </div>
    </Frame>
  );
}

// ─── Prompting / Prompt Engineering ──────────────────────────────────────
export function PromptingIllustration() {
  return (
    <Frame fromClass="from-violet-500" toClass="to-purple-700">
      <svg viewBox="0 0 320 180" className="absolute inset-0 w-full h-full">
        {/* Code editor panel */}
        <g transform="translate(40, 25)">
          <rect width="240" height="130" rx="8" fill="rgba(0,0,0,0.45)" />
          {/* Window dots */}
          <circle cx="14" cy="14" r="3" fill="#ef4444" />
          <circle cx="26" cy="14" r="3" fill="#eab308" />
          <circle cx="38" cy="14" r="3" fill="#22c55e" />
          {/* Code lines */}
          <text x="14" y="40" fontFamily="ui-monospace" fontSize="9" fill="#a78bfa">{`<role>You are a senior Python engineer</role>`}</text>
          <text x="14" y="56" fontFamily="ui-monospace" fontSize="9" fill="#c4b5fd">{`<task>Refactor the function below.</task>`}</text>
          <text x="14" y="72" fontFamily="ui-monospace" fontSize="9" fill="#fbcfe8">{`<rules>`}</text>
          <text x="22" y="86" fontFamily="ui-monospace" fontSize="9" fill="#e9d5ff">  - keep behaviour identical</text>
          <text x="22" y="100" fontFamily="ui-monospace" fontSize="9" fill="#e9d5ff">  - prefer dataclasses over dicts</text>
          <text x="22" y="114" fontFamily="ui-monospace" fontSize="9" fill="#e9d5ff">  - add type hints</text>
          {/* Cursor */}
          <rect x="184" y="106" width="2" height="10" fill="white" className="animate-caret" />
        </g>
      </svg>
      <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-md text-white text-[10px] font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-300" />
        Prompting
      </div>
    </Frame>
  );
}

// ─── AI for Business ─────────────────────────────────────────────────────
export function BusinessIllustration() {
  return (
    <Frame fromClass="from-amber-500" toClass="to-orange-600">
      <svg viewBox="0 0 320 180" className="absolute inset-0 w-full h-full">
        {/* Upward bar chart */}
        <g transform="translate(40, 30)" fill="white">
          {[28, 44, 62, 88, 116].map((h, i) => (
            <rect key={i} x={i * 36} y={120 - h} width="24" height={h} rx="2" opacity={0.7 + i * 0.06} />
          ))}
        </g>
        {/* Pie/donut */}
        <g transform="translate(220, 75)">
          <circle r="32" fill="none" stroke="white" strokeWidth="14" opacity="0.4" />
          <circle r="32" fill="none" stroke="white" strokeWidth="14"
            strokeDasharray={`${(2 * Math.PI * 32) * 0.7} ${(2 * Math.PI * 32) * 0.3}`}
            transform="rotate(-90)" />
          <text textAnchor="middle" y="6" fontFamily="system-ui" fontSize="14" fontWeight="800" fill="white">70%</text>
        </g>
        {/* Trend label */}
        <g transform="translate(40, 24)">
          <rect width="76" height="18" rx="9" fill="rgba(0,0,0,0.3)" />
          <text x="10" y="12" fontFamily="system-ui" fontSize="9" fontWeight="700" fill="white">Q3 ↑ 142%</text>
        </g>
      </svg>
      <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-md text-white text-[10px] font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-200" />
        AI for Business
      </div>
    </Frame>
  );
}

// ─── Default fallback ────────────────────────────────────────────────────
export function DefaultIllustration() {
  return (
    <Frame fromClass="from-violet-500" toClass="to-indigo-700">
      <svg viewBox="0 0 320 180" className="absolute inset-0 w-full h-full">
        {/* Generic neural network */}
        <g stroke="white" strokeWidth="1" opacity="0.6" fill="white">
          {[60, 110, 160, 210, 260].map((x, i) => (
            <g key={x}>
              {[40, 80, 120].map((y, j) => (
                <circle key={j} cx={x} cy={y} r={4} fillOpacity={0.7 + ((i + j) % 3) * 0.1} />
              ))}
              {i < 4 && [40, 80, 120].map((y1) => (
                [40, 80, 120].map((y2) => (
                  <line key={`${y1}-${y2}`} x1={x} y1={y1} x2={x + 50} y2={y2} strokeWidth="0.4" />
                ))
              ))}
            </g>
          ))}
        </g>
      </svg>
      <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-md text-white text-[10px] font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-300" />
        Course
      </div>
    </Frame>
  );
}

// ─── Picker by slug ──────────────────────────────────────────────────────
export function illustrationFor(slug?: string | null) {
  if (!slug) return <DefaultIllustration />;
  switch (slug) {
    case "chatgpt":          return <ChatGptIllustration />;
    case "image-generation": return <ImageGenIllustration />;
    case "llm":              return <LlmIllustration />;
    case "gemini":           return <GeminiIllustration />;
    case "prompting":        return <PromptingIllustration />;
    case "business-ai":      return <BusinessIllustration />;
    default:                 return <DefaultIllustration />;
  }
}
