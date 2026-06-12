"use client";

// ─── Infinite-scroll marquee of tools / partners / brand chips ─────────────
// SVG-based "logos" using the brand initial + colour. Two rows that scroll in
// opposite directions. Pauses on hover.

interface Brand {
  name: string;
  initial: string;
  bg: string;
  fg: string;
}

const TOOLS: Brand[] = [
  { name: "ChatGPT",          initial: "G", bg: "from-emerald-500 to-teal-600",    fg: "text-white" },
  { name: "Gemini",           initial: "G", bg: "from-blue-500 to-cyan-600",       fg: "text-white" },
  { name: "Claude",           initial: "C", bg: "from-orange-500 to-amber-600",    fg: "text-white" },
  { name: "Midjourney",       initial: "M", bg: "from-slate-700 to-slate-900",     fg: "text-white" },
  { name: "DALL·E",           initial: "D", bg: "from-rose-500 to-pink-600",       fg: "text-white" },
  { name: "Stable Diffusion", initial: "S", bg: "from-purple-500 to-violet-700",   fg: "text-white" },
  { name: "Llama",            initial: "L", bg: "from-blue-600 to-indigo-700",     fg: "text-white" },
  { name: "Mistral",          initial: "M", bg: "from-orange-400 to-red-500",      fg: "text-white" },
  { name: "Hugging Face",     initial: "H", bg: "from-yellow-400 to-amber-500",    fg: "text-amber-900" },
  { name: "LangChain",        initial: "L", bg: "from-green-500 to-emerald-600",   fg: "text-white" },
  { name: "Pinecone",         initial: "P", bg: "from-cyan-500 to-blue-600",       fg: "text-white" },
  { name: "OpenAI",           initial: "O", bg: "from-zinc-700 to-zinc-900",       fg: "text-white" },
  { name: "Anthropic",        initial: "A", bg: "from-stone-600 to-stone-800",     fg: "text-white" },
  { name: "Whisper",          initial: "W", bg: "from-sky-500 to-blue-600",        fg: "text-white" },
  { name: "Runway",           initial: "R", bg: "from-fuchsia-500 to-purple-600",  fg: "text-white" },
  { name: "Suno",             initial: "S", bg: "from-violet-500 to-fuchsia-600",  fg: "text-white" },
];

const PARTNERS: Brand[] = [
  { name: "IIT Delhi",      initial: "IIT", bg: "from-red-100 to-red-200",       fg: "text-red-700" },
  { name: "IIM Bangalore",  initial: "IIM", bg: "from-blue-100 to-blue-200",     fg: "text-blue-700" },
  { name: "Infosys",        initial: "I",   bg: "from-blue-500 to-indigo-700",   fg: "text-white" },
  { name: "TCS",            initial: "TCS", bg: "from-blue-700 to-blue-900",     fg: "text-white" },
  { name: "Flipkart",       initial: "F",   bg: "from-yellow-400 to-amber-500",  fg: "text-blue-900" },
  { name: "Razorpay",       initial: "R",   bg: "from-blue-600 to-indigo-700",   fg: "text-white" },
  { name: "Swiggy",         initial: "S",   bg: "from-orange-500 to-red-500",    fg: "text-white" },
  { name: "Paytm",          initial: "P",   bg: "from-blue-500 to-blue-700",     fg: "text-white" },
  { name: "Zomato",         initial: "Z",   bg: "from-red-500 to-red-700",       fg: "text-white" },
  { name: "PhonePe",        initial: "P",   bg: "from-violet-600 to-purple-800", fg: "text-white" },
  { name: "BYJU'S",         initial: "B",   bg: "from-purple-500 to-fuchsia-600", fg: "text-white" },
  { name: "upGrad",         initial: "U",   bg: "from-rose-500 to-pink-600",     fg: "text-white" },
];

function LogoChip({ brand }: { brand: Brand }) {
  return (
    <div className="flex-shrink-0 inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:scale-105 transition-all mx-2">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${brand.bg} flex items-center justify-center font-bold text-sm ${brand.fg}`}>
        {brand.initial}
      </div>
      <span className="font-semibold text-gray-700 whitespace-nowrap">{brand.name}</span>
    </div>
  );
}

export function MarqueeLogos({ kind = "tools" }: { kind?: "tools" | "partners" }) {
  const list = kind === "tools" ? TOOLS : PARTNERS;
  // Duplicate so the marquee tile loops seamlessly
  const doubled = [...list, ...list];

  return (
    <div className="relative w-full overflow-hidden marquee-group">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

      <div className={`flex ${kind === "tools" ? "animate-marquee" : "animate-marquee-reverse"}`} style={{ width: "max-content" }}>
        {doubled.map((b, i) => (
          <LogoChip key={`${b.name}-${i}`} brand={b} />
        ))}
      </div>
    </div>
  );
}
