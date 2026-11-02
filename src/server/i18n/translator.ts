/**
 * Request-independent translation for server code (services, emails, error
 * boundaries). Pure: no cookies or headers, so it also runs in tests, cron
 * jobs and scripts. Use `getTranslator()` from "@/i18n/server" in pages.
 */
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/i18n/config";
import { en } from "@/i18n/messages/en";
import { es } from "@/i18n/messages/es";
import { createTranslator, type MessageTree, type TFunction } from "@/i18n/translate";

const TREES: Record<Locale, MessageTree> = { en: en as unknown as MessageTree, es: es as unknown as MessageTree };
const cache = new Map<Locale, TFunction>();

/** Translator for a known locale; English is the fallback for missing keys. */
export function serverT(locale: Locale): TFunction {
  let t = cache.get(locale);
  if (!t) {
    t = createTranslator(TREES[locale], TREES.en);
    cache.set(locale, t);
  }
  return t;
}

/** Coerces anything (a DB value, a cookie) to a supported locale. */
export function toLocale(value: unknown): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
