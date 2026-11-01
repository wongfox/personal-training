/**
 * Regression tests for the issues found by the adversarial referee (round 2).
 */
import { and, eq } from "drizzle-orm";
import { beforeAll, describe, expect, it } from "vitest";
import { addDays } from "@/lib/dates";
import { scripted } from "@/server/ai/simulator";
import type { DB } from "@/server/db";
import { exerciseAttempts, exercises, growthPlans, lessonProgress, quizQuestions, quizzes, streaks, users, xpTransactions } from "@/server/db/schema";
import { recordActivity } from "@/server/services/rewards";
import type { ExerciseConfig, RoleplayConfig } from "@/server/db/types";
import { scoreExercise } from "@/server/engine/exercise-scoring";
import { ForbiddenError, ValidationError } from "@/server/errors";
import { grantRole, registerUser } from "@/server/services/accounts";
import { getLessonAdmin, saveLesson } from "@/server/services/admin";
import { getHomeData, weeklyReviewDue } from "@/server/services/home";
import { checkQuizAnswer, completeLesson, getLessonForUser, submitExercise, submitQuiz } from "@/server/services/learning";
import { reflectionFeedback } from "@/server/engine/coach-insight";
import { applyTrainingDay } from "@/server/engine/progression";
import { localDate } from "@/lib/dates";
import { saveWeeklyReview } from "@/server/services/progress";
import { getActivePlan, getJourneyOutline, replayDay } from "@/server/services/training";
import { lessonInputSchema } from "@/server/validation/content";
import { createLearner, finishLesson, setupDatabase } from "./helpers";

const DAY1 = "2026-03-02";

