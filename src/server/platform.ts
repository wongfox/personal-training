/**
 * Cross-cutting platform services: transactional email, audit trail and
 * product analytics. Each is a thin, swappable adapter.
 */
import type { Executor } from "@/server/db";
import { analyticsEvents, auditLogs } from "@/server/db/schema";

/* ───────────────────────────── Email ───────────────────────────── */

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
}

/**
 * Sends through Resend when RESEND_API_KEY is configured. Without a provider
 * (local development) the message is written to the server log so flows like
 * password reset can still be completed end to end.
 */
export async function sendEmail(message: EmailMessage): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "Personal Growth OS <no-reply@example.com>";
  if (!key) {
    if (process.env.NODE_ENV === "production" && !process.env.PGLITE_DIR) {
      console.error("[email] RESEND_API_KEY is not configured; email to %s was not sent.", message.to);
      return;
    }
    console.info("\n[email:dev] to=%s\nsubject: %s\n\n%s\n", message.to, message.subject, message.text);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [message.to], subject: message.subject, text: message.text }),
  });
  if (!res.ok) console.error("[email] provider responded %d", res.status);
}

export function appUrl(path = ""): string {
  const base = (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return `${base}${path}`;
}

/* ───────────────────────────── Audit ───────────────────────────── */

export async function audit(
  db: Executor,
  entry: {
    actorId: string | null;
    action: string;
    entityType: string;
    entityId?: string | null;
    metadata?: Record<string, unknown>;
    ipAddress?: string | null;
  },
): Promise<void> {
  await db.insert(auditLogs).values({
    actorId: entry.actorId,
    action: entry.action,
    entityType: entry.entityType,
    entityId: entry.entityId ?? null,
    metadata: entry.metadata ?? {},
    ipAddress: entry.ipAddress ?? null,
  });
}

/* ─────────────────────────── Analytics ─────────────────────────── */

export const ANALYTICS_EVENTS = [
  "app_opened",
  "onboarding_started",
  "onboarding_completed",
  "lesson_started",
  "lesson_completed",
  "exercise_started",
  "exercise_completed",
  "quiz_started",
  "quiz_completed",
  "daily_action_started",
  "daily_action_completed",
  "reflection_completed",
  "streak_started",
  "streak_lost",
  "journey_started",
  "journey_completed",
  "coach_message_sent",
  "practice_started",
  "practice_completed",
  "review_completed",
  "weekly_review_completed",
  "checkpoint_completed",
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

/** First-party event log. Never throws — analytics must not break a user flow. */
export async function track(
  db: Executor,
  userId: string | null,
  name: AnalyticsEvent,
  properties: Record<string, unknown> = {},
): Promise<void> {
  try {
    await db.insert(analyticsEvents).values({ userId, name, properties });
  } catch (error) {
    console.error("[analytics] failed to record %s", name, error);
  }
}
