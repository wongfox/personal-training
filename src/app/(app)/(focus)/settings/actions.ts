"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isValidTimeZone } from "@/lib/dates";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { profiles, userSettings, users } from "@/server/db/schema";

const schema = z.object({
  displayName: z.string().trim().min(1, "Name can't be empty.").max(80),
  timezone: z.string().refine(isValidTimeZone, "Unknown timezone."),
  reminderTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:MM."),
  dailyReminder: z.boolean(),
  streakReminder: z.boolean(),
  weeklyReview: z.boolean(),
  emailNotifications: z.boolean(),
  theme: z.enum(["system", "light", "dark"]),
});

export type SettingsInput = z.infer<typeof schema>;

export async function saveSettings(input: SettingsInput): Promise<{ error?: string; ok?: boolean }> {
  const user = await requireUser();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid settings." };
  const v = parsed.data;
  const db = getDb();
  await db.transaction(async (tx) => {
    await tx.update(profiles).set({ displayName: v.displayName, timezone: v.timezone }).where(eq(profiles.userId, user.id));
    await tx.update(users).set({ name: v.displayName }).where(eq(users.id, user.id));
    await tx
      .insert(userSettings)
      .values({ userId: user.id, ...pick(v) })
      .onConflictDoUpdate({ target: userSettings.userId, set: pick(v) });
  });
  revalidatePath("/", "layout");
  return { ok: true };
}

function pick(v: SettingsInput) {
  return {
    reminderTime: v.reminderTime,
    dailyReminder: v.dailyReminder,
    streakReminder: v.streakReminder,
    weeklyReview: v.weeklyReview,
    emailNotifications: v.emailNotifications,
    theme: v.theme,
  };
}
