/**
 * Translating errors at the boundary (API routes, server actions). Services
 * throw AppErrors carrying a stable key (see src/server/errors.ts); older
 * call sites and zod schemas use English sentences, which are matched back
 * to their key here. Anything unknown is returned unchanged in English and
 * replaced by a generic localized message in other languages.
 */
import type { z } from "zod";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale, negotiateLocale } from "@/i18n/config";
import { errors as enErrors } from "@/i18n/messages/en/errors";
import { AppError } from "@/server/errors";
import { serverT } from "./translator";

/** English sentence → message key ("Lesson not found." → "errors.lessonNotFound"). */
const BY_ENGLISH = new Map<string, string>();
(function index(tree: Record<string, unknown>, prefix: string) {
  for (const [k, v] of Object.entries(tree)) {
    if (typeof v === "string") {
      if (!v.includes("{")) BY_ENGLISH.set(v, `${prefix}.${k}`);
    } else if (v && typeof v === "object") index(v as Record<string, unknown>, `${prefix}.${k}`);
  }
})(enErrors, "errors");

/** Translates an English error sentence we know; unknown text comes back unchanged. */
export function translateMessage(message: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return message;
  const key = BY_ENGLISH.get(message);
  return key ? serverT(locale)(key) : message;
}

/** True when the sentence is one of ours (and therefore translatable). */
export function isKnownMessage(message: string): boolean {
  return BY_ENGLISH.has(message);
}

/** A user-facing message for any thrown error, in the given language. */
export function errorMessage(error: unknown, locale: Locale): string {
  const t = serverT(locale);
  if (error instanceof AppError) {
    if (error.key) return t(`errors.${error.key}`, error.vars);
    return translateMessage(error.message, locale);
  }
  return t("errors.generic");
}

type Issue = z.core.$ZodIssue;

const GENERIC_BY_CODE: Partial<Record<Issue["code"], string>> = {
  too_small: "errors.validation.tooShort",
  too_big: "errors.validation.tooLong",
  invalid_format: "errors.validation.invalidFormat",
  invalid_value: "errors.validation.invalidOption",
  invalid_type: "errors.validation.invalidType",
};

/**
 * One zod issue as a user-facing message. Custom messages we wrote are
 * translated; built-in English messages are kept in English and replaced by a
 * short generic message in other languages.
 */
export function issueMessage(issue: Issue | undefined, locale: Locale): string {
  const t = serverT(locale);
  if (!issue) return t("errors.invalidRequest");
  if (locale === DEFAULT_LOCALE || isKnownMessage(issue.message)) return translateMessage(issue.message, locale);
  if (issue.code === "too_small" && issue.origin !== "string" && issue.origin !== "array") return t("errors.validation.tooSmall");
  if (issue.code === "too_big" && issue.origin !== "string" && issue.origin !== "array") return t("errors.validation.tooBig");
  if (issue.code === "invalid_type" && /received undefined/.test(issue.message)) return t("errors.validation.required");
  const generic = GENERIC_BY_CODE[issue.code];
  return t(generic ?? "errors.invalidRequest");
}

/** Turns a ZodError into a localized { field: message } map for forms. */
export function localizedFieldErrors(error: z.ZodError, locale: Locale): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    out[key] ??= issueMessage(issue, locale);
  }
  return out;
}

/** The language of a request that may not be signed in: language cookie, then Accept-Language. */
export function localeFromRequest(request: Request): Locale {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${LOCALE_COOKIE}=([^;]+)`));
  const fromCookie = match?.[1];
  if (isLocale(fromCookie)) return fromCookie;
  return negotiateLocale(request.headers.get("accept-language"));
}
