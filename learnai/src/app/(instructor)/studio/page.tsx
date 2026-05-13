"use client";

import Link from "next/link";
import { useState } from "react";
import { COURSES } from "@/lib/data/courses";

const instructorCourses = COURSES.filter((c) => c.instructor.name === "Rahul Mehta");

const statusColor: Record<string, string> = {
  PUBLISHED: "bg-green-100 text-green-700",
  DRAFT: "bg-yellow-100 text-yellow-700",
  UNDER_REVIEW: "bg-blue-100 text-blue-700",
  ARCHIVED: "bg-gray-100 text-gray-500",
};

export default function StudioPage() {
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Instructor Studio</h1>
            <p className="text-gray-500 mt-1">Manage your courses, view analytics, and track earnings</p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 shadow-md transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Course
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Students", value: "14,200", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "bg-violet-50 text-violet-600" },
            { label: "Total Revenue", value: "₹2,84,000", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "bg-green-50 text-green-600" },
            { label: "Avg Rating", value: "4.9 ★", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z", color: "bg-yellow-50 text-yellow-600" },
            { label: "Published Courses", value: instructorCourses.length.toString(), icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", color: "bg-indigo-50 text-indigo-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon} />
                </svg>
              </div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Course list */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">My Courses</h2>
            <Link href="/analytics" className="text-sm text-violet-600 font-medium hover:underline">View Analytics →</Link>
          </div>

          <div className="divide-y divide-gray-50">
            {instructorCourses.map((course) => (
              <div key={course.id} className="px-6 py-4 flex items-center gap-5 hover:bg-gray-50/50 transition-colors">
                {/* Thumbnail */}
                <div className="w-16 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-amber-200 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-orange-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{course.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>{course.totalLessons} lessons</span>
                    <span>·</span>
                    <span>{course.totalStudents.toLocaleString("en-IN")} students</span>
                    <span>·</span>
                    <span>★ {course.rating}</span>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-4 text-sm">
                  <div className="text-right">
                    <div className="font-bold text-gray-900">₹{(course.price * course.totalStudents * 0.7).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</div>
                    <div className="text-xs text-gray-400">Est. earnings</div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor["PUBLISHED"]}`}>Published</span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/studio/courses/${course.id}/edit`}
                    className="p-2 rounded-lg hover:bg-violet-50 text-gray-400 hover:text-violet-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </Link>
                  <Link href={`/courses/${course.slug}`}
                    className="p-2 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New course tips */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: "M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z", title: "Upload Videos", desc: "Upload HD videos up to 4K. We handle transcoding and adaptive streaming automatically.", color: "bg-violet-50 text-violet-600" },
            { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", title: "Add Quizzes", desc: "Create MCQ, true/false, and timed tests for each module to boost completion rates.", color: "bg-green-50 text-green-600" },
            { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "Earn Revenue", desc: "Earn 70% of every course sale. Payouts processed monthly directly to your bank account.", color: "bg-amber-50 text-amber-600" },
          ].map((tip) => (
            <div key={tip.title} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${tip.color}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tip.icon} /></svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{tip.title}</h3>
              <p className="text-sm text-gray-500">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* New Course Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4" onClick={() => setShowNewModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 mb-5">Create a New Course</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Course Title *</label>
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Advanced Gemini AI Masterclass"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                    <option>ChatGPT & GPT-4</option>
                    <option>Gemini AI</option>
                    <option>AI Chatbots</option>
                    <option>Image Generation</option>
                    <option>Prompting</option>
                    <option>AI Tools</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Level</label>
                  <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>Expert</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹)</label>
                <input type="number" placeholder="1999"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all">
                Create Draft
              </button>
              <button onClick={() => setShowNewModal(false)} className="px-5 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
