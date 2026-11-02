/**
 * Authoring format for content translations. Each overlay mirrors the English
 * seed (src/server/db/seed/content/*.ts) field by field, keyed by slug, and
 * keeps the SAME structure, order and counts — only human-readable text is
 * translated. Answer keys (choice quality, correctIndex, order of "order"
 * items, conceptKey) always come from the English source.
 */
import type { ExerciseConfig, LessonContent } from "../types";

export interface LessonTranslation {
  title: string;
  description: string;
  content: LessonContent;
  exercise: { title: string; description: string; config: ExerciseConfig };
  /** Same order and count as the English quiz. */
  quiz: { prompt: string; options: string[]; explanation: string }[];
  action: { title: string; description: string; successCriteria: string };
}

export interface JourneyTranslation {
  title: string;
  subtitle: string;
  description: string;
  /** Same order and count as the English modules. */
  modules: { title: string; description: string }[];
  /** Keyed by lesson slug. */
  lessons: Record<string, LessonTranslation>;
}

/** Keyed by practice tool slug. */
export type PracticeTranslations = Record<string, { title: string; description: string; config: ExerciseConfig }>;

/** Keyed by resource slug. */
export type ResourceTranslations = Record<string, { title: string; description: string; body: string }>;
