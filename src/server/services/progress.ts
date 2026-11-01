/**
 * Progress read models (profile, weekly review, 30/60/90 checkpoints) and the
 * write side of reviews.
 */
import { and, asc, desc, eq, gte, lte, sql } from "drizzle-orm";
import { addDays, diffDays, type ISODate } from "@/lib/dates";
import type { Executor } from "@/server/db";
import {
  achievements,
  assessmentAnswers,
  assessments,
  dailyActionAttempts,
  exerciseAttempts,
  lessonProgress,
  profiles,
  reflections,
  skillProgress,
  skills,
  userAchievements,
  weeklyReviews,
  xpTransactions,
} from "@/server/db/schema";
import { SELF_RATINGS } from "@/server/db/seed/base";
import type { NextFocus, SkillDelta, WeeklyStats } from "@/server/db/types";
import { FREQUENCY_DAYS } from "@/server/engine/plan";
import { levelForXp, XP } from "@/server/engine/progression";
import { NotFoundError, ValidationError } from "@/server/errors";
import { getSkillScores } from "./insights";
import { getAssessmentQuestions, selfRatingSummary } from "./onboarding";
import { reviewableWeek, weeklyReviewDue } from "./home";
import { recordActivity } from "./rewards";
import { type ActivePlan, getStreak, trainingDays } from "./training";

/* ─────────────────────────── Totals ─────────────────────────── */

async function first(query: Promise<{ n: number }[]>): Promise<number> {
  const [row] = await query;
  return Number(row?.n ?? 0);
}

export async function getTotals(db: Executor, userId: string, range?: { from: ISODate; to: ISODate }) {
  const n = sql<number>`count(*)::int`;
  const lessonsWhere = range
    ? and(eq(lessonProgress.userId, userId), eq(lessonProgress.status, "completed"), gte(lessonProgress.completedOn, range.from), lte(lessonProgress.completedOn, range.to))
    : and(eq(lessonProgress.userId, userId), eq(lessonProgress.status, "completed"));
  const actionsWhere = range
    ? and(eq(dailyActionAttempts.userId, userId), eq(dailyActionAttempts.status, "done"), gte(dailyActionAttempts.actionDate, range.from), lte(dailyActionAttempts.actionDate, range.to))
    : and(eq(dailyActionAttempts.userId, userId), eq(dailyActionAttempts.status, "done"));

  const [lessons, actions, exercisesDone, reflectionsCount, lessonSeconds, exerciseSeconds, xp] = await Promise.all([
    first(db.select({ n }).from(lessonProgress).where(lessonsWhere)),
    first(db.select({ n }).from(dailyActionAttempts).where(actionsWhere)),
    first(db
        .select({ n })
        .from(exerciseAttempts)
        .where(range ? and(eq(exerciseAttempts.userId, userId), gte(exerciseAttempts.createdAt, new Date(`${range.from}T00:00:00Z`))) : eq(exerciseAttempts.userId, userId)),
    ),
    first(db.select({ n }).from(reflections).where(eq(reflections.userId, userId))),
    first(db.select({ n: sql<number>`coalesce(sum(${lessonProgress.timeSpentSeconds}),0)::int` }).from(lessonProgress).where(eq(lessonProgress.userId, userId))),
    first(db.select({ n: sql<number>`coalesce(sum(${exerciseAttempts.durationSeconds}),0)::int` }).from(exerciseAttempts).where(eq(exerciseAttempts.userId, userId))),
    first(db
        .select({ n: sql<number>`coalesce(sum(${xpTransactions.amount}),0)::int` })
        .from(xpTransactions)
        .where(range ? and(eq(xpTransactions.userId, userId), gte(xpTransactions.activityDate, range.from), lte(xpTransactions.activityDate, range.to)) : eq(xpTransactions.userId, userId)),
    ),
  ]);
  return { lessons, actions, exercises: exercisesDone, reflections: reflectionsCount, minutes: Math.ceil((lessonSeconds + exerciseSeconds) / 60), xp };
}

/* ─────────────────────────── Profile ─────────────────────────── */

export async function getSkillHistory(db: Executor, userId: string) {
  const rows = await db
    .select({ key: skills.key, day: skillProgress.activityDate, score: sql<number>`max(${skillProgress.scoreAfter})::int` })
    .from(skillProgress)
    .innerJoin(skills, eq(skills.id, skillProgress.skillId))
    .where(eq(skillProgress.userId, userId))
    .groupBy(skills.key, skillProgress.activityDate)
    .orderBy(asc(skillProgress.activityDate));
  const series = new Map<string, { day: ISODate; score: number }[]>();
  for (const r of rows) {
    const list = series.get(r.key) ?? [];
    list.push({ day: r.day, score: Number(r.score) });
    series.set(r.key, list);
  }
  return series;
}

