/**
 * Idempotent seed. Reference data (roles, skills, goals, questions,
 * achievements) is upserted. Content is inserted only when missing, so
 * re-running never overwrites edits made in the admin CMS — unless
 * `force` is set, which refreshes seeded content from these files.
 */
import { and, eq } from "drizzle-orm";
import { CATEGORIES, categorySkill, GOALS, SKILLS } from "@/lib/taxonomy";
import { ROLE_INFO, ROLE_KEYS } from "@/server/auth/rbac";
import type { Executor } from "@/server/db";
import {
  achievements,
  assessmentQuestions,
  contentTagRelations,
  contentTags,
  dailyActions,
  exercises,
  expertSources,
  goals,
  journeyModules,
  journeys,
  lessons,
  quizQuestions,
  quizzes,
  resources,
  roles,
  skills,
} from "@/server/db/schema";
import { ACHIEVEMENTS } from "@/server/services/rewards";
import { ASSESSMENT_QUESTIONS } from "./base";
import { communicationMastery } from "./content/communication-mastery";
import { confidentPresence } from "./content/confident-presence";
import { connectWithAnyone } from "./content/connect-with-anyone";
import { leadTheRoom } from "./content/lead-the-room";
import { practiceTools } from "./content/practice";
import { resources as resourceSeeds } from "./content/resources";
import { sharperThinking } from "./content/sharper-thinking";
import { seedTranslations } from "./translations-seed";
import type { JourneySeed } from "./types";

export const JOURNEY_SEEDS: JourneySeed[] = [communicationMastery, confidentPresence, leadTheRoom, sharperThinking, connectWithAnyone];

export interface SeedReport {
  journeys: number;
  lessons: number;
  practice: number;
  resources: number;
  /** Rows that received a Spanish overlay this run. */
  translations?: number;
}

async function skillIdMap(db: Executor) {
  const rows = await db.select({ id: skills.id, key: skills.key }).from(skills);
  return new Map(rows.map((r) => [r.key, r.id]));
}

export async function seedReferenceData(db: Executor): Promise<void> {
  for (const key of ROLE_KEYS) {
    await db
      .insert(roles)
      .values({ key, name: ROLE_INFO[key].name, description: ROLE_INFO[key].description })
      .onConflictDoUpdate({ target: roles.key, set: { name: ROLE_INFO[key].name, description: ROLE_INFO[key].description } });
  }
  for (const [order, s] of SKILLS.entries()) {
    await db
      .insert(skills)
      .values({ key: s.key, name: s.name, description: s.description, order })
      .onConflictDoUpdate({ target: skills.key, set: { name: s.name, description: s.description, order } });
  }
  const skillIds = await skillIdMap(db);
  for (const [order, g] of GOALS.entries()) {
    const skillId = skillIds.get(g.skill) ?? null;
    await db
      .insert(goals)
      .values({ key: g.key, name: g.name, skillId, order })
      .onConflictDoUpdate({ target: goals.key, set: { name: g.name, skillId, order } });
  }
  for (const [order, q] of ASSESSMENT_QUESTIONS.entries()) {
    const values = { ...q, helpText: q.helpText ?? null, order, status: "published" as const };
    await db.insert(assessmentQuestions).values(values).onConflictDoUpdate({ target: assessmentQuestions.key, set: values });
  }
  for (const [order, a] of ACHIEVEMENTS.entries()) {
    await db
      .insert(achievements)
      .values({ ...a, order })
      .onConflictDoUpdate({ target: achievements.key, set: { title: a.title, description: a.description, xpReward: a.xpReward, order } });
  }
  for (const c of CATEGORIES) {
    await db.insert(contentTags).values({ slug: c.key, name: c.name }).onConflictDoNothing();
  }
}

async function tag(db: Executor, category: string, contentType: string, contentId: string) {
  const [t] = await db.select({ id: contentTags.id }).from(contentTags).where(eq(contentTags.slug, category));
  if (t) await db.insert(contentTagRelations).values({ tagId: t.id, contentType, contentId }).onConflictDoNothing();
}

