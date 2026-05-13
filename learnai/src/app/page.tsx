import Link from "next/link";

// Stats data
const stats = [
  { label: "Students Worldwide", value: "50,000+" },
  { label: "Expert Courses", value: "200+" },
  { label: "Completion Rate", value: "94%" },
  { label: "Certificates Issued", value: "35,000+" },
];

// Featured courses (mock data)
const featuredCourses = [
  {
    id: 1,
    title: "Complete Machine Learning & AI Bootcamp",
    instructor: "Dr. Sarah Chen",
    rating: 4.9,
    students: 12500,
    price: 79,
    originalPrice: 199,
    thumbnail: "/api/placeholder/400/225",
    level: "Beginner",
    duration: "42h",
    tag: "Bestseller",
  },
  {
    id: 2,
    title: "Deep Learning with PyTorch & TensorFlow",
    instructor: "Prof. James Wilson",
    rating: 4.8,
    students: 8300,
    price: 99,
    originalPrice: 249,
    thumbnail: "/api/placeholder/400/225",
    level: "Intermediate",
    duration: "38h",
    tag: "Hot",
  },
  {
    id: 3,
    title: "Natural Language Processing Masterclass",
    instructor: "Dr. Priya Sharma",
    rating: 4.9,
    students: 6700,
    price: 89,
    originalPrice: 229,
    thumbnail: "/api/placeholder/400/225",
    level: "Advanced",
    duration: "28h",
    tag: "New",
  },
  {
    id: 4,
    title: "Computer Vision & Image Recognition",
    instructor: "Alex Rodriguez",
    rating: 4.7,
    students: 5400,
    price: 69,
    originalPrice: 179,
    thumbnail: "/api/placeholder/400/225",
    level: "Intermediate",
    duration: "32h",
    tag: "Popular",
  },
  {
    id: 5,
    title: "AI for Business Leaders",
    instructor: "Maria Johnson",
    rating: 4.8,
    students: 9200,
    price: 49,
    originalPrice: 129,
    thumbnail: "/api/placeholder/400/225",
    level: "Beginner",
    duration: "16h",
    tag: "Trending",
  },
  {
    id: 6,
    title: "Reinforcement Learning from Scratch",
    instructor: "Dr. Kevin Park",
    rating: 4.9,
    students: 3800,
    price: 119,
    originalPrice: 299,
    thumbnail: "/api/placeholder/400/225",
    level: "Expert",
    duration: "45h",
    tag: "Advanced",
  },
];

// Testimonials
const testimonials = [
  {
    name: "Emily Zhang",
    role: "ML Engineer at Google",
    quote: "LearnAI transformed my career. The hands-on projects and expert instruction gave me the confidence to land my dream job.",
    image: "/api/placeholder/48/48",
  },
  {
    name: "Marcus Johnson",
    role: "Data Scientist at Netflix",
    quote: "The live classes are incredible. Being able to ask questions in real-time and get personalized feedback is invaluable.",
    image: "/api/placeholder/48/48",
  },
  {
    name: "Sofia Patel",
    role: "AI Researcher",
    quote: "The certificate I earned here helped me get accepted into a top PhD program. The quality is unmatched.",
    image: "/api/placeholder/48/48",
  },
];

// How it works steps
const steps = [
  {
    number: "01",
    title: "Choose Your Path",
    description: "Browse our curated AI courses and learning paths designed for every skill level.",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  },
  {
    number: "02",
    title: "Learn at Your Pace",
    description: "Watch HD videos, attend live classes, and complete hands-on projects.",
    icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z",
  },
  {
    number: "03",
    title: "Test Your Knowledge",
    description: "Take quizzes and timed assessments to solidify your understanding.",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    number: "04",
    title: "Get Certified",
    description: "Earn verifiable certificates and share them on LinkedIn to showcase your expertise.",
    icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  },
];

// Pricing plans
const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with AI fundamentals",
    features: [
      "Access to 10 free courses",
      "Community forum access",
      "Basic quizzes",
      "Mobile access",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "Full access to accelerate your career",
    features: [
      "All 200+ courses",
      "Live class access",
      "Unlimited quizzes & tests",
      "Completion certificates",
      "Priority support",
      "Offline downloads",
      "AI tutor chatbot",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "Team management dashboard",
      "Custom learning paths",
      "SSO integration",
      "Dedicated account manager",
      "Analytics & reporting",
      "API access",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-indigo-50">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
              New: GPT-4 & LLM Engineering Course Now Live
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900">
              Master{" "}
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Artificial Intelligence
              </span>{" "}
              with World-Class Experts
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Live classes, pre-recorded courses, hands-on projects, quizzes, and verifiable certificates.
              Join 50,000+ learners building the future with AI.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/courses"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:scale-105 transition-all duration-200"
              >
                Explore Courses
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                View Pricing
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-12 flex items-center justify-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-400 border-2 border-white"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                <span className="font-semibold text-gray-700">4.9/5</span> from 12,000+ reviews
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="py-16 bg-white border-y border-gray-100">
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

      {/* ===== FEATURED COURSES ===== */}
      <section className="py-20 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Featured Courses
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              Hand-picked courses to accelerate your AI journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-violet-200 group"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-violet-100 to-indigo-100 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 text-violet-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  {/* Tag badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700">
                      {course.tag}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded">
                      {course.level}
                    </span>
                    <span className="text-xs text-gray-400">{course.duration}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-violet-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{course.instructor}</p>

                  {/* Rating & Students */}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">{course.rating}</span>
                    </div>
                    <span className="text-sm text-gray-400">
                      {course.students.toLocaleString()} students
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">${course.price}</span>
                    <span className="text-sm text-gray-400 line-through">${course.originalPrice}</span>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                      {Math.round((1 - course.price / course.originalPrice) * 100)}% off
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-violet-600 font-semibold hover:text-violet-700 transition-colors"
            >
              View all courses
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              Your journey from beginner to AI expert in 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center group">
                {/* Step number */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 mb-4 group-hover:from-violet-200 group-hover:to-indigo-200 transition-colors">
                  <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={step.icon} />
                  </svg>
                </div>
                <div className="text-xs font-bold text-violet-500 mb-2">{step.number}</div>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Loved by Learners
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              Hear from students who transformed their careers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-indigo-400" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-xs text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              Choose the plan that fits your learning goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? "bg-gradient-to-b from-violet-600 to-indigo-700 text-white shadow-2xl shadow-violet-500/25 scale-105"
                    : "bg-white border border-gray-200 shadow-sm"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className={`text-lg font-semibold ${plan.popular ? "text-white" : "text-gray-900"}`}>
                    {plan.name}
                  </h3>
                  <div className="mt-4">
                    <span className={`text-4xl font-bold ${plan.popular ? "text-white" : "text-gray-900"}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm ${plan.popular ? "text-violet-200" : "text-gray-500"}`}>
                      {plan.period}
                    </span>
                  </div>
                  <p className={`mt-2 text-sm ${plan.popular ? "text-violet-200" : "text-gray-500"}`}>
                    {plan.description}
                  </p>
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <svg
                        className={`w-4 h-4 flex-shrink-0 ${plan.popular ? "text-violet-200" : "text-violet-500"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={`text-sm ${plan.popular ? "text-violet-100" : "text-gray-600"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`mt-8 w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                    plan.popular
                      ? "bg-white text-violet-700 hover:bg-violet-50 shadow-lg"
                      : "bg-violet-600 text-white hover:bg-violet-700 shadow-md"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to Start Your AI Journey?
          </h2>
          <p className="mt-4 text-lg text-violet-100">
            Join 50,000+ learners already mastering AI. Start with a free course today.
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
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
