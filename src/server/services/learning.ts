/**
 * Write side of the daily loop: lessons, exercises, knowledge checks,
 * missions, reflections and spaced reviews.
 */
import { and, asc, eq, inArray, isNotNull, lte, or, sql } from "drizzle-orm";
import { diffDays, type ISODate } from "@/lib/dates";
import { categorySkill } from "@/lib/taxonomy";
import type { Executor } from "@/server/db";
import {
  dailyActionAttempts,
  dailyActions,
  exerciseAttempts,
  exercises,
  growthPlans,
  journeyModules,
  journeys,
  lessonProgress,
  lessons,
  quizAnswerChecks,
  quizAttempts,
  quizQuestions,
  quizzes,
  reflections,
  reviewItems,
  userJourneys,
} from "@/server/db/schema";
import type { ActionReflectionAnswers, ExerciseFeedback } from "@/server/db/types";
import { resolveOrderKeys, toClientConfig } from "@/server/engine/client-config";
import { reflectionFeedback } from "@/server/engine/coach-insight";
import { InvalidResponseError, scoreExercise } from "@/server/engine/exercise-scoring";
import { initialReview, scaledXp, scheduleReview, SKILL_GAINS, XP } from "@/server/engine/progression";
import { NotFoundError, ValidationError } from "@/server/errors";
import { type ActivityResult, mergeResults, recordActivity } from "./rewards";
import { getJourneyOutline } from "./training";

/** A reflection needs at least a sentence to count. */
const MIN_REFLECTION_WORDS = 4;

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

/* ─────────────────────────── Access ─────────────────────────── */

async function lessonContext(db: Executor, lessonIdOrSlug: string) {
  const isUuid = /^[0-9a-f-]{36}$/i.test(lessonIdOrSlug);
  const [row] = await db
    .select({ lesson: lessons, moduleTitle: journeyModules.title, journeyId: journeys.id, journeyTitle: journeys.title })
    .from(lessons)
    .innerJoin(journeyModules, eq(journeyModules.id, lessons.moduleId))
    .innerJoin(journeys, eq(journeys.id, journeyModules.journeyId))
    .where(
      and(
        isUuid ? eq(lessons.id, lessonIdOrSlug) : eq(lessons.slug, lessonIdOrSlug),
        eq(lessons.status, "published"),
        eq(journeys.status, "published"),
      ),
    );
  return row ?? null;
}

export type LessonAccess = "completed" | "today" | "locked" | "not_enrolled";

/** A lesson is open when it's completed or it's today's lesson in an enrolled journey. */
export async function lessonAccess(db: Executor, userId: string, lessonId: string, journeyId: string, today: ISODate): Promise<{ access: LessonAccess; outline: Awaited<ReturnType<typeof getJourneyOutline>> }> {
  const [enrolled] = await db
    .select()
    .from(userJourneys)
    .where(and(eq(userJourneys.userId, userId), eq(userJourneys.journeyId, journeyId)));
  const outline = await getJourneyOutline(db, userId, journeyId, today);
  if (!enrolled) return { access: "not_enrolled", outline };
  const state = outline?.modules.flatMap((m) => m.lessons).find((l) => l.id === lessonId)?.state;
  if (state === "completed") return { access: "completed", outline };
  if (state === "today") return { access: "today", outline };
  // The lesson finished today stays open for the rest of the day.
  if (outline?.doneTodayLesson?.id === lessonId) return { access: "completed", outline };
  return { access: "locked", outline };
}

async function requireOpenLesson(db: Executor, userId: string, lessonId: string, today: ISODate) {
  const ctx = await lessonContext(db, lessonId);
  if (!ctx) throw new NotFoundError("Lesson not found.");
  const { access } = await lessonAccess(db, userId, ctx.lesson.id, ctx.journeyId, today);
  if (access === "locked" || access === "not_enrolled") throw new NotFoundError("This lesson isn't open yet.");
  return ctx;
}

