"use client";

// ─── Live class real-ticking countdown ──────────────────────────────────────
// Counts down to a target ISO date string. Used inside the live-class promo
// section so the cards feel alive.

import { useEffect, useMemo, useState } from "react";

interface CountdownTimerProps {
  target: string | Date;
  /** Compact one-line render for small cards. */
  compact?: boolean;
}

function diff(target: Date) {
  const ms = target.getTime() - Date.now();
  if (ms <= 0) return null;
  const totalSec = Math.floor(ms / 1000);
  return {
    days:    Math.floor(totalSec / 86400),
    hours:   Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
  };
}

export function CountdownTimer({ target, compact = false }: CountdownTimerProps) {
  // Memoise the Date so the useEffect dependency is stable across re-renders
  // even when the parent passes a string each render.
  const date = useMemo(
    () => (target instanceof Date ? target : new Date(target)),
    [target],
  );
  const [parts, setParts] = useState(() => diff(date));

  useEffect(() => {
    const t = setInterval(() => setParts(diff(date)), 1000);
    return () => clearInterval(t);
  }, [date]);

  if (!parts) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-500">
        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse-strong" />
        LIVE NOW
      </span>
    );
  }

  if (compact) {
    return (
      <span className="text-xs font-mono font-bold text-violet-700 tabular-nums">
        {parts.days > 0 && `${parts.days}d `}
        {String(parts.hours).padStart(2, "0")}:{String(parts.minutes).padStart(2, "0")}:{String(parts.seconds).padStart(2, "0")}
      </span>
    );
  }

  const tiles = [
    { label: "days",  value: parts.days },
    { label: "hrs",   value: parts.hours },
    { label: "min",   value: parts.minutes },
    { label: "sec",   value: parts.seconds },
  ];

  return (
    <div className="flex items-center gap-1.5">
      {tiles.map((t) => (
        <div key={t.label} className="flex flex-col items-center justify-center min-w-[42px] px-2 py-1.5 bg-white/15 rounded-lg backdrop-blur-sm border border-white/20">
          <span className="text-base font-bold text-white tabular-nums leading-none">
            {String(t.value).padStart(2, "0")}
          </span>
          <span className="text-[8px] text-violet-200 uppercase tracking-wider mt-0.5">{t.label}</span>
        </div>
      ))}
    </div>
  );
}
