"use server";

import { revalidatePath } from "next/cache";
import { localDate } from "@/lib/dates";
import { getTranslator } from "@/i18n/server";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import type { NextFocus } from "@/server/db/types";
import { AppError } from "@/server/errors";
import { track } from "@/server/platform";
import { saveWeeklyReview } from "@/server/services/progress";
import { getActivePlan } from "@/server/services/training";

export interface WeeklyState {
  error?: string;
  nextFocus?: NextFocus;
  xp?: number;
}

export async function submitWeeklyReview(_prev: WeeklyState, formData: FormData): Promise<WeeklyState> {
  const user = await requireUser();
  const db = getDb();
  const plan = await getActivePlan(db, user.id);
  if (!plan) return { error: (await getTranslator()).t("review.week.noPlan") };
  const reflection = String(formData.get("reflection") ?? "").slice(0, 2000);
  let result;
  try {
    result = await db.transaction((tx) => saveWeeklyReview(tx, user.id, localDate(user.timezone), plan, reflection));
  } catch (e) {
    if (e instanceof AppError) return { error: e.message };
    throw e;
  }
  await track(db, user.id, "weekly_review_completed");
  if (reflection.trim()) await track(db, user.id, "reflection_completed", { kind: "weekly" });
  revalidatePath("/home");
  return { nextFocus: result.nextFocus, xp: result.reward.xp };
}
