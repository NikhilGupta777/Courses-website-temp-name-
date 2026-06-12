// ────────────────────────────────────────────────────────────────────────────
// LearnAI — Flagship homepage
// ────────────────────────────────────────────────────────────────────────────
// 16-section landing page with animated SVG visuals, real DB data (courses +
// live classes via tRPC), and a stack of interactive client components for
// the AI Tutor demo, charts, marquees, learning path, etc.
//
// This file is a SERVER component. Each interactive piece is its own client
// component under `src/components/home/`.
// ────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/data/courses";
import { OrganisationJsonLd, WebSiteJsonLd } from "@/components/seo/json-ld";
import { trpcClient } from "@/lib/trpc/client";

import { MeshGradient } from "@/components/home/MeshGradient";
import { NeuralNetworkBg } from "@/components/home/NeuralNetworkBg";
import { AnimatedCounter } from "@/components/home/AnimatedCounter";
import { RevealOnScroll } from "@/components/home/RevealOnScroll";
import { LivePulseDashboard } from "@/components/home/LivePulseDashboard";
import { LiveActivityFeed } from "@/components/home/LiveActivityFeed";
import { AiTutorDemo } from "@/components/home/AiTutorDemo";
import { MarqueeLogos } from "@/components/home/MarqueeLogos";
import { OutcomesChart } from "@/components/home/OutcomesChart";
import { LearningPathDiagram } from "@/components/home/LearningPathDiagram";
import { TiltCourseCard, CourseCardVisual } from "@/components/home/TiltCourseCard";
import { CountdownTimer } from "@/components/home/CountdownTimer";
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { CertificateShowcase } from "@/components/home/CertificateShowcase";
import { BentoFeaturesGrid } from "@/components/home/BentoFeaturesGrid";

// ────────────────────────────────────────────────────────────────────────────
// Data loading — uses the same trpcClient that other server components use.
// Errors are swallowed so the homepage always renders even if the DB is down.
// ────────────────────────────────────────────────────────────────────────────
async function loadHomeData() {
  try {
    const [featuredCourses, upcomingLive] = await Promise.all([
      trpcClient.course.getFeatured.query(),
      trpcClient.liveClass.getUpcoming.query(),
    ]);
    return { featuredCourses, upcomingLive };
  } catch {
    return { featuredCourses: [], upcomingLive: [] };
  }
}

