"use client";

import { useState } from "react";
import Link from "next/link";
import { MeshGradient } from "@/components/home/MeshGradient";

const helpCategories = [
  {
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    label: "Getting Started",
    desc: "Account setup, first course, free plan",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
    label: "Billing & Plans",
    desc: "Payments, invoices, upgrades, refunds",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: "M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
    label: "Live Classes",
    desc: "How to join, recordings, reminders",
    color: "bg-red-50 text-red-600",
  },
  {
    icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
    label: "Certificates",
    desc: "Earning, downloading, sharing",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
    label: "Account Settings",
    desc: "Profile, password, notifications",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    label: "Technical Issues",
    desc: "Video not loading, bugs, performance",
    color: "bg-blue-50 text-blue-600",
  },
];

const faqs: { category: string; q: string; a: string }[] = [
  { category: "Getting Started", q: "How do I enrol in a free course?", a: "Simply create a free account and click 'Enrol Free' on any course marked FREE. No credit card required. You get instant access to all 3 free courses: AI Prompting Fundamentals, ChatGPT Basics, and AI Tools for Everyday Use." },
  { category: "Getting Started", q: "What's the difference between free and Pro?", a: "The Free plan gives you access to 3 handpicked courses permanently. The Pro plan (₹999/month) unlocks all 12+ courses, live classes, completion certificates, AI Tutor chatbot, and priority support. Try Pro free for 7 days." },
  { category: "Getting Started", q: "Can I access LearnAI on mobile?", a: "Yes! LearnAI is fully responsive and works on all devices. A dedicated mobile app is on our roadmap. Pro members can also download lessons for offline viewing in supported browsers." },
  { category: "Billing & Plans", q: "How do I get a GST invoice?", a: "GST invoices are automatically emailed after every payment. You can also download them from your Account → Billing → Payment History page. All prices shown are GST-inclusive." },
  { category: "Billing & Plans", q: "Can I cancel my Pro subscription?", a: "Yes, you can cancel anytime from Account → Billing → Manage Plan. Your Pro access continues until the end of the current billing period. There are no cancellation fees." },
  { category: "Billing & Plans", q: "What payment methods do you accept?", a: "We use Razorpay for secure payments. You can pay via UPI (GPay, PhonePe, Paytm), all major credit/debit cards, net banking, and EMI options on select cards." },
  { category: "Billing & Plans", q: "What is your refund policy?", a: "We offer a 30-day money-back guarantee for Pro subscriptions. Email support@learnai.in with your order details within 30 days of purchase. Refunds are processed within 5–7 business days." },
  { category: "Live Classes", q: "How do I join a live class?", a: "Go to the Live Classes page, find an upcoming session, and click 'Register'. You'll receive a calendar invite and reminder emails. At session time, click the join link in your email or dashboard." },
  { category: "Live Classes", q: "What if I miss a live session?", a: "No worries! All sessions are recorded and uploaded to your dashboard within 24 hours. Pro members can watch all past recordings anytime." },
  { category: "Certificates", q: "When will I receive my certificate?", a: "Certificates are auto-generated once you complete 100% of a course and achieve ≥70% on the final assessment. It's usually ready within a few minutes and emailed to you." },
  { category: "Certificates", q: "How do I share my certificate on LinkedIn?", a: "Open your certificate from Dashboard → Certificates, click 'Share', then 'LinkedIn'. This creates a LinkedIn post with your certificate and a verification link." },
  { category: "Certificates", q: "Are LearnAI certificates verified?", a: "Yes. Every certificate has a unique ID and a public verification URL (e.g. learnai.in/verify/LEARNAI-2026-XXXXX). Anyone can verify its authenticity. Certificates never expire." },
  { category: "Technical Issues", q: "The video won't load. What do I do?", a: "Try: 1) Refresh the page 2) Check your internet connection 3) Clear browser cache 4) Try a different browser. If the issue persists, email support@learnai.in with the course name and your browser version." },
  { category: "Technical Issues", q: "I forgot my password. How do I reset it?", a: "Click 'Forgot password?' on the login page. Enter your email and we'll send a reset link within 2 minutes. Check your spam folder if you don't see it." },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", ...Array.from(new Set(faqs.map((f) => f.category)))];

  const filtered = faqs.filter((faq) => {
    const matchCat = activeCategory === "All" || faq.category === activeCategory;
    const matchSearch = !searchQuery.trim() ||
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-14">
        <MeshGradient />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-violet-600">Help center</span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 mt-2 mb-5">
            How can we{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">help?</span>
          </h1>
          <div className="relative max-w-lg mx-auto">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search help articles…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-sm border border-gray-200 rounded-2xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>
      </section>

      {/* Help categories */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-3 gap-4">
          {helpCategories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => { setActiveCategory(cat.label); setSearchQuery(""); }}
              className={`text-left p-5 rounded-2xl border transition-all hover:shadow-md ${
                activeCategory === cat.label ? "border-violet-200 bg-violet-50" : "border-gray-100 bg-white hover:border-violet-200"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${cat.color}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={cat.icon} />
                </svg>
              </div>
              <div className="font-semibold text-gray-900 text-sm">{cat.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{cat.desc}</div>
            </button>
          ))}
        </div>
      </section>

      {/* FAQ section */}
      <section className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    activeCategory === cat ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-violet-100 hover:text-violet-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No results found for &ldquo;{searchQuery}&rdquo;</p>
              <button onClick={() => { setSearchQuery(""); setActiveCategory("All"); }} className="mt-3 text-violet-600 text-sm hover:underline">
                Clear search
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((faq) => {
                const key = `${faq.category}-${faq.q}`;
                const isOpen = openFaq === key;
                return (
                  <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : key)}
                      className="w-full flex items-center justify-between p-5 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="font-semibold text-gray-900 text-sm pr-4">{faq.q}</span>
                      <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                        <div className="pt-4">{faq.a}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Still need help */}
      <section className="py-12 px-4 bg-gray-50 border-t border-gray-100">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Still need help?</h2>
          <p className="text-gray-500 text-sm mb-6">Our support team responds within 4 business hours.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md text-sm">
              Contact Support
            </Link>
            <a href="mailto:support@learnai.in" className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">
              support@learnai.in
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
