// ──────────────────────────────────────────────────────────────────────────
// LearnAI — Course catalog metadata (categories + colour palette only)
// ──────────────────────────────────────────────────────────────────────────
// All real course data lives in the database (Postgres via Prisma).
// This file used to contain a large hard-coded courses array for early
// prototyping; it has been removed because the app now reads everything
// from the DB. The CATEGORIES and CATEGORY_COLORS constants are still used
// by the catalog UI, course detail page, and homepage to render category
// pills and gradient backgrounds for course thumbnails.

// ── Free course slugs (used for SEO routes / canonical links) ─────────────
export const FREE_COURSE_SLUGS = [
  "ai-prompting-fundamentals",
  "chatgpt-basics",
  "ai-tools-everyday",
] as const;

// ── Categories shown in the catalog filter sidebar ────────────────────────
export const CATEGORIES = [
  { id: "all",              label: "All" },
  { id: "chatgpt",          label: "ChatGPT & GPT-4" },
  { id: "gemini",           label: "Gemini AI" },
  { id: "chatbots",         label: "AI Chatbots" },
  { id: "image-generation", label: "Image Generation" },
  { id: "prompting",        label: "Prompting" },
  { id: "ai-tools",         label: "AI Tools" },
  { id: "business-ai",      label: "Business AI" },
  { id: "llm",              label: "LLMs & Research" },
  { id: "automation",       label: "AI Automation" },
];

// ── Category colour map (Tailwind gradient classes) ───────────────────────
export const CATEGORY_COLORS: Record<string, { from: string; to: string; icon: string }> = {
  chatgpt:            { from: "from-orange-100", to: "to-amber-200",   icon: "text-orange-600" },
  gemini:             { from: "from-blue-100",   to: "to-cyan-200",    icon: "text-blue-600"   },
  chatbots:           { from: "from-green-100",  to: "to-emerald-200", icon: "text-green-600"  },
  "image-generation": { from: "from-pink-100",   to: "to-rose-200",    icon: "text-pink-600"   },
  prompting:          { from: "from-violet-100", to: "to-purple-200",  icon: "text-violet-600" },
  "ai-tools":         { from: "from-indigo-100", to: "to-blue-200",    icon: "text-indigo-600" },
  "business-ai":      { from: "from-yellow-100", to: "to-amber-200",   icon: "text-yellow-600" },
  llm:                { from: "from-slate-100",  to: "to-gray-200",    icon: "text-slate-600"  },
  automation:         { from: "from-teal-100",   to: "to-cyan-200",    icon: "text-teal-600"   },
};