/* ─────────────────────────── Lesson view ─────────────────────────── */

export async function getLessonForUser(db: Executor, userId: string, lessonIdOrSlug: string, today: ISODate) {
  const ctx = await lessonContext(db, lessonIdOrSlug);
  if (!ctx) return null;
  const { access, outline } = await lessonAccess(db, userId, ctx.lesson.id, ctx.journeyId, today);

  const base = {
    id: ctx.lesson.id,
    slug: ctx.lesson.slug,
    title: ctx.lesson.title,
    description: ctx.lesson.description,
    moduleTitle: ctx.moduleTitle,
    journeyTitle: ctx.journeyTitle,
    estimatedMinutes: ctx.lesson.estimatedMinutes,
    category: ctx.lesson.category,
    access,
  };
  if (access === "locked" || access === "not_enrolled") {
    return { ...base, locked: true as const, nextLessonTitle: outline?.nextLesson?.title ?? null };
  }

  const [exercise] = await db
    .select()
    .from(exercises)
    .where(and(eq(exercises.lessonId, ctx.lesson.id), eq(exercises.status, "published")))
    .limit(1);
  const [quiz] = await db.select().from(quizzes).where(and(eq(quizzes.lessonId, ctx.lesson.id), eq(quizzes.status, "published")));
  const questions = quiz
    ? await db
        .select({ id: quizQuestions.id, prompt: quizQuestions.prompt, options: quizQuestions.options })
        .from(quizQuestions)
        .where(eq(quizQuestions.quizId, quiz.id))
        .orderBy(asc(quizQuestions.order))
    : [];
  const [action] = await db.select().from(dailyActions).where(and(eq(dailyActions.lessonId, ctx.lesson.id), eq(dailyActions.status, "published")));
  const [progress] = await db
    .select()
    .from(lessonProgress)
    .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, ctx.lesson.id)));

  return {
    ...base,
    locked: false as const,
    content: ctx.lesson.content,
    xpReward: ctx.lesson.xpReward,
    completed: progress?.status === "completed",
    currentStep: progress?.currentStep ?? 0,
    exercise: exercise
      ? {
          id: exercise.id,
          title: exercise.title,
          description: exercise.description,
          type: exercise.type,
          config: toClientConfig(exercise.config, exercise.id),
        }
      : null,
    quiz: quiz ? { id: quiz.id, questions } : null,
    action: action
      ? {
          id: action.id,
          title: action.title,
          description: action.description,
          successCriteria: action.successCriteria,
          estimatedMinutes: action.estimatedMinutes,
          difficulty: action.difficulty,
        }
      : null,
  };
}

export type LessonView = NonNullable<Awaited<ReturnType<typeof getLessonForUser>>>;
export type OpenLessonView = Extract<LessonView, { locked: false }>;

/* ─────────────────────────── Progress ─────────────────────────── */

export async function saveLessonStep(
  db: Executor,
  userId: string,
  today: ISODate,
  lessonId: string,
  step: number,
  secondsDelta: number,
): Promise<{ started: boolean }> {
  const ctx = await requireOpenLesson(db, userId, lessonId, today);
  const seconds = Math.max(0, Math.min(600, Math.round(secondsDelta)));
  const [existing] = await db
    .select()
    .from(lessonProgress)
    .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, ctx.lesson.id)));
  if (!existing) {
    await db.insert(lessonProgress).values({ userId, lessonId: ctx.lesson.id, currentStep: step, timeSpentSeconds: seconds }).onConflictDoNothing();
    return { started: true };
  }
  await db
    .update(lessonProgress)
    .set({
      currentStep: existing.status === "completed" ? existing.currentStep : Math.max(existing.currentStep, step),
      timeSpentSeconds: existing.timeSpentSeconds + seconds,
    })
    .where(eq(lessonProgress.id, existing.id));
  return { started: false };
}

/* ─────────────────────────── Exercises ─────────────────────────── */

