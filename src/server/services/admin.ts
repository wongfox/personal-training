/**
 * Admin back office: metrics, user management and the content CMS.
 * Every write is permission-checked by the caller and audit-logged here.
 */
import { type AnyColumn, and, asc, count, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { can, grantableRoles, type RoleKey } from "@/server/auth/rbac";
import { invalidateUserSessions } from "@/server/auth/sessions";
import type { Executor } from "@/server/db";
import {
  analyticsEvents,
  auditLogs,
  dailyActionAttempts,
  dailyActions,
  exercises,
  journeyModules,
  journeys,
  lessonProgress,
  lessons,
  profiles,
  quizQuestions,
  quizzes,
  resources,
  roles,
  skills,
  streaks,
  userJourneys,
  userRoles,
  users,
} from "@/server/db/schema";
import type { ContentTranslations, ExerciseConfig } from "@/server/db/types";
import { categorySkill } from "@/lib/taxonomy";
import { ForbiddenError, NotFoundError, ValidationError } from "@/server/errors";
import { audit } from "@/server/platform";
import type { LessonInput } from "@/server/validation/content";
import type {
  JourneyTranslationInput,
  LessonTranslationInput,
  ModuleTranslationInput,
  PracticeTranslationInput,
  ResourceTranslationInput,
} from "@/server/validation/content-translations";
import { grantRole, revokeRole } from "./accounts";

type Status = "draft" | "review" | "published" | "archived";
type Actor = { id: string; roles: string[] };

/**
 * Tags an error with an `admin.errors.*` message key so the back office can
 * show it in the reader's language. The English message stays the default.
 */
function keyed<E extends Error>(error: E, key: string, vars?: Record<string, string | number>): E {
  return Object.assign(error, { i18nKey: `admin.errors.${key}`, i18nVars: vars });
}

/** The message key (and placeholders) attached by `keyed`, if any. */
export function adminErrorKey(error: unknown): { key: string; vars?: Record<string, string | number> } | null {
  const e = error as { i18nKey?: unknown; i18nVars?: Record<string, string | number> } | null;
  return e && typeof e.i18nKey === "string" ? { key: e.i18nKey, vars: e.i18nVars } : null;
}

/** True when a content row carries a (non-empty) Spanish translation. */
export function hasSpanish(translations: ContentTranslations | null | undefined): boolean {
  return !!translations?.es && Object.keys(translations.es).length > 0;
}

/** SQL twin of `hasSpanish` for list queries. */
const hasSpanishSql = (column: AnyColumn) => sql<boolean>`coalesce(${column} -> 'es', '{}'::jsonb) <> '{}'::jsonb`;

/* ─────────────────────────── Metrics ─────────────────────────── */

/** Learners only: onboarded accounts without staff roles. */
const learnerOnly = (userIdColumn: unknown) =>
  sql`exists (select 1 from profiles p where p.user_id = ${userIdColumn} and p.onboarding_completed_at is not null)
    and not exists (select 1 from user_roles ur join roles r on r.id = ur.role_id where ur.user_id = ${userIdColumn} and r.key in ('SUPER_ADMIN','ADMIN','CONTENT_MANAGER','COACH'))`;

async function distinctActive(db: Executor, days: number): Promise<number> {
  const [row] = await db
    .select({ n: sql<number>`count(distinct ${analyticsEvents.userId})::int` })
    .from(analyticsEvents)
    .where(and(sql`${analyticsEvents.createdAt} >= now() - (${days} || ' days')::interval`, learnerOnly(analyticsEvents.userId)));
  return Number(row?.n ?? 0);
}

export async function getMetrics(db: Executor) {
  const [
    [registered],
    [onboarded],
    dau,
    wau,
    mau,
    [lessonsTotal],
    [lessonsWeek],
    [startedLessons],
    [avgStreak],
    [retention],
    activeJourneys,
    daily,
    [firstLesson],
    [firstMission],
    eventCounts,
  ] = await Promise.all([
    db.select({ n: count() }).from(users),
    db.select({ n: count() }).from(profiles).where(sql`${profiles.onboardingCompletedAt} is not null`),
    distinctActive(db, 1),
    distinctActive(db, 7),
    distinctActive(db, 30),
    db.select({ n: count() }).from(lessonProgress).where(eq(lessonProgress.status, "completed")),
    db.select({ n: count() }).from(lessonProgress).where(and(eq(lessonProgress.status, "completed"), sql`${lessonProgress.completedAt} >= now() - interval '7 days'`)),
    db.select({ n: count() }).from(lessonProgress),
    db
      .select({ avg: sql<number>`coalesce(avg(case when ${streaks.lastActiveDate} >= current_date - 1 then ${streaks.current} else 0 end), 0)::float` })
      .from(streaks),
    // D7 retention: of users who signed up 7–37 days ago, how many were active a week or more after signing up.
    db
      .select({
        cohort: sql<number>`count(*)::int`,
        retained: sql<number>`count(*) filter (where exists (select 1 from ${analyticsEvents} e where e.user_id = users.id and e.created_at >= users.created_at + interval '7 days'))::int`,
      })
      .from(users)
      .where(sql`${users.createdAt} between now() - interval '37 days' and now() - interval '7 days'`),
    db
      .select({ title: journeys.title, n: count() })
      .from(userJourneys)
      .innerJoin(journeys, eq(journeys.id, userJourneys.journeyId))
      .where(eq(userJourneys.status, "active"))
      .groupBy(journeys.title)
      .orderBy(desc(count())),
    db
      .select({ day: sql<string>`to_char(date_trunc('day', ${analyticsEvents.createdAt}), 'YYYY-MM-DD')`, n: sql<number>`count(distinct ${analyticsEvents.userId})::int` })
      .from(analyticsEvents)
      .where(and(sql`${analyticsEvents.createdAt} >= now() - interval '14 days'`, learnerOnly(analyticsEvents.userId)))
      .groupBy(sql`1`)
      .orderBy(sql`1`),
    db.select({ n: sql<number>`count(distinct ${lessonProgress.userId})::int` }).from(lessonProgress).where(eq(lessonProgress.status, "completed")),
    db.select({ n: sql<number>`count(distinct ${dailyActionAttempts.userId})::int` }).from(dailyActionAttempts).where(eq(dailyActionAttempts.status, "done")),
    db
      .select({ name: analyticsEvents.name, n: count() })
      .from(analyticsEvents)
      .where(sql`${analyticsEvents.createdAt} >= now() - interval '30 days'`)
      .groupBy(analyticsEvents.name)
      .orderBy(desc(count())),
  ]);

  return {
    registered: Number(registered.n),
    learners: Number(onboarded.n),
    onboarded: Number(onboarded.n),
    dau,
    wau,
    mau,
    lessonsCompleted: Number(lessonsTotal.n),
    lessonsThisWeek: Number(lessonsWeek.n),
    completionRate: Number(startedLessons.n) ? Math.round((Number(lessonsTotal.n) / Number(startedLessons.n)) * 100) : 0,
    averageStreak: Math.round(Number(avgStreak.avg) * 10) / 10,
    retention: { cohort: Number(retention.cohort), retained: Number(retention.retained) },
    activeJourneys: activeJourneys.map((j) => ({ title: j.title, n: Number(j.n) })),
    daily: daily.map((d) => ({ day: d.day, n: Number(d.n) })),
    funnel: [
      { key: "registered", label: "Registered", n: Number(registered.n) },
      { key: "plan", label: "Built a plan", n: Number(onboarded.n) },
      { key: "lesson", label: "Finished a lesson", n: Number(firstLesson.n) },
      { key: "mission", label: "Completed a mission", n: Number(firstMission.n) },
    ],
    events: eventCounts.map((e) => ({ name: e.name, n: Number(e.n) })),
  };
}

/* ─────────────────────────── Users ─────────────────────────── */

export async function listUsers(db: Executor, opts: { q?: string; page?: number }) {
  const page = Math.max(1, opts.page ?? 1);
  const where = opts.q ? or(ilike(users.email, `%${opts.q.replace(/[%_\\]/g, "\\$&")}%`), ilike(users.name, `%${opts.q.replace(/[%_\\]/g, "\\$&")}%`)) : undefined;
  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      status: users.status,
      createdAt: users.createdAt,
      totalXp: profiles.totalXp,
      onboarded: sql<boolean>`${profiles.onboardingCompletedAt} is not null`,
      streak: sql<number>`case when ${streaks.lastActiveDate} >= current_date - 1 then ${streaks.current} else 0 end`,
      lastActive: streaks.lastActiveDate,
      roles: sql<string[]>`coalesce((select array_agg(r.key order by r.key) from ${userRoles} ur join ${roles} r on r.id = ur.role_id where ur.user_id = users.id), '{}')`,
    })
    .from(users)
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .leftJoin(streaks, eq(streaks.userId, users.id))
    .where(where)
    .orderBy(desc(users.createdAt))
    .limit(50)
    .offset((page - 1) * 50);
  const [total] = await db.select({ n: count() }).from(users).where(where);
  return { rows, total: Number(total.n), page };
}

