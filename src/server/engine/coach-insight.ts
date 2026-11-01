/**
 * The feedback engine: reads the learner's recent signals (missions,
 * reflections, exercise scores, consistency) and writes one specific
 * observation plus what to do next — the "coach's read" on the Home screen.
 */
import type { DimensionScore } from "@/server/db/types";
import { DIMENSION_LABELS } from "./text-analysis";

export interface InsightSignals {
  primarySkill: { key: string; name: string };
  skills: { key: string; name: string; score: number; baseline: number }[];
  /** Missions from the last 14 days, newest first. */
  actions: { status: "committed" | "done" | "not_yet" | "skipped"; outcome: string | null; title: string }[];
  /** Free text from recent reflections, newest first. */
  reflections: string[];
  /** Recent scored exercises, newest first. */
  exercises: { score: number; dimensions?: DimensionScore[]; flaggedCount: number }[];
  daysTrainedLast7: number;
  weeklyTarget: number;
  /** Days since the plan started (1 on the first day). */
  daysInPlan: number;
  streak: number;
  lessonsCompleted: number;
  next: { title: string; skillName: string } | null;
}

export interface CoachInsight {
  observation: string;
  recommendation: string;
  focus: string;
  tone: "welcome" | "praise" | "nudge" | "challenge";
}

const HESITATION = /\b(nervous|anxious|hesitat\w*|afraid|scared|awkward|froze|freeze|didn'?t know what to say|blank(ed)?|overthink\w*|shy|intimidat\w*|avoid\w*)\b/i;
const WIN = /\b(worked|went well|felt good|confident|easier|natural|they (smiled|laughed|agreed)|success)\b/i;

function weakestDimension(exercises: InsightSignals["exercises"]): { key: string; label: string; avg: number } | null {
  const sums = new Map<string, { total: number; n: number }>();
  for (const e of exercises.slice(0, 8)) {
    for (const d of e.dimensions ?? []) {
      const s = sums.get(d.key) ?? { total: 0, n: 0 };
      s.total += d.score;
      s.n += 1;
      sums.set(d.key, s);
    }
  }
  let worst: { key: string; label: string; avg: number } | null = null;
  for (const [key, { total, n }] of sums) {
    if (n < 2) continue;
    const avg = total / n;
    if (!worst || avg < worst.avg) worst = { key, label: DIMENSION_LABELS[key as keyof typeof DIMENSION_LABELS] ?? key, avg };
  }
  return worst && worst.avg < 68 ? worst : null;
}

export function buildCoachInsight(s: InsightSignals): CoachInsight {
  const nextLine = s.next ? `Tomorrow's lesson, “${s.next.title}”, builds exactly this.` : "Use the Practice tab to rehearse it today.";

  if (s.lessonsCompleted === 0 && s.actions.length === 0) {
    return {
      tone: "welcome",
      focus: s.primarySkill.name,
      observation: `Your plan starts with ${s.primarySkill.name.toLowerCase()}: one idea a day, practised the same day in real life.`,
      recommendation: "Do today's lesson, then take its mission into your day. Small reps, every day — that's the whole method.",
    };
  }

  const improving = [...s.skills]
    .map((k) => ({ ...k, gain: k.score - k.baseline }))
    .sort((a, b) => b.gain - a.gain)[0];
  const improvingClause = improving && improving.gain >= 3 ? `You're improving your ${improving.name.toLowerCase()} (+${improving.gain} since you started)` : null;

  // 1. Reflections say they hesitate.
  const hesitant = s.reflections.slice(0, 5).filter((r) => HESITATION.test(r)).length;
  const avoided = s.actions.slice(0, 5).filter((a) => a.status === "not_yet" || a.status === "skipped").length;
  const difficult = s.actions.slice(0, 5).filter((a) => a.outcome === "difficult").length;
  if (hesitant >= 2 || (hesitant >= 1 && avoided + difficult >= 1)) {
    return {
      tone: "challenge",
      focus: "Initiating",
      observation: `${improvingClause ?? "You're putting in the reps"}, but your reflections suggest you still hesitate at the moment you need to start — the first sentence, the first step.`,
      recommendation: `Lower the bar: decide your opening line before the moment arrives, then say it within three seconds. ${nextLine}`,
    };
  }

  // 2. Missions not getting done.
  if (avoided >= 2) {
    return {
      tone: "nudge",
      focus: "Application",
      observation: `You're learning the ideas, but ${avoided} of your last ${Math.min(5, s.actions.length)} missions didn't happen yet. Knowledge only turns into skill when you use it.`,
      recommendation: "Pick the moment for today's mission now — which meeting, which person, what time. A specific plan more than doubles follow-through.",
    };
  }

  // 3. A measurable weakness in how they write/speak.
  const weak = weakestDimension(s.exercises);
  if (weak) {
    const flagged = s.exercises.slice(0, 5).reduce((n, e) => n + e.flaggedCount, 0);
    const detail = weak.key === "confidence" && flagged > 0 ? ` — ${flagged} hedge or apology phrases in your recent answers` : "";
    return {
      tone: "challenge",
      focus: weak.label,
      observation: `${improvingClause ? improvingClause + ". Your" : "Your"} weakest signal right now is ${weak.label.toLowerCase()}${detail} (averaging ${Math.round(weak.avg)}/100).`,
      recommendation: weak.key === "curiosity"
        ? `In your next conversation, ask two questions before you share anything about yourself. ${nextLine}`
        : `Before you hit submit or speak, reread once for ${weak.label.toLowerCase()} only. ${nextLine}`,
    };
  }

  // 4. Consistency — judged only on the days the plan has actually been running.
  const window = Math.min(7, s.daysInPlan);
  const expected = Math.ceil((s.weeklyTarget * window) / 7);
  if (s.daysInPlan >= 3 && s.daysTrainedLast7 < Math.ceil(expected / 2)) {
    return {
      tone: "nudge",
      focus: "Consistency",
      observation: `You trained ${s.daysTrainedLast7} of the last ${window} days against a plan of ${expected}. Skills compound with frequency, not intensity.`,
      recommendation: "Shrink the session instead of skipping it: even the 5-minute version keeps the habit alive.",
    };
  }

  // 5. Early days: encourage the rhythm rather than judge it.
  if (s.daysInPlan < 3 && !improvingClause) {
    return {
      tone: "praise",
      focus: "Momentum",
      observation: `Day ${s.daysInPlan} done right: you learned it, practised it and took it into your day. That loop is the whole method.`,
      recommendation: s.next ? `Tomorrow: “${s.next.title}”. Same time, same rhythm.` : "Come back tomorrow — same time, same rhythm.",
    };
  }

  // 6. Wins.
  const wins = s.actions.slice(0, 5).filter((a) => a.outcome === "good" || a.outcome === "excellent").length + s.reflections.slice(0, 3).filter((r) => WIN.test(r)).length;
  return {
    tone: "praise",
    focus: improving?.name ?? s.primarySkill.name,
    observation: improvingClause
      ? `${improvingClause}${wins > 0 ? `, and your missions are landing — ${wins} recent wins` : ""}. ${s.streak >= 3 ? `${s.streak} days in a row.` : ""}`.trim()
      : `Steady work: ${s.lessonsCompleted} lessons done and a ${s.streak}-day streak.`,
    recommendation: s.next ? `Raise the difficulty a notch. Next up: “${s.next.title}”.` : "Try a harder practice scenario this week to stretch the skill.",
  };
}