export interface ExerciseResult {
  attemptId: string;
  feedback: ExerciseFeedback;
  reveal?: { modelAnswer?: string; bestOption?: string; correctOrder?: string[]; explanation?: string };
  reward: ActivityResult;
}

export type PreparedExercise = Awaited<ReturnType<typeof prepareExercise>>;

/** Validates access and scores a response. No writes — safe to run before slow AI enrichment. */
export async function prepareExercise(db: Executor, userId: string, today: ISODate, exerciseId: string, rawResponse: unknown) {
  const [exercise] = await db
    .select()
    .from(exercises)
    .where(and(eq(exercises.id, exerciseId), eq(exercises.status, "published")));
  if (!exercise) throw new NotFoundError("Exercise not found.");
  if (!exercise.isPractice) {
    if (!exercise.lessonId) throw new NotFoundError("Exercise not found.");
    await requireOpenLesson(db, userId, exercise.lessonId, today);
  }

  let response = rawResponse;
  if (exercise.config.type === "order" && rawResponse && typeof rawResponse === "object") {
    response = { order: resolveOrderKeys(exercise.config, exercise.id, (rawResponse as { order?: unknown }).order) };
  }

  let feedback: ExerciseFeedback;
  try {
    feedback = scoreExercise(exercise.config, response);
  } catch (e) {
    if (e instanceof InvalidResponseError) throw new ValidationError(e.message);
    throw e;
  }
  return { exercise, response, feedback };
}

export async function recordExerciseAttempt(
  db: Executor,
  userId: string,
  today: ISODate,
  { exercise, response, feedback }: PreparedExercise,
  durationSeconds: number | null,
): Promise<ExerciseResult> {
  const [attempt] = await db
    .insert(exerciseAttempts)
    .values({
      userId,
      exerciseId: exercise.id,
      response: response as Record<string, unknown>,
      score: feedback.score,
      feedback,
      durationSeconds: durationSeconds ? Math.min(7200, Math.max(0, Math.round(durationSeconds))) : null,
    })
    .returning({ id: exerciseAttempts.id });

  const skillKey = categorySkill(exercise.category);
  const reward = exercise.isPractice
    ? await recordActivity(db, userId, today, {
        reason: "practice_completed",
        amount: scaledXp(XP.practice, feedback.score),
        key: `practice:${exercise.id}:${today}`,
        sourceType: "exercise",
        sourceId: exercise.id,
        skillKey,
        skillGain: SKILL_GAINS.practice(feedback.score),
        // A token rep (score under 40) earns some XP but doesn't keep a streak alive.
        countsAsTraining: feedback.score >= 40,
      })
    : await recordActivity(db, userId, today, {
        reason: "exercise_completed",
        amount: scaledXp(XP.exercise, feedback.score),
        key: `exercise:${exercise.id}`,
        sourceType: "exercise",
        sourceId: exercise.id,
        skillKey,
        skillGain: SKILL_GAINS.exercise(feedback.score),
      });

  const c = exercise.config;
  const reveal: ExerciseResult["reveal"] =
    c.type === "rewrite"
      ? { modelAnswer: c.modelAnswer }
      : c.type === "choice"
        ? { bestOption: c.options.find((o) => o.quality === "best")?.text }
        : c.type === "order"
          ? { correctOrder: c.items, explanation: c.explanation }
          : undefined;

  return { attemptId: attempt.id, feedback, reveal, reward };
}

/** Scores and records in one go (no AI enrichment). */
export async function submitExercise(
  db: Executor,
  userId: string,
  today: ISODate,
  exerciseId: string,
  rawResponse: unknown,
  durationSeconds: number | null,
): Promise<ExerciseResult> {
  const prepared = await prepareExercise(db, userId, today, exerciseId, rawResponse);
  return recordExerciseAttempt(db, userId, today, prepared, durationSeconds);
}

/* ─────────────────────────── Knowledge check ─────────────────────────── */

