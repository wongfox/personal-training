"use server";

import { redirect } from "next/navigation";
import { localDate } from "@/lib/dates";
import { requireSignedIn } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { AppError } from "@/server/errors";
import { track } from "@/server/platform";
import { completeOnboarding } from "@/server/services/onboarding";

export async function submitOnboarding(payload: Record<string, unknown>): Promise<{ error?: string }> {
  const user = await requireSignedIn();
  const db = getDb();
  const today = localDate(user.timezone);
  try {
    const result = await db.transaction((tx) => completeOnboarding(tx, user, today, payload));
    if (!result.alreadyDone) await track(db, user.id, "onboarding_completed", { journey: result.journeyTitle });
  } catch (e) {
    if (e instanceof AppError) return { error: e.message };
    throw e;
  }
  redirect("/onboarding/plan");
}
