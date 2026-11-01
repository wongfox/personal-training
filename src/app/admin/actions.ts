"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getRequestMeta, requirePermission } from "@/server/auth/current-user";
import { isRoleKey } from "@/server/auth/rbac";
import { getDb } from "@/server/db";
import type { ExerciseConfig } from "@/server/db/types";
import { AppError } from "@/server/errors";
import { saveJourney, saveLesson, saveModule, savePractice, saveResource, setUserRole, setUserStatus } from "@/server/services/admin";
import { uuidSchema } from "@/server/validation";
import {
  journeyInputSchema,
  lessonInputSchema,
  moduleInputSchema,
  practiceInputSchema,
  resourceInputSchema,
} from "@/server/validation/content";
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

function parseJson(label: string, text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    throw new AppError(`${label} isn't valid JSON.`, 400, "invalid");
  }
}

function describe(e: z.ZodError): string {
  const issue = e.issues[0];
  return issue ? `${issue.path.join(".") || "form"}: ${issue.message}` : "Invalid input.";
}

async function run(fn: () => Promise<AdminFormState | void>): Promise<AdminFormState> {
  try {
    return (await fn()) ?? { ok: "Saved." };
  } catch (e) {
    if (e instanceof AppError) return { error: e.message };
    if (e instanceof z.ZodError) return { error: describe(e) };
    throw e;
  }
}

/* ─────────────────────────── Content ─────────────────────────── */

export async function saveJourneyAction(_prev: AdminFormState, fd: FormData): Promise<AdminFormState> {
  const actor = await requirePermission("content:write");
  let createdId: string | null = null;
  const result = await run(async () => {
    const id = optionalId(s(fd, "id"));
    const v = journeyInputSchema.parse({ ...meta(fd), subtitle: s(fd, "subtitle") });
    const row = await getDb().transaction((tx) => saveJourney(tx, actor, id, v));
    if (!id) createdId = row.id;
    revalidatePath("/admin/content");
  });
  if (createdId) redirect(`/admin/content/journeys/${createdId}`);
  return result;
}

export async function saveModuleAction(_prev: AdminFormState, fd: FormData): Promise<AdminFormState> {
  const actor = await requirePermission("content:write");
  return run(async () => {
    const journeyId = uuidSchema.parse(s(fd, "journeyId"));
    const id = optionalId(s(fd, "id"));
    const v = moduleInputSchema.parse(meta(fd));
    await getDb().transaction((tx) => saveModule(tx, actor, journeyId, id, v));
    revalidatePath(`/admin/content/journeys/${journeyId}`);
    return { ok: id ? "Module saved." : "Module added." };
  });
}

export async function saveLessonAction(_prev: AdminFormState, fd: FormData): Promise<AdminFormState> {
  const actor = await requirePermission("content:write");
  let createdId: string | null = null;
  const result = await run(async () => {
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
      exercise: exerciseConfig ? { title: s(fd, "exerciseTitle"), description: s(fd, "exerciseDescription"), config: parseJson("Exercise config", exerciseConfig) } : null,
      quiz: quiz ? parseJson("Knowledge check", quiz) : null,
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
    const row = await getDb().transaction((tx) => saveLesson(tx, actor, moduleId, id, v));
    if (!id) createdId = row.id;
    revalidatePath(`/admin/content/modules/${moduleId}`);
    revalidatePath(`/admin/content/lessons/${row.id}`);
  });
  if (createdId) redirect(`/admin/content/lessons/${createdId}`);
  return result;
}

export async function saveResourceAction(_prev: AdminFormState, fd: FormData): Promise<AdminFormState> {
  const actor = await requirePermission("content:write");
  let createdId: string | null = null;
  const result = await run(async () => {
    const id = optionalId(s(fd, "id"));
    const v = resourceInputSchema.parse({ ...meta(fd), type: s(fd, "type"), body: s(fd, "body"), url: s(fd, "url") });
    const row = await getDb().transaction((tx) => saveResource(tx, actor, id, v));
    if (!id) createdId = row.id;
    revalidatePath("/admin/content/resources");
  });
  if (createdId) redirect(`/admin/content/resources/${createdId}`);
  return result;
}

export async function savePracticeAction(_prev: AdminFormState, fd: FormData): Promise<AdminFormState> {
  const actor = await requirePermission("content:write");
  let createdId: string | null = null;
  const result = await run(async () => {
    const id = optionalId(s(fd, "id"));
    const v = practiceInputSchema.parse({ ...meta(fd), config: parseJson("Config", s(fd, "config")) });
    const row = await getDb().transaction((tx) => savePractice(tx, actor, id, { ...v, config: v.config as ExerciseConfig }));
    if (!id) createdId = row.id;
    revalidatePath("/admin/content/practice");
  });
  if (createdId) redirect(`/admin/content/practice/${createdId}`);
  return result;
}

/* ─────────────────────────── Users ─────────────────────────── */

export async function userRoleAction(_prev: AdminFormState, fd: FormData): Promise<AdminFormState> {
  const actor = await requirePermission("users:manage");
  return run(async () => {
    const userId = uuidSchema.parse(s(fd, "userId"));
    const role = s(fd, "role");
    if (!isRoleKey(role)) throw new AppError("Unknown role.", 400, "invalid");
    const { ipAddress } = await getRequestMeta();
    await getDb().transaction((tx) => setUserRole(tx, actor, userId, role, s(fd, "grant") === "1", ipAddress));
    revalidatePath(`/admin/users/${userId}`);
    return { ok: "Updated." };
  });
}

export async function userStatusAction(_prev: AdminFormState, fd: FormData): Promise<AdminFormState> {
  const actor = await requirePermission("users:manage");
  return run(async () => {
    const userId = uuidSchema.parse(s(fd, "userId"));
    const status = z.enum(["active", "suspended"]).parse(s(fd, "status"));
    const { ipAddress } = await getRequestMeta();
    await getDb().transaction((tx) => setUserStatus(tx, actor, userId, status, ipAddress));
    revalidatePath(`/admin/users/${userId}`);
    return { ok: "Updated." };
  });
}
