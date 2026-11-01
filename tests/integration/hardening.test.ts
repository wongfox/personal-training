/**
 * Regression tests for the issues found by the adversarial referee (round 2).
 */
import { and, eq } from "drizzle-orm";
import { beforeAll, describe, expect, it } from "vitest";
import { addDays } from "@/lib/dates";
import { scripted } from "@/server/ai/simulator";
import type { DB } from "@/server/db";
import { exercises, growthPlans, lessonProgress, quizQuestions, quizzes, streaks, xpTransactions } from "@/server/db/schema";
import type { ExerciseConfig, RoleplayConfig } from "@/server/db/types";
import { scoreExercise } from "@/server/engine/exercise-scoring";
import { ForbiddenError, ValidationError } from "@/server/errors";
import { grantRole, registerUser } from "@/server/services/accounts";
import { getLessonAdmin, saveLesson } from "@/server/services/admin";
import { getHomeData, weeklyReviewDue } from "@/server/services/home";
import { checkQuizAnswer, completeLesson, getLessonForUser, submitQuiz } from "@/server/services/learning";
import { saveWeeklyReview } from "@/server/services/progress";
import { getActivePlan, getJourneyOutline } from "@/server/services/training";
import { lessonInputSchema } from "@/server/validation/content";
import { createLearner, setupDatabase } from "./helpers";

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
      await db.insert(lessonProgress).values({ userId, lessonId: l.id, status: "completed", completedOn: addDays(DAY1, -20 + i), completedAt: new Date() });
    }
    const last = lessonsInJourney.at(-1)!;
    const done = await db.transaction((tx) => completeLesson(tx, userId, DAY1, last.id, {}));
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
