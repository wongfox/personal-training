/**
 * Deterministic language analysis used to give instant, specific feedback on
 * what a learner writes or says — hedges, apologies, length, questions,
 * structure. It runs with no AI provider; when one is connected, AI feedback
 * is layered on top of (not instead of) these measurable signals.
 */
import type { DimensionScore, ExerciseFeedback, FeedbackDimension } from "@/server/db/types";

const HEDGES = [
  "i think",
  "i guess",
  "i feel like",
  "i believe",
  "maybe",
  "perhaps",
  "just",
  "sort of",
  "kind of",
  "kinda",
  "probably",
  "hopefully",
  "possibly",
  "i'm not sure",
  "i am not sure",
  "a little",
  "a bit",
  "somewhat",
  "i was wondering",
  "if that's ok",
  "if that's okay",
  "if you don't mind",
  "does that make sense",
  "not sure if",
  "i might be wrong",
  "this might be",
  "basically",
];
const APOLOGIES = ["sorry", "apologize", "apologise", "apologies"];
const FILLERS = ["um", "uh", "erm", "you know", "literally", "so yeah", "like,"];
const EMPATHY = [
  "sounds like",
  "it seems",
  "i hear",
  "i understand",
  "makes sense",
  "fair point",
  "good point",
  "i appreciate",
  "thank you",
  "thanks",
  "you mentioned",
  "you said",
  "great question",
  "that must",
  "i can see",
];
const CALL_TO_ACTION = [
  "approve",
  "decide",
  "decision",
  "next step",
  "agree",
  "commit",
  "sign off",
  "green light",
  "i recommend",
  "we recommend",
  "my recommendation",
  "i propose",
  "let's",
  "shall we",
  "would you be open",
  "can we",
  "by friday",
  "by monday",
  "this week",
  "today",
];
const STRUCTURE = [
  "first",
  "second",
  "third",
  "because",
  "for example",
  "for instance",
  "which means",
  "so that",
  "as a result",
  "in short",
  "bottom line",
  "the point is",
  "here's why",
  "three",
  "two things",
];
const STORY = [
  "when",
  "last year",
  "last month",
  "last week",
  "yesterday",
  "imagine",
  "picture this",
  "story",
  "turned out",
  "realized",
  "realised",
  "until",
  "then",
  "suddenly",
  "that's when",
];
const OPEN_QUESTION = ["what", "how", "why", "tell me", "walk me through", "which"];
const STOPWORDS = new Set(
  "the a an and or but if then so of to in on at for with from by about as is are was were be been it its this that these those i you he she we they me my your our their them us what how why which who do does did have has had not no yes can could would should will just very really also there here than too into out up down over more most some any all".split(
    " ",
  ),
);

