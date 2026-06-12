"use client";

// ─── India Map Heatmap ──────────────────────────────────────────────────────
// SVG outline of India with animated pulsing dots over major cities. Each
// city has a "current learners" count that ticks up. Hovering a dot shows a
// tooltip with the city name + count + most-popular course.

import { useEffect, useState } from "react";
import { AnimatedCounter } from "./AnimatedCounter";

// Approximate city positions inside the simplified India SVG path
// (viewBox 0 0 600 700). Hand-tuned so they sit on the right place.
interface City {
  name: string;
  state: string;
  cx: number;
  cy: number;
  baseLearners: number;
  popularCourse: string;
  /** Tier-1 cities pulse stronger */
  tier: 1 | 2;
}

const CITIES: City[] = [
  { name: "Mumbai",      state: "MH", cx: 145, cy: 380, baseLearners: 1247, popularCourse: "AI for Business",       tier: 1 },
  { name: "Delhi",       state: "DL", cx: 240, cy: 195, baseLearners: 1098, popularCourse: "ChatGPT Mastery",       tier: 1 },
  { name: "Bangalore",   state: "KA", cx: 215, cy: 535, baseLearners: 1654, popularCourse: "LLM Fundamentals",      tier: 1 },
  { name: "Hyderabad",   state: "TS", cx: 248, cy: 480, baseLearners: 842,  popularCourse: "Embeddings & RAG",      tier: 1 },
  { name: "Chennai",     state: "TN", cx: 268, cy: 575, baseLearners: 712,  popularCourse: "Voice AI",              tier: 1 },
  { name: "Pune",        state: "MH", cx: 168, cy: 405, baseLearners: 528,  popularCourse: "Gemini AI Pro",         tier: 1 },
  { name: "Kolkata",     state: "WB", cx: 408, cy: 320, baseLearners: 487,  popularCourse: "AI Chatbot Builder",    tier: 1 },
  { name: "Ahmedabad",   state: "GJ", cx: 135, cy: 295, baseLearners: 364,  popularCourse: "AI for Business",       tier: 2 },
  { name: "Jaipur",      state: "RJ", cx: 195, cy: 250, baseLearners: 312,  popularCourse: "Prompt Engineering",    tier: 2 },
  { name: "Lucknow",     state: "UP", cx: 290, cy: 245, baseLearners: 286,  popularCourse: "ChatGPT Mastery",       tier: 2 },
  { name: "Indore",      state: "MP", cx: 195, cy: 335, baseLearners: 248,  popularCourse: "Image Generation",      tier: 2 },
  { name: "Chandigarh",  state: "PB", cx: 215, cy: 145, baseLearners: 198,  popularCourse: "LLM Fundamentals",      tier: 2 },
  { name: "Bhubaneswar", state: "OD", cx: 365, cy: 380, baseLearners: 174,  popularCourse: "AI Tools Everyday",     tier: 2 },
  { name: "Guwahati",    state: "AS", cx: 470, cy: 250, baseLearners: 142,  popularCourse: "Free: Prompting",       tier: 2 },
  { name: "Kochi",       state: "KL", cx: 215, cy: 615, baseLearners: 226,  popularCourse: "Voice AI",              tier: 2 },
];

// Heavily simplified India outline. Not cartographically perfect — chosen
// for visual recognisability over geographic precision.
const INDIA_PATH =
  "M 215 95 L 250 88 L 295 95 L 320 110 L 348 105 L 365 115 L 380 130 L 410 135 L 435 145 L 455 165 L 470 195 L 478 230 L 485 255 L 478 290 L 465 318 L 450 340 L 432 370 L 412 395 L 395 420 L 372 442 L 348 460 L 322 472 L 295 482 L 270 510 L 258 545 L 248 580 L 232 615 L 218 640 L 200 625 L 195 595 L 190 570 L 195 538 L 200 510 L 195 482 L 178 458 L 158 432 L 148 408 L 138 380 L 132 348 L 128 318 L 130 290 L 125 260 L 118 232 L 122 205 L 130 180 L 142 160 L 158 140 L 175 122 L 195 108 L 215 95 Z";

