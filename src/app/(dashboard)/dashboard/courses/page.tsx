"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc/client";

const STATUS_FILTERS = ["All", "In Progress", "Completed", "Not Started"];

function SkeletonRow() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
      <div className="flex gap-5">
        <div className="w-32 h-20 rounded-xl bg-gray-200 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
          <div className="h-2 bg-gray-200 rounded w-full mt-4" />
        </div>
      </div>
    </div>
  );
}

export default function MyCoursesPage() {
  const { data: session } = useSession();
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  const { data: enrollments, isLoading } = useQuery(trpc.enrollment.getAll.queryOptions());

  const filtered = (enrollments ?? []).filter((e) => {
    const matchSearch = !search.trim() || e.course.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "All" ||
      (statusFilter === "Completed" && e.progress === 100) ||
      (statusFilter === "In Progress" && e.progress > 0 && e.progress < 100) ||
      (statusFilter === "Not Started" && e.progress === 0);
    return matchSearch && matchStatus;
  });

  const completedCount = (enrollments ?? []).filter((e) => e.progress === 100).length;
  const inProgressCount = (enrollments ?? []).filter((e) => e.progress > 0 && e.progress < 100).length;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/dashboard" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
            </div>
            <p className="text-sm text-gray-500 ml-11">
              {(enrollments ?? []).length} courses enrolled · {completedCount} completed
            </p>
          </div>
          <Link href="/courses" className="px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors shadow-md">
            Browse More
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Enrolled", value: (enrollments ?? []).length, color: "text-violet-600" },
            { label: "Completed", value: completedCount, color: "text-green-600" },
            { label: "In Progress", value: inProgressCount, color: "text-amber-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
              <div className={`text-3xl font-bold ${s.color}`}>{isLoading ? "—" : s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your courses..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="flex gap-2">
            {STATUS_FILTERS.map((f) => (
              <button key={f} onClick={() => setStatusFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${statusFilter === f ? "bg-violet-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">{Array.from({length: 3}).map((_,i) => <SkeletonRow key={i} />)}</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => {
              const isComplete = item.progress === 100;
              return (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row gap-5 hover:shadow-md transition-shadow">
                  <div className="w-full sm:w-32 h-24 sm:h-20 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-200 flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-violet-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{item.course.title}</h3>
                      </div>
                      {isComplete && (
                        <span className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Completed
                        </span>
                      )}
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">{isComplete ? "Course completed!" : `${item.progress}% complete`}</span>
                        <span className={`font-semibold ${isComplete ? "text-green-600" : "text-violet-600"}`}>{item.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full transition-all ${isComplete ? "bg-green-500" : "bg-gradient-to-r from-violet-500 to-indigo-500"}`}
                          style={{ width: `${item.progress}%` }} />
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-400">
                      Enrolled {new Date(item.enrolledAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2 items-center sm:items-end justify-between sm:justify-center flex-shrink-0">
                    <Link href={`/dashboard/courses/${item.course.id}/learn`}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${isComplete ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-violet-600 text-white hover:bg-violet-700"}`}>
                      {isComplete ? "Review" : item.progress === 0 ? "Start" : "Continue"}
                    </Link>
                    {isComplete && (
                      <Link href="/dashboard/certificates" className="text-xs text-amber-600 hover:underline font-medium">View cert →</Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-10 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900 mb-0.5">Discover more AI courses</h3>
            <p className="text-sm text-gray-500">12+ courses covering ChatGPT, Gemini, Image Generation and more.</p>
          </div>
          <Link href="/courses" className="flex-shrink-0 px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors text-sm">
            Browse Courses →
          </Link>
        </div>
      </div>
    </div>
  );
}
