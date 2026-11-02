/**
 * Content localization. English lives in the columns; other languages are
 * stored as field overrides in `translations.<locale>` with the same field
 * names. Rules:
 *  - only fields the row actually has are overridden, and only with
 *    non-empty values of the same kind,
 *  - structured JSON (lesson `content`, exercise `config`, option lists) is
 *    replaced only when the translation is structurally valid; answer keys,
 *    ids, types and numeric limits always come from the English row,
 *  - `translations` is stripped from the result.
 * Pure — safe to unit test and to use anywhere on the server.
 */
import type { Locale } from "@/i18n/config";
import type { AssessmentOption, ContentTranslations, ExerciseConfig, LessonContent } from "@/server/db/types";

type Obj = Record<string, unknown>;

const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;
const strArray = (v: unknown, length?: number): v is string[] =>
  Array.isArray(v) && v.length > 0 && v.every(str) && (length === undefined || v.length === length);

/** The overrides for a locale, or null for English / no translation. */
export function overridesFor(translations: ContentTranslations | null | undefined, locale: Locale): Obj | null {
  if (locale === "en" || !translations) return null;
  const t = (translations as Obj)[locale];
  return isObj(t) ? t : null;
}

/** One translated text field with an English fallback (for joined selects). */
export function tr(translations: ContentTranslations | null | undefined, locale: Locale, field: string, fallback: string): string;
export function tr(translations: ContentTranslations | null | undefined, locale: Locale, field: string, fallback: string | null): string | null;
export function tr(translations: ContentTranslations | null | undefined, locale: Locale, field: string, fallback: string | null): string | null {
  const value = overridesFor(translations, locale)?.[field];
  return str(value) ? value : fallback;
}

/* ─────────────────────────── Structured fields ─────────────────────────── */

export function localizeLessonContent(en: LessonContent, es: unknown): LessonContent {
  if (!isObj(es)) return en;
  const c = es.coreConcept;
  const x = es.expertInsight;
  const ex = es.example;
  const valid =
    str(es.hook) &&
    str(es.whyItMatters) &&
    str(es.reflectionPrompt) &&
    isObj(c) &&
    str(c.title) &&
    strArray(c.body) &&
    strArray(c.keyPoints) &&
    isObj(x) &&
    str(x.text) &&
    str(x.source) &&
    isObj(ex) &&
    str(ex.situation) &&
    str(ex.before) &&
    str(ex.after) &&
    str(ex.whyItWorks);
  if (!valid) return en;
  return es as unknown as LessonContent;
}

/**
 * The translated exercise config, or the English one when the translation is
 * missing or doesn't line up with it. Scoring-relevant fields (type, option
 * quality, word limits, slot keys, timings, focus dimensions) are always the
 * English values.
 */
