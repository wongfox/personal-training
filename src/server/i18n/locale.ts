/**
 * How services find out which language to answer in, without changing the
 * signatures pages already call:
 *  - with a user: their saved choice (profiles.locale),
 *  - without one (catalogue reads): the current request's language, or
 *    English outside a request (tests, scripts, cron).
 * Exported service functions take an optional trailing `locale` so callers
 * that already know it (e.g. `user.locale`) skip the lookup.
 */
import { eq } from "drizzle-orm";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import type { Executor } from "@/server/db";
import { profiles } from "@/server/db/schema";
import { toLocale } from "./translator";

export type { Locale };

/** The learner's saved language (English when unknown). */
export async function userLocale(db: Executor, userId: string): Promise<Locale> {
  const [row] = await db.select({ locale: profiles.locale }).from(profiles).where(eq(profiles.userId, userId)).limit(1);
  return toLocale(row?.locale);
}

/** `locale` when given, otherwise the learner's saved language. */
export async function resolveLocale(db: Executor, userId: string, locale?: Locale): Promise<Locale> {
  return locale ?? userLocale(db, userId);
}

/**
 * The current request's language (session user → cookie → Accept-Language).
 * Falls back to English when there is no request (tests, scripts, cron).
 */
export async function requestLocale(locale?: Locale): Promise<Locale> {
  if (locale) return locale;
  try {
    const { getLocale } = await import("@/i18n/server");
    return await getLocale();
  } catch {
    return DEFAULT_LOCALE;
  }
}
