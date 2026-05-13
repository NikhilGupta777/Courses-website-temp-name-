"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { COURSES, CATEGORIES, CATEGORY_COLORS, type Course } from "@/lib/data/courses";

const LEVELS = ["All Levels", "Beginner", "Intermediate", "Advanced"];
const PRICE_FILTERS = ["All", "Free", "Paid"];
const DELIVERY_FILTERS = ["All", "Pre-Recorded", "Live / Hybrid"];
const SORT_OPTIONS = ["Popular", "Newest", "Price: Low to High", "Rating"];

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const s = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={`${s} ${i <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"} fill-current`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  const colors = CATEGORY_COLORS[course.category] ?? { from: "from-violet-100", to: "to-indigo-200", icon: "text-violet-600" };
  const discount = course.originalPrice > course.price && course.originalPrice > 0
    ? Math.round((1 - course.price / course.originalPrice) * 100)
    : 0;
  return (
    <Link href={`/courses/${course.slug}`}>
      <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-violet-200 transition-all duration-300 group h-full flex flex-col">
        <div className={`relative h-44 bg-gradient-to-br ${colors.from} ${colors.to}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow group-hover:scale-110 transition-transform">
              <svg className={`w-5 h-5 ${colors.icon} ml-0.5`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <div className="absolute top-3 left-3 flex gap-1.5">
            {course.isFree && (
              <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">FREE</span>
            )}
            {course.badge && !course.isFree && (
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                course.badge === "Bestseller" ? "bg-orange-100 text-orange-700" :
                course.badge === "Hot" ? "bg-red-100 text-red-700" :
                course.badge === "New" ? "bg-blue-100 text-blue-700" :
                "bg-green-100 text-green-700"
              }`}>{course.badge}</span>
            )}
          </div>
          {course.deliveryMode === "HYBRID" && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-600 text-white">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />LIVE
              </span>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded">{course.level}</span>
            <span className="text-xs text-gray-400">{course.duration}</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-violet-600 transition-colors flex-1">{course.title}</h3>
          <p className="text-xs text-gray-500 mt-1">{course.instructor.name}</p>
          <div className="mt-2 flex items-center gap-1.5">
            <StarRating rating={course.rating} />
            <span className="text-xs font-medium text-gray-700">{course.rating}</span>
            <span className="text-xs text-gray-400">({course.totalStudents.toLocaleString()})</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            {course.isFree ? (
              <span className="text-base font-bold text-green-600">Free</span>
            ) : (
              <>
                <span className="text-base font-bold text-gray-900">₹{course.price.toLocaleString("en-IN")}</span>
                {discount > 0 && (
                  <>
                    <span className="text-xs text-gray-400 line-through">₹{course.originalPrice.toLocaleString("en-IN")}</span>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{discount}% off</span>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("All Levels");
  const [priceFilter, setPriceFilter] = useState("All");
  const [delivery, setDelivery] = useState("All");
  const [sort, setSort] = useState("Popular");

  const filtered = useMemo(() => {
    let list = [...COURSES];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) => c.title.toLowerCase().includes(q) || c.instructor.name.toLowerCase().includes(q) || c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (category !== "all") list = list.filter((c) => c.category === category);
    if (level !== "All Levels") list = list.filter((c) => c.level === level);
    if (priceFilter === "Free") list = list.filter((c) => c.isFree);
    if (priceFilter === "Paid") list = list.filter((c) => !c.isFree);
    if (delivery === "Pre-Recorded") list = list.filter((c) => c.deliveryMode === "PRE_RECORDED");
    if (delivery === "Live / Hybrid") list = list.filter((c) => c.deliveryMode !== "PRE_RECORDED");

    if (sort === "Newest") list.sort((a, b) => b.id.localeCompare(a.id));
    else if (sort === "Price: Low to High") list.sort((a, b) => a.price - b.price);
    else if (sort === "Rating") list.sort((a, b) => b.rating - a.rating);
    else list.sort((a, b) => b.totalStudents - a.totalStudents); // Popular

    return list;
  }, [search, category, level, priceFilter, delivery, sort]);

  const freeCourses = filtered.filter((c) => c.isFree);
  const paidCourses = filtered.filter((c) => !c.isFree);
  const showFreeBanner = category === "all" && priceFilter === "All" && !search.trim();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">AI Courses</h1>
          <p className="text-gray-500">Master AI with India&apos;s best courses — from ChatGPT to Stable Diffusion</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search courses, topics, instructors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
          >
            {SORT_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className="hidden lg:block w-56 flex-shrink-0 space-y-6">
            {/* Category */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Category</h3>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${category === cat.id ? "bg-violet-100 text-violet-700 font-semibold" : "text-gray-600 hover:bg-gray-100"}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Level */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Level</h3>
              <div className="space-y-1">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${level === l ? "bg-violet-100 text-violet-700 font-semibold" : "text-gray-600 hover:bg-gray-100"}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Price</h3>
              <div className="space-y-1">
                {PRICE_FILTERS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriceFilter(p)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${priceFilter === p ? "bg-violet-100 text-violet-700 font-semibold" : "text-gray-600 hover:bg-gray-100"}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Format</h3>
              <div className="space-y-1">
                {DELIVERY_FILTERS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDelivery(d)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${delivery === d ? "bg-violet-100 text-violet-700 font-semibold" : "text-gray-600 hover:bg-gray-100"}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-900">{filtered.length}</span> course{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">No courses found</h3>
                <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters</p>
                <button onClick={() => { setSearch(""); setCategory("all"); setLevel("All Levels"); setPriceFilter("All"); setDelivery("All"); }} className="mt-4 text-violet-600 text-sm font-medium hover:underline">
                  Clear all filters
                </button>
              </div>
            )}

            {/* Free section banner */}
            {showFreeBanner && freeCourses.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px flex-1 bg-gray-200" />
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                    🎓 Free Courses — Start Here
                  </div>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {freeCourses.map((c) => <CourseCard key={c.id} course={c} />)}
                </div>
              </div>
            )}

            {/* Paid courses grid */}
            {(showFreeBanner ? paidCourses : filtered).length > 0 && (
              <>
                {showFreeBanner && paidCourses.length > 0 && (
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-sm font-semibold text-gray-500 px-3">Premium Courses</span>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {(showFreeBanner ? paidCourses : filtered).map((c) => <CourseCard key={c.id} course={c} />)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
