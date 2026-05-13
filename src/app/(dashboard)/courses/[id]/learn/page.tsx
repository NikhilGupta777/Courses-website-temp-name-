"use client";

import Link from "next/link";
import { useState } from "react";
import { COURSES } from "@/lib/data/courses";

const SPEEDS = ["0.5x", "0.75x", "1x", "1.25x", "1.5x", "2x"];

export default function CourseLearnPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const course = COURSES.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 px-6 text-white">
        <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-950 p-8 text-center shadow-xl">
          <h1 className="text-2xl font-semibold">Course not found</h1>
          <p className="mt-3 text-sm text-gray-400">
            The course you are trying to access does not exist or is no longer available.
          </p>
          <Link
            href="/courses"
            className="mt-6 inline-flex items-center rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
          >
            Back to courses
          </Link>
        </div>
      </div>
    );
  }

  const allLessons = course.modules.flatMap((m, mi) =>
    m.lessons.map((l, li) => ({ ...l, moduleIndex: mi, lessonIndex: li, moduleTitle: m.title }))
  );

  const [activeLesson, setActiveLesson] = useState(0);
  const [tab, setTab] = useState<"overview" | "notes" | "resources" | "discussions">("overview");
  const [speed, setSpeed] = useState("1x");
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(35);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notes, setNotes] = useState("");
  const [completed, setCompleted] = useState<Set<string>>(new Set(["l-1", "l-2"]));

  const currentLesson = allLessons[activeLesson];
  const nextLesson = allLessons[activeLesson + 1];
  const prevLesson = allLessons[activeLesson - 1];
  const moduleProgress = Math.round((completed.size / allLessons.length) * 100);

  const toggleComplete = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden pt-0">
      {/* Lesson sidebar */}
      <aside className={`flex-shrink-0 bg-gray-950 border-r border-gray-800 flex flex-col transition-all duration-200 ${sidebarOpen ? "w-72" : "w-0 overflow-hidden"}`}>
        {/* Course header */}
        <div className="p-4 border-b border-gray-800">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white text-xs mb-3 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard
          </Link>
          <h2 className="text-sm font-semibold text-white line-clamp-2 leading-snug">{course.title}</h2>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
              <span>Course progress</span>
              <span className="text-violet-400 font-medium">{moduleProgress}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5">
              <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-1.5 rounded-full transition-all" style={{ width: `${moduleProgress}%` }} />
            </div>
          </div>
        </div>

        {/* Module / lesson tree */}
        <div className="flex-1 overflow-y-auto">
          {course.modules.map((mod, mi) => (
            <details key={mod.id} open className="group">
              <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer bg-gray-900/50 hover:bg-gray-900 border-b border-gray-800/50 list-none">
                <svg className="w-3.5 h-3.5 text-gray-500 group-open:rotate-90 transition-transform flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-semibold text-gray-300 flex-1">{mod.title}</span>
                <span className="text-xs text-gray-500">{mod.lessons.filter((l) => completed.has(l.id)).length}/{mod.lessons.length}</span>
              </summary>
              {mod.lessons.map((lesson, li) => {
                const globalIdx = allLessons.findIndex((al) => al.id === lesson.id);
                const isActive = globalIdx === activeLesson;
                const isDone = completed.has(lesson.id);
                const isLocked = !lesson.isFree && !course.isFree;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => !isLocked && setActiveLesson(globalIdx)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors border-b border-gray-800/30 ${
                      isActive ? "bg-violet-900/40 border-l-2 border-l-violet-500" : "hover:bg-gray-800/50"
                    } ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border ${
                      isDone ? "bg-green-500 border-green-500" : isActive ? "border-violet-500 bg-violet-900/50" : "border-gray-600 bg-transparent"
                    }`}>
                      {isDone ? (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : isLocked ? (
                        <svg className="w-2.5 h-2.5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-violet-400" : "bg-gray-600"}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs line-clamp-1 ${isActive ? "text-violet-300 font-medium" : "text-gray-400"}`}>
                        {lesson.title}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[10px] text-gray-600">{lesson.type === "VIDEO" ? "▶" : lesson.type === "QUIZ" ? "✓" : "✎"}</span>
                        <span className="text-[10px] text-gray-600">{lesson.duration}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </details>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Video area */}
        <div className="flex-shrink-0 bg-black">
          {/* Toggle sidebar button */}
          <div className="absolute top-20 left-0 z-10">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors rounded-r-lg"
            >
              <svg className={`w-4 h-4 transition-transform ${sidebarOpen ? "" : "rotate-180"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Video placeholder */}
          <div className="relative w-full aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center max-h-[60vh]">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-white/20 transition-colors">
                <svg className="w-9 h-9 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">{currentLesson?.title}</p>
              <p className="text-gray-600 text-xs mt-1">{currentLesson?.moduleTitle}</p>
            </div>
          </div>

          {/* Controls bar */}
          <div className="bg-gray-900 px-4 py-3 flex items-center gap-4 border-t border-gray-800">
            {/* Play/Pause */}
            <button className="p-1.5 rounded-lg hover:bg-gray-800 text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>

            {/* Progress scrubber */}
            <div className="flex-1 flex items-center gap-2">
              <span className="text-xs text-gray-400 w-10 text-right">{Math.floor((progress / 100) * 24)}:00</span>
              <input
                type="range" min={0} max={100} value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="flex-1 h-1.5 accent-violet-500 cursor-pointer"
              />
              <span className="text-xs text-gray-400 w-10">24:00</span>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-3.536-9.536a5 5 0 000 7.072" />
              </svg>
              <input
                type="range" min={0} max={100} value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-16 h-1 accent-violet-500 cursor-pointer"
              />
            </div>

            {/* Speed */}
            <select
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded border border-gray-700 cursor-pointer focus:outline-none"
            >
              {SPEEDS.map((s) => <option key={s}>{s}</option>)}
            </select>

            {/* CC */}
            <button className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded border border-gray-700 hover:border-gray-500 transition-colors">CC</button>

            {/* Fullscreen */}
            <button className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Below video: lesson info + tabs */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
            {/* Lesson title & complete button */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="text-xs text-violet-600 font-medium mb-1">{currentLesson?.moduleTitle}</div>
                <h2 className="text-xl font-bold text-gray-900">{currentLesson?.title}</h2>
              </div>
              <button
                onClick={() => currentLesson && toggleComplete(currentLesson.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  currentLesson && completed.has(currentLesson.id)
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-violet-600 text-white hover:bg-violet-700"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {currentLesson && completed.has(currentLesson.id) ? "Completed" : "Mark Complete"}
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-gray-200 mb-6">
              {(["overview", "notes", "resources", "discussions"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                    tab === t ? "border-violet-600 text-violet-600" : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {tab === "overview" && (
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed text-sm">
                  In this lesson, you will learn everything you need to know about <strong>{currentLesson?.title}</strong>.
                  This is lesson {activeLesson + 1} of {allLessons.length} in the {course.title} course.
                  Follow along carefully and pause the video whenever you want to try something yourself.
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <button
                    onClick={() => prevLesson && setActiveLesson(activeLesson - 1)}
                    disabled={!prevLesson}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>
                  <button
                    onClick={() => nextLesson && setActiveLesson(activeLesson + 1)}
                    disabled={!nextLesson}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next Lesson
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                {nextLesson && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Up next:</span> {nextLesson.title}
                  </div>
                )}
              </div>
            )}

            {tab === "notes" && (
              <div>
                <p className="text-sm text-gray-500 mb-3">Your notes are saved automatically and synced across devices.</p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Take notes for this lesson..."
                  className="w-full h-48 p-4 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                <button className="mt-2 px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700 transition-colors">
                  Save Notes
                </button>
              </div>
            )}

            {tab === "resources" && (
              <div className="space-y-3">
                <p className="text-sm text-gray-500">Downloadable resources for this lesson:</p>
                {[
                  { name: "Lesson Slides (PDF)", size: "2.4 MB" },
                  { name: "Exercise Files.zip", size: "1.1 MB" },
                  { name: "Cheat Sheet.pdf", size: "340 KB" },
                ].map((res) => (
                  <div key={res.name} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                        <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{res.name}</div>
                        <div className="text-xs text-gray-400">{res.size}</div>
                      </div>
                    </div>
                    <button className="p-1.5 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {tab === "discussions" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">Discuss this lesson with fellow students.</p>
                <div className="border border-gray-200 rounded-xl p-4">
                  <textarea placeholder="Ask a question or share your thoughts..." className="w-full text-sm text-gray-700 resize-none focus:outline-none" rows={3} />
                  <div className="flex justify-end mt-2">
                    <button className="px-4 py-2 bg-violet-600 text-white text-xs font-semibold rounded-lg hover:bg-violet-700 transition-colors">Post Comment</button>
                  </div>
                </div>
                <div className="text-center py-8 text-gray-400 text-sm">No comments yet. Be the first to start a discussion!</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
