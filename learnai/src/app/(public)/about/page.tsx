import Link from "next/link";

const team = [
  { name: "Rahul Mehta", role: "Co-Founder & Head of AI Curriculum", bio: "Former AI Lead at Infosys. 8+ years in ML engineering. IIT Delhi alumni.", initial: "R", color: "from-orange-400 to-amber-500" },
  { name: "Priya Sharma", role: "Co-Founder & Head of Generative AI", bio: "Ex-Google AI researcher. PhD in Computer Vision. 5+ published papers on diffusion models.", initial: "P", color: "from-pink-400 to-rose-500" },
  { name: "Arjun Singh", role: "Head of Research & LLMs", bio: "PhD NLP from IIT Bombay. Microsoft Research India. Expert in transformers and fine-tuning.", initial: "A", color: "from-blue-400 to-indigo-500" },
  { name: "Sneha Reddy", role: "Head of Business Courses", bio: "MBA IIM Bangalore. AI consultant to 150+ Indian startups and enterprises.", initial: "S", color: "from-green-400 to-emerald-500" },
];

const milestones = [
  { year: "2023", event: "LearnAI founded in Bangalore with a mission to democratise AI education in India" },
  { year: "2024 Q1", event: "Launched first 5 courses — 2,000 students in the first month" },
  { year: "2024 Q3", event: "Crossed 10,000 students. Introduced live webinars and Pro Plan" },
  { year: "2025 Q1", event: "Launched AI Chatbot Builder & LLM Fundamentals courses. 25,000 students" },
  { year: "2025 Q3", event: "Introduced Enterprise plan. Partnered with 10 engineering colleges" },
  { year: "2026", event: "50,000+ students. 12 courses. 5,000+ certificates issued. Expanding to Tier-2 cities" },
];

const values = [
  { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Quality First", desc: "Every course is reviewed, updated quarterly, and taught by verified industry experts — not just anyone with a camera." },
  { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "Accessible Pricing", desc: "AI education should not be gatekept by price. We offer free courses and keep Pro at ₹999/month — less than a Netflix subscription." },
  { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", title: "India-First", desc: "Built for Indian learners — INR pricing, GST invoices, Indian business case studies, and instructors who understand the local context." },
  { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Practical Learning", desc: "No fluff. Every course includes hands-on projects, real tools, and assignments you can show to employers on day one." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section className="relative py-24 bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-80 h-80 bg-violet-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-indigo-400 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            🇮🇳 Made in India, for India
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            We&apos;re on a mission to make<br />
            <span className="bg-gradient-to-r from-violet-300 to-pink-300 bg-clip-text text-transparent">
              AI education accessible
            </span>
            {" "}to every Indian
          </h1>
          <p className="mt-6 text-lg text-violet-200 max-w-2xl mx-auto leading-relaxed">
            LearnAI was started in Bangalore by a group of AI engineers and educators who believed that world-class AI education shouldn&apos;t cost ₹50,000 or require a foreign degree.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses" className="px-8 py-3.5 bg-white text-violet-700 font-semibold rounded-xl hover:bg-violet-50 shadow-lg transition-all hover:scale-105">
              Explore Courses
            </Link>
            <Link href="/contact" className="px-8 py-3.5 bg-white/10 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-all">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 bg-gray-50 border-b border-gray-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "50,000+", label: "Students" },
              { value: "12+", label: "Courses" },
              { value: "5,000+", label: "Certificates" },
              { value: "94%", label: "Completion Rate" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">{s.value}</div>
                <div className="mt-1 text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story / Timeline ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Our Story</h2>
            <p className="mt-3 text-lg text-gray-500">From a Bangalore apartment to India&apos;s leading AI learning platform</p>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-200 via-indigo-200 to-transparent" />
            <div className="space-y-10">
              {milestones.map((m, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="relative flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg z-10">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex-1 hover:shadow-md transition-shadow">
                    <div className="text-xs font-bold text-violet-600 mb-1">{m.year}</div>
                    <p className="text-sm text-gray-700 leading-relaxed">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={v.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Meet the Team</h2>
            <p className="mt-3 text-gray-500 text-lg">AI practitioners turned educators</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all flex items-start gap-5">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-md`}>
                  {member.initial}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-violet-600 font-medium mb-2">{member.role}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Enterprise / Colleges CTA ── */}
      <section className="py-16 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Bring AI Education to Your Institution</h2>
        <p className="text-violet-200 mb-8 max-w-xl mx-auto">We partner with engineering colleges, companies, and bootcamps to deliver customised AI training. Get in touch for bulk pricing and custom curricula.</p>
        <Link href="/contact?type=enterprise" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-violet-700 font-semibold rounded-xl shadow-lg hover:bg-violet-50 transition-all hover:scale-105">
          Contact Our Education Team →
        </Link>
      </section>
    </div>
  );
}
