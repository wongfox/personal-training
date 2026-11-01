/**
 * Deterministic scoring for every exercise type. Responses are validated with
 * zod (they come from the client) and scored on the server so results can't
 * be forged.
 */
import { z } from "zod";
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
import { analyzeText, contentWords, evaluateText, similarity, summaryForScore } from "./text-analysis";

const text = (max = 4000) => z.string().trim().max(max);

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

export function scoreExercise(config: ExerciseConfig, raw: unknown): ExerciseFeedback {
  switch (config.type) {
    case "choice":
      return scoreChoice(config, parseResponse("choice", raw));
    case "rewrite":
      return scoreRewrite(config, parseResponse("rewrite", raw));
    case "order":
      return scoreOrder(config, parseResponse("order", raw));
    case "recall":
      return scoreRecall(config, parseResponse("recall", raw));
    case "structure":
      return scoreStructure(config, parseResponse("structure", raw));
    case "decision":
      return scoreDecision(config, parseResponse("decision", raw));
    case "roleplay":
      return scoreRoleplay(config, parseResponse("roleplay", raw));
    case "pitch":
      return scorePitch(config, parseResponse("pitch", raw));
  }
}

/** Wraps text in curly quotes unless the author already quoted it. */
function quoted(text: string): string {
  const t = text.trim();
  return /^["“]/.test(t) ? t : `“${t}”`;
}

function scoreChoice(config: ChoiceConfig, r: ExerciseResponse["choice"]): ExerciseFeedback {
  const option = config.options[r.selected];
  if (!option) throw new InvalidResponseError("Pick one of the options.");
  const best = config.options.find((o) => o.quality === "best");
  const score = option.quality === "best" ? 100 : option.quality === "ok" ? 60 : 20;
  return {
    score,
    summary: option.quality === "best" ? "Exactly right." : option.quality === "ok" ? "Close — but there's a stronger move." : "Not quite.",
    strengths: option.quality === "best" ? [option.feedback] : [],
    improvements: option.quality === "best" ? [] : [option.feedback, ...(best ? [`Stronger: ${quoted(best.text)} — ${best.feedback}`] : [])],
    source: "rules",
  };
}

function scoreRewrite(config: RewriteConfig, r: ExerciseResponse["rewrite"]): ExerciseFeedback {
  const dims: FeedbackDimension[] = ["confidence", "clarity", "conciseness"];
  const result = evaluateText(r.text, dims, { wordBudget: config.maxWords });
  let score = result.score;
  const strengths = [...result.strengths];
  const improvements = [...result.improvements];

  const lower = r.text.toLowerCase();
  if (config.keywords?.length) {
    if (config.keywords.some((k) => lower.includes(k.toLowerCase()))) {
      strengths.push("You kept the essential point.");
    } else {
      score -= 15;
      improvements.push(`Make sure the core element is there (think: ${config.keywords.slice(0, 3).join(", ")}).`);
    }
  }
  if (config.requireQuestion) {
    if (r.text.includes("?")) strengths.push("You invited a response with a question.");
    else {
      score -= 15;
      improvements.push("End with a question that invites the other person in.");
    }
  }
  if (similarity(r.text, config.original) > 0.75) {
    score -= 20;
    improvements.unshift("This is very close to the original. Change the structure, not just a few words.");
  }
  score = Math.max(0, Math.min(100, Math.round(score)));
  return {
    score,
    summary: summaryForScore(score),
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    dimensions: result.dimensions,
    flagged: result.flagged,
    source: "rules",
  };
}

function scoreOrder(config: OrderConfig, r: ExerciseResponse["order"]): ExerciseFeedback {
  const n = config.items.length;
  const valid = r.order.length === n && new Set(r.order).size === n && r.order.every((i) => i < n);
  if (!valid) throw new InvalidResponseError("Arrange every item.");
  const correct = r.order.filter((itemIdx, pos) => itemIdx === pos).length;
  const score = Math.round((correct / n) * 100);
  return {
    score,
    summary: score === 100 ? "Perfect order." : `${correct} of ${n} in the right place.`,
    strengths: score === 100 ? ["You've internalised the sequence."] : [],
    improvements: score === 100 ? [] : [`The right order: ${config.items.map((it, i) => `${i + 1}. ${it}`).join("  ")}`, config.explanation],
    source: "rules",
  };
}

/** An item counts as recalled when at least half of its key words appear. */
export function itemRecalled(item: string, answer: string): boolean {
  const keys = [...new Set(contentWords(item))];
  if (keys.length === 0) return answer.toLowerCase().includes(item.toLowerCase());
  const said = new Set(contentWords(answer));
  const hits = keys.filter((k) => said.has(k) || [...said].some((s) => s.length > 4 && (s.startsWith(k.slice(0, 5)) || k.startsWith(s.slice(0, 5))))).length;
  return hits / keys.length >= 0.5;
}

function scoreRecall(config: RecallConfig, r: ExerciseResponse["recall"]): ExerciseFeedback {
  const recalled = config.items.filter((item) => itemRecalled(item, r.text));
  const missed = config.items.filter((item) => !recalled.includes(item));
  const score = Math.round((recalled.length / config.items.length) * 100);
  return {
    score,
    summary: `You recalled ${recalled.length} of ${config.items.length}.`,
    strengths: recalled.length ? [`Remembered: ${recalled.slice(0, 4).join("; ")}${recalled.length > 4 ? "…" : ""}`] : [],
    improvements: missed.length ? [`Missed: ${missed.join("; ")}`, `Next time: ${config.technique}`] : [],
    source: "rules",
  };
}

function scoreStructure(config: StructureConfig, r: ExerciseResponse["structure"]): ExerciseFeedback {
  const improvements: string[] = [];
  let total = 0;
  for (const slot of config.slots) {
    const value = (r.slots[slot.key] ?? "").trim();
    const words = value ? value.split(/\s+/).length : 0;
    let s = 100;
    if (words < 3) {
      s = 0;
      improvements.push(`Fill in “${slot.label}”.`);
    } else if (words > slot.maxWords) {
      s = 65;
      improvements.push(`“${slot.label}” runs ${words} words — aim for ${slot.maxWords} or fewer.`);
    }
    total += s;
  }
  const combined = config.slots.map((s) => r.slots[s.key] ?? "").join(" ");
  const language = evaluateText(combined, ["confidence", "clarity"], { wordBudget: config.slots.reduce((a, s) => a + s.maxWords, 0) });
  const score = Math.round((total / config.slots.length) * 0.7 + language.score * 0.3);
  return {
    score,
    summary: summaryForScore(score),
    strengths: score >= 75 ? [`Every part of ${config.framework} is there.`, ...language.strengths.slice(0, 1)] : language.strengths.slice(0, 1),
    improvements: [...improvements, ...language.improvements].slice(0, 3),
    flagged: language.flagged,
    source: "rules",
  };
}

function scoreDecision(config: DecisionConfig, r: ExerciseResponse["decision"]): ExerciseFeedback {
  const complete = r.scores.length === r.options.length && r.scores.every((row) => row.length === r.criteria.length);
  if (!complete) throw new InvalidResponseError("Score every option against every criterion.");
  const maxPossible = r.criteria.reduce((s, c) => s + c.weight * 5, 0);
  const totals = r.options.map((name, i) => ({
    name,
    total: r.scores[i].reduce((s, v, j) => s + v * r.criteria[j].weight, 0),
  }));
  const ranked = [...totals].sort((a, b) => b.total - a.total);
  const margin = ranked.length > 1 ? (ranked[0].total - ranked[1].total) / maxPossible : 1;
  const heaviest = [...r.criteria].sort((a, b) => b.weight - a.weight)[0];
  const thorough = r.criteria.length >= 3 && r.options.length >= 2;
  const score = thorough ? 100 : 75;
  return {
    score,
    summary: `${ranked[0].name} comes out ahead (${Math.round((ranked[0].total / maxPossible) * 100)}% of the maximum).`,
    strengths: [
      `You made the trade-offs explicit across ${r.criteria.length} criteria.`,
      ...(thorough ? [] : []),
    ],
    improvements: [
      ...(margin < 0.08
        ? [`It's close between ${ranked[0].name} and ${ranked[1].name}. Run a pre-mortem on each: imagine it failed — why?`]
        : []),
      ...(r.criteria.length < 3 ? [`Add at least one more criterion — e.g. ${config.suggestedCriteria.find((c) => !r.criteria.some((rc) => rc.name.toLowerCase() === c.toLowerCase())) ?? "reversibility"}.`] : []),
      `Check that “${heaviest.name}” really deserves the most weight — it's driving the result.`,
    ].slice(0, 3),
    source: "rules",
  };
}

function scoreRoleplay(config: RoleplayConfig, r: ExerciseResponse["roleplay"]): ExerciseFeedback {
  const userTurns = r.turns.filter((t) => t.role === "user");
  if (userTurns.length === 0) throw new InvalidResponseError("Reply at least once.");
  // Score each reply against what the counterpart had just said, then average.
  const perTurn = r.turns
    .map((t, i) => ({ t, prev: r.turns.slice(0, i).reverse().find((p) => p.role === "counterpart")?.text ?? "" }))
    .filter(({ t }) => t.role === "user")
    .map(({ t, prev }) => evaluateText(t.text, config.focus, { wordBudget: 60, counterpartText: prev }));
  const dims = config.focus.map((key, idx) => {
    const avg = Math.round(perTurn.reduce((s, p) => s + (p.dimensions?.[idx]?.score ?? 0), 0) / perTurn.length);
    return { ...perTurn[0].dimensions![idx], score: avg, note: undefined };
  });
  const score = Math.round(dims.reduce((s, d) => s + d.score, 0) / dims.length);
  const allText = userTurns.map((t) => t.text).join(" ");
  const m = analyzeText(allText);
  const strengths = [...new Set(perTurn.flatMap((p) => p.strengths))].slice(0, 2);
  const improvements = [...new Set(perTurn.flatMap((p) => p.improvements))].slice(0, 3);
  if (config.mode === "networking" && !/(email|linkedin|number|card|connect|coffee|follow up|follow-up)/i.test(allText)) {
    improvements.push("You never closed the loop — suggest a next step and exchange contact details.");
  }
  if (m.questions === 0) improvements.unshift("You didn't ask a single question. Curiosity is what makes people want to keep talking.");
  return {
    score,
    summary: summaryForScore(score),
    strengths,
    improvements: [...new Set(improvements)].slice(0, 3),
    dimensions: dims,
    flagged: evaluateText(allText, ["confidence"], { wordBudget: 999 }).flagged,
    source: "rules",
  };
}

const SPEAKING_WPM = 130;

function scorePitch(_config: PitchConfig, r: ExerciseResponse["pitch"]): ExerciseFeedback {
  const dims: FeedbackDimension[] = ["structure", "clarity", "executive_presence", "storytelling", "persuasion", "conciseness"];
  const result = evaluateText(r.text, dims, { wordBudget: r.duration * SPEAKING_WPM });
  const improvements = [...result.improvements];
  if (result.metrics.words < 40) improvements.unshift("Too short to judge well — write at least the full opening (40+ words).");
  const objective = r.objective.toLowerCase();
  if ((objective.includes("approval") || objective.includes("budget") || objective.includes("persuade")) && result.metrics.callToAction.length === 0) {
    improvements.unshift(`Your objective is to “${r.objective}”, but you never actually ask for it. Say it plainly.`);
  }
  return {
    score: result.score,
    summary: summaryForScore(result.score),
    strengths: result.strengths,
    improvements: improvements.slice(0, 3),
    dimensions: result.dimensions,
    flagged: result.flagged,
    source: "rules",
  };
}
