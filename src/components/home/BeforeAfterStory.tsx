"use client";

// ─── BeforeAfterStory ───────────────────────────────────────────────────────
// A scroll-pinned narrative with three phases (Stuck → Learning → Hired).
// The left side stays sticky; the right side cycles through phase content
// based on which "act" is currently in view. Each act has a duration of one
// viewport, so the user "scrubs" through the story by scrolling.

import { useEffect, useRef, useState } from "react";

interface Phase {
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  bg: string;        // gradient class for the right card
  metrics: Array<{ label: string; value: string; trend?: "up" | "down" | "flat" }>;
  scene: "stuck" | "learning" | "hired";
}

const PHASES: Phase[] = [
  {
    emoji: "😩",
    title: "Stuck.",
    subtitle: "Watching tutorials. Forgetting them by Tuesday.",
    description:
      "You've watched 14 hours of YouTube on ChatGPT. You bought one Udemy course you never finished. You feel behind. Every LinkedIn post about 'AI is changing everything' just makes it worse.",
    bg: "from-slate-700 via-slate-800 to-gray-900",
    metrics: [
      { label: "Skills shipped",     value: "0",      trend: "flat" },
      { label: "Confidence",         value: "Low",    trend: "down" },
      { label: "Career growth",      value: "—",      trend: "flat" },
    ],
    scene: "stuck",
  },
  {
    emoji: "🚀",
    title: "Learning.",
    subtitle: "60 min/day. Real projects. Real feedback.",
    description:
      "You start with our free course. Within a week, you've shipped your first prompt-engineering project. The AI Tutor explains every concept that confuses you. You attend Saturday's live class. You feel the gears turning.",
    bg: "from-violet-600 via-purple-600 to-indigo-700",
    metrics: [
      { label: "Days streak",        value: "23",     trend: "up" },
      { label: "Projects shipped",   value: "4",      trend: "up" },
      { label: "Quizzes passed",     value: "12/14",  trend: "up" },
    ],
    scene: "learning",
  },
  {
    emoji: "🎯",
    title: "Hired.",
    subtitle: "₹14 LPA. AI engineer. Done.",
    description:
      "Six months later, your portfolio has 8 production-grade AI projects. You ace technical interviews. You join a team building real products. Your salary doubles. You're the person on LinkedIn other people now read.",
    bg: "from-emerald-500 via-teal-500 to-cyan-600",
    metrics: [
      { label: "Salary uplift",      value: "+233%",  trend: "up" },
      { label: "Days to first AI role", value: "147",    trend: "up" },
      { label: "Career trajectory",  value: "🚀",     trend: "up" },
    ],
    scene: "hired",
  },
];

