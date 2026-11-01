/**
 * Exercise configs are sanitised before they reach the browser: answers,
 * option quality and model answers stay on the server until after a submit.
 */
import { createHash } from "node:crypto";
import type {
  ChoiceConfig,
  DecisionConfig,
  ExerciseConfig,
  OrderConfig,
  PitchConfig,
  RecallConfig,
  RewriteConfig,
  RoleplayConfig,
  StructureConfig,
} from "@/server/db/types";

export type ClientExerciseConfig =
  | (Omit<ChoiceConfig, "options"> & { options: string[] })
  | Omit<RewriteConfig, "modelAnswer" | "keywords">
  | (Omit<OrderConfig, "items" | "explanation"> & { items: { key: string; text: string }[] })
  | RecallConfig
  | StructureConfig
  | DecisionConfig
  | Omit<RoleplayConfig, "scriptedTurns">
  | PitchConfig;

function itemKey(salt: string, text: string): string {
  return createHash("sha256").update(`${salt}:${text}`).digest("base64url").slice(0, 10);
}

/** Deterministic shuffle that never returns the solved order (when n > 1). */
function shuffled<T>(items: T[], seed: string): T[] {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) >>> 0;
    const j = h % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  if (out.length > 1 && out.every((x, i) => x === items[i])) out.push(out.shift()!);
  return out;
}

export function toClientConfig(config: ExerciseConfig, salt: string): ClientExerciseConfig {
  switch (config.type) {
    case "choice":
      return { type: "choice", scenario: config.scenario, question: config.question, options: config.options.map((o) => o.text) };
    case "rewrite": {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { modelAnswer, keywords, ...rest } = config;
      return rest;
    }
    case "order":
      return {
        type: "order",
        instruction: config.instruction,
        items: shuffled(config.items, salt).map((text) => ({ key: itemKey(salt, text), text })),
      };
    case "roleplay": {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { scriptedTurns, ...rest } = config;
      return rest;
    }
    default:
      return config;
  }
}

/** Maps the client's ordered item keys back to indices into the canonical order. */
export function resolveOrderKeys(config: OrderConfig, salt: string, keys: unknown): number[] {
  if (!Array.isArray(keys)) return [];
  const index = new Map(config.items.map((text, i) => [itemKey(salt, text), i]));
  return keys.map((k) => (typeof k === "string" ? (index.get(k) ?? -1) : -1));
}
