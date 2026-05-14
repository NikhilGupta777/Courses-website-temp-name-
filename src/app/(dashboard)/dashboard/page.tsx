"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc/client";

// Static upcoming sessions shown until the LiveClass DB model is built in Phase 2.
// Will be replaced by trpc.liveClass.getAll in the next phase.
const UPCOMING_SESSIONS = [
  { id: "lc-01", title: "ChatGPT Masterclass: Live Q&A & Advanced Techniques", instructor: "Rahul Mehta", date: "2026-06-10", time: "7:00 PM IST", isLive: false },
  { id: "lc-02", title: "AI Image Generation Workshop: Midjourney v6 Secrets", instructor: "Priya Sharma", date: "2026-06-15", time: "5:00 PM IST", isLive: false },
]; = [
  { href: "/dashboard", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/dashboard/courses", label: "My Courses", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { href: "/live", label: "Live Classes", icon: "M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
  { href: "/dashboard/certificates", label: "Certificates", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" },
  { href: "/dashboard/profile", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
];

// Static upcoming sessions — replaced by real data in Phase 2
const upcomingLive = UPCOMING_SESSIONS;

function SkeletonCard() {
  return <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse h-24" />;
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const userName = session?.user?.name ?? "Learner";

  const { data, isLoading } = useQuery(trpc.user.getDashboard.queryOptions());
  const { data: recommended } = useQuery(trpc.course.getFeatured.queryOptions());

  const enrollments = data?.enrollments ?? [];
  const certificates = data?.certificates ?? [];
  const stats = data?.stats;

  const statCards = [
    { label: "Courses Enrolled", value: stats?.totalEnrolled ?? 0, icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", color: "bg-violet-50 text-violet-600" },
    { label: "Completed", value: enrollments.filter(e => e.status === "COMPLETED").length, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "bg-green-50 text-green-600" },
    { label: "Certificates", value: stats?.totalCertificates ?? 0, icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z", color: "bg-yellow-50 text-yellow-600" },
    { label: "Day Streak", value: 7, icon: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z", color: "bg-orange-50 text-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0 lg:flex lg:flex-col pt-16`}>
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                {userName.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-gray-900 text-sm truncate">{userName}</div>
                <div className="text-xs text-gray-500 truncate">{session?.user?.email}</div>
                <div className="mt-0.5">
                  <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">✦ Student</span>
                </div>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-violet-50 hover:text-violet-700 transition-colors group">
                <svg className="w-4 h-4 flex-shrink-0 group-hover:text-violet-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
                </svg>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-100">
            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl p-4 border border-violet-100">
              <p className="text-xs font-semibold text-violet-700 mb-1">Upgrade to Pro</p>
              <p className="text-xs text-gray-500 mb-3">Unlock all courses and live classes</p>
              <Link href="/pricing" className="block text-center py-1.5 text-xs font-semibold text-violet-600 bg-white border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors">
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 min-w-0 pt-16">
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Welcome back, {userName.split(" ")[0]}! 👋</h1>
            <p className="text-sm text-gray-500">Here&apos;s your learning summary</p>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-gray-900">{isLoading ? "—" : stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Continue Learning */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Continue Learning</h2>
            {isLoading ? (
              <div className="space-y-4">{Array.from({length: 3}).map((_,i) => <SkeletonCard key={i} />)}</div>
            ) : enrollments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <p className="text-gray-500 text-sm">You have not enrolled in any courses yet.</p>
                <Link href="/courses" className="mt-4 inline-flex items-center px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors">
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-200 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-violet-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{item.course.title}</h3>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">{item.progress}% complete</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${item.progress === 100 ? "bg-green-500" : "bg-gradient-to-r from-violet-500 to-indigo-500"}`}
                            style={{ width: `${item.progress}%` }} />
                        </div>
                      </div>
                    </div>
                    <Link href={`/dashboard/courses/${item.course.id}/learn`}
                      className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                        item.progress === 100 ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-violet-600 text-white hover:bg-violet-700"
                      }`}>
                      {item.progress === 100 ? "Review" : "Continue"}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upcoming live */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Upcoming Live Classes</h2>
                <Link href="/live" className="text-xs text-violet-600 font-medium hover:underline">View all →</Link>
              </div>
              <div className="space-y-3">
                {upcomingLive.map((cls) => (
                  <div key={cls.id} className={`bg-white rounded-2xl border p-4 shadow-sm ${cls.isLive ? "border-red-200" : "border-gray-100"}`}>
                    {cls.isLive && (
                      <div className="inline-flex items-center gap-1.5 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />LIVE NOW
                      </div>
                    )}
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{cls.title}</h3>
                    <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-500">
                      <span>{cls.instructor}</span><span>·</span>
                      <span>{new Date(cls.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} at {cls.time}</span>
                    </div>
                    <div className="mt-3">
                      <Link href="/live" className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${cls.isLive ? "bg-red-500 text-white hover:bg-red-600" : "bg-violet-100 text-violet-700 hover:bg-violet-200"}`}>
                        {cls.isLive ? "Join Now" : "Join Session"}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificates */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Your Certificates</h2>
                <Link href="/dashboard/certificates" className="text-xs text-violet-600 font-medium hover:underline">View all →</Link>
              </div>
              <div className="space-y-3">
                {certificates.length === 0 ? (
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center text-gray-400 text-sm">
                    Complete a course to earn your first certificate!
                  </div>
                ) : certificates.map((cert) => (
                  <div key={cert.id} className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm">{cert.course.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">Issued: {new Date(cert.issuedAt).toLocaleDateString("en-IN")}</div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">{cert.certificateNumber}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended */}
          {(recommended?.filter(c => !c.isFree) ?? []).length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Recommended for You</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(recommended?.filter(c => !c.isFree) ?? []).slice(0,3).map((course) => (
                  <Link key={course.id} href={`/courses/${course.slug}`}>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:border-violet-200 transition-all group">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-200 flex items-center justify-center flex-shrink-0 group-hover:from-violet-200 group-hover:to-indigo-300 transition-colors">
                          <svg className="w-5 h-5 text-violet-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-violet-600 transition-colors">{course.title}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">{course.instructor.displayName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-semibold text-gray-900">₹{(course.price ?? 0).toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