export function BeforeAfterStory() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Drive the active phase from scroll position relative to the section.
  // We treat the section as 3 viewport-heights tall and split it into 3
  // equal chunks, each one rendering its phase.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let raf: number | null = null;
    function update() {
      const rect = section!.getBoundingClientRect();
      const sectionH = rect.height;
      const viewport = window.innerHeight;
      // Progress through the section: 0 when top hits viewport, 1 when bottom leaves
      const total = sectionH - viewport;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / Math.max(1, total)));
      // Bias the phase change to land squarely in the middle of each third
      const idx = progress < 0.34 ? 0 : progress < 0.67 ? 1 : 2;
      setActiveIndex(idx);
    }
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        update();
      });
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // The active phase data is read directly from PHASES inside the render loop
  // below; we no longer need a separate variable here.

  return (
    <section ref={sectionRef} className="relative bg-white" style={{ minHeight: "300vh" }}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* ── Left: narrative ────────────────────────────── */}
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-violet-600">A 6-month story</span>
              <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mt-2 leading-[0.95]">
                From <span className="text-slate-400">stuck</span><br />
                to <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">hired.</span>
              </h2>
              <p className="mt-6 text-lg text-gray-600 max-w-xl leading-relaxed">
                Scroll through the journey of a typical LearnAI student — from spinning their wheels on YouTube tutorials, through 6 months of focused learning, to landing an AI role.
              </p>

              {/* Phase progress strip */}
              <div className="mt-8 flex items-center gap-2">
                {PHASES.map((p, i) => (
                  <div key={p.scene} className="flex items-center gap-2 flex-1">
                    <button
                      onClick={() => {
                        // Scroll to the corresponding section third
                        const section = sectionRef.current;
                        if (!section) return;
                        const top = section.offsetTop + (section.offsetHeight - window.innerHeight) * (i === 0 ? 0.0 : i === 1 ? 0.5 : 1.0);
                        window.scrollTo({ top, behavior: "smooth" });
                      }}
                      className={`flex-1 h-1.5 rounded-full transition-all ${
                        i <= activeIndex ? "bg-violet-600" : "bg-gray-200"
                      }`}
                      aria-label={`Jump to phase: ${p.title}`}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 text-xs text-gray-400 font-semibold">
                {PHASES.map((p, i) => (
                  <span
                    key={p.scene}
                    className={i === activeIndex ? "text-violet-600" : ""}
                  >
                    Act {i + 1}
                  </span>
                ))}
              </div>

              <div className="mt-8 hidden lg:block text-xs text-gray-400 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                Keep scrolling to advance the story
              </div>
            </div>

            {/* ── Right: phase card with crossfade ────────────── */}
            <div className="relative h-[500px] lg:h-[560px]">
              {PHASES.map((p, i) => (
                <div
                  key={p.scene}
                  className={`absolute inset-0 transition-all duration-700 ${
                    i === activeIndex
                      ? "opacity-100 translate-y-0 scale-100"
                      : i < activeIndex
                        ? "opacity-0 -translate-y-8 scale-95 pointer-events-none"
                        : "opacity-0 translate-y-8 scale-95 pointer-events-none"
                  }`}
                >
                  <PhaseCard phase={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhaseCard({ phase }: { phase: Phase }) {
  return (
    <div className={`relative h-full rounded-3xl bg-gradient-to-br ${phase.bg} p-8 lg:p-10 text-white shadow-2xl overflow-hidden`}>
      {/* Decorative orbs */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />

      <div className="relative h-full flex flex-col justify-between">
        <div>
          <div className="text-5xl mb-4">{phase.emoji}</div>
          <h3 className="text-4xl lg:text-5xl font-black tracking-tight">{phase.title}</h3>
          <p className="mt-2 text-lg text-white/80 font-semibold">{phase.subtitle}</p>
          <p className="mt-5 text-base text-white/70 leading-relaxed max-w-md">
            {phase.description}
          </p>
        </div>

        {/* Phase-specific scene illustration */}
        <PhaseScene scene={phase.scene} />

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {phase.metrics.map((m) => (
            <div key={m.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <div className="text-2xl font-black tabular-nums">{m.value}</div>
              <div className="text-[10px] text-white/60 uppercase tracking-wider mt-0.5">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PhaseScene({ scene }: { scene: Phase["scene"] }) {
  // Tiny illustrative SVG per phase. Same dimensions so the layout stays put
  // when crossfading.
  if (scene === "stuck") {
    return (
      <svg viewBox="0 0 200 60" className="w-full h-12 my-4 opacity-60">
        {/* Flat squiggle line going nowhere */}
        <path d="M 0 30 Q 25 25, 50 30 T 100 30 T 150 30 T 200 30" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        {[20, 60, 100, 140, 180].map((x, i) => (
          <circle key={i} cx={x} cy={30} r="3" fill="white" opacity="0.6" />
        ))}
      </svg>
    );
  }
  if (scene === "learning") {
    return (
      <svg viewBox="0 0 200 60" className="w-full h-12 my-4">
        {/* Rising line with momentum */}
        <path d="M 0 50 Q 40 48, 60 38 T 120 22 T 200 8" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="200" cy="8" r="4" fill="white" className="animate-pulse-strong" />
      </svg>
    );
  }
  // hired
  return (
    <svg viewBox="0 0 200 60" className="w-full h-12 my-4">
      {/* Sharp upward curve */}
      <defs>
        <linearGradient id="hiredLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path d="M 0 55 L 40 50 L 80 40 L 120 28 L 160 14 L 200 4" fill="none" stroke="url(#hiredLine)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="200" cy="4" r="5" fill="white" className="animate-pulse-strong" />
      <text x="172" y="20" fill="white" fontSize="8" fontWeight="700" fontFamily="system-ui">+233%</text>
    </svg>
  );
}