export async function getUserRoles(db: Executor, userId: string): Promise<string[]> {
  const rows = await db.select({ key: roles.key }).from(userRoles).innerJoin(roles, eq(roles.id, userRoles.roleId)).where(eq(userRoles.userId, userId));
  return rows.map((r) => r.key);
}

export async function getAdminUser(db: Executor, userId: string) {
  const [user] = await db.select({ id: users.id, name: users.name, email: users.email, status: users.status, createdAt: users.createdAt }).from(users).where(eq(users.id, userId));
  if (!user) throw keyed(new NotFoundError("User not found."), "notFound.user");
  return { ...user, roles: await getUserRoles(db, userId) };
}

async function countSuperAdmins(db: Executor): Promise<number> {
  const [row] = await db
    .select({ n: count() })
    .from(userRoles)
    .innerJoin(roles, eq(roles.id, userRoles.roleId))
    .innerJoin(users, eq(users.id, userRoles.userId))
    .where(and(eq(roles.key, "SUPER_ADMIN"), eq(users.status, "active")));
  return Number(row.n);
}

export async function setUserRole(
  db: Executor,
  actor: { id: string; roles: string[] },
  targetId: string,
  role: RoleKey,
  grant: boolean,
  ip: string | null,
) {
  if (actor.id === targetId) throw keyed(new ForbiddenError("You can't change your own roles."), "ownRoles");
  if (!grantableRoles(actor.roles).includes(role)) throw keyed(new ForbiddenError("You can't manage that role."), "cantManageRole");
  const target = await getAdminUser(db, targetId);
  // Admins can't touch accounts that hold roles above their own grant level.
  if (target.roles.some((r) => !grantableRoles(actor.roles).includes(r as RoleKey))) throw keyed(new ForbiddenError("That account is managed by a super admin."), "superAdminManaged");
  if (role === "USER" && !grant) throw keyed(new ValidationError("Every account keeps the learner role."), "learnerRole");
  if (role === "SUPER_ADMIN" && !grant && (await countSuperAdmins(db)) <= 1) throw keyed(new ValidationError("There must always be one super admin."), "lastSuperAdmin");
  if (grant) await grantRole(db, targetId, role, actor.id);
  else await revokeRole(db, targetId, role);
  await audit(db, { actorId: actor.id, action: grant ? "role.grant" : "role.revoke", entityType: "user", entityId: targetId, metadata: { role }, ipAddress: ip });
}

