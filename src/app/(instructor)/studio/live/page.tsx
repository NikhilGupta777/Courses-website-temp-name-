"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";

type LiveSessionStatus = "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED";

const STATUS_STYLES: Record<LiveSessionStatus, string> = {
  SCHEDULED:  "bg-blue-50 text-blue-700",
  LIVE:       "bg-red-50 text-red-600",
  COMPLETED:  "bg-green-50 text-green-700",
  CANCELLED:  "bg-gray-100 text-gray-500",
};

const DURATION_OPTIONS = [
  { value: 60,  label: "60 min" },
  { value: 90,  label: "90 min" },
  { value: 120, label: "120 min" },
  { value: 180, label: "180 min" },
];

const PLATFORM_OPTIONS = ["Zoom", "Google Meet", "Teams", "Custom"];

interface ScheduleForm {
  title:        string;
  description:  string;
  topic:        string;
  scheduledAt:  string;
  durationMins: number;
  maxSeats:     number;
  platform:     string;
  meetingUrl:   string;
  isProOnly:    boolean;
}

const DEFAULT_FORM: ScheduleForm = {
  title:        "",
  description:  "",
  topic:        "",
  scheduledAt:  "",
  durationMins: 90,
  maxSeats:     500,
  platform:     "Zoom",
  meetingUrl:   "",
  isProOnly:    true,
};

export default function InstructorLivePage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<ScheduleForm>(DEFAULT_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: classes, isLoading } = useQuery(
    trpc.liveClass.getInstructorClasses.queryOptions()
  );

  const createMutation = useMutation(
    trpc.liveClass.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.liveClass.getInstructorClasses.queryOptions());
        setShowModal(false);
        setForm(DEFAULT_FORM);
        setFormError(null);
      },
      onError: (err) => {
        setFormError(err.message ?? "Failed to create session");
      },
    })
  );

  const updateMutation = useMutation(
    trpc.liveClass.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.liveClass.getInstructorClasses.queryOptions());
      },
      onError: (err) => {
        alert(err.message ?? "Update failed");
      },
    })
  );

  const handleCreate = () => {
    setFormError(null);
    if (!form.title.trim()) { setFormError("Title is required"); return; }
    if (!form.scheduledAt) { setFormError("Date and time are required"); return; }
    createMutation.mutate({
      title:        form.title,
      description:  form.description || undefined,
      topic:        form.topic || undefined,
      platform:     form.platform,
      meetingUrl:   form.meetingUrl || undefined,
      scheduledAt:  new Date(form.scheduledAt).toISOString(),
      durationMins: form.durationMins,
      maxSeats:     form.maxSeats,
      isProOnly:    form.isProOnly,
    });
  };

  const handleStatusChange = (id: string, status: LiveSessionStatus) => {
    updateMutation.mutate({ id, status });
  };

  const classList = classes ?? [];
  const totalScheduled  = classList.filter((c) => c.status === "SCHEDULED").length;
  const totalCompleted  = classList.filter((c) => c.status === "COMPLETED").length;
  const totalRsvps      = classList.reduce((sum, c) => sum + c._count.rsvps, 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/studio" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Live Class Management</h1>
              <p className="text-sm text-gray-500 mt-0.5">Schedule and manage your live sessions</p>
            </div>
          </div>
          <button
            onClick={() => { setShowModal(true); setForm(DEFAULT_FORM); setFormError(null); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Schedule New Session
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Scheduled",         value: totalScheduled,  color: "bg-blue-50 text-blue-600",   icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
            { label: "Completed Sessions",value: totalCompleted,  color: "bg-green-50 text-green-600", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
            { label: "Total RSVPs",       value: totalRsvps,      color: "bg-violet-50 text-violet-600", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon} />
                </svg>
              </div>
              <div className="text-2xl font-bold text-gray-900">{isLoading ? "—" : s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Live class table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Your Live Classes</h2>
          </div>

          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : classList.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-700 mb-2">No live classes yet</h3>
              <p className="text-sm text-gray-400 mb-6">Schedule your first live session to start engaging with students.</p>
              <button
                onClick={() => { setShowModal(true); setForm(DEFAULT_FORM); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors text-sm"
              >
                Schedule Your First Live Class
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Title", "Date & Time", "Duration", "Status", "RSVPs", "Actions"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {classList.map((cls) => (
                    <tr key={cls.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-medium text-gray-900 text-sm line-clamp-1 max-w-xs">{cls.title}</div>
                        {cls.topic && <div className="text-xs text-violet-600 mt-0.5">{cls.topic}</div>}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                        <div>{new Date(cls.scheduledAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                        <div className="text-xs text-gray-400">{new Date(cls.scheduledAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{cls.durationMins} min</td>
                      <td className="px-5 py-4">
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold capitalize", STATUS_STYLES[cls.status as LiveSessionStatus] ?? "bg-gray-100 text-gray-500")}>
                          {cls.status.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{cls._count.rsvps} / {cls.maxSeats}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {cls.status === "SCHEDULED" && (
                            <button
                              onClick={() => handleStatusChange(cls.id, "LIVE")}
                              disabled={updateMutation.isPending}
                              className="px-3 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                            >
                              Mark Live
                            </button>
                          )}
                          {cls.status === "LIVE" && (
                            <button
                              onClick={() => handleStatusChange(cls.id, "COMPLETED")}
                              disabled={updateMutation.isPending}
                              className="px-3 py-1 text-xs font-semibold text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                            >
                              Mark Completed
                            </button>
                          )}
                          {(cls.status === "SCHEDULED" || cls.status === "LIVE") && (
                            <button
                              onClick={() => handleStatusChange(cls.id, "CANCELLED")}
                              disabled={updateMutation.isPending}
                              className="px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Schedule New Live Session</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Session Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. ChatGPT Advanced Techniques Live Q&A"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              {/* Topic */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Topic / Subtitle</label>
                <input
                  value={form.topic}
                  onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                  placeholder="e.g. Prompt Engineering Deep Dive"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="What will students learn in this session?"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                />
              </div>

              {/* Date + Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date &amp; Time *</label>
                <input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              {/* Duration + Max Seats */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration</label>
                  <select
                    value={form.durationMins}
                    onChange={(e) => setForm((f) => ({ ...f, durationMins: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                  >
                    {DURATION_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Seats</label>
                  <input
                    type="number"
                    min={1}
                    max={10000}
                    value={form.maxSeats}
                    onChange={(e) => setForm((f) => ({ ...f, maxSeats: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>

              {/* Platform */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Platform</label>
                <select
                  value={form.platform}
                  onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                >
                  {PLATFORM_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Meeting URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Meeting URL</label>
                <input
                  value={form.meetingUrl}
                  onChange={(e) => setForm((f) => ({ ...f, meetingUrl: e.target.value }))}
                  placeholder="https://zoom.us/j/..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              {/* Pro Only toggle */}
              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div>
                  <div className="text-sm font-medium text-gray-900">Pro Members Only</div>
                  <div className="text-xs text-gray-500">Restrict to Pro plan subscribers</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isProOnly}
                    onChange={(e) => setForm((f) => ({ ...f, isProOnly: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600" />
                </label>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  {formError}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl text-sm hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-60"
              >
                {createMutation.isPending ? "Scheduling…" : "Schedule Session"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
