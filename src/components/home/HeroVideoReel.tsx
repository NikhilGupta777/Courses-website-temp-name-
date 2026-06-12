"use client";

// ─── HeroVideoReel ──────────────────────────────────────────────────────────
// A real <video> element with a hand-styled poster, custom play button, and
// custom mute toggle. We don't ship a video file — we use a public CDN-hosted
// sample and an SVG poster so the section visually anchors even before
// the user presses play.

import { useEffect, useRef, useState } from "react";

interface HeroVideoReelProps {
  /** URL of the source video (mp4 preferred). */
  src?: string;
  /** Poster image URL (or a generated placeholder). */
  poster?: string;
  caption?: string;
}

const DEFAULT_SRC =
  // Royalty-free sample reel — code-on-screen aesthetic. Feels right for AI/dev edu.
  "https://cdn.coverr.co/videos/coverr-typing-on-laptop-2840/1080p.mp4";

export function HeroVideoReel({ src = DEFAULT_SRC, poster, caption = "60-second tour of LearnAI" }: HeroVideoReelProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted]     = useState(true);
  const [progress, setProg]   = useState(0);
  const [duration, setDur]    = useState(0);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {/* autoplay block, ignored */});
    } else {
      v.pause();
    }
  }

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  // Sync state to native video events
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlay   = () => setPlaying(true);
    const onPause  = () => setPlaying(false);
    const onTime   = () => setProg(v.currentTime);
    const onMeta   = () => setDur(v.duration || 0);
    v.addEventListener("play",  onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    return () => {
      v.removeEventListener("play",  onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
    };
  }, []);

  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="relative group rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-violet-900/30 bg-gray-900">
      <div className="aspect-video relative">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted={muted}
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        />

        {/* Built-in fallback poster when the video hasn't loaded — generated SVG */}
        {!playing && !poster && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
            <svg viewBox="0 0 600 340" className="w-full h-full opacity-30" preserveAspectRatio="none" aria-hidden>
              <defs>
                <pattern id="codePat" patternUnits="userSpaceOnUse" width="120" height="40">
                  <text x="0" y="14" fontFamily="monospace" fontSize="10" fill="#a78bfa">def chat(prompt):</text>
                  <text x="0" y="28" fontFamily="monospace" fontSize="10" fill="#a78bfa">    return llm.run(...)</text>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#codePat)" />
            </svg>
          </div>
        )}

        {/* Dim overlay when paused */}
        {!playing && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        )}

        {/* Big play button */}
        {!playing && (
          <button
            onClick={togglePlay}
            data-cursor-grow
            aria-label="Play video"
            className="absolute inset-0 flex items-center justify-center group/play"
          >
            <span className="relative inline-flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white text-violet-700 shadow-2xl group-hover/play:scale-110 transition-transform">
              <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-20" />
              <svg className="w-7 h-7 lg:w-9 lg:h-9 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}

        {/* Custom controls bar (visible on hover or while playing) */}
        <div
          className={`absolute inset-x-0 bottom-0 px-4 py-3 bg-gradient-to-t from-black/80 to-transparent transition-opacity ${
            playing ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              data-cursor-grow
              aria-label={playing ? "Pause video" : "Play video"}
              className="w-9 h-9 rounded-full bg-white/95 hover:bg-white text-violet-700 flex items-center justify-center transition-transform hover:scale-105 shadow-md flex-shrink-0"
            >
              {playing ? (
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>
              ) : (
                <svg className="w-3.5 h-3.5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>
            {/* Progress bar */}
            <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-400 to-pink-400 rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            {/* Time readout */}
            <div className="text-[10px] font-mono text-white/80 tabular-nums">
              {formatTime(progress)} / {formatTime(duration)}
            </div>
            <button
              onClick={toggleMute}
              data-cursor-grow
              aria-label={muted ? "Unmute" : "Mute"}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors flex-shrink-0"
            >
              {muted ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Top-left badge */}
        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold rounded-full border border-white/20">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse-strong" />
          {caption}
        </div>
      </div>
    </div>
  );
}

function formatTime(s: number) {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}
