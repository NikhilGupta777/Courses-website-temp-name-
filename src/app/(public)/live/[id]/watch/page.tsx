"use client";

// ─── Pro-gated live class recording watch page ──────────────────────────────
// Fetches the recording URL via tRPC. Server-side enforcement: the procedure
// throws FORBIDDEN if the user lacks an active Pro/Annual/Enterprise sub.

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc/client";

export default function WatchRecordingPage() {
  const params = useParams();
  const id = params.id as string;

  const meta  = useQuery(trpc.liveClass.getById.queryOptions({ id }));
  const watch = useQuery(trpc.liveClass.getRecordingUrl.queryOptions({ id }));

  const error = watch.error;
  const isForbidden = error?.data?.code === "FORBIDDEN";
  const isNotFound  = error?.data?.code === "NOT_FOUND";

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="mx-auto max-w-4xl px-4">
        {/* Back link */}
        <Link href="/live" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to live classes
        </Link>

        {/* Title */}
        <div className="mb-6">
          {meta.isLoading ? (
            <div className="h-7 w-2/3 bg-gray-200 rounded animate-pulse" />
          ) : meta.data ? (
            <>
              <h1 className="text-2xl font-bold text-gray-900">{meta.data.title}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {meta.data.instructor.displayName} ·{" "}
                {new Date(meta.data.scheduledAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </>
          ) : null}
        </div>

        {/* Player / gate */}
        {watch.isLoading ? (
          <div className="aspect-video bg-gray-900 rounded-2xl flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isForbidden ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">This recording is for Pro members</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Upgrade to Pro to watch every live class recording — plus unlock all 12+ premium courses, the AI Tutor, and shareable certificates.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 shadow-md transition-all"
            >
              Upgrade to Pro →
            </Link>
            <p className="mt-3 text-xs text-gray-400">Includes 7-day free trial · Cancel anytime</p>
          </div>
        ) : isNotFound ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-gray-500">Recording is not available for this session yet.</p>
          </div>
        ) : watch.data ? (
          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg">
            {/* Auto-detect MP4 vs HLS by extension */}
            {watch.data.recordingUrl.endsWith(".m3u8") ? (
              <video controls playsInline className="w-full h-full" src={watch.data.recordingUrl} />
            ) : (
              <video controls playsInline className="w-full h-full" src={watch.data.recordingUrl} />
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-red-100 p-8 text-center text-red-600 text-sm">
            {watch.error?.message ?? "Could not load recording."}
          </div>
        )}
      </div>
    </div>
  );
}
