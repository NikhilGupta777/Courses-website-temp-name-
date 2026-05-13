import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LearnAI Community — Connect with 10,000+ AI Learners",
  description: "Join the LearnAI Discord community. Ask questions, share projects, find study partners, and connect with India's top AI learners.",
};

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-indigo-900 via-violet-900 to-purple-900 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-violet-400 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl">
          <div className="text-5xl mb-6">💬</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
            Join 10,000+ AI Learners
          </h1>
          <p className="text-lg text-indigo-200 max-w-xl mx-auto mb-8">
            Get help, share your projects, find study partners, and stay updated with the latest in AI.
            Our community is free and open to everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://discord.gg/learnai" target="_blank" rel="noopener noreferrer"
              className="px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl shadow-lg transition-all hover:scale-105 flex items-center gap-3 justify-center">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
              </svg>
              Join Discord — Free
            </a>
            <a href="https://twitter.com/learnai_india" target="_blank" rel="noopener noreferrer"
              className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-all flex items-center gap-3 justify-center">
              Follow on Twitter →
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-indigo-50 border-b border-indigo-100">
        <div className="mx-auto max-w-5xl px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "10,000+", label: "Community Members" },
            { value: "500+", label: "Questions Answered Daily" },
            { value: "50+", label: "Weekly Shared Projects" },
            { value: "24/7",  label: "Active Discussion" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-indigo-700">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Channels */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What to Expect in Our Discord</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { emoji: "#", channel: "general", desc: "Introductions and general AI chat" },
              { emoji: "#", channel: "ask-anything", desc: "Get help with courses, tools, and concepts" },
              { emoji: "#", channel: "share-your-work", desc: "Show off your AI projects" },
              { emoji: "#", channel: "job-board", desc: "AI job postings and career advice" },
              { emoji: "#", channel: "study-groups", desc: "Find accountability partners" },
              { emoji: "#", channel: "live-class-chat", desc: "Live session discussions" },
            ].map((ch) => (
              <div key={ch.channel} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg flex-shrink-0">
                  #
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{ch.channel}</div>
                  <div className="text-xs text-gray-500">{ch.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-r from-indigo-600 to-violet-600 text-center px-4">
        <h2 className="text-2xl font-bold text-white mb-3">Ready to join?</h2>
        <p className="text-indigo-200 mb-6">It&apos;s completely free. No Pro plan needed.</p>
        <a href="https://discord.gg/learnai" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 shadow-lg transition-all hover:scale-105">
          Join Our Discord →
        </a>
      </section>
    </div>
  );
}
