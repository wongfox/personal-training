/**
 * Authoring format for seed content. Seed files are plain data that the seed
 * script upserts into the database; after seeding, the admin CMS owns the
 * content and the database is the source of truth.
 */
import type { CategoryKey } from "@/lib/taxonomy";
import type { DifficultyLevel, ExerciseConfig, LessonContent } from "../types";

export interface QuizQuestionSeed {
  prompt: string;
  /** 3–4 options. */
  options: string[];
  correctIndex: number;
  explanation: string;
  /** kebab-case, unique across all content, e.g. "comms-bluf". */
  conceptKey: string;
}

export interface LessonSeed {
  /** kebab-case, globally unique. */
  slug: string;
  title: string;
  /** One sentence shown in lists. */
  description: string;
  category: CategoryKey;
  difficulty: DifficultyLevel;
  /** 5–15 */
  estimatedMinutes: number;
  content: LessonContent;
  exercise: { title: string; description: string; config: ExerciseConfig };
  /** Exactly 3 questions. */
  quiz: QuizQuestionSeed[];
  /** The real-world mission done outside the app. */
  action: {
    title: string;
    description: string;
    successCriteria: string;
    difficulty: DifficultyLevel;
    estimatedMinutes: number;
  };
}

export interface ModuleSeed {
  title: string;
  description: string;
  lessons: LessonSeed[];
}

export interface JourneySeed {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: CategoryKey;
  difficulty: DifficultyLevel;
  order: number;
  modules: ModuleSeed[];
}

export interface PracticeSeed {
  slug: string;
  title: string;
  description: string;
  category: CategoryKey;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  config: ExerciseConfig;
}

export interface ResourceSeed {
  slug: string;
  title: string;
  description: string;
  type: "insight" | "framework" | "case_study" | "video" | "cheat_sheet" | "template";
  category: CategoryKey;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  /**
   * Lightweight markdown: paragraphs separated by blank lines, "## " headings,
   * "- " bullets, "1. " numbered steps, **bold**. Nothing else.
   */
  body: string;
  /** Only for real, verifiable public URLs (e.g. a TED talk). */
  url?: string;
  /** Person or body of work the resource draws on. */
  source?: string;
}
