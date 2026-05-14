"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc/client";

const adminNav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/revenue", label: "Revenue" },
  { href: "/admin/coupons", label: "Coupons" },
];

const typeIcon: Record<string, { icon: string; bg: string; color: string }> = {
  user: { icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", bg: "bg-violet-100", color: "text-violet-600" },
  payment: { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", bg: "bg-green-100", color: "text-green-600" },
  course: { icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", bg: "bg-indigo-100", color: "text-indigo-600" },
  cert: { icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z", bg: "bg-amber-100", color: "text-amber-600" },
};

export default function AdminOverviewPage() {
  const { data: stats, isLoading } = useQuery(trpc.admin.getStats.queryOptions());

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers?.toLocaleString("en-IN") ?? "—", change: "Total registered", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "bg-violet-50 text-violet-600" },
    { label: "Total Courses", value: stats?.totalCourses?.toLocaleString() ?? "—", change: "On the platform", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", color: "bg-indigo-50 text-indigo-600" },
    { label: "Total Revenue", value: stats?.totalRevenue ? `₹${stats.totalRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}` : "₹0", change: "All time", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "bg-green-50 text-green-600" },
    { label: "Enrollments", value: stats?.totalEnrollments?.toLocaleString("en-IN") ?? "—", change: "Total", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="flex">
        <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-gray-200 min-h-screen pt-6 px-3 flex-shrink-0">
          <div className="mb-6 px-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <span className="font-bold text-gray-900 text-sm">Admin Panel</span>
            </div>
          </div>
          <nav className="space-y-1">
            {adminNav.map((item) => (
              <Link key={item.href} href={item.href}
                className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-violet-50 hover:text-violet-700 transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto pb-6 px-3">
            <Link href="/" className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors">← Back to Site</Link>
          </div>
        </aside>

        <main className="flex-1 p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
            <p className="text-sm text-gray-500 mt-1">{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {statCards.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon} /></svg>
                </div>
                <div className="text-xl font-bold text-gray-900">{isLoading ? "—" : s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                <div className="text-xs text-gray-400 mt-1">{s.change}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Recent Users</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {isLoading ? (
                  Array.from({length:5}).map((_,i) => <div key={i} className="h-14 animate-pulse bg-gray-50 m-2 rounded-xl" />)
                ) : (stats?.recentUsers ?? []).map((user) => {
                  const style = typeIcon.user;
                  return (
                    <div key={user.id} className="flex items-center gap-4 px-6 py-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${style.bg}`}>
                        <span className={`text-sm font-bold ${style.color}`}>{user.name?.charAt(0) ?? "?"}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email} · {user.role}</p>
                      </div>
                      <p className="text-xs text-gray-400">{new Date(user.createdAt).toLocaleDateString("en-IN")}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  {[
                    { label: "Manage Users", href: "/admin/users", color: "bg-violet-50 text-violet-700 hover:bg-violet-100" },
                    { label: "Review Courses", href: "/admin/courses", color: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100" },
                    { label: "Revenue Report", href: "/admin/revenue", color: "bg-green-50 text-green-700 hover:bg-green-100" },
                    { label: "Coupon Manager", href: "/admin/coupons", color: "bg-amber-50 text-amber-700 hover:bg-amber-100" },
                  ].map((a) => (
                    <Link key={a.href} href={a.href}
                      className={`block w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${a.color}`}>
                      {a.label} →
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