export async function setUserStatus(db: Executor, actor: { id: string; roles: string[] }, targetId: string, status: "active" | "suspended", ip: string | null) {
  if (actor.id === targetId) throw keyed(new ForbiddenError("You can't suspend yourself."), "suspendSelf");
  const target = await getAdminUser(db, targetId);
  if (target.roles.some((r) => !grantableRoles(actor.roles).includes(r as RoleKey))) throw keyed(new ForbiddenError("That account is managed by a super admin."), "superAdminManaged");
  await db.update(users).set({ status }).where(eq(users.id, targetId));
  if (status === "suspended") await invalidateUserSessions(db, targetId);
  await audit(db, { actorId: actor.id, action: `user.${status === "active" ? "reactivate" : "suspend"}`, entityType: "user", entityId: targetId, ipAddress: ip });
}

export async function listAudit(db: Executor, limit = 100) {
  return db
    .select({ id: auditLogs.id, action: auditLogs.action, entityType: auditLogs.entityType, entityId: auditLogs.entityId, metadata: auditLogs.metadata, createdAt: auditLogs.createdAt, actor: users.email })
    .from(auditLogs)
    .leftJoin(users, eq(users.id, auditLogs.actorId))
    .orderBy(desc(auditLogs.createdAt))
    .limit(limit);
}

/* ─────────────────────────── Content: shared rules ─────────────────────────── */

/** Content managers draft and submit for review; only admins publish or archive. */
export function assertStatusAllowed(actorRoles: string[], next: Status, current?: Status) {
  if (can(actorRoles, "content:publish")) return;
  // Live content is what learners see right now: changing it (wording, answer
  // keys, status) is an admin decision, never a silent edit.
  if (current === "published" || current === "archived") {
    throw keyed(new ForbiddenError("This item is live. Only an admin can change it — ask them to move it back to Review if it needs work."), "liveLocked");
  }
  if (next === "published" || next === "archived") {
    throw keyed(new ForbiddenError("Only admins can publish or archive. Set it to Review and an admin will publish it."), "publishOnly");
  }
}

function publishedAt(next: Status, current: { status: Status; publishedAt: Date | null } | undefined): Date | null {
  if (next !== "published") return current?.publishedAt ?? null;
  return current?.publishedAt ?? new Date();
}

function isUniqueViolation(e: unknown): boolean {
  const err = e as { code?: string; cause?: { code?: string } };
  return err?.code === "23505" || err?.cause?.code === "23505";
}

async function guardUnique<T>(fn: () => Promise<T>, what: "slug" | "exercise slug"): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (isUniqueViolation(e)) throw keyed(new ValidationError(`That ${what} is already in use.`), what === "slug" ? "slugTaken" : "exerciseSlugTaken");
    throw e;
  }
}

/* ─────────────────────────── Journeys & modules ─────────────────────────── */

export async function listJourneysAdmin(db: Executor) {
  return db
    .select({
      id: journeys.id,
      slug: journeys.slug,
      title: journeys.title,
      status: journeys.status,
      category: journeys.category,
      order: journeys.order,
      modules: sql<number>`(select count(*)::int from ${journeyModules} m where m.journey_id = journeys.id)`,
      lessons: sql<number>`(select count(*)::int from ${lessons} l join ${journeyModules} m on m.id = l.module_id where m.journey_id = journeys.id)`,
      learners: sql<number>`(select count(*)::int from ${userJourneys} uj where uj.journey_id = journeys.id)`,
      updatedAt: journeys.updatedAt,
      hasEs: hasSpanishSql(journeys.translations),
    })
    .from(journeys)
    .orderBy(asc(journeys.order));
}

