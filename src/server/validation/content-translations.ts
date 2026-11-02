/**
 * Validation for the Spanish versions edited in the CMS. Text fields are
 * optional — an empty field means "use the English text". Structured fields
 * (lesson content, exercise configs, quiz questions) get the same structural
 * schemas as English, so a translation can never break a learner's lesson.
 * Answer keys (option quality, order, correctIndex, conceptKey) always come
 * from English; the service checks a translated config keeps them.
 */
import { z } from "zod";
import { exerciseConfigSchema, lessonContentSchema, slugSchema } from "./content";

/** Optional translated text: trimmed, "" when missing. */
const text = (max: number) => z.string().trim().max(max).default("");
const str = (max: number) => z.string().trim().min(1).max(max);

export const journeyTranslationSchema = z.object({ title: text(160), subtitle: text(200), description: text(600) });
export const moduleTranslationSchema = z.object({ title: text(160), description: text(600) });
export const resourceTranslationSchema = z.object({ title: text(160), description: text(600), body: text(20000) });
export const practiceTranslationSchema = z.object({ title: text(160), description: text(600), config: exerciseConfigSchema.nullable() });

export const quizTranslationSchema = z
  .array(
    z.object({
      conceptKey: slugSchema,
      prompt: str(400),
      options: z.array(str(300)).min(2).max(5),
      explanation: str(600),
    }),
  )
  .max(6);

export const lessonTranslationSchema = z.object({
  title: text(160),
  description: text(600),
  content: lessonContentSchema.nullable(),
  exercise: z.object({ title: text(160), description: text(600), config: exerciseConfigSchema.nullable() }),
  quiz: quizTranslationSchema.nullable(),
  action: z.object({ title: text(200), description: text(800), successCriteria: text(400) }),
});

export type JourneyTranslationInput = z.infer<typeof journeyTranslationSchema>;
export type ModuleTranslationInput = z.infer<typeof moduleTranslationSchema>;
export type ResourceTranslationInput = z.infer<typeof resourceTranslationSchema>;
export type PracticeTranslationInput = z.infer<typeof practiceTranslationSchema>;
export type LessonTranslationInput = z.infer<typeof lessonTranslationSchema>;
