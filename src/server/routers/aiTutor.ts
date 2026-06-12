import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "@/lib/trpc/server";

// ─── AI Tutor — OpenAI-compatible chat completion ──────────────────────────
// Pro-only. The endpoint uses any OpenAI-compatible API (OpenAI, Anthropic
// via OpenRouter, Groq, Together, local Ollama, etc.) so deployments can pick
// any backend without a code change.

const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1).max(4000),
});

const SYSTEM_PROMPT = `You are LearnAI Tutor, a friendly and concise AI teaching assistant for the LearnAI online learning platform.
- Answer questions about AI, machine learning, prompt engineering, ChatGPT, LLMs, and Indian tech careers.
- Keep responses focused and under 200 words unless asked for more detail.
- If a learner is stuck on a concept, explain it step-by-step with a real-world example.
- Encourage them to keep practising; remind them they can revisit lessons or ask the instructor in live classes.
- If a question is outside AI/learning, politely redirect.`;

async function checkProAccess(db: typeof import("@/lib/db").db, userId: string): Promise<boolean> {
  const sub = await db.subscription.findFirst({
    where: {
      userId,
      status: { in: ["ACTIVE", "TRIALING"] },
      plan: { in: ["PRO_MONTHLY", "PRO_ANNUAL", "ENTERPRISE"] },
    },
    select: { id: true },
  });
  return !!sub;
}

export const aiTutorRouter = router({
  // Returns whether the AI tutor is available to the current user
  status: protectedProcedure.query(async ({ ctx }) => {
    const hasPro = await checkProAccess(ctx.db, ctx.session.user.id);
    const configured = !!process.env.OPENAI_API_KEY;
    return { available: hasPro && configured, hasPro, configured };
  }),

  // Send a chat message and stream/return the assistant reply
  ask: protectedProcedure
    .input(z.object({
      messages: z.array(messageSchema).min(1).max(20),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Pro gating
      const hasPro = await checkProAccess(ctx.db, userId);
      if (!hasPro) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "AI Tutor is a Pro feature. Upgrade to chat with the AI Tutor.",
        });
      }

      // Rate-limit per user: 30 messages per hour (DB-backed via Notification rows? No.
      // Keep it simple — count user's recent assistant messages cached in memory
      // for the lifetime of the serverless instance. For real apps swap to Redis.)
      const recent = recentRequests.get(userId) ?? [];
      const now = Date.now();
      const fresh = recent.filter((t) => now - t < 60 * 60 * 1000);
      if (fresh.length >= 30) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "You've hit the hourly chat limit (30 messages). Please try again later.",
        });
      }
      fresh.push(now);
      recentRequests.set(userId, fresh);

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        // Graceful fallback when the AI provider isn't configured
        return {
          reply:
            "Hi! The AI Tutor isn't configured on this deployment yet. " +
            "In the meantime, explore the courses on your dashboard or join a live class to ask an instructor directly.",
          model: "stub",
        };
      }

      const baseUrl = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
      const model   = process.env.OPENAI_MODEL    ?? "gpt-4o-mini";

      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization:  `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...input.messages,
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("AI Tutor upstream error:", res.status, txt);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "AI Tutor is unavailable right now. Please try again in a moment.",
        });
      }

      const data = (await res.json()) as {
        choices: Array<{ message: { content: string } }>;
        model?: string;
      };

      const reply = data.choices[0]?.message?.content?.trim()
        ?? "Sorry, I couldn't form an answer. Please try rephrasing.";

      return { reply, model: data.model ?? model };
    }),
});

// In-memory rate-limit tracker (per serverless instance)
const recentRequests = new Map<string, number[]>();
