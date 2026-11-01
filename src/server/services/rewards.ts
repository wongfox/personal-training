/**
 * The single entry point for "the learner did something that counts":
 * XP (idempotent), level, training-day streak, skill score and achievements.
 * Always called inside the same transaction as the activity it rewards.
 */
import { and, eq, sql } from "drizzle-orm";
import type { ISODate } from "@/lib/dates";
import type { Executor } from "@/server/db";
import {
  achievements,
  profiles,
  skillProgress,
  skills,
  streaks,
  userAchievements,
  userSkills,
  xpTransactions,
} from "@/server/db/schema";
import { applySkillGain, applyTrainingDay, levelForXp, type StreakEvent } from "@/server/engine/progression";

type XpReason = (typeof xpTransactions.$inferInsert)["reason"];

/** Admin-like rituals and bonuses earn XP but don't count as a training day (no streak farming). */
const NON_TRAINING: XpReason[] = [
  "onboarding_completed",
  "achievement_earned",
  "weekly_review_completed",
  "checkpoint_completed",
  "review_completed",
  "reflection_completed",
];

export interface ActivityInput {
  reason: XpReason;
  amount: number;
  /** Unique per user; a repeated key awards nothing. */
  key: string;
  sourceType?: string;
  sourceId?: string | null;
  skillKey?: string | null;
  skillGain?: number;
  /** Override whether this counts as a training day (e.g. a low-effort practice rep doesn't). */
  countsAsTraining?: boolean;
}

export interface ActivityResult {
  awarded: boolean;
  xp: number;
  totalXp: number;
  streak: { current: number; longest: number; event: StreakEvent | null; lost: number };
  levelUp: { level: number; name: string } | null;
  skill: { key: string; name: string; score: number; delta: number } | null;
  achievements: { key: string; title: string }[];
}

export const ACHIEVEMENTS = [
  { key: "first_step", title: "First step", description: "Complete your first lesson.", xpReward: 20 },
  { key: "out_in_the_world", title: "Out in the world", description: "Complete your first real-world mission.", xpReward: 30 },
  { key: "three_in_a_row", title: "Three in a row", description: "Train three days in a row.", xpReward: 30 },
  { key: "full_week", title: "Full week", description: "Train seven days in a row.", xpReward: 70 },
  { key: "rehearsal", title: "Rehearsal", description: "Finish your first practice session.", xpReward: 20 },
  { key: "reflective", title: "Reflective", description: "Write five reflections.", xpReward: 40 },
  { key: "ten_missions", title: "Ten missions", description: "Complete ten real-world missions.", xpReward: 100 },
  { key: "it_sticks", title: "It sticks", description: "Answer ten spaced reviews.", xpReward: 40 },
  { key: "thirty_days", title: "Thirty days", description: "Train thirty days in a row.", xpReward: 250 },
] as const;

function earned(counts: Partial<Record<XpReason, number>>, streak: number): string[] {
  const out: string[] = [];
  if ((counts.lesson_completed ?? 0) >= 1) out.push("first_step");
  if ((counts.action_completed ?? 0) >= 1) out.push("out_in_the_world");
  if (streak >= 3) out.push("three_in_a_row");
  if (streak >= 7) out.push("full_week");
  if (streak >= 30) out.push("thirty_days");
  if ((counts.practice_completed ?? 0) >= 1) out.push("rehearsal");
  if ((counts.reflection_completed ?? 0) >= 5) out.push("reflective");
  if ((counts.action_completed ?? 0) >= 10) out.push("ten_missions");
  if ((counts.review_completed ?? 0) >= 10) out.push("it_sticks");
  return out;
}

async function addXp(db: Executor, userId: string, amount: number): Promise<number> {
  const [row] = await db
    .update(profiles)
    .set({ totalXp: sql`${profiles.totalXp} + ${amount}` })
    .where(eq(profiles.userId, userId))
    .returning({ totalXp: profiles.totalXp });
  return row?.totalXp ?? 0;
}