export function localizeExerciseConfig(en: ExerciseConfig, es: unknown): ExerciseConfig {
  if (!isObj(es) || es.type !== en.type) return en;
  switch (en.type) {
    case "choice": {
      const opts = es.options;
      if (!str(es.scenario) || !str(es.question) || !Array.isArray(opts) || opts.length !== en.options.length) return en;
      if (!opts.every((o) => isObj(o) && str(o.text) && str(o.feedback))) return en;
      return {
        ...en,
        scenario: es.scenario,
        question: es.question,
        options: en.options.map((o, i) => ({ ...o, text: (opts[i] as Obj).text as string, feedback: (opts[i] as Obj).feedback as string })),
      };
    }
    case "rewrite": {
      if (!str(es.instruction) || !str(es.original) || !str(es.modelAnswer)) return en;
      const out = { ...en, instruction: es.instruction, original: es.original, modelAnswer: es.modelAnswer, tips: strArray(es.tips) ? es.tips : en.tips };
      // Keywords are matched against what the learner writes, so they must be in the same language.
      if (strArray(es.keywords)) out.keywords = es.keywords;
      else delete out.keywords;
      return out;
    }
    case "order": {
      if (!str(es.instruction) || !str(es.explanation) || !strArray(es.items, en.items.length)) return en;
      if (new Set(es.items).size !== es.items.length) return en;
      return { ...en, instruction: es.instruction, explanation: es.explanation, items: es.items };
    }
    case "recall": {
      if (!str(es.instruction) || !str(es.technique) || !strArray(es.items, en.items.length)) return en;
      return { ...en, instruction: es.instruction, technique: es.technique, items: es.items };
    }
    case "structure": {
      const slots = es.slots;
      if (!str(es.framework) || !str(es.instruction) || !Array.isArray(slots) || slots.length !== en.slots.length) return en;
      if (!slots.every((s) => isObj(s) && str(s.label) && typeof s.hint === "string")) return en;
      return {
        ...en,
        framework: es.framework,
        instruction: es.instruction,
        context: str(es.context) ? es.context : en.context,
        slots: en.slots.map((s, i) => {
          const t = (slots.find((x) => isObj(x) && x.key === s.key) ?? slots[i]) as Obj;
          return { ...s, label: t.label as string, hint: (t.hint as string) || s.hint };
        }),
      };
    }
    case "decision": {
      if (!str(es.instruction) || !str(es.prompt) || !strArray(es.suggestedCriteria)) return en;
      return { ...en, instruction: es.instruction, prompt: es.prompt, suggestedCriteria: es.suggestedCriteria };
    }
    case "roleplay": {
      const cp = es.counterpart;
      if (!str(es.setting) || !str(es.objective) || !str(es.openingLine) || !strArray(es.scriptedTurns)) return en;
      if (!isObj(cp) || !str(cp.name) || !str(cp.role) || !str(cp.persona)) return en;
      return {
        ...en,
        setting: es.setting,
        objective: es.objective,
        openingLine: es.openingLine,
        scriptedTurns: es.scriptedTurns,
        counterpart: { name: cp.name, role: cp.role, persona: cp.persona },
      };
    }
    case "pitch": {
      if (!str(es.briefing) || !strArray(es.audiences) || !strArray(es.objectives) || !strArray(es.suggestedTopics)) return en;
      return { ...en, briefing: es.briefing, audiences: es.audiences, objectives: es.objectives, suggestedTopics: es.suggestedTopics };
    }
  }
}

/** Option lists keep their English values; only labels/descriptions are translated (matched by value). */
export function localizeOptions(en: AssessmentOption[], es: unknown): AssessmentOption[] {
  if (!Array.isArray(es)) return en;
  return en.map((o, i) => {
    const t = (es.find((x) => isObj(x) && x.value === o.value) ?? es[i]) as unknown;
    if (!isObj(t) || !str(t.label)) return o;
    return { ...o, label: t.label, ...(str(t.description) ? { description: t.description } : {}) };
  });
}

/* ─────────────────────────── Rows ─────────────────────────── */

function mergeField(key: string, en: unknown, value: unknown): unknown {
  if (value === undefined || value === null) return en;
  if (key === "content" && isObj(en)) return localizeLessonContent(en as unknown as LessonContent, value);
  if (key === "config" && isObj(en) && typeof en.type === "string") return localizeExerciseConfig(en as unknown as ExerciseConfig, value);
  if (typeof en === "string" || en === null) return str(value) ? value : en;
  if (Array.isArray(en)) {
    if (en.every((x) => typeof x === "string")) return strArray(value, en.length) ? value : en;
    if (en.every((x) => isObj(x) && typeof x.value === "string")) return localizeOptions(en as AssessmentOption[], value);
    return en;
  }
  if (isObj(en)) return isObj(value) ? value : en;
  return en;
}

export type Localized<T> = Omit<T, "translations">;

/**
 * The row in the given language: translated fields merged over the English
 * ones (see the rules at the top of this file), `translations` stripped.
 */
export function localize<T extends { translations?: ContentTranslations | null }>(row: T, locale: Locale): Localized<T> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { translations, ...rest } = row;
  const overrides = overridesFor(translations, locale);
  if (!overrides) return rest;
  const out: Obj = { ...rest };
  for (const [key, value] of Object.entries(overrides)) {
    if (!(key in out)) continue;
    out[key] = mergeField(key, out[key], value);
  }
  return out as Localized<T>;
}

/** `localize` for nullable rows. */
export function localizeMaybe<T extends { translations?: ContentTranslations | null }>(row: T | null | undefined, locale: Locale): Localized<T> | null {
  return row ? localize(row, locale) : null;
}