const XP_LABELS: Record<string, string> = {
  onboarding_completed: "Built your plan",
  lesson_completed: "Lesson completed",
  exercise_completed: "Exercise",
  quiz_completed: "Knowledge check",
  action_completed: "Mission completed",
  reflection_completed: "Reflection",
  review_completed: "Concept review",
  practice_completed: "Practice session",
  weekly_review_completed: "Weekly review",
  checkpoint_completed: "Checkpoint",
  achievement_earned: "Achievement",
};

export async function getProfileData(db: Executor, userId: string, today: ISODate) {
  const [[profile], streak, skillRows, history, totals, allAchievements, earned, recent, days] = await Promise.all([
    db.select().from(profiles).where(eq(profiles.userId, userId)),
    getStreak(db, userId, today),
    getSkillScores(db, userId),
    getSkillHistory(db, userId),
    getTotals(db, userId),
    db.select().from(achievements).orderBy(asc(achievements.order)),
    db.select({ id: userAchievements.achievementId, earnedAt: userAchievements.earnedAt }).from(userAchievements).where(eq(userAchievements.userId, userId)),
    db
      .select({ reason: xpTransactions.reason, amount: xpTransactions.amount, day: xpTransactions.activityDate, createdAt: xpTransactions.createdAt })
      .from(xpTransactions)
      .where(eq(xpTransactions.userId, userId))
      .orderBy(desc(xpTransactions.createdAt))
      .limit(12),
    trainingDays(db, userId, "2000-01-01", today),
  ]);
  const earnedIds = new Map(earned.map((e) => [e.id, e.earnedAt]));
  const totalXp = profile?.totalXp ?? 0;
  return {
    profile,
    level: levelForXp(totalXp),
    totalXp,
    streak,
    skills: skillRows.map((s) => ({ ...s, history: history.get(s.key) ?? [] })),
    totals: { ...totals, daysTrained: days.length },
    achievements: allAchievements.map((a) => ({ key: a.key, title: a.title, description: a.description, earnedAt: earnedIds.get(a.id) ?? null })),
    history: recent.map((r) => ({ label: XP_LABELS[r.reason] ?? r.reason, amount: r.amount, day: r.day })),
  };
}

/* ─────────────────────────── Weekly review ─────────────────────────── */

async function skillDeltas(db: Executor, userId: string, from: ISODate, to: ISODate): Promise<SkillDelta[]> {
  const rows = await db
    .select({ key: skills.key, name: skills.name, delta: sql<number>`coalesce(sum(${skillProgress.delta}),0)::int` })
    .from(skills)
    .leftJoin(
      skillProgress,
      and(eq(skillProgress.skillId, skills.id), eq(skillProgress.userId, userId), gte(skillProgress.activityDate, from), lte(skillProgress.activityDate, to)),
    )
    .groupBy(skills.key, skills.name, skills.order)
    .orderBy(asc(skills.order));
  return rows.map((r) => ({ key: r.key, name: r.name, delta: Number(r.delta) }));
}

/** Stats for one plan week (the 7 days starting at weekStart). */
export async function computeWeeklyStats(db: Executor, userId: string, today: ISODate, plan: ActivePlan, weekStart: ISODate): Promise<{ stats: WeeklyStats; nextFocus: NextFocus }> {
  const from = weekStart;
  const to = addDays(weekStart, 6) < today ? addDays(weekStart, 6) : today;
  const [totals, days, streak, deltas] = await Promise.all([
    getTotals(db, userId, { from, to }),
    trainingDays(db, userId, from, to),
    getStreak(db, userId, today),
    skillDeltas(db, userId, from, to),
  ]);
  const target = FREQUENCY_DAYS[plan.frequency];
  const sorted = [...deltas].sort((a, b) => b.delta - a.delta);
  const strongest = sorted[0] && sorted[0].delta > 0 ? sorted[0] : null;
  // "Needs attention": the plan's primary skill or the weakest of the skills they're working on.
  const focusKeys = new Set([plan.primarySkill.key]);
  const candidates = deltas.filter((d) => focusKeys.has(d.key) && d.key !== strongest?.key);
  const needsAttention = (candidates.length ? candidates : sorted.slice(1)).sort((a, b) => a.delta - b.delta)[0] ?? null;

  const stats: WeeklyStats = {
    weekStart: from,
    weekEnd: to,
    lessonsCompleted: totals.lessons,
    lessonsTarget: target,
    actionsCompleted: totals.actions,
    actionsTarget: target,
    daysTrained: days.length,
    currentStreak: streak.current,
    minutesTrained: totals.minutes,
    xpEarned: totals.xp,
    strongestSkill: strongest,
    needsAttention,
  };
  const focus = needsAttention ?? { key: plan.primarySkill.key, name: plan.primarySkill.name, delta: 0 };
  const consistencyNote =
    days.length < target ? `You trained ${days.length} of ${target} planned days — protect the habit first: same time, every training day.` : "You hit your training target — keep the rhythm.";
  return {
    stats,
    nextFocus: {
      skillKey: focus.key,
      skillName: focus.name,
      headline: `Next week: ${focus.name.toLowerCase()}`,
      detail: `${consistencyNote} Add one ${focus.name.toLowerCase()} rep from the Practice tab on top of your daily lesson.`,
    },
  };
}

