"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc/client";

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useQuery(trpc.instructor.getAnalytics.queryOptions());

  // Real last-12-months enrollment + revenue series from the API
  const monthly = analytics?.monthly ?? [];
  // Show the last 6 months on the chart for readability
  const monthlyData = monthly.length > 0
    ? monthly.slice(-6).map((m) => ({ month: m.month, students: m.students, revenue: m.revenue }))
    : [
        { month: "Jan", students: 0, revenue: 0 },
        { month: "Feb", students: 0, revenue: 0 },
        { month: "Mar", students: 0, revenue: 0 },
        { month: "Apr", students: 0, revenue: 0 },
        { month: "May", students: 0, revenue: 0 },
        { month: "Jun", students: 0, revenue: 0 },
      ];

  const maxStudents = Math.max(...monthlyData.map((d) => d.students), 1);
  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue), 1);

  const totalStudents = analytics?.totalStudents ?? 0;
  const totalRevenue  = analytics?.totalRevenue  ?? 0;
  const courseStats   = analytics?.courseStats   ?? [];
  const avgRating     = courseStats.length
    ? (courseStats.reduce((s, c) => s + c.averageRating, 0) / courseStats.length).toFixed(2)
    : "—";

  const summaryCards = [
    { label: "Total Students",        value: isLoading ? "—" : totalStudents.toLocaleString("en-IN") },
    { label: "Total Revenue (Your 70%)", value: isLoading ? "—" : `₹${totalRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}` },
    { label: "Published Courses",     value: isLoading ? "—" : courseStats.filter((c) => c.status === "PUBLISHED").length.toString() },
    { label: "Avg Rating",            value: isLoading ? "—" : avgRating },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/studio" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-sm text-gray-500">Your course performance overview</p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {summaryCards.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="text-xs text-gray-500 mb-1">{s.label}</div>
              {isLoading ? (
                <div className="h-7 w-24 bg-gray-100 rounded animate-pulse mt-1" />
              ) : (
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enrollment Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-6">Monthly Enrollments</h2>
            <div className="flex items-end gap-3 h-48">
              {monthlyData.map((d) => {
                const height = Math.max(Math.round((d.students / maxStudents) * 100), 2);
                return (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="text-xs text-gray-500 font-medium">{d.students}</div>
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-violet-600 to-indigo-500 transition-all hover:from-violet-700 hover:to-indigo-600"
                      style={{ height: `${height}%` }}
                    />
                    <div className="text-xs text-gray-400">{d.month}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Revenue per month */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-6">Revenue by Month</h2>
            <div className="space-y-3">
              {monthlyData.map((d) => {
                const w = Math.max(Math.round((d.revenue / maxRevenue) * 100), 2);
                return (
                  <div key={d.month}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-500 w-8">{d.month}</span>
                      <span className="font-semibold text-gray-900">
                        ₹{d.revenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-violet-500 to-indigo-500 h-2 rounded-full"
                        style={{ width: `${w}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Enrollments */}
        {(analytics?.recentEnrollments ?? []).length > 0 && (
          <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Recent Enrollments</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {(analytics?.recentEnrollments ?? []).map((e, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {(e.user.name ?? "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{e.user.name ?? "Unknown"}</div>
                    <div className="text-xs text-gray-500 truncate">{e.course.title}</div>
                  </div>
                  <div className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(e.enrolledAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Course Performance Table */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Course Performance</h2>
          </div>
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : courseStats.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-gray-400">
              No courses yet.{" "}
              <Link href="/studio" className="text-violet-600 hover:underline">Create your first course →</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Course", "Status", "Students", "Rating", "Action"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {courseStats.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4 font-medium text-sm text-gray-900 max-w-xs truncate">{c.title}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          c.status === "PUBLISHED"    ? "bg-green-100 text-green-700" :
                          c.status === "UNDER_REVIEW" ? "bg-blue-100 text-blue-700" :
                          c.status === "ARCHIVED"     ? "bg-gray-100 text-gray-500" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>{c.status}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{c.totalStudents.toLocaleString("en-IN")}</td>
                      <td className="px-5 py-4 text-sm text-yellow-600 font-semibold">
                        {c.averageRating > 0 ? `★ ${c.averageRating.toFixed(1)}` : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <Link href={`/studio/courses/${c.id}`} className="text-sm text-violet-600 hover:underline font-medium">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
