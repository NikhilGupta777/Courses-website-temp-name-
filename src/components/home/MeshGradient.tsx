"use client";

// ─── Animated mesh gradient with floating colour blobs ─────────────────────
// Pure CSS / GPU-accelerated. Used behind the hero and key sections.

interface MeshGradientProps {
  className?: string;
  /** Colour palette (hex). Three blobs animate independently. */
  colours?: [string, string, string, string];
}

export function MeshGradient({
  className = "",
  colours = ["#c4b5fd", "#a78bfa", "#818cf8", "#fbcfe8"],
}: MeshGradientProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {/* Base soft gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(at 20% 20%, #f5f3ff 0%, transparent 60%), radial-gradient(at 80% 30%, #eef2ff 0%, transparent 55%), radial-gradient(at 50% 90%, #fdf4ff 0%, transparent 60%), #ffffff",
        }}
      />
      {/* Animated blobs */}
      <div
        className="absolute -top-24 -left-24 w-[42rem] h-[42rem] rounded-full blur-3xl opacity-50 mix-blend-multiply animate-blob-1"
        style={{ background: `radial-gradient(circle at center, ${colours[0]} 0%, transparent 70%)` }}
      />
      <div
        className="absolute top-10 right-0 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-40 mix-blend-multiply animate-blob-2"
        style={{ background: `radial-gradient(circle at center, ${colours[1]} 0%, transparent 70%)` }}
      />
      <div
        className="absolute -bottom-32 left-1/4 w-[44rem] h-[44rem] rounded-full blur-3xl opacity-40 mix-blend-multiply animate-blob-3"
        style={{ background: `radial-gradient(circle at center, ${colours[2]} 0%, transparent 70%)` }}
      />
      <div
        className="absolute -bottom-10 -right-20 w-[34rem] h-[34rem] rounded-full blur-3xl opacity-40 mix-blend-multiply animate-blob-1"
        style={{ background: `radial-gradient(circle at center, ${colours[3]} 0%, transparent 70%)`, animationDelay: "-8s" }}
      />

      {/* Subtle dot grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #4c1d95 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
    </div>
  );
}
