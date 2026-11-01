import { eq } from "drizzle-orm";
import { beforeAll, describe, expect, it } from "vitest";
import type { DB } from "@/server/db";
import { analyticsEvents, lessons, quizQuestions, quizzes, reviewItems, users } from "@/server/db/schema";
import { ForbiddenError, ValidationError } from "@/server/errors";
import { grantRole, registerUser } from "@/server/services/accounts";
import { getJourneyAdmin, getLessonAdmin, getMetrics, listJourneysAdmin, listUsers, saveJourney, saveLesson, saveModule, setUserRole, setUserStatus } from "@/server/services/admin";
import { submitQuiz } from "@/server/services/learning";
import { getHomeData } from "@/server/services/home";
import { lessonInputSchema } from "@/server/validation/content";
import { createLearner, setupDatabase } from "./helpers";

async function user(db: DB, email: string, roles: ("SUPER_ADMIN" | "ADMIN" | "CONTENT_MANAGER" | "COACH")[] = []) {
  const r = await registerUser(db, { name: email.split("@")[0], email, password: "a long enough password" });
  if (!r.ok) throw new Error("dup");
  for (const role of roles) await grantRole(db, r.userId, role);
  return { id: r.userId, roles: ["USER", ...roles] };
}

const journeyFields = {
  slug: "test-journey",
  title: "Test journey",
  description: "",
  category: "communication",
  difficulty: "beginner" as const,
  estimatedMinutes: 60,
  order: 99,
  status: "draft" as const,
};

