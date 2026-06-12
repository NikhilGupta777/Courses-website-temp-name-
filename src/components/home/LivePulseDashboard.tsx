"use client";

// ─── Live Pulse Dashboard ───────────────────────────────────────────────────
// Four animated mini-charts: an animated bar series, an SVG donut, a
// sparkline, and a counter ring. Mimics a "live" platform telemetry panel.

import { useEffect, useRef, useState } from "react";
import { AnimatedCounter } from "./AnimatedCounter";

// ── Bar chart: lessons completed per hour today ───────────────────────────
const HOURS = ["6", "8", "10", "12", "14", "16", "18", "20", "22"];
const HOUR_DATA = [42, 88, 142, 178, 245, 312, 387, 412, 286];
const HOUR_MAX = 450;

// ── Sparkline: enrollment momentum (last 14 days) ─────────────────────────
const SPARK = [42, 51, 47, 60, 78, 71, 95, 110, 124, 118, 142, 168, 195, 234];

function buildSparklinePath(data: number[], w: number, h: number, padding = 4) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const xStep = (w - padding * 2) / (data.length - 1);
  const yScale = (h - padding * 2) / (max - min || 1);
  return data
    .map((v, i) => {
      const x = padding + i * xStep;
      const y = h - padding - (v - min) * yScale;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function buildSparklineArea(data: number[], w: number, h: number, padding = 4) {
  const path = buildSparklinePath(data, w, h, padding);
  return `${path} L ${w - padding} ${h - padding} L ${padding} ${h - padding} Z`;
}

// ── Donut chart: completion rate ──────────────────────────────────────────
function Donut({
  percent,
  size = 120,
  strokeWidth = 12,
  colour = "#7c3aed",
}: {
  percent: number;
  size?: number;
  strokeWidth?: number;
  colour?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ref = useRef<HTMLDivElement | null>(null);
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setTimeout(() => setAnimated(percent), 100);
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [percent]);

  const offset = circumference * (1 - animated / 100);

  return (
    <div ref={ref} className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#ede9fe" strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colour}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">
          <AnimatedCounter to={percent} duration={1600} />%
        </span>
        <span className="text-[10px] text-gray-400 uppercase tracking-wider">Completion</span>
      </div>
    </div>
  );
}

// ── Live counter that ticks up periodically ───────────────────────────────
function LiveTicker({ start }: { start: number }) {
  const [n, setN] = useState(start);

  useEffect(() => {
    const t = setInterval(() => {
      // Random jitter every 4–7s, biased upward
      setN((p) => p + Math.floor(Math.random() * 4) + 1);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent tabular-nums">
        {n.toLocaleString("en-IN")}
      </span>
      <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        Live
      </div>
    </div>
  );
}

export function LivePulseDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* ── Card 1: Lessons / hour bar chart ──────────────────────────── */}
      <div className="relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lessons today</span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-strong" />
            LIVE
          </span>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-3 tabular-nums">
          <AnimatedCounter to={2092} indian />
        </div>
        <div className="flex items-end justify-between gap-1 h-16">
          {HOUR_DATA.map((v, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-violet-500 to-indigo-400 rounded-t-md animate-bar-grow"
              style={{
                height: `${(v / HOUR_MAX) * 100}%`,
                animationDelay: `${i * 70}ms`,
                opacity: 0.7 + (i / HOUR_DATA.length) * 0.3,
              }}
              title={`${HOURS[i]}:00 · ${v} lessons`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1 text-[9px] text-gray-300 tabular-nums">
          <span>{HOURS[0]}h</span>
          <span>{HOURS[Math.floor(HOURS.length / 2)]}h</span>
          <span>{HOURS[HOURS.length - 1]}h</span>
        </div>
      </div>

      {/* ── Card 2: Live ticker + spinning ring ──────────────────────── */}
      <div className="relative bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-5 text-white overflow-hidden">
        <div className="absolute -right-6 -bottom-8 w-32 h-32 rounded-full border-2 border-white/20 animate-spin-slow" />
        <div className="absolute -right-12 -top-8 w-20 h-20 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <span className="text-xs font-semibold text-violet-200 uppercase tracking-wider">Learning right now</span>
          <div className="mt-3 text-4xl font-bold tabular-nums">
            <AnimatedCounter to={1247} duration={2200} />
          </div>
          <div className="mt-1 text-xs text-violet-200">across 28 cities in India</div>

          {/* Avatar dots */}
          <div className="mt-4 flex -space-x-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full border-2 border-violet-700"
                style={{ background: `linear-gradient(135deg, hsl(${260 + i * 10}, 75%, 75%), hsl(${300 + i * 8}, 70%, 80%))` }}
              />
            ))}
            <div className="w-7 h-7 rounded-full bg-white/20 border-2 border-violet-700 flex items-center justify-center text-[10px] font-bold">
              +1k
            </div>
          </div>
        </div>
      </div>

      {/* ── Card 3: Donut completion ───────────────────────────────────── */}
      <div className="relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
        <Donut percent={94} colour="#7c3aed" />
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Course completion</div>
          <div className="mt-2 text-sm text-gray-700 leading-snug">
            <span className="font-bold text-gray-900">9 in 10</span> students<br />
            finish what they start
          </div>
        </div>
      </div>

      {/* ── Card 4: Sparkline ────────────────────────────────────────── */}
      <div className="relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm overflow-hidden">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Daily enrollments</span>
        <div className="mt-1">
          <LiveTicker start={234} />
        </div>
        <div className="mt-3 -mx-1">
          <svg viewBox="0 0 200 60" className="w-full h-16">
            <defs>
              <linearGradient id="sparkArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={buildSparklineArea(SPARK, 200, 60)} fill="url(#sparkArea)" />
            <path
              d={buildSparklinePath(SPARK, 200, 60)}
              fill="none"
              stroke="#7c3aed"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="500"
              strokeDashoffset="500"
              style={{ animation: "draw-path 2s 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards" }}
            />
            {/* End-point glowing dot */}
            <circle cx="196" cy={60 - 4 - ((SPARK[SPARK.length - 1]! - Math.min(...SPARK)) / (Math.max(...SPARK) - Math.min(...SPARK))) * (60 - 8)} r="3.5" fill="#7c3aed" className="animate-pulse-strong" />
          </svg>
        </div>
        <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          +458% this quarter
        </div>
      </div>
    </div>
  );
}