export async function getJourneyAdmin(db: Executor, id: string) {
  const [journey] = await db.select().from(journeys).where(eq(journeys.id, id));
  if (!journey) throw keyed(new NotFoundError("Journey not found."), "notFound.journey");
  const modules = await db
    .select({
      id: journeyModules.id,
      title: journeyModules.title,
      status: journeyModules.status,
      order: journeyModules.order,
      estimatedMinutes: journeyModules.estimatedMinutes,
      lessons: sql<number>`(select count(*)::int from ${lessons} l where l.module_id = journey_modules.id)`,
      hasEs: hasSpanishSql(journeyModules.translations),
    })
    .from(journeyModules)
    .where(eq(journeyModules.journeyId, id))
    .orderBy(asc(journeyModules.order));
  return { journey, modules };
}

type JourneyFields = {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  order: number;
  status: Status;
};

export async function saveJourney(db: Executor, actor: { id: string; roles: string[] }, id: string | null, v: JourneyFields) {
  const [current] = id ? await db.select().from(journeys).where(eq(journeys.id, id)) : [];
  if (id && !current) throw keyed(new NotFoundError("Journey not found."), "notFound.journey");
  assertStatusAllowed(actor.roles, v.status, current?.status);
  const [skill] = await db.select({ id: skills.id }).from(skills).where(eq(skills.key, categorySkill(v.category)));
  const values = { ...v, subtitle: v.subtitle || null, skillId: skill?.id ?? null, publishedAt: publishedAt(v.status, current) };
  const [row] = await guardUnique(
    () => (current ? db.update(journeys).set(values).where(eq(journeys.id, current.id)).returning() : db.insert(journeys).values(values).returning()),
    "slug",
  );
  await audit(db, { actorId: actor.id, action: current ? "journey.update" : "journey.create", entityType: "journey", entityId: row.id, metadata: { title: v.title, status: v.status } });
  return row;
}

type ModuleFields = Omit<JourneyFields, "slug" | "subtitle">;

export async function getModuleAdmin(db: Executor, id: string) {
  const [mod] = await db.select().from(journeyModules).where(eq(journeyModules.id, id));
  if (!mod) throw keyed(new NotFoundError("Module not found."), "notFound.module");
  const [journey] = await db.select({ id: journeys.id, title: journeys.title }).from(journeys).where(eq(journeys.id, mod.journeyId));
  const list = await db
    .select({ id: lessons.id, title: lessons.title, slug: lessons.slug, status: lessons.status, order: lessons.order, estimatedMinutes: lessons.estimatedMinutes, updatedAt: lessons.updatedAt, hasEs: hasSpanishSql(lessons.translations) })
    .from(lessons)
    .where(eq(lessons.moduleId, id))
    .orderBy(asc(lessons.order));
  return { module: mod, journey, lessons: list };
}

export async function saveModule(db: Executor, actor: { id: string; roles: string[] }, journeyId: string, id: string | null, v: ModuleFields) {
  const [journey] = await db.select({ id: journeys.id }).from(journeys).where(eq(journeys.id, journeyId));
  if (!journey) throw keyed(new NotFoundError("Journey not found."), "notFound.journey");
  const [current] = id ? await db.select().from(journeyModules).where(and(eq(journeyModules.id, id), eq(journeyModules.journeyId, journeyId))) : [];
  if (id && !current) throw keyed(new NotFoundError("Module not found."), "notFound.module");
  assertStatusAllowed(actor.roles, v.status, current?.status);
  const values = { ...v, journeyId, publishedAt: publishedAt(v.status, current) };
  const [row] = current
    ? await db.update(journeyModules).set(values).where(eq(journeyModules.id, current.id)).returning()
    : await db.insert(journeyModules).values(values).returning();
  await audit(db, { actorId: actor.id, action: current ? "module.update" : "module.create", entityType: "module", entityId: row.id, metadata: { title: v.title, status: v.status } });
  return row;
}

/* ─────────────────────────── Lessons ─────────────────────────── */

export async function getLessonAdmin(db: Executor, id: string) {
  const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
  if (!lesson) throw keyed(new NotFoundError("Lesson not found."), "notFound.lesson");
  const [mod] = await db.select({ id: journeyModules.id, title: journeyModules.title, journeyId: journeyModules.journeyId }).from(journeyModules).where(eq(journeyModules.id, lesson.moduleId));
  const [exercise] = await db.select().from(exercises).where(eq(exercises.lessonId, id)).limit(1);
  const [quiz] = await db.select().from(quizzes).where(eq(quizzes.lessonId, id));
  const questions = quiz ? await db.select().from(quizQuestions).where(eq(quizQuestions.quizId, quiz.id)).orderBy(asc(quizQuestions.order)) : [];
  const [action] = await db.select().from(dailyActions).where(eq(dailyActions.lessonId, id));
  const [stats] = await db
    .select({ started: count(), completed: sql<number>`count(*) filter (where ${lessonProgress.status} = 'completed')::int` })
    .from(lessonProgress)
    .where(eq(lessonProgress.lessonId, id));
  return { lesson, module: mod, exercise: exercise ?? null, questions, action: action ?? null, stats: { started: Number(stats.started), completed: Number(stats.completed) } };
}

