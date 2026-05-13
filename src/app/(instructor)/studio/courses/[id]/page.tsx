"use client";

import { useState } from "react";
import Link from "next/link";
import { COURSES, type CourseLevel } from "@/lib/data/courses";

type LessonType = "VIDEO" | "ARTICLE" | "QUIZ" | "EXERCISE";

interface EditableLesson {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
  isFree: boolean;
}

interface EditableModule {
  id: string;
  title: string;
  lessons: EditableLesson[];
}

export default function CourseEditorPage({ params }: { params: { id: string } }) {
  const source = COURSES.find((c) => c.id === params.id) ?? COURSES[0];

  const [title, setTitle]           = useState(source.title);
  const [subtitle, setSubtitle]     = useState(source.subtitle);
  const [description, setDescription] = useState(source.description);
  const [level, setLevel]           = useState(source.level);
  const [price, setPrice]           = useState(source.price.toString());
  const [originalPrice, setOriginalPrice] = useState(source.originalPrice.toString());
  const [isFree, setIsFree]         = useState(source.isFree);
  const [modules, setModules]       = useState<EditableModule[]>(
    source.modules.map((m) => ({
      id: m.id,
      title: m.title,
      lessons: m.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        type: l.type as LessonType,
        duration: l.duration,
        isFree: l.isFree,
      })),
    }))
  );
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "curriculum" | "pricing">("info");

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800)); // simulate save
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addModule = () => {
    setModules((prev) => [
      ...prev,
      { id: `new-m-${Date.now()}`, title: "New Module", lessons: [] },
    ]);
  };

  const addLesson = (moduleId: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: [...m.lessons, { id: `new-l-${Date.now()}`, title: "New Lesson", type: "VIDEO", duration: "10:00", isFree: false }] }
          : m
      )
    );
  };

  const removeModule = (moduleId: string) => {
    setModules((prev) => prev.filter((m) => m.id !== moduleId));
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m
      )
    );
  };

  const updateModuleTitle = (moduleId: string, value: string) => {
    setModules((prev) => prev.map((m) => m.id === moduleId ? { ...m, title: value } : m));
  };

  const updateLesson = (moduleId: string, lessonId: string, field: keyof EditableLesson, value: string | boolean) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.map((l) => l.id === lessonId ? { ...l, [field]: value } : l) }
          : m
      )
    );
  };

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/studio" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900 line-clamp-1">{title}</h1>
              <p className="text-xs text-gray-500">{totalLessons} lessons across {modules.length} modules</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Saved
              </span>
            )}
            <Link href={`/courses/${source.slug}`} target="_blank"
              className="px-3 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              Preview →
            </Link>
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 shadow-md transition-all">
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-2xl p-1.5 mb-6 w-fit">
          {(["info", "curriculum", "pricing"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                activeTab === tab ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* ── Tab: Info ── */}
        {activeTab === "info" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Course Title *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              <p className="text-xs text-gray-400 mt-1">{title.length}/100 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtitle</label>
              <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Level</label>
                <select value={level} onChange={(e) => setLevel(e.target.value as CourseLevel)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                  {["Beginner", "Intermediate", "Advanced", "Expert"].map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Mode</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                  <option>Pre-Recorded</option>
                  <option>Live Online</option>
                  <option>Hybrid</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Curriculum ── */}
        {activeTab === "curriculum" && (
          <div className="space-y-4">
            {modules.map((mod, mi) => (
              <div key={mod.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Module header */}
                <div className="flex items-center gap-3 px-5 py-4 bg-gray-50 border-b border-gray-100">
                  <svg className="w-4 h-4 text-gray-400 cursor-grab flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <div className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {mi + 1}
                  </div>
                  <input
                    value={mod.title}
                    onChange={(e) => updateModuleTitle(mod.id, e.target.value)}
                    className="flex-1 text-sm font-semibold text-gray-900 bg-transparent focus:outline-none focus:ring-0 border-b border-transparent focus:border-violet-500"
                  />
                  <span className="text-xs text-gray-400 flex-shrink-0">{mod.lessons.length} lessons</span>
                  <button onClick={() => removeModule(mod.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>

                {/* Lessons */}
                <div className="divide-y divide-gray-50">
                  {mod.lessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors">
                      <svg className="w-3.5 h-3.5 text-gray-300 cursor-grab flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                      {/* Type icon */}
                      <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {lesson.type === "VIDEO" && <svg className="w-3.5 h-3.5 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>}
                        {lesson.type === "QUIZ"  && <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        {lesson.type === "ARTICLE" && <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                        {lesson.type === "EXERCISE" && <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>}
                      </div>
                      <input
                        value={lesson.title}
                        onChange={(e) => updateLesson(mod.id, lesson.id, "title", e.target.value)}
                        className="flex-1 text-sm text-gray-700 bg-transparent focus:outline-none border-b border-transparent focus:border-violet-500"
                      />
                      <select
                        value={lesson.type}
                        onChange={(e) => updateLesson(mod.id, lesson.id, "type", e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-violet-500 flex-shrink-0"
                      >
                        {["VIDEO", "ARTICLE", "QUIZ", "EXERCISE"].map((t) => <option key={t}>{t}</option>)}
                      </select>
                      <input
                        value={lesson.duration}
                        onChange={(e) => updateLesson(mod.id, lesson.id, "duration", e.target.value)}
                        className="w-16 text-xs text-gray-500 border border-gray-200 rounded-lg px-2 py-1 text-center focus:outline-none focus:ring-1 focus:ring-violet-500 flex-shrink-0"
                        placeholder="mm:ss"
                      />
                      <label className="flex items-center gap-1.5 cursor-pointer flex-shrink-0">
                        <input type="checkbox" checked={lesson.isFree}
                          onChange={(e) => updateLesson(mod.id, lesson.id, "isFree", e.target.checked)}
                          className="rounded border-gray-300 text-violet-600 focus:ring-violet-500 w-3 h-3" />
                        <span className="text-xs text-gray-500">Free</span>
                      </label>
                      <button onClick={() => removeLesson(mod.id, lesson.id)}
                        className="p-1 rounded text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add lesson */}
                <div className="px-5 py-3 border-t border-gray-50">
                  <button onClick={() => addLesson(mod.id)}
                    className="flex items-center gap-2 text-xs text-violet-600 font-medium hover:text-violet-700 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add Lesson
                  </button>
                </div>
              </div>
            ))}

            <button onClick={addModule}
              className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-semibold text-gray-500 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50/50 transition-all flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Module
            </button>
          </div>
        )}

        {/* ── Tab: Pricing ── */}
        {activeTab === "pricing" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
            {/* Free toggle */}
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-xl">
              <div>
                <div className="font-semibold text-gray-900 text-sm">Free Course</div>
                <div className="text-xs text-gray-500 mt-0.5">Make this course completely free for all users</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600" />
              </label>
            </div>

            {!isFree && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Sale Price (₹) *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Original Price (₹)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                      <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Shown with strikethrough as the &quot;was&quot; price</p>
                  </div>
                </div>
                {price && originalPrice && Number(originalPrice) > Number(price) && (
                  <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-700">
                    ✓ Discount: {Math.round((1 - Number(price) / Number(originalPrice)) * 100)}% off
                    · Students save ₹{(Number(originalPrice) - Number(price)).toLocaleString("en-IN")}
                  </div>
                )}
                <div className="p-4 bg-violet-50 border border-violet-100 rounded-xl text-sm">
                  <div className="font-semibold text-violet-800 mb-1">Revenue Estimate</div>
                  <p className="text-violet-700 text-xs">
                    You earn <strong>70%</strong> of every sale.
                    At ₹{Number(price).toLocaleString("en-IN")}/course, you earn{" "}
                    <strong>₹{Math.round(Number(price) * 0.7).toLocaleString("en-IN")}</strong> per enrolment.
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
