"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export default function CoursePlayerPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const { data: progressData, isLoading: progressLoading } = useQuery(
    trpc.enrollment.getProgress.queryOptions({ courseId })
  );

  const { data: lessonData, isLoading: lessonLoading } = useQuery({
    ...trpc.lesson.getContent.queryOptions({ lessonId: activeLessonId ?? "", courseId }),
    enabled: !!activeLessonId,
  });

  const markComplete = useMutation(trpc.enrollment.markComplete.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.enrollment.getProgress.queryOptions({ courseId }));
    },
  }));

  if (progressLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Not Enrolled</h2>
          <p className="text-gray-500 mb-4">You are not enrolled in this course.</p>
          <Link href={`/courses`} className="px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors">
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  const { enrollment, modules } = progressData;
  const overallProgress = enrollment.progress;

  const allLessons = modules.flatMap(m => m.lessons);
  const currentIdx = activeLessonId ? allLessons.findIndex(l => l.id === activeLessonId) : -1;
  const nextLesson = currentIdx >= 0 && currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  const getLessonIcon = (type: string) => {
    if (type === "VIDEO") return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
    );
    if (type === "QUIZ") return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    );
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <header className="h-14 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Dashboard
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-sm text-gray-300 truncate max-w-xs">Course Player</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <div className="w-32 bg-gray-700 rounded-full h-1.5">
              <div className="bg-violet-500 h-1.5 rounded-full" style={{ width: `${overallProgress}%` }} />
            </div>
            <span className="text-gray-400 text-xs">{overallProgress}%</span>
          </div>
          {nextLesson && (
            <button onClick={() => setActiveLessonId(nextLesson.id)}
              className="px-3 py-1.5 bg-violet-600 text-white text-xs font-semibold rounded-lg hover:bg-violet-700 transition-colors">
              Next →
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className={cn(
          "flex-shrink-0 bg-gray-950 border-r border-gray-800 overflow-y-auto transition-all duration-200",
          sidebarOpen ? "w-72" : "w-0 overflow-hidden"
        )}>
          <div className="p-4">
            <div className="mb-4">
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Course Progress</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-800 rounded-full h-2">
                  <div className="bg-violet-500 h-2 rounded-full transition-all" style={{ width: `${overallProgress}%` }} />
                </div>
                <span className="text-xs text-gray-400">{overallProgress}%</span>
              </div>
            </div>

            {modules.map((mod) => {
              const isExpanded = expandedModules.has(mod.id);
              const completedCount = mod.lessons.filter(l => l.progress.some(p => p.isCompleted)).length;
              return (
                <div key={mod.id} className="mb-2">
                  <button onClick={() => toggleModule(mod.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-900 transition-colors text-left">
                    <div>
                      <div className="text-sm font-medium text-gray-200">{mod.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{completedCount}/{mod.lessons.length} complete</div>
                    </div>
                    <svg className={cn("w-4 h-4 text-gray-500 transition-transform flex-shrink-0", isExpanded && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isExpanded && (
                    <div className="ml-3 space-y-0.5">
                      {mod.lessons.map((lesson) => {
                        const isCompleted = lesson.progress.some(p => p.isCompleted);
                        const isActive = lesson.id === activeLessonId;
                        return (
                          <button key={lesson.id} onClick={() => setActiveLessonId(lesson.id)}
                            className={cn(
                              "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors text-sm",
                              isActive ? "bg-violet-600 text-white" : "text-gray-400 hover:bg-gray-900 hover:text-gray-200"
                            )}>
                            <span className={cn("flex-shrink-0", isActive ? "text-white" : isCompleted ? "text-green-400" : "text-gray-500")}>
                              {isCompleted ? (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                              ) : getLessonIcon(lesson.type)}
                            </span>
                            <span className="truncate">{lesson.title}</span>
                            {lesson.duration && <span className="ml-auto text-xs opacity-60 flex-shrink-0">{lesson.duration}m</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 overflow-y-auto bg-gray-900">
          {!activeLessonId ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-violet-900 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Select a Lesson</h2>
              <p className="text-gray-400">Choose a lesson from the sidebar to start learning</p>
              {modules[0]?.lessons[0] && (
                <button onClick={() => { setExpandedModules(new Set([modules[0]!.id])); setActiveLessonId(modules[0]!.lessons[0]!.id); }}
                  className="mt-6 px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors">
                  Start First Lesson
                </button>
              )}
            </div>
          ) : lessonLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : lessonData ? (
            <div className="max-w-4xl mx-auto p-6">
              <h1 className="text-2xl font-bold text-white mb-4">{lessonData.title}</h1>

              {lessonData.type === "VIDEO" && (
                <div className="mb-6">
                  {/* Video placeholder */}
                  <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl flex items-center justify-center overflow-hidden mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-violet-600/90 flex items-center justify-center shadow-2xl cursor-pointer hover:bg-violet-500 transition-colors">
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                      <div className="flex-1 h-1 bg-gray-600 rounded-full">
                        <div className="w-0 h-1 bg-violet-400 rounded-full" />
                      </div>
                      <span className="text-xs text-gray-400">{lessonData.duration ?? 0}:00</span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="text-xs text-gray-400 bg-black/50 px-2 py-1 rounded">📹 Video Lesson</span>
                    </div>
                  </div>
                  {lessonData.description && <p className="text-gray-300 text-sm leading-relaxed">{lessonData.description}</p>}
                </div>
              )}

              {lessonData.type === "ARTICLE" && lessonData.content && (
                <div className="mb-6 bg-white/5 rounded-2xl p-6 prose prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{lessonData.content}</ReactMarkdown>
                </div>
              )}

              {lessonData.type === "QUIZ" && lessonData.quiz && (
                <div className="mb-6 bg-gray-800 rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 bg-violet-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{lessonData.quiz.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{lessonData.quiz.questions.length} questions · Passing score: {lessonData.quiz.passingScore}%</p>
                  <Link href={`/dashboard/courses/${courseId}/quiz/${lessonData.quiz.id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors">
                    Take Quiz →
                  </Link>
                </div>
              )}

              {lessonData.type !== "QUIZ" && (
                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={() => markComplete.mutate({ lessonId: lessonData.id })}
                    disabled={markComplete.isPending}
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50">
                    {markComplete.isPending ? "Marking..." : "✓ Mark as Complete"}
                  </button>
                  {nextLesson && (
                    <button onClick={() => setActiveLessonId(nextLesson.id)}
                      className="px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors">
                      Next Lesson →
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
