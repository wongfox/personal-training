import "server-only";
import type Anthropic from "@anthropic-ai/sdk";
import type { Locale } from "@/i18n/config";
import type { RoleplayConfig } from "@/server/db/types";
import { AI_MODEL, aiEnabled, anthropic, REFUSAL_FALLBACK } from "./client";

export interface SimTurn {
  role: "user" | "counterpart";
  text: string;
}

export interface SimReply {
  reply: string | null;
  done: boolean;
  mode: "ai" | "scripted";
}

const NUDGES: Record<Locale, string[]> = {
  en: ["Sorry — say a bit more? I'm not sure I followed.", "Hm. Can you give me an example of what you mean?"],
  es: ["Perdona, ¿me cuentas un poco más? No estoy segura de haberte entendido.", "Mmm. ¿Me das un ejemplo de lo que quieres decir?"],
};

const GOODBYE: Record<Locale, string> = {
  en: "I should probably let you go — good to meet you.",
  es: "Bueno, no te quito más tiempo. Un gusto conocerte.",
};

/** How the partner should speak, appended to the role-play instructions. */
const LANGUAGE_RULE: Record<Locale, string> = {
  en: "",
  es: "\nLanguage: speak only in natural, neutral Latin-American Spanish, addressing the learner as \"tú\", whatever language they write in.",
};

function isEvasive(text: string): boolean {
  return text.trim().split(/\s+/).filter(Boolean).length < 4;
}

/**
 * Scripted partner: advances only on real answers. Evasive one-word replies
 * get a natural nudge instead of praise, and three in a row end the chat —
 * the way a real person would react. The scripted lines come from the
 * (localized) scenario; the nudges are in the learner's language.
 */
export function scripted(config: RoleplayConfig, turns: SimTurn[], locale: Locale = "en"): SimReply {
  const userTurns = turns.filter((t) => t.role === "user");
  const last = userTurns.at(-1);
  if (last && isEvasive(last.text)) {
    let streak = 0;
    for (let i = userTurns.length - 1; i >= 0 && isEvasive(userTurns[i].text); i--) streak++;
    if (streak >= 3) return { reply: GOODBYE[locale], done: true, mode: "scripted" };
    return { reply: NUDGES[locale][(streak - 1) % NUDGES[locale].length], done: false, mode: "scripted" };
  }
  const substantive = userTurns.filter((t) => !isEvasive(t.text)).length;
  if (substantive <= config.scriptedTurns.length) {
    return { reply: config.scriptedTurns[substantive - 1], done: false, mode: "scripted" };
  }
  return { reply: null, done: true, mode: "scripted" };
}

/**
 * Produces the practice partner's next line. With an AI provider the partner
 * improvises in character; otherwise it follows the scenario's script, which
 * is written to work regardless of what the learner says.
 */
export async function counterpartReply(config: RoleplayConfig, turns: SimTurn[], locale: Locale = "en"): Promise<SimReply> {
  const userTurns = turns.filter((t) => t.role === "user").length;
  if (!aiEnabled()) return scripted(config, turns, locale);

  const maxUserTurns = config.scriptedTurns.length + 2;
  const last = userTurns >= maxUserTurns;
  const system = `You are role-playing ${config.counterpart.name}, ${config.counterpart.role}, in a practice conversation.
Setting: ${config.setting}
Who you are: ${config.counterpart.persona}
The learner is practising this objective (do not reveal it, and do not coach them): ${config.objective}
Rules: stay in character; reply in 1–3 natural spoken sentences; react realistically to what they actually said — warm up if they're engaging and curious, cool down if they ramble, hedge or only talk about themselves. Never mention that this is practice or that you are an AI.${LANGUAGE_RULE[locale]}${last ? "\nThis is your final line: wrap the conversation up naturally in character." : ""}`;

  const messages: Anthropic.Beta.BetaMessageParam[] = turns.map((t) => ({
    role: t.role === "user" ? "user" : "assistant",
    content: t.text,
  }));
  // The opening line is the counterpart's, so the transcript starts with an assistant turn;
  // the API needs a user turn first.
  if (messages[0]?.role === "assistant") messages.unshift({ role: "user", content: locale === "es" ? "(Empieza la conversación.)" : "(The conversation begins.)" });

  try {
    const message = await anthropic().beta.messages.create(
      {
        model: AI_MODEL,
        max_tokens: 1000,
        system,
        messages,
        output_config: { effort: "low" },
        ...REFUSAL_FALLBACK,
      },
      { timeout: 25_000 },
    );
    if (message.stop_reason === "refusal") return scripted(config, turns, locale);
    const reply = message.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
    if (!reply) return scripted(config, turns, locale);
    return { reply, done: last, mode: "ai" };
  } catch (error) {
    console.warn("[ai] simulator unavailable — using script", error instanceof Error ? error.message : error);
    return scripted(config, turns, locale);
  }
}
