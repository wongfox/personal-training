/**
 * Deterministic scoring for every exercise type. Responses are validated with
 * zod (they come from the client) and scored on the server so results can't
 * be forged.
 *
 * Feedback is written in the learner's language (`locale`, default English).
 * The config must be the one the learner saw (already localized), so keyword
 * and recall checks compare like with like.
 */
import { z } from "zod";
import type { Locale } from "@/i18n/config";
import type {
  ChoiceConfig,
  DecisionConfig,
  ExerciseConfig,
  ExerciseFeedback,
  FeedbackDimension,
  OrderConfig,
  PitchConfig,
  RecallConfig,
  RewriteConfig,
  RoleplayConfig,
  StructureConfig,
} from "@/server/db/types";
import { analyzeText, containsPhrase, contentWords, evaluateText, normalizeText, similarity, summaryForScore } from "./text-analysis";

const text = (max = 4000) => z.string().trim().max(max);

/* Validation messages are English sentences from the `errors` message namespace; the API boundary translates them. */
export const responseSchemas = {
  choice: z.object({ selected: z.number().int().min(0).max(10) }),
  rewrite: z.object({ text: text(2000).min(1, "Write your version first.") }),
  order: z.object({ order: z.array(z.number().int().min(0).max(20)).min(2).max(12) }),
  recall: z.object({ text: text(2000) }),
  structure: z.object({ slots: z.record(z.string().max(40), text(800)) }),
  decision: z.object({
    options: z.array(text(120).min(1)).min(2).max(5),
    criteria: z.array(z.object({ name: text(80).min(1), weight: z.number().int().min(1).max(5) })).min(1).max(6),
    scores: z.array(z.array(z.number().int().min(1).max(5))),
  }),
  roleplay: z.object({
    turns: z.array(z.object({ role: z.enum(["user", "counterpart"]), text: text(1500) })).min(2).max(30),
  }),
  pitch: z.object({
    audience: text(120).min(1),
    objective: text(120).min(1),
    duration: z.number().int().min(1).max(20),
    topic: text(160).min(1),
    text: text(4000).min(1, "Write your opening first."),
  }),
} satisfies Record<ExerciseConfig["type"], z.ZodType>;

export type ExerciseResponse = {
  [K in keyof typeof responseSchemas]: z.infer<(typeof responseSchemas)[K]>;
};

export class InvalidResponseError extends Error {}

export function parseResponse<T extends ExerciseConfig["type"]>(type: T, raw: unknown): ExerciseResponse[T] {
  const parsed = responseSchemas[type].safeParse(raw);
  if (!parsed.success) throw new InvalidResponseError(parsed.error.issues[0]?.message ?? "Invalid response.");
  return parsed.data as ExerciseResponse[T];
}

/* ─────────────────────────── Copy ─────────────────────────── */

