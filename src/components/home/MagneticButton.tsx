"use client";

// ─── MagneticButton ─────────────────────────────────────────────────────────
// A button (or anchor) that gently pulls toward the cursor when the cursor
// is near it. Snaps back to centre on leave. The pull is rate-limited via
// requestAnimationFrame and clamped so it never feels gimmicky.

import Link from "next/link";
import { useRef, type ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  /** How far the button can travel from its centre, in px. */
  strength?: number;
  ariaLabel?: string;
}

export function MagneticButton({
  children,
  href,
  onClick,
  className = "",
  strength = 12,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const rafRef = useRef<number | null>(null);

  function onMove(e: React.MouseEvent) {
    const node = ref.current as HTMLElement | null;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width  / 2);
    const dy = e.clientY - (rect.top  + rect.height / 2);
    // Clamp distance to a max of `strength` px in each axis
    const tx = Math.max(-1, Math.min(1, dx / (rect.width  / 2))) * strength;
    const ty = Math.max(-1, Math.min(1, dy / (rect.height / 2))) * strength;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      node.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`;
    });
  }

  function onLeave() {
    const node = ref.current as HTMLElement | null;
    if (!node) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    node.style.transform = "translate(0, 0)";
  }

  const baseStyle = {
    transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
    willChange: "transform",
  } as React.CSSProperties;

  if (href) {
    return (
      <Link
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={className}
        style={baseStyle}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={baseStyle}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