describe("referee round 2 regressions", () => {
  let db: DB;
  beforeAll(async () => {
    db = await setupDatabase();
  });

  it("weekly review opens once per plan week and never feeds the streak", async () => {
    const { userId } = await createLearner(DAY1);
    const plan = (await getActivePlan(db, userId))!;
    expect(await weeklyReviewDue(db, userId, addDays(DAY1, 5), plan.startDate)).toBe(false);
    const day7 = addDays(DAY1, 6);
    expect(await weeklyReviewDue(db, userId, day7, plan.startDate)).toBe(true);
    const first = await saveWeeklyReview(db, userId, day7, plan, "I spoke up twice.");
    expect(first.reward.awarded).toBe(true);
    // Same week, next day: closed. No XP farming, no streak.
    await expect(saveWeeklyReview(db, userId, addDays(day7, 1), plan, "again")).rejects.toBeInstanceOf(ValidationError);
    const [streak] = await db.select().from(streaks).where(eq(streaks.userId, userId));
    expect(streak.current).toBe(0);
    expect(await weeklyReviewDue(db, userId, addDays(DAY1, 13), plan.startDate)).toBe(true);
  });

  it("content managers can't edit live content", async () => {
    const reg = await registerUser(db, { name: "cm", email: "cm2@example.com", password: "a long enough password" });
    if (!reg.ok) throw new Error();
    await grantRole(db, reg.userId, "CONTENT_MANAGER");
    const cm = { id: reg.userId, roles: ["USER", "CONTENT_MANAGER"] };
    const { userId } = await createLearner(DAY1);
    const lessonId = (await getHomeData(db, userId, DAY1))!.todayLesson!.id;
    const full = await getLessonAdmin(db, lessonId);
    const input = lessonInputSchema.parse({
      ...full.lesson,
      content: { ...full.lesson.content, hook: "Sneaky live edit" },
      exercise: full.exercise ? { title: full.exercise.title, description: full.exercise.description, config: full.exercise.config } : null,
      quiz: full.questions.map(({ prompt, options, correctIndex, explanation, conceptKey }) => ({ prompt, options, correctIndex, explanation, conceptKey })),
      action: null,
    });
    await expect(saveLesson(db, cm, full.module.id, lessonId, input)).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("the first checked quiz answer is the one that counts", async () => {
    const { userId } = await createLearner(DAY1);
    const lessonId = (await getHomeData(db, userId, DAY1))!.todayLesson!.id;
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.lessonId, lessonId));
    const qs = await db.select().from(quizQuestions).where(eq(quizQuestions.quizId, quiz.id));
    const q0 = qs.find((q) => q.order === 1)!;
    const wrong = (q0.correctIndex + 1) % q0.options.length;
    const reveal = await checkQuizAnswer(db, userId, DAY1, quiz.id, q0.id, wrong);
    expect(reveal.correct).toBe(false);
    // Now "knowing" the key, submit all-correct answers…
    const ordered = [...qs].sort((a, b) => a.order - b.order);
    const result = await submitQuiz(db, userId, DAY1, quiz.id, ordered.map((q) => q.correctIndex));
    // …but the first question still scores as wrong.
    expect(result.score).toBe(ordered.length - 1);
  });

  it("finishing a journey moves the plan on — and still only one lesson a day", async () => {
    const { userId } = await createLearner(DAY1);
    const plan = (await getActivePlan(db, userId))!;
    expect(plan.roadmap.length).toBe(5);
    const outline = (await getJourneyOutline(db, userId, plan.journeyId!, DAY1))!;
    const lessonsInJourney = outline.modules.flatMap((m) => m.lessons);
    // Mark all but the last lesson as done on earlier days.
    for (const [i, l] of lessonsInJourney.slice(0, -1).entries()) {
      await db.insert(lessonProgress).values({ userId, lessonId: l.id, status: "completed", completedOn: addDays(DAY1, -20 + i), completedAt: new Date(Date.now() - (20 - i) * 86_400_000) });
    }
    const last = lessonsInJourney.at(-1)!;
    const done = await finishLesson(db, userId, DAY1, last.id);
    expect(done.journeyCompleted).toBe(true);
    expect(done.nextJourney?.id).toBe(plan.roadmap[1]);
    const [updated] = await db.select().from(growthPlans).where(eq(growthPlans.id, plan.id));
    expect(updated.journeyId).toBe(plan.roadmap[1]);
    // Same day: the new journey's first lesson waits for tomorrow.
    const today = (await getHomeData(db, userId, DAY1))!;
    expect(today.todayLesson).toBeNull();
    expect(today.doneLesson?.id).toBe(last.id);
    const first = today.nextLesson!;
    expect((await getLessonForUser(db, userId, first.id, DAY1))?.locked).toBe(true);
    const tomorrow = (await getHomeData(db, userId, addDays(DAY1, 1)))!;
    expect(tomorrow.todayLesson?.id).toBe(first.id);
  });

  it("the simulator doesn't reward evasive replies", async () => {
    const [row] = await db.select().from(exercises).where(and(eq(exercises.isPractice, true), eq(exercises.type, "roleplay")));
    const config = row.config as RoleplayConfig;
    const evasive = scoreExercise(config as ExerciseConfig, {
      turns: [
        { role: "counterpart", text: config.openingLine },
        { role: "user", text: "ok" },
        { role: "counterpart", text: config.scriptedTurns[0] },
        { role: "user", text: "fine" },
      ],
    });
    expect(evasive.score).toBeLessThan(35);
    expect(evasive.strengths).toEqual([]);
    expect(evasive.improvements.join(" ")).toMatch(/word or two/);
    // The scripted partner nudges instead of moving on, and gives up after three.
    const nudge = scripted(config, [{ role: "counterpart", text: config.openingLine }, { role: "user", text: "ok" }]);
    expect(nudge.reply).not.toBe(config.scriptedTurns[0]);
    expect(nudge.done).toBe(false);
    const real = scripted(config, [
      { role: "counterpart", text: config.openingLine },
      { role: "user", text: "ok" },
      { role: "counterpart", text: nudge.reply! },
      { role: "user", text: "I lead logistics for a rail operator in Peru." },
    ]);
    expect(real.reply).toBe(config.scriptedTurns[0]);
    const gaveUp = scripted(config, [
      { role: "user", text: "ok" },
      { role: "user", text: "sure" },
      { role: "user", text: "fine" },
    ]);
    expect(gaveUp.done).toBe(true);
  });

  it("a wrong answer earns less XP than a right one", async () => {
    const a = await createLearner(DAY1);
    const b = await createLearner(DAY1);
    const [tool] = await db.select().from(exercises).where(and(eq(exercises.isPractice, true), eq(exercises.type, "decision")));
    const { submitExercise } = await import("@/server/services/learning");
    const good = await submitExercise(db, a.userId, DAY1, tool.id, { options: ["A", "B"], criteria: [{ name: "x", weight: 3 }, { name: "y", weight: 2 }, { name: "z", weight: 1 }], scores: [[5, 4, 3], [2, 2, 2]] }, 30);
    const roleplay = (await db.select().from(exercises).where(and(eq(exercises.isPractice, true), eq(exercises.type, "roleplay"))))[0];
    const bad = await submitExercise(db, b.userId, DAY1, roleplay.id, { turns: [{ role: "counterpart", text: "Hi" }, { role: "user", text: "ok" }] }, 5);
    const xp = async (userId: string) =>
      (await db.select().from(xpTransactions).where(and(eq(xpTransactions.userId, userId), eq(xpTransactions.reason, "practice_completed"))))[0].amount;
    expect(good.feedback.score).toBeGreaterThan(bad.feedback.score);
    expect(await xp(a.userId)).toBeGreaterThan(await xp(b.userId));
  });
});

