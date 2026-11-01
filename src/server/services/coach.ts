/**
 * AI Coach: conversation storage, the learner context the coach sees, and
 * the deterministic "playbook" coach used when no AI provider is configured.
 */
import { and, asc, desc, eq } from "drizzle-orm";
import type { ISODate } from "@/lib/dates";
import { categoryName } from "@/lib/taxonomy";
import type { Executor } from "@/server/db";
import {
  coachConversations,
  coachMessages,
  dailyActionAttempts,
  dailyActions,
  exercises,
  lessonProgress,
  lessons,
  reflections,
  resources,
} from "@/server/db/schema";
import { contentWords } from "@/server/engine/text-analysis";
import { NotFoundError } from "@/server/errors";
import { getCoachInsight, getSkillScores } from "./insights";
import { getActivePlan, getJourneyOutline, getStreak } from "./training";

/* ─────────────────────────── Storage ─────────────────────────── */

export async function listConversations(db: Executor, userId: string) {
  return db
    .select({ id: coachConversations.id, title: coachConversations.title, updatedAt: coachConversations.updatedAt })
    .from(coachConversations)
    .where(and(eq(coachConversations.userId, userId), eq(coachConversations.mode, "coach")))
    .orderBy(desc(coachConversations.updatedAt))
    .limit(20);
}

export async function getConversation(db: Executor, userId: string, conversationId: string) {
  const [conversation] = await db
    .select()
    .from(coachConversations)
    .where(and(eq(coachConversations.id, conversationId), eq(coachConversations.userId, userId)));
  if (!conversation) throw new NotFoundError("Conversation not found.");
  const messages = await db
    .select({ id: coachMessages.id, role: coachMessages.role, content: coachMessages.content, createdAt: coachMessages.createdAt })
    .from(coachMessages)
    .where(eq(coachMessages.conversationId, conversationId))
    .orderBy(asc(coachMessages.createdAt));
  return { conversation, messages };
}

export async function startOrContinue(db: Executor, userId: string, conversationId: string | undefined, firstMessage: string) {
  if (conversationId) {
    await getConversation(db, userId, conversationId);
    await db.update(coachConversations).set({ updatedAt: new Date() }).where(eq(coachConversations.id, conversationId));
    return conversationId;
  }
  const title = firstMessage.length > 60 ? `${firstMessage.slice(0, 57).trimEnd()}…` : firstMessage;
  const [row] = await db.insert(coachConversations).values({ userId, mode: "coach", title }).returning({ id: coachConversations.id });
  return row.id;
}

export async function appendMessage(db: Executor, conversationId: string, role: "user" | "assistant", content: string) {
  await db.insert(coachMessages).values({ conversationId, role, content });
}

/* ─────────────────────────── Learner context ─────────────────────────── */

export interface CoachContext {
  firstName: string;
  text: string;
  primarySkill: string;
  journeyTitle: string | null;
}

