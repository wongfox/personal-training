import { and, eq } from "drizzle-orm";
import { beforeAll, describe, expect, it } from "vitest";
import { addDays } from "@/lib/dates";
import type { DB } from "@/server/db";
import { exercises, lessonProgress, quizQuestions, reviewItems, userJourneys, userSkills } from "@/server/db/schema";
import type { ExerciseConfig } from "@/server/db/types";
import { NotFoundError, ValidationError } from "@/server/errors";
import { getHomeData } from "@/server/services/home";
import {
  answerReview,
  checkInMission,
  completeLesson,
  getDueReviews,
  getLessonForUser,
  saveMissionReflection,
  submitExercise,
  submitQuiz,
} from "@/server/services/learning";
import { createLearner, finishLesson, setupDatabase } from "./helpers";

const DAY1 = "2026-03-02";
const DAY2 = addDays(DAY1, 1);

/** A plausible response for any lesson exercise type. */
function responseFor(config: ExerciseConfig): unknown {
  switch (config.type) {
    case "choice":
      return { selected: config.options.findIndex((o) => o.quality === "best") };
    case "rewrite":
      return { text: config.modelAnswer };
    case "order":
      return null; // handled separately (needs opaque keys)
    case "recall":
      return { text: config.items.join("\n") };
    case "structure":
      return { slots: Object.fromEntries(config.slots.map((s) => [s.key, "A clear and specific answer here"])) };
    case "decision":
      return { options: ["A", "B"], criteria: config.suggestedCriteria.slice(0, 3).map((name) => ({ name, weight: 3 })), scores: [[5, 4, 3], [2, 3, 4]] };
    default:
      throw new Error(`unexpected lesson exercise ${config.type}`);
  }
}

