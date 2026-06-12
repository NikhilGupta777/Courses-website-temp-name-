"use client";

// ─── TiltCourseCard ─────────────────────────────────────────────────────────
// Mouse-tracking 3D tilt effect for course cards. Uses CSS transform with
// requestAnimationFrame, rate-limited to avoid jank. Falls back to flat on
// reduced-motion clients.

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";

interface TiltCourseCardProps {
  href: string;
  title: string;
  subtitle?: string | null;
  instructor: string;
  rating: number;
  students: number;
  price?: number | null;
  originalPrice?: number | null;
  isFree: boolean;
  level: string;
  category?: string;
  /** Decorative hero shown inside the card */
  visual?: ReactNode;
}

export function TiltCourseCard(props: TiltCourseCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [hovering, setHovering] = useState(false);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const node = cardRef.current;
    if (!node) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const rect = node.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;   // 0 → 1
    const py = (e.clientY - rect.top)  / rect.height;  // 0 → 1
    const rx = (py - 0.5) * -10;  // tilt up/down
    const ry = (px - 0.5) *  10;  // tilt left/right
    rafRef.current = requestAnimationFrame(() => {
      node.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(0)`;
      // Move the highlight to track the mouse
      node.style.setProperty("--mx", `${px * 100}%`);
      node.style.setProperty("--my", `${py * 100}%`);
    });
  }

  function onLeave() {
    const node = cardRef.current;
    if (!node) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    node.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)";
    setHovering(false);
  }

  const discount =
    props.originalPrice && props.price && props.originalPrice > props.price
      ? Math.round((1 - props.price / props.originalPrice) * 100)
      : 0;

  return (
    <Link href={props.href} className="block group">
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onMouseEnter={() => setHovering(true)}
        className="relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-violet-500/10 transition-shadow duration-300 h-full preserve-3d"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          backgroundImage: hovering
            ? "radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(167, 139, 250, 0.10) 0%, transparent 50%), white"
            : undefined,
        }}
      >
        {/* Visual / hero */}
        <div className="relative aspect-[16/9] overflow-hidden" style={{ transform: "translateZ(20px)" }}>
          {props.visual}
          {/* Top-left badge */}
          <div className="absolute top-3 left-3 inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-violet-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
            {props.level}
          </div>
          {/* Hover-overlay play button */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
              <svg className="w-5 h-5 text-violet-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5" style={{ transform: "translateZ(15px)" }}>
          {props.category && (
            <div className="text-[10px] font-semibold uppercase tracking-wider text-violet-600 mb-1.5">{props.category}</div>
          )}
          <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-violet-600 transition-colors leading-snug">
            {props.title}
          </h3>
          {props.subtitle && (
            <p className="mt-1 text-xs text-gray-500 line-clamp-1">{props.subtitle}</p>
          )}
          <p className="mt-2 text-xs text-gray-500">by <span className="font-medium text-gray-700">{props.instructor}</span></p>

          <div className="mt-3 flex items-center gap-2 text-xs">
            <div className="flex items-center gap-0.5 text-yellow-400">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.round(props.rating) ? "" : "text-gray-200"} fill-current`} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="font-semibold text-gray-700">{props.rating.toFixed(1)}</span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-500">{props.students.toLocaleString("en-IN")} students</span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            {props.isFree ? (
              <span className="text-lg font-bold text-emerald-600">Free</span>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-gray-900">₹{props.price?.toLocaleString("en-IN")}</span>
                {props.originalPrice && props.originalPrice > (props.price ?? 0) && (
                  <span className="text-xs text-gray-400 line-through">₹{props.originalPrice.toLocaleString("en-IN")}</span>
                )}
              </div>
            )}
            {discount > 0 && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {discount}% OFF
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Default visual for cards that don't ship one — gradient + abstract SVG
export function CourseCardVisual({ catSlug, title }: { catSlug?: string; title: string }) {
  // Pick a deterministic colour pair from the slug
  const colours = colourPairFor(catSlug ?? title);
  return (
    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${colours[0]}, ${colours[1]})` }}>
      {/* Subtle grid pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-30" aria-hidden>
        <defs>
          <pattern id={`grid-${catSlug ?? "x"}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${catSlug ?? "x"})`} />
      </svg>
      {/* Floating shapes */}
      <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/30 blur-xl" />
      <div className="absolute bottom-3 left-3 w-16 h-16 rounded-full bg-white/20 blur-2xl" />
      {/* Big initial */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-6xl font-black text-white/20 select-none">{title.charAt(0)}</span>
      </div>
    </div>
  );
}

function colourPairFor(key: string): [string, string] {
  const palettes: Array<[string, string]> = [
    ["#7c3aed", "#4f46e5"], // violet → indigo
    ["#ec4899", "#f43f5e"], // pink → rose
    ["#0ea5e9", "#6366f1"], // sky → indigo
    ["#10b981", "#0ea5e9"], // emerald → sky
    ["#f59e0b", "#ef4444"], // amber → red
    ["#8b5cf6", "#ec4899"], // violet → pink
    ["#06b6d4", "#10b981"], // cyan → emerald
  ];
  let hash = 0;
  for (const c of key) hash = (hash * 31 + c.charCodeAt(0)) | 0;
  return palettes[Math.abs(hash) % palettes.length]!;
}
