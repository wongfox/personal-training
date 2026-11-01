/**
 * Read models for the learner's plan, journey and today's training.
 */
import { and, asc, desc, eq, inArray, isNotNull, lte, notInArray, sql } from "drizzle-orm";
import { addDays, type ISODate, startOfWeek } from "@/lib/dates";
import type { Executor } from "@/server/db";
import {
  dailyActionAttempts,
  dailyActions,
  goals,
  growthPlans,
  journeyModules,
  journeys,
  lessonProgress,
  lessons,
  reviewItems,
  skills,
  streaks,
  userGoals,
  xpTransactions,
} from "@/server/db/schema";
import { visibleStreak } from "@/server/engine/progression";
import { type LessonProgressRef, type LessonState, resolveToday } from "@/server/engine/today";

export async function getActivePlan(db: Executor, userId: string) {
  const [plan] = await db
    .select({
      id: growthPlans.id,
      title: growthPlans.title,
      journeyId: growthPlans.journeyId,
      level: growthPlans.level,
      dailyMinutes: growthPlans.dailyMinutes,
      frequency: growthPlans.frequency,
      durationDays: growthPlans.durationDays,
      startDate: growthPlans.startDate,
      situations: growthPlans.situations,
      mainChallenge: growthPlans.mainChallenge,
      ninetyDayGoal: growthPlans.ninetyDayGoal,
      primaryGoalKey: goals.key,
      primaryGoalName: goals.name,
      primarySkillId: goals.skillId,
    })
    .from(growthPlans)
    .innerJoin(goals, eq(goals.id, growthPlans.primaryGoalId))
    .where(and(eq(growthPlans.userId, userId), eq(growthPlans.status, "active")))
    .orderBy(desc(growthPlans.createdAt))
    .limit(1);
  if (!plan) return null;

  const secondary = await db
    .select({ key: goals.key, name: goals.name })
    .from(userGoals)
    .innerJoin(goals, eq(goals.id, userGoals.goalId))
    .where(and(eq(userGoals.userId, userId), eq(userGoals.priority, "secondary")))
    .orderBy(asc(goals.order));

  const [primarySkill] = plan.primarySkillId
    ? await db.select({ key: skills.key, name: skills.name }).from(skills).where(eq(skills.id, plan.primarySkillId))
    : [];

  return { ...plan, secondaryGoals: secondary, primarySkill: primarySkill ?? { key: "communication", name: "Communication" } };
}

export type ActivePlan = NonNullable<Awaited<ReturnType<typeof getActivePlan>>>;

export interface OutlineLesson {
  id: string;
  slug: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  category: string;
  state: LessonState;
  started: boolean;
}

export interface OutlineModule {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  lessons: OutlineLesson[];
  completed: number;
}

export async function getJourneyOutline(db: Executor, userId: string, journeyId: string, today: ISODate) {
  const [journey] = await db.select().from(journeys).where(eq(journeys.id, journeyId));
  if (!journey) return null;

  const rows = await db
    .select({
      moduleId: journeyModules.id,
      moduleTitle: journeyModules.title,
      moduleDescription: journeyModules.description,
      moduleOrder: journeyModules.order,
      id: lessons.id,
      slug: lessons.slug,
      title: lessons.title,
      description: lessons.description,
      estimatedMinutes: lessons.estimatedMinutes,
      category: lessons.category,
    })
    .from(journeyModules)
    .innerJoin(lessons, eq(lessons.moduleId, journeyModules.id))
    .where(
      and(eq(journeyModules.journeyId, journeyId), eq(journeyModules.status, "published"), eq(lessons.status, "published")),
    )
    .orderBy(asc(journeyModules.order), asc(lessons.order));

  const ids = rows.map((r) => r.id);
  const progressRows = ids.length
    ? await db
        .select({
          lessonId: lessonProgress.lessonId,
          status: lessonProgress.status,
          completedOn: lessonProgress.completedOn,
          currentStep: lessonProgress.currentStep,
        })
        .from(lessonProgress)
        .where(and(eq(lessonProgress.userId, userId), inArray(lessonProgress.lessonId, ids)))
    : [];
  const progress = new Map<string, LessonProgressRef>(progressRows.map((p) => [p.lessonId, p]));
  const resolution = resolveToday(ids, progress, today);

  const modules: OutlineModule[] = [];
  for (const r of rows) {
    let mod = modules.find((m) => m.id === r.moduleId);
    if (!mod) {
      mod = { id: r.moduleId, title: r.moduleTitle, description: r.moduleDescription, estimatedMinutes: 0, lessons: [], completed: 0 };
      modules.push(mod);
    }
    const state = resolution.states.get(r.id) ?? "locked";
    mod.lessons.push({
      id: r.id,
      slug: r.slug,
      title: r.title,
      description: r.description,
      estimatedMinutes: r.estimatedMinutes,
      category: r.category,
      state,
      started: progress.get(r.id)?.status === "in_progress",
    });
    mod.estimatedMinutes += r.estimatedMinutes;
    if (state === "completed") mod.completed += 1;
  }

  const completed = modules.reduce((s, m) => s + m.completed, 0);
  const lessonById = new Map(modules.flatMap((m) => m.lessons.map((l) => [l.id, { ...l, moduleTitle: m.title }] as const)));
  return {
    journey,
    modules,
    completed,
    total: ids.length,
    percent: ids.length ? Math.round((completed / ids.length) * 100) : 0,
    todayLesson: resolution.todayLessonId ? lessonById.get(resolution.todayLessonId)! : null,
    doneTodayLesson: resolution.doneTodayLessonId ? lessonById.get(resolution.doneTodayLessonId)! : null,
    nextLesson: resolution.nextLessonId ? lessonById.get(resolution.nextLessonId)! : null,
    journeyComplete: resolution.journeyComplete,
  };
}