const COPY = {
  en: {
    choiceBest: "Exactly right.",
    choiceOk: "Close — but there's a stronger move.",
    choiceWeak: "Not quite.",
    stronger: (best: string, why: string) => `Stronger: ${best} — ${why}`,
    keptPoint: "You kept the essential point.",
    missingCore: (k: string) => `Make sure the core element is there (think: ${k}).`,
    askedQuestion: "You invited a response with a question.",
    endWithQuestion: "End with a question that invites the other person in.",
    tooClose: "This is very close to the original. Change the structure, not just a few words.",
    perfectOrder: "Perfect order.",
    inPlace: (correct: number, n: number) => `${correct} of ${n} in the right place.`,
    internalised: "You've internalised the sequence.",
    rightOrder: (list: string) => `The right order: ${list}`,
    recalled: (n: number, total: number) => `You recalled ${n} of ${total}.`,
    remembered: (list: string) => `Remembered: ${list}`,
    missed: (list: string) => `Missed: ${list}`,
    nextTime: (technique: string) => `Next time: ${technique}`,
    fillIn: (label: string) => `Fill in “${label}”.`,
    slotTooLong: (label: string, words: number, max: number) => `“${label}” runs ${words} words — aim for ${max} or fewer.`,
    everyPart: (framework: string) => `Every part of ${framework} is there.`,
    aheadSummary: (name: string, pct: number) => `${name} comes out ahead (${pct}% of the maximum).`,
    tradeOffs: (n: number) => `You made the trade-offs explicit across ${n} criteria.`,
    closeCall: (a: string, b: string) => `It's close between ${a} and ${b}. Run a pre-mortem on each: imagine it failed — why?`,
    addCriterion: (c: string) => `Add at least one more criterion — e.g. ${c}.`,
    defaultCriterion: "reversibility",
    heaviest: (name: string) => `Check that “${name}” really deserves the most weight — it's driving the result.`,
    closeLoop: "You never closed the loop — suggest a next step and exchange contact details.",
    noQuestions: "You didn't ask a single question. Curiosity is what makes people want to keep talking.",
    evasive: (n: number) => `${n} of your replies were a word or two. Short answers end conversations — add one detail and one question each time.`,
    pitchTooShort: "Too short to judge well — write at least the full opening (40+ words).",
    neverAsked: (objective: string) => `Your objective is to “${objective}”, but you never actually ask for it. Say it plainly.`,
  },
  es: {
    choiceBest: "Exacto.",
    choiceOk: "Cerca, pero hay una jugada más fuerte.",
    choiceWeak: "No del todo.",
    stronger: (best: string, why: string) => `Más fuerte: ${best} — ${why}`,
    keptPoint: "Mantuviste lo esencial.",
    missingCore: (k: string) => `Asegúrate de incluir el elemento central (piensa en: ${k}).`,
    askedQuestion: "Invitaste a responder con una pregunta.",
    endWithQuestion: "Termina con una pregunta que invite a la otra persona a participar.",
    tooClose: "Es muy parecido al original. Cambia la estructura, no solo algunas palabras.",
    perfectOrder: "Orden perfecto.",
    inPlace: (correct: number, n: number) => `${correct} de ${n} en el lugar correcto.`,
    internalised: "Ya interiorizaste la secuencia.",
    rightOrder: (list: string) => `El orden correcto: ${list}`,
    recalled: (n: number, total: number) => `Recordaste ${n} de ${total}.`,
    remembered: (list: string) => `Recordaste: ${list}`,
    missed: (list: string) => `Te faltó: ${list}`,
    nextTime: (technique: string) => `La próxima vez: ${technique}`,
    fillIn: (label: string) => `Completa “${label}”.`,
    slotTooLong: (label: string, words: number, max: number) => `“${label}” tiene ${words} palabras: apunta a ${max} o menos.`,
    everyPart: (framework: string) => `Están todas las partes de ${framework}.`,
    aheadSummary: (name: string, pct: number) => `${name} sale adelante (${pct}% del máximo).`,
    tradeOffs: (n: number) => `Hiciste explícitas las ventajas y desventajas en ${n} criterios.`,
    closeCall: (a: string, b: string) => `Está reñido entre ${a} y ${b}. Haz un pre-mortem de cada una: imagina que fracasó, ¿por qué?`,
    addCriterion: (c: string) => `Agrega al menos un criterio más, por ejemplo: ${c}.`,
    defaultCriterion: "reversibilidad",
    heaviest: (name: string) => `Revisa si “${name}” de verdad merece el mayor peso: es lo que está definiendo el resultado.`,
    closeLoop: "Nunca cerraste el círculo: propón un siguiente paso e intercambien datos de contacto.",
    noQuestions: "No hiciste ni una pregunta. La curiosidad es lo que hace que la gente quiera seguir conversando.",
    evasive: (n: number) => `${n} de tus respuestas fueron de una o dos palabras. Las respuestas cortas terminan las conversaciones: agrega un detalle y una pregunta cada vez.`,
    pitchTooShort: "Demasiado corto para evaluarlo bien: escribe al menos la apertura completa (40+ palabras).",
    neverAsked: (objective: string) => `Tu objetivo es “${objective}”, pero nunca lo pides de verdad. Dilo con claridad.`,
  },
} satisfies Record<Locale, unknown>;

/** Signs that a networking chat ended with a next step or an exchange of contacts. */
const CLOSED_LOOP: Record<Locale, RegExp> = {
  en: /(email|linkedin|number|card|connect|coffee|follow up|follow-up)/i,
  es: /(correo|mail|email|linkedin|whatsapp|numero|telefono|celular|tarjeta|contacto|conectar|cafe|seguimiento|escribirte|escribirle|llamarte|llamarle|agendar|reunirnos)/i,
};

