import { and, asc, desc, eq } from "drizzle-orm";
import { beforeAll, describe, expect, it } from "vitest";
import { can } from "@/server/auth/rbac";
import type { DB } from "@/server/db";
import { auditLogs, exercises, lessons, quizzes, resources } from "@/server/db/schema";
import type { ExerciseConfig } from "@/server/db/types";
import { ForbiddenError, ValidationError } from "@/server/errors";
import { grantRole, registerUser } from "@/server/services/accounts";
import {
  adminErrorKey,
  getLessonAdmin,
  hasSpanish,
  listPracticeAdmin,
  listResourcesAdmin,
  mergeTranslation,
  saveJourney,
  saveLesson,
  saveLessonTranslation,
  saveModule,
  savePracticeTranslation,
  saveResource,
  saveResourceTranslation,
} from "@/server/services/admin";
import { lessonInputSchema } from "@/server/validation/content";
import { lessonTranslationSchema, practiceTranslationSchema, resourceTranslationSchema } from "@/server/validation/content-translations";
import { setupDatabase } from "./helpers";

type Role = "SUPER_ADMIN" | "ADMIN" | "CONTENT_MANAGER" | "COACH";

async function user(db: DB, email: string, roles: Role[] = []) {
  const r = await registerUser(db, { name: email.split("@")[0], email, password: "a long enough password" });
  if (!r.ok) throw new Error("dup");
  for (const role of roles) await grantRole(db, r.userId, role);
  return { id: r.userId, roles: ["USER", ...roles] };
}

const meta = {
  description: "",
  category: "communication",
  difficulty: "beginner" as const,
  estimatedMinutes: 30,
  order: 90,
  status: "draft" as const,
};

const CHOICE: ExerciseConfig = {
  type: "choice",
  scenario: "Your manager asks for an update.",
  question: "What do you say first?",
  options: [
    { text: "The bottom line.", quality: "best", feedback: "Lead with the point." },
    { text: "The full history.", quality: "weak", feedback: "Too slow." },
  ],
};

const CHOICE_ES = {
  type: "choice",
  scenario: "Tu jefa te pide una actualización.",
  question: "¿Qué dices primero?",
  options: [
    { text: "La conclusión.", quality: "best", feedback: "Empieza por lo importante." },
    { text: "Toda la historia.", quality: "weak", feedback: "Demasiado lento." },
  ],
} satisfies ExerciseConfig;

const CONTENT_ES = {
  hook: "Gancho",
  whyItMatters: "Por qué importa",
  coreConcept: { title: "Concepto", body: ["Párrafo"], keyPoints: ["Punto"] },
  expertInsight: { text: "Idea", source: "Investigación" },
  example: { situation: "S", before: "Antes", after: "Después", whyItWorks: "Funciona" },
  reflectionPrompt: "¿Dónde lo usarás?",
};

/** The Spanish lesson as the CMS form would send it, before validation. */
function lessonEs(overrides: Record<string, unknown> = {}) {
  const parsed = lessonTranslationSchema.parse({
    title: "Nueva lección",
    description: "",
    content: CONTENT_ES,
    exercise: { title: "Elige", description: "", config: CHOICE_ES },
    quiz: [{ conceptKey: "es-concept-one", prompt: "P1", options: ["x", "y"], explanation: "porque" }],
    action: { title: "Hazlo", description: "Hoy", successCriteria: "" },
    ...overrides,
  });
  return { ...parsed, exercise: { ...parsed.exercise, config: parsed.exercise.config as ExerciseConfig | null } };
}

async function latestAudit(db: DB, action: string, entityId: string) {
  const [row] = await db
    .select()
    .from(auditLogs)
    .where(and(eq(auditLogs.action, action), eq(auditLogs.entityId, entityId)))
    .orderBy(desc(auditLogs.createdAt))
    .limit(1);
  return row;
}

