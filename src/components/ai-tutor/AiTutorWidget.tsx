"use client";

// ─── Floating AI Tutor chat widget ────────────────────────────────────────
// Mounted on dashboard layouts. Pro-gated server-side. Free users see an
// "Upgrade to unlock" CTA when they open it.

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const STARTER_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Hi 👋 I'm your AI Tutor. Ask me anything about prompt engineering, ChatGPT, LLMs, or any AI concept you're stuck on.",
};

const SUGGESTIONS = [
  "What's the difference between zero-shot and few-shot prompting?",
  "Explain transformers like I'm 5",
  "How do I fine-tune an LLM on my own data?",
];

export function AiTutorWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([STARTER_MESSAGE]);
  const [draft, setDraft] = useState("");
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const { data: status } = useQuery({
    ...trpc.aiTutor.status.queryOptions(),
    staleTime: 5 * 60 * 1000,
  });

  const ask = useMutation(trpc.aiTutor.ask.mutationOptions({
    onSuccess: (data) => {
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    },
    onError: (err) => {
      setMessages((m) => [...m, { role: "assistant", content: `⚠️ ${err.message}` }]);
    },
  }));

  // Auto-scroll on new messages
  useEffect(() => {
    if (open) scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || ask.isPending) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setDraft("");
    ask.mutate({ messages: next });
  };

  return (
    <>
      {/* Floating launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open AI Tutor"
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-40 w-[360px] max-w-[calc(100vw-3rem)] h-[560px] max-h-[calc(100vh-3rem)] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-sm">AI Tutor</div>
                <div className="text-[10px] text-violet-100">
                  {status?.available ? "Online · GPT-powered" : status?.hasPro === false ? "Pro feature" : "Loading…"}
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Pro gate */}
          {status && status.hasPro === false && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-violet-50 to-white">
              <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center mb-3">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm">AI Tutor is a Pro feature</h3>
              <p className="text-xs text-gray-500 mt-1.5 max-w-xs leading-relaxed">
                Upgrade to chat with our GPT-powered tutor and get instant, expert answers about every AI topic on the platform.
              </p>
              <Link
                href="/pricing"
                onClick={() => setOpen(false)}
                className="mt-4 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 shadow-md transition-all"
              >
                Upgrade to Pro →
              </Link>
              <p className="mt-3 text-[10px] text-gray-400">Includes 7-day free trial · Cancel anytime</p>
            </div>
          )}

          {/* Chat thread */}
          {status?.available && (
            <>
              <div ref={scrollerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                        m.role === "user"
                          ? "bg-violet-600 text-white rounded-br-sm"
                          : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                      }`}
                    >
                      {m.role === "assistant" ? (
                        <div className="prose prose-sm max-w-none prose-p:my-1.5 prose-pre:my-2 prose-code:text-[12px]">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                        </div>
                      ) : (
                        m.content
                      )}
                    </div>
                  </div>
                ))}
                {ask.isPending && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-2xl px-3 py-2.5 rounded-bl-sm">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                        <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Suggestions (only shown initially) */}
              {messages.length === 1 && !ask.isPending && (
                <div className="px-4 py-2 border-t border-gray-100 bg-white">
                  <div className="text-[10px] uppercase tracking-wide text-gray-400 mb-1.5">Suggestions</div>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSend(s)}
                        className="px-2.5 py-1 text-[11px] bg-violet-50 text-violet-700 rounded-full hover:bg-violet-100 transition-colors text-left"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Composer */}
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(draft); }}
                className="p-3 border-t border-gray-100 bg-white flex items-center gap-2"
              >
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Ask the tutor anything…"
                  disabled={ask.isPending}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:bg-gray-50"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || ask.isPending}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center disabled:opacity-50 hover:from-violet-700 hover:to-indigo-700 transition-all"
                  aria-label="Send"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </>
          )}

          {/* Loading state */}
          {!status && (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}
    </>
  );
}
