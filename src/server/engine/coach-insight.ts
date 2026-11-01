/**
 * The feedback engine: reads the learner's recent signals (missions,
 * reflections, exercise scores, consistency) and writes one specific
 * observation plus what to do next — the "coach's read" on the Home screen.
 */
import type { DimensionScore } from "@/server/db/types";
import { DIMENSION_LABELS } from "./text-analysis";

export interface InsightSignals {
  primarySkill: { key: string; name: string };
  skills: { key: string; name: string; score: number; baseline: number }[];
  /** Missions from the last 14 days, newest first. */
  actions: { status: "committed" | "done" | "not_yet" | "skipped"; outcome: string | null; title: string }[];
  /** Free text from recent reflections, newest first. */
  reflections: string[];
  /** Recent scored exercises, newest first. */
  exercises: { score: number; dimensions?: DimensionScore[]; flaggedCount: number }[];
  daysTrainedLast7: number;
  weeklyTarget: number;
  /** Days since the plan started (1 on the first day). */
  daysInPlan: number;
  streak: number;
  lessonsCompleted: number;
  next: { title: string; skillName: string } | null;
}

export interface CoachInsight {
  observation: string;
  recommendation: string;
  focus: string;
  tone: "welcome" | "praise" | "nudge" | "challenge";
  /** A concrete practice rep that trains exactly the focus. */
  drill?: { href: string; label: string };
}

/** Which practice tool trains which measured dimension. */
const DRILLS: Record<string, { slug: string; label: string }> = {
  confidence: { slug: "practice-hedge-hunter-recommendation", label: "Hedge Hunter" },
  authority: { slug: "practice-hedge-hunter-recommendation", label: "Hedge Hunter" },
  conciseness: { slug: "practice-bottom-line-up-front", label: "Bottom line up front" },
  executive_presence: { slug: "practice-bottom-line-up-front", label: "Bottom line up front" },
  clarity: { slug: "practice-organizer-prep", label: "Thought Organizer (PREP)" },
  structure: { slug: "practice-organizer-scr", label: "Thought Organizer (SCR)" },
  storytelling: { slug: "practice-story-builder", label: "Story Builder" },
  persuasion: { slug: "practice-presentation-trainer", label: "Presentation Trainer" },
  curiosity: { slug: "practice-ask-better-questions", label: "Ask better questions" },
  empathy: { slug: "practice-conversation-colleague-pushback", label: "Conversation Simulator" },
  flow: { slug: "practice-conversation-potential-client", label: "Conversation Simulator" },
};

function drillFor(key: string): CoachInsight["drill"] {
  const d = DRILLS[key];
  return d ? { href: `/practice/${d.slug}`, label: d.label } : undefined;
}

