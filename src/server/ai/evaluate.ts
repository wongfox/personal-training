import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import type { DimensionScore, ExerciseConfig, ExerciseFeedback, FeedbackDimension } from "@/server/db/types";
import type { Locale } from "@/i18n/config";
import { DIMENSION_LABELS, dimensionLabels } from "@/server/engine/text-analysis";
import { AI_MODEL, aiEnabled, anthropic } from "./client";

const AiFeedback = z.object({
  summary: z.string(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  dimensions: z.array(z.object({ key: z.string(), score: z.number(), note: z.string() })),
});

const SYSTEM = `You are an exacting but warm communication coach evaluating a learner's practice attempt.
Score each requested dimension from 0 to 100 against what a strong professional would do in the same situation.
Be specific: quote the learner's own words when pointing out a problem, and give a concrete rewrite or next move.
Strengths: at most 2, only if genuinely earned. Improvements: at most 3, most important first, each one actionable.
Summary: one sentence, plain and direct. Never mention that you are an AI.`;

/** The learner reads the feedback, so it must be in their language (the dimension keys stay in English). */
const LANGUAGE_RULE: Record<Locale, string> = {
  en: "",
  es: `\nWrite the summary, strengths, improvements and notes in neutral Latin-American Spanish, addressing the learner as "tú" and in gender-neutral terms. Keep the dimension keys exactly as given (in English).`,
};

function transcript(config: ExerciseConfig, response: unknown): { brief: string; dims: FeedbackDimension[] } | null {
  if (config.type === "roleplay") {
    const r = response as { turns: { role: "user" | "counterpart"; text: string }[] };
    const lines = r.turns.map((t) => `${t.role === "user" ? "LEARNER" : config.counterpart.name.toUpperCase()}: ${t.text}`).join("\n");
    return {
      dims: config.focus,
      brief: `Scenario: ${config.setting}\nCounterpart: ${config.counterpart.name}, ${config.counterpart.role}. ${config.counterpart.persona}\nLearner's objective: ${config.objective}\n\nTranscript:\n${lines}`,
    };
  }
  if (config.type === "pitch") {
    const r = response as { audience: string; objective: string; duration: number; topic: string; text: string };
    return {
      dims: ["structure", "clarity", "executive_presence", "storytelling", "persuasion", "conciseness"],
      brief: `The learner is presenting to: ${r.audience}\nTopic: ${r.topic}\nObjective: ${r.objective}\nTime slot: ${r.duration} minute(s)\n\nWhat they wrote/said (their opening):\n${r.text}`,
    };
  }
  return null;
}

/**
 * Adds model-written feedback to open-ended practice (conversations and
 * presentations). The deterministic score is kept as a floor of evidence:
 * flagged phrases always come from the rules engine, and any model failure or
 * refusal silently falls back to the rules-based feedback.
 */
export async function enrichWithAi(
  _userId: string,
  config: ExerciseConfig,
  response: unknown,
  rules: ExerciseFeedback,
  locale: Locale = "en",
): Promise<ExerciseFeedback> {
  const labels = dimensionLabels(locale);
  if (!aiEnabled()) return rules;
  const t = transcript(config, response);
  if (!t) return rules;

  try {
    const message = await anthropic().messages.parse(
      {
        model: AI_MODEL,
        max_tokens: 4000,
        output_config: { effort: "low", format: zodOutputFormat(AiFeedback) },
        system: SYSTEM + LANGUAGE_RULE[locale],
        messages: [
          {
            role: "user",
            content: `${t.brief}\n\nScore these dimensions (use these exact keys): ${t.dims.map((d) => `${d} (${DIMENSION_LABELS[d]})`).join(", ")}.`,
          },
        ],
      },
      { timeout: 25_000 },
    );
    const parsed = message.stop_reason === "refusal" ? null : message.parsed_output;
    if (!parsed) return rules;

    const dimensions: DimensionScore[] = t.dims.map((key) => {
      const ai = parsed.dimensions.find((d) => d.key === key);
      const ruleScore = rules.dimensions?.find((d) => d.key === key)?.score;
      const score = ai ? Math.round(Math.max(0, Math.min(100, ai.score))) : (ruleScore ?? 50);
      return { key, label: labels[key], score, note: ai?.note };
    });
    const score = Math.round(dimensions.reduce((s, d) => s + d.score, 0) / dimensions.length);
    return {
      score,
      summary: parsed.summary,
      strengths: parsed.strengths.slice(0, 2),
      improvements: parsed.improvements.slice(0, 3),
      dimensions,
      flagged: rules.flagged,
      source: "ai",
    };
  } catch (error) {
    if (!(error instanceof Anthropic.APIError)) console.error("[ai] evaluation failed", error);
    else console.warn("[ai] evaluation unavailable (%s) — using rules feedback", error.status);
    return rules;
  }
}
