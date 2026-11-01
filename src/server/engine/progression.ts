/**
 * Progression rules: XP values, levels, streaks, spaced repetition and skill
 * scores. Pure functions — no I/O — so they are trivially unit-tested and can
 * be shared with a future native client.
 */
import { addDays, diffDays, type ISODate } from "@/lib/dates";

/* ───────────────────────────── XP ───────────────────────────── */

export const XP = {
  onboarding: 50,
  lesson: 50,
  exercise: 30,
  quizPerCorrect: 10,
  action: 40,
  reflection: 20,
  review: 5,
  practice: 30,
  weeklyReview: 50,
  checkpoint: 100,
} as const;

/* ──────────────────────────── Levels ──────────────────────────── */

export const LEVELS = [
  { level: 1, name: "Explorer", minXp: 0 },
  { level: 2, name: "Learner", minXp: 500 },
  { level: 3, name: "Practitioner", minXp: 1500 },
  { level: 4, name: "Performer", minXp: 3500 },
  { level: 5, name: "Master", minXp: 7000 },
] as const;

export interface LevelInfo {
  level: number;
  name: string;
  minXp: number;
  nextLevelXp: number | null;
  nextName: string | null;
  /** 0–100 progress toward the next level. */
  progress: number;
}

export function levelForXp(xp: number): LevelInfo {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].minXp) idx = i;
  const current = LEVELS[idx];
  const next = LEVELS[idx + 1];
  return {
    level: current.level,
    name: current.name,
    minXp: current.minXp,
    nextLevelXp: next?.minXp ?? null,
    nextName: next?.name ?? null,
    progress: next ? Math.round(((xp - current.minXp) / (next.minXp - current.minXp)) * 100) : 100,
  };
}

/* ──────────────────────────── Streaks ──────────────────────────── */

export interface StreakState {
  current: number;
  longest: number;
  lastActiveDate: ISODate | null;
}

export type StreakEvent = "same_day" | "past" | "started" | "continued" | "restarted";

/** Applies one training day. `restarted` means a previous streak was lost. */
export function applyTrainingDay(
  prev: StreakState,
  today: ISODate,
): StreakState & { event: StreakEvent; lost: number } {
  if (prev.lastActiveDate === today) return { ...prev, event: "same_day", lost: 0 };
  // A late-arriving activity for an earlier day (e.g. another device's offline queue)
  // never rewinds or resets the streak.
  if (prev.lastActiveDate && today < prev.lastActiveDate) return { ...prev, event: "past", lost: 0 };
  if (prev.lastActiveDate && diffDays(prev.lastActiveDate, today) === 1) {
    const current = prev.current + 1;
    return { current, longest: Math.max(prev.longest, current), lastActiveDate: today, event: "continued", lost: 0 };
  }
  const lost = prev.lastActiveDate && prev.current > 0 ? prev.current : 0;
  return {
    current: 1,
    longest: Math.max(prev.longest, 1),
    lastActiveDate: today,
    event: lost > 0 ? "restarted" : "started",
    lost,
  };
}

/** The streak a learner sees today: still alive if they trained today or yesterday. */
export function visibleStreak(state: StreakState, today: ISODate): { current: number; atRisk: boolean } {
  if (!state.lastActiveDate) return { current: 0, atRisk: false };
  const gap = diffDays(state.lastActiveDate, today);
  if (gap <= 0) return { current: state.current, atRisk: false };
  if (gap === 1) return { current: state.current, atRisk: true };
  return { current: 0, atRisk: false };
}

/* ─────────────────────── Spaced repetition ─────────────────────── */

/** Days until the next review after successfully passing stage N. */
export const REVIEW_INTERVALS = [1, 3, 7, 14, 30] as const;

export interface ReviewState {
  stage: number;
  dueOn: ISODate | null;
  lapses: number;
}

/** First exposure: the concept comes back tomorrow. */
export function initialReview(today: ISODate): ReviewState {
  return { stage: 0, dueOn: addDays(today, REVIEW_INTERVALS[0]), lapses: 0 };
}

/**
 * Correct → advance one stage (1 → 3 → 7 → 14 → 30 days, then graduate).
 * Wrong → back to the start: the concept returns tomorrow.
 */
export function scheduleReview(prev: ReviewState, correct: boolean, today: ISODate): ReviewState {
  if (!correct) return { stage: 0, dueOn: addDays(today, REVIEW_INTERVALS[0]), lapses: prev.lapses + 1 };
  const stage = prev.stage + 1;
  if (stage >= REVIEW_INTERVALS.length) return { stage, dueOn: null, lapses: prev.lapses };
  return { stage, dueOn: addDays(today, REVIEW_INTERVALS[stage]), lapses: prev.lapses };
}

/* ──────────────────────────── Skills ──────────────────────────── */

/**
 * Applies a raw gain with diminishing returns: progress is easy at the start
 * and slows as a skill approaches mastery. Scores stay within 0–100.
 */
export function applySkillGain(score: number, rawGain: number): { score: number; delta: number } {
  const factor = Math.max(0.2, 1 - score / 125);
  const delta = Math.max(rawGain > 0 ? 1 : 0, Math.round(rawGain * factor));
  const next = Math.min(100, score + delta);
  return { score: next, delta: next - score };
}

/** Raw skill gains per activity, before diminishing returns. */
export const SKILL_GAINS = {
  lesson: 2,
  exercise: (score: number) => Math.round(score / 30), // 0–3
  quiz: (correct: number, total: number) => (total ? Math.round((correct / total) * 2) : 0),
  action: { difficult: 2, normal: 3, good: 4, excellent: 5 } as Record<string, number>,
  reflection: 1,
  practice: (score: number) => Math.round(score / 25), // 0–4
} as const;

/** Self-rating 1–5 plus experience level → starting score. */
export function baselineScore(selfRating: number | undefined, level: "beginner" | "intermediate" | "advanced"): number {
  const levelBase = level === "advanced" ? 50 : level === "intermediate" ? 35 : 20;
  const rating = selfRating ?? 3;
  return Math.max(5, Math.min(70, levelBase + (rating - 3) * 6));
}

/** Exercise XP scales with quality: showing up earns something, doing it well earns the full amount. */
export function scaledXp(base: number, score: number): number {
  return Math.max(10, Math.round(base * (0.4 + 0.6 * Math.max(0, Math.min(100, score)) / 100)));
}
