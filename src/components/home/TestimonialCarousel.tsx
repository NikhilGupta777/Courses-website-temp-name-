"use client";

// ─── Auto-rotating testimonial carousel ─────────────────────────────────────

import { useEffect, useRef, useState } from "react";

interface Testimonial {
  name:     string;
  role:     string;
  city:     string;
  avatar:   string;  // gradient class
  quote:    string;
  rating:   number;
  metric?:  string;  // e.g. "Saved 15 hrs/week"
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Ankit Verma",
    role: "ML Engineer · Razorpay",
    city: "Bangalore",
    avatar: "from-orange-400 to-amber-500",
    quote:
      "I was a backend dev with zero ML background. After 4 months on LearnAI's Pro plan, I shipped my first production embedding pipeline at work. The live RAG class with Rahul was the turning point.",
    rating: 5,
    metric: "₹6 LPA → ₹14 LPA",
  },
  {
    name: "Divya Nair",
    role: "Lead Marketer · Swiggy",
    city: "Mumbai",
    avatar: "from-pink-400 to-rose-500",
    quote:
      "The AI for Business course paid for itself in the first week. I now run our entire content engine using ChatGPT + Claude, and I taught my team. Got a promotion 3 months later.",
    rating: 5,
    metric: "Saved 15 hrs/week",
  },
  {
    name: "Rohit Gupta",
    role: "AI Engineer · Flipkart",
    city: "Delhi",
    avatar: "from-blue-400 to-indigo-500",
    quote:
      "Started with the free prompting course as a final-year BTech student. Took the LLM Fundamentals course next, built a portfolio project, and cracked Flipkart's AI internship. Now full-time.",
    rating: 5,
    metric: "Internship → Full-time",
  },
  {
    name: "Sneha Reddy",
    role: "Founder · Boutique AI Studio",
    city: "Hyderabad",
    avatar: "from-violet-400 to-purple-500",
    quote:
      "The Midjourney + Stable Diffusion combo course gave me everything I needed to launch my own AI design studio. I now run it full-time. The AI Tutor is like having a senior on Slack 24/7.",
    rating: 5,
    metric: "Side hustle → Full-time business",
  },
  {
    name: "Karan Mehta",
    role: "Product Designer · Zomato",
    city: "Delhi",
    avatar: "from-emerald-400 to-teal-500",
    quote:
      "What I love is the depth — these aren't ChatGPT-tip videos, they're real engineering. The Embeddings & RAG course is the best resource I've found anywhere, paid or free.",
    rating: 5,
    metric: "Promoted to Senior",
  },
];

export function TestimonialCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Auto-advance every 6s
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setActive((a) => (a + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(t);
  }, [paused]);

  const current = TESTIMONIALS[active]!;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative max-w-5xl mx-auto"
    >
      {/* Big featured testimonial card */}
      <div className="relative bg-gradient-to-br from-white to-violet-50/30 rounded-3xl border border-violet-100 shadow-2xl shadow-violet-500/10 p-8 lg:p-12 overflow-hidden">
        {/* Quote-mark decoration */}
        <svg className="absolute -top-2 -left-2 w-32 h-32 text-violet-200/40" fill="currentColor" viewBox="0 0 32 32">
          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
        </svg>

        {/* Background floating shapes */}
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-violet-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 right-20 w-40 h-40 bg-pink-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          {/* Stars */}
          <div className="flex items-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          <blockquote
            key={current.name}
            className="text-xl lg:text-2xl text-gray-800 leading-relaxed font-medium"
            style={{ animation: "fade-in 0.5s ease-out" }}
          >
            &ldquo;{current.quote}&rdquo;
          </blockquote>

          {/* Author + metric */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br ${current.avatar} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                {current.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-gray-900">{current.name}</div>
                <div className="text-sm text-gray-500">{current.role}</div>
                <div className="text-xs text-gray-400">{current.city}</div>
              </div>
            </div>
            {current.metric && (
              <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 font-bold text-sm px-4 py-2 rounded-full">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                {current.metric}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dot navigation + thumbnails */}
      <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
        {TESTIMONIALS.map((t, i) => (
          <button
            key={t.name}
            onClick={() => setActive(i)}
            className={`group flex items-center gap-2 transition-all ${
              i === active ? "px-3" : "px-1"
            }`}
            aria-label={`Show testimonial from ${t.name}`}
          >
            <div className={`flex-shrink-0 rounded-full bg-gradient-to-br ${t.avatar} flex items-center justify-center text-white font-bold transition-all ${
              i === active ? "w-9 h-9 text-sm shadow-lg" : "w-7 h-7 text-xs opacity-50 group-hover:opacity-100"
            }`}>
              {t.name.charAt(0)}
            </div>
            {i === active && (
              <span className="text-xs font-medium text-gray-600">{t.name.split(" ")[0]}</span>
            )}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-3 mx-auto w-32 h-1 bg-violet-100 rounded-full overflow-hidden">
        <div
          key={`${active}-${paused}`}
          className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
          style={{
            animation: paused ? "none" : "marquee 6s linear",
            width: paused ? "100%" : "0%",
          }}
        />
      </div>
    </div>
  );
}
