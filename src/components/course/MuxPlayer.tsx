"use client";

// ─── Cross-browser HLS video player for Mux ──────────────────────────────────
// Native HLS only works on Safari/iOS. For Chrome, Firefox, Edge we use hls.js
// to play the .m3u8 stream. Falls back to MP4 if HLS isn't supported at all.

import { useEffect, useRef, type SyntheticEvent } from "react";

interface MuxPlayerProps {
  playbackId: string;
  /** Resume position in seconds */
  startTime?: number;
  /** Throttled time-update callback (caller should rate-limit) */
  onTimeUpdate?: (e: SyntheticEvent<HTMLVideoElement>) => void;
  /** Called when the user finishes the entire video */
  onEnded?: () => void;
  className?: string;
}

export function MuxPlayer({
  playbackId,
  startTime,
  onTimeUpdate,
  onEnded,
  className,
}: MuxPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const hlsUrl = `https://stream.mux.com/${playbackId}.m3u8`;
  const mp4Url = `https://stream.mux.com/${playbackId}/high.mp4`;
  const posterUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: { destroy: () => void } | null = null;
    let cancelled = false;

    // Native HLS (Safari, iOS)
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
      return;
    }

    // Use hls.js for everything else
    (async () => {
      const Hls = (await import("hls.js")).default;
      if (cancelled) return;
      if (!Hls.isSupported()) {
        // Last-resort fallback: MP4
        video.src = mp4Url;
        return;
      }
      const instance = new Hls({
        // Sensible defaults for online learning content
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });
      instance.loadSource(hlsUrl);
      instance.attachMedia(video);
      hls = instance;
    })();

    return () => {
      cancelled = true;
      if (hls) hls.destroy();
    };
  }, [hlsUrl, mp4Url]);

  // Resume from saved position when metadata is ready
  const handleLoadedMetadata = () => {
    const v = videoRef.current;
    if (v && startTime && startTime > 0 && startTime < (v.duration || Infinity)) {
      v.currentTime = startTime;
    }
  };

  return (
    <video
      ref={videoRef}
      className={className}
      controls
      playsInline
      poster={posterUrl}
      onTimeUpdate={onTimeUpdate}
      onLoadedMetadata={handleLoadedMetadata}
      onEnded={onEnded}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
