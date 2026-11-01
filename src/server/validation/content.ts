/**
 * Validation for everything editable in the CMS. Exercise configs and lesson
 * content are JSON documents, so they get full structural schemas — a typo in
 * the CMS must never be able to break a learner's lesson.
 */
import { z } from "zod";
import { CATEGORIES } from "@/lib/taxonomy";

const categoryKeys = CATEGORIES.map((c) => c.key) as [string, ...string[]];
const str = (max: number) => z.string().trim().min(1).max(max);
const dimension = z.enum([
  "clarity",
  "confidence",
  "conciseness",
  "curiosity",
  "empathy",
  "flow",
  "authority",
  "structure",
  "executive_presence",
  "storytelling",
  "persuasion",
]);

export const statusSchema = z.enum(["draft", "review", "published", "archived"]);
export const difficultySchema = z.enum(["beginner", "intermediate", "advanced"]);
export const categorySchema = z.enum(categoryKeys);
export const slugSchema = z
  .string()
  .trim()
  .min(3)
  .max(80)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes.");

export const exerciseConfigSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("choice"),
    scenario: str(1200),
    question: str(300),
    options: z
      .array(z.object({ text: str(400), quality: z.enum(["best", "ok", "weak"]), feedback: str(400) }))
      .min(2)
      .max(5)
      .refine((o) => o.filter((x) => x.quality === "best").length === 1, "Exactly one option must be \"best\"."),
  }),
  z.object({
    type: z.literal("rewrite"),
    instruction: str(400),
    original: str(1200),
    tips: z.array(str(200)).max(6),
    maxWords: z.number().int().min(5).max(300),
    requireQuestion: z.boolean().optional(),
    keywords: z.array(str(40)).max(8).optional(),
    modelAnswer: str(1200),
  }),
  z.object({ type: z.literal("order"), instruction: str(400), items: z.array(str(200)).min(3).max(8), explanation: str(600) }),
  z.object({ type: z.literal("recall"), instruction: str(400), items: z.array(str(200)).min(3).max(15), studySeconds: z.number().int().min(5).max(180), technique: str(500) }),
  z.object({
    type: z.literal("structure"),
    framework: str(80),
    instruction: str(400),
    context: z.string().max(1200).optional(),
    slots: z
      .array(z.object({ key: z.string().regex(/^[a-z_]+$/), label: str(60), hint: str(200), maxWords: z.number().int().min(3).max(200) }))
      .min(2)
      .max(6),
  }),
  z.object({ type: z.literal("decision"), instruction: str(400), prompt: str(1200), suggestedCriteria: z.array(str(80)).min(2).max(6) }),
  z.object({
    type: z.literal("roleplay"),
    mode: z.enum(["conversation", "networking"]),
    setting: str(600),
    counterpart: z.object({ name: str(60), role: str(120), persona: str(600) }),
    objective: str(400),
    openingLine: str(400),
    scriptedTurns: z.array(str(400)).min(1).max(6),
    focus: z.array(dimension).min(1).max(6),
  }),
  z.object({
    type: z.literal("pitch"),
    briefing: str(600),
    audiences: z.array(str(80)).min(1).max(8),
    objectives: z.array(str(80)).min(1).max(8),
    durations: z.array(z.number().int().min(1).max(20)).min(1).max(5),
    suggestedTopics: z.array(str(120)).min(1).max(8),
  }),
]);

export const lessonContentSchema = z.object({
  hook: str(600),
  whyItMatters: str(900),
  coreConcept: z.object({
    title: str(160),
    body: z.array(str(1200)).min(1).max(6),
    keyPoints: z.array(str(240)).min(1).max(6),
  }),
  expertInsight: z.object({ text: str(700), source: str(160), sourceDetail: z.string().max(200).optional() }),
  example: z.object({ situation: str(600), before: str(600), after: str(600), whyItWorks: str(600) }),
  reflectionPrompt: str(300),
});

export const quizQuestionsSchema = z
  .array(
    z
      .object({
        prompt: str(400),
        options: z.array(str(300)).min(2).max(5),
        correctIndex: z.number().int().min(0),
        explanation: str(600),
        conceptKey: slugSchema,
      })
      .refine((q) => q.correctIndex < q.options.length, "correctIndex must point to an option."),
  )
  .min(1)
  .max(6);

const base = {
  title: str(160),
  description: z.string().trim().max(600).default(""),
  category: categorySchema,
  difficulty: difficultySchema,
  estimatedMinutes: z.coerce.number().int().min(1).max(120),
  order: z.coerce.number().int().min(0).max(1000),
  status: statusSchema,
};

export const journeyInputSchema = z.object({ ...base, slug: slugSchema, subtitle: z.string().trim().max(200).optional() });
export const moduleInputSchema = z.object(base);
export const lessonInputSchema = z.object({
  ...base,
  slug: slugSchema,
  xpReward: z.coerce.number().int().min(0).max(500),
  estimatedMinutes: z.coerce.number().int().min(5, "Lessons take 5–15 minutes.").max(15, "Lessons take 5–15 minutes."),
  content: lessonContentSchema,
  exercise: z.object({ title: str(160), description: z.string().max(600).default(""), config: exerciseConfigSchema }).nullable(),
  quiz: quizQuestionsSchema.nullable(),
  action: z
    .object({
      title: str(200),
      description: str(800),
      successCriteria: z.string().max(400).optional(),
      difficulty: difficultySchema,
      estimatedMinutes: z.coerce.number().int().min(1).max(60),
    })
    .nullable(),
});
export const resourceInputSchema = z.object({
  ...base,
  slug: slugSchema,
  type: z.enum(["insight", "framework", "case_study", "video", "cheat_sheet", "template", "lesson", "exercise"]),
  body: z.string().max(20000),
  url: z
    .string()
    .trim()
    .max(500)
    .refine((u) => u === "" || /^https:\/\//.test(u), "Links must start with https://")
    .optional(),
});
export const practiceInputSchema = z.object({ ...base, slug: slugSchema, config: exerciseConfigSchema });

export type LessonInput = z.infer<typeof lessonInputSchema>;
