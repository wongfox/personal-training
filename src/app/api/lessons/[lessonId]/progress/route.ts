import { z } from "zod";
import { getDb } from "@/server/db";
import { apiHandler, readJson } from "@/server/http";
import { track } from "@/server/platform";
import { saveLessonStep } from "@/server/services/learning";

const body = z.object({ step: z.number().int().min(0).max(20), seconds: z.number().min(0).max(3600).default(0) });

export const POST = apiHandler<{ lessonId: string }>(async ({ user, today, request }, { lessonId }) => {
  const input = await readJson(request, body);
  const db = getDb();
  const result = await db.transaction((tx) => saveLessonStep(tx, user.id, today, lessonId, input.step, input.seconds));
  if (result.started) await track(db, user.id, "lesson_started", { lessonId });
  return { ok: true };
});
