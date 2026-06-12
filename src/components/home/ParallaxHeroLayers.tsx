"use client";

// ─── ParallaxHeroLayers ─────────────────────────────────────────────────────
// Three depth layers (back / mid / fore) that shift at different rates as
// the user moves their mouse, giving the hero a tangible 3D feel without
// WebGL.
//
// Layer behaviour:
//   • back  (deepest)  — moves 1× the mouse delta, large blur
//   • mid                — moves 2.5×, the floating glass panels
//   • fore  (closest)  — moves 4×, the small UI accents (badges, sparkles)
//
// All transforms run on the GPU via `transform: translate3d`. We
// rate-limit via requestAnimationFrame and only attach the listener on
// fine-pointer devices.

import { useEffect, useRef, type ReactNode } from "react";

interface ParallaxHeroLayersProps {
  back?:  ReactNode;
  mid?:   ReactNode;
  fore?:  ReactNode;
  className?: string;
}

export function ParallaxHeroLayers({ back, mid, fore, className = "" }: ParallaxHeroLayersProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const backRef      = useRef<HTMLDivElement | null>(null);
  const midRef       = useRef<HTMLDivElement | null>(null);
  const foreRef      = useRef<HTMLDivElement | null>(null);
  const rafRef       = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const c = containerRef.current;
    if (!c) return;

    let mx = 0, my = 0;
    let cx = 0, cy = 0;

    function onMove(e: MouseEvent) {
      const rect = c!.getBoundingClientRect();
      mx = (e.clientX - rect.left - rect.width  / 2) / rect.width;
      my = (e.clientY - rect.top  - rect.height / 2) / rect.height;
    }

    function tick() {
      // Lerp toward target for a smoother, weighty feel
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;
      const apply = (el: HTMLDivElement | null, mult: number) => {
        if (el) el.style.transform = `translate3d(${(cx * mult).toFixed(2)}px, ${(cy * mult).toFixed(2)}px, 0)`;
      };
      apply(backRef.current,  -8);   // moves opposite to cursor (background recedes)
      apply(midRef.current,    16);
      apply(foreRef.current,   32);
      rafRef.current = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div ref={backRef} className="absolute inset-0 will-change-transform">
        {back}
      </div>
      <div ref={midRef} className="absolute inset-0 will-change-transform">
        {mid}
      </div>
      <div ref={foreRef} className="absolute inset-0 will-change-transform">
        {fore}
      </div>
    </div>
  );
}
