import type { ReactNode } from "react";

// ─── SectionHeading ─────────────────────────────────────────────────────────
// The signature heading pattern used across the homepage v2:
//   small uppercase eyebrow → big bold title → optional subtitle.
// Centralised here so every page renders section headers identically.

interface SectionHeadingProps {
  /** Small uppercase label above the title. */
  eyebrow?: string;
  /** The main heading (can include <span> for gradient words). */
  title: ReactNode;
  /** Optional supporting copy below the title. */
  subtitle?: ReactNode;
  /** Alignment of the block. */
  align?: "center" | "left";
  /** Colour theme — "dark" for use on dark/violet section backgrounds. */
  tone?: "light" | "dark";
  /** Eyebrow accent colour class (text-*). */
  eyebrowClass?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "light",
  eyebrowClass = "text-violet-600",
  className = "",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  const titleColour = tone === "dark" ? "text-white" : "text-gray-900";
  const subtitleColour = tone === "dark" ? "text-violet-200" : "text-gray-600";

  return (
    <div className={`${alignment} ${align === "center" ? "max-w-3xl" : ""} ${className}`}>
      {eyebrow && (
        <span className={`text-xs font-bold tracking-widest uppercase ${tone === "dark" ? "text-violet-300" : eyebrowClass}`}>
          {eyebrow}
        </span>
      )}
      <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${titleColour} ${eyebrow ? "mt-2" : ""} leading-tight tracking-tight`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-lg ${subtitleColour} ${align === "center" ? "max-w-2xl mx-auto" : "max-w-2xl"} leading-relaxed`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