export async function saveLesson(db: Executor, actor: { id: string; roles: string[] }, moduleId: string, id: string | null, v: LessonInput) {
  const [mod] = await db.select().from(journeyModules).where(eq(journeyModules.id, moduleId));
  if (!mod) throw keyed(new NotFoundError("Module not found."), "notFound.module");
  const [current] = id ? await db.select().from(lessons).where(and(eq(lessons.id, id), eq(lessons.moduleId, moduleId))) : [];
  if (id && !current) throw keyed(new NotFoundError("Lesson not found."), "notFound.lesson");
  assertStatusAllowed(actor.roles, v.status, current?.status);
  const [skill] = await db.select({ id: skills.id }).from(skills).where(eq(skills.key, categorySkill(v.category)));
  const now = new Date();
  const lessonValues = {
    moduleId,
    slug: v.slug,
    title: v.title,
    description: v.description,
    category: v.category,
    difficulty: v.difficulty,
    estimatedMinutes: v.estimatedMinutes,
    order: v.order,
    status: v.status,
    xpReward: v.xpReward,
    skillId: skill?.id ?? null,
    content: v.content,
    publishedAt: publishedAt(v.status, current),
  };
  const [lesson] = await guardUnique(
    () => (current ? db.update(lessons).set(lessonValues).where(eq(lessons.id, current.id)).returning() : db.insert(lessons).values(lessonValues).returning()),
    "slug",
  );
  const live = { status: "published" as const, publishedAt: now, category: v.category, difficulty: v.difficulty };

  // Exercise: one per lesson.
  const [existingExercise] = await db.select().from(exercises).where(eq(exercises.lessonId, lesson.id)).limit(1);
  if (v.exercise) {
    const values = {
      lessonId: lesson.id,
      title: v.exercise.title,
      description: v.exercise.description,
      type: v.exercise.config.type,
      config: v.exercise.config as ExerciseConfig,
      skillId: skill?.id ?? null,
      estimatedMinutes: 3,
      ...live,
    };
    if (existingExercise) await db.update(exercises).set(values).where(eq(exercises.id, existingExercise.id));
    else await guardUnique(() => db.insert(exercises).values({ ...values, slug: `${lesson.slug}-exercise` }), "exercise slug");
  } else if (existingExercise) {
    await db.update(exercises).set({ status: "archived" }).where(eq(exercises.id, existingExercise.id));
  }

  // Knowledge check: questions are matched by concept key so learners' review history survives edits.
  if (!v.quiz) {
    await db.update(quizzes).set({ status: "archived" }).where(eq(quizzes.lessonId, lesson.id));
  } else {
    const [quiz] = await db
      .insert(quizzes)
      .values({ lessonId: lesson.id, title: `${v.title} — knowledge check`, estimatedMinutes: 2, ...live })
      .onConflictDoUpdate({ target: quizzes.lessonId, set: { title: `${v.title} — knowledge check`, category: v.category, status: "published" } })
      .returning();
    const existing = await db.select().from(quizQuestions).where(eq(quizQuestions.quizId, quiz.id));
    const keep = new Set<string>();
    for (const [i, q] of v.quiz.entries()) {
      const match = existing.find((e) => e.conceptKey === q.conceptKey);
      const values = { quizId: quiz.id, prompt: q.prompt, options: q.options, correctIndex: q.correctIndex, explanation: q.explanation, conceptKey: q.conceptKey, order: i + 1 };
      if (match) {
        keep.add(match.id);
        await db.update(quizQuestions).set(values).where(eq(quizQuestions.id, match.id));
      } else {
        await db.insert(quizQuestions).values(values);
      }
    }
    const removed = existing.filter((e) => !keep.has(e.id) && !v.quiz!.some((q) => q.conceptKey === e.conceptKey)).map((e) => e.id);
    if (removed.length) await db.delete(quizQuestions).where(inArray(quizQuestions.id, removed));
  }

  if (v.action) {
    const values = { lessonId: lesson.id, title: v.action.title, description: v.action.description, successCriteria: v.action.successCriteria || null, estimatedMinutes: v.action.estimatedMinutes, ...live, difficulty: v.action.difficulty };
    await db.insert(dailyActions).values(values).onConflictDoUpdate({ target: dailyActions.lessonId, set: values });
  } else {
    // Removing the mission from a lesson retires it (history of past check-ins is kept).
    await db.update(dailyActions).set({ status: "archived" }).where(eq(dailyActions.lessonId, lesson.id));
  }

  await audit(db, { actorId: actor.id, action: current ? "lesson.update" : "lesson.create", entityType: "lesson", entityId: lesson.id, metadata: { title: v.title, status: v.status } });
  return lesson;
}

/* ─────────────────────────── Resources & practice tools ─────────────────────────── */

export async function listResourcesAdmin(db: Executor) {
  return db
    .select({ id: resources.id, slug: resources.slug, title: resources.title, type: resources.type, category: resources.category, status: resources.status, updatedAt: resources.updatedAt, hasEs: hasSpanishSql(resources.translations) })
    .from(resources)
    .orderBy(asc(resources.order));
}

export async function getResourceAdmin(db: Executor, id: string) {
  const [row] = await db.select().from(resources).where(eq(resources.id, id));
  if (!row) throw keyed(new NotFoundError("Resource not found."), "notFound.resource");
  return row;
}

