import "server-only";
import Anthropic from "@anthropic-ai/sdk";

/**
 * Claude access. The key lives only on the server (ANTHROPIC_API_KEY); the
 * browser never talks to the provider. When no credential is configured the
 * product keeps working with its deterministic coach and evaluators.
 */
export const AI_MODEL = process.env.AI_MODEL ?? "claude-opus-5-5";

export function aiEnabled(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
}

let client: Anthropic | undefined;

export function anthropic(): Anthropic {
  client ??= new Anthropic({ timeout: 60_000, maxRetries: 2 });
  return client;
}

/**
 * Server-side refusal fallback: if a safety classifier declines, the API
 * re-runs the request on a suitable fallback model inside the same call.
 */
export const REFUSAL_FALLBACK = {
  betas: ["server-side-fallback-2026-07-01"],
  fallbacks: "default" as const,
};
