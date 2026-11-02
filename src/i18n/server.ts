import "server-only";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import { getSession } from "@/server/auth/current-user";
import { isLocale, LOCALE_COOKIE, type Locale, negotiateLocale } from "./config";
import { en, type Messages } from "./messages/en";
import { es } from "./messages/es";
import { createTranslator, type MessageTree, type TFunction } from "./translate";

const MESSAGES: Record<Locale, Messages> = { en, es };

export function messagesFor(locale: Locale): Messages {
  return MESSAGES[locale];
}

/** Translator for a known locale (services, emails, notifications). English is the fallback. */
export function translatorFor(locale: Locale): TFunction {
  return createTranslator(MESSAGES[locale] as unknown as MessageTree, en as unknown as MessageTree);
}

/**
 * The request's language: the signed-in learner's saved choice, then the
 * language cookie (set by the switcher on public pages), then the browser.
 */
export const getLocale = cache(async (): Promise<Locale> => {
  const session = await getSession();
  if (session && isLocale(session.user.locale)) return session.user.locale;
  const fromCookie = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(fromCookie)) return fromCookie;
  return negotiateLocale((await headers()).get("accept-language"));
});

export async function getTranslator(): Promise<{ t: TFunction; locale: Locale }> {
  const locale = await getLocale();
  return { t: translatorFor(locale), locale };
}
