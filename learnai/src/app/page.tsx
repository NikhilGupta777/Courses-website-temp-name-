import Link from "next/link";
import { COURSES, LIVE_CLASSES, FREE_COURSE_SLUGS, CATEGORY_COLORS } from "@/lib/data/courses";
import { PLANS } from "@/lib/data/pricing";

const stats = [
  { label: "Students Enrolled", value: "10,000+" },
  { label: "AI Courses", value: "12+" },
  { label: "Completion Rate", value: "94%" },
  { label: "Certificates Issued", value: "5,000+" },
];

const categories = [
  "All", "ChatGPT & GPT-4", "Gemini AI", "AI Chatbots",
  "Image Generation", "Prompting", "AI Tools", "Business AI",
];

const testimonials = [
  {
    name: "Ankit Verma",
    role: "Software Engineer, Bangalore",
    quote: "LearnAI's ChatGPT Mastery course completely changed how I work. I save at least 3 hours every day using AI tools I learned here. The live sessions are absolutely worth it.",
  },
  {
    name: "Divya Nair",
    role: "Digital Marketing Manager, Mumbai",
    quote: "The AI for Business course was tailor-made for someone like me. Real Indian case studies, practical tools, and an instructor who actually understands the Indian market. Highly recommend.",
  },
  {
    name: "Rohit Gupta",
    role: "Final Year BTech Student, Delhi",
    quote: "Started with the free prompting course and was so impressed I immediately bought the Pro plan. The LLM Fundamentals course helped me crack my ML internship interview.",
  },
];

const steps = [
  {
    number: "01",
    title: "Choose Your Path",
    description: "Browse 12+ AI courses — from ChatGPT to Stable Diffusion. Start free or go Pro.",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  },
  {
    number: "02",
    title: "Learn at Your Pace",
    description: "Watch HD videos, join live webinars, and complete hands-on projects.",
    icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z",
  },
  {
    number: "03",
    title: "Test Your Knowledge",
    description: "Take timed quizzes and proctored assessments to prove your mastery.",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    number: "04",
    title: "Get Certified",
    description: "Earn shareable certificates and boost your resume or LinkedIn profile.",
    icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  },
];

