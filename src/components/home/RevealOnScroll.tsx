"use client";

// ─── Fade + slide-up reveal animation as content enters the viewport ────────
// Uses IntersectionObserver — runs on the GPU, no scroll listeners.

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  /** Delay before reveal starts, in ms. Useful for staggered grids. */
  delay?: number;
  /** Direction the content slides from. */
  from?: "bottom" | "top" | "left" | "right" | "scale";
  /** How much of the element must be visible before triggering (0–1). */
  threshold?: number;
}

export function RevealOnScroll({
  children,
  className = "",
  delay = 0,
  from = "bottom",
  threshold = 0.15,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [delay, threshold]);

  const initialTransform = (() => {
    switch (from) {
      case "top":    return "translate3d(0, -32px, 0)";
      case "left":   return "translate3d(-32px, 0, 0)";
      case "right":  return "translate3d(32px, 0, 0)";
      case "scale":  return "scale(0.92)";
      default:       return "translate3d(0, 32px, 0)";
    }
  })();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : initialTransform,
        transition: "opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
