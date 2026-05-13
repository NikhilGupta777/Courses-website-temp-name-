"use client";

import { useState } from "react";
import Link from "next/link";
import { COURSES } from "@/lib/data/courses";

const statusOptions = ["All", "PUBLISHED", "UNDER_REVIEW", "DRAFT", "ARCHIVED"];
const statusColors: Record<string, string> = {
  PUBLISHED: "bg-green-100 text-green-700",
  UNDER_REVIEW: "bg-blue-100 text-blue-700",
  DRAFT: "bg-yellow-100 text-yellow-700",
  ARCHIVED: "bg-gray-100 text-gray-500",
};

export default function AdminCoursesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [pendingAction, setPendingAction] = useState<{ id: string; action: "approve" | "reject" } | null>(null);

  const filtered = COURSES.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || statusFilter === "PUBLISHED";
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
            <p className="text-sm text-gray-500">{COURSES.length} total courses</p>
          </div>
        </div>

        {/* Under review banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          </div>
          <div>
            <div className="font-semibold text-blue-900 text-sm">2 courses pending review</div>
            <div className="text-xs text-blue-600">Instructor submissions awaiting your approval before going live</div>
          </div>
          <button className="ml-auto text-sm font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-xl transition-colors">
            Review Queue →
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${statusFilter === s ? "bg-violet-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                {s === "All" ? "All" : s.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Course grid-table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Course", "Instructor", "Category", "Price", "Students", "Rating", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 max-w-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-8 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-200 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-semibold text-gray-900 line-clamp-1">{course.title}</div>
                          <div className="text-xs text-gray-400">{course.totalLessons} lessons · {course.duration}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{course.instructor.name}</td>
                    <td className="px-5 py-4 text-sm text-gray-500 capitalize">{course.category}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                      {course.isFree ? <span className="text-green-600">Free</span> : `₹${course.price.toLocaleString("en-IN")}`}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{course.totalStudents.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-4 text-sm text-yellow-600 font-semibold">★ {course.rating}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors["PUBLISHED"]}`}>Published</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/courses/${course.slug}`} className="text-xs text-violet-600 hover:underline font-medium">View</Link>
                        <button className="text-xs text-gray-500 hover:underline">Edit</button>
                        <button className="text-xs text-red-500 hover:underline">Archive</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>Showing {filtered.length} of {COURSES.length} courses</span>
          </div>
        </div>
      </div>
    </div>
  );
}
