"use client";

// ─── Career Outcomes Chart ──────────────────────────────────────────────────
// Big SVG line/area chart showing average salary growth before vs after
// LearnAI, with animated path drawing on scroll-into-view.

import { useEffect, useRef, useState } from "react";
import { AnimatedCounter } from "./AnimatedCounter";

// Synthetic but realistic data. X = months since starting LearnAI.
const SERIES_BEFORE = [4.2, 4.3, 4.3, 4.4, 4.4, 4.5, 4.5, 4.6];
const SERIES_AFTER  = [4.5, 4.9, 5.6, 6.4, 7.1, 7.5, 7.8, 7.9];
const MONTHS = ["Start", "M1", "M3", "M6", "M9", "M12", "M18", "M24"];

function lineP(data: number[], w: number, h: number, padX = 50, padY = 30) {
  const max = Math.max(...SERIES_BEFORE, ...SERIES_AFTER);
  const min = Math.min(...SERIES_BEFORE, ...SERIES_AFTER) * 0.85;
  const xStep = (w - padX * 2) / (data.length - 1);
  const yScale = (h - padY * 2) / (max - min);
  return data
    .map((v, i) => {
      const x = padX + i * xStep;
      const y = h - padY - (v - min) * yScale;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function areaP(data: number[], w: number, h: number, padX = 50, padY = 30) {
  return `${lineP(data, w, h, padX, padY)} L ${w - padX} ${h - padY} L ${padX} ${h - padY} Z`;
}

export function OutcomesChart() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  const W = 800;
  const H = 360;

  return (
    <div ref={ref} className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-violet-500/5 p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-4">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-violet-600">Career Outcomes</span>
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1.5">
            Average salary doubles within 18 months
          </h3>
          <p className="text-sm text-gray-500 mt-1">Based on 1,847 alumni surveys (2023 – 2026)</p>
        </div>
        <div className="flex flex-row lg:flex-col items-start gap-4 lg:gap-1">
          <div>
            <div className="text-3xl font-bold text-emerald-600 leading-none">
              +<AnimatedCounter to={68} />%
            </div>
            <div className="text-xs text-gray-500">avg salary increase</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-violet-600 leading-none">
              ₹<AnimatedCounter to={3.2} decimals={1} />L
            </div>
            <div className="text-xs text-gray-500">average bump per learner</div>
          </div>
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          <defs>
            <linearGradient id="afterArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="beforeArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0" />
            </linearGradient>
            <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>

          {/* Y-axis grid */}
          {[0, 1, 2, 3, 4].map((g) => {
            const y = 30 + g * ((H - 60) / 4);
            return (
              <g key={g}>
                <line x1={50} y1={y} x2={W - 50} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                <text x={45} y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="11" fontFamily="system-ui">
                  ₹{(8 - g * 1).toFixed(0)}L
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {MONTHS.map((m, i) => {
            const x = 50 + (i * (W - 100)) / (MONTHS.length - 1);
            return (
              <text key={m} x={x} y={H - 8} textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="system-ui">
                {m}
              </text>
            );
          })}

          {/* Before — flat dashed grey line */}
          <path d={areaP(SERIES_BEFORE, W, H)} fill="url(#beforeArea)" />
          <path
            d={lineP(SERIES_BEFORE, W, H)}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeDasharray="6 4"
            strokeLinecap="round"
            opacity={visible ? 1 : 0}
            style={{ transition: "opacity 0.8s 0.2s" }}
          />

          {/* After — green area + drawing line */}
          <path
            d={areaP(SERIES_AFTER, W, H)}
            fill="url(#afterArea)"
            opacity={visible ? 1 : 0}
            style={{ transition: "opacity 1.4s 0.7s" }}
          />
          <path
            d={lineP(SERIES_AFTER, W, H)}
            fill="none"
            stroke="#10b981"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="2000"
            strokeDashoffset={visible ? 0 : 2000}
            style={{ transition: "stroke-dashoffset 2.4s cubic-bezier(0.22, 1, 0.36, 1) 0.3s" }}
            filter="url(#lineGlow)"
          />
          <path
            d={lineP(SERIES_AFTER, W, H)}
            fill="none"
            stroke="#10b981"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="2000"
            strokeDashoffset={visible ? 0 : 2000}
            style={{ transition: "stroke-dashoffset 2.4s cubic-bezier(0.22, 1, 0.36, 1) 0.3s" }}
          />

          {/* Data points on the after-line */}
          {visible && SERIES_AFTER.map((v, i) => {
            const max = Math.max(...SERIES_BEFORE, ...SERIES_AFTER);
            const min = Math.min(...SERIES_BEFORE, ...SERIES_AFTER) * 0.85;
            const x = 50 + (i * (W - 100)) / (SERIES_AFTER.length - 1);
            const y = H - 30 - (v - min) * ((H - 60) / (max - min));
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="6" fill="white" stroke="#10b981" strokeWidth="2.5" style={{ animation: `bar-grow 0.4s ${0.6 + i * 0.12}s both` }} />
              </g>
            );
          })}

          {/* Legend */}
          <g transform={`translate(${W - 240}, 30)`}>
            <rect x="-8" y="-8" width="220" height="50" rx="10" fill="white" stroke="#f1f5f9" />
            <line x1="0" y1="6" x2="20" y2="6" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" />
            <text x="26" y="10" fill="#475569" fontSize="11" fontFamily="system-ui">Without LearnAI (industry avg)</text>
            <line x1="0" y1="26" x2="20" y2="26" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
            <text x="26" y="30" fill="#475569" fontSize="11" fontFamily="system-ui">After completing LearnAI</text>
          </g>
        </svg>
      </div>

      {/* Story chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
        {[
          { name: "Ankit V.",   role: "ML Engineer @ Razorpay",  jump: "₹6 → ₹14 LPA",  city: "Bangalore" },
          { name: "Divya N.",   role: "Lead, Marketing @ Swiggy", jump: "₹8 → ₹16 LPA",  city: "Mumbai" },
          { name: "Rohit G.",   role: "AI Eng. @ Flipkart",       jump: "Internship → ₹18 LPA", city: "Delhi" },
        ].map((s) => (
          <div key={s.name} className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                {s.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{s.name} · {s.city}</div>
                <div className="text-xs text-gray-500">{s.role}</div>
              </div>
            </div>
            <div className="mt-3 inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-xs font-bold text-emerald-700">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              {s.jump}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
