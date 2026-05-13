"use client";

import { useState } from "react";
import Link from "next/link";

// Mock courses for initial scaffold
const mockCourses = [
  { id: "1", title: "Complete Machine Learning Bootcamp", slug: "ml-bootcamp", instructor: "Dr. Sarah Chen", level: "Beginner", duration: "42h", price: 79, rating: 4.9, students: 12500, mode: "PRE_RECORDED", category: "Machine Learning" },
  { id: "2", title: "Deep Learning with PyTorch", slug: "deep-learning-pytorch", instructor: "Prof. James Wilson", level: "Intermediate", duration: "38h", price: 99, rating: 4.8, students: 8300, mode: "PRE_RECORDED", category: "Deep Learning" },
  { id: "3", title: "NLP Masterclass", slug: "nlp-masterclass", instructor: "Dr. Priya Sharma", level: "Advanced", duration: "28h", price: 89, rating: 4.9, students: 6700, mode: "HYBRID", category: "NLP" },
  { id: "4", title: "Computer Vision Pro", slug: "computer-vision-pro", instructor: "Alex Rodriguez", level: "Intermediate", duration: "32h", price: 69, rating: 4.7, students: 5400, mode: "PRE_RECORDED", category: "Computer Vision" },
  { id: "5", title: "AI for Business Leaders", slug: "ai-business", instructor: "Maria Johnson", level: "Beginner", duration: "16h", price: 49, rating: 4.8, students: 9200, mode: "LIVE_ONLINE", category: "AI Strategy" },
  { id: "6", title: "Reinforcement Learning", slug: "reinforcement-learning", instructor: "Dr. Kevin Park", level: "Expert", duration: "45h", price: 119, rating: 4.9, students: 3800, mode: "PRE_RECORDED", category: "Deep Learning" },
  { id: "7", title: "LLM Engineering & Prompt Design", slug: "llm-engineering", instructor: "Sam Taylor", level: "Intermediate", duration: "24h", price: 89, rating: 4.9, students: 15000, mode: "HYBRID", category: "LLMs" },
  { id: "8", title: "MLOps & Production ML", slug: "mlops", instructor: "Chris Martinez", level: "Advanced", duration: "35h", price: 99, rating: 4.7, students: 4200, mode: "PRE_RECORDED", category: "MLOps" },
  { id: "9", title: "Data Science Foundations", slug: "data-science-foundations", instructor: "Lisa Wang", level: "Beginner", duration: "20h", price: 0, rating: 4.6, students: 22000, mode: "PRE_RECORDED", category: "Data Science" },
];

const categories = ["All", "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "LLMs", "MLOps", "Data Science", "AI Strategy"];
const levels = ["All Levels", "Beginner", "Intermediate", "Advanced", "Expert"];
const sortOptions = ["Most Popular", "Newest", "Highest Rated", "Price: Low to High", "Price: High to Low"];

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredCourses = mockCourses.filter((course) => {
    if (selectedCategory !== "All" && course.category !== selectedCategory) return false;
    if (selectedLevel !== "All Levels" && course.level !== selectedLevel) return false;
    if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Page Header */}
      <section className="pt-20 pb-8 bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Explore AI Courses
          </h1>
          <p className="mt-2 text-gray-600">
            {mockCourses.length} courses to help you master artificial intelligence
          </p>

          {/* Search */}
          <div className="mt-6 relative max-w-md">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 sticky top-24">
              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Category</h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                        selectedCategory === cat
                          ? "bg-violet-100 text-violet-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Levels */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Level</h3>
                <div className="space-y-1">
                  {levels.map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                        selectedLevel === level
                          ? "bg-violet-100 text-violet-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Price</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input type="checkbox" className="rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                    Free
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input type="checkbox" className="rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                    Paid
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Course Grid */}
          <div className="flex-1">
            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-gray-500">
                Showing {filteredCourses.length} courses
              </span>
              <div className="flex items-center gap-3">
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500">
                  {sortOptions.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-violet-200 transition-all duration-200 group"
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-gradient-to-br from-violet-100 to-indigo-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                        <svg className="w-4 h-4 text-violet-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <span className="absolute top-2 right-2 text-xs font-medium bg-white/90 text-gray-700 px-2 py-0.5 rounded-full">
                      {course.mode.replace("_", " ")}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-medium text-violet-600">{course.level}</span>
                      <span className="text-xs text-gray-400">|</span>
                      <span className="text-xs text-gray-400">{course.duration}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-violet-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{course.instructor}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs font-medium">{course.rating}</span>
                      </div>
                      <span className="text-xs text-gray-400">({course.students.toLocaleString()})</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      {course.price === 0 ? (
                        <span className="text-sm font-bold text-green-600">Free</span>
                      ) : (
                        <span className="text-sm font-bold text-gray-900">${course.price}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