async function quizForUser(db: Executor, userId: string, quizId: string, today: ISODate) {
  const [quiz] = await db.select().from(quizzes).where(and(eq(quizzes.id, quizId), eq(quizzes.status, "published")));
  if (!quiz) throw new NotFoundError("Quiz not found.");
  const ctx = await requireOpenLesson(db, userId, quiz.lessonId, today);
  const questions = await db.select().from(quizQuestions).where(eq(quizQuestions.quizId, quiz.id)).orderBy(asc(quizQuestions.order));
  return { quiz, questions, lesson: ctx.lesson };
}

export async function checkQuizAnswer(db: Executor, userId: string, today: ISODate, quizId: string, questionId: string, answer: number) {
  const { questions } = await quizForUser(db, userId, quizId, today);
  const q = questions.find((x) => x.id === questionId);
  if (!q) throw new NotFoundError("Question not found.");
  if (answer < 0 || answer >= q.options.length) throw new ValidationError("Pick one of the options.");
  // Checking reveals the answer, so the first answer checked is the one that counts.
  await db.insert(quizAnswerChecks).values({ userId, questionId: q.id, answer }).onConflictDoNothing();
  return { correct: q.correctIndex === answer, correctIndex: q.correctIndex, explanation: q.explanation };
}

export async function submitQuiz(db: Executor, userId: string, today: ISODate, quizId: string, answers: number[]) {
  const { quiz, questions, lesson } = await quizForUser(db, userId, quizId, today);
  if (answers.length !== questions.length) throw new ValidationError("Answer every question.");
  const locked = new Map(
    (await db.select().from(quizAnswerChecks).where(and(eq(quizAnswerChecks.userId, userId), inArray(quizAnswerChecks.questionId, questions.map((q) => q.id))))).map((c) => [c.questionId, c.answer]),
  );
  const scored = questions.map((q, i) => locked.get(q.id) ?? answers[i]);
  const results = questions.map((q, i) => ({
    questionId: q.id,
    correct: q.correctIndex === scored[i],
    correctIndex: q.correctIndex,
    explanation: q.explanation,
  }));
  const score = results.filter((r) => r.correct).length;
  await db.insert(quizAttempts).values({ userId, quizId: quiz.id, answers: scored, score, total: questions.length });

  // Every concept enters spaced repetition on first exposure.
  for (const q of questions) {
    const first = initialReview(today);
    await db
      .insert(reviewItems)
      .values({ userId, quizQuestionId: q.id, stage: first.stage, dueOn: first.dueOn })
      .onConflictDoNothing();
  }

  const reward = await recordActivity(db, userId, today, {
    reason: "quiz_completed",
    amount: Math.max(5, score * XP.quizPerCorrect),
    key: `quiz:${quiz.id}`,
    sourceType: "quiz",
    sourceId: quiz.id,
    skillKey: categorySkill(lesson.category),
    skillGain: SKILL_GAINS.quiz(score, questions.length),
  });
  return { score, total: questions.length, results, reward };
}

/* ─────────────────────────── Completion ─────────────────────────── */

