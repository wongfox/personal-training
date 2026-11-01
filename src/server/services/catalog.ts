/**
 * Read models for browsing: journeys, the practice library and the Explore
 * content library.
 */
import { and, asc, desc, eq, sql } from "drizzle-orm";
import type { Executor } from "@/server/db";
import {
  exerciseAttempts,
  exercises,
  expertSources,
  journeyModules,
  journeys,
  lessonProgress,
  lessons,
  resources,
} from "@/server/db/schema";

export async function listJourneys(db: Executor, userId: string) {
  return db
    .select({
      id: journeys.id,
      slug: journeys.slug,
      title: journeys.title,
      subtitle: journeys.subtitle,
      difficulty: journeys.difficulty,
      category: journeys.category,
      lessons: sql<number>`count(${lessons.id})::int`,
      completed: sql<number>`count(${lessonProgress.id}) filter (where ${lessonProgress.status} = 'completed')::int`,
    })
    .from(journeys)
    .leftJoin(journeyModules, and(eq(journeyModules.journeyId, journeys.id), eq(journeyModules.status, "published")))
    .leftJoin(lessons, and(eq(lessons.moduleId, journeyModules.id), eq(lessons.status, "published")))
    .leftJoin(lessonProgress, and(eq(lessonProgress.lessonId, lessons.id), eq(lessonProgress.userId, userId)))
    .where(eq(journeys.status, "published"))
    .groupBy(journeys.id)
    .orderBy(asc(journeys.order));
}

export async function listPracticeTools(db: Executor, userId: string) {
  return db
    .select({
      id: exercises.id,
      slug: exercises.slug,
      title: exercises.title,
      description: exercises.description,
      type: exercises.type,
      category: exercises.category,
      difficulty: exercises.difficulty,
      estimatedMinutes: exercises.estimatedMinutes,
      attempts: sql<number>`count(${exerciseAttempts.id})::int`,
      bestScore: sql<number | null>`max(${exerciseAttempts.score})`,
    })
    .from(exercises)
    .leftJoin(exerciseAttempts, and(eq(exerciseAttempts.exerciseId, exercises.id), eq(exerciseAttempts.userId, userId)))
    .where(and(eq(exercises.isPractice, true), eq(exercises.status, "published")))
    .groupBy(exercises.id)
    .orderBy(asc(exercises.order));
}

export type PracticeToolSummary = Awaited<ReturnType<typeof listPracticeTools>>[number];

export async function getPracticeTool(db: Executor, slug: string) {
  const [row] = await db
    .select()
    .from(exercises)
    .where(and(eq(exercises.slug, slug), eq(exercises.isPractice, true), eq(exercises.status, "published")));
  return row ?? null;
}

export async function recentPracticeAttempts(db: Executor, userId: string, exerciseId: string) {
  return db
    .select({ id: exerciseAttempts.id, score: exerciseAttempts.score, createdAt: exerciseAttempts.createdAt })
    .from(exerciseAttempts)
    .where(and(eq(exerciseAttempts.userId, userId), eq(exerciseAttempts.exerciseId, exerciseId)))
    .orderBy(desc(exerciseAttempts.createdAt))
    .limit(5);
}

export async function listResources(db: Executor, filter: { category?: string; type?: string; q?: string } = {}) {
  const conditions = [eq(resources.status, "published")];
  if (filter.category) conditions.push(eq(resources.category, filter.category));
  if (filter.type) conditions.push(sql`${resources.type} = ${filter.type}`);
  if (filter.q) {
    const like = `%${filter.q.replace(/[%_\\]/g, (m) => `\\${m}`)}%`;
    conditions.push(sql`(${resources.title} ilike ${like} or ${resources.description} ilike ${like} or ${resources.body} ilike ${like})`);
  }
  return db
    .select({
      id: resources.id,
      slug: resources.slug,
      title: resources.title,
      description: resources.description,
      type: resources.type,
      category: resources.category,
      estimatedMinutes: resources.estimatedMinutes,
    })
    .from(resources)
    .where(and(...conditions))
    .orderBy(asc(resources.order));
}

export async function getResource(db: Executor, slug: string) {
  const [row] = await db
    .select({ resource: resources, source: expertSources.name })
    .from(resources)
    .leftJoin(expertSources, eq(expertSources.id, resources.expertSourceId))
    .where(and(eq(resources.slug, slug), eq(resources.status, "published")));
  return row ?? null;
}