export type JourneyOutline = NonNullable<Awaited<ReturnType<typeof getJourneyOutline>>>;

/** Distinct training days (any XP-earning training activity) between two dates. */
export async function trainingDays(db: Executor, userId: string, from: ISODate, to: ISODate): Promise<ISODate[]> {
  const rows = await db
    .selectDistinct({ day: xpTransactions.activityDate })
    .from(xpTransactions)
    .where(
      and(
        eq(xpTransactions.userId, userId),
        sql`${xpTransactions.activityDate} between ${from} and ${to}`,
        notInArray(xpTransactions.reason, ["onboarding_completed", "achievement_earned"]),
      ),
    );
  return rows.map((r) => r.day).sort();
}

export async function getStreak(db: Executor, userId: string, today: ISODate) {
  const [row] = await db.select().from(streaks).where(eq(streaks.userId, userId));
  const state = { current: row?.current ?? 0, longest: row?.longest ?? 0, lastActiveDate: row?.lastActiveDate ?? null };
  return { ...visibleStreak(state, today), longest: state.longest, trainedToday: state.lastActiveDate === today };
}

export async function getWeek(db: Executor, userId: string, today: ISODate) {
  const monday = startOfWeek(today);
  const sunday = addDays(monday, 6);
  const days = await trainingDays(db, userId, monday, sunday);
  return { monday, sunday, days, count: days.length };
}

export async function countDueReviews(db: Executor, userId: string, today: ISODate): Promise<number> {
  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(reviewItems)
    .where(and(eq(reviewItems.userId, userId), isNotNull(reviewItems.dueOn), lte(reviewItems.dueOn, today)));
  return Number(row?.n ?? 0);
}

/** Missions: today's committed one plus any earlier ones still awaiting a check-in. */
export async function getOpenMissions(db: Executor, userId: string) {
  return db
    .select({
      attemptId: dailyActionAttempts.id,
      actionDate: dailyActionAttempts.actionDate,
      status: dailyActionAttempts.status,
      outcome: dailyActionAttempts.outcome,
      title: dailyActions.title,
      description: dailyActions.description,
      estimatedMinutes: dailyActions.estimatedMinutes,
      difficulty: dailyActions.difficulty,
      lessonId: dailyActions.lessonId,
    })
    .from(dailyActionAttempts)
    .innerJoin(dailyActions, eq(dailyActions.id, dailyActionAttempts.dailyActionId))
    .where(and(eq(dailyActionAttempts.userId, userId), inArray(dailyActionAttempts.status, ["committed", "not_yet"])))
    .orderBy(desc(dailyActionAttempts.actionDate))
    .limit(5);
}

/** The mission assigned on a given day, whatever its status. */
export async function getMissionOn(db: Executor, userId: string, day: ISODate) {
  const [row] = await db
    .select({
      attemptId: dailyActionAttempts.id,
      actionDate: dailyActionAttempts.actionDate,
      status: dailyActionAttempts.status,
      outcome: dailyActionAttempts.outcome,
      title: dailyActions.title,
      description: dailyActions.description,
      estimatedMinutes: dailyActions.estimatedMinutes,
      difficulty: dailyActions.difficulty,
      lessonId: dailyActions.lessonId,
    })
    .from(dailyActionAttempts)
    .innerJoin(dailyActions, eq(dailyActions.id, dailyActionAttempts.dailyActionId))
    .where(and(eq(dailyActionAttempts.userId, userId), eq(dailyActionAttempts.actionDate, day)))
    .orderBy(desc(dailyActionAttempts.createdAt))
    .limit(1);
  return row ?? null;
}

export async function getMissionForLesson(db: Executor, lessonId: string) {
  const [row] = await db.select().from(dailyActions).where(eq(dailyActions.lessonId, lessonId));
  return row ?? null;
}
