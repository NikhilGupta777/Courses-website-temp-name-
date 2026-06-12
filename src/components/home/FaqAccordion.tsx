"use client";

// ─── Animated FAQ accordion ─────────────────────────────────────────────────

import { useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "Do I need a programming background to learn AI here?",
    a: "Not at all. Six of our twelve courses are designed for non-programmers — including ChatGPT Mastery, AI for Business, and Prompt Engineering. They focus on using AI tools effectively, not writing code. If you do want to code, the LLM Fundamentals and Embeddings & RAG courses ramp you from zero Python to building production AI apps.",
  },
  {
    q: "How is LearnAI different from YouTube tutorials?",
    a: "Three things. (1) Everything is taught by working AI engineers — Rahul led AI at Infosys, Priya was at Google AI Research. (2) You get hands-on quizzes, code labs, and live Q&A with the instructor — not just a video monologue. (3) You earn verifiable certificates that 200+ Indian companies recognise.",
  },
  {
    q: "Can I get a refund if it's not what I expected?",
    a: "Yes — 30-day no-questions-asked money-back guarantee on all Pro and Annual subscriptions. We have a 94% completion rate, but if you're in the 6%, just email support@learnai.in and you get a full refund. No fine print.",
  },
  {
    q: "Is the Pro plan worth ₹999/month?",
    a: "Pro unlocks all 12+ courses, every live class with India's top AI experts, the AI Tutor (chat 24/7 with our GPT-powered tutor), and shareable certificates. Compare that to a single conference ticket (₹15,000+) or a YouTube Premium subscription that doesn't teach you anything. Most students recoup the cost in their first salary bump.",
  },
  {
    q: "How does the AI Tutor work?",
    a: "The AI Tutor is a Pro feature — a GPT-powered chat assistant that knows the LearnAI curriculum inside-out. Stuck on a quiz? Ask it. Need a code example? Ask it. It's available on every dashboard page, 24/7, no rate limit on Annual plans.",
  },
  {
    q: "Are the certificates recognised by Indian companies?",
    a: "Our certificates are publicly verifiable (every cert has a unique URL like learnai.in/verify/CERT-1234), and they're listed under \"AI Skills\" in 200+ company HRMS systems. Hiring managers at Razorpay, Flipkart, Swiggy, and TCS specifically mentioned LearnAI certs in alumni interviews.",
  },
  {
    q: "Can my company sponsor a team plan?",
    a: "Yes — our Enterprise plan covers teams of 5+ with custom curricula, SSO/SAML, dedicated success manager, custom branding, and bulk certificate issuance. Email enterprise@learnai.in for a quote — typically 40–60% discount vs individual plans.",
  },
  {
    q: "What if I fall behind? Do I lose my progress?",
    a: "Never. Your progress is saved forever — even if you cancel Pro and come back a year later, you'll pick up exactly where you left off. Free courses stay free for life; Pro courses lock the new lessons but keep your existing progress and any certificates you've earned.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {FAQS.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className={`rounded-2xl border overflow-hidden transition-all ${
              isOpen
                ? "border-violet-200 bg-white shadow-md"
                : "border-gray-100 bg-white/70 hover:bg-white hover:border-gray-200"
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className={`font-semibold text-sm sm:text-base ${isOpen ? "text-violet-700" : "text-gray-800"}`}>
                {item.q}
              </span>
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  isOpen
                    ? "bg-violet-600 text-white rotate-45"
                    : "bg-gray-100 text-gray-400 group-hover:bg-violet-100"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </span>
            </button>
            <div
              className="overflow-hidden transition-all duration-400"
              style={{
                maxHeight: isOpen ? "400px" : "0",
                opacity: isOpen ? 1 : 0,
              }}
            >
              <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">
                {item.a}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
