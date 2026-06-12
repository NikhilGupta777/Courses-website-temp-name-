"use client";

// ─── Interactive Prompt Playground ──────────────────────────────────────────
// A working in-page chat playground. The user types or picks a chip, and
// gets a hand-crafted streamed AI response (chars appear one at a time).
// It's a closed-set demo (canned responses) but feels like the real thing.
//
// Why canned: keeps the homepage zero-cost (no API calls) while giving a
// genuine "wow, this just works" moment. Real model is on /dashboard.

import { useEffect, useRef, useState, type FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Canned {
  prompt: string;
  short: string;     // chip label
  response: string;  // markdown response
}

const RESPONSES: Canned[] = [
  {
    prompt:    "Write a Python function to summarise a long article using OpenAI's API",
    short:     "Summarise an article in Python",
    response:
`Here's a clean, production-ready function:

\`\`\`python
import openai

def summarise(text: str, max_words: int = 100) -> str:
    """Summarise long text using GPT-4o-mini."""
    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content":
              f"Summarise in <={max_words} words. Plain English. No fluff."},
            {"role": "user", "content": text},
        ],
        temperature=0.3,
        max_tokens=200,
    )
    return response.choices[0].message.content.strip()
\`\`\`

**Why this design:**
- \`temperature=0.3\` keeps the summary deterministic
- The system prompt enforces brevity better than \`max_tokens\` alone
- Use \`gpt-4o-mini\` for cost; bump to \`gpt-4o\` if quality matters more

For long articles (>10k tokens), chunk first, summarise each, then summarise the summaries.`,
  },
  {
    prompt:    "Explain RAG vs fine-tuning in 3 lines",
    short:     "RAG vs fine-tuning?",
    response:
`**RAG** = open-book exam. Look up facts at query time, paste into the prompt. Use when info changes (docs, policies, news).

**Fine-tuning** = closed-book exam. Bake knowledge into model weights. Use for *style*, *tone*, or domain-specific reasoning patterns.

**Verdict:** start with RAG. It's cheaper, faster to update, and 90% of the time it's what you actually need.`,
  },
  {
    prompt:    "Give me 5 prompt engineering tips a beginner doesn't know",
    short:     "5 prompt-eng tips",
    response:
`Here are 5 that aren't in the obvious tutorials:

1. **Put instructions at the *end* if your prompt is long.** GPT-4 attends harder to recent tokens. For chains-of-thought, the final instruction beats the opening one.

2. **Use XML tags, not Markdown, for structure.** \`<question>...</question>\` parses far more reliably than \`# Question\`.

3. **Show, don't tell.** Two great examples > 200 words of rules. Always.

4. **Ask the model to "think step by step *and* show your work in <thinking> tags."** Then strip the tags. Better answers, cleaner outputs.

5. **For factual tasks, end with: "If you're unsure, say so."** Reduces hallucinations by ~40% in our tests.`,
  },
  {
    prompt:    "What's the cheapest way to ship an AI chatbot for my Indian e-commerce store?",
    short:     "Cheap AI bot for my store?",
    response:
`Here's a stack that works for an Indian e-commerce store under ₹5,000/month:

**Backend:** WhatsApp Business API (Meta, free for first 1,000 conversations/month) + Gupshup or Wati for the platform layer (₹2,500/mo).

**LLM:** GPT-4o-mini (~₹0.50 per 1k tokens) or Gemini Flash (~₹0.30) for everyday queries. Reserve GPT-4o only for cart/payment edge cases.

**Knowledge base:** Vector DB on Pinecone free tier or Supabase pgvector. Embed your product catalog with \`text-embedding-3-small\` (~₹4 for 10,000 products).

**Total monthly cost** for ~5,000 daily conversations: roughly **₹3,000–4,500**.

Where I'd start: build a 50-question intent classifier first. Solve 80% of queries with templates. Only fall back to the LLM for the 20% that need it.`,
  },
];

export function InteractivePlayground() {
  const [input, setInput]       = useState("");
  const [streaming, setStream]  = useState(false);
  const [output, setOutput]     = useState("");
  const [shown, setShown]       = useState("");
  const [hasInteracted, setHi]  = useState(false);
  const scrollerRef             = useRef<HTMLDivElement | null>(null);

  // Pick the closest canned response to the user's prompt
  function pickResponse(prompt: string): string {
    const lower = prompt.toLowerCase();
    for (const r of RESPONSES) {
      const keywords = r.prompt.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
      const hits = keywords.filter((k) => lower.includes(k)).length;
      if (hits >= 2) return r.response;
    }
    // Fallback: first canned response
    return RESPONSES[1]!.response;
  }

  function ask(prompt: string) {
    if (streaming) return;
    setHi(true);
    setInput("");
    setOutput("");
    setShown("");
    setStream(true);
    setOutput(pickResponse(prompt));
    // Trigger streaming via the effect below
  }

  // Streaming effect — reveal chars one at a time
  useEffect(() => {
    if (!streaming || !output) return;
    if (shown.length >= output.length) {
      // Schedule the "stop streaming" state change for after this render
      const t = setTimeout(() => setStream(false), 0);
      return () => clearTimeout(t);
    }
    // Faster on whitespace, slower on punctuation, normal otherwise
    const next = output[shown.length] ?? "";
    const speed = /\s/.test(next) ? 6 : /[.,!?]/.test(next) ? 60 : 14;
    const burst = streaming ? 2 : 1;
    const t = setTimeout(() => {
      setShown(output.slice(0, shown.length + burst));
      // Auto-scroll the response area
      const node = scrollerRef.current;
      if (node) node.scrollTop = node.scrollHeight;
    }, speed);
    return () => clearTimeout(t);
  }, [shown, streaming, output]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    ask(input);
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-violet-950 to-gray-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-violet-900/40">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-black/30 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          </div>
          <span className="text-xs font-mono text-gray-400 ml-2">learnai-playground.ipynb</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded">
          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse-strong" />
          GPT-4o · live
        </div>
      </div>

      {/* Body */}
      <div className="p-6 lg:p-8">
        {/* Prompt suggestions */}
        {!hasInteracted && (
          <div className="mb-6">
            <div className="text-xs text-violet-300 mb-2 font-mono">{"// try a prompt"}</div>
            <div className="flex flex-wrap gap-2">
              {RESPONSES.map((r) => (
                <button
                  key={r.short}
                  onClick={() => ask(r.prompt)}
                  className="group inline-flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-400/50 rounded-xl text-xs text-violet-200 hover:text-white transition-all"
                >
                  <span className="text-violet-400 group-hover:text-violet-300 transition-colors">→</span>
                  {r.short}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Output area */}
        <div
          ref={scrollerRef}
          className="bg-black/40 rounded-2xl p-5 min-h-[280px] max-h-[440px] overflow-y-auto border border-white/5 mb-4"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#7c3aed20 transparent" }}
        >
          {!hasInteracted ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[240px] text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mb-4 shadow-xl shadow-violet-500/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-white font-bold text-lg">Try the AI playground</div>
              <div className="text-violet-300 text-sm mt-1">Pick a prompt above or type your own.</div>
              <div className="text-gray-500 text-[11px] mt-4 font-mono">No login. No card. Real GPT-4o examples.</div>
            </div>
          ) : (
            <article className="prose prose-invert prose-sm max-w-none prose-pre:bg-black/60 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-code:text-violet-300 prose-code:before:content-none prose-code:after:content-none prose-strong:text-white prose-headings:text-white prose-p:text-gray-200 prose-li:text-gray-200">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{shown}</ReactMarkdown>
              {streaming && <span className="inline-block w-2 h-4 bg-violet-400 align-middle ml-0.5 animate-caret" />}
            </article>
          )}
        </div>

        {/* Composer */}
        <form onSubmit={handleSubmit} className="flex items-stretch gap-2">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400 font-mono text-sm pointer-events-none">{">"}</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={streaming ? "Streaming…" : "Ask anything about AI…"}
              disabled={streaming}
              className="w-full pl-9 pr-4 py-3 bg-black/40 border border-white/10 focus:border-violet-400/60 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all disabled:opacity-50 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || streaming}
            className="flex-shrink-0 px-5 py-3 bg-gradient-to-br from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-violet-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span className="hidden sm:inline text-sm">{streaming ? "..." : "Send"}</span>
          </button>
        </form>

        {/* Footnote */}
        <div className="mt-3 flex items-center justify-between text-[10px] font-mono">
          <span className="text-gray-500">Tip: try one of the chip prompts for the full experience</span>
          {hasInteracted && !streaming && (
            <button
              onClick={() => { setHi(false); setOutput(""); setShown(""); }}
              className="text-violet-400 hover:text-violet-300"
            >
              [reset]
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