/** A compact, factual brief about the learner, injected into every coach request. */
export async function buildCoachContext(db: Executor, user: { id: string; name: string }, today: ISODate): Promise<CoachContext> {
  const plan = await getActivePlan(db, user.id);
  const firstName = user.name.split(" ")[0];
  if (!plan) return { firstName, text: `Learner: ${firstName}. No plan yet.`, primarySkill: "Communication", journeyTitle: null };

  const [outline, streak, skillRows, recentLessons, missions, notes] = await Promise.all([
    plan.journeyId ? getJourneyOutline(db, user.id, plan.journeyId, today) : null,
    getStreak(db, user.id, today),
    getSkillScores(db, user.id),
    db
      .select({ title: lessons.title, completedOn: lessonProgress.completedOn })
      .from(lessonProgress)
      .innerJoin(lessons, eq(lessons.id, lessonProgress.lessonId))
      .where(and(eq(lessonProgress.userId, user.id), eq(lessonProgress.status, "completed")))
      .orderBy(desc(lessonProgress.completedAt))
      .limit(6),
    db
      .select({ title: dailyActions.title, status: dailyActionAttempts.status, outcome: dailyActionAttempts.outcome })
      .from(dailyActionAttempts)
      .innerJoin(dailyActions, eq(dailyActions.id, dailyActionAttempts.dailyActionId))
      .where(eq(dailyActionAttempts.userId, user.id))
      .orderBy(desc(dailyActionAttempts.actionDate))
      .limit(5),
    db
      .select({ answers: reflections.answers })
      .from(reflections)
      .where(eq(reflections.userId, user.id))
      .orderBy(desc(reflections.createdAt))
      .limit(4),
  ]);
  const insight = await getCoachInsight(db, user.id, today, plan, outline, streak.current);
  const weakest = [...skillRows].sort((a, b) => a.score - b.score).slice(0, 2);

  const lines = [
    `Name: ${firstName}`,
    `Plan: ${plan.title}. Primary goal: ${plan.primaryGoalName}. Secondary: ${plan.secondaryGoals.map((g) => g.name).join(", ") || "none"}.`,
    `Level: ${plan.level}. Commitment: ${plan.dailyMinutes} min/day. Where they want to improve: ${plan.situations.join(", ")}.`,
    plan.mainChallenge ? `Their main difficulty (own words): "${plan.mainChallenge}"` : "",
    plan.ninetyDayGoal ? `90-day goal: "${plan.ninetyDayGoal}"` : "",
    outline ? `Current journey: ${outline.journey.title} (${outline.percent}% done). Today's lesson: ${outline.todayLesson?.title ?? outline.doneTodayLesson?.title ?? "—"}.` : "",
    `Streak: ${streak.current} days.`,
    `Skill scores (0–100): ${skillRows.map((s) => `${s.name} ${s.score} (started ${s.baseline})`).join("; ")}. Weakest: ${weakest.map((w) => w.name).join(", ")}.`,
    recentLessons.length ? `Recently completed lessons: ${recentLessons.map((l) => l.title).join("; ")}.` : "No lessons completed yet.",
    missions.length ? `Recent real-world missions: ${missions.map((m) => `${m.title} → ${m.status}${m.outcome ? ` (${m.outcome})` : ""}`).join("; ")}.` : "",
    notes.length ? `Recent reflections: ${notes.map((n) => Object.values(n.answers).filter(Boolean).join(" / ")).join(" | ").slice(0, 900)}` : "",
    `Coach's current read: ${insight.observation} ${insight.recommendation}`,
  ];
  return {
    firstName,
    text: lines.filter(Boolean).join("\n"),
    primarySkill: plan.primarySkill.name,
    journeyTitle: outline?.journey.title ?? null,
  };
}

export const COACH_SYSTEM = `You are the personal coach inside Personal Growth OS, a daily training system for communication, confidence, leadership, thinking and networking.
You know this learner well (their brief follows). Coach them — do not lecture.
How you work:
- Answer the actual question first, concretely. Give words they can say, a structure they can use, or a next move.
- Tie advice to their goals, weak skills, current lesson and recent missions when it genuinely helps; never recite their data back at them.
- Keep it short: usually 3–8 sentences or a tight list. Offer a practice rep ("Try saying it to me now") when it fits.
- Be warm, direct and specific. No hype, no therapy-speak, no emojis.
- If something needs a professional (health, legal, crisis), say so plainly and point them to the right kind of help.`;

/* ─────────────────────────── Playbook coach (no AI provider) ─────────────────────────── */

const PRACTICE_HINTS: { pattern: RegExp; slugHint: string; label: string }[] = [
  { pattern: /\b(present|presentation|pitch|talk|speech|slides|committee)\b/i, slugHint: "presentation", label: "Presentation Trainer" },
  { pattern: /\b(network|event|introduce|introduction|conference|ceo|meet)\b/i, slugHint: "network", label: "Networking Practice" },
  { pattern: /\b(objection|push ?back|disagree|negotiat|price|supplier)\b/i, slugHint: "conversation", label: "Conversation Simulator" },
  { pattern: /\b(decide|decision|choose|option)\b/i, slugHint: "decision", label: "Decision Framework" },
  { pattern: /\b(confident|confidence|nervous|hedg|sound)\b/i, slugHint: "hedge", label: "Hedge Hunter" },
];