export async function completeLesson(
  db: Executor,
  userId: string,
  today: ISODate,
  lessonId: string,
  input: { reflection?: string },
) {
  const ctx = await requireOpenLesson(db, userId, lessonId, today);
  const lesson = ctx.lesson;
  const rewards: ActivityResult[] = [];

  const [existing] = await db
    .select()
    .from(lessonProgress)
    .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, lesson.id)));
  const alreadyCompleted = existing?.status === "completed";

  if (!alreadyCompleted) {
    // Completion means the whole loop: the practice and the knowledge check, not just reading.
    const [exercise] = await db
      .select({ id: exercises.id })
      .from(exercises)
      .where(and(eq(exercises.lessonId, lesson.id), eq(exercises.status, "published")))
      .limit(1);
    if (exercise) {
      const [attempt] = await db
        .select({ id: exerciseAttempts.id })
        .from(exerciseAttempts)
        .where(and(eq(exerciseAttempts.userId, userId), eq(exerciseAttempts.exerciseId, exercise.id)))
        .limit(1);
      if (!attempt) throw new ValidationError("Finish the exercise first.");
    }
    const [quiz] = await db.select({ id: quizzes.id }).from(quizzes).where(and(eq(quizzes.lessonId, lesson.id), eq(quizzes.status, "published")));
    if (quiz) {
      const [attempt] = await db
        .select({ id: quizAttempts.id })
        .from(quizAttempts)
        .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.quizId, quiz.id)))
        .limit(1);
      if (!attempt) throw new ValidationError("Finish the knowledge check first.");
    }
  }

  if (!alreadyCompleted) {
    const now = new Date();
    if (existing) {
      await db
        .update(lessonProgress)
        .set({ status: "completed", completedAt: now, completedOn: today, currentStep: 9 })
        .where(eq(lessonProgress.id, existing.id));
    } else {
      await db.insert(lessonProgress).values({ userId, lessonId: lesson.id, status: "completed", completedAt: now, completedOn: today, currentStep: 9 });
    }
  }

  rewards.push(
    await recordActivity(db, userId, today, {
      reason: "lesson_completed",
      amount: lesson.xpReward,
      key: `lesson:${lesson.id}`,
      sourceType: "lesson",
      sourceId: lesson.id,
      skillKey: categorySkill(lesson.category),
      skillGain: SKILL_GAINS.lesson,
    }),
  );

  const text = input.reflection?.trim();
  if (text && wordCount(text) >= MIN_REFLECTION_WORDS) {
    const [exists] = await db
      .select({ id: reflections.id })
      .from(reflections)
      .where(and(eq(reflections.userId, userId), eq(reflections.lessonId, lesson.id), eq(reflections.kind, "lesson")));
    if (!exists) await db.insert(reflections).values({ userId, kind: "lesson", lessonId: lesson.id, answers: { text: text.slice(0, 2000) } });
    rewards.push(
      await recordActivity(db, userId, today, {
        reason: "reflection_completed",
        amount: XP.reflection,
        key: `reflection:lesson:${lesson.id}`,
        sourceType: "lesson",
        sourceId: lesson.id,
      }),
    );
  }

  // Commit to today's real-world mission.
  let missionAttemptId: string | null = null;
  const [action] = await db.select().from(dailyActions).where(and(eq(dailyActions.lessonId, lesson.id), eq(dailyActions.status, "published")));
  if (action) {
    await db.insert(dailyActionAttempts).values({ userId, dailyActionId: action.id, actionDate: today }).onConflictDoNothing();
    const [attempt] = await db
      .select({ id: dailyActionAttempts.id })
      .from(dailyActionAttempts)
      .where(and(eq(dailyActionAttempts.userId, userId), eq(dailyActionAttempts.dailyActionId, action.id)));
    missionAttemptId = attempt?.id ?? null;
  }

  const outline = await getJourneyOutline(db, userId, ctx.journeyId, today);
  let journeyCompleted = false;
  if (outline?.journeyComplete) {
    const updated = await db
      .update(userJourneys)
      .set({ status: "completed", completedAt: new Date() })
      .where(and(eq(userJourneys.userId, userId), eq(userJourneys.journeyId, ctx.journeyId), eq(userJourneys.status, "active")))
      .returning({ journeyId: userJourneys.journeyId });
    journeyCompleted = updated.length > 0;
  }

  // Finishing a journey moves the plan on to the next one in the roadmap (starting tomorrow).
  let nextLesson = outline?.nextLesson ? { id: outline.nextLesson.id, title: outline.nextLesson.title, moduleTitle: outline.nextLesson.moduleTitle } : null;
  let nextJourney: { id: string; title: string } | null = null;
  if (outline?.journeyComplete) {
    nextJourney = await advanceRoadmap(db, userId, ctx.journeyId);
    if (nextJourney) {
      const nextOutline = await getJourneyOutline(db, userId, nextJourney.id, today);
      nextLesson = nextOutline?.nextLesson ? { id: nextOutline.nextLesson.id, title: nextOutline.nextLesson.title, moduleTitle: nextOutline.nextLesson.moduleTitle } : null;
    }
  }

  return {
    alreadyCompleted,
    reward: mergeResults(rewards)!,
    missionAttemptId,
    nextLesson,
    journeyCompleted,
    nextJourney,
    journeyId: ctx.journeyId,
  };
}