describe("CMS translations (Spanish)", () => {
  let db: DB;
  let admin: { id: string; roles: string[] };
  let cm: { id: string; roles: string[] };
  let coach: { id: string; roles: string[] };
  let learner: { id: string; roles: string[] };
  let lessonId: string;

  beforeAll(async () => {
    db = await setupDatabase();
    admin = await user(db, "i18n-admin@example.com", ["ADMIN"]);
    cm = await user(db, "i18n-cm@example.com", ["CONTENT_MANAGER"]);
    coach = await user(db, "i18n-coach@example.com", ["COACH"]);
    learner = await user(db, "i18n-learner@example.com");

    const j = await saveJourney(db, cm, null, { ...meta, slug: "i18n-journey", title: "I18n journey" });
    const m = await saveModule(db, cm, j.id, null, { ...meta, title: "I18n module", order: 1 });
    const lesson = await saveLesson(
      db,
      cm,
      m.id,
      null,
      lessonInputSchema.parse({
        ...meta,
        slug: "i18n-lesson",
        title: "A lesson to translate",
        estimatedMinutes: 8,
        order: 1,
        xpReward: 50,
        content: {
          hook: "Hook",
          whyItMatters: "Why",
          coreConcept: { title: "Concept", body: ["Para"], keyPoints: ["Point"] },
          expertInsight: { text: "Insight", source: "Research" },
          example: { situation: "S", before: "B", after: "A", whyItWorks: "W" },
          reflectionPrompt: "Where will you use this?",
        },
        exercise: { title: "Pick", description: "Pick one", config: CHOICE },
        quiz: [
          { prompt: "Q1", options: ["a", "b"], correctIndex: 0, explanation: "e1", conceptKey: "es-concept-one" },
          { prompt: "Q2", options: ["a", "b", "c"], correctIndex: 2, explanation: "e2", conceptKey: "es-concept-two" },
        ],
        action: { title: "Do it", description: "Today", successCriteria: "Done", difficulty: "beginner", estimatedMinutes: 5 },
      }),
    );
    lessonId = lesson.id;
  });

  it("saves a Spanish lesson (with exercise, quiz and mission), merging with existing keys and dropping empty fields", async () => {
    // Something already stored that the CMS doesn't manage must survive the edit.
    await db.update(lessons).set({ translations: { es: { title: "Vieja", legacyNote: "keep me" } } }).where(eq(lessons.id, lessonId));

    const { changed } = await saveLessonTranslation(db, cm, lessonId, lessonEs());
    expect(changed).toEqual(expect.arrayContaining(["title", "content", "exercise.title", "exercise.config", "quiz", "action.title", "action.description"]));

    const full = await getLessonAdmin(db, lessonId);
    const es = full.lesson.translations.es!;
    expect(es.title).toBe("Nueva lección");
    expect(es.legacyNote).toBe("keep me");
    expect(es).not.toHaveProperty("description"); // empty → English fallback
    expect(es.content).toEqual(CONTENT_ES);

    const exEs = full.exercise!.translations.es!;
    expect(exEs.title).toBe("Elige");
    expect(exEs).not.toHaveProperty("description");
    expect(exEs.config).toEqual(CHOICE_ES);

    const [q1, q2] = full.questions;
    expect(q1.translations.es).toEqual({ prompt: "P1", options: ["x", "y"], explanation: "porque" });
    expect(q2.translations.es).toBeUndefined(); // not translated → English
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.lessonId, lessonId));
    expect(quiz.translations.es?.title).toBe("Nueva lección — repaso rápido");

    const actEs = full.action!.translations.es!;
    expect(actEs).toEqual({ title: "Hazlo", description: "Hoy" });

    // English is untouched.
    expect(full.lesson.title).toBe("A lesson to translate");
    expect(full.exercise!.config).toEqual(CHOICE);

    const entry = await latestAudit(db, "lesson.translate", lessonId);
    expect(entry).toBeDefined();
    expect(entry.actorId).toBe(cm.id);
    expect(entry.entityType).toBe("lesson");
    expect(entry.metadata).toMatchObject({ locale: "es", fields: expect.arrayContaining(["title", "content", "quiz"]) });
  });

  it("re-saving an unchanged translation is a no-op; clearing every field removes the Spanish version", async () => {
    const before = await db.select({ id: auditLogs.id }).from(auditLogs).where(eq(auditLogs.action, "lesson.translate"));
    const again = await saveLessonTranslation(db, cm, lessonId, lessonEs());
    expect(again.changed).toEqual([]);
    const after = await db.select({ id: auditLogs.id }).from(auditLogs).where(eq(auditLogs.action, "lesson.translate"));
    expect(after.length).toBe(before.length);

    await db.update(lessons).set({ translations: { es: { title: "x" } } }).where(eq(lessons.id, lessonId));
    const cleared = lessonEs({
      title: "",
      content: null,
      exercise: { title: "", description: "", config: null },
      quiz: null,
      action: { title: "", description: "", successCriteria: "" },
    });
    await saveLessonTranslation(db, cm, lessonId, cleared);
    const full = await getLessonAdmin(db, lessonId);
    expect(hasSpanish(full.lesson.translations)).toBe(false);
    expect(full.lesson.translations).not.toHaveProperty("es");
    expect(hasSpanish(full.exercise!.translations)).toBe(false);
    expect(full.questions.every((q) => !hasSpanish(q.translations))).toBe(true);
    expect(hasSpanish(full.action!.translations)).toBe(false);
  });

  it("validates Spanish structured fields against the English answer key and writes nothing on error", async () => {
    const snapshot = await db.select({ t: lessons.translations }).from(lessons).where(eq(lessons.id, lessonId));
    const wrongType = lessonEs({ exercise: { title: "x", description: "", config: { type: "order", instruction: "Ordena", items: ["a", "b", "c"], explanation: "e" } } });
    const err = await saveLessonTranslation(db, cm, lessonId, wrongType).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ValidationError);
    expect(adminErrorKey(err)).toEqual({ key: "admin.errors.esConfigType", vars: { type: "choice" } });

    const swapped = { ...CHOICE_ES, options: [CHOICE_ES.options[1], CHOICE_ES.options[0]] };
    await expect(saveLessonTranslation(db, cm, lessonId, lessonEs({ exercise: { title: "x", description: "", config: swapped } }))).rejects.toBeInstanceOf(ValidationError);

    await expect(
      saveLessonTranslation(db, cm, lessonId, lessonEs({ quiz: [{ conceptKey: "not-a-concept", prompt: "P", options: ["x", "y"], explanation: "e" }] })),
    ).rejects.toBeInstanceOf(ValidationError);
    await expect(
      saveLessonTranslation(db, cm, lessonId, lessonEs({ quiz: [{ conceptKey: "es-concept-two", prompt: "P", options: ["x", "y"], explanation: "e" }] })),
    ).rejects.toBeInstanceOf(ValidationError);

    // Lesson content gets the same structural validation as English.
    expect(() => lessonTranslationSchema.parse({ ...lessonEs(), content: { ...CONTENT_ES, hook: "" } })).toThrow();

    const [unchanged] = await db.select({ t: lessons.translations }).from(lessons).where(eq(lessons.id, lessonId));
    expect(unchanged.t).toEqual(snapshot[0].t);
  });

  it("saves a Spanish resource translation, drops empty fields, flags missing Spanish in lists and audits it", async () => {
    const resource = await saveResource(db, cm, null, { ...meta, slug: "i18n-resource", title: "Feedback that lands", type: "framework", body: "English body" });
    let list = await listResourcesAdmin(db);
    expect(list.find((r) => r.id === resource.id)?.hasEs).toBe(false);

    const es = resourceTranslationSchema.parse({ title: "  Retroalimentación que llega  ", description: "", body: "Cuerpo en español" });
    const { changed } = await saveResourceTranslation(db, cm, resource.id, es);
    expect(changed.sort()).toEqual(["body", "title"]);

    const [row] = await db.select().from(resources).where(eq(resources.id, resource.id));
    expect(row.translations).toEqual({ es: { title: "Retroalimentación que llega", body: "Cuerpo en español" } });
    expect(row.title).toBe("Feedback that lands");
    expect(row.body).toBe("English body");

    list = await listResourcesAdmin(db);
    expect(list.find((r) => r.id === resource.id)?.hasEs).toBe(true);

    const entry = await latestAudit(db, "resource.translate", resource.id);
    expect(entry?.metadata).toEqual({ locale: "es", fields: ["title", "body"] });

    // Emptying the body later falls back to English for that field only.
    await saveResourceTranslation(db, cm, resource.id, resourceTranslationSchema.parse({ title: "Retroalimentación que llega", body: "" }));
    const [after] = await db.select().from(resources).where(eq(resources.id, resource.id));
    expect(after.translations).toEqual({ es: { title: "Retroalimentación que llega" } });
  });

  it("keeps RBAC: non-content roles can't translate, and live content stays admin-only", async () => {
    expect(can(coach.roles, "content:write")).toBe(false);
    expect(can(learner.roles, "content:write")).toBe(false);
    const es = resourceTranslationSchema.parse({ title: "Título" });
    const resource = await saveResource(db, admin, null, { ...meta, slug: "i18n-live-resource", title: "Live resource", type: "insight", body: "Body", status: "published" });

    for (const actor of [coach, learner]) {
      await expect(saveResourceTranslation(db, actor, resource.id, es)).rejects.toBeInstanceOf(ForbiddenError);
      await expect(saveLessonTranslation(db, actor, lessonId, lessonEs())).rejects.toBeInstanceOf(ForbiddenError);
    }
    // Content managers can't change what learners see right now — in any language.
    const err = await saveResourceTranslation(db, cm, resource.id, es).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ForbiddenError);
    expect(adminErrorKey(err)?.key).toBe("admin.errors.liveLocked");
    // Admins can.
    await saveResourceTranslation(db, admin, resource.id, es);
    const [row] = await db.select().from(resources).where(eq(resources.id, resource.id));
    expect(row.translations.es).toEqual({ title: "Título" });

    const rejected = await db.select().from(auditLogs).where(and(eq(auditLogs.action, "resource.translate"), eq(auditLogs.actorId, coach.id)));
    expect(rejected).toHaveLength(0);
  });

  it("practice tool translations keep the English answer key", async () => {
    const tool = (await listPracticeAdmin(db))[0];
    const [row] = await db.select().from(exercises).where(eq(exercises.id, tool.id));
    const other: ExerciseConfig =
      row.config.type === "pitch"
        ? { type: "order", instruction: "Ordena", items: ["a", "b", "c"], explanation: "e" }
        : { type: "pitch", briefing: "b", audiences: ["a"], objectives: ["o"], durations: [2], suggestedTopics: ["t"] };
    await expect(savePracticeTranslation(db, admin, tool.id, { title: "x", description: "", config: other })).rejects.toBeInstanceOf(ValidationError);
    const parsed = practiceTranslationSchema.parse({ title: "Herramienta", description: "", config: null });
    await savePracticeTranslation(db, admin, tool.id, { ...parsed, config: null });
    const [after] = await db.select().from(exercises).where(eq(exercises.id, tool.id));
    expect(after.translations.es?.title).toBe("Herramienta");
    expect(await latestAudit(db, "practice.translate", tool.id)).toBeDefined();
  });

  it("seeded Spanish content round-trips through the CMS validation unchanged", async () => {
    // Mirrors the save actions: configs are validated, then stored exactly as written.
    const sa = await user(db, "i18n-root@example.com", ["SUPER_ADMIN"]);
    const rows = await db.select().from(lessons).orderBy(asc(lessons.slug));
    const translated = rows.filter((l) => hasSpanish(l.translations) && l.slug !== "i18n-lesson");
    for (const l of translated) {
      const full = await getLessonAdmin(db, l.id);
      const es = l.translations.es as Record<string, unknown>;
      const ex = (full.exercise && full.exercise.status !== "archived" ? (full.exercise.translations.es ?? {}) : {}) as Record<string, unknown>;
      const act = (full.action?.translations.es ?? {}) as Record<string, unknown>;
      const quiz = full.questions
        .filter((q) => hasSpanish(q.translations))
        .map((q) => ({ conceptKey: q.conceptKey, ...(q.translations.es as Record<string, unknown>) }));
      const result = lessonTranslationSchema.safeParse({
        title: es.title ?? "",
        description: es.description ?? "",
        content: es.content ?? null,
        exercise: { title: ex.title ?? "", description: ex.description ?? "", config: ex.config ?? null },
        quiz: quiz.length ? quiz : null,
        action: { title: act.title ?? "", description: act.description ?? "", successCriteria: act.successCriteria ?? "" },
      });
      expect(result.success ? "ok" : `${l.slug}: ${result.error.issues[0]?.path.join(".")} ${result.error.issues[0]?.message}`).toBe("ok");
      if (!result.success) continue;
      const { changed } = await saveLessonTranslation(db, sa, l.id, { ...result.data, exercise: { ...result.data.exercise, config: (ex.config ?? null) as ExerciseConfig | null } });
      expect(changed, l.slug).toEqual([]);
    }

    const tools = await db.select().from(exercises).where(eq(exercises.isPractice, true));
    for (const tool of tools.filter((x) => hasSpanish(x.translations))) {
      const es = tool.translations.es as Record<string, unknown>;
      const result = practiceTranslationSchema.safeParse({ title: es.title ?? "", description: es.description ?? "", config: es.config ?? null });
      expect(result.success ? "ok" : `${tool.slug}: ${result.error.issues[0]?.path.join(".")} ${result.error.issues[0]?.message}`).toBe("ok");
      if (!result.success) continue;
      const { changed } = await savePracticeTranslation(db, sa, tool.id, { ...result.data, config: (es.config ?? null) as ExerciseConfig | null });
      expect(changed, tool.slug).toEqual([]);
    }

    const library = await db.select().from(resources).where(eq(resources.status, "published"));
    for (const r of library.filter((x) => hasSpanish(x.translations))) {
      const es = r.translations.es as Record<string, unknown>;
      const result = resourceTranslationSchema.safeParse({ title: es.title ?? "", description: es.description ?? "", body: es.body ?? "" });
      expect(result.success ? "ok" : `${r.slug}: ${result.error.issues[0]?.message}`).toBe("ok");
    }
  });

  it("mergeTranslation ignores key order and never leaves an empty `es`", () => {
    const current = { es: { content: { b: 1, a: 2 } } };
    expect(mergeTranslation(current, { content: { a: 2, b: 1 } }).changed).toEqual([]);
    expect(mergeTranslation(current, { content: null }).next).toEqual({});
    expect(mergeTranslation({}, { title: "   " })).toEqual({ next: {}, changed: [] });
  });
});
