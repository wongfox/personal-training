"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getTranslator } from "@/i18n/server";
import { localDate } from "@/lib/dates";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { AppError } from "@/server/errors";
import { track } from "@/server/platform";
import { type CheckpointDay, submitCheckpoint } from "@/server/services/progress";
import { getActivePlan } from "@/server/services/training";

const schema = z.record(z.string().max(40), z.string().max(2000));

export async function submitCheckpointAction(day: number, values: Record<string, string>): Promise<{ error?: string }> {
  const user = await requireUser();
  const { t } = await getTranslator();
  if (![30, 60, 90].includes(day)) return { error: t("checkpoint.errors.unknown") };
  const parsed = schema.safeParse(values);
  if (!parsed.success) return { error: t("checkpoint.errors.invalid") };
  const db = getDb();
  const plan = await getActivePlan(db, user.id);
  if (!plan) return { error: t("checkpoint.errors.noPlan") };
  try {
    await db.transaction((tx) => submitCheckpoint(tx, user.id, localDate(user.timezone), day as CheckpointDay, plan, parsed.data));
  } catch (e) {
    if (e instanceof AppError) return { error: e.message };
    throw e;
  }
  await track(db, user.id, "checkpoint_completed", { day });
  revalidatePath(`/checkpoint/${day}`);
  revalidatePath("/home");
  return {};
}