/** Objectives that only succeed if the learner actually asks for something. */
const ASK_OBJECTIVE: Record<Locale, RegExp> = {
  en: /(approval|budget|persuade)/,
  es: /(aprobacion|aprobar|presupuesto|persuadir|convencer)/,
};

/* ─────────────────────────── Scoring ─────────────────────────── */

export function scoreExercise(config: ExerciseConfig, raw: unknown, locale: Locale = "en"): ExerciseFeedback {
  switch (config.type) {
    case "choice":
      return scoreChoice(config, parseResponse("choice", raw), locale);
    case "rewrite":
      return scoreRewrite(config, parseResponse("rewrite", raw), locale);
    case "order":
      return scoreOrder(config, parseResponse("order", raw), locale);
    case "recall":
      return scoreRecall(config, parseResponse("recall", raw), locale);
    case "structure":
      return scoreStructure(config, parseResponse("structure", raw), locale);
    case "decision":
      return scoreDecision(config, parseResponse("decision", raw), locale);
    case "roleplay":
      return scoreRoleplay(config, parseResponse("roleplay", raw), locale);
    case "pitch":
      return scorePitch(config, parseResponse("pitch", raw), locale);
  }
}

/** Wraps text in curly quotes unless the author already quoted it. */
function quoted(text: string): string {
  const t = text.trim();
  return /^["“«]/.test(t) ? t : `“${t}”`;
}

function scoreChoice(config: ChoiceConfig, r: ExerciseResponse["choice"], locale: Locale): ExerciseFeedback {
  const c = COPY[locale];
  const option = config.options[r.selected];
  if (!option) throw new InvalidResponseError("Pick one of the options.");
  const best = config.options.find((o) => o.quality === "best");
  const score = option.quality === "best" ? 100 : option.quality === "ok" ? 60 : 20;
  return {
    score,
    summary: option.quality === "best" ? c.choiceBest : option.quality === "ok" ? c.choiceOk : c.choiceWeak,
    strengths: option.quality === "best" ? [option.feedback] : [],
    improvements: option.quality === "best" ? [] : [option.feedback, ...(best ? [c.stronger(quoted(best.text), best.feedback)] : [])],
    source: "rules",
  };
}

function scoreRewrite(config: RewriteConfig, r: ExerciseResponse["rewrite"], locale: Locale): ExerciseFeedback {
  const c = COPY[locale];
  const dims: FeedbackDimension[] = ["confidence", "clarity", "conciseness"];
  const result = evaluateText(r.text, dims, { wordBudget: config.maxWords }, locale);
  let score = result.score;
  const strengths = [...result.strengths];
  const improvements = [...result.improvements];

  if (config.keywords?.length) {
    if (config.keywords.some((k) => containsPhrase(r.text, k, locale))) {
      strengths.push(c.keptPoint);
    } else {
      score -= 15;
      improvements.push(c.missingCore(config.keywords.slice(0, 3).join(", ")));
    }
  }
  if (config.requireQuestion) {
    if (r.text.includes("?") || (locale === "es" && r.text.includes("¿"))) strengths.push(c.askedQuestion);
    else {
      score -= 15;
      improvements.push(c.endWithQuestion);
    }
  }
  if (similarity(r.text, config.original, locale) > 0.75) {
    score -= 20;
    improvements.unshift(c.tooClose);
  }
  score = Math.max(0, Math.min(100, Math.round(score)));
  return {
    score,
    summary: summaryForScore(score, locale),
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    dimensions: result.dimensions,
    flagged: result.flagged,
    source: "rules",
  };
}

function scoreOrder(config: OrderConfig, r: ExerciseResponse["order"], locale: Locale): ExerciseFeedback {
  const c = COPY[locale];
  const n = config.items.length;
  const valid = r.order.length === n && new Set(r.order).size === n && r.order.every((i) => i < n);
  if (!valid) throw new InvalidResponseError("Arrange every item.");
  const correct = r.order.filter((itemIdx, pos) => itemIdx === pos).length;
  const score = Math.round((correct / n) * 100);
  return {
    score,
    summary: score === 100 ? c.perfectOrder : c.inPlace(correct, n),
    strengths: score === 100 ? [c.internalised] : [],
    improvements: score === 100 ? [] : [c.rightOrder(config.items.map((it, i) => `${i + 1}. ${it}`).join("  ")), config.explanation],
    source: "rules",
  };
}

/** An item counts as recalled when at least half of its key words appear. */
export function itemRecalled(item: string, answer: string, locale: Locale = "en"): boolean {
  const keys = [...new Set(contentWords(item, locale))];
  if (keys.length === 0) {
    return locale === "es" ? normalizeText(answer).includes(normalizeText(item)) : answer.toLowerCase().includes(item.toLowerCase());
  }
  const said = new Set(contentWords(answer, locale));
  const hits = keys.filter((k) => said.has(k) || [...said].some((s) => s.length > 4 && (s.startsWith(k.slice(0, 5)) || k.startsWith(s.slice(0, 5))))).length;
  return hits / keys.length >= 0.5;
}

function scoreRecall(config: RecallConfig, r: ExerciseResponse["recall"], locale: Locale): ExerciseFeedback {
  const c = COPY[locale];
  const recalled = config.items.filter((item) => itemRecalled(item, r.text, locale));
  const missed = config.items.filter((item) => !recalled.includes(item));
  const score = Math.round((recalled.length / config.items.length) * 100);
  return {
    score,
    summary: c.recalled(recalled.length, config.items.length),
    strengths: recalled.length ? [c.remembered(`${recalled.slice(0, 4).join("; ")}${recalled.length > 4 ? "…" : ""}`)] : [],
    improvements: missed.length ? [c.missed(missed.join("; ")), c.nextTime(config.technique)] : [],
    source: "rules",
  };
}

function scoreStructure(config: StructureConfig, r: ExerciseResponse["structure"], locale: Locale): ExerciseFeedback {
  const c = COPY[locale];
  const improvements: string[] = [];
  let total = 0;
  for (const slot of config.slots) {
    const value = (r.slots[slot.key] ?? "").trim();
    const words = value ? value.split(/\s+/).length : 0;
    let s = 100;
    if (words < 3) {
      s = 0;
      improvements.push(c.fillIn(slot.label));
    } else if (words > slot.maxWords) {
      s = 65;
      improvements.push(c.slotTooLong(slot.label, words, slot.maxWords));
    }
    total += s;
  }
  const combined = config.slots.map((s) => r.slots[s.key] ?? "").join(" ");
  const language = evaluateText(combined, ["confidence", "clarity"], { wordBudget: config.slots.reduce((a, s) => a + s.maxWords, 0) }, locale);
  const score = Math.round((total / config.slots.length) * 0.7 + language.score * 0.3);
  return {
    score,
    summary: summaryForScore(score, locale),
    strengths: score >= 75 ? [c.everyPart(config.framework), ...language.strengths.slice(0, 1)] : language.strengths.slice(0, 1),
    improvements: [...improvements, ...language.improvements].slice(0, 3),
    flagged: language.flagged,
    source: "rules",
  };
}

function scoreDecision(config: DecisionConfig, r: ExerciseResponse["decision"], locale: Locale): ExerciseFeedback {
  const c = COPY[locale];
  const complete = r.scores.length === r.options.length && r.scores.every((row) => row.length === r.criteria.length);
  if (!complete) throw new InvalidResponseError("Score every option against every criterion.");
  const maxPossible = r.criteria.reduce((s, cr) => s + cr.weight * 5, 0);
  const totals = r.options.map((name, i) => ({
    name,
    total: r.scores[i].reduce((s, v, j) => s + v * r.criteria[j].weight, 0),
  }));
  const ranked = [...totals].sort((a, b) => b.total - a.total);
  const margin = ranked.length > 1 ? (ranked[0].total - ranked[1].total) / maxPossible : 1;
  const heaviest = [...r.criteria].sort((a, b) => b.weight - a.weight)[0];
  const thorough = r.criteria.length >= 3 && r.options.length >= 2;
  const score = thorough ? 100 : 75;
  const same = (a: string, b: string) => (locale === "es" ? normalizeText(a) === normalizeText(b) : a.toLowerCase() === b.toLowerCase());
  return {
    score,
    summary: c.aheadSummary(ranked[0].name, Math.round((ranked[0].total / maxPossible) * 100)),
    strengths: [c.tradeOffs(r.criteria.length)],
    improvements: [
      ...(margin < 0.08 ? [c.closeCall(ranked[0].name, ranked[1].name)] : []),
      ...(r.criteria.length < 3
        ? [c.addCriterion(config.suggestedCriteria.find((sc) => !r.criteria.some((rc) => same(rc.name, sc))) ?? c.defaultCriterion)]
        : []),
      c.heaviest(heaviest.name),
    ].slice(0, 3),
    source: "rules",
  };
}

function scoreRoleplay(config: RoleplayConfig, r: ExerciseResponse["roleplay"], locale: Locale): ExerciseFeedback {
  const c = COPY[locale];
  const userTurns = r.turns.filter((t) => t.role === "user");
  if (userTurns.length === 0) throw new InvalidResponseError("Reply at least once.");
  // Score each reply against what the counterpart had just said, then average.
  const perTurn = r.turns
    .map((t, i) => ({ t, prev: r.turns.slice(0, i).reverse().find((p) => p.role === "counterpart")?.text ?? "" }))
    .filter(({ t }) => t.role === "user")
    .map(({ t, prev }) => evaluateText(t.text, config.focus, { wordBudget: 60, counterpartText: prev }, locale));
  // Substance: a real conversational turn needs a few sentences' worth of content.
  // Evasive replies ("ok", "fine") drag every dimension down instead of reading as "concise".
  const substance = userTurns.map((t) => Math.min(1, analyzeText(t.text, locale).words / 12));
  const substanceFactor = substance.reduce((s, x) => s + x, 0) / substance.length;
  const evasive = substance.filter((x) => x < 0.34).length;
  const dims = config.focus.map((key, idx) => {
    const avg = perTurn.reduce((s, p, i) => s + (p.dimensions?.[idx]?.score ?? 0) * (0.35 + 0.65 * substance[i]), 0) / perTurn.length;
    return { ...perTurn[0].dimensions![idx], score: Math.round(avg), note: undefined };
  });
  const score = Math.round((dims.reduce((s, d) => s + d.score, 0) / dims.length) * (0.5 + 0.5 * substanceFactor));
  const allText = userTurns.map((t) => t.text).join(" ");
  const m = analyzeText(allText, locale);
  const strengths = substanceFactor < 0.5 ? [] : [...new Set(perTurn.flatMap((p) => p.strengths))].slice(0, 2);
  const improvements = [...new Set(perTurn.flatMap((p) => p.improvements))].slice(0, 3);
  const closed = CLOSED_LOOP[locale].test(locale === "es" ? normalizeText(allText) : allText);
  if (config.mode === "networking" && !closed) improvements.push(c.closeLoop);
  if (m.questions === 0) improvements.unshift(c.noQuestions);
  if (evasive > 0) improvements.unshift(c.evasive(evasive));
  return {
    score,
    summary: summaryForScore(score, locale),
    strengths,
    improvements: [...new Set(improvements)].slice(0, 3),
    dimensions: dims,
    flagged: evaluateText(allText, ["confidence"], { wordBudget: 999 }, locale).flagged,
    source: "rules",
  };
}

const SPEAKING_WPM = 130;

function scorePitch(_config: PitchConfig, r: ExerciseResponse["pitch"], locale: Locale): ExerciseFeedback {
  const c = COPY[locale];
  const dims: FeedbackDimension[] = ["structure", "clarity", "executive_presence", "storytelling", "persuasion", "conciseness"];
  const result = evaluateText(r.text, dims, { wordBudget: r.duration * SPEAKING_WPM }, locale);
  const improvements = [...result.improvements];
  // An opening needs room to work: a couple of lines can't earn a high structure or persuasion score.
  const lengthFactor = Math.min(1, result.metrics.words / 40);
  const score = Math.round(result.score * (0.4 + 0.6 * lengthFactor));
  if (result.metrics.words < 40) improvements.unshift(c.pitchTooShort);
  const objective = locale === "es" ? normalizeText(r.objective) : r.objective.toLowerCase();
  if (ASK_OBJECTIVE[locale].test(objective) && result.metrics.callToAction.length === 0) {
    improvements.unshift(c.neverAsked(r.objective));
  }
  return {
    score,
    summary: summaryForScore(score, locale),
    strengths: lengthFactor < 1 ? result.strengths.slice(0, 1) : result.strengths,
    improvements: improvements.slice(0, 3),
    dimensions: result.dimensions,
    flagged: result.flagged,
    source: "rules",
  };
}
