"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc/client";
import { CATEGORIES } from "@/lib/data/courses";
import { MeshGradient } from "@/components/home/MeshGradient";
import { RevealOnScroll } from "@/components/home/RevealOnScroll";
import { illustrationFor } from "@/components/home/CourseIllustrations";

const LEVELS = ["All Levels", "BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];
const PRICE_FILTERS = ["All", "Free", "Paid"];
const DELIVERY_FILTERS = ["All", "Pre-Recorded", "Live / Hybrid"];
const SORT_OPTIONS = [
  { label: "Popular", value: "popular" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_low" },
  { label: "Rating", value: "rating" },
] as const;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"} fill-current`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
      <div className="aspect-[16/9] bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  );
}

function FilterGroup({ title, options, current, onPick }: { title: string; options: { id: string; label: string }[]; current: string; onPick: (id: string) => void }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{title}</h3>
      <div className="space-y-1">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onPick(o.id)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${current === o.id ? "bg-violet-100 text-violet-700 font-semibold" : "text-gray-600 hover:bg-gray-100"}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [priceFilter, setPriceFilter] = useState("All");
  const [delivery, setDelivery] = useState("All");
  const [sort, setSort] = useState<"popular" | "newest" | "rating" | "price_low" | "price_high">("popular");
  const [page, setPage] = useState(1);

  const isFree = priceFilter === "Free" ? true : priceFilter === "Paid" ? false : undefined;
  const deliveryMode = delivery === "Pre-Recorded" ? ("PRE_RECORDED" as const) : undefined;

  const { data, isLoading, isError } = useQuery(trpc.course.getAll.queryOptions({
    page,
    limit: 12,
    category: category || undefined,
    level: level && level !== "All Levels" ? (level as "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT") : undefined,
    isFree,
    sortBy: sort,
    search: search.trim() || undefined,
    deliveryMode,
  }));

  const courses = data?.courses ?? [];
  const hasActiveFilters = !!(search || category || level || priceFilter !== "All" || delivery !== "All");

  const clearFilters = () => {
    setSearch(""); setCategory(""); setLevel(""); setPriceFilter("All"); setDelivery("All"); setSort("popular"); setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Animated header ── */}
      <section className="relative overflow-hidden pt-16 pb-12 border-b border-gray-100">
        <MeshGradient />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <span className="text-xs font-bold tracking-widest uppercase text-violet-600">Course catalog</span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 mt-2">
              Master AI, <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">course by course</span>
            </h1>
            <p className="mt-3 text-lg text-gray-600 max-w-2xl">
              12+ courses from India&apos;s best AI educators — from ChatGPT basics to production RAG systems.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search courses, topics, instructors..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 space-y-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <FilterGroup title="Category" current={category || "all"} onPick={(id) => { setCategory(id === "all" ? "" : id); setPage(1); }} options={CATEGORIES} />
              <FilterGroup title="Level" current={level || "All Levels"} onPick={(id) => { setLevel(id === "All Levels" ? "" : id); setPage(1); }} options={LEVELS.map((l) => ({ id: l, label: l === "All Levels" ? l : l.charAt(0) + l.slice(1).toLowerCase() }))} />
              <FilterGroup title="Price" current={priceFilter} onPick={(id) => { setPriceFilter(id); setPage(1); }} options={PRICE_FILTERS.map((p) => ({ id: p, label: p }))} />
              <FilterGroup title="Format" current={delivery} onPick={(id) => { setDelivery(id); setPage(1); }} options={DELIVERY_FILTERS.map((d) => ({ id: d, label: d }))} />
              {hasActiveFilters && (
                <button onClick={clearFilters} className="w-full text-center px-3 py-2 rounded-lg text-sm font-medium text-violet-600 hover:bg-violet-50 transition-colors">
                  Clear all filters
                </button>
              )}
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-900">{data?.total ?? 0}</span> courses
              </p>
            </div>

            {isError && <div className="text-center py-20 text-red-500">Failed to load courses. Please try again.</div>}

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 12 }).map((_, i) => <CourseCardSkeleton key={i} />)}
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">No courses found</h3>
                <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters</p>
                <button onClick={clearFilters} className="mt-4 text-violet-600 text-sm font-medium hover:underline">Clear all filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {courses.map((course, i) => {
                    const discount = (course.originalPrice ?? 0) > (course.price ?? 0)
                      ? Math.round((1 - (course.price ?? 0) / (course.originalPrice ?? 1)) * 100)
                      : 0;
                    return (
                      <RevealOnScroll key={course.id} delay={(i % 3) * 60}>
                        <Link href={`/courses/${course.slug}`} className="block group h-full">
                          <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-violet-200 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                            {/* Bespoke illustration thumbnail */}
                            <div className="relative aspect-[16/9] overflow-hidden">
                              {illustrationFor(course.category?.slug)}
                              {course.isFree && (
                                <div className="absolute top-3 right-3 z-10">
                                  <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow">FREE</span>
                                </div>
                              )}
                              {/* Play overlay on hover */}
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-lg scale-90 group-hover:scale-100 transition-transform">
                                  <svg className="w-5 h-5 text-violet-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                </div>
                              </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-0.5 rounded">{course.level}</span>
                                {course.category && <span className="text-xs text-gray-400">{course.category.name}</span>}
                              </div>
                              <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-violet-600 transition-colors flex-1">{course.title}</h3>
                              <p className="text-xs text-gray-500 mt-1">{course.instructor.displayName}</p>
                              <div className="mt-2 flex items-center gap-1.5">
                                <StarRating rating={course.averageRating} />
                                <span className="text-xs font-medium text-gray-700">{course.averageRating.toFixed(1)}</span>
                                <span className="text-xs text-gray-400">({course.totalStudents.toLocaleString("en-IN")})</span>
                              </div>
                              <div className="mt-3 flex items-center gap-2">
                                {course.isFree ? (
                                  <span className="text-base font-bold text-green-600">Free</span>
                                ) : (
                                  <>
                                    <span className="text-base font-bold text-gray-900">₹{(course.price ?? 0).toLocaleString("en-IN")}</span>
                                    {discount > 0 && (
                                      <>
                                        <span className="text-xs text-gray-400 line-through">₹{(course.originalPrice ?? 0).toLocaleString("en-IN")}</span>
                                        <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{discount}% off</span>
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </article>
                        </Link>
                      </RevealOnScroll>
                    );
                  })}
                </div>

                {(data?.pages ?? 1) > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors">Previous</button>
                    <span className="text-sm text-gray-500">Page {page} of {data?.pages}</span>
                    <button onClick={() => setPage((p) => Math.min(data?.pages ?? 1, p + 1))} disabled={page === (data?.pages ?? 1)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors">Next</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
