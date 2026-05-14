"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc/client";
import { VideoUpload } from "@/components/upload/VideoUpload";
import { ImageUpload } from "@/components/upload/ImageUpload";

type LessonType = "VIDEO" | "ARTICLE" | "QUIZ" | "ASSIGNMENT" | "LIVE_SESSION" | "RESOURCE";

// ─── Grip / drag-handle icon ────────────────────────────────────────────────
function GripIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="5" cy="4" r="1.2" />
      <circle cx="5" cy="8" r="1.2" />
      <circle cx="5" cy="12" r="1.2" />
      <circle cx="11" cy="4" r="1.2" />
      <circle cx="11" cy="8" r="1.2" />
      <circle cx="11" cy="12" r="1.2" />
    </svg>
  );
}

export default function CourseEditorPage() {
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();

  const { data: course, isLoading } = useQuery(trpc.course.getById.queryOptions({ id }));

  const [title, setTitle]               = useState("");
  const [subtitle, setSubtitle]         = useState("");
  const [description, setDescription]   = useState("");
  const [level, setLevel]               = useState("BEGINNER");
  const [price, setPrice]               = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [isFree, setIsFree]             = useState(false);
  const [saved, setSaved]               = useState(false);
  const [activeTab, setActiveTab]       = useState<"info" | "curriculum" | "pricing">("info");

  const [draggedModuleId, setDraggedModuleId]         = useState<string | null>(null);
  const [dragOverModuleId, setDragOverModuleId]       = useState<string | null>(null);
  const [draggedLessonInfo, setDraggedLessonInfo]     = useState<{ moduleId: string; lessonId: string } | null>(null);
  const [dragOverLessonInfo, setDragOverLessonInfo]   = useState<{ moduleId: string; lessonId: string } | null>(null);
  const [expandedUploadLessonId, setExpandedUploadLessonId] = useState<string | null>(null);

  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setSubtitle(course.subtitle ?? "");
      setDescription(course.description);
      setLevel(course.level);
      setPrice(course.price?.toString() ?? "");
      setOriginalPrice(course.originalPrice?.toString() ?? "");
      setIsFree(course.isFree);
    }
  }, [course]);

  const updateCourse = useMutation(trpc.course.update.mutationOptions({
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      queryClient.invalidateQueries(trpc.course.getById.queryOptions({ id }));
    },
  }));

  const createModule = useMutation(trpc.module.create.mutationOptions({
    onSuccess: () => queryClient.invalidateQueries(trpc.course.getById.queryOptions({ id })),
  }));

  const deleteModule = useMutation(trpc.module.delete.mutationOptions({
    onSuccess: () => queryClient.invalidateQueries(trpc.course.getById.queryOptions({ id })),
  }));

  const createLesson = useMutation(trpc.lesson.create.mutationOptions({
    onSuccess: () => queryClient.invalidateQueries(trpc.course.getById.queryOptions({ id })),
  }));

  const deleteLesson = useMutation(trpc.lesson.delete.mutationOptions({
    onSuccess: () => queryClient.invalidateQueries(trpc.course.getById.queryOptions({ id })),
  }));

  const publishCourse = useMutation(trpc.course.publish.mutationOptions({
    onSuccess: () => queryClient.invalidateQueries(trpc.course.getById.queryOptions({ id })),
  }));

  const reorderModules = useMutation(trpc.module.reorder.mutationOptions({
    onSuccess: () => queryClient.invalidateQueries(trpc.course.getById.queryOptions({ id })),
  }));

  const reorderLessons = useMutation(trpc.lesson.reorder.mutationOptions({
    onSuccess: () => queryClient.invalidateQueries(trpc.course.getById.queryOptions({ id })),
  }));

  const handleSave = () => {
    updateCourse.mutate({
      id,
      title,
      subtitle: subtitle || undefined,
      description,
      level: level as "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT",
      price: isFree ? 0 : (parseFloat(price) || undefined),
      originalPrice: parseFloat(originalPrice) || undefined,
      isFree,
    });
  };

  const handleModuleDragStart = (e: React.DragEvent, moduleId: string) => {
    setDraggedModuleId(moduleId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleModuleDragOver = (e: React.DragEvent, moduleId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (moduleId !== draggedModuleId) {
      setDragOverModuleId(moduleId);
    }
  };

  const handleModuleDragEnd = () => {
    if (draggedModuleId && dragOverModuleId && draggedModuleId !== dragOverModuleId) {
      const modules = course?.modules ?? [];
      const ids = modules.map((m) => m.id);
      const fromIdx = ids.indexOf(draggedModuleId);
      const toIdx   = ids.indexOf(dragOverModuleId);
      if (fromIdx !== -1 && toIdx !== -1) {
        const newIds = [...ids];
        newIds.splice(fromIdx, 1);
        newIds.splice(toIdx, 0, draggedModuleId);
        reorderModules.mutate({ courseId: id, orderedIds: newIds });
      }
    }
    setDraggedModuleId(null);
    setDragOverModuleId(null);
  };

  const handleModuleDragLeave = () => {
    setDragOverModuleId(null);
  };

  const handleLessonDragStart = (e: React.DragEvent, moduleId: string, lessonId: string) => {
    e.stopPropagation();
    setDraggedLessonInfo({ moduleId, lessonId });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleLessonDragOver = (e: React.DragEvent, moduleId: string, lessonId: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    if (draggedLessonInfo && draggedLessonInfo.moduleId === moduleId && draggedLessonInfo.lessonId !== lessonId) {
      setDragOverLessonInfo({ moduleId, lessonId });
    }
  };

  const handleLessonDragEnd = (moduleId: string) => {
    if (
      draggedLessonInfo &&
      dragOverLessonInfo &&
      draggedLessonInfo.moduleId === moduleId &&
      dragOverLessonInfo.moduleId === moduleId &&
      draggedLessonInfo.lessonId !== dragOverLessonInfo.lessonId
    ) {
      const mod = (course?.modules ?? []).find((m) => m.id === moduleId);
      if (mod) {
        const ids = mod.lessons.map((l) => l.id);
        const fromIdx = ids.indexOf(draggedLessonInfo.lessonId);
        const toIdx   = ids.indexOf(dragOverLessonInfo.lessonId);
        if (fromIdx !== -1 && toIdx !== -1) {
          const newIds = [...ids];
          newIds.splice(fromIdx, 1);
          newIds.splice(toIdx, 0, draggedLessonInfo.lessonId);
          reorderLessons.mutate({ moduleId, orderedIds: newIds });
        }
      }
    }
    setDraggedLessonInfo(null);
    setDragOverLessonInfo(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <Link href="/studio" className="text-violet-600 hover:underline">Back to Studio</Link>
        </div>
      </div>
    );
  }

  const totalLessons = (course.modules ?? []).reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/studio" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900 line-clamp-1">{title}</h1>
              <p className="text-xs text-gray-500">{totalLessons} lessons · {course.status}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </span>
            )}
            {course.status === "DRAFT" && (
              <button
                onClick={() => publishCourse.mutate({ id })}
                disabled={publishCourse.isPending}
                className="px-3 py-2 text-xs font-semibold text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-50"
              >
                {publishCourse.isPending ? "Submitting..." : "Submit for Review"}
              </button>
            )}
            <Link
              href={`/courses/${course.slug}`}
              target="_blank"
              className="px-3 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Preview
            </Link>
            <button
              onClick={handleSave}
              disabled={updateCourse.isPending}
              className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 shadow-md transition-all"
            >
              {updateCourse.isPending ? "Saving" : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="flex gap-1 bg-gray-100 rounded-2xl p-1.5 mb-6 w-fit">
          {(["info", "curriculum", "pricing"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                activeTab === tab ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "info" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Course Title *</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtitle</label>
                <input
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    {["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"].map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Mode</label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                    <option value="PRE_RECORDED">Pre-Recorded</option>
                    <option value="LIVE_ONLINE">Live Online</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Course Thumbnail</h3>
              <p className="text-xs text-gray-500 mb-4">Upload a 16:9 image (JPEG, PNG, WebP) — recommended 1280x720px</p>
              <ImageUpload
                folder="thumbnails"
                preview={course.thumbnail}
                shape="rect"
                className="max-w-sm"
                onSuccess={(publicUrl) => {
                  updateCourse.mutate({ id, thumbnail: publicUrl });
                }}
              />
            </div>
          </div>
        )}

        {activeTab === "curriculum" && (
          <div className="space-y-4">
            {(course.modules ?? []).map((mod, mi) => {
              const isModuleDragOver = dragOverModuleId === mod.id && draggedModuleId !== mod.id;
              return (
                <div
                  key={mod.id}
                  draggable
                  onDragStart={(e) => handleModuleDragStart(e, mod.id)}
                  onDragOver={(e) => handleModuleDragOver(e, mod.id)}
                  onDragEnd={handleModuleDragEnd}
                  onDragLeave={handleModuleDragLeave}
                  className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                    isModuleDragOver
                      ? "border-violet-400 bg-violet-50 shadow-violet-100"
                      : "border-gray-100"
                  } ${draggedModuleId === mod.id ? "opacity-50" : "opacity-100"}`}
                >
                  <div className="flex items-center gap-3 px-5 py-4 bg-gray-50 border-b border-gray-100">
                    <div
                      className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 flex-shrink-0"
                      title="Drag to reorder module"
                    >
                      <GripIcon className="w-4 h-4" />
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {mi + 1}
                    </div>
                    <span className="flex-1 text-sm font-semibold text-gray-900">{mod.title}</span>
                    <span className="text-xs text-gray-400">{mod.lessons.length} lessons</span>
                    <button
                      onClick={() => deleteModule.mutate({ id: mod.id })}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="divide-y divide-gray-50">
                    {mod.lessons.map((lesson) => {
                      const isDragOver =
                        dragOverLessonInfo?.moduleId === mod.id &&
                        dragOverLessonInfo?.lessonId === lesson.id &&
                        draggedLessonInfo?.lessonId !== lesson.id;
                      const isDragging =
                        draggedLessonInfo?.lessonId === lesson.id &&
                        draggedLessonInfo?.moduleId === mod.id;
                      const isUploadExpanded = expandedUploadLessonId === lesson.id;
                      return (
                        <div
                          key={lesson.id}
                          draggable
                          onDragStart={(e) => handleLessonDragStart(e, mod.id, lesson.id)}
                          onDragOver={(e) => handleLessonDragOver(e, mod.id, lesson.id)}
                          onDragEnd={() => handleLessonDragEnd(mod.id)}
                          className={`transition-all ${
                            isDragOver ? "bg-violet-50 border-l-2 border-l-violet-400" : ""
                          } ${isDragging ? "opacity-40" : ""}`}
                        >
                          <div className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50">
                            <div
                              className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 flex-shrink-0"
                              title="Drag to reorder lesson"
                            >
                              <GripIcon className="w-3.5 h-3.5" />
                            </div>
                            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                              {lesson.type === "VIDEO" ? (
                                <svg className="w-3.5 h-3.5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              ) : lesson.type === "QUIZ" ? (
                                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              ) : (
                                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              )}
                            </div>
                            <span className="flex-1 text-sm text-gray-700">{lesson.title}</span>
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{lesson.type}</span>
                            {lesson.isFree && (
                              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">Free</span>
                            )}
                            {lesson.type === "VIDEO" && (
                              <button
                                onClick={() =>
                                  setExpandedUploadLessonId(isUploadExpanded ? null : lesson.id)
                                }
                                className="text-xs font-medium text-violet-600 hover:text-violet-800 px-2 py-1 rounded-lg hover:bg-violet-50 transition-colors"
                              >
                                {isUploadExpanded ? "Hide Upload" : "Upload Video"}
                              </button>
                            )}
                            <button
                              onClick={() => deleteLesson.mutate({ id: lesson.id })}
                              className="p-1 rounded text-gray-300 hover:text-red-400 transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>

                          {lesson.type === "VIDEO" && isUploadExpanded && (
                            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
                              <VideoUpload
                                lessonId={lesson.id}
                                currentStatus={
                                  (lesson as { videoStatus?: string | null }).videoStatus ?? null
                                }
                                onUploadComplete={() => {
                                  queryClient.invalidateQueries(trpc.course.getById.queryOptions({ id }));
                                }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="px-5 py-3 border-t border-gray-50">
                    <button
                      onClick={() =>
                        createLesson.mutate({ moduleId: mod.id, title: "New Lesson", type: "VIDEO" })
                      }
                      className="flex items-center gap-2 text-xs text-violet-600 font-medium hover:text-violet-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Lesson
                    </button>
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => createModule.mutate({ courseId: id, title: "New Module" })}
              className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-semibold text-gray-500 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50/50 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Module
            </button>
          </div>
        )}

        {activeTab === "pricing" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-xl">
              <div>
                <div className="font-semibold text-gray-900 text-sm">Free Course</div>
                <div className="text-xs text-gray-500 mt-0.5">Make this course completely free</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFree}
                  onChange={(e) => setIsFree(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600" />
              </label>
            </div>
            {!isFree && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sale Price (Rs) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rs</span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Original Price (Rs)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rs</span>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
