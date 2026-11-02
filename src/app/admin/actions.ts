"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getTranslator } from "@/i18n/server";
import type { TFunction } from "@/i18n/translate";
import { getRequestMeta, requirePermission } from "@/server/auth/current-user";
import { isRoleKey } from "@/server/auth/rbac";
import { getDb } from "@/server/db";
import type { ExerciseConfig } from "@/server/db/types";
import { AppError, ValidationError } from "@/server/errors";
import {
  adminErrorKey,
  saveJourney,
  saveJourneyTranslation,
  saveLesson,
  saveLessonTranslation,
  saveModule,
  saveModuleTranslation,
  savePractice,
  savePracticeTranslation,
  saveResource,
  saveResourceTranslation,
  setUserRole,
  setUserStatus,
} from "@/server/services/admin";
import { uuidSchema } from "@/server/validation";
import {
  journeyInputSchema,
  lessonInputSchema,
  moduleInputSchema,
  practiceInputSchema,
  resourceInputSchema,
} from "@/server/validation/content";
import {
  journeyTranslationSchema,
  lessonTranslationSchema,
  moduleTranslationSchema,
  practiceTranslationSchema,
  resourceTranslationSchema,
} from "@/server/validation/content-translations";
import type { AdminFormState } from "./form";

const s = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return typeof v === "string" ? v : "";
};
const lines = (v: string) => v.split("\n").map((l) => l.trim()).filter(Boolean);
const paragraphs = (v: string) => v.split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, " ").trim()).filter(Boolean);
const optionalId = (v: string) => (v ? uuidSchema.parse(v) : null);

function meta(fd: FormData) {
  return {
    title: s(fd, "title"),
    slug: s(fd, "slug"),
    description: s(fd, "description"),
    category: s(fd, "category"),
    difficulty: s(fd, "difficulty"),
    estimatedMinutes: s(fd, "estimatedMinutes"),
    order: s(fd, "order"),
    status: s(fd, "status"),
  };
}

function parseJson(t: TFunction, label: string, text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    throw new AppError(t("admin.actions.invalidJson", { label }), 400, "invalid");
  }
}

function describe(t: TFunction, e: z.ZodError): string {
  const issue = e.issues[0];
  return issue ? `${issue.path.join(".") || "form"}: ${issue.message}` : t("admin.actions.invalidInput");
}

/** Parses the Spanish half of a form; problems are reported as "Spanish · field: message". */
function parseSpanish<S extends z.ZodType>(t: TFunction, schema: S, data: unknown): z.output<S> {
  const result = schema.safeParse(data);
  if (!result.success) throw new ValidationError(`${t("admin.lang.errorPrefix")} · ${describe(t, result.error)}`);
  return result.data;
}

/** Forms that render the "Español" tab send `es_title`; older/partial forms leave translations alone. */
const hasSpanish = (fd: FormData) => fd.has("es_title");

async function run(t: TFunction, fn: () => Promise<AdminFormState | void>): Promise<AdminFormState> {
  try {
    return (await fn()) ?? { ok: t("common.saved") };
  } catch (e) {
    if (e instanceof AppError) {
      const keyed = adminErrorKey(e);
      return { error: keyed ? t(keyed.key, keyed.vars) : e.message };
    }
    if (e instanceof z.ZodError) return { error: describe(t, e) };
    throw e;
  }
}

/* ─────────────────────────── Spanish form fields ─────────────────────────── */

function spanishMeta(fd: FormData) {
  return { title: s(fd, "es_title"), description: s(fd, "es_description") };
}

function spanishConfig(t: TFunction, fd: FormData, field: string, label: string): unknown {
  const text = s(fd, field).trim();
  return text ? parseJson(t, label, text) : null;
}

const ES_CONTENT_FIELDS = ["es_hook", "es_whyItMatters", "es_conceptTitle", "es_conceptBody", "es_keyPoints", "es_insightText", "es_exSituation", "es_exBefore", "es_exAfter", "es_exWhy", "es_reflectionPrompt"];

/** Spanish lesson content: all of it or none (a half-translated lesson can't be shown). */
function spanishLessonContent(fd: FormData) {
  if (!ES_CONTENT_FIELDS.some((k) => s(fd, k).trim())) return null;
  return {
    hook: s(fd, "es_hook"),
    whyItMatters: s(fd, "es_whyItMatters"),
    coreConcept: { title: s(fd, "es_conceptTitle"), body: paragraphs(s(fd, "es_conceptBody")), keyPoints: lines(s(fd, "es_keyPoints")) },
    expertInsight: {
      text: s(fd, "es_insightText"),
      // Sources are usually names; empty keeps the English one.
      source: s(fd, "es_insightSource").trim() || s(fd, "insightSource"),
      sourceDetail: s(fd, "es_insightDetail").trim() || s(fd, "insightDetail") || undefined,
    },
    example: { situation: s(fd, "es_exSituation"), before: s(fd, "es_exBefore"), after: s(fd, "es_exAfter"), whyItWorks: s(fd, "es_exWhy") },
    reflectionPrompt: s(fd, "es_reflectionPrompt"),
  };
}