export async function recordActivity(
  db: Executor,
  userId: string,
  today: ISODate,
  input: ActivityInput,
): Promise<ActivityResult> {
  const training = input.countsAsTraining ?? !NON_TRAINING.includes(input.reason);
  const inserted = await db
    .insert(xpTransactions)
    .values({
      userId,
      amount: input.amount,
      reason: input.reason,
      sourceType: input.sourceType ?? null,
      sourceId: input.sourceId ?? null,
      idempotencyKey: input.key,
      countsAsTraining: training,
      activityDate: today,
    })
    .onConflictDoNothing()
    .returning({ id: xpTransactions.id });

  const [streakRow] = await db.select().from(streaks).where(eq(streaks.userId, userId));
  const result: ActivityResult = {
    awarded: inserted.length > 0,
    xp: 0,
    totalXp: 0,
    streak: { current: streakRow?.current ?? 0, longest: streakRow?.longest ?? 0, event: null, lost: 0 },
    levelUp: null,
    skill: null,
    achievements: [],
  };
  if (!result.awarded) {
    const [p] = await db.select({ totalXp: profiles.totalXp }).from(profiles).where(eq(profiles.userId, userId));
    result.totalXp = p?.totalXp ?? 0;
    return result;
  }

  // XP and level
  const before = levelForXp((await db.select({ t: profiles.totalXp }).from(profiles).where(eq(profiles.userId, userId)))[0]?.t ?? 0);
  result.xp = input.amount;
  result.totalXp = await addXp(db, userId, input.amount);

  // Training-day streak
  if (training) {
    const next = applyTrainingDay(
      { current: streakRow?.current ?? 0, longest: streakRow?.longest ?? 0, lastActiveDate: streakRow?.lastActiveDate ?? null },
      today,
    );
    if (next.event !== "same_day" && next.event !== "past") {
      await db
        .insert(streaks)
        .values({ userId, current: next.current, longest: next.longest, lastActiveDate: next.lastActiveDate })
        .onConflictDoUpdate({
          target: streaks.userId,
          set: { current: next.current, longest: next.longest, lastActiveDate: next.lastActiveDate },
        });
    }
    result.streak = { current: next.current, longest: next.longest, event: next.event, lost: next.lost };
  }

  // Skill score
  if (input.skillKey && input.skillGain && input.skillGain > 0) {
    const [skill] = await db.select().from(skills).where(eq(skills.key, input.skillKey));
    if (skill) {
      const [us] = await db
        .select()
        .from(userSkills)
        .where(and(eq(userSkills.userId, userId), eq(userSkills.skillId, skill.id)));
      const current = us?.score ?? 20;
      const gain = applySkillGain(current, input.skillGain);
      await db
        .insert(userSkills)
        .values({ userId, skillId: skill.id, baseline: us?.baseline ?? 20, score: gain.score })
        .onConflictDoUpdate({ target: [userSkills.userId, userSkills.skillId], set: { score: gain.score } });
      if (gain.delta > 0) {
        await db.insert(skillProgress).values({
          userId,
          skillId: skill.id,
          delta: gain.delta,
          scoreAfter: gain.score,
          sourceType: input.reason,
          sourceId: input.sourceId ?? null,
          activityDate: today,
        });
      }
      result.skill = { key: skill.key, name: skill.name, score: gain.score, delta: gain.delta };
    }
  }

  // Achievements
  const countRows = await db
    .select({ reason: xpTransactions.reason, n: sql<number>`count(*)::int` })
    .from(xpTransactions)
    .where(eq(xpTransactions.userId, userId))
    .groupBy(xpTransactions.reason);
  const counts = Object.fromEntries(countRows.map((r) => [r.reason, Number(r.n)])) as Partial<Record<XpReason, number>>;
  const owned = new Set(
    (
      await db
        .select({ key: achievements.key })
        .from(userAchievements)
        .innerJoin(achievements, eq(achievements.id, userAchievements.achievementId))
        .where(eq(userAchievements.userId, userId))
    ).map((r) => r.key),
  );
  for (const key of earned(counts, result.streak.current)) {
    if (owned.has(key)) continue;
    const [ach] = await db.select().from(achievements).where(eq(achievements.key, key));
    if (!ach) continue;
    await db.insert(userAchievements).values({ userId, achievementId: ach.id }).onConflictDoNothing();
    if (ach.xpReward > 0) {
      const bonus = await db
        .insert(xpTransactions)
        .values({
          userId,
          amount: ach.xpReward,
          reason: "achievement_earned",
          sourceType: "achievement",
          sourceId: ach.id,
          idempotencyKey: `achievement:${key}`,
          activityDate: today,
        })
        .onConflictDoNothing()
        .returning({ id: xpTransactions.id });
      if (bonus.length) {
        result.totalXp = await addXp(db, userId, ach.xpReward);
        result.xp += ach.xpReward;
      }
    }
    result.achievements.push({ key, title: ach.title });
  }

  const after = levelForXp(result.totalXp);
  if (after.level > before.level) result.levelUp = { level: after.level, name: after.name };
  return result;
}

/** Merges several activity results from one user action into a single summary. */
export function mergeResults(results: ActivityResult[]): ActivityResult | null {
  if (results.length === 0) return null;
  const last = results[results.length - 1];
  return {
    awarded: results.some((r) => r.awarded),
    xp: results.reduce((s, r) => s + r.xp, 0),
    totalXp: last.totalXp,
    streak: results.find((r) => r.streak.event && r.streak.event !== "same_day")?.streak ?? last.streak,
    levelUp: results.find((r) => r.levelUp)?.levelUp ?? null,
    skill: [...results].reverse().find((r) => r.skill)?.skill ?? null,
    achievements: results.flatMap((r) => r.achievements),
  };
}