/* ─────────────────────────── Missions ─────────────────────────── */

async function ownedAttempt(db: Executor, userId: string, attemptId: string) {
  const [row] = await db
    .select({ attempt: dailyActionAttempts, action: dailyActions, lessonCategory: lessons.category, lessonTitle: lessons.title })
    .from(dailyActionAttempts)
    .innerJoin(dailyActions, eq(dailyActions.id, dailyActionAttempts.dailyActionId))
    .innerJoin(lessons, eq(lessons.id, dailyActions.lessonId))
    .where(and(eq(dailyActionAttempts.id, attemptId), eq(dailyActionAttempts.userId, userId)));
  if (!row) throw new NotFoundError("Mission not found.");
  return row;
}

export async function getMission(db: Executor, userId: string, attemptId: string) {
  const row = await ownedAttempt(db, userId, attemptId);
  const [reflection] = await db
    .select()
    .from(reflections)
    .where(and(eq(reflections.userId, userId), eq(reflections.dailyActionAttemptId, attemptId)));
  return {
    id: row.attempt.id,
    status: row.attempt.status,
    outcome: row.attempt.outcome,
    actionDate: row.attempt.actionDate,
    title: row.action.title,
    description: row.action.description,
    successCriteria: row.action.successCriteria,
    estimatedMinutes: row.action.estimatedMinutes,
    difficulty: row.action.difficulty,
    lessonTitle: row.lessonTitle,
    reflection: reflection?.answers ?? null,
  };
}

export async function checkInMission(
  db: Executor,
  userId: string,
  today: ISODate,
  attemptId: string,
  input: { status: "done" | "not_yet" | "skipped"; outcome?: "difficult" | "normal" | "good" | "excellent" },
) {
  const row = await ownedAttempt(db, userId, attemptId);
  if (input.status !== "done") {
    if (row.attempt.status === "done") throw new ValidationError("This mission is already complete.");
    await db.update(dailyActionAttempts).set({ status: input.status }).where(eq(dailyActionAttempts.id, attemptId));
    return { status: input.status, reward: null };
  }
  if (!input.outcome) throw new ValidationError("Tell us how it went.");
  if (row.attempt.status !== "done") {
    await db
      .update(dailyActionAttempts)
      .set({ status: "done", outcome: input.outcome, completedAt: new Date() })
      .where(eq(dailyActionAttempts.id, attemptId));
  }
  const reward = await recordActivity(db, userId, today, {
    reason: "action_completed",
    amount: XP.action,
    key: `action:${attemptId}`,
    sourceType: "daily_action",
    sourceId: row.action.id,
    skillKey: categorySkill(row.lessonCategory),
    skillGain: SKILL_GAINS.action[input.outcome],
    // Missions can be logged late for XP, but only same/next-day check-ins count as a training day
    // (so old missions can't be "banked" to rescue a streak).
    countsAsTraining: diffDays(row.attempt.actionDate, today) <= 1,
  });
  return { status: "done" as const, reward };
}

