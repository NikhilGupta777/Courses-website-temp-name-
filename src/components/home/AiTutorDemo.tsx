"use client";

// ─── AI Tutor live demo ─────────────────────────────────────────────────────
// Auto-types a back-and-forth conversation between a learner and the AI tutor
// to showcase the feature. Loops forever once the panel is in view.

import { useEffect, useRef, useState } from "react";

type Sender = "user" | "ai";
interface Turn {
  sender: Sender;
  text: string;
}

const SCRIPT: Turn[] = [
  { sender: "user", text: "Explain transformers like I'm 5 years old" },
  {
    sender: "ai",
    text:
      "Imagine a classroom where every kid wears a magic hat. Each hat lets that kid hear *every other kid* whispering at the same time, then decide which whispers matter most.\n\nThat's a transformer — words look at all the other words at once, then decide which ones to pay attention to. The 'attention' part is the magic hat. That's why ChatGPT understands long sentences so well.",
  },
  { sender: "user", text: "Can you give me a Python example?" },
  {
    sender: "ai",
    text:
      "Sure — here's a tiny attention block in plain PyTorch:\n\n```python\nimport torch.nn.functional as F\n\nq, k, v = ... # query / key / value tensors\nscores = q @ k.transpose(-2, -1) / d_k**0.5\nweights = F.softmax(scores, dim=-1)\nout = weights @ v\n```\n\nWant me to break down what each line does?",
  },
];

// Splits a turn into characters (preserving newlines) so we can type one-by-one
function chars(s: string): string[] {
  return Array.from(s);
}

export function AiTutorDemo() {
  const [turnIndex, setTurnIndex] = useState(0);
  const [shown, setShown] = useState(""); // chars typed so far for current turn
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const visibleRef = useRef(false);

  // Only animate when the panel is in view (saves CPU on long pages)
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([e]) => { visibleRef.current = !!e?.isIntersecting; },
      { threshold: 0.2 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (paused) return;
    const turn = SCRIPT[turnIndex];
    if (!turn) return;

    const pieces = chars(turn.text);
    if (shown.length >= pieces.length) {
      // Finished current turn → wait, then go to next
      const wait = turn.sender === "ai" ? 2200 : 900;
      const timer = setTimeout(() => {
        setShown("");
        setTurnIndex((i) => (i + 1) % SCRIPT.length);
      }, wait);
      return () => clearTimeout(timer);
    }

    if (!visibleRef.current) return; // pause when off-screen

    // Type 1–3 chars per tick for a more natural rhythm; AI types faster
    const speed = turn.sender === "ai" ? 18 : 42;
    const burst = turn.sender === "ai" ? 2 : 1;
    const t = setTimeout(() => {
      setShown(pieces.slice(0, shown.length + burst).join(""));
    }, speed);
    return () => clearTimeout(t);
  }, [shown, turnIndex, paused]);

  // Reveal turns up to (and including) the current one
  const visible = SCRIPT.slice(0, turnIndex);
  const current = SCRIPT[turnIndex];

  return (
    <div
      ref={containerRef}
      className="relative bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-violet-500/10 overflow-hidden"
    >
      {/* Window chrome */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gradient-to-r from-violet-50/60 to-indigo-50/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">AI Tutor</div>
            <div className="text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-strong" />
              Online · Powered by GPT
            </div>
          </div>
        </div>
        <button
          onClick={() => setPaused((p) => !p)}
          className="p-1.5 rounded-lg hover:bg-violet-100 transition-colors"
          aria-label={paused ? "Resume" : "Pause"}
        >
          {paused ? (
            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          ) : (
            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>
          )}
        </button>
      </div>

      {/* Chat thread */}
      <div className="p-5 space-y-3 bg-gray-50/40 min-h-[420px] max-h-[520px] overflow-y-auto">
        {visible.map((t, i) => (
          <Bubble key={i} sender={t.sender} text={t.text} done />
        ))}
        {current && (
          <Bubble sender={current.sender} text={shown} done={false} />
        )}
      </div>

      {/* Composer (decorative) */}
      <div className="p-3 border-t border-gray-100 bg-white flex items-center gap-2">
        <div className="flex-1 px-3 py-2 text-sm text-gray-400 bg-gray-50 rounded-xl border border-gray-100">
          Ask the tutor anything…
        </div>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Bubble({ sender, text, done }: { sender: Sender; text: string; done: boolean }) {
  const isUser = sender === "user";
  const lines = text.split("\n");

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={
          isUser
            ? "max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-br-sm text-sm bg-violet-600 text-white shadow-md"
            : "max-w-[88%] px-3.5 py-2.5 rounded-2xl rounded-bl-sm text-sm bg-white text-gray-800 border border-gray-100 shadow-sm"
        }
      >
        {lines.map((line, i) => {
          if (line.startsWith("```")) {
            // Code fence opener/closer — render as code block visually
            return null;
          }
          // Detect a code block (lines surrounded by ```)
          return (
            <p key={i} className="leading-relaxed whitespace-pre-wrap">
              {line || "\u00A0"}
            </p>
          );
        }).filter(Boolean)}

        {/* Crude code-block detection: render as monospace if any line starts with `import` or has 4+ space indent */}
        {!isUser && lines.some((l) => l.startsWith("import ") || l.startsWith("```")) && (
          <CodeBlock raw={text} />
        )}

        {!done && (
          <span className="inline-block ml-0.5 w-2 h-4 align-middle bg-current animate-caret" />
        )}
      </div>
    </div>
  );
}

// Render the python block in a styled monospace card
function CodeBlock({ raw }: { raw: string }) {
  const start = raw.indexOf("```python");
  const end   = raw.indexOf("```", start + 9);
  if (start < 0 || end < 0) return null;
  const code = raw.slice(start + "```python".length, end).trim();
  return (
    <pre className="mt-2 mb-2 px-3 py-2 bg-gray-900 text-gray-100 text-[12px] rounded-lg overflow-x-auto leading-relaxed">
      <code>{code}</code>
    </pre>
  );
}
