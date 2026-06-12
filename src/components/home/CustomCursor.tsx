"use client";

// ─── CustomCursor ───────────────────────────────────────────────────────────
// A minimal dot+ring cursor follower. Fixed position, transforms via rAF,
// so it never blocks the main thread. The ring scales up over interactive
// elements (links, buttons, inputs).
//
// Disabled on:
//   • touch devices (no real cursor)
//   • prefers-reduced-motion
//   • narrow viewports (<= 768 px)
// to avoid adding visual noise where it would only get in the way.

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  // Only enable on real desktop pointers
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide          = window.matchMedia("(min-width: 768px)").matches;
    // Defer the state update one tick so it doesn't fire synchronously
    // inside the effect body (avoids cascading-render lint warning).
    queueMicrotask(() => setEnabled(isFinePointer && !reducedMotion && wide));
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100, mouseY = -100;
    let ringX  = -100, ringY  = -100;
    let raf: number | null = null;
    let interactive = false;

    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Detect if the element under cursor is interactive
      const t = e.target as HTMLElement | null;
      const isInteractive = !!t?.closest("a, button, input, textarea, select, [role='button'], [data-cursor-grow]");
      if (isInteractive !== interactive) {
        interactive = isInteractive;
        if (ring) ring.style.setProperty("--scale", isInteractive ? "1.8" : "1");
        if (ring) ring.style.setProperty("--ring-bg", isInteractive ? "rgba(124, 58, 237, 0.15)" : "transparent");
      }
    }

    function tick() {
      // Dot follows the cursor 1:1
      if (dot) dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      // Ring lerps toward the cursor for smooth lag
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ring) ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) scale(var(--scale, 1))`;
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled]);

  // Toggle the global "hide native cursor" class
  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("custom-cursor-active");
    return () => document.documentElement.classList.remove("custom-cursor-active");
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-8 h-8 rounded-full border-2 border-violet-500 mix-blend-difference"
        style={{
          transition: "background-color 0.25s, border-color 0.25s",
          ["--scale" as string]: "1",
          ["--ring-bg" as string]: "transparent",
          background: "var(--ring-bg)",
          willChange: "transform",
        } as React.CSSProperties}
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-1.5 h-1.5 rounded-full bg-violet-600 mix-blend-difference"
        style={{ willChange: "transform" }}
      />
    </>
  );
}
