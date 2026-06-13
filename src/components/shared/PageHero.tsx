import type { ReactNode } from "react";
import { MeshGradient } from "@/components/home/MeshGradient";
import { RevealOnScroll } from "@/components/home/RevealOnScroll";

// ─── PageHero ───────────────────────────────────────────────────────────────
// A consistent animated hero band for interior marketing pages (Pricing,
// About, Contact, Help, etc.). Uses the same MeshGradient + dotted-grid
// treatment as the homepage so every page opens with a familiar feel.

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Optional content rendered below the subtitle (e.g. CTAs, toggles, search). */
  children?: ReactNode;
  /** Vertical padding size. */
  size?: "sm" | "md" | "lg";
  className?: string;
}

const PADDING = {
  sm: "pt-28 pb-12 lg:pt-32 lg:pb-16",
  md: "pt-28 pb-16 lg:pt-36 lg:pb-20",
  lg: "pt-32 pb-20 lg:pt-40 lg:pb-28",
};

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
  size = "md",
  className = "",
}: PageHeroProps) {
  return (
    <section className={`relative overflow-hidden ${PADDING[size]} ${className}`}>
      <MeshGradient />
      {/* Dotted-grid mask for subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #c4b5fd 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage: "radial-gradient(ellipse at center, black 10%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 10%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <RevealOnScroll>
          {eyebrow && (
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-violet-600 mb-4">
              {eyebrow}
            </span>
          )}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-[1.05]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </RevealOnScroll>
      </div>
    </section>
  );
}