export async function saveWeeklyReview(db: Executor, userId: string, today: ISODate, plan: ActivePlan, reflection: string) {
  if (!(await weeklyReviewDue(db, userId, today, plan.startDate))) throw new ValidationError("Your next weekly review isn't open yet.");
  const { weekStart } = reviewableWeek(plan.startDate, today);
  const { stats, nextFocus } = await computeWeeklyStats(db, userId, today, plan, weekStart);
  const [row] = await db
    .insert(weeklyReviews)
    .values({ userId, weekStart, stats, reflection: reflection.trim().slice(0, 2000) || null, nextFocus })
    .onConflictDoNothing()
    .returning({ id: weeklyReviews.id });
  const reward = await recordActivity(db, userId, today, {
    reason: "weekly_review_completed",
    amount: XP.weeklyReview,
    key: `weekly:${plan.id}:${weekStart}`,
    sourceType: "weekly_review",
    sourceId: row?.id ?? null,
  });
  if (reflection.trim()) {
    await db.insert(reflections).values({ userId, kind: "weekly", answers: { text: reflection.trim().slice(0, 2000) } });
  }
  return { stats, nextFocus, reward };
}

export async function listWeeklyReviews(db: Executor, userId: string) {
  return db.select().from(weeklyReviews).where(eq(weeklyReviews.userId, userId)).orderBy(desc(weeklyReviews.weekStart)).limit(12);
}

/* ─────────────────────────── 30 / 60 / 90 checkpoints ─────────────────────────── */

export type CheckpointDay = 30 | 60 | 90;

export async function getCheckpointData(db: Executor, userId: string, day: CheckpointDay, today: ISODate, plan: ActivePlan) {
  const kind = `day_${day}` as const;
  const [questions, [baseline], [existing], skillRows, totals, streak, days] = await Promise.all([
    getAssessmentQuestions(db, kind),
    db.select().from(assessments).where(and(eq(assessments.userId, userId), eq(assessments.kind, "onboarding"))),
    db.select().from(assessments).where(and(eq(assessments.userId, userId), eq(assessments.kind, kind))),
    getSkillScores(db, userId),
    getTotals(db, userId),
    getStreak(db, userId, today),
    trainingDays(db, userId, plan.startDate, today),
  ]);
  return {
    day,
    available: diffDays(plan.startDate, today) + 1 > day,
    questions,
    completed: Boolean(existing?.completedAt),
    before: (baseline?.summary ?? {}) as Record<string, number>,
    now: (existing?.summary ?? null) as Record<string, number> | null,
    skills: skillRows,
    totals: { ...totals, daysTrained: days.length, longestStreak: streak.longest },
    ninetyDayGoal: plan.ninetyDayGoal,
    ratingPrompts: SELF_RATINGS.map((r) => ({ skill: r.skill, prompt: r.prompt })),
  };
}

export async function submitCheckpoint(db: Executor, userId: string, today: ISODate, day: CheckpointDay, plan: ActivePlan, values: Record<string, unknown>) {
  if (diffDays(plan.startDate, today) + 1 <= day) throw new ValidationError(`Your day-${day} checkpoint isn't open yet.`);
  const kind = `day_${day}` as const;
  const questions = await getAssessmentQuestions(db, kind);
  for (const q of questions) {
    const v = values[q.key];
    if (q.isRequired && (v === undefined || v === "")) throw new ValidationError("Answer every question.");
    if (q.type === "scale" && !["1", "2", "3", "4", "5"].includes(String(v))) throw new ValidationError("Ratings go from 1 to 5.");
  }
  const summary = selfRatingSummary(values);
  const [assessment] = await db
    .insert(assessments)
    .values({ userId, kind, completedAt: new Date(), summary })
    .onConflictDoUpdate({ target: [assessments.userId, assessments.kind], set: { completedAt: new Date(), summary } })
    .returning({ id: assessments.id });
  if (!assessment) throw new NotFoundError();
  for (const q of questions) {
    const v = values[q.key];
    if (v === undefined) continue;
    const value = q.type === "scale" ? Number(v) : String(v).slice(0, 2000);
    await db
      .insert(assessmentAnswers)
      .values({ assessmentId: assessment.id, questionId: q.id, value })
      .onConflictDoUpdate({ target: [assessmentAnswers.assessmentId, assessmentAnswers.questionId], set: { value } });
  }
  if (typeof values.checkpoint_change === "string" && values.checkpoint_change.trim()) {
    await db.insert(reflections).values({ userId, kind: "checkpoint", answers: { text: values.checkpoint_change.trim().slice(0, 2000) } });
  }
  return recordActivity(db, userId, today, {
    reason: "checkpoint_completed",
    amount: XP.checkpoint,
    key: `checkpoint:${day}`,
    sourceType: "assessment",
    sourceId: assessment.id,
  });
}
