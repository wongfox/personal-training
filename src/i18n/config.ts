import type { Locale } from "@/server/db/types";

export type { Locale };

export const LOCALES = ["en", "es"] as const satisfies readonly Locale[];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "pgos-locale";

export const LOCALE_NAMES: Record<Locale, string> = { en: "English", es: "Español" };
/** BCP 47 tags for Intl formatting. */
export const INTL_LOCALE: Record<Locale, string> = { en: "en-US", es: "es-PE" };

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "es";
}

/** Best match from an Accept-Language header ("es-PE,es;q=0.9,en;q=0.8" → "es"). */
export function negotiateLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.toLowerCase().split("-")[0], q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  return ranked.find((r) => isLocale(r.lang))?.lang as Locale | undefined ?? DEFAULT_LOCALE;
}