export async function seedContent(db: Executor, { force = false } = {}): Promise<SeedReport> {
  const skillIds = await skillIdMap(db);
  const skillFor = (category: string) => skillIds.get(categorySkill(category)) ?? null;
  const now = new Date();
  const report: SeedReport = { journeys: 0, lessons: 0, practice: 0, resources: 0 };

  for (const j of JOURNEY_SEEDS) {
    const journeyValues = {
      slug: j.slug,
      title: j.title,
      subtitle: j.subtitle,
      description: j.description,
      category: j.category,
      skillId: skillFor(j.category),
      difficulty: j.difficulty,
      order: j.order,
      estimatedMinutes: j.modules.flatMap((m) => m.lessons).reduce((s, l) => s + l.estimatedMinutes, 0),
      status: "published" as const,
      publishedAt: now,
    };
    let [journey] = await db.select().from(journeys).where(eq(journeys.slug, j.slug));
    if (!journey) [journey] = await db.insert(journeys).values(journeyValues).returning();
    else if (force) [journey] = await db.update(journeys).set(journeyValues).where(eq(journeys.id, journey.id)).returning();
    report.journeys++;
    await tag(db, j.category, "journey", journey.id);

    for (const [mIdx, m] of j.modules.entries()) {
      const moduleValues = {
        journeyId: journey.id,
        title: m.title,
        description: m.description,
        category: m.lessons[0]?.category ?? j.category,
        difficulty: j.difficulty,
        order: mIdx + 1,
        estimatedMinutes: m.lessons.reduce((s, l) => s + l.estimatedMinutes, 0),
        status: "published" as const,
        publishedAt: now,
      };
      let [mod] = await db
        .select()
        .from(journeyModules)
        .where(and(eq(journeyModules.journeyId, journey.id), eq(journeyModules.order, mIdx + 1)));
      if (!mod) [mod] = await db.insert(journeyModules).values(moduleValues).returning();
      else if (force) [mod] = await db.update(journeyModules).set(moduleValues).where(eq(journeyModules.id, mod.id)).returning();

      for (const [lIdx, l] of m.lessons.entries()) {
        const lessonValues = {
          moduleId: mod.id,
          slug: l.slug,
          title: l.title,
          description: l.description,
          category: l.category,
          skillId: skillFor(l.category),
          difficulty: l.difficulty,
          estimatedMinutes: l.estimatedMinutes,
          order: lIdx + 1,
          content: l.content,
          status: "published" as const,
          publishedAt: now,
        };
        let [lesson] = await db.select().from(lessons).where(eq(lessons.slug, l.slug));
        const isNew = !lesson;
        if (!lesson) [lesson] = await db.insert(lessons).values(lessonValues).returning();
        else if (force) [lesson] = await db.update(lessons).set(lessonValues).where(eq(lessons.id, lesson.id)).returning();
        report.lessons++;
        if (!isNew && !force) continue;
        await tag(db, l.category, "lesson", lesson.id);

        const exerciseValues = {
          lessonId: lesson.id,
          slug: `${l.slug}-exercise`,
          type: l.exercise.config.type,
          title: l.exercise.title,
          description: l.exercise.description,
          category: l.category,
          skillId: skillFor(l.category),
          difficulty: l.difficulty,
          estimatedMinutes: 3,
          config: l.exercise.config,
          status: "published" as const,
          publishedAt: now,
        };
        await db.insert(exercises).values(exerciseValues).onConflictDoUpdate({ target: exercises.slug, set: exerciseValues });

        const quizValues = {
          lessonId: lesson.id,
          title: `${l.title} — knowledge check`,
          category: l.category,
          difficulty: l.difficulty,
          estimatedMinutes: 2,
          status: "published" as const,
          publishedAt: now,
        };
        const [quiz] = await db
          .insert(quizzes)
          .values(quizValues)
          .onConflictDoUpdate({ target: quizzes.lessonId, set: quizValues })
          .returning();
        for (const [qIdx, q] of l.quiz.entries()) {
          const qValues = { quizId: quiz.id, prompt: q.prompt, options: q.options, correctIndex: q.correctIndex, explanation: q.explanation, conceptKey: q.conceptKey, order: qIdx + 1 };
          const [existing] = await db
            .select({ id: quizQuestions.id })
            .from(quizQuestions)
            .where(and(eq(quizQuestions.quizId, quiz.id), eq(quizQuestions.conceptKey, q.conceptKey)));
          if (existing) await db.update(quizQuestions).set(qValues).where(eq(quizQuestions.id, existing.id));
          else await db.insert(quizQuestions).values(qValues);
        }

        const actionValues = {
          lessonId: lesson.id,
          title: l.action.title,
          description: l.action.description,
          successCriteria: l.action.successCriteria,
          category: l.category,
          difficulty: l.action.difficulty,
          estimatedMinutes: l.action.estimatedMinutes,
          status: "published" as const,
          publishedAt: now,
        };
        await db.insert(dailyActions).values(actionValues).onConflictDoUpdate({ target: dailyActions.lessonId, set: actionValues });
      }
    }
  }

  for (const [idx, p] of practiceTools.entries()) {
    const values = {
      slug: p.slug,
      type: p.config.type,
      title: p.title,
      description: p.description,
      category: p.category,
      skillId: skillFor(p.category),
      difficulty: p.difficulty,
      estimatedMinutes: p.estimatedMinutes,
      config: p.config,
      isPractice: true,
      order: idx + 1,
      status: "published" as const,
      publishedAt: now,
    };
    const [existing] = await db.select({ id: exercises.id }).from(exercises).where(eq(exercises.slug, p.slug));
    if (!existing) {
      const [row] = await db.insert(exercises).values(values).returning({ id: exercises.id });
      await tag(db, p.category, "exercise", row.id);
    } else if (force) await db.update(exercises).set(values).where(eq(exercises.id, existing.id));
    report.practice++;
  }

  for (const [idx, r] of resourceSeeds.entries()) {
    let expertSourceId: string | null = null;
    if (r.source) {
      const [src] = await db.select({ id: expertSources.id }).from(expertSources).where(eq(expertSources.name, r.source));
      expertSourceId = src?.id ?? (await db.insert(expertSources).values({ name: r.source }).returning({ id: expertSources.id }))[0].id;
    }
    const values = {
      slug: r.slug,
      type: r.type,
      title: r.title,
      description: r.description,
      category: r.category,
      skillId: skillFor(r.category),
      difficulty: r.difficulty,
      estimatedMinutes: r.estimatedMinutes,
      body: r.body,
      url: r.url ?? null,
      expertSourceId,
      order: idx + 1,
      status: "published" as const,
      publishedAt: now,
    };
    const [existing] = await db.select({ id: resources.id }).from(resources).where(eq(resources.slug, r.slug));
    if (!existing) {
      const [row] = await db.insert(resources).values(values).returning({ id: resources.id });
      await tag(db, r.category, "resource", row.id);
    } else if (force) await db.update(resources).set(values).where(eq(resources.id, existing.id));
    report.resources++;
  }

  return report;
}

export async function seedAll(db: Executor, opts: { force?: boolean } = {}): Promise<SeedReport> {
  await seedReferenceData(db);
  const report = await seedContent(db, opts);
  report.translations = await seedTranslations(db, JOURNEY_SEEDS, opts);
  return report;
}
