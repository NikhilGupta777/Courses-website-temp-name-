"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc/client";

const statusColor: Record<string, string> = {
  PUBLISHED: "bg-green-100 text-green-700",
  DRAFT: "bg-yellow-100 text-yellow-700",
  UNDER_REVIEW: "bg-blue-100 text-blue-700",
  ARCHIVED: "bg-gray-100 text-gray-500",
};

export default function StudioPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newLevel, setNewLevel] = useState("BEGINNER");
  const [newPrice, setNewPrice] = useState("");
  const [newIsFree, setNewIsFree] = useState(false);

  const { data: courses, isLoading: coursesLoading } = useQuery(trpc.instructor.getCourses.queryOptions());
  const { data: profile } = useQuery(trpc.instructor.getProfile.queryOptions());
  const { data: analytics } = useQuery(trpc.instructor.getAnalytics.queryOptions());
  const { data: categories } = useQuery(trpc.course.getCategories.queryOptions());

  const createCourse = useMutation(trpc.course.create.mutationOptions({
    onSuccess: (course) => {
      queryClient.invalidateQueries(trpc.instructor.getCourses.queryOptions());
      setShowNewModal(false);
      setNewTitle("");
      router.push(`/studio/courses/${course.id}`);
    },
  }));

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    createCourse.mutate({
      title: newTitle.trim(),
      description: "Course description to be updated.",
      level: newLevel as "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT",
      deliveryMode: "PRE_RECORDED",
      isFree: newIsFree,
      price: newIsFree ? 0 : (parseFloat(newPrice) || undefined),
      categoryId: newCategory || undefined,
    });
  };

  const statsCards = [
    { label: "Total Students", value: analytics?.totalStudents?.toLocaleString("en-IN") ?? profile?.totalStudents?.toLocaleString("en-IN") ?? "0", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "bg-violet-50 text-violet-600" },
    { label: "Est. Revenue", value: analytics?.totalRevenue ? `₹${analytics.totalRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}` : "₹0", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "bg-green-50 text-green-600" },
    { label: "Avg Rating", value: `${(profile?.averageRating ?? 0).toFixed(1)} ★`, icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z", color: "bg-yellow-50 text-yellow-600" },
    { label: "Published Courses", value: (courses ?? []).filter(c => c.status === "PUBLISHED").length.toString(), icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", color: "bg-indigo-50 text-indigo-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Instructor Studio</h1>
            <p className="text-gray-500 mt-1">Welcome back, {profile?.displayName ?? session?.user?.name ?? "Instructor"}</p>
          </div>
          <button onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 shadow-md transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Course
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statsCards.map((s) => (
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

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">My Courses</h2>
            <Link href="/analytics" className="text-sm text-violet-600 font-medium hover:underline">View Analytics →</Link>
          </div>

          {coursesLoading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading courses...</div>
          ) : (courses ?? []).length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400 text-sm mb-4">You have not created any courses yet.</p>
              <button onClick={() => setShowNewModal(true)} className="px-5 py-2.5 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors text-sm">
                Create Your First Course
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {(courses ?? []).map((course) => {
                const lessonCount = course.modules.reduce((sum, m) => sum + m._count.lessons, 0);
                return (
                  <div key={course.id} className="px-6 py-4 flex items-center gap-5 hover:bg-gray-50/50 transition-colors">
                    <div className="w-16 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-amber-200 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-orange-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{course.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>{lessonCount} lessons</span>
                        <span>·</span>
                        <span>{course._count.enrollments.toLocaleString("en-IN")} students</span>
                        {course.averageRating > 0 && <><span>·</span><span>★ {course.averageRating.toFixed(1)}</span></>}
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[course.status] ?? "bg-gray-100 text-gray-500"}`}>
                        {course.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link href={`/studio/courses/${course.id}`}
                        className="p-2 rounded-lg hover:bg-violet-50 text-gray-400 hover:text-violet-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </Link>
                      <Link href={`/courses/${course.slug}`} target="_blank"
                        className="p-2 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

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
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                    <option value="">Select category</option>
                    {(categories ?? []).map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Level</label>
                  <select value={newLevel} onChange={(e) => setNewLevel(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                    <option value="EXPERT">Expert</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                <input type="checkbox" id="isFree" checked={newIsFree} onChange={(e) => setNewIsFree(e.target.checked)}
                  className="rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                <label htmlFor="isFree" className="text-sm font-medium text-gray-700">Make this a free course</label>
              </div>
              {!newIsFree && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹)</label>
                  <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="1999"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleCreate} disabled={!newTitle.trim() || createCourse.isPending}
                className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all disabled:opacity-50">
                {createCourse.isPending ? "Creating..." : "Create Draft"}
              </button>
              <button onClick={() => setShowNewModal(false)} className="px-5 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
            {createCourse.isError && (
              <p className="mt-3 text-sm text-red-500 text-center">Failed to create course. Please try again.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
