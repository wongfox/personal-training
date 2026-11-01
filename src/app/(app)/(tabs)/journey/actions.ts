"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { track } from "@/server/platform";
import { switchJourney } from "@/server/services/learning";
import { uuidSchema } from "@/server/validation";

export async function switchJourneyAction(journeyId: string): Promise<void> {
  const user = await requireUser();
  const id = uuidSchema.parse(journeyId);
  const db = getDb();
  const journey = await db.transaction((tx) => switchJourney(tx, user.id, id));
  await track(db, user.id, "journey_started", { journeyId: journey.id });
  revalidatePath("/journey");
  revalidatePath("/home");
}