const HESITATION = /\b(nervous|anxious|hesitat\w*|afraid|scared|awkward|froze|freeze|didn'?t know what to say|blank(ed)?|overthink\w*|shy|intimidat\w*|avoid\w*)\b/i;
const WIN = /\b(worked|went well|felt good|confident|easier|natural|they (smiled|laughed|agreed)|success)\b/i;

function weakestDimension(exercises: InsightSignals["exercises"]): { key: string; label: string; avg: number } | null {
  const sums = new Map<string, { total: number; n: number }>();
  for (const e of exercises.slice(0, 8)) {
    for (const d of e.dimensions ?? []) {
      const s = sums.get(d.key) ?? { total: 0, n: 0 };
      s.total += d.score;
      s.n += 1;
      sums.set(d.key, s);
    }
  }
  let worst: { key: string; label: string; avg: number } | null = null;
  for (const [key, { total, n }] of sums) {
    if (n < 2) continue;
    const avg = total / n;
    if (!worst || avg < worst.avg) worst = { key, label: DIMENSION_LABELS[key as keyof typeof DIMENSION_LABELS] ?? key, avg };
  }
  return worst && worst.avg < 68 ? worst : null;
}

export function buildCoachInsight(s: InsightSignals): CoachInsight {
  if (s.lessonsCompleted === 0 && s.actions.length === 0) {
    return {
      tone: "welcome",
      focus: s.primarySkill.name,
      observation: `Your plan starts with ${s.primarySkill.name.toLowerCase()}: one idea a day, practised the same day in real life.`,
      recommendation: "Do today's lesson, then take its mission into your day. Small reps, every day — that's the whole method.",
    };
  }

  const improving = [...s.skills]
    .map((k) => ({ ...k, gain: k.score - k.baseline }))
    .sort((a, b) => b.gain - a.gain)[0];
  const improvingClause = improving && improving.gain >= 3 ? `You're improving your ${improving.name.toLowerCase()} (+${improving.gain} since you started)` : null;

  // 1. Reflections say they hesitate.
  const hesitant = s.reflections.slice(0, 5).filter((r) => HESITATION.test(r)).length;
  const avoided = s.actions.slice(0, 5).filter((a) => a.status === "not_yet" || a.status === "skipped").length;
  const difficult = s.actions.slice(0, 5).filter((a) => a.outcome === "difficult").length;
  if (hesitant >= 2 || (hesitant >= 1 && avoided + difficult >= 1)) {
    return {
      tone: "challenge",
      focus: "Initiating",
      observation: `${improvingClause ?? "You're putting in the reps"}, but your reflections suggest you still hesitate at the moment you need to start — the first sentence, the first step.`,
      recommendation: "Lower the bar: decide your opening line before the moment arrives, then say it within three seconds. Rehearse it once first, where it's safe.",
      drill: { href: "/practice/practice-networking-event", label: "Networking Practice" },
    };
  }

  // 2. Missions not getting done.
  if (avoided >= 2) {
    return {
      tone: "nudge",
      focus: "Application",
      observation: `You're learning the ideas, but ${avoided} of your last ${Math.min(5, s.actions.length)} missions didn't happen yet. Knowledge only turns into skill when you use it.`,
      recommendation: "Pick the moment for today's mission now — which meeting, which person, what time. A specific plan more than doubles follow-through.",
    };
  }

  // 3. A measurable weakness in how they write/speak.
  const weak = weakestDimension(s.exercises);
  if (weak) {
    const flagged = s.exercises.slice(0, 5).reduce((n, e) => n + e.flaggedCount, 0);
    const detail = weak.key === "confidence" && flagged > 0 ? ` — ${flagged} hedge or apology phrases in your recent answers` : "";
    return {
      tone: "challenge",
      focus: weak.label,
      observation: `${improvingClause ? improvingClause + ". Your" : "Your"} weakest signal right now is ${weak.label.toLowerCase()}${detail} (averaging ${Math.round(weak.avg)}/100).`,
      recommendation: weak.key === "curiosity"
        ? "In your next conversation, ask two questions before you share anything about yourself."
        : `Before you hit submit or speak, reread once for ${weak.label.toLowerCase()} only — then do one focused rep.`,
      drill: drillFor(weak.key),
    };
  }

  // 4. Consistency — judged only on the days the plan has actually been running.
  const window = Math.min(7, s.daysInPlan);
  const expected = Math.ceil((s.weeklyTarget * window) / 7);
  if (s.daysInPlan >= 3 && s.daysTrainedLast7 < Math.ceil(expected / 2)) {
    return {
      tone: "nudge",
      focus: "Consistency",
      observation: `You trained ${s.daysTrainedLast7} of the last ${window} days against a plan of ${expected}. Skills compound with frequency, not intensity.`,
      recommendation: "Shrink the session instead of skipping it: even the 5-minute version keeps the habit alive.",
    };
  }

  // 5. Early days: encourage the rhythm rather than judge it.
  if (s.daysInPlan < 3 && !improvingClause) {
    return {
      tone: "praise",
      focus: "Momentum",
      observation: `Day ${s.daysInPlan} done right: you learned it, practised it and took it into your day. That loop is the whole method.`,
      recommendation: s.next ? `Tomorrow: “${s.next.title}”. Same time, same rhythm.` : "Come back tomorrow — same time, same rhythm.",
    };
  }

  // 6. Wins.
  const wins = s.actions.slice(0, 5).filter((a) => a.outcome === "good" || a.outcome === "excellent").length + s.reflections.slice(0, 3).filter((r) => WIN.test(r)).length;
  return {
    tone: "praise",
    focus: improving?.name ?? s.primarySkill.name,
    observation: improvingClause
      ? `${improvingClause}${wins > 0 ? `, and your missions are landing — ${wins} recent ${wins === 1 ? "win" : "wins"}` : ""}. ${s.streak >= 3 ? `${s.streak} days in a row.` : ""}`.trim()
      : `Steady work: ${s.lessonsCompleted} lessons done and a ${s.streak}-day streak.`,
    recommendation: s.next ? `Raise the difficulty a notch. Next up: “${s.next.title}”.` : "Try a harder practice scenario this week to stretch the skill.",
  };
}

export interface ReflectionFeedback {
  headline: string;
  observation: string;
  nextStep: string;
}

/** Only quote the learner back when they actually said something. */
function meaningful(text: string | undefined): text is string {
  // At least three different real words — "ok", "fine", "ok ok ok" don't qualify.
  return Boolean(text) && new Set((text!.toLowerCase().match(/[a-z']{2,}/g) ?? [])).size >= 3;
}

function quote(text: string, max = 110): string {
  const t = text.trim().replace(/\s+/g, " ").replace(/[.!]+$/, "");
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

/**
 * Immediate, specific feedback on a mission reflection, written from the
 * learner's own words: what to keep, what to change, and the next rep.
 */
export function reflectionFeedback(input: {
  outcome: "difficult" | "normal" | "good" | "excellent" | null;
  answers: { whatHappened?: string; whatWorked?: string; whatToImprove?: string; whatLearned?: string };
  next: { title: string } | null;
}): ReflectionFeedback {
  const { outcome, answers: a, next } = input;
  const all = [a.whatHappened, a.whatWorked, a.whatToImprove, a.whatLearned].filter(Boolean).join(" ");
  const hesitated = HESITATION.test(all);

  const headline =
    outcome === "excellent" ? "That's a new baseline." : outcome === "good" ? "It landed." : outcome === "difficult" ? "Hard reps count double." : "A clean rep.";

  const parts: string[] = [];
  if (hesitated && (outcome === "good" || outcome === "excellent")) parts.push("You felt the hesitation and did it anyway — that's exactly the muscle this builds.");
  else if (hesitated) parts.push("The nerves showed up. That's normal at this stage; what matters is that you started.");
  if (meaningful(a.whatWorked)) parts.push(`Keep this: “${quote(a.whatWorked)}”. Name it, so you can repeat it on purpose.`);
  if (!parts.length) parts.push(outcome === "difficult" ? "Difficult usually means you were at the edge of your skill — the right place to practise." : "Doing it is what turns an idea into a habit.");

  const thin = ![a.whatHappened, a.whatWorked, a.whatToImprove, a.whatLearned].some(meaningful);
  if (thin) parts.unshift("A few more words would make this reflection useful — what exactly did you say, and how did they react?");
  const nextStep = meaningful(a.whatToImprove)
    ? `Next time, change one thing: “${quote(a.whatToImprove)}”. Decide now where you'll try it.${next ? ` Tomorrow's lesson: “${next.title}”.` : ""}`
    : `Before tomorrow, pick one thing you'd do differently — it's the fastest way to improve.${next ? ` Next lesson: “${next.title}”.` : ""}`;

  return { headline, observation: parts.join(" "), nextStep };
}