export async function saveMissionReflection(
  db: Executor,
  userId: string,
  today: ISODate,
  attemptId: string,
  answers: ActionReflectionAnswers,
) {
  const row = await ownedAttempt(db, userId, attemptId);
  const clean = Object.fromEntries(
    Object.entries(answers)
      .map(([k, v]) => [k, typeof v === "string" ? v.trim().slice(0, 2000) : ""])
      .filter(([, v]) => v),
  ) as ActionReflectionAnswers;
  if (Object.keys(clean).length === 0) throw new ValidationError("Write at least one answer.");
  const [existing] = await db
    .select({ id: reflections.id })
    .from(reflections)
    .where(and(eq(reflections.userId, userId), eq(reflections.dailyActionAttemptId, attemptId)));
  if (existing) await db.update(reflections).set({ answers: clean }).where(eq(reflections.id, existing.id));
  else await db.insert(reflections).values({ userId, kind: "action", lessonId: row.action.lessonId, dailyActionAttemptId: attemptId, answers: clean });
  // XP is for actually reflecting: "ok" is saved but earns nothing.
  const words = Object.values(clean).reduce((n, v) => n + wordCount(v ?? ""), 0);
  const reward = await recordActivity(db, userId, today, {
    reason: "reflection_completed",
    amount: words >= MIN_REFLECTION_WORDS * 2 ? XP.reflection : 0,
    key: `reflection:action:${attemptId}`,
    sourceType: "daily_action",
    sourceId: row.action.id,
    skillKey: categorySkill(row.lessonCategory),
    skillGain: SKILL_GAINS.reflection,
  });

  const [plan] = await db.select({ journeyId: growthPlans.journeyId }).from(growthPlans).where(and(eq(growthPlans.userId, userId), eq(growthPlans.status, "active")));
  const outline = plan?.journeyId ? await getJourneyOutline(db, userId, plan.journeyId, today) : null;
  const next = outline?.todayLesson ?? outline?.nextLesson ?? null;
  const feedback = reflectionFeedback({ outcome: row.attempt.outcome, answers: clean, next: next ? { title: next.title } : null });
  return { reward, feedback };
}

/* ─────────────────────────── Spaced review ─────────────────────────── */

export async function getDueReviews(db: Executor, userId: string, today: ISODate, limit = 5) {
  return db
    .select({
      id: reviewItems.id,
      stage: reviewItems.stage,
      prompt: quizQuestions.prompt,
      options: quizQuestions.options,
      lessonTitle: lessons.title,
    })
    .from(reviewItems)
    .innerJoin(quizQuestions, eq(quizQuestions.id, reviewItems.quizQuestionId))
    .innerJoin(quizzes, eq(quizzes.id, quizQuestions.quizId))
    .innerJoin(lessons, eq(lessons.id, quizzes.lessonId))
    .where(and(eq(reviewItems.userId, userId), isNotNull(reviewItems.dueOn), lte(reviewItems.dueOn, today)))
    .orderBy(asc(reviewItems.dueOn), asc(reviewItems.stage))
    .limit(limit);
}

export async function answerReview(db: Executor, userId: string, today: ISODate, itemId: string, answer: number) {
  const [row] = await db
    .select({ item: reviewItems, question: quizQuestions, category: lessons.category })
    .from(reviewItems)
    .innerJoin(quizQuestions, eq(quizQuestions.id, reviewItems.quizQuestionId))
    .innerJoin(quizzes, eq(quizzes.id, quizQuestions.quizId))
    .innerJoin(lessons, eq(lessons.id, quizzes.lessonId))
    .where(and(eq(reviewItems.id, itemId), eq(reviewItems.userId, userId)));
  if (!row) throw new NotFoundError("Review not found.");
  if (!row.item.dueOn || row.item.dueOn > today) throw new ValidationError("This concept isn't due yet.");

  const correct = row.question.correctIndex === answer;
  const next = scheduleReview({ stage: row.item.stage, dueOn: row.item.dueOn, lapses: row.item.lapses }, correct, today);
  await db
    .update(reviewItems)
    .set({ stage: next.stage, dueOn: next.dueOn, lapses: next.lapses, lastReviewedAt: new Date() })
    .where(eq(reviewItems.id, itemId));
  const reward = await recordActivity(db, userId, today, {
    reason: "review_completed",
    amount: XP.review,
    key: `review:${itemId}:${today}`,
    sourceType: "review_item",
    sourceId: itemId,
    skillKey: categorySkill(row.category),
    skillGain: correct ? 1 : 0,
  });
  return { correct, correctIndex: row.question.correctIndex, explanation: row.question.explanation, nextDueOn: next.dueOn, reward };
}