/* ─────────────────────────── Content ─────────────────────────── */

export async function saveJourneyAction(_prev: AdminFormState, fd: FormData): Promise<AdminFormState> {
  const actor = await requirePermission("content:write");
  const { t } = await getTranslator();
  let createdId: string | null = null;
  const result = await run(t, async () => {
    const id = optionalId(s(fd, "id"));
    const v = journeyInputSchema.parse({ ...meta(fd), subtitle: s(fd, "subtitle") });
    const es = hasSpanish(fd) ? parseSpanish(t, journeyTranslationSchema, { ...spanishMeta(fd), subtitle: s(fd, "es_subtitle") }) : null;
    const row = await getDb().transaction(async (tx) => {
      const saved = await saveJourney(tx, actor, id, v);
      if (es) await saveJourneyTranslation(tx, actor, saved.id, es);
      return saved;
    });
    if (!id) createdId = row.id;
    revalidatePath("/admin/content");
  });
  if (createdId) redirect(`/admin/content/journeys/${createdId}`);
  return result;
}

export async function saveModuleAction(_prev: AdminFormState, fd: FormData): Promise<AdminFormState> {
  const actor = await requirePermission("content:write");
  const { t } = await getTranslator();
  return run(t, async () => {
    const journeyId = uuidSchema.parse(s(fd, "journeyId"));
    const id = optionalId(s(fd, "id"));
    const v = moduleInputSchema.parse(meta(fd));
    const es = hasSpanish(fd) ? parseSpanish(t, moduleTranslationSchema, spanishMeta(fd)) : null;
    await getDb().transaction(async (tx) => {
      const saved = await saveModule(tx, actor, journeyId, id, v);
      if (es) await saveModuleTranslation(tx, actor, saved.id, es);
    });
    revalidatePath(`/admin/content/journeys/${journeyId}`);
    if (id) revalidatePath(`/admin/content/modules/${id}`);
    return { ok: t(id ? "admin.actions.moduleSaved" : "admin.actions.moduleAdded") };
  });
}

export async function saveLessonAction(_prev: AdminFormState, fd: FormData): Promise<AdminFormState> {
  const actor = await requirePermission("content:write");
  const { t } = await getTranslator();
  let createdId: string | null = null;
  const result = await run(t, async () => {
    const moduleId = uuidSchema.parse(s(fd, "moduleId"));
    const id = optionalId(s(fd, "id"));
    const exerciseConfig = s(fd, "exerciseConfig").trim();
    const quiz = s(fd, "quiz").trim();
    const v = lessonInputSchema.parse({
      ...meta(fd),
      xpReward: s(fd, "xpReward") || "50",
      content: {
        hook: s(fd, "hook"),
        whyItMatters: s(fd, "whyItMatters"),
        coreConcept: { title: s(fd, "conceptTitle"), body: paragraphs(s(fd, "conceptBody")), keyPoints: lines(s(fd, "keyPoints")) },
        expertInsight: { text: s(fd, "insightText"), source: s(fd, "insightSource"), sourceDetail: s(fd, "insightDetail") || undefined },
        example: { situation: s(fd, "exSituation"), before: s(fd, "exBefore"), after: s(fd, "exAfter"), whyItWorks: s(fd, "exWhy") },
        reflectionPrompt: s(fd, "reflectionPrompt"),
      },
      exercise: exerciseConfig
        ? { title: s(fd, "exerciseTitle"), description: s(fd, "exerciseDescription"), config: parseJson(t, t("admin.lesson.exerciseConfigName"), exerciseConfig) }
        : null,
      quiz: quiz ? parseJson(t, t("admin.lesson.quizName"), quiz) : null,
      action: s(fd, "actionTitle").trim()
        ? {
            title: s(fd, "actionTitle"),
            description: s(fd, "actionDescription"),
            successCriteria: s(fd, "actionCriteria") || undefined,
            difficulty: s(fd, "actionDifficulty") || "beginner",
            estimatedMinutes: s(fd, "actionMinutes") || "10",
          }
        : null,
    });
    const esConfig = hasSpanish(fd) ? spanishConfig(t, fd, "es_exerciseConfig", t("admin.lesson.es.exerciseConfigName")) : null;
    const es = hasSpanish(fd)
      ? parseSpanish(t, lessonTranslationSchema, {
          ...spanishMeta(fd),
          content: spanishLessonContent(fd),
          exercise: { title: s(fd, "es_exerciseTitle"), description: s(fd, "es_exerciseDescription"), config: esConfig },
          quiz: spanishConfig(t, fd, "es_quiz", t("admin.lesson.es.quizName")),
          action: { title: s(fd, "es_actionTitle"), description: s(fd, "es_actionDescription"), successCriteria: s(fd, "es_actionCriteria") },
        })
      : null;
    const row = await getDb().transaction(async (tx) => {
      const saved = await saveLesson(tx, actor, moduleId, id, v);
      if (es) {
        // The config is stored as written once it validates: the schema trims strings, and
        // whitespace can matter (e.g. rewrite keywords like "te " match whole words).
        await saveLessonTranslation(tx, actor, saved.id, { ...es, exercise: { ...es.exercise, config: esConfig as ExerciseConfig | null } });
      }
      return saved;
    });
    if (!id) createdId = row.id;
    revalidatePath(`/admin/content/modules/${moduleId}`);
    revalidatePath(`/admin/content/lessons/${row.id}`);
  });
  if (createdId) redirect(`/admin/content/lessons/${createdId}`);
  return result;
}

