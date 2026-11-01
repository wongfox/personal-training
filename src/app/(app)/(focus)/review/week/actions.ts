"use server";

import { revalidatePath } from "next/cache";
import { localDate } from "@/lib/dates";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import type { NextFocus } from "@/server/db/types";
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
  if (!plan) return { error: "No active plan." };
  const reflection = String(formData.get("reflection") ?? "").slice(0, 2000);
  const result = await db.transaction((tx) => saveWeeklyReview(tx, user.id, localDate(user.timezone), plan, reflection));
  await track(db, user.id, "weekly_review_completed");
  if (reflection.trim()) await track(db, user.id, "reflection_completed", { kind: "weekly" });
  revalidatePath("/home");
  return { nextFocus: result.nextFocus, xp: result.reward.xp };
}
