import { and, eq } from "drizzle-orm";
import { closeDb, type DB, getDb } from "@/server/db";
import { exercises, quizQuestions, quizzes } from "@/server/db/schema";
import type { ExerciseConfig } from "@/server/db/types";
import { toClientConfig } from "@/server/engine/client-config";
import { completeLesson, submitExercise, submitQuiz } from "@/server/services/learning";
import { migrateDatabase } from "@/server/db/migrate";
import { seedAll } from "@/server/db/seed";
import { registerUser } from "@/server/services/accounts";
import { completeOnboarding } from "@/server/services/onboarding";

/** Fresh in-memory Postgres (PGlite) with migrations and seed content. */
export async function setupDatabase() {
  delete process.env.DATABASE_URL;
  process.env.PGLITE_DIR = "memory://";
  await closeDb();
  await migrateDatabase();
  const db = getDb();
  await db.transaction((tx) => seedAll(tx));
  return db;
}

export const ONBOARDING = {
  goals: ["communication", "confidence", "networking"],
  primary_goal: "communication",
  situations: ["meetings", "presentations"],
  level: "intermediate",
  minutes: 15,
  frequency: "daily",
  challenge: "express",
  ninety_day_goal: "Present to leadership without notes and get a decision.",
  rate_communication: 2,
  rate_confidence: 3,
  rate_leadership: 3,
  rate_social_skills: 2,
  rate_networking: 1,
  rate_intelligence: 4,
};

let counter = 0;

export async function createLearner(today: string, overrides: Partial<typeof ONBOARDING> = {}) {
  const db = getDb();
  counter++;
  const email = `learner${counter}-${Date.now()}@example.com`;
  const reg = await registerUser(db, { name: `Juan ${counter}`, email, password: "a long enough password", timezone: "America/Lima" });
  if (!reg.ok) throw new Error("registration failed");
  await db.transaction((tx) => completeOnboarding(tx, { id: reg.userId, name: `Juan ${counter}` }, today, { ...ONBOARDING, ...overrides }));
  return { userId: reg.userId, email };
}

/** A strong response for any lesson exercise type, in the shape the client would send. */
export function responseFor(config: ExerciseConfig, exerciseId: string): unknown {
  switch (config.type) {
    case "choice":
      return { selected: config.options.findIndex((o) => o.quality === "best") };
    case "rewrite":
      return { text: config.modelAnswer };
    case "order": {
      // The client only sees opaque item keys; send them in the canonical order.
      const client = toClientConfig(config, exerciseId) as { items: { key: string; text: string }[] };
      return { order: config.items.map((text) => client.items.find((i) => i.text === text)!.key) };
    }
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

/** Does the whole lesson like a learner would: exercise, knowledge check, completion. */
export async function finishLesson(db: DB, userId: string, day: string, lessonId: string) {
  const [ex] = await db.select().from(exercises).where(and(eq(exercises.lessonId, lessonId), eq(exercises.status, "published")));
  if (ex) await db.transaction((tx) => submitExercise(tx, userId, day, ex.id, responseFor(ex.config, ex.id), 60));
  const [quiz] = await db.select().from(quizzes).where(eq(quizzes.lessonId, lessonId));
  if (quiz) {
    const qs = (await db.select().from(quizQuestions).where(eq(quizQuestions.quizId, quiz.id))).sort((a, b) => a.order - b.order);
    await db.transaction((tx) => submitQuiz(tx, userId, day, quiz.id, qs.map((q) => q.correctIndex)));
  }
  return db.transaction((tx) => completeLesson(tx, userId, day, lessonId, {}));
}