export async function saveResource(
  db: Executor,
  actor: { id: string; roles: string[] },
  id: string | null,
  v: JourneyFields & { type: (typeof resources.$inferInsert)["type"]; body: string; url?: string },
) {
  const [current] = id ? await db.select().from(resources).where(eq(resources.id, id)) : [];
  if (id && !current) throw keyed(new NotFoundError("Resource not found."), "notFound.resource");
  assertStatusAllowed(actor.roles, v.status, current?.status);
  const [skill] = await db.select({ id: skills.id }).from(skills).where(eq(skills.key, categorySkill(v.category)));
  const values = {
    slug: v.slug,
    title: v.title,
    description: v.description,
    category: v.category,
    difficulty: v.difficulty,
    estimatedMinutes: v.estimatedMinutes,
    order: v.order,
    status: v.status,
    type: v.type,
    body: v.body,
    url: v.url || null,
    skillId: skill?.id ?? null,
    publishedAt: publishedAt(v.status, current),
  };
  const [row] = await guardUnique(
    () => (current ? db.update(resources).set(values).where(eq(resources.id, current.id)).returning() : db.insert(resources).values(values).returning()),
    "slug",
  );
  await audit(db, { actorId: actor.id, action: current ? "resource.update" : "resource.create", entityType: "resource", entityId: row.id, metadata: { title: v.title, status: v.status } });
  return row;
}

export async function listPracticeAdmin(db: Executor) {
  return db
    .select({ id: exercises.id, slug: exercises.slug, title: exercises.title, type: exercises.type, category: exercises.category, status: exercises.status, updatedAt: exercises.updatedAt, hasEs: hasSpanishSql(exercises.translations) })
    .from(exercises)
    .where(eq(exercises.isPractice, true))
    .orderBy(asc(exercises.order));
}

export async function getPracticeAdmin(db: Executor, id: string) {
  const [row] = await db.select().from(exercises).where(and(eq(exercises.id, id), eq(exercises.isPractice, true)));
  if (!row) throw keyed(new NotFoundError("Practice tool not found."), "notFound.practice");
  return row;
}

export async function savePractice(
  db: Executor,
  actor: { id: string; roles: string[] },
  id: string | null,
  v: Omit<JourneyFields, "subtitle"> & { config: ExerciseConfig },
) {
  const [current] = id ? await db.select().from(exercises).where(and(eq(exercises.id, id), eq(exercises.isPractice, true))) : [];
  if (id && !current) throw keyed(new NotFoundError("Practice tool not found."), "notFound.practice");
  assertStatusAllowed(actor.roles, v.status, current?.status);
  const [skill] = await db.select({ id: skills.id }).from(skills).where(eq(skills.key, categorySkill(v.category)));
  const values = {
    slug: v.slug,
    title: v.title,
    description: v.description,
    category: v.category,
    difficulty: v.difficulty,
    estimatedMinutes: v.estimatedMinutes,
    order: v.order,
    status: v.status,
    type: v.config.type,
    config: v.config,
    isPractice: true,
    skillId: skill?.id ?? null,
    publishedAt: publishedAt(v.status, current),
  };
  const [row] = await guardUnique(
    () => (current ? db.update(exercises).set(values).where(eq(exercises.id, current.id)).returning() : db.insert(exercises).values(values).returning()),
    "slug",
  );
  await audit(db, { actorId: actor.id, action: current ? "practice.update" : "practice.create", entityType: "exercise", entityId: row.id, metadata: { title: v.title, status: v.status } });
  return row;
}

/* ─────────────────────────── Translations (Spanish) ─────────────────────────── */

/**
 * English lives in the columns; Spanish overrides live in `translations.es`
 * under the same field names. Edits merge into what's there: a filled field
 * is written, an empty one (""/null/undefined) is removed so learners get the
 * English text. Keys the CMS doesn't manage are left untouched.
 */
export function mergeTranslation(
  current: ContentTranslations | null | undefined,
  patch: Record<string, unknown>,
): { next: ContentTranslations; changed: string[] } {
  const es: Record<string, unknown> = { ...(current?.es ?? {}) };
  const changed: string[] = [];
  for (const [key, value] of Object.entries(patch)) {
    const before = canonical(es[key]);
    const blank = value === undefined || value === null || (typeof value === "string" && value.trim() === "") || (Array.isArray(value) && value.length === 0);
    if (blank) delete es[key];
    else es[key] = typeof value === "string" ? value.trim() : value;
    if (canonical(es[key]) !== before) changed.push(key);
  }
  const next: ContentTranslations = { ...(current ?? {}) };
  if (Object.keys(es).length > 0) next.es = es;
  else delete next.es;
  return { next, changed };
}

/** Key-order-insensitive JSON, so re-saving an unchanged translation isn't seen as an edit. */
function canonical(value: unknown): string {
  return JSON.stringify(value, (_key, v: unknown) =>
    v && typeof v === "object" && !Array.isArray(v) ? Object.fromEntries(Object.entries(v as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b))) : v,
  );
}

