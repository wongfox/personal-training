import { and, eq, gte } from "drizzle-orm";
import { addDays, diffDays, type ISODate } from "@/lib/dates";
import type { Executor } from "@/server/db";
import { assessments, profiles, weeklyReviews, xpTransactions } from "@/server/db/schema";
import { FREQUENCY_DAYS } from "@/server/engine/plan";
import { levelForXp } from "@/server/engine/progression";
import { getRoadmapView, masteryRepFor } from "./catalog";
import { getCoachInsight } from "./insights";
import {
  countDueReviews,
  getActivePlan,
  getJourneyOutline,
  getMissionForLesson,
  getMissionOn,
  getOpenMissions,
  getStreak,
  getWeek,
} from "./training";

export const CHECKPOINT_DAYS = [30, 60, 90] as const;

export async function dueCheckpoint(db: Executor, userId: string, dayNumber: number): Promise<30 | 60 | 90 | null> {
  const done = new Set(
    (await db.select({ kind: assessments.kind }).from(assessments).where(eq(assessments.userId, userId))).map((a) => a.kind),
  );
  for (const d of [...CHECKPOINT_DAYS].reverse()) {
    if (dayNumber > d && !done.has(`day_${d}`)) return d;
  }
  return null;
}

/**
 * Plan weeks are fixed 7-day blocks counted from the plan's start. A week can
 * be reviewed once it has fully elapsed (from its 7th day on), exactly once.
 */
export function reviewableWeek(startDate: ISODate, today: ISODate): { index: number; weekStart: ISODate; nextOpensOn: ISODate } {
  const completedWeeks = Math.floor((diffDays(startDate, today) + 1) / 7);
  return {
    index: completedWeeks,
    weekStart: addDays(startDate, Math.max(0, completedWeeks - 1) * 7),
    nextOpensOn: addDays(startDate, completedWeeks * 7 + 6),
  };
}

export async function weeklyReviewDue(db: Executor, userId: string, today: ISODate, startDate: ISODate): Promise<boolean> {
  const week = reviewableWeek(startDate, today);
  if (week.index < 1) return false;
  const [done] = await db
    .select({ id: weeklyReviews.id })
    .from(weeklyReviews)
    .where(and(eq(weeklyReviews.userId, userId), gte(weeklyReviews.weekStart, week.weekStart)));
  return !done;
}

export async function getHomeData(db: Executor, userId: string, today: ISODate) {
  const plan = await getActivePlan(db, userId);
  if (!plan) return null;

  const [outline, streak, week, dueReviews, openMissions, [profile]] = await Promise.all([
    plan.journeyId ? getJourneyOutline(db, userId, plan.journeyId, today) : Promise.resolve(null),
    getStreak(db, userId, today),
    getWeek(db, userId, today, plan.startDate),
    countDueReviews(db, userId, today),
    getOpenMissions(db, userId),
    db.select({ totalXp: profiles.totalXp }).from(profiles).where(eq(profiles.userId, userId)),
  ]);

  const dayNumber = Math.max(1, diffDays(plan.startDate, today) + 1);
  const todayLesson = outline?.todayLesson ?? null;
  const doneLesson = outline?.doneTodayLesson ?? null;
  const missionPreview = todayLesson ? await getMissionForLesson(db, todayLesson.id) : null;
  const todaysMission = openMissions.find((m) => m.actionDate === today) ?? (await getMissionOn(db, userId, today));
  const pendingMission = openMissions.find((m) => m.actionDate < today && m.status !== "not_yet") ?? openMissions.find((m) => m.actionDate < today) ?? null;

  // Current journey finished: continue with the next unfinished roadmap journey, or —
  // once every journey is done — the mastery block serves one practice rep a day.
  let masteryRep: (Awaited<ReturnType<typeof masteryRepFor>> & { done: boolean }) | null = null;
  let continueJourney: { id: string; title: string } | null = null;
  if (!todayLesson && !doneLesson && outline?.journeyComplete) {
    const roadmap = await getRoadmapView(db, userId, plan);
    const next = roadmap.stages.find((s) => s.status !== "done" && s.id !== plan.journeyId);
    if (next) continueJourney = { id: next.id, title: next.title };
    else {
      const rep = await masteryRepFor(db, plan.primarySkill.key, dayNumber);
      if (rep) {
        const [doneToday] = await db
          .select({ id: xpTransactions.id })
          .from(xpTransactions)
          .where(and(eq(xpTransactions.userId, userId), eq(xpTransactions.idempotencyKey, `practice:${rep.id}:${today}`)));
        masteryRep = { ...rep, done: Boolean(doneToday) };
      }
    }
  }

  const [insight, checkpoint, weeklyDue] = await Promise.all([
    getCoachInsight(db, userId, today, plan, outline, streak.current),
    dueCheckpoint(db, userId, dayNumber),
    weeklyReviewDue(db, userId, today, plan.startDate),
  ]);

  return {
    plan,
    dayNumber,
    outline,
    todayLesson,
    doneLesson,
    nextLesson: outline?.nextLesson ?? null,
    journeyComplete: outline?.journeyComplete ?? false,
    masteryRep,
    continueJourney,
    missionPreview,
    todaysMission,
    pendingMission,
    streak,
    week: { ...week, target: FREQUENCY_DAYS[plan.frequency] },
    dueReviews,
    level: levelForXp(profile?.totalXp ?? 0),
    totalXp: profile?.totalXp ?? 0,
    insight,
    checkpoint,
    weeklyDue,
  };
}

export type HomeData = NonNullable<Awaited<ReturnType<typeof getHomeData>>>;
