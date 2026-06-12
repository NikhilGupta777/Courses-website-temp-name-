"use client";

// ─── Auto-scrolling "live activity" ticker ──────────────────────────────────
// Vertical marquee of synthetic-but-realistic activity events. Two columns
// scrolling at different speeds for visual interest. Uses CSS keyframes —
// no JS scroll-listener loops required.

const ACTIVITIES = [
  { name: "Priya",   city: "Mumbai",     action: "completed", target: "ChatGPT Mastery · Module 3", color: "from-pink-400 to-rose-500" },
  { name: "Rahul",   city: "Bangalore",  action: "earned",    target: "Gemini Pro Certificate",     color: "from-violet-400 to-indigo-500" },
  { name: "Aditi",   city: "Pune",       action: "started",   target: "Stable Diffusion Course",    color: "from-blue-400 to-cyan-500" },
  { name: "Karan",   city: "Delhi",      action: "scored 96%", target: "Prompting Quiz",            color: "from-emerald-400 to-teal-500" },
  { name: "Sneha",   city: "Chennai",    action: "joined",    target: "Live · Vector DBs in 2026",  color: "from-orange-400 to-amber-500" },
  { name: "Vikram",  city: "Hyderabad",  action: "completed", target: "Midjourney Workflows",       color: "from-yellow-400 to-orange-500" },
  { name: "Aisha",   city: "Kolkata",    action: "enrolled",  target: "AI Chatbot Builder",         color: "from-fuchsia-400 to-pink-500" },
  { name: "Arjun",   city: "Jaipur",     action: "completed", target: "LLM Fundamentals · Final",   color: "from-cyan-400 to-blue-500" },
  { name: "Meera",   city: "Ahmedabad",  action: "earned",    target: "AI for Business Cert",       color: "from-rose-400 to-pink-500" },
  { name: "Aman",    city: "Lucknow",    action: "scored 100%", target: "Embeddings & RAG Quiz",   color: "from-lime-400 to-green-500" },
  { name: "Diya",    city: "Indore",     action: "started",   target: "Voice AI Bootcamp",          color: "from-purple-400 to-violet-500" },
  { name: "Rohan",   city: "Chandigarh", action: "joined",    target: "Pro Plan",                    color: "from-amber-400 to-yellow-500" },
];

const ICONS = {
  completed:  "M5 13l4 4L19 7",
  earned:     "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  started:    "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z",
  scored:     "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  joined:     "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  enrolled:   "M12 6v6m0 0v6m0-6h6m-6 0H6",
} as const;

function iconFor(action: string): string {
  if (action.startsWith("completed")) return ICONS.completed;
  if (action.startsWith("earned"))    return ICONS.earned;
  if (action.startsWith("started"))   return ICONS.started;
  if (action.startsWith("scored"))    return ICONS.scored;
  if (action.startsWith("joined"))    return ICONS.joined;
  return ICONS.enrolled;
}

function ActivityChip({ a }: { a: typeof ACTIVITIES[number] }) {
  return (
    <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-2.5 border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all">
      <div className={`flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center text-white font-bold text-xs shadow`}>
        {a.name.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm text-gray-800 leading-tight">
          <span className="font-semibold">{a.name}</span>
          <span className="text-gray-400 text-xs"> · {a.city}</span>
        </div>
        <div className="text-xs text-gray-500 truncate">
          {a.action} <span className="text-violet-600 font-medium">{a.target}</span>
        </div>
      </div>
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d={iconFor(a.action)} />
        </svg>
      </div>
    </div>
  );
}

export function LiveActivityFeed() {
  // Two columns with offset slices for visual variety
  const colA = [...ACTIVITIES.slice(0, 6), ...ACTIVITIES.slice(0, 6)];
  const colB = [...ACTIVITIES.slice(6),    ...ACTIVITIES.slice(6)];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-hidden relative marquee-group">
      {/* Top + bottom gradient masks */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white via-white/80 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent z-10" />

      <div className="space-y-3 animate-marquee-y">
        {colA.map((a, i) => <ActivityChip key={`a-${i}`} a={a} />)}
      </div>
      <div className="space-y-3 animate-marquee-y" style={{ animationDuration: "40s", animationDirection: "reverse" }}>
        {colB.map((a, i) => <ActivityChip key={`b-${i}`} a={a} />)}
      </div>
    </div>
  );
}
