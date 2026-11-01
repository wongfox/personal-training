import type Anthropic from "@anthropic-ai/sdk";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { localDate } from "@/lib/dates";
import { AI_MODEL, aiEnabled, anthropic, REFUSAL_FALLBACK } from "@/server/ai/client";
import { getSession } from "@/server/auth/current-user";
import { rateLimit } from "@/server/auth/rate-limit";
import { getDb } from "@/server/db";
import { coachMessages } from "@/server/db/schema";
import { AppError } from "@/server/errors";
import { apiError, readJson, sameOrigin } from "@/server/http";
import { track } from "@/server/platform";
import { appendMessage, buildCoachContext, COACH_SYSTEM, playbookReply, startOrContinue } from "@/server/services/coach";

export const maxDuration = 60;

const body = z.object({
  conversationId: z.uuid().optional(),
  message: z.string().trim().min(1, "Write a message.").max(2000),
});

const REFUSAL_TEXT = "That's outside what I can help with here. If it's about how you communicate, lead or connect with people, try asking it another way.";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return apiError(403, "Cross-origin request blocked.");

  const session = await getSession();
  if (!session) return apiError(401, "Sign in to continue.");
  if (!session.user.onboarded) return apiError(403, "Finish onboarding first.");
  const user = session.user;
  const db = getDb();

  let input: z.infer<typeof body>;
  try {
    input = await readJson(request, body);
  } catch (e) {
    return apiError(400, e instanceof z.ZodError ? (e.issues[0]?.message ?? "Invalid request.") : "Invalid request.");
  }
  const limit = await rateLimit(db, `coach:${user.id}`, 40, 3600);
  if (!limit.allowed) return apiError(429, "You've sent a lot of messages this hour. Take a breath and come back shortly.");

  let conversationId: string;
  try {
    conversationId = await db.transaction(async (tx) => {
      const id = await startOrContinue(tx, user.id, input.conversationId, input.message);
      await appendMessage(tx, id, "user", input.message);
      return id;
    });
  } catch (e) {
    if (e instanceof AppError) return apiError(e.status, e.message);
    throw e;
  }
  await track(db, user.id, "coach_message_sent", { ai: aiEnabled() });

  const ctx = await buildCoachContext(db, user, localDate(user.timezone));
  const headers = {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Conversation-Id": conversationId,
    "X-Coach-Mode": aiEnabled() ? "ai" : "playbook",
  };

  if (!aiEnabled()) {
    const reply = await playbookReply(db, input.message, ctx);
    await appendMessage(db, conversationId, "assistant", reply);
    return new Response(reply, { headers });
  }

  const history = await db
    .select({ role: coachMessages.role, content: coachMessages.content })
    .from(coachMessages)
    .where(eq(coachMessages.conversationId, conversationId))
    .orderBy(asc(coachMessages.createdAt));
  const messages: Anthropic.Beta.BetaMessageParam[] = history.slice(-20).map((m) => ({ role: m.role, content: m.content }));
  if (messages[0]?.role === "assistant") messages.shift();

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let text = "";
      try {
        const s = anthropic().beta.messages.stream({
          model: AI_MODEL,
          max_tokens: 4000,
          output_config: { effort: "low" },
          system: [
            { type: "text", text: COACH_SYSTEM },
            { type: "text", text: `Learner brief (private, for your context only):\n${ctx.text}` },
          ],
          messages,
          ...REFUSAL_FALLBACK,
        });
        for await (const event of s) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            text += event.delta.text;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await s.finalMessage();
        if (final.stop_reason === "refusal" && !text) {
          text = REFUSAL_TEXT;
          controller.enqueue(encoder.encode(text));
        }
      } catch (error) {
        console.error("[coach] AI request failed", error instanceof Error ? error.message : error);
        if (!text) {
          text = await playbookReply(db, input.message, ctx);
          controller.enqueue(encoder.encode(text));
        }
      } finally {
        if (text) await appendMessage(db, conversationId, "assistant", text);
        controller.close();
      }
    },
  });
  return new Response(stream, { headers });
}
