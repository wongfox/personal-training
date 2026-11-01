/**
 * Gathers the signals the feedback engine needs and returns the coach's read.
 */
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { addDays, diffDays, type ISODate } from "@/lib/dates";
import type { Executor } from "@/server/db";
import {
  dailyActionAttempts,
  dailyActions,
  exerciseAttempts,
  lessonProgress,
  reflections,
  skills,
  userSkills,
} from "@/server/db/schema";
import { buildCoachInsight, type CoachInsight } from "@/server/engine/coach-insight";
import { FREQUENCY_DAYS } from "@/server/engine/plan";
import type { ActivePlan, JourneyOutline } from "./training";
import { trainingDays } from "./training";

export async function getSkillScores(db: Executor, userId: string) {
  return db
    .select({ key: skills.key, name: skills.name, score: userSkills.score, baseline: userSkills.baseline })
    .from(userSkills)
    .innerJoin(skills, eq(skills.id, userSkills.skillId))
    .where(eq(userSkills.userId, userId))
    .orderBy(skills.order);
}

export async function countCompletedLessons(db: Executor, userId: string): Promise<number> {
  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(lessonProgress)
    .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.status, "completed")));
  return Number(row?.n ?? 0);
}

export async function getCoachInsight(
  db: Executor,
  userId: string,
  today: ISODate,
  plan: ActivePlan,
  outline: JourneyOutline | null,
  streak: number,
): Promise<CoachInsight> {
  const since = addDays(today, -14);
  const [skillRows, actionRows, reflectionRows, exerciseRows, days, lessonsCompleted] = await Promise.all([
    getSkillScores(db, userId),
    db
      .select({ status: dailyActionAttempts.status, outcome: dailyActionAttempts.outcome, title: dailyActions.title })
      .from(dailyActionAttempts)
      .innerJoin(dailyActions, eq(dailyActions.id, dailyActionAttempts.dailyActionId))
      .where(and(eq(dailyActionAttempts.userId, userId), gte(dailyActionAttempts.actionDate, since), sql`${dailyActionAttempts.actionDate} < ${today}`))
      .orderBy(desc(dailyActionAttempts.actionDate))
      .limit(10),
    db
      .select({ answers: reflections.answers })
      .from(reflections)
      .where(eq(reflections.userId, userId))
      .orderBy(desc(reflections.createdAt))
      .limit(5),
    db
      .select({ score: exerciseAttempts.score, feedback: exerciseAttempts.feedback })
      .from(exerciseAttempts)
      .where(eq(exerciseAttempts.userId, userId))
      .orderBy(desc(exerciseAttempts.createdAt))
      .limit(8),
    trainingDays(db, userId, addDays(today, -6), today),
    countCompletedLessons(db, userId),
  ]);

  const nextLesson = outline?.doneTodayLesson ? outline.nextLesson : null;
  return buildCoachInsight({
    primarySkill: plan.primarySkill,
    skills: skillRows,
    actions: actionRows,
    reflections: reflectionRows.map((r) => Object.values(r.answers).filter(Boolean).join(" ")),
    exercises: exerciseRows.map((e) => ({ score: e.score, dimensions: e.feedback.dimensions, flaggedCount: e.feedback.flagged?.length ?? 0 })),
    daysTrainedLast7: days.length,
    weeklyTarget: FREQUENCY_DAYS[plan.frequency],
    daysInPlan: diffDays(plan.startDate, today) + 1,
    streak,
    lessonsCompleted,
    next: nextLesson ? { title: nextLesson.title, skillName: plan.primarySkill.name } : null,
  });
}