export async function saveResourceAction(_prev: AdminFormState, fd: FormData): Promise<AdminFormState> {
  const actor = await requirePermission("content:write");
  const { t } = await getTranslator();
  let createdId: string | null = null;
  const result = await run(t, async () => {
    const id = optionalId(s(fd, "id"));
    const v = resourceInputSchema.parse({ ...meta(fd), type: s(fd, "type"), body: s(fd, "body"), url: s(fd, "url") });
    const es = hasSpanish(fd) ? parseSpanish(t, resourceTranslationSchema, { ...spanishMeta(fd), body: s(fd, "es_body") }) : null;
    const row = await getDb().transaction(async (tx) => {
      const saved = await saveResource(tx, actor, id, v);
      if (es) await saveResourceTranslation(tx, actor, saved.id, es);
      return saved;
    });
    if (!id) createdId = row.id;
    revalidatePath("/admin/content/resources");
    revalidatePath(`/admin/content/resources/${row.id}`);
  });
  if (createdId) redirect(`/admin/content/resources/${createdId}`);
  return result;
}

export async function savePracticeAction(_prev: AdminFormState, fd: FormData): Promise<AdminFormState> {
  const actor = await requirePermission("content:write");
  const { t } = await getTranslator();
  let createdId: string | null = null;
  const result = await run(t, async () => {
    const id = optionalId(s(fd, "id"));
    const v = practiceInputSchema.parse({ ...meta(fd), config: parseJson(t, t("admin.practice.configName"), s(fd, "config")) });
    const esConfig = hasSpanish(fd) ? spanishConfig(t, fd, "es_config", t("admin.practice.esConfigName")) : null;
    const es = hasSpanish(fd) ? parseSpanish(t, practiceTranslationSchema, { ...spanishMeta(fd), config: esConfig }) : null;
    const row = await getDb().transaction(async (tx) => {
      const saved = await savePractice(tx, actor, id, { ...v, config: v.config as ExerciseConfig });
      // Stored as written once validated (see saveLessonAction).
      if (es) await savePracticeTranslation(tx, actor, saved.id, { ...es, config: esConfig as ExerciseConfig | null });
      return saved;
    });
    if (!id) createdId = row.id;
    revalidatePath("/admin/content/practice");
    revalidatePath(`/admin/content/practice/${row.id}`);
  });
  if (createdId) redirect(`/admin/content/practice/${createdId}`);
  return result;
}

/* ─────────────────────────── Users ─────────────────────────── */

export async function userRoleAction(_prev: AdminFormState, fd: FormData): Promise<AdminFormState> {
  const actor = await requirePermission("users:manage");
  const { t } = await getTranslator();
  return run(t, async () => {
    const userId = uuidSchema.parse(s(fd, "userId"));
    const role = s(fd, "role");
    if (!isRoleKey(role)) throw new AppError(t("admin.actions.unknownRole"), 400, "invalid");
    const { ipAddress } = await getRequestMeta();
    await getDb().transaction((tx) => setUserRole(tx, actor, userId, role, s(fd, "grant") === "1", ipAddress));
    revalidatePath(`/admin/users/${userId}`);
    return { ok: t("admin.actions.updated") };
  });
}

export async function userStatusAction(_prev: AdminFormState, fd: FormData): Promise<AdminFormState> {
  const actor = await requirePermission("users:manage");
  const { t } = await getTranslator();
  return run(t, async () => {
    const userId = uuidSchema.parse(s(fd, "userId"));
    const status = z.enum(["active", "suspended"]).parse(s(fd, "status"));
    const { ipAddress } = await getRequestMeta();
    await getDb().transaction((tx) => setUserStatus(tx, actor, userId, status, ipAddress));
    revalidatePath(`/admin/users/${userId}`);
    return { ok: t("admin.actions.updated") };
  });
}
