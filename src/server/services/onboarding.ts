import { and, asc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import type { ISODate } from "@/lib/dates";
import { GOALS, SKILLS, type GoalKey, type SkillKey } from "@/lib/taxonomy";
import type { Executor } from "@/server/db";
import {
  assessmentAnswers,
  assessmentQuestions,
  assessments,
  goals,
  growthPlans,
  journeys,
  profiles,
  skillProgress,
  skills,
  userGoals,
  userJourneys,
  userSkills,
} from "@/server/db/schema";
import { SELF_RATINGS } from "@/server/db/seed/base";
import { baselineScore, XP } from "@/server/engine/progression";
import { buildPlan, buildRoadmap, type OnboardingAnswers } from "@/server/engine/plan";
import { ValidationError } from "@/server/errors";
import { recordActivity } from "./rewards";

const goalKeys = GOALS.map((g) => g.key) as [GoalKey, ...GoalKey[]];
const rating = z.coerce.number().int().min(1).max(5);

export const onboardingSchema = z
  .object({
    goals: z.array(z.enum(goalKeys)).min(1, "Pick at least one goal.").max(10),
    primary_goal: z.enum(goalKeys),
    situations: z.array(z.string().max(40)).min(1, "Pick at least one situation.").max(10),
    level: z.enum(["beginner", "intermediate", "advanced"]),
    minutes: z.coerce.number().refine((n) => [5, 10, 15, 30].includes(n), "Pick a duration."),
    frequency: z.enum(["daily", "five_per_week", "three_per_week"]),
    challenge: z.string().min(1).max(40),
    ninety_day_goal: z.string().trim().min(3, "Write a sentence about your goal.").max(500),
    ...Object.fromEntries(SELF_RATINGS.map((r) => [r.key, rating])),
  })
  .refine((v) => v.goals.includes(v.primary_goal), { message: "Your main goal must be one you picked.", path: ["primary_goal"] });

export type OnboardingPayload = z.infer<typeof onboardingSchema>;

export async function getAssessmentQuestions(db: Executor, kind: "onboarding" | "day_30" | "day_60" | "day_90") {
  return db
    .select({
      id: assessmentQuestions.id,
      key: assessmentQuestions.key,
      section: assessmentQuestions.section,
      prompt: assessmentQuestions.prompt,
      helpText: assessmentQuestions.helpText,
      type: assessmentQuestions.type,
      options: assessmentQuestions.options,
      isRequired: assessmentQuestions.isRequired,
    })
    .from(assessmentQuestions)
    .where(and(eq(assessmentQuestions.status, "published"), sql`${kind} = any(${assessmentQuestions.kinds})`))
    .orderBy(asc(assessmentQuestions.order));
}

export type AssessmentQuestionView = Awaited<ReturnType<typeof getAssessmentQuestions>>[number];

/** Stores every answer of an assessment, keyed by question key. */
async function storeAnswers(db: Executor, assessmentId: string, kind: "onboarding" | "day_30" | "day_60" | "day_90", values: Record<string, unknown>) {
  const questions = await getAssessmentQuestions(db, kind);
  for (const q of questions) {
    const value = values[q.key];
    if (value === undefined || value === null || value === "") continue;
    await db
      .insert(assessmentAnswers)
      .values({ assessmentId, questionId: q.id, value: value as string | string[] | number })
      .onConflictDoUpdate({ target: [assessmentAnswers.assessmentId, assessmentAnswers.questionId], set: { value: value as string | string[] | number } });
  }
}

export function selfRatingSummary(values: Record<string, unknown>): Record<SkillKey, number> {
  return Object.fromEntries(SELF_RATINGS.map((r) => [r.skill, Number(values[r.key] ?? 3)])) as Record<SkillKey, number>;
}

export async function completeOnboarding(
  db: Executor,
  user: { id: string; name: string },
  today: ISODate,
  raw: unknown,
) {
  const parsed = onboardingSchema.safeParse(raw);
  if (!parsed.success) throw new ValidationError(parsed.error.issues[0]?.message ?? "Some answers are missing.");
  const a = parsed.data as OnboardingPayload & Record<string, unknown>;

  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, user.id));
  if (profile?.onboardingCompletedAt) return { alreadyDone: true as const };

  const ratings = selfRatingSummary(a);
  const answers: OnboardingAnswers = {
    goals: a.goals,
    primaryGoal: a.primary_goal,
    situations: a.situations,
    level: a.level,
    minutes: a.minutes,
    frequency: a.frequency,
    challenge: a.challenge,
    ninetyDayGoal: a.ninety_day_goal,
    selfRatings: ratings,
  };

  const journeyRows = await db
    .select({ id: journeys.id, slug: journeys.slug, title: journeys.title, category: journeys.category })
    .from(journeys)
    .where(eq(journeys.status, "published"))
    .orderBy(asc(journeys.order));
  const draft = buildPlan(user.name, answers, journeyRows);

  // Assessment record
  const [assessment] = await db
    .insert(assessments)
    .values({ userId: user.id, kind: "onboarding", completedAt: new Date(), summary: ratings })
    .onConflictDoUpdate({ target: [assessments.userId, assessments.kind], set: { completedAt: new Date(), summary: ratings } })
    .returning({ id: assessments.id });
  await storeAnswers(db, assessment.id, "onboarding", a);

  // Goals
  const goalRows = await db.select({ id: goals.id, key: goals.key }).from(goals);
  const goalId = new Map(goalRows.map((g) => [g.key, g.id]));
  await db.delete(userGoals).where(eq(userGoals.userId, user.id));
  for (const key of [draft.primaryGoal, ...draft.secondaryGoals]) {
    const id = goalId.get(key);
    if (id) await db.insert(userGoals).values({ userId: user.id, goalId: id, priority: key === draft.primaryGoal ? "primary" : "secondary" });
  }

  // Plan + journey enrolment
  const challengeLabel =
    (await db.select({ options: assessmentQuestions.options }).from(assessmentQuestions).where(eq(assessmentQuestions.key, "challenge")))[0]?.options.find(
      (o) => o.value === a.challenge,
    )?.label ?? a.challenge;
  await db.update(growthPlans).set({ status: "archived" }).where(and(eq(growthPlans.userId, user.id), eq(growthPlans.status, "active")));
  const [plan] = await db
    .insert(growthPlans)
    .values({
      userId: user.id,
      title: draft.title,
      primaryGoalId: goalId.get(draft.primaryGoal)!,
      journeyId: draft.journey?.id ?? null,
      roadmap: buildRoadmap(draft.primaryGoal, draft.secondaryGoals, journeyRows),
      level: draft.level,
      dailyMinutes: draft.dailyMinutes,
      frequency: draft.frequency,
      durationDays: draft.durationDays,
      startDate: today,
      situations: a.situations,
      mainChallenge: challengeLabel,
      ninetyDayGoal: a.ninety_day_goal,
    })
    .returning();
  if (draft.journey) {
    await db.insert(userJourneys).values({ userId: user.id, journeyId: draft.journey.id }).onConflictDoNothing();
  }

  // Skill baselines from self-ratings
  const skillRows = await db.select({ id: skills.id, key: skills.key }).from(skills);
  for (const s of skillRows) {
    const baseline = baselineScore(ratings[s.key as SkillKey], a.level);
    await db
      .insert(userSkills)
      .values({ userId: user.id, skillId: s.id, baseline, score: baseline })
      .onConflictDoUpdate({ target: [userSkills.userId, userSkills.skillId], set: { baseline, score: baseline } });
    await db.insert(skillProgress).values({ userId: user.id, skillId: s.id, delta: 0, scoreAfter: baseline, sourceType: "baseline", activityDate: today });
  }

  await db.update(profiles).set({ onboardingCompletedAt: new Date() }).where(eq(profiles.userId, user.id));
  await recordActivity(db, user.id, today, { reason: "onboarding_completed", amount: XP.onboarding, key: "onboarding" });

  return { alreadyDone: false as const, planId: plan.id, journeyTitle: draft.journey?.title ?? null };
}

export const SKILL_ORDER = SKILLS.map((s) => s.key);