/** Translating is editing: content roles only, and live content stays admin-only. */
function assertCanTranslate(actor: Actor, status: Status) {
  if (!can(actor.roles, "content:write")) throw keyed(new ForbiddenError(), "noAccess");
  assertStatusAllowed(actor.roles, status, status);
}

async function auditTranslation(db: Executor, actor: Actor, action: string, entityType: string, entityId: string, fields: string[]) {
  if (fields.length === 0) return;
  await audit(db, { actorId: actor.id, action, entityType, entityId, metadata: { locale: "es", fields } });
}

/** A translated exercise config must keep the English answer key and structure. */
function assertSameAnswerKey(en: ExerciseConfig, es: ExerciseConfig) {
  if (en.type !== es.type) {
    throw keyed(new ValidationError(`The Spanish config must use the same type as the English one (${en.type}).`), "esConfigType", { type: en.type });
  }
  let same = true;
  if (en.type === "choice" && es.type === "choice") {
    same = en.options.length === es.options.length && en.options.every((o, i) => o.quality === es.options[i].quality);
  } else if (en.type === "order" && es.type === "order") {
    same = en.items.length === es.items.length;
  } else if (en.type === "structure" && es.type === "structure") {
    same = en.slots.length === es.slots.length && en.slots.every((slot, i) => slot.key === es.slots[i].key);
  } else if (en.type === "roleplay" && es.type === "roleplay") {
    same = en.mode === es.mode;
  }
  if (!same) throw keyed(new ValidationError("The Spanish config must keep the English answer key: the same options, items and slots, in the same order."), "esConfigShape");
}

export async function saveJourneyTranslation(db: Executor, actor: Actor, id: string, es: JourneyTranslationInput) {
  const [row] = await db.select({ status: journeys.status, translations: journeys.translations }).from(journeys).where(eq(journeys.id, id));
  if (!row) throw keyed(new NotFoundError("Journey not found."), "notFound.journey");
  assertCanTranslate(actor, row.status);
  const { next, changed } = mergeTranslation(row.translations, { title: es.title, subtitle: es.subtitle, description: es.description });
  if (changed.length) await db.update(journeys).set({ translations: next }).where(eq(journeys.id, id));
  await auditTranslation(db, actor, "journey.translate", "journey", id, changed);
  return { changed };
}

export async function saveModuleTranslation(db: Executor, actor: Actor, id: string, es: ModuleTranslationInput) {
  const [row] = await db.select({ status: journeyModules.status, translations: journeyModules.translations }).from(journeyModules).where(eq(journeyModules.id, id));
  if (!row) throw keyed(new NotFoundError("Module not found."), "notFound.module");
  assertCanTranslate(actor, row.status);
  const { next, changed } = mergeTranslation(row.translations, { title: es.title, description: es.description });
  if (changed.length) await db.update(journeyModules).set({ translations: next }).where(eq(journeyModules.id, id));
  await auditTranslation(db, actor, "module.translate", "module", id, changed);
  return { changed };
}

export async function saveResourceTranslation(db: Executor, actor: Actor, id: string, es: ResourceTranslationInput) {
  const [row] = await db.select({ status: resources.status, translations: resources.translations }).from(resources).where(eq(resources.id, id));
  if (!row) throw keyed(new NotFoundError("Resource not found."), "notFound.resource");
  assertCanTranslate(actor, row.status);
  const { next, changed } = mergeTranslation(row.translations, { title: es.title, description: es.description, body: es.body });
  if (changed.length) await db.update(resources).set({ translations: next }).where(eq(resources.id, id));
  await auditTranslation(db, actor, "resource.translate", "resource", id, changed);
  return { changed };
}

export async function savePracticeTranslation(db: Executor, actor: Actor, id: string, es: Omit<PracticeTranslationInput, "config"> & { config: ExerciseConfig | null }) {
  const [row] = await db
    .select({ status: exercises.status, config: exercises.config, translations: exercises.translations })
    .from(exercises)
    .where(and(eq(exercises.id, id), eq(exercises.isPractice, true)));
  if (!row) throw keyed(new NotFoundError("Practice tool not found."), "notFound.practice");
  assertCanTranslate(actor, row.status);
  if (es.config) assertSameAnswerKey(row.config, es.config);
  const { next, changed } = mergeTranslation(row.translations, { title: es.title, description: es.description, config: es.config });
  if (changed.length) await db.update(exercises).set({ translations: next }).where(eq(exercises.id, id));
  await auditTranslation(db, actor, "practice.translate", "exercise", id, changed);
  return { changed };
}

/**
 * The Spanish lesson: its own fields plus its exercise, knowledge check
 * (matched to English questions by conceptKey) and mission. Pieces the lesson
 * doesn't have in English (or has retired) are skipped.
 */
