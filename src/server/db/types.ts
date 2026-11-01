/**
 * JSON shapes stored in jsonb columns. Pure types — safe to import from client
 * components with `import type`.
 */

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export interface AssessmentOption {
  value: string;
  label: string;
  description?: string;
}

/* ───────────────────────────── Lessons ───────────────────────────── */

export interface LessonContent {
  /** 1–2 sentences that create tension or curiosity. */
  hook: string;
  /** Why this matters in the learner's real life (2–4 sentences). */
  whyItMatters: string;
  coreConcept: {
    title: string;
    /** 2–4 short paragraphs. */
    body: string[];
    /** 3–4 takeaways, each one line. */
    keyPoints: string[];
  };
  expertInsight: {
    /** Paraphrased idea — never an invented quote. */
    text: string;
    /** Person, research or book the idea comes from. */
    source: string;
    sourceDetail?: string;
  };
  example: {
    situation: string;
    before: string;
    after: string;
    whyItWorks: string;
  };
  /** Prompt for the short end-of-lesson reflection. */
  reflectionPrompt: string;
}

/* ──────────────────────────── Exercises ──────────────────────────── */

export type FeedbackDimension =
  | "clarity"
  | "confidence"
  | "conciseness"
  | "curiosity"
  | "empathy"
  | "flow"
  | "authority"
  | "structure"
  | "executive_presence"
  | "storytelling"
  | "persuasion";

export interface ChoiceConfig {
  type: "choice";
  scenario: string;
  question: string;
  /** Exactly one option has quality "best". */
  options: { text: string; quality: "best" | "ok" | "weak"; feedback: string }[];
}

export interface RewriteConfig {
  type: "rewrite";
  instruction: string;
  original: string;
  tips: string[];
  maxWords: number;
  /** The rewrite should end with (or contain) a question. */
  requireQuestion?: boolean;
  /** Any-of signals that the key element is present (lower-case). */
  keywords?: string[];
  modelAnswer: string;
}

export interface OrderConfig {
  type: "order";
  instruction: string;
  /** Items in the CORRECT order; the UI shuffles them. */
  items: string[];
  explanation: string;
}

export interface RecallConfig {
  type: "recall";
  instruction: string;
  items: string[];
  studySeconds: number;
  technique: string;
}

export interface StructureConfig {
  type: "structure";
  framework: string;
  instruction: string;
  context?: string;
  slots: { key: string; label: string; hint: string; maxWords: number }[];
}

export interface DecisionConfig {
  type: "decision";
  instruction: string;
  prompt: string;
  suggestedCriteria: string[];
}

export interface RoleplayConfig {
  type: "roleplay";
  mode: "conversation" | "networking";
  setting: string;
  counterpart: { name: string; role: string; persona: string };
  objective: string;
  openingLine: string;
  /** Counterpart lines used (in order) when the AI model is not connected. */
  scriptedTurns: string[];
  focus: FeedbackDimension[];
}

export interface PitchConfig {
  type: "pitch";
  briefing: string;
  audiences: string[];
  objectives: string[];
  durations: number[];
  suggestedTopics: string[];
}

export type ExerciseConfig =
  | ChoiceConfig
  | RewriteConfig
  | OrderConfig
  | RecallConfig
  | StructureConfig
  | DecisionConfig
  | RoleplayConfig
  | PitchConfig;

export type ExerciseType = ExerciseConfig["type"];

export interface DimensionScore {
  key: FeedbackDimension;
  label: string;
  score: number;
  note?: string;
}

export interface ExerciseFeedback {
  /** 0–100 */
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  dimensions?: DimensionScore[];
  /** Weak phrases detected in the learner's own words. */
  flagged?: { phrase: string; kind: "hedge" | "filler" | "apology" | "qualifier" }[];
  source: "rules" | "ai";
}

/* ─────────────────────────── Reflections ─────────────────────────── */

export interface ActionReflectionAnswers {
  whatHappened?: string;
  whatWorked?: string;
  whatToImprove?: string;
  whatLearned?: string;
  /** Free text for lesson / weekly / checkpoint reflections. */
  text?: string;
}

/* ─────────────────────────── Reviews ─────────────────────────── */

export interface SkillDelta {
  key: string;
  name: string;
  delta: number;
}

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  lessonsCompleted: number;
  lessonsTarget: number;
  actionsCompleted: number;
  actionsTarget: number;
  daysTrained: number;
  currentStreak: number;
  minutesTrained: number;
  xpEarned: number;
  strongestSkill: SkillDelta | null;
  needsAttention: SkillDelta | null;
}

export interface NextFocus {
  skillKey: string;
  skillName: string;
  headline: string;
  detail: string;
}