function escape(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findAll(text: string, phrases: string[]): string[] {
  const lower = text.toLowerCase();
  const hits: string[] = [];
  for (const p of phrases) {
    const re = new RegExp(`(^|[^a-z'])${escape(p)}(?=$|[^a-z'])`, "g");
    const count = lower.match(re)?.length ?? 0;
    for (let i = 0; i < count; i++) hits.push(p);
  }
  return hits;
}

export function contentWords(text: string): string[] {
  return (text.toLowerCase().match(/[a-z][a-z'-]{2,}/g) ?? []).filter((w) => !STOPWORDS.has(w));
}

export interface TextMetrics {
  words: number;
  sentences: number;
  avgSentenceLength: number;
  questions: number;
  openQuestions: number;
  hedges: string[];
  apologies: string[];
  fillers: string[];
  empathy: string[];
  callToAction: string[];
  structure: string[];
  story: string[];
  hasNumbers: boolean;
  exclamations: number;
  firstSentenceIsQuestion: boolean;
}

export function analyzeText(text: string): TextMetrics {
  const clean = text.trim();
  const words = clean ? clean.split(/\s+/).length : 0;
  const sentenceParts = clean.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);
  const sentences = Math.max(1, sentenceParts.length);
  const questions = (clean.match(/\?/g) ?? []).length;
  const questionSentences = sentenceParts.filter((s) => s.includes("?"));
  const openQuestions = questionSentences.filter((s) =>
    OPEN_QUESTION.some((q) => s.toLowerCase().includes(q)),
  ).length;
  return {
    words,
    sentences,
    avgSentenceLength: words / sentences,
    questions,
    openQuestions,
    hedges: findAll(clean, HEDGES),
    apologies: findAll(clean, APOLOGIES),
    fillers: findAll(clean, FILLERS),
    empathy: findAll(clean, EMPATHY),
    callToAction: findAll(clean, CALL_TO_ACTION),
    structure: findAll(clean, STRUCTURE),
    story: findAll(clean, STORY),
    hasNumbers: /\d/.test(clean),
    exclamations: (clean.match(/!/g) ?? []).length,
    firstSentenceIsQuestion: (sentenceParts[0] ?? "").includes("?"),
  };
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const uniq = <T,>(xs: T[]) => [...new Set(xs)];

export const DIMENSION_LABELS: Record<FeedbackDimension, string> = {
  clarity: "Clarity",
  confidence: "Confidence",
  conciseness: "Conciseness",
  curiosity: "Curiosity",
  empathy: "Empathy",
  flow: "Conversational flow",
  authority: "Authority",
  structure: "Structure",
  executive_presence: "Executive presence",
  storytelling: "Storytelling",
  persuasion: "Persuasion",
};

export interface ScoringContext {
  /** Word budget for conciseness. */
  wordBudget: number;
  /** What the other person last said (for conversational flow). */
  counterpartText?: string;
}

export function scoreDimension(dim: FeedbackDimension, m: TextMetrics, ctx: ScoringContext, text: string): DimensionScore {
  const label = DIMENSION_LABELS[dim];
  switch (dim) {
    case "clarity": {
      let s = 88;
      if (m.avgSentenceLength > 22) s -= (m.avgSentenceLength - 22) * 2.5;
      s -= m.fillers.length * 8;
      if (m.words < 6) s -= 35;
      return { key: dim, label, score: clamp(s), note: m.avgSentenceLength > 22 ? `Sentences average ${Math.round(m.avgSentenceLength)} words — break them up.` : undefined };
    }
    case "confidence": {
      // A one- or two-word reply isn't confident, it's disengaged.
      if (m.words < 4) return { key: dim, label, score: 25, note: "Too short to read as confident — it sounds disengaged." };
      const s = 92 - m.hedges.length * 12 - m.apologies.length * 15 - Math.max(0, m.exclamations - 1) * 5;
      return { key: dim, label, score: clamp(Math.max(10, s)) };
    }
    case "conciseness": {
      const b = ctx.wordBudget;
      let s: number;
      if (m.words <= b) s = m.words < Math.max(6, b * 0.2) ? 55 : 92;
      else s = 92 - ((m.words - b) / b) * 90;
      return { key: dim, label, score: clamp(s), note: m.words > b ? `${m.words} words against a budget of ${b}.` : undefined };
    }
    case "curiosity": {
      const base = m.questions === 0 ? 30 : m.questions === 1 ? 72 : 85;
      return { key: dim, label, score: clamp(base + Math.min(m.openQuestions, 2) * 6) };
    }
    case "empathy": {
      const you = (text.toLowerCase().match(/\byou(r|'re)?\b/g) ?? []).length;
      return { key: dim, label, score: clamp(48 + uniq(m.empathy).length * 18 + Math.min(you, 3) * 5) };
    }
    case "flow": {
      const theirs = new Set(contentWords(ctx.counterpartText ?? ""));
      const overlap = uniq(contentWords(text).filter((w) => theirs.has(w))).length;
      return { key: dim, label, score: clamp(45 + Math.min(overlap, 3) * 13 + (m.questions > 0 ? 12 : 0)) };
    }
    case "authority": {
      let s = 62 + Math.min(uniq(m.structure).length, 2) * 8 + (m.hasNumbers ? 8 : 0) - m.hedges.length * 12 - m.apologies.length * 14;
      if (!m.firstSentenceIsQuestion) s += 8;
      return { key: dim, label, score: clamp(s) };
    }
    case "structure": {
      return {
        key: dim,
        label,
        score: clamp(42 + Math.min(uniq(m.structure).length, 3) * 14 + (m.callToAction.length > 0 ? 14 : 0)),
      };
    }
    case "executive_presence": {
      const c = scoreDimension("confidence", m, ctx, text).score;
      const a = scoreDimension("authority", m, ctx, text).score;
      const k = scoreDimension("conciseness", m, ctx, text).score;
      return { key: dim, label, score: clamp((c + a + k) / 3) };
    }
    case "storytelling": {
      return {
        key: dim,
        label,
        score: clamp(38 + Math.min(uniq(m.story).length, 3) * 13 + (m.hasNumbers ? 8 : 0) + (/\bbut\b/i.test(text) ? 8 : 0)),
      };
    }
    case "persuasion": {
      return {
        key: dim,
        label,
        score: clamp(
          40 + Math.min(uniq(m.callToAction).length, 2) * 15 + (/\bbecause\b/i.test(text) ? 12 : 0) + (m.hasNumbers ? 10 : 0) - m.hedges.length * 6,
        ),
      };
    }
  }
}

const TIPS: Record<FeedbackDimension, string> = {
  clarity: "Use shorter sentences — one idea each — and drop filler words.",
  confidence: "Cut hedges and apologies. State your view, then invite challenge.",
  conciseness: "Lead with the point and cut anything the listener doesn't need to act.",
  curiosity: "Ask at least one open question (what / how / why) before talking about yourself.",
  empathy: "Acknowledge the other person's point in their words before adding yours.",
  flow: "Build on what they just said — pick up one of their words or ideas.",
  authority: "Open with a clear statement, not a question, and back it with one concrete fact.",
  structure: "Give it a shape: point → reason → example → ask.",
  executive_presence: "Be brief, be specific, and own your recommendation.",
  storytelling: "Anchor it in a moment: who, when, what changed — then the lesson.",
  persuasion: "Make a specific ask and give the strongest reason for it.",
};

const STRENGTH_COPY: Record<FeedbackDimension, string> = {
  clarity: "Easy to follow — clean, short sentences.",
  confidence: "You sound sure of yourself — no hedging.",
  conciseness: "Tight. Nothing wasted.",
  curiosity: "Good questions that invite the other person in.",
  empathy: "You acknowledged the other person well.",
  flow: "You built naturally on what they said.",
  authority: "You led with a clear position.",
  structure: "Clear structure the listener can follow.",
  executive_presence: "Brief, specific and assured — executive register.",
  storytelling: "Concrete, story-like detail that sticks.",
  persuasion: "A clear ask backed by a reason.",
};

export function flaggedPhrases(m: TextMetrics): NonNullable<ExerciseFeedback["flagged"]> {
  return [
    ...uniq(m.hedges).map((phrase) => ({ phrase, kind: "hedge" as const })),
    ...uniq(m.apologies).map((phrase) => ({ phrase, kind: "apology" as const })),
    ...uniq(m.fillers).map((phrase) => ({ phrase, kind: "filler" as const })),
  ];
}

/** Scores text against a set of dimensions and writes specific feedback. */
export function evaluateText(
  text: string,
  dims: FeedbackDimension[],
  ctx: ScoringContext,
): Omit<ExerciseFeedback, "summary"> & { metrics: TextMetrics } {
  const m = analyzeText(text);
  const dimensions = dims.map((d) => scoreDimension(d, m, ctx, text));
  const score = clamp(dimensions.reduce((s, d) => s + d.score, 0) / Math.max(1, dimensions.length));
  const sorted = [...dimensions].sort((a, b) => b.score - a.score);
  const strengths = sorted.filter((d) => d.score >= 75).slice(0, 2).map((d) => STRENGTH_COPY[d.key]);
  const improvements = sorted
    .filter((d) => d.score < 70)
    .reverse()
    .slice(0, 3)
    .map((d) => d.note ? `${TIPS[d.key]} (${d.note})` : TIPS[d.key]);

  const flagged = flaggedPhrases(m);
  if (flagged.length > 0) {
    improvements.unshift(`Weak phrases to cut: ${flagged.map((f) => `“${f.phrase}”`).join(", ")}.`);
  }
  return { score, dimensions, strengths, improvements: uniq(improvements).slice(0, 3), flagged, source: "rules", metrics: m };
}

export function summaryForScore(score: number): string {
  if (score >= 85) return "Strong. This would land well in a real conversation.";
  if (score >= 70) return "Solid — a couple of adjustments and it's excellent.";
  if (score >= 50) return "A good start. Focus on the fixes below.";
  return "Not there yet — try again using the tips below.";
}

/** Word-level Jaccard similarity, used to spot rewrites that barely changed. */
export function similarity(a: string, b: string): number {
  const A = new Set(contentWords(a));
  const B = new Set(contentWords(b));
  if (A.size === 0 && B.size === 0) return 1;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter++;
  return inter / (A.size + B.size - inter);
}
