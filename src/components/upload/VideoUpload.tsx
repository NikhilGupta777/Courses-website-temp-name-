"use client";

/**
 * VideoUpload — instructor uploads a video for a lesson.
 *
 * Flow:
 *  1. Instructor picks a file.
 *  2. Component POSTs { lessonId } to /api/upload/video → gets a Mux upload URL.
 *  3. Component PUTs the file directly to Mux using XHR (for progress).
 *  4. Mux fires video.asset.ready webhook → lesson gets muxPlaybackId.
 *  5. Component shows a "processing" state until webhook updates the lesson.
 */

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface VideoUploadProps {
  lessonId: string;
  currentStatus?: string | null;  // "preparing" | "ready" | "errored" | null
  onUploadStart?: (uploadId: string) => void;
  onUploadComplete?: () => void;
  onError?: (message: string) => void;
}

type UploadState = "idle" | "requesting" | "uploading" | "processing" | "done" | "error";

export function VideoUpload({
  lessonId,
  currentStatus,
  onUploadStart,
  onUploadComplete,
  onError,
}: VideoUploadProps) {
  const [state, setState]       = useState<UploadState>(
    currentStatus === "ready" ? "done" :
    currentStatus === "preparing" ? "processing" :
    currentStatus === "errored" ? "error" : "idle"
  );
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("video/")) {
      setErrorMsg("Please select a video file (.mp4, .mov, .avi, etc.)");
      setState("error");
      return;
    }

    const MAX_SIZE_GB = 5;
    if (file.size > MAX_SIZE_GB * 1024 * 1024 * 1024) {
      setErrorMsg(`File size must be under ${MAX_SIZE_GB} GB`);
      setState("error");
      return;
    }

    setFileName(file.name);
    setState("requesting");
    setProgress(0);
    setErrorMsg("");

    try {
      // Step 1: get Mux upload URL from our API
      const res = await fetch("/api/upload/video", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ lessonId }),
      });

      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? "Failed to get upload URL");
      }

      const { uploadUrl, uploadId, note } = await res.json() as {
        uploadUrl: string | null;
        uploadId:  string;
        note?:     string;
      };

      onUploadStart?.(uploadId);

      // Dev mode — no real URL available
      if (!uploadUrl) {
        console.info("VideoUpload dev stub:", note ?? "No Mux URL");
        setState("processing");
        return;
      }

      // Step 2: PUT file directly to Mux with XHR for progress tracking
      setState("uploading");
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror   = () => reject(new Error("Network error during upload"));
        xhr.ontimeout = () => reject(new Error("Upload timed out"));

        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.timeout = 30 * 60 * 1000; // 30-minute timeout
        xhr.send(file);
      });

      // Step 3: Upload done — Mux is now transcoding
      setState("processing");
      onUploadComplete?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setErrorMsg(msg);
      setState("error");
      onError?.(msg);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const reset = () => {
    setState("idle");
    setProgress(0);
    setFileName("");
    setErrorMsg("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      {/* ── Idle: drop zone ── */}
      {state === "idle" && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-violet-400 hover:bg-violet-50/30 transition-all group"
        >
          <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-violet-200 transition-colors">
            <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-700">Drop video here or click to select</p>
          <p className="text-xs text-gray-400 mt-1">MP4, MOV, AVI · Max 5 GB</p>
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>
      )}

      {/* ── Requesting: calling API ── */}
      {state === "requesting" && (
        <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 flex items-center gap-4">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-900 truncate">{fileName}</p>
            <p className="text-xs text-gray-500 mt-0.5">Preparing upload…</p>
          </div>
        </div>
      )}

      {/* ── Uploading: XHR in progress ── */}
      {state === "uploading" && (
        <div className="border border-violet-200 rounded-xl p-5 bg-violet-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900 truncate max-w-xs">{fileName}</p>
            <span className="text-sm font-bold text-violet-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-violet-500 to-indigo-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">
            Uploading directly to video CDN…
          </p>
        </div>
      )}

      {/* ── Processing: Mux is transcoding ── */}
      {state === "processing" && (
        <div className="border border-blue-200 rounded-xl p-5 bg-blue-50/50 flex items-center gap-4">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-900">Video processing…</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Your video is being transcoded. This typically takes 1–3 minutes.
              The lesson will be ready to play once processing is complete.
            </p>
          </div>
        </div>
      )}

      {/* ── Done ── */}
      {state === "done" && (
        <div className="border border-green-200 rounded-xl p-4 bg-green-50/50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-green-800">Video ready</p>
              <p className="text-xs text-green-600 mt-0.5">Your video is live and ready to play</p>
            </div>
          </div>
          <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Replace
          </button>
        </div>
      )}

      {/* ── Error ── */}
      {state === "error" && (
        <div className="border border-red-200 rounded-xl p-4 bg-red-50/50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-red-800">Upload failed</p>
              <p className="text-xs text-red-600 mt-0.5">{errorMsg}</p>
            </div>
          </div>
          <button onClick={reset} className="text-xs font-semibold text-red-600 hover:underline">
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