/**
 * Without an AI provider, the coach answers from the content library: it
 * retrieves the most relevant frameworks and lessons and frames them around
 * the learner's plan. Clearly limited, but useful and honest.
 */
/** Everyday words → the vocabulary the library uses, so "rambling" finds "bottom line up front". */
const SYNONYMS: Record<string, string[]> = {
  ramble: ["concise", "bottom", "point", "first", "brief", "short"],
  rambling: ["concise", "bottom", "point", "first", "brief", "short"],
  waffle: ["concise", "bottom", "point", "first"],
  nervous: ["nerves", "confidence", "calm", "pressure", "routine"],
  anxious: ["nerves", "confidence", "calm", "pressure"],
  shy: ["conversation", "approach", "start", "confidence"],
  confident: ["confidence", "authority", "hedge", "hedges", "certain"],
  sound: ["voice", "hedge", "authority", "tone"],
  introduce: ["introduction", "line", "yourself", "brand"],
  pitch: ["presentation", "opening", "audience", "story"],
  objection: ["pushback", "disagree", "interests", "negotiate"],
  meeting: ["meetings", "decision", "agenda", "speak"],
  forget: ["memory", "remember", "names", "recall"],
  decide: ["decision", "criteria", "options", "pre-mortem"],
};

export async function playbookReply(db: Executor, question: string, ctx: CoachContext): Promise<string> {
  const base = contentWords(question);
  const words = new Set([...base, ...base.flatMap((w) => SYNONYMS[w] ?? [])]);
  const [library, lessonRows, tools] = await Promise.all([
    db.select({ slug: resources.slug, title: resources.title, description: resources.description, body: resources.body, category: resources.category }).from(resources).where(eq(resources.status, "published")),
    db.select({ title: lessons.title, content: lessons.content, category: lessons.category }).from(lessons).where(eq(lessons.status, "published")),
    db.select({ slug: exercises.slug, title: exercises.title }).from(exercises).where(and(eq(exercises.isPractice, true), eq(exercises.status, "published"))),
  ]);
  const score = (text: string) => contentWords(text).filter((w) => words.has(w)).length;

  const bestResource = library
    .map((r) => ({ r, s: score(`${r.title} ${r.title} ${r.description} ${r.body}`) }))
    .sort((a, b) => b.s - a.s)[0];
  const bestLesson = lessonRows
    .map((l) => ({ l, s: score(`${l.title} ${l.title} ${l.content.coreConcept.title} ${l.content.coreConcept.keyPoints.join(" ")} ${l.content.hook}`) }))
    .sort((a, b) => b.s - a.s)[0];

  const parts: string[] = [];
  if (bestLesson && bestLesson.s > 0) {
    const c = bestLesson.l.content;
    parts.push(`Here's how I'd approach it, ${ctx.firstName}. The core idea is **${c.coreConcept.title.replace(/\.$/, "")}**:`);
    parts.push(c.coreConcept.keyPoints.map((k) => `- ${k}`).join("\n"));
    parts.push(`For example — instead of “${c.example.before}”, try: “${c.example.after}”`);
  } else {
    parts.push(`Good question, ${ctx.firstName}. Start with the one thing you want the other person to remember, say it in your first sentence, then give a single reason and a concrete example.`);
  }
  if (bestResource && bestResource.s > 1) {
    parts.push(`Go deeper with **${bestResource.r.title}** (${categoryName(bestResource.r.category)}) in Explore: ${bestResource.r.description}`);
  }
  const hint = PRACTICE_HINTS.find((h) => h.pattern.test(question));
  const tool = hint ? tools.find((t) => t.slug.includes(hint.slugHint)) : null;
  if (tool) parts.push(`Then rehearse it: open **${tool.title}** in Practice and do one rep before the real moment.`);
  if (bestLesson && bestLesson.s > 0) {
    parts.push(`This comes from the lesson **${bestLesson.l.title}** — if it's in your plan you'll meet it there; either way, try the idea once today.`);
  }
  return parts.join("\n\n");
}