describe("admin back office", () => {
  let db: DB;
  beforeAll(async () => {
    db = await setupDatabase();
  });

  it("lets content managers draft and submit for review, but only admins publish", async () => {
    const cm = await user(db, "cm@example.com", ["CONTENT_MANAGER"]);
    const admin = await user(db, "admin@example.com", ["ADMIN"]);
    const j = await saveJourney(db, cm, null, journeyFields);
    expect(j.status).toBe("draft");
    await saveJourney(db, cm, j.id, { ...journeyFields, status: "review" });
    await expect(saveJourney(db, cm, j.id, { ...journeyFields, status: "published" })).rejects.toBeInstanceOf(ForbiddenError);
    const published = await saveJourney(db, admin, j.id, { ...journeyFields, status: "published" });
    expect(published.publishedAt).toBeInstanceOf(Date);
    // A content manager can't silently unpublish either.
    await expect(saveJourney(db, cm, j.id, { ...journeyFields, status: "draft" })).rejects.toBeInstanceOf(ForbiddenError);
    await expect(saveJourney(db, admin, null, journeyFields)).rejects.toBeInstanceOf(ValidationError); // duplicate slug
  });

  it("validates lesson structure and keeps learners' review history when questions are edited", async () => {
    const admin = await user(db, "editor@example.com", ["ADMIN"]);
    const j = await saveJourney(db, admin, null, { ...journeyFields, slug: "editable", status: "published" });
    const m = await saveModule(db, admin, j.id, null, { ...journeyFields, status: "published", order: 1 });
    const input = lessonInputSchema.parse({
      title: "A new lesson",
      slug: "a-new-lesson",
      description: "One idea.",
      category: "communication",
      difficulty: "beginner",
      estimatedMinutes: 8,
      order: 1,
      status: "published",
      xpReward: 50,
      content: {
        hook: "Hook",
        whyItMatters: "Why",
        coreConcept: { title: "Concept", body: ["Para"], keyPoints: ["Point"] },
        expertInsight: { text: "Insight", source: "Research" },
        example: { situation: "S", before: "B", after: "A", whyItWorks: "W" },
        reflectionPrompt: "Where will you use this?",
      },
      exercise: { title: "Pick", description: "", config: { type: "order", instruction: "Order", items: ["a", "b", "c"], explanation: "e" } },
      quiz: [{ prompt: "Q1", options: ["x", "y"], correctIndex: 1, explanation: "e", conceptKey: "test-concept" }],
      action: { title: "Do it", description: "Today", difficulty: "beginner", estimatedMinutes: 5 },
    });
    const lesson = await saveLesson(db, admin, m.id, null, input);
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.lessonId, lesson.id));
    const [q] = await db.select().from(quizQuestions).where(eq(quizQuestions.quizId, quiz.id));

    // Bad configs are rejected before they can reach learners.
    expect(() =>
      lessonInputSchema.parse({ ...input, exercise: { title: "x", description: "", config: { type: "choice", scenario: "s", question: "q", options: [{ text: "a", quality: "ok", feedback: "f" }, { text: "b", quality: "ok", feedback: "f" }] } } }),
    ).toThrow(/best/);
    expect(() => lessonInputSchema.parse({ ...input, estimatedMinutes: 40 })).toThrow();

    // Rewording a question keeps its id (matched by concept key).
    await saveLesson(db, admin, m.id, lesson.id, { ...input, quiz: [{ ...input.quiz![0], prompt: "Q1 reworded" }] });
    const [after] = await db.select().from(quizQuestions).where(eq(quizQuestions.quizId, quiz.id));
    expect(after.id).toBe(q.id);
    expect(after.prompt).toBe("Q1 reworded");
    const full = await getLessonAdmin(db, lesson.id);
    expect(full.exercise?.config.type).toBe("order");
    expect(full.action?.title).toBe("Do it");
  });

  it("protects role management", async () => {
    const sa = await user(db, "root@example.com", ["SUPER_ADMIN"]);
    const admin = await user(db, "admin2@example.com", ["ADMIN"]);
    const learner = await user(db, "learner@example.com");
    await setUserRole(db, admin, learner.id, "COACH", true, null);
    await expect(setUserRole(db, admin, learner.id, "ADMIN", true, null)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(setUserRole(db, admin, sa.id, "COACH", true, null)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(setUserRole(db, admin, admin.id, "COACH", true, null)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(setUserStatus(db, admin, sa.id, "suspended", null)).rejects.toBeInstanceOf(ForbiddenError);
    await setUserRole(db, sa, admin.id, "SUPER_ADMIN", true, null);
    await setUserRole(db, sa, admin.id, "SUPER_ADMIN", false, null);
    await expect(setUserRole(db, sa, learner.id, "USER", false, null)).rejects.toBeInstanceOf(ValidationError);
  });

  it("lists content and users with correct counts", async () => {
    const list = await listJourneysAdmin(db);
    const cm = list.find((j) => j.slug === "communication-mastery")!;
    expect(cm.modules).toBe(3);
    expect(cm.lessons).toBe(9);
    const detail = await getJourneyAdmin(db, cm.id);
    expect(detail.modules.map((m) => m.lessons)).toEqual([3, 4, 2]);
    const { rows } = await listUsers(db, { q: "admin" });
    expect(rows.some((r) => r.roles.includes("ADMIN"))).toBe(true);
  });

  it("computes dashboard metrics from real activity", async () => {
    const { userId } = await createLearner("2026-03-02");
    // A learner who signed up 10 days ago and came back 8 days later counts as retained.
    await db.update(users).set({ createdAt: new Date(Date.now() - 10 * 86_400_000) }).where(eq(users.id, userId));
    await db.insert(analyticsEvents).values({ userId, name: "app_opened", createdAt: new Date(Date.now() - 2 * 86_400_000) });
    const m = await getMetrics(db);
    expect(m.registered).toBeGreaterThan(0);
    expect(m.onboarded).toBeGreaterThan(0);
    expect(m.funnel[0].label).toBe("Registered");
    expect(m.activeJourneys.length).toBeGreaterThan(0);
    expect(m.retention.cohort).toBeGreaterThanOrEqual(1);
    expect(m.retention.retained).toBeGreaterThanOrEqual(1);
  });

  it("removing a question from a lesson cleans up its review items", async () => {
    const admin = await user(db, "editor2@example.com", ["ADMIN"]);
    const { userId } = await createLearner("2026-03-02");
    const home = (await getHomeData(db, userId, "2026-03-02"))!;
    const lessonId = home.todayLesson!.id;
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.lessonId, lessonId));
    const qs = await db.select().from(quizQuestions).where(eq(quizQuestions.quizId, quiz.id));
    await submitQuiz(db, userId, "2026-03-02", quiz.id, qs.map(() => 0));
    const full = await getLessonAdmin(db, lessonId);
    const [l] = await db.select().from(lessons).where(eq(lessons.id, lessonId));
    const keep = full.questions.slice(0, 2).map(({ prompt, options, correctIndex, explanation, conceptKey }) => ({ prompt, options, correctIndex, explanation, conceptKey }));
    await saveLesson(db, admin, full.module.id, lessonId, lessonInputSchema.parse({
      ...l,
      description: l.description,
      content: l.content,
      exercise: full.exercise ? { title: full.exercise.title, description: full.exercise.description, config: full.exercise.config } : null,
      quiz: keep,
      action: full.action ? { title: full.action.title, description: full.action.description, difficulty: full.action.difficulty, estimatedMinutes: full.action.estimatedMinutes } : null,
    }));
    const items = await db.select().from(reviewItems).where(eq(reviewItems.userId, userId));
    expect(items).toHaveLength(2);
  });
});
