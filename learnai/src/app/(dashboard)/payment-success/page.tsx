"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { COURSES } from "@/lib/data/courses";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const enrolledCourseId = searchParams.get("enrolled");
  const subscribed       = searchParams.get("subscribed") === "true";
  const [confetti, setConfetti] = useState(false);

  const enrolledCourse = enrolledCourseId
    ? COURSES.find((c) => c.id === enrolledCourseId)
    : null;

  useEffect(() => {
    // Trigger confetti after mount
    setConfetti(true);
    const t = setTimeout(() => setConfetti(false), 3500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-green-50 flex items-center justify-center px-4 py-16">
      {/* Confetti particles */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-sm animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ["#7c3aed","#4f46e5","#10b981","#f59e0b","#ec4899"][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.6 + Math.random()}s`,
                opacity: Math.random() * 0.8 + 0.2,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-lg w-full">
        {subscribed ? (
          /* ── Subscription success ── */
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-violet-500/30">
              <span className="text-4xl">🎉</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">You&apos;re now Pro!</h1>
            <p className="text-gray-500 mb-2">
              Welcome to LearnAI Pro. Your 7-day free trial has started.
            </p>
            <p className="text-gray-400 text-sm mb-8">
              You now have access to all 12+ courses, live classes, certificates, and the AI Tutor chatbot.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: "📚", label: "All 12+ Courses", desc: "Unlimited access" },
                { icon: "🎥", label: "Live Classes", desc: "Join & rewatch" },
                { icon: "🏆", label: "Certificates", desc: "Shareable PDFs" },
                { icon: "🤖", label: "AI Tutor", desc: "GPT-powered Q&A" },
              ].map((feat) => (
                <div key={feat.label} className="bg-white rounded-2xl p-4 border border-violet-100 shadow-sm text-left">
                  <div className="text-2xl mb-1">{feat.icon}</div>
                  <div className="text-sm font-semibold text-gray-900">{feat.label}</div>
                  <div className="text-xs text-gray-400">{feat.desc}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/courses"
                className="flex-1 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg text-center text-sm">
                Explore All Courses →
              </Link>
              <Link href="/dashboard"
                className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-center text-sm">
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : enrolledCourse ? (
          /* ── Course purchase success ── */
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/30">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
            <p className="text-gray-500 mb-6">
              You&apos;re now enrolled in <strong>{enrolledCourse.title}</strong>.
              A receipt has been sent to your email.
            </p>

            {/* Course card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 flex items-center gap-4 text-left">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-200 flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-violet-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 line-clamp-1">{enrolledCourse.title}</div>
                <div className="text-sm text-gray-500 mt-0.5">by {enrolledCourse.instructor.name}</div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                  <span>{enrolledCourse.duration}</span>
                  <span>·</span>
                  <span>{enrolledCourse.totalLessons} lessons</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={`/dashboard/courses/${enrolledCourse.id}/learn`}
                className="flex-1 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 shadow-lg transition-all text-center text-sm">
                Start Learning Now →
              </Link>
              <Link href="/dashboard"
                className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-center text-sm">
                Dashboard
              </Link>
            </div>
          </div>
        ) : (
          /* ── Generic success ── */
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
            <p className="text-gray-500 mb-8">Your purchase was completed. Check your email for a receipt.</p>
            <Link href="/dashboard"
              className="px-8 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 shadow-lg transition-all text-sm">
              Go to Dashboard →
            </Link>
          </div>
        )}

        {/* Support note */}
        <p className="text-center text-xs text-gray-400 mt-8">
          Questions?{" "}
          <a href="mailto:support@learnai.in" className="text-violet-600 hover:underline">
            support@learnai.in
          </a>
          {" "}· We respond within 4 business hours.
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
