import { closeDb, getDb } from "@/server/db";
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