export default async function HomePage() {
  const { featuredCourses, upcomingLive } = await loadHomeData();

  const freeCourses  = featuredCourses.filter((c) => c.isFree).slice(0, 3);
  const paidFeatured = featuredCourses.filter((c) => !c.isFree).slice(0, 6);
  const liveSessions = upcomingLive.slice(0, 3);

  return (
    <div className="overflow-hidden bg-white">
      <OrganisationJsonLd />
      <WebSiteJsonLd />

      {/* ════════════════════════════════════════════════════════════════════
          1. HERO — animated mesh gradient + neural network + glassmorphism
          ════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-24 lg:pt-20">
        <MeshGradient />
        <NeuralNetworkBg />

        {/* Subtle grain overlay for depth */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* ── Left: heading + CTAs ──────────────────────────────────── */}
            <div className="lg:col-span-7 relative">
              {/* New release badge */}
              <RevealOnScroll>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-violet-200 text-violet-700 rounded-full text-xs font-semibold mb-6 shadow-sm">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inset-0 rounded-full bg-orange-500 animate-ping" />
                    <span className="rounded-full bg-orange-500 w-2 h-2" />
                  </span>
                  NEW · AI Tutor is now live for Pro members
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={120}>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-gray-900 leading-[0.95]">
                  Master AI.
                  <br />
                  <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-text">
                    Built for India.
                  </span>
                </h1>
              </RevealOnScroll>

              <RevealOnScroll delay={240}>
                <p className="mt-6 text-lg lg:text-xl text-gray-600 max-w-2xl leading-relaxed">
                  Live classes from India&apos;s top AI engineers. 12+ courses on{" "}
                  <span className="font-semibold text-gray-800">ChatGPT, Gemini, Stable Diffusion, LLMs, RAG.</span>{" "}
                  Hands-on quizzes. Verified certificates. A 24/7 AI Tutor that explains anything.
                </p>
              </RevealOnScroll>

              {/* CTAs */}
              <RevealOnScroll delay={360}>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/courses"
                    className="group relative inline-flex items-center justify-center px-7 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/40 hover:scale-[1.03] transition-all overflow-hidden"
                  >
                    {/* Shimmer */}
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative flex items-center gap-2">
                      Start learning AI free
                      <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Link>
                  <Link
                    href="#tutor-demo"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white border-2 border-gray-200 text-gray-800 font-bold rounded-2xl hover:border-violet-300 hover:bg-violet-50 transition-all"
                  >
                    <svg className="w-4 h-4 text-violet-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Watch the demo (90s)
                  </Link>
                </div>
              </RevealOnScroll>

              {/* Stats strip */}
              <RevealOnScroll delay={500}>
                <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
                  {[
                    { v: 10000, suf: "+",  l: "Students" },
                    { v: 4.9,   dec: 1,    l: "Avg rating" },
                    { v: 94,    suf: "%",  l: "Completion" },
                  ].map((s, i) => (
                    <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl px-3 py-3 border border-violet-100/50">
                      <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent leading-none">
                        <AnimatedCounter to={s.v} indian suffix={s.suf ?? ""} decimals={s.dec ?? 0} />
                      </div>
                      <div className="text-[11px] text-gray-500 mt-1">{s.l}</div>
                    </div>
                  ))}
                </div>
              </RevealOnScroll>
            </div>

            {/* ── Right: floating glassmorphism showcase ───────────────── */}
            <div className="lg:col-span-5 relative">
              <RevealOnScroll from="scale" delay={300}>
                <div className="relative">
                  {/* Big main panel — fake AI chat */}
                  <div className="glass rounded-3xl p-5 shadow-2xl shadow-violet-500/20 animate-float-sway" style={{ animationDelay: "-2s" }}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">AI Tutor</div>
                        <div className="text-[10px] text-emerald-600 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-strong" />
                          Online
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-end">
                        <div className="max-w-[80%] px-3 py-2 rounded-2xl rounded-br-sm bg-violet-600 text-white text-xs">
                          What&rsquo;s the difference between RAG and fine-tuning?
                        </div>
                      </div>
                      <div className="flex">
                        <div className="max-w-[88%] px-3 py-2 rounded-2xl rounded-bl-sm bg-white text-gray-700 text-xs border border-gray-100">
                          Great question! <strong>RAG</strong> looks things up at query time — like an open-book exam. <strong>Fine-tuning</strong> bakes the knowledge into the model itself. Use RAG for facts that change; fine-tune for style or domain expertise.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating progress card (top-right) */}
                  <div
                    className="absolute -top-6 -right-6 lg:-right-8 glass rounded-2xl p-3.5 shadow-xl w-[200px] animate-float-sway"
                    style={{ animationDelay: "-3s" }}
                  >
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Your progress</div>
                    <div className="text-sm font-bold text-gray-900">ChatGPT Mastery</div>
                    <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" style={{ width: "78%" }} />
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-[10px]">
                      <span className="text-gray-500">Module 7 of 9</span>
                      <span className="font-bold text-violet-600">78%</span>
                    </div>
                  </div>

                  {/* Floating badge (bottom-left) */}
                  <div
                    className="absolute -bottom-6 -left-4 lg:-left-8 glass rounded-2xl p-3 shadow-xl flex items-center gap-2.5 animate-float-sway"
                    style={{ animationDelay: "-5s" }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-md">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500">Just earned</div>
                      <div className="text-xs font-bold text-gray-900">Prompt Wizard</div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>

          {/* Hero scroll cue */}
          <div className="mt-16 lg:mt-20 flex justify-center">
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <span className="text-[10px] uppercase tracking-widest">Scroll to explore</span>
              <div className="w-6 h-10 rounded-full border-2 border-gray-300 flex items-start justify-center p-1.5">
                <div className="w-1 h-2 bg-gray-400 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          2. LIVE PULSE DASHBOARD — animated charts
          ════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-white via-violet-50/30 to-white border-y border-violet-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-10">
              <span className="text-xs font-bold tracking-widest uppercase text-violet-600">Live platform pulse</span>
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mt-2">
                What&rsquo;s happening on LearnAI right now
              </h2>
              <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                Real telemetry from 10,000+ learners across 28 Indian cities.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={150}>
            <LivePulseDashboard />
          </RevealOnScroll>

          {/* Activity feed */}
          <RevealOnScroll delay={250}>
            <div className="mt-12 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-3xl p-6 lg:p-8 border border-violet-100">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Live activity</h3>
                  <p className="text-sm text-gray-500">From learners across India · updates in real time</p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-strong" />
                  Streaming
                </div>
              </div>
              <LiveActivityFeed />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          3. AI TUTOR DEMO — typing chat showcase
          ════════════════════════════════════════════════════════════════════ */}
      <section id="tutor-demo" className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-violet-50/40" />
        {/* Animated grid lines background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ede9fe 1px, transparent 1px), linear-gradient(to bottom, #ede9fe 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <RevealOnScroll from="left">
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-violet-600">AI Tutor · Pro</span>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-2 leading-tight">
                  Stuck? <br />
                  <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    Ask the AI Tutor.
                  </span>
                </h2>
                <p className="mt-5 text-lg text-gray-600 leading-relaxed">
                  Available 24/7 on every dashboard page. Trained on the LearnAI curriculum. Speaks Hindi, English, and Hinglish.
                </p>

                <ul className="mt-6 space-y-3">
                  {[
                    "Explain any concept at any depth — beginner to PhD",
                    "Get hands-on code examples in Python, JS, or pseudocode",
                    "Ask for hints on quizzes — without giving away the answer",
                    "Practise prompt engineering with instant feedback",
                    "Available in the floating widget on every dashboard page",
                  ].map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-gray-700">
                      <svg className="flex-shrink-0 w-5 h-5 text-emerald-500 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-xl transition-all"
                  >
                    Try the AI Tutor
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <span className="text-xs text-gray-500">7-day free trial · No credit card</span>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll from="right" delay={150}>
              <AiTutorDemo />
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          4. TOOLS MARQUEE
          ════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 bg-white border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-8">
              <span className="text-xs font-bold tracking-widest uppercase text-gray-500">
                Master 16+ AI tools
              </span>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1">
                The tools that matter — taught by people who use them daily
              </h2>
            </div>
          </RevealOnScroll>
          <MarqueeLogos kind="tools" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          5. BENTO FEATURES GRID
          ════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <span className="text-xs font-bold tracking-widest uppercase text-violet-600">Why LearnAI</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-2">
                Everything you need.<br />
                <span className="text-gray-400">Nothing you don&apos;t.</span>
              </h2>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={150}>
            <BentoFeaturesGrid />
          </RevealOnScroll>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          6. CAREER OUTCOMES — animated salary chart
          ════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-10">
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-600">Outcomes</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-2">
                Real careers. <span className="text-emerald-600">Real numbers.</span>
              </h2>
              <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                We track what happens after you finish a course. The data speaks for itself.
              </p>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={150}>
            <OutcomesChart />
          </RevealOnScroll>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          7. LEARNING PATH DIAGRAM
          ════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-violet-50/40 via-white to-indigo-50/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <span className="text-xs font-bold tracking-widest uppercase text-violet-600">Your journey</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-2">
                A clear path from curious to hired
              </h2>
              <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                Hover any milestone to see exactly what you&apos;ll learn — and the outcome it unlocks.
              </p>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={150}>
            <LearningPathDiagram />
          </RevealOnScroll>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          8. FREE COURSES
          ════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-emerald-50/40 to-teal-50/40 border-y border-emerald-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
              <div>
                <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold mb-3">
                  100% free · forever
                </div>
                <h2 className="text-3xl lg:text-5xl font-bold text-gray-900">
                  Start learning today.<br />
                  <span className="text-emerald-600">No card required.</span>
                </h2>
              </div>
              <Link
                href="/register"
                className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-xl shadow-emerald-500/25 transition-all hover:scale-105"
              >
                Sign up free
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </RevealOnScroll>

          {freeCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {freeCourses.map((course, i) => (
                <RevealOnScroll key={course.id} delay={100 + i * 100}>
                  <TiltCourseCard
                    href={`/courses/${course.slug}`}
                    title={course.title}
                    subtitle={course.subtitle}
                    instructor={course.instructor.displayName}
                    rating={course.averageRating}
                    students={course.totalStudents}
                    isFree
                    level={course.level}
                    category={course.category?.name}
                    visual={<CourseCardVisual catSlug={course.category?.slug} title={course.title} />}
                  />
                </RevealOnScroll>
              ))}
            </div>
          ) : (
            <EmptyCourseGrid />
          )}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          9. FEATURED PAID COURSES — tilted 3D cards
          ════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <span className="text-xs font-bold tracking-widest uppercase text-violet-600">Top courses</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-2">
                Hand-picked for serious learners
              </h2>
              <p className="mt-3 text-lg text-gray-600">All included free with the Pro plan.</p>
            </div>
          </RevealOnScroll>

          {/* Category pills */}
          <RevealOnScroll delay={100}>
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {CATEGORIES.slice(0, 8).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/courses?category=${cat.id}`}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </RevealOnScroll>

          {paidFeatured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paidFeatured.map((course, i) => {
                const cat = course.category?.slug ?? "prompting";
                const colours = CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.prompting!;
                return (
                  <RevealOnScroll key={course.id} delay={i * 80} from="bottom">
                    <TiltCourseCard
                      href={`/courses/${course.slug}`}
                      title={course.title}
                      subtitle={course.subtitle}
                      instructor={course.instructor.displayName}
                      rating={course.averageRating}
                      students={course.totalStudents}
                      price={course.price}
                      originalPrice={course.originalPrice}
                      isFree={course.isFree}
                      level={course.level}
                      category={course.category?.name}
                      visual={
                        <div className={`absolute inset-0 bg-gradient-to-br ${colours.from} ${colours.to}`}>
                          <CourseCardVisual catSlug={cat} title={course.title} />
                        </div>
                      }
                    />
                  </RevealOnScroll>
                );
              })}
            </div>
          ) : (
            <EmptyCourseGrid />
          )}

          <div className="text-center mt-12">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-violet-300 text-violet-700 font-bold rounded-xl hover:bg-violet-50 transition-colors"
            >
              View all 12+ courses
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          10. LIVE CLASSES — with real countdown timers
          ════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 lg:py-24 overflow-hidden bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
        {/* Decorative orbs */}
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-violet-500/30 blur-3xl animate-pulse-strong" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-pink-500/20 blur-3xl animate-pulse-strong" style={{ animationDelay: "-3s" }} />

        {/* Animated SVG waves at bottom */}
        <svg className="absolute bottom-0 left-0 right-0 w-full h-24 opacity-30" preserveAspectRatio="none" viewBox="0 0 1440 100">
          <path
            d="M0,50 C320,100 720,0 1440,60 L1440,100 L0,100 Z"
            fill="white"
            opacity="0.05"
          />
          <path
            d="M0,70 C480,30 960,90 1440,40 L1440,100 L0,100 Z"
            fill="white"
            opacity="0.08"
          />
        </svg>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white text-xs font-bold mb-4">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse-strong" />
                Streaming weekly
              </div>
              <h2 className="text-4xl lg:text-6xl font-bold text-white">
                Live with India&apos;s top<br />
                <span className="bg-gradient-to-r from-pink-300 to-violet-300 bg-clip-text text-transparent">AI engineers</span>
              </h2>
              <p className="mt-4 text-lg text-violet-200 max-w-2xl mx-auto">
                Real-time Q&amp;A. Code-along sessions. Career conversations. Free with Pro.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {liveSessions.length === 0 ? (
              <div className="col-span-3 glass-dark rounded-3xl p-12 text-center">
                <p className="text-violet-200 text-sm">No upcoming sessions right now. Check back soon — we host 3+ live classes a week.</p>
                <Link href="/live" className="inline-block mt-4 px-5 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold rounded-xl transition-colors">
                  View all live sessions
                </Link>
              </div>
            ) : (
              liveSessions.map((cls, i) => {
                const isLive = cls.status === "LIVE";
                const seatsLeft = cls.maxSeats - cls._count.rsvps;
                const seatsPercent = Math.round((cls._count.rsvps / cls.maxSeats) * 100);
                return (
                  <RevealOnScroll key={cls.id} delay={i * 100}>
                    <div className="glass-dark rounded-3xl p-6 hover:bg-white/15 transition-all">
                      {isLive ? (
                        <div className="inline-flex items-center gap-1.5 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full mb-4 animate-pulse-strong">
                          <span className="w-1 h-1 bg-white rounded-full" />
                          LIVE NOW
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 bg-white/15 text-violet-200 text-[10px] font-bold px-2.5 py-1 rounded-full mb-4 uppercase tracking-wider">
                          Upcoming
                        </div>
                      )}

                      <h3 className="font-bold text-white text-base leading-tight mb-2 line-clamp-2">{cls.title}</h3>
                      {cls.topic && <p className="text-xs text-violet-300 mb-4">{cls.topic}</p>}

                      <div className="space-y-2 text-xs text-violet-200 mb-4">
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {cls.instructor.displayName}
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(cls.scheduledAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {new Date(cls.scheduledAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} IST
                        </div>
                      </div>

                      {/* Real countdown timer */}
                      <div className="mb-4">
                        <CountdownTimer target={cls.scheduledAt as unknown as string} />
                      </div>

                      {/* Seat availability */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-[10px] text-violet-300 mb-1">
                          <span>{seatsLeft} of {cls.maxSeats} seats left</span>
                          <span>{seatsPercent}% full</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-violet-400 to-pink-400 h-1.5 rounded-full"
                            style={{ width: `${seatsPercent}%` }}
                          />
                        </div>
                      </div>

                      <Link
                        href="/live"
                        className={`block text-center py-2.5 rounded-xl text-sm font-bold transition-all ${
                          isLive
                            ? "bg-red-500 hover:bg-red-400 text-white"
                            : "bg-white text-violet-700 hover:bg-violet-50"
                        }`}
                      >
                        {isLive ? "Join Live Now →" : "Reserve Free Seat"}
                      </Link>
                    </div>
                  </RevealOnScroll>
                );
              })
            )}
          </div>

          <div className="text-center">
            <Link
              href="/live"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-violet-700 font-bold rounded-xl hover:bg-violet-50 shadow-2xl transition-all hover:scale-105"
            >
              View all live classes
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          11. CERTIFICATE SHOWCASE — 3D floating certificates
          ════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-amber-50/30 via-white to-emerald-50/30 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <RevealOnScroll from="left">
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-amber-600">Verified certificates</span>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-2 leading-tight">
                  Earn certificates<br />
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">recruiters trust.</span>
                </h2>
                <p className="mt-5 text-lg text-gray-600 leading-relaxed">
                  Every certificate has a public verification URL — your future employer can confirm it in two clicks. Listed under &ldquo;AI Skills&rdquo; in 200+ Indian company HRMS systems.
                </p>

                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-3xl font-bold text-amber-600"><AnimatedCounter to={5000} indian />+</div>
                    <div className="text-xs text-gray-500 mt-1">Certificates issued</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-amber-600"><AnimatedCounter to={200} />+</div>
                    <div className="text-xs text-gray-500 mt-1">Recognising companies</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-amber-600"><AnimatedCounter to={94} suffix="%" /></div>
                    <div className="text-xs text-gray-500 mt-1">Course completion</div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/verify"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 shadow-lg shadow-amber-500/25 transition-all"
                  >
                    Verify a certificate
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </Link>
                  <span className="text-xs text-gray-500">PDF download · LinkedIn-ready · Public URLs</span>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll from="right" delay={150}>
              <CertificateShowcase />
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          12. TESTIMONIALS — auto-rotating carousel
          ════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-white to-violet-50/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <span className="text-xs font-bold tracking-widest uppercase text-violet-600">Loved by Indian learners</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-2">
                10,000 students.<br />
                <span className="text-gray-400">Stories that matter.</span>
              </h2>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={150}>
            <TestimonialCarousel />
          </RevealOnScroll>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          13. PARTNERS / TRUST MARQUEE
          ════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 bg-white border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-8">
              <span className="text-xs font-bold tracking-widest uppercase text-gray-500">
                Our alumni now work at
              </span>
              <p className="text-sm text-gray-400 mt-1">From IIM Bangalore to Razorpay engineering teams</p>
            </div>
          </RevealOnScroll>
          <MarqueeLogos kind="partners" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          14. FAQ — interactive accordion
          ════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-violet-50/30 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <span className="text-xs font-bold tracking-widest uppercase text-violet-600">FAQ</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-2">
                Everything you wanted to ask.
              </h2>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={150}>
            <FaqAccordion />
          </RevealOnScroll>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              Still have a question?{" "}
              <Link href="/contact" className="font-semibold text-violet-600 hover:text-violet-700">
                Email our support team →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          15. FINAL CTA — gradient banner with sparkles
          ════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700" />

        {/* Decorative grid + orbs */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
          }}
        />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-pink-400/30 blur-3xl animate-blob-1" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-violet-400/30 blur-3xl animate-blob-2" />

        {/* Floating sparkles */}
        {[
          { x: "10%", y: "20%", d: "0s",  s: "8px" },
          { x: "85%", y: "30%", d: "0.6s", s: "10px" },
          { x: "15%", y: "75%", d: "1.2s", s: "6px" },
          { x: "75%", y: "70%", d: "0.3s", s: "12px" },
          { x: "50%", y: "15%", d: "0.9s", s: "8px" },
          { x: "40%", y: "85%", d: "1.5s", s: "10px" },
        ].map((sp, i) => (
          <svg
            key={i}
            className="absolute text-white animate-sparkle pointer-events-none"
            style={{ left: sp.x, top: sp.y, width: sp.s, height: sp.s, animationDelay: sp.d }}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0L13.5 9.5L23 11L13.5 12.5L12 22L10.5 12.5L1 11L10.5 9.5L12 0Z" />
          </svg>
        ))}

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <RevealOnScroll from="scale">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight">
              Your AI career<br />
              starts <span className="italic">today.</span>
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={150}>
            <p className="mt-6 text-lg lg:text-xl text-violet-100 max-w-2xl mx-auto">
              10,000+ learners. ₹999/month for everything. 30-day money-back guarantee. No questions asked.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={300}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-violet-700 font-bold rounded-2xl shadow-2xl hover:scale-105 hover:shadow-white/40 transition-all"
              >
                Start free — no card needed
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl border-2 border-white/30 hover:bg-white/20 transition-all"
              >
                See pricing
              </Link>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={450}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-violet-200">
              {[
                "30-day money-back",
                "Cancel anytime",
                "GST invoice",
                "All in INR",
              ].map((b) => (
                <div key={b} className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {b}
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}

// ─── Empty state for course grids when DB is unreachable ──────────────────
function EmptyCourseGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-violet-100 to-indigo-100 animate-pulse" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