describe("referee round 3 regressions", () => {
  let db: DB;
  beforeAll(async () => {
    db = await setupDatabase();
  });

  it("a lesson can't be completed without its exercise and knowledge check", async () => {
    const { userId } = await createLearner(DAY1);
    const lessonId = (await getHomeData(db, userId, DAY1))!.todayLesson!.id;
    await expect(db.transaction((tx) => completeLesson(tx, userId, DAY1, lessonId, {}))).rejects.toBeInstanceOf(ValidationError);
    expect((await finishLesson(db, userId, DAY1, lessonId)).alreadyCompleted).toBe(false);
  });

  it("offline replays can't backfill before the account existed or rewind a streak", async () => {
    const { userId } = await createLearner(DAY1);
    const tz = "America/Lima";
    const today = localDate(tz);
    // A brand-new account claiming yesterday is clamped to today.
    expect(await replayDay(db, userId, tz, new Date(Date.now() - 30 * 3600_000))).toBe(today);
    // Once they've trained today, a late replay for yesterday can't move the streak backwards.
    await db.insert(streaks).values({ userId, current: 3, longest: 3, lastActiveDate: today }).onConflictDoUpdate({ target: streaks.userId, set: { current: 3, longest: 3, lastActiveDate: today } });
    expect(await replayDay(db, userId, tz, new Date(Date.now() - 20 * 3600_000))).toBe(today);
    expect(applyTrainingDay({ current: 3, longest: 3, lastActiveDate: today }, addDays(today, -1))).toMatchObject({ current: 3, event: "past" });
  });

  it("token effort doesn't keep a streak alive and junk reflections earn nothing", async () => {
    const { userId } = await createLearner(DAY1);
    const [tool] = await db.select().from(exercises).where(and(eq(exercises.isPractice, true), eq(exercises.type, "roleplay")));
    const evasive = await submitExercise(db, userId, DAY1, tool.id, { turns: [{ role: "counterpart", text: "Hi" }, { role: "user", text: "ok" }] }, 5);
    expect(evasive.reward.streak.current).toBe(0);
    expect(reflectionFeedback({ outcome: "good", answers: { whatWorked: "ok" }, next: null }).observation).not.toContain("“ok”");
  });
});

