import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers at LearnAI — Join Us",
  description: "Help us democratise AI education in India. See open roles at LearnAI.",
};

const openRoles = [
  {
    title: "Senior Frontend Engineer",
    team: "Engineering",
    type: "Full-time",
    location: "Bangalore / Remote",
    desc: "Build the best AI learning UX in India using Next.js, TypeScript, and Tailwind.",
  },
  {
    title: "AI Curriculum Designer",
    team: "Content",
    type: "Full-time",
    location: "Remote (India)",
    desc: "Design and develop engaging AI course content in collaboration with our instructor network.",
  },
  {
    title: "Growth Marketing Manager",
    team: "Marketing",
    type: "Full-time",
    location: "Bangalore",
    desc: "Drive student acquisition through SEO, paid channels, and influencer partnerships.",
  },
  {
    title: "Community Manager",
    team: "Community",
    type: "Part-time",
    location: "Remote (India)",
    desc: "Build and nurture the LearnAI community on Discord and social media.",
  },
];

const perks = [
  { icon: "💰", label: "Competitive salary + ESOPs" },
  { icon: "🏠", label: "Fully remote or Bangalore office" },
  { icon: "📚", label: "Free LearnAI Pro subscription" },
  { icon: "🌴", label: "Unlimited paid leave" },
  { icon: "💻", label: "₹50,000 equipment budget" },
  { icon: "🎓", label: "₹30,000/year learning budget" },
  { icon: "🏥", label: "Health insurance (self + family)" },
  { icon: "🚀", label: "Fast-paced, mission-driven team" },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-violet-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-400 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            🇮🇳 We&apos;re hiring across India
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
            Build the future of AI education in India
          </h1>
          <p className="text-lg text-violet-200 max-w-xl mx-auto mb-8">
            Join a small, ambitious team on a mission to make world-class AI education accessible to every Indian learner.
          </p>
          <a href="#roles" className="px-8 py-4 bg-white text-violet-700 font-semibold rounded-xl hover:bg-violet-50 shadow-lg transition-all hover:scale-105 inline-block">
            See Open Roles ↓
          </a>
        </div>
      </section>

      {/* Perks */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-100">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Why LearnAI?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {perks.map((perk) => (
              <div key={perk.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
                <div className="text-3xl mb-2">{perk.icon}</div>
                <div className="text-sm font-medium text-gray-700">{perk.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section id="roles" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Open Roles</h2>
          <div className="space-y-4">
            {openRoles.map((role) => (
              <div key={role.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-violet-200 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">{role.title}</h3>
                    <div className="flex items-center gap-3 mt-1.5 mb-3">
                      <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2.5 py-0.5 rounded-full">{role.team}</span>
                      <span className="text-xs text-gray-400">{role.type}</span>
                      <span className="text-xs text-gray-400">{role.location}</span>
                    </div>
                    <p className="text-sm text-gray-600">{role.desc}</p>
                  </div>
                  <a href={`mailto:careers@learnai.in?subject=Application: ${role.title}`}
                    className="flex-shrink-0 px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors">
                    Apply →
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* No suitable role */}
          <div className="mt-8 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-6 text-center">
            <h3 className="font-bold text-gray-900 mb-2">Don&apos;t see a fit?</h3>
            <p className="text-sm text-gray-500 mb-4">We&apos;re always looking for great people. Send us a note.</p>
            <a href="mailto:careers@learnai.in" className="text-sm font-semibold text-violet-600 hover:underline">
              careers@learnai.in →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