function getCategoryColor(category: string) {
  return CATEGORY_COLORS[category] ?? { from: "from-violet-100", to: "to-indigo-200", icon: "text-violet-600" };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"} fill-current`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function HomePage() {
  const featuredCourses = COURSES.filter((c) => c.isFeatured).slice(0, 6);
  const freeCourses = COURSES.filter((c) => c.isFree);
  const upcomingLive = LIVE_CLASSES.slice(0, 3);

  return (
    <div className="overflow-hidden">


      {/* ===== HERO ===== */}
      <section className="relative min-h-[92vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-indigo-50">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Announcement badge */}
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-8 shadow-sm">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              🔥 New: ChatGPT &amp; Gemini Masterclass now live!
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-tight">
              Master AI with{" "}
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                India&apos;s Best Platform
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Learn <strong>ChatGPT</strong>, <strong>Gemini AI</strong>, <strong>Image Generation</strong>, and <strong>AI Prompting</strong> from India&apos;s top AI educators.
              Live classes, pre-recorded videos, quizzes, and certificates — all in one place.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/courses"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/35 hover:scale-105 transition-all duration-200"
              >
                Explore All Courses
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-violet-300 shadow-sm transition-all duration-200"
              >
                Start Free — No Credit Card
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-3 flex-wrap">
              <div className="flex -space-x-2">
                {["bg-violet-400","bg-indigo-400","bg-purple-400","bg-pink-400","bg-blue-400"].map((c, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-white`} />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                <span className="font-semibold text-gray-700">10,000+</span> students learning AI in India
              </span>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1">
                <StarRating rating={5} />
                <span className="text-sm font-medium text-gray-700 ml-1">4.9/5</span>
                <span className="text-sm text-gray-500">(3,200+ reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-14 bg-white border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-10 bg-gray-50 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/courses?category=${cat.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all duration-150 shadow-sm"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ===== FREE COURSES HIGHLIGHT ===== */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                100% Free — No Credit Card Needed
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                🎓 Start Learning for Free
              </h2>
              <p className="mt-2 text-lg text-gray-600">
                3 complete AI courses — absolutely free, forever. No strings attached.
              </p>
            </div>
            <Link
              href="/register"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 shadow-lg shadow-green-500/20 transition-all hover:scale-105"
            >
              Enroll Free Now
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {freeCourses.map((course) => {
              const colors = getCategoryColor(course.category);
              return (
                <Link key={course.id} href={`/courses/${course.slug}`}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-green-200 hover:shadow-lg hover:border-green-400 transition-all duration-200 group">
                    <div className={`relative h-36 bg-gradient-to-br ${colors.from} ${colors.to} flex items-center justify-center`}>
                      <div className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <svg className={`w-7 h-7 ${colors.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        FREE
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded">{course.level}</span>
                        <span className="text-xs text-gray-400">{course.duration}</span>
                        <span className="text-xs text-gray-400">· {course.totalLessons} lessons</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-violet-600 transition-colors line-clamp-2">{course.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">by {course.instructor.name}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <StarRating rating={course.rating} />
                        <span className="text-xs font-medium text-gray-700">{course.rating}</span>
                        <span className="text-xs text-gray-400">({course.totalReviews.toLocaleString()} reviews)</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-lg font-bold text-green-600">Free</span>
                        <span className="text-xs text-gray-400">{course.totalStudents.toLocaleString()} students</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>


      {/* ===== FEATURED COURSES ===== */}
      <section className="py-20 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Featured Courses</h2>
            <p className="mt-3 text-lg text-gray-600">Hand-picked courses to launch your AI career</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => {
              const colors = getCategoryColor(course.category);
              const discount = course.originalPrice > 0
                ? Math.round((1 - course.price / course.originalPrice) * 100)
                : 0;
              return (
                <Link key={course.id} href={`/courses/${course.slug}`}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-violet-200 group h-full flex flex-col">
                    <div className={`relative aspect-video bg-gradient-to-br ${colors.from} ${colors.to} overflow-hidden`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <svg className={`w-5 h-5 ${colors.icon} ml-0.5`} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      {course.badge && (
                        <div className="absolute top-3 left-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            course.badge === "Bestseller" ? "bg-orange-100 text-orange-700" :
                            course.badge === "New" ? "bg-blue-100 text-blue-700" :
                            course.badge === "Hot" ? "bg-red-100 text-red-700" :
                            "bg-green-100 text-green-700"
                          }`}>
                            {course.badge}
                          </span>
                        </div>
                      )}
                      {course.deliveryMode === "HYBRID" && (
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-600 text-white">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                            LIVE
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded">{course.level}</span>
                        <span className="text-xs text-gray-400">{course.duration}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-violet-600 transition-colors flex-1">
                        {course.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{course.instructor.name}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <StarRating rating={course.rating} />
                        <span className="text-xs font-medium text-gray-700">{course.rating}</span>
                        <span className="text-xs text-gray-400">({course.totalStudents.toLocaleString()})</span>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        {course.isFree ? (
                          <span className="text-lg font-bold text-green-600">Free</span>
                        ) : (
                          <>
                            <span className="text-lg font-bold text-gray-900">₹{course.price.toLocaleString("en-IN")}</span>
                            {course.originalPrice > course.price && (
                              <>
                                <span className="text-sm text-gray-400 line-through">₹{course.originalPrice.toLocaleString("en-IN")}</span>
                                {discount > 0 && (
                                  <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                    {discount}% off
                                  </span>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 border border-violet-300 text-violet-600 font-semibold rounded-xl hover:bg-violet-50 transition-colors"
            >
              View all 12+ courses
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>


      {/* ===== LIVE CLASSES PROMO ===== */}
      <section className="py-20 bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-violet-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-400 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              Live & Upcoming Sessions
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">🎥 Live Webinars &amp; Online Classes</h2>
            <p className="mt-3 text-violet-200 text-lg">Interactive sessions with India&apos;s top AI instructors — included free with Pro Plan</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {upcomingLive.map((cls) => (
              <div key={cls.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
                {cls.isLive && (
                  <div className="inline-flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 animate-pulse">
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                    LIVE NOW
                  </div>
                )}
                <h3 className="font-semibold text-white text-sm leading-snug mb-3 line-clamp-2">{cls.title}</h3>
                <div className="space-y-1.5 text-xs text-violet-200">
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {cls.instructor}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(cls.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {cls.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {cls.seatsLeft} seats left
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-white/20 rounded-full h-1.5 mb-3">
                    <div
                      className="bg-gradient-to-r from-violet-400 to-pink-400 h-1.5 rounded-full"
                      style={{ width: `${Math.round(((cls.maxSeats - cls.seatsLeft) / cls.maxSeats) * 100)}%` }}
                    />
                  </div>
                  <Link
                    href="/live"
                    className={`block text-center py-2 rounded-lg text-sm font-semibold transition-colors ${
                      cls.isLive
                        ? "bg-red-500 hover:bg-red-400 text-white"
                        : "bg-white/20 hover:bg-white/30 text-white"
                    }`}
                  >
                    {cls.isLive ? "Join Now →" : "Register Free"}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/live"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-violet-700 font-semibold rounded-xl hover:bg-violet-50 shadow-lg transition-all hover:scale-105"
            >
              View All Live Classes
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <p className="mt-3 text-violet-300 text-sm">✓ Included free with Pro Plan · ₹999/month</p>
          </div>
        </div>
      </section>


      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-3 text-lg text-gray-600">Your journey from curious beginner to AI expert in 4 steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.number} className="relative text-center group">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] right-0 h-0.5 bg-gradient-to-r from-violet-200 to-transparent" />
                )}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 mb-4 group-hover:from-violet-200 group-hover:to-indigo-200 transition-colors shadow-sm">
                  <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={step.icon} />
                  </svg>
                </div>
                <div className="text-xs font-bold text-violet-400 mb-2 tracking-widest">{step.number}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Loved by Indian Learners</h2>
            <p className="mt-3 text-lg text-gray-600">Real students, real results, real careers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-violet-100 transition-all">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-indigo-400 flex items-center justify-center text-white font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ===== PRICING PREVIEW ===== */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
            <p className="mt-3 text-lg text-gray-600">All prices in Indian Rupees. GST inclusive. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  plan.popular
                    ? "bg-gradient-to-b from-violet-600 to-indigo-700 text-white shadow-2xl shadow-violet-500/25 scale-105"
                    : "bg-white border border-gray-200 shadow-sm"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${plan.popular ? "bg-yellow-400 text-yellow-900" : "bg-indigo-100 text-indigo-700"}`}>
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className={`text-lg font-semibold ${plan.popular ? "text-white" : "text-gray-900"}`}>{plan.name}</h3>
                  <div className="mt-4">
                    <span className={`text-4xl font-bold ${plan.popular ? "text-white" : "text-gray-900"}`}>
                      {plan.priceDisplay}
                    </span>
                    <span className={`text-sm ${plan.popular ? "text-violet-200" : "text-gray-500"}`}>
                      {plan.period}
                    </span>
                  </div>
                  <p className={`mt-2 text-sm ${plan.popular ? "text-violet-200" : "text-gray-500"}`}>{plan.description}</p>
                </div>
                <ul className="mt-6 space-y-2.5 flex-1">
                  {plan.features.slice(0, 6).map((f) => (
                    <li key={f.text} className="flex items-center gap-2">
                      {f.included ? (
                        <svg className={`w-4 h-4 flex-shrink-0 ${plan.popular ? "text-violet-200" : "text-violet-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className={`w-4 h-4 flex-shrink-0 ${plan.popular ? "text-violet-400" : "text-gray-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span className={`text-sm ${plan.popular ? "text-violet-100" : f.included ? "text-gray-600" : "text-gray-400"}`}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`mt-8 block text-center py-3 px-4 rounded-xl text-sm font-semibold transition-all hover:scale-105 ${
                    plan.popular
                      ? "bg-white text-violet-700 hover:bg-violet-50 shadow-lg"
                      : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/pricing" className="text-violet-600 font-medium hover:text-violet-700 text-sm underline underline-offset-2">
              See full pricing comparison →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-20 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to Start Your AI Journey?
          </h2>
          <p className="mt-4 text-lg text-violet-100">
            Join 10,000+ Indian learners mastering AI. Start free today — no credit card needed.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-violet-700 bg-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Get Started for Free
            </Link>
            <Link
              href="/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all duration-200"
            >
              Browse All Courses
            </Link>
          </div>
          <p className="mt-6 text-violet-200 text-sm">
            ✓ 3 free courses forever &nbsp;·&nbsp; ✓ No credit card &nbsp;·&nbsp; ✓ Cancel Pro anytime
          </p>
        </div>
      </section>
    </div>
  );
}