/* ─────────────────────────── Roadmap ─────────────────────────── */

/** The plan's journeys in order (older plans without a stored roadmap fall back to catalogue order). */
export async function planRoadmap(db: Executor, plan: { roadmap: string[]; journeyId: string | null }) {
  const published = await db
    .select({ id: journeys.id, title: journeys.title, category: journeys.category })
    .from(journeys)
    .where(eq(journeys.status, "published"))
    .orderBy(asc(journeys.order));
  const byId = new Map(published.map((j) => [j.id, j]));
  const ids = plan.roadmap.length ? plan.roadmap.filter((id) => byId.has(id)) : [];
  for (const j of published) if (!ids.includes(j.id)) ids.push(j.id);
  if (plan.journeyId && ids.includes(plan.journeyId) && !plan.roadmap.length) {
    ids.splice(ids.indexOf(plan.journeyId), 1);
    ids.unshift(plan.journeyId);
  }
  return ids.map((id) => byId.get(id)!);
}

/** Enrols the learner in the next unfinished journey of their roadmap. */
export async function advanceRoadmap(db: Executor, userId: string, finishedJourneyId: string) {
  const [plan] = await db.select().from(growthPlans).where(and(eq(growthPlans.userId, userId), eq(growthPlans.status, "active")));
  if (!plan) return null;
  const done = new Set(
    (await db.select({ id: userJourneys.journeyId }).from(userJourneys).where(and(eq(userJourneys.userId, userId), eq(userJourneys.status, "completed")))).map((r) => r.id),
  );
  done.add(finishedJourneyId);
  const next = (await planRoadmap(db, plan)).find((j) => !done.has(j.id));
  if (!next) return null;
  await db
    .insert(userJourneys)
    .values({ userId, journeyId: next.id })
    .onConflictDoUpdate({ target: [userJourneys.userId, userJourneys.journeyId], set: { status: "active" } });
  await db.update(growthPlans).set({ journeyId: next.id }).where(eq(growthPlans.id, plan.id));
  return { id: next.id, title: next.title };
}

/* ─────────────────────────── Journey switching ─────────────────────────── */

export async function switchJourney(db: Executor, userId: string, journeyId: string) {
  const [journey] = await db.select().from(journeys).where(and(eq(journeys.id, journeyId), eq(journeys.status, "published")));
  if (!journey) throw new NotFoundError("Journey not found.");
  await db
    .insert(userJourneys)
    .values({ userId, journeyId })
    // A finished journey stays finished (it can be revisited, not reset).
    .onConflictDoUpdate({
      target: [userJourneys.userId, userJourneys.journeyId],
      set: { status: sql`case when ${userJourneys.status} = 'completed' then 'completed'::user_journey_status else 'active'::user_journey_status end` },
    });
  // Pause any other active journey: one focus at a time.
  const active = await db
    .select({ journeyId: userJourneys.journeyId })
    .from(userJourneys)
    .where(and(eq(userJourneys.userId, userId), eq(userJourneys.status, "active")));
  for (const a of active) {
    if (a.journeyId !== journeyId) {
      await db.update(userJourneys).set({ status: "paused" }).where(and(eq(userJourneys.userId, userId), eq(userJourneys.journeyId, a.journeyId)));
    }
  }
  await db
    .update(growthPlans)
    .set({ journeyId })
    .where(and(eq(growthPlans.userId, userId), or(eq(growthPlans.status, "active"))));
  return journey;
}
