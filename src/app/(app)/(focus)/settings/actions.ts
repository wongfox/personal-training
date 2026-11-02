"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getTranslator } from "@/i18n/server";
import type { TFunction } from "@/i18n/translate";
import { isValidTimeZone } from "@/lib/dates";
import { requireUser } from "@/server/auth/current-user";
import { rateLimit } from "@/server/auth/rate-limit";
import { getDb } from "@/server/db";
import { profiles, userSettings, users } from "@/server/db/schema";

const themeSchema = z.enum(["system", "light", "dark"]);
export type ThemeChoice = z.infer<typeof themeSchema>;

function settingsSchema(t: TFunction) {
  return z.object({
    displayName: z.string().trim().min(1, t("settings.errors.nameEmpty")).max(80, t("settings.errors.nameTooLong")),
    timezone: z.string().refine(isValidTimeZone, t("settings.errors.unknownTimezone")),
    reminderTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, t("settings.errors.timeFormat")),
    dailyReminder: z.boolean(),
    streakReminder: z.boolean(),
    weeklyReview: z.boolean(),
    emailNotifications: z.boolean(),
    theme: themeSchema,
  });
}

export type SettingsInput = z.infer<ReturnType<typeof settingsSchema>>;

export async function saveSettings(input: SettingsInput): Promise<{ error?: string; ok?: boolean }> {
  const user = await requireUser();
  const { t } = await getTranslator();
  const parsed = settingsSchema(t).safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? t("settings.errors.invalid") };
  const v = parsed.data;
  const db = getDb();
  // Training days are counted in this timezone, so it can't be used to skip ahead
  // to tomorrow's lesson or to rescue a streak: one change per week.
  if (v.timezone !== user.timezone) {
    const limit = await rateLimit(db, `timezone:${user.id}`, 1, 7 * 24 * 3600);
    if (!limit.allowed) {
      return { error: t("settings.errors.timezoneWeekly", { count: Math.ceil(limit.retryAfterSeconds / 86400) }) };
    }
  }
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

/** Saves only the appearance choice — used by the instant Light/Dark toggle (Profile and Settings). */
export async function saveThemeAction(theme: ThemeChoice): Promise<{ error?: string; ok?: boolean }> {
  const user = await requireUser();
  const parsed = themeSchema.safeParse(theme);
  if (!parsed.success) {
    const { t } = await getTranslator();
    return { error: t("settings.errors.invalid") };
  }
  await getDb()
    .insert(userSettings)
    .values({ userId: user.id, theme: parsed.data })
    .onConflictDoUpdate({ target: userSettings.userId, set: { theme: parsed.data } });
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