describe("the daily training loop", () => {
  let db: DB;
  beforeAll(async () => {
    db = await setupDatabase();
  });

  it("onboarding creates a personalised plan, enrolment and skill baselines", async () => {
    const { userId } = await createLearner(DAY1);
    const home = await getHomeData(db, userId, DAY1);
    expect(home).not.toBeNull();
    expect(home!.plan.title).toMatch(/Growth Plan/);
    expect(home!.plan.primaryGoalKey).toBe("communication");
    expect(home!.plan.secondaryGoals.map((g) => g.key)).toEqual(["confidence", "networking"]);
    expect(home!.outline?.journey.slug).toBe("communication-mastery");
    expect(home!.todayLesson).not.toBeNull();
    expect(home!.dayNumber).toBe(1);
    expect(home!.insight.tone).toBe("welcome");

    const skills = await db.select().from(userSkills).where(eq(userSkills.userId, userId));
    expect(skills).toHaveLength(6);
    expect(skills.every((s) => s.score === s.baseline && s.baseline > 0)).toBe(true);
    const enrolled = await db.select().from(userJourneys).where(eq(userJourneys.userId, userId));
    expect(enrolled).toHaveLength(1);
  });

  it("runs lesson → exercise → quiz → completion → mission → reflection → next day", async () => {
    const { userId } = await createLearner(DAY1);
    const home = (await getHomeData(db, userId, DAY1))!;
    const lessonId = home.todayLesson!.id;
    const second = home.outline!.modules[0].lessons[1];

    // Only today's lesson is open.
    const lesson = await getLessonForUser(db, userId, lessonId, DAY1);
    expect(lesson?.locked).toBe(false);
    const locked = await getLessonForUser(db, userId, second.id, DAY1);
    expect(locked?.locked).toBe(true);

    // Exercise (scored on the server, answers never sent to the client).
    if (lesson && !lesson.locked && lesson.exercise) {
      expect(JSON.stringify(lesson.exercise.config)).not.toMatch(/"quality"|modelAnswer/);
      const [ex] = await db.select().from(exercises).where(eq(exercises.id, lesson.exercise.id));
      const response = responseFor(ex.config);
      if (response) {
        const result = await db.transaction((tx) => submitExercise(tx, userId, DAY1, ex.id, response, 60));
        expect(result.feedback.score).toBeGreaterThanOrEqual(60);
        expect(result.reward.awarded).toBe(true);
        expect(result.reward.streak.current).toBe(1);
      }
    }

    // Knowledge check: answers scored server-side; concepts enter spaced repetition.
    if (lesson && !lesson.locked && lesson.quiz) {
      const qs = await db.select().from(quizQuestions).where(eq(quizQuestions.quizId, lesson.quiz.id));
      const answers = lesson.quiz.questions.map((q) => qs.find((x) => x.id === q.id)!.correctIndex);
      const quiz = await db.transaction((tx) => submitQuiz(tx, userId, DAY1, lesson.quiz!.id, answers));
      expect(quiz.score).toBe(quiz.total);
      const items = await db.select().from(reviewItems).where(eq(reviewItems.userId, userId));
      expect(items).toHaveLength(quiz.total);
      expect(items.every((i) => i.dueOn === DAY2)).toBe(true);
    }

    // Completion: XP, streak, mission committed. Repeat is idempotent.
    const done = await db.transaction((tx) => completeLesson(tx, userId, DAY1, lessonId, { reflection: "I'll use it in Monday's meeting." }));
    expect(done.alreadyCompleted).toBe(false);
    expect(done.reward.xp).toBeGreaterThan(50);
    expect(done.reward.achievements.map((a) => a.key)).toContain("first_step");
    expect(done.missionAttemptId).toBeTruthy();
    const again = await db.transaction((tx) => completeLesson(tx, userId, DAY1, lessonId, {}));
    expect(again.alreadyCompleted).toBe(true);
    expect(again.reward.xp).toBe(0);

    // Same day: training done, next lesson waits for tomorrow.
    const after = (await getHomeData(db, userId, DAY1))!;
    expect(after.todayLesson).toBeNull();
    expect(after.doneLesson?.id).toBe(lessonId);
    expect(after.nextLesson?.id).toBe(second.id);
    expect(after.todaysMission?.attemptId).toBe(done.missionAttemptId);
    expect(after.streak.current).toBe(1);
    expect((await getLessonForUser(db, userId, second.id, DAY1))?.locked).toBe(true);

    // Mission check-in and reflection.
    const checkin = await db.transaction((tx) => checkInMission(tx, userId, DAY1, done.missionAttemptId!, { status: "done", outcome: "good" }));
    expect(checkin.reward?.awarded).toBe(true);
    expect(checkin.reward?.achievements.map((a) => a.key)).toContain("out_in_the_world");
    const refl = await db.transaction((tx) =>
      saveMissionReflection(tx, userId, DAY1, done.missionAttemptId!, { whatHappened: "I asked first", whatWorked: "They opened up", whatToImprove: "", whatLearned: "Questions first" }),
    );
    expect(refl.reward.awarded).toBe(true);
    // Feedback is written from the learner's own words, and points to the next lesson.
    expect(refl.feedback.observation).toContain("They opened up");
    expect(refl.feedback.nextStep).toContain(second.title);

    // Next day (and 8h+ later): the next lesson opens, reviews are due, the streak continues.
    await db.update(lessonProgress).set({ completedAt: new Date(Date.now() - 9 * 3600_000) }).where(eq(lessonProgress.userId, userId));
    const day2 = (await getHomeData(db, userId, DAY2))!;
    expect(day2.todayLesson?.id).toBe(second.id);
    expect(day2.dueReviews).toBeGreaterThan(0);
    expect(day2.streak).toMatchObject({ current: 1, atRisk: true });
    const due = await getDueReviews(db, userId, DAY2);
    const [item] = due;
    const [row] = await db.select().from(reviewItems).where(eq(reviewItems.id, item.id));
    const [q] = await db.select().from(quizQuestions).where(eq(quizQuestions.id, row.quizQuestionId));
    const review = await db.transaction((tx) => answerReview(tx, userId, DAY2, item.id, q.correctIndex));
    expect(review.correct).toBe(true);
    expect(review.nextDueOn).toBe(addDays(DAY2, 3));
    // A single spaced review earns XP but isn't a training day: the streak needs real training.
    expect(review.reward.streak.current).toBe(1);
    await expect(db.transaction((tx) => answerReview(tx, userId, DAY2, item.id, 0))).rejects.toBeInstanceOf(ValidationError);
  });

  it("keeps each learner's data private", async () => {
    const a = await createLearner(DAY1);
    const b = await createLearner(DAY1);
    const homeA = (await getHomeData(db, a.userId, DAY1))!;
    const done = await finishLesson(db, a.userId, DAY1, homeA.todayLesson!.id);
    await expect(
      db.transaction((tx) => checkInMission(tx, b.userId, DAY1, done.missionAttemptId!, { status: "done", outcome: "good" })),
    ).rejects.toBeInstanceOf(NotFoundError);
    await expect(
      db.transaction((tx) => saveMissionReflection(tx, b.userId, DAY1, done.missionAttemptId!, { whatHappened: "x" })),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("refuses to score exercises of lessons that aren't open yet", async () => {
    const { userId } = await createLearner(DAY1);
    const home = (await getHomeData(db, userId, DAY1))!;
    const future = home.outline!.modules[1].lessons[0];
    const [ex] = await db.select().from(exercises).where(and(eq(exercises.lessonId, future.id)));
    await expect(db.transaction((tx) => submitExercise(tx, userId, DAY1, ex.id, { selected: 0 }, null))).rejects.toBeInstanceOf(NotFoundError);
    await expect(db.transaction((tx) => completeLesson(tx, userId, DAY1, future.id, {}))).rejects.toBeInstanceOf(NotFoundError);
  });

  it("practice tools reward once per tool per day", async () => {
    const { userId } = await createLearner(DAY1);
    const [tool] = await db.select().from(exercises).where(and(eq(exercises.isPractice, true), eq(exercises.type, "rewrite")));
    const response = { text: "I recommend we ship on Friday because the tests pass." };
    const first = await db.transaction((tx) => submitExercise(tx, userId, DAY1, tool.id, response, 30));
    const second = await db.transaction((tx) => submitExercise(tx, userId, DAY1, tool.id, response, 30));
    expect(first.reward.awarded).toBe(true);
    expect(second.reward.awarded).toBe(false);
    expect(first.reward.achievements.map((a) => a.key)).toContain("rehearsal");
  });
});
