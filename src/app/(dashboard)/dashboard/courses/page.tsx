"use client";

import Link from "next/link";
import { useState } from "react";
import { COURSES } from "@/lib/data/courses";

// Mock enrolled courses — in production this comes from the DB via tRPC
const mockEnrolled = [
  { courseId: "c-01", progress: 65, enrolledAt: "Jan 15, 2026", lastLesson: "Role & persona prompting" },
  { courseId: "c-04", progress: 30, enrolledAt: "Feb 10, 2026", lastLesson: "Midjourney interface & commands" },
  { courseId: "c-05", progress: 100, enrolledAt: "Jan 2, 2026", lastLesson: "Build your prompt template library" },
  { courseId: "c-06", progress: 100, enrolledAt: "Jan 3, 2026", lastLesson: "What's next? — your AI learning roadmap" },
  { courseId: "c-07", progress: 45, enrolledAt: "Mar 5, 2026", lastLesson: "Canva AI: Design without skills" },
];

const STATUS_FILTERS = ["All", "In Progress", "Completed", "Not Started"];

export default function MyCoursesPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  // Fix #8: the original cast was grouped incorrectly:
  //   as typeof mockEnrolled[number] & { course: ... }[]
  // which parses as (mockEnrolled[number]) & ({ course: ... }[]) — an
  // intersection of an enrolment object and an *array* of course-wrappers —
  // rather than an array of (enrolment & course) objects.
  // Correct: wrap the element type in its own parentheses.
  const enriched = mockEnrolled
    .map((e) => {
      const course = COURSES.find((c) => c.id === e.courseId);
      return course ? { ...e, course } : null;
    })
    .filter(Boolean) as (typeof mockEnrolled[number] & { course: (typeof COURSES)[number] })[];

  const filtered = enriched.filter((e) => {
    const matchSearch = !search.trim() || e.course.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "All" ||
      (statusFilter === "Completed" && e.progress === 100) ||
      (statusFilter === "In Progress" && e.progress > 0 && e.progress < 100) ||
      (statusFilter === "Not Started" && e.progress === 0);
    return matchSearch && matchStatus;
  });

  const completedCount = enriched.filter((e) => e.progress === 100).length;
  const inProgressCount = enriched.filter((e) => e.progress > 0 && e.progress < 100).length;
  // Fix #9: after splitting on "h", parseInt only works when the result starts
  // with digits; Number.isFinite guards against malformed durations such as
  // non-numeric prefixes so they don't corrupt the sum.
  const totalTime = enriched.reduce((sum, e) => {
    const hrs = parseInt(e.course.duration.split("h")[0], 10);
    return sum + (Number.isFinite(hrs) ? (hrs * e.progress) / 100 : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
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
              {enriched.length} courses enrolled · {completedCount} completed · {Math.round(totalTime)}h learned
            </p>
          </div>
          <Link href="/courses" className="px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors shadow-md">
            Browse More
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Enrolled", value: enriched.length, color: "text-violet-600" },
            { label: "Completed", value: completedCount, color: "text-green-600" },
            { label: "In Progress", value: inProgressCount, color: "text-amber-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your courses..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div className="flex gap-2">
            {STATUS_FILTERS.map((f) => (
              <button key={f} onClick={() => setStatusFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  statusFilter === f ? "bg-violet-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Course list */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => {
              const isComplete = item.progress === 100;
              return (
                <div key={item.courseId} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row gap-5 hover:shadow-md transition-shadow">
                  {/* Thumbnail */}
                  <div className="w-full sm:w-32 h-24 sm:h-20 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-200 flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-violet-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{item.course.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">by {item.course.instructor.name}</p>
                      </div>
                      {isComplete && (
                        <span className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Completed
                        </span>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">
                          {isComplete ? "Course completed!" : `Last: ${item.lastLesson}`}
                        </span>
                        <span className={`font-semibold ${isComplete ? "text-green-600" : "text-violet-600"}`}>
                          {item.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${isComplete ? "bg-green-500" : "bg-gradient-to-r from-violet-500 to-indigo-500"}`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>{item.course.duration}</span>
                        <span>·</span>
                        <span>{item.course.totalLessons} lessons</span>
                        <span>·</span>
                        <span>Enrolled {item.enrolledAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2 items-center sm:items-end justify-between sm:justify-center flex-shrink-0">
                    <Link
                      href={`/dashboard/courses/${item.courseId}/learn`}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isComplete
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-violet-600 text-white hover:bg-violet-700"
                      }`}
                    >
                      {isComplete ? "Review" : item.progress === 0 ? "Start" : "Continue"}
                    </Link>
                    {isComplete && (
                      <Link href="/dashboard/certificates" className="text-xs text-amber-600 hover:underline font-medium">
                        View cert →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Discover more */}
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
