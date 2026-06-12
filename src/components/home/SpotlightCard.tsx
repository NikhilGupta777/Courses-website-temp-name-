"use client";

// ─── SpotlightCard ──────────────────────────────────────────────────────────
// A wrapper that gives any card a soft radial gradient that follows the
// cursor — the kind of premium hover effect Linear, Vercel, and Stripe use.
// CSS variables are the only mutation, so it's GPU-accelerated.

import { useRef, type ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  /** rgba spotlight colour. Default is violet-tinted white. */
  colour?: string;
  /** Spotlight diameter as CSS string. */
  size?: string;
}

export function SpotlightCard({
  children,
  className = "",
  colour = "rgba(167, 139, 250, 0.18)",
  size = "300px",
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    node.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`group/spotlight relative ${className}`}
      style={{
        ["--spotlight-size" as string]: size,
        ["--spotlight-colour" as string]: colour,
      } as React.CSSProperties}
    >
      {/* The spotlight glow itself */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover/spotlight:opacity-100 transition-opacity duration-500 rounded-[inherit]"
        style={{
          background:
            "radial-gradient(var(--spotlight-size) circle at var(--mx, 50%) var(--my, 50%), var(--spotlight-colour), transparent 60%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