describe("referee round 4 regressions", () => {
  let db: DB;
  beforeAll(async () => {
    db = await setupDatabase();
  });

  it("the streak is derived from training days, whatever order they arrive in", async () => {
    const { userId } = await createLearner(DAY1);
    const day = (n: number) => addDays(DAY1, n);
    const train = (d: string, key: string) =>
      db.transaction((tx) => recordActivity(tx, userId, d, { reason: "practice_completed", amount: 10, key, countsAsTraining: true }));
    await train(day(0), "a");
    await train(day(2), "c"); // a gap: streak restarts at 1
    expect((await db.select().from(streaks).where(eq(streaks.userId, userId)))[0]).toMatchObject({ current: 1, longest: 1 });
    // Another device syncs day 1 late: it fills the gap instead of resetting anything.
    const late = await train(day(1), "b");
    expect(late.streak.event).toBe("past");
    expect((await db.select().from(streaks).where(eq(streaks.userId, userId)))[0]).toMatchObject({ current: 3, longest: 3, lastActiveDate: day(2) });
  });

  it("achievement bonuses never count as a training day", async () => {
    const { userId } = await createLearner(DAY1);
    await finishLesson(db, userId, DAY1, (await getHomeData(db, userId, DAY1))!.todayLesson!.id);
    const bonus = await db.select().from(xpTransactions).where(and(eq(xpTransactions.userId, userId), eq(xpTransactions.reason, "achievement_earned")));
    expect(bonus.length).toBeGreaterThan(0);
    expect(bonus.every((b) => b.countsAsTraining === false)).toBe(true);
  });

  it("a good retry turns a token practice rep into a training day", async () => {
    const { userId } = await createLearner(DAY1);
    const [tool] = await db.select().from(exercises).where(and(eq(exercises.isPractice, true), eq(exercises.type, "roleplay")));
    const weak = await submitExercise(db, userId, DAY1, tool.id, { turns: [{ role: "counterpart", text: "Hi" }, { role: "user", text: "no" }] }, 5);
    expect(weak.reward.streak.current).toBe(0);
    const good = await submitExercise(db, userId, DAY1, tool.id, {
      turns: [
        { role: "counterpart", text: "Hi, nice to meet you. What do you do?" },
        { role: "user", text: "I run operations for a rail company in Cusco. What brought you to the event tonight?" },
        { role: "counterpart", text: "We're looking at logistics partners." },
        { role: "user", text: "That sounds interesting — what's the hardest part of choosing one? Could we swap emails and talk next week?" },
      ],
    }, 60);
    expect(good.feedback.score).toBeGreaterThanOrEqual(40);
    expect(good.reward.xp).toBe(0); // XP stays capped per tool per day…
    expect(good.reward.streak.current).toBe(1); // …but the day now counts.
  });

  it("a replayed 'yesterday' needs server evidence from yesterday", async () => {
    const { userId } = await createLearner(addDays(localDate("UTC"), -5));
    await db.update(users).set({ createdAt: new Date(Date.now() - 5 * 86_400_000) }).where(eq(users.id, userId));
    const tz = "UTC";
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 3600_000);
    // No server-side activity yesterday: a forged claim is counted as today.
    expect(await replayDay(db, userId, tz, yesterday, now)).toBe(localDate(tz, now));
    // An exercise attempt the server recorded yesterday is evidence the learner was training then.
    const [ex] = await db.select().from(exercises).where(eq(exercises.isPractice, true)).limit(1);
    await db.insert(exerciseAttempts).values({ userId, exerciseId: ex.id, response: {}, score: 80, feedback: { score: 80, summary: "", strengths: [], improvements: [], source: "rules" }, createdAt: yesterday });
    expect(await replayDay(db, userId, tz, yesterday, now)).toBe(localDate(tz, yesterday));
  });
});
