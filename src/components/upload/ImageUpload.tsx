"use client";

/**
 * ImageUpload — uploads an image to Cloudflare R2 via a presigned PUT URL.
 *
 * Flow:
 *  1. User picks or drops an image file.
 *  2. Component POSTs { filename, contentType, folder } → /api/upload/image.
 *  3. API returns { uploadUrl, publicUrl }.
 *  4. Component PUTs file directly to R2 using the presigned URL.
 *  5. Calls onSuccess(publicUrl) so the parent can save the URL.
 *
 * Props:
 *  folder    — "thumbnails" | "profiles" | "resources"
 *  onSuccess — called with the final public URL once upload completes
 *  preview   — optional current image URL to display before upload
 *  shape     — "rect" (16:9 thumbnail) | "circle" (avatar)
 */

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  folder?:    "thumbnails" | "profiles" | "resources";
  onSuccess:  (publicUrl: string) => void;
  onError?:   (message: string)   => void;
  preview?:   string | null;
  shape?:     "rect" | "circle";
  className?: string;
}

type UploadState = "idle" | "uploading" | "done" | "error";

export function ImageUpload({
  folder    = "thumbnails",
  onSuccess,
  onError,
  preview,
  shape     = "rect",
  className,
}: ImageUploadProps) {
  const [state, setState]       = useState<UploadState>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(preview ?? null);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!ALLOWED.includes(file.type)) {
      const msg = "Only JPEG, PNG, WebP or GIF images are allowed";
      setErrorMsg(msg);
      setState("error");
      onError?.(msg);
      return;
    }

    const MAX_MB = 5;
    if (file.size > MAX_MB * 1024 * 1024) {
      const msg = `Image must be under ${MAX_MB} MB`;
      setErrorMsg(msg);
      setState("error");
      onError?.(msg);
      return;
    }

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setState("uploading");
    setErrorMsg("");

    try {
      // Step 1: get presigned URL from our API
      const res = await fetch("/api/upload/image", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ filename: file.name, contentType: file.type, folder }),
      });

      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? "Failed to get upload URL");
      }

      const { uploadUrl, publicUrl, note } = await res.json() as {
        uploadUrl: string | null;
        publicUrl: string | null;
        note?:     string;
      };

      // Dev mode — no real upload, just use local preview URL
      if (!uploadUrl || !publicUrl) {
        console.info("ImageUpload dev stub:", note ?? "No R2 URL");
        // In dev we simulate success with the local blob URL
        setState("done");
        onSuccess(localUrl);
        return;
      }

      // Step 2: PUT file directly to R2
      const putRes = await fetch(uploadUrl, {
        method:  "PUT",
        headers: { "Content-Type": file.type },
        body:    file,
      });

      if (!putRes.ok) {
        throw new Error(`R2 upload failed with status ${putRes.status}`);
      }

      // Step 3: success — use the CDN/public URL
      setState("done");
      setPreviewUrl(publicUrl);
      onSuccess(publicUrl);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setErrorMsg(msg);
      setState("error");
      onError?.(msg);
      // Revert preview on error
      setPreviewUrl(preview ?? null);
      URL.revokeObjectURL(localUrl);
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

  const isCircle = shape === "circle";

  return (
    <div className={cn("relative inline-block", className)}>
      {/* Preview / drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={cn(
          "cursor-pointer overflow-hidden border-2 transition-all group",
          isCircle
            ? "w-20 h-20 rounded-full"
            : "w-full aspect-video rounded-2xl",
          state === "uploading"
            ? "border-violet-400 opacity-70"
            : state === "error"
            ? "border-red-300"
            : previewUrl
            ? "border-transparent hover:border-violet-400"
            : "border-dashed border-gray-300 hover:border-violet-400 hover:bg-violet-50/30"
        )}
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Upload preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
            {state === "uploading" ? (
              <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-6 h-6 text-gray-400 mb-1 group-hover:text-violet-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {!isCircle && (
                  <p className="text-xs text-gray-400 group-hover:text-violet-500 transition-colors">
                    Click or drop image
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {/* Overlay edit icon when image is present */}
        {previewUrl && state !== "uploading" && (
          <div className={cn(
            "absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
            isCircle ? "rounded-full" : "rounded-2xl"
          )}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
        )}

        {/* Uploading spinner overlay */}
        {state === "uploading" && previewUrl && (
          <div className={cn(
            "absolute inset-0 bg-black/40 flex items-center justify-center",
            isCircle ? "rounded-full" : "rounded-2xl"
          )}>
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Status text below */}
      {state === "done" && !isCircle && (
        <p className="text-xs text-green-600 font-medium mt-1.5 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Image uploaded
        </p>
      )}
      {state === "error" && (
        <p className="text-xs text-red-500 mt-1.5">{errorMsg}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
