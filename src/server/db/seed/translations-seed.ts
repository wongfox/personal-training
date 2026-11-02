/**
 * Writes the Spanish overlays (content-es/*) into each content row's
 * `translations.es`. Runs after the English seed, matched by slug/key. Rows
 * that already carry a Spanish translation (e.g. edited in the CMS) are left
 * alone unless `force` is set.
 */
import { and, eq } from "drizzle-orm";
import type { Executor } from "@/server/db";
import {
  achievements,
  assessmentQuestions,
  dailyActions,
  exercises,
  goals,
  journeyModules,
  journeys,
  lessons,
  quizQuestions,
  quizzes,
  resources,
  skills,
} from "@/server/db/schema";
import type { ContentTranslations } from "@/server/db/types";
import { achievementsEs, assessmentQuestionsEs, goalsEs, skillsEs } from "./content-es/base";
import { communicationMasteryEs } from "./content-es/communication-mastery";
import { confidentPresenceEs } from "./content-es/confident-presence";
import { connectWithAnyoneEs } from "./content-es/connect-with-anyone";
import { leadTheRoomEs } from "./content-es/lead-the-room";
import { practiceToolsEs } from "./content-es/practice";
import { resourcesEs } from "./content-es/resources";
import { sharperThinkingEs } from "./content-es/sharper-thinking";
import type { JourneyTranslation } from "./translations";
import type { JourneySeed } from "./types";

export const JOURNEY_TRANSLATIONS_ES: Record<string, JourneyTranslation> = {
  "communication-mastery": communicationMasteryEs,
  "confident-presence": confidentPresenceEs,
  "lead-the-room": leadTheRoomEs,
  "sharper-thinking": sharperThinkingEs,
  "connect-with-anyone": connectWithAnyoneEs,
};

type Translatable = { translations: ContentTranslations };

/** Merge `es` into existing translations; false when the row already has Spanish and we're not forcing. */
function nextTranslations(current: ContentTranslations | null | undefined, es: Record<string, unknown>, force: boolean): ContentTranslations | null {
  if (current?.es && Object.keys(current.es).length > 0 && !force) return null;
  return { ...(current ?? {}), es };
}

export async function seedTranslations(db: Executor, journeySeeds: JourneySeed[], { force = false } = {}): Promise<number> {
  let written = 0;
  async function write<T extends Translatable>(row: T | undefined, es: Record<string, unknown>, apply: (t: ContentTranslations) => Promise<unknown>) {
    if (!row) return;
    const next = nextTranslations(row.translations, es, force);
    if (!next) return;
    await apply(next);
    written++;
  }

  // Reference data
  for (const [key, s] of Object.entries(skillsEs)) {
    const [row] = await db.select({ translations: skills.translations }).from(skills).where(eq(skills.key, key));
    await write(row, s, (t) => db.update(skills).set({ translations: t }).where(eq(skills.key, key)));
  }
  for (const [key, name] of Object.entries(goalsEs)) {
    const [row] = await db.select({ translations: goals.translations }).from(goals).where(eq(goals.key, key));
    await write(row, { name }, (t) => db.update(goals).set({ translations: t }).where(eq(goals.key, key)));
  }
  for (const [key, q] of Object.entries(assessmentQuestionsEs)) {
    const [row] = await db.select({ translations: assessmentQuestions.translations }).from(assessmentQuestions).where(eq(assessmentQuestions.key, key));
    await write(row, { ...q }, (t) => db.update(assessmentQuestions).set({ translations: t }).where(eq(assessmentQuestions.key, key)));
  }
  for (const [key, a] of Object.entries(achievementsEs)) {
    const [row] = await db.select({ translations: achievements.translations }).from(achievements).where(eq(achievements.key, key));
    await write(row, a, (t) => db.update(achievements).set({ translations: t }).where(eq(achievements.key, key)));
  }

  // Journeys → modules → lessons (+ exercise, quiz, questions, mission)
  for (const j of journeySeeds) {
    const tr = JOURNEY_TRANSLATIONS_ES[j.slug];
    if (!tr) continue;
    const [journey] = await db.select({ id: journeys.id, translations: journeys.translations }).from(journeys).where(eq(journeys.slug, j.slug));
    if (!journey) continue;
    await write(journey, { title: tr.title, subtitle: tr.subtitle, description: tr.description }, (t) =>
      db.update(journeys).set({ translations: t }).where(eq(journeys.id, journey.id)),
    );

    for (const [mIdx, m] of j.modules.entries()) {
      const mt = tr.modules[mIdx];
      const [mod] = await db
        .select({ id: journeyModules.id, translations: journeyModules.translations })
        .from(journeyModules)
        .where(and(eq(journeyModules.journeyId, journey.id), eq(journeyModules.order, mIdx + 1)));
      if (mt) await write(mod, { title: mt.title, description: mt.description }, (t) => db.update(journeyModules).set({ translations: t }).where(eq(journeyModules.id, mod!.id)));

      for (const l of m.lessons) {
        const lt = tr.lessons[l.slug];
        if (!lt) continue;
        const [lesson] = await db.select({ id: lessons.id, translations: lessons.translations }).from(lessons).where(eq(lessons.slug, l.slug));
        if (!lesson) continue;
        await write(lesson, { title: lt.title, description: lt.description, content: lt.content }, (t) =>
          db.update(lessons).set({ translations: t }).where(eq(lessons.id, lesson.id)),
        );

        const [exercise] = await db.select({ id: exercises.id, translations: exercises.translations }).from(exercises).where(eq(exercises.slug, `${l.slug}-exercise`));
        await write(exercise, { ...lt.exercise }, (t) => db.update(exercises).set({ translations: t }).where(eq(exercises.id, exercise!.id)));

        const [quiz] = await db.select({ id: quizzes.id, translations: quizzes.translations }).from(quizzes).where(eq(quizzes.lessonId, lesson.id));
        if (quiz) {
          await write(quiz, { title: `${lt.title} — repaso rápido` }, (t) => db.update(quizzes).set({ translations: t }).where(eq(quizzes.id, quiz.id)));
          for (const [qIdx, q] of l.quiz.entries()) {
            const qt = lt.quiz[qIdx];
            if (!qt) continue;
            const [question] = await db
              .select({ id: quizQuestions.id, translations: quizQuestions.translations })
              .from(quizQuestions)
              .where(and(eq(quizQuestions.quizId, quiz.id), eq(quizQuestions.conceptKey, q.conceptKey)));
            await write(question, { ...qt }, (t) => db.update(quizQuestions).set({ translations: t }).where(eq(quizQuestions.id, question!.id)));
          }
        }

        const [action] = await db.select({ id: dailyActions.id, translations: dailyActions.translations }).from(dailyActions).where(eq(dailyActions.lessonId, lesson.id));
        await write(action, { ...lt.action }, (t) => db.update(dailyActions).set({ translations: t }).where(eq(dailyActions.id, action!.id)));
      }
    }
  }

  // Practice tools and library
  for (const [slug, p] of Object.entries(practiceToolsEs)) {
    const [row] = await db.select({ id: exercises.id, translations: exercises.translations }).from(exercises).where(eq(exercises.slug, slug));
    await write(row, { ...p }, (t) => db.update(exercises).set({ translations: t }).where(eq(exercises.id, row!.id)));
  }
  for (const [slug, r] of Object.entries(resourcesEs)) {
    const [row] = await db.select({ id: resources.id, translations: resources.translations }).from(resources).where(eq(resources.slug, slug));
    await write(row, { ...r }, (t) => db.update(resources).set({ translations: t }).where(eq(resources.id, row!.id)));
  }

  return written;
}