export async function saveLessonTranslation(
  db: Executor,
  actor: Actor,
  id: string,
  es: Omit<LessonTranslationInput, "exercise"> & { exercise: { title: string; description: string; config: ExerciseConfig | null } },
) {
  const [lesson] = await db.select({ status: lessons.status, translations: lessons.translations }).from(lessons).where(eq(lessons.id, id));
  if (!lesson) throw keyed(new NotFoundError("Lesson not found."), "notFound.lesson");
  assertCanTranslate(actor, lesson.status);

  const [exercise] = await db.select().from(exercises).where(eq(exercises.lessonId, id)).limit(1);
  const [quiz] = await db.select().from(quizzes).where(eq(quizzes.lessonId, id));
  const questions = quiz && quiz.status !== "archived" ? await db.select().from(quizQuestions).where(eq(quizQuestions.quizId, quiz.id)) : [];
  const [action] = await db.select().from(dailyActions).where(eq(dailyActions.lessonId, id));

  // Validate everything before writing anything.
  const activeExercise = exercise && exercise.status !== "archived" ? exercise : null;
  if (activeExercise && es.exercise.config) assertSameAnswerKey(activeExercise.config, es.exercise.config);
  const items = es.quiz ?? [];
  if (items.length && !questions.length) throw keyed(new ValidationError("Add the English knowledge check before translating it."), "esQuizWithoutEnglish");
  for (const item of items) {
    const q = questions.find((x) => x.conceptKey === item.conceptKey);
    if (!q) throw keyed(new ValidationError(`The Spanish knowledge check has a conceptKey that isn't in the English one: ${item.conceptKey}.`), "esQuizUnknown", { key: item.conceptKey });
    if (q.options.length !== item.options.length) {
      throw keyed(new ValidationError(`Spanish question "${item.conceptKey}" needs ${q.options.length} options, like the English one.`), "esQuizOptions", { key: item.conceptKey, count: q.options.length });
    }
  }

  const changed: string[] = [];
  const l = mergeTranslation(lesson.translations, { title: es.title, description: es.description, content: es.content });
  if (l.changed.length) await db.update(lessons).set({ translations: l.next }).where(eq(lessons.id, id));
  changed.push(...l.changed);

  if (activeExercise) {
    const e = mergeTranslation(activeExercise.translations, { title: es.exercise.title, description: es.exercise.description, config: es.exercise.config });
    if (e.changed.length) await db.update(exercises).set({ translations: e.next }).where(eq(exercises.id, activeExercise.id));
    changed.push(...e.changed.map((k) => `exercise.${k}`));
  }

  if (quiz) {
    // The knowledge check's title follows the lesson's (as in English).
    const esTitle = typeof l.next.es?.title === "string" ? l.next.es.title : "";
    const t = mergeTranslation(quiz.translations, { title: esTitle ? `${esTitle} — repaso rápido` : null });
    if (t.changed.length) await db.update(quizzes).set({ translations: t.next }).where(eq(quizzes.id, quiz.id));
    let quizChanged = false;
    for (const q of questions) {
      const item = items.find((x) => x.conceptKey === q.conceptKey);
      const m = mergeTranslation(q.translations, { prompt: item?.prompt, options: item?.options, explanation: item?.explanation });
      if (m.changed.length) {
        await db.update(quizQuestions).set({ translations: m.next }).where(eq(quizQuestions.id, q.id));
        quizChanged = true;
      }
    }
    if (quizChanged) changed.push("quiz");
  }

  if (action && action.status !== "archived") {
    const a = mergeTranslation(action.translations, { title: es.action.title, description: es.action.description, successCriteria: es.action.successCriteria });
    if (a.changed.length) await db.update(dailyActions).set({ translations: a.next }).where(eq(dailyActions.id, action.id));
    changed.push(...a.changed.map((k) => `action.${k}`));
  }

  await auditTranslation(db, actor, "lesson.translate", "lesson", id, changed);
  return { changed };
}

/** Content currently awaiting an admin's review. */
export async function reviewQueue(db: Executor) {
  const [j, m, l, r, p] = await Promise.all([
    db.select({ id: journeys.id, title: journeys.title }).from(journeys).where(eq(journeys.status, "review")),
    db.select({ id: journeyModules.id, title: journeyModules.title, journeyId: journeyModules.journeyId }).from(journeyModules).where(eq(journeyModules.status, "review")),
    db.select({ id: lessons.id, title: lessons.title }).from(lessons).where(eq(lessons.status, "review")),
    db.select({ id: resources.id, title: resources.title }).from(resources).where(eq(resources.status, "review")),
    db.select({ id: exercises.id, title: exercises.title }).from(exercises).where(and(eq(exercises.status, "review"), eq(exercises.isPractice, true))),
  ]);
  return [
    ...j.map((x) => ({ kind: "Journey", kindKey: "journey" as const, title: x.title, href: `/admin/content/journeys/${x.id}` })),
    ...m.map((x) => ({ kind: "Module", kindKey: "module" as const, title: x.title, href: `/admin/content/modules/${x.id}` })),
    ...l.map((x) => ({ kind: "Lesson", kindKey: "lesson" as const, title: x.title, href: `/admin/content/lessons/${x.id}` })),
    ...r.map((x) => ({ kind: "Resource", kindKey: "resource" as const, title: x.title, href: `/admin/content/resources/${x.id}` })),
    ...p.map((x) => ({ kind: "Practice tool", kindKey: "practice" as const, title: x.title, href: `/admin/content/practice/${x.id}` })),
  ];
}