export function IndiaMapHeatmap() {
  const [tick, setTick] = useState(0);
  const [hoveredCity, setHoveredCity] = useState<City | null>(null);

  // Increment a counter every 4s so the city numbers visibly tick up
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 4000);
    return () => clearInterval(t);
  }, []);

  // Total learners online right now (sum of all city counts + drift)
  const totalLearners = CITIES.reduce((sum, c) => sum + c.baseLearners, 0) + tick * 7;

  return (
    <div className="relative bg-gradient-to-br from-slate-50 to-violet-50/50 rounded-3xl border border-violet-100 overflow-hidden shadow-xl shadow-violet-500/5">
      {/* Header strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 lg:px-8 pt-6 lg:pt-8 pb-4">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-violet-600">Live across India</span>
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1">
            <AnimatedCounter to={totalLearners} indian />{" "}
            <span className="text-gray-600 font-bold">learners online</span>
          </h3>
          <p className="text-sm text-gray-500 mt-1">28 cities · 14 states · 100% Indian-built curriculum</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
          <span className="relative flex w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping" />
            <span className="rounded-full bg-emerald-500 w-2 h-2" />
          </span>
          Streaming live
        </div>
      </div>

      <div className="relative pb-6 lg:pb-8 px-4 lg:px-8">
        <svg viewBox="0 0 600 700" className="w-full h-auto max-h-[600px]" aria-label="Map of India showing active learners">
          <defs>
            <linearGradient id="indiaFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#ddd6fe" stopOpacity="0.6" />
              <stop offset="50%"  stopColor="#c4b5fd" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.3" />
            </linearGradient>
            <radialGradient id="cityGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor="#fff" stopOpacity="1" />
              <stop offset="40%" stopColor="#a78bfa" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
            </radialGradient>
            <filter id="cityFilter" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>

          {/* India outline */}
          <path
            d={INDIA_PATH}
            fill="url(#indiaFill)"
            stroke="#8b5cf6"
            strokeWidth="1.5"
            strokeLinejoin="round"
            opacity="0.9"
          />

          {/* Internal state-line texture (decorative) */}
          <g stroke="#a78bfa" strokeWidth="0.5" opacity="0.25" fill="none">
            <path d="M 215 95 L 240 195 L 220 320 L 215 535 L 232 615" />
            <path d="M 250 88 L 290 245 L 248 480 L 268 575" />
            <path d="M 295 95 L 348 105 L 408 320 L 372 442" />
            <path d="M 145 380 L 240 195 L 408 320" />
          </g>

          {/* Connection lines from Bangalore to other tier-1 cities */}
          {(() => {
            const blr = CITIES.find((c) => c.name === "Bangalore")!;
            return CITIES.filter((c) => c.tier === 1 && c.name !== "Bangalore").map((c) => (
              <line
                key={`hub-${c.name}`}
                x1={blr.cx}
                y1={blr.cy}
                x2={c.cx}
                y2={c.cy}
                stroke="#a78bfa"
                strokeWidth="0.4"
                strokeDasharray="2 4"
                opacity="0.4"
              />
            ));
          })()}

          {/* City pulse dots */}
          {CITIES.map((city, i) => {
            const radius = city.tier === 1 ? 5 : 3.5;
            const haloRadius = city.tier === 1 ? 18 : 12;
            const animDelay = (i * 0.31) % 4;
            return (
              <g
                key={city.name}
                onMouseEnter={() => setHoveredCity(city)}
                onMouseLeave={() => setHoveredCity(null)}
                style={{ cursor: "pointer" }}
              >
                {/* Outermost pulse ring */}
                <circle cx={city.cx} cy={city.cy} r={haloRadius} fill="url(#cityGlow)" opacity="0.5">
                  <animate
                    attributeName="r"
                    values={`${radius * 1.5};${haloRadius};${radius * 1.5}`}
                    dur="3s"
                    begin={`${animDelay}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.6;0;0.6"
                    dur="3s"
                    begin={`${animDelay}s`}
                    repeatCount="indefinite"
                  />
                </circle>
                {/* Inner solid dot */}
                <circle
                  cx={city.cx}
                  cy={city.cy}
                  r={radius}
                  fill="#7c3aed"
                  filter="url(#cityFilter)"
                />
                <circle
                  cx={city.cx}
                  cy={city.cy}
                  r={radius * 0.55}
                  fill="white"
                />
                {/* Label for tier-1 cities only (avoid clutter) */}
                {city.tier === 1 && (
                  <g pointerEvents="none">
                    <text
                      x={city.cx + 9}
                      y={city.cy + 4}
                      fontSize="11"
                      fontWeight="700"
                      fill="#1f2937"
                      fontFamily="system-ui"
                      style={{ paintOrder: "stroke", stroke: "white", strokeWidth: 3, strokeLinejoin: "round" }}
                    >
                      {city.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover tooltip */}
        {hoveredCity && (
          <div
            className="absolute pointer-events-none bg-gray-900 text-white rounded-xl p-3 shadow-2xl text-xs animate-fade-in z-10"
            style={{
              left: `${(hoveredCity.cx / 600) * 100}%`,
              top: `${((hoveredCity.cy - 60) / 700) * 100}%`,
              transform: "translate(-50%, -100%)",
              minWidth: 180,
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-strong" />
              <span className="font-bold text-sm">{hoveredCity.name}, {hoveredCity.state}</span>
            </div>
            <div className="text-violet-300 font-bold text-lg leading-tight">
              {(hoveredCity.baseLearners + Math.floor(tick * (hoveredCity.tier === 1 ? 0.7 : 0.3))).toLocaleString("en-IN")}
            </div>
            <div className="text-gray-400 text-[10px]">learners online now</div>
            <div className="mt-1.5 pt-1.5 border-t border-white/10 text-[10px] text-gray-300">
              <span className="text-gray-500">Top course:</span> {hoveredCity.popularCourse}
            </div>
            {/* Pointer triangle */}
            <div
              className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-gray-900 rotate-45"
            />
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-gray-100 shadow-sm">
          <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">Legend</div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />
              <span className="text-[10px] text-gray-600">Tier-1 city</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              <span className="text-[10px] text-gray-600">Tier-2 city</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
