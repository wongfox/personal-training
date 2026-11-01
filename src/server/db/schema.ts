/**
 * Personal Growth OS — PostgreSQL schema (Drizzle ORM).
 *
 * Sections:
 *  1. Identity & access   — users, sessions, oauth, roles, rate limits
 *  2. Profile & plan      — profiles, settings, goals, assessments, growth plans
 *  3. Content             — journeys → modules → lessons → exercises / quizzes / actions, resources
 *  4. Learning activity   — progress, attempts, reflections, spaced repetition
 *  5. Progress & rewards  — skills, streaks, xp, achievements, weekly reviews
 *  6. Coach               — AI conversations & messages
 *  7. Platform            — notifications, analytics, audit logs
 */
import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import type {
  ActionReflectionAnswers,
  AssessmentOption,
  ExerciseConfig,
  ExerciseFeedback,
  LessonContent,
  NextFocus,
  WeeklyStats,
} from "./types";

const id = () => uuid("id").primaryKey().defaultRandom();
const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());

/* ───────────────────────────── Enums ───────────────────────────── */

export const userStatus = pgEnum("user_status", ["active", "suspended"]);
export const contentStatus = pgEnum("content_status", ["draft", "review", "published", "archived"]);
export const difficulty = pgEnum("difficulty", ["beginner", "intermediate", "advanced"]);
export const goalPriority = pgEnum("goal_priority", ["primary", "secondary"]);
export const assessmentKind = pgEnum("assessment_kind", ["onboarding", "day_30", "day_60", "day_90"]);
export const questionType = pgEnum("question_type", ["single", "multi", "text", "scale"]);
export const planFrequency = pgEnum("plan_frequency", ["daily", "five_per_week", "three_per_week"]);
export const planStatus = pgEnum("plan_status", ["active", "completed", "archived"]);
export const exerciseType = pgEnum("exercise_type", [
  "choice",
  "rewrite",
  "order",
  "recall",
  "structure",
  "decision",
  "roleplay",
  "pitch",
]);
export const progressStatus = pgEnum("progress_status", ["in_progress", "completed"]);
export const actionStatus = pgEnum("action_status", ["committed", "done", "not_yet", "skipped"]);
export const actionOutcome = pgEnum("action_outcome", ["difficult", "normal", "good", "excellent"]);
export const reflectionKind = pgEnum("reflection_kind", ["action", "lesson", "weekly", "checkpoint"]);
export const xpReason = pgEnum("xp_reason", [
  "onboarding_completed",
  "lesson_completed",
  "exercise_completed",
  "quiz_completed",
  "action_completed",
  "reflection_completed",
  "review_completed",
  "practice_completed",
  "weekly_review_completed",
  "checkpoint_completed",
  "achievement_earned",
]);
export const resourceType = pgEnum("resource_type", [
  "lesson",
  "insight",
  "framework",
  "case_study",
  "video",
  "exercise",
  "cheat_sheet",
  "template",
]);
export const coachMode = pgEnum("coach_mode", ["coach", "conversation", "presentation", "networking"]);
export const messageRole = pgEnum("message_role", ["user", "assistant"]);
export const notificationType = pgEnum("notification_type", [
  "daily_reminder",
  "lesson_reminder",
  "streak_reminder",
  "weekly_review",
  "missed_day_recovery",
  "checkpoint",
]);
export const notificationChannel = pgEnum("notification_channel", ["in_app", "email", "push"]);
export const userJourneyStatus = pgEnum("user_journey_status", ["active", "completed", "paused"]);

/* ─────────────────────── 1. Identity & access ─────────────────────── */

export const users = pgTable(
  "users",
  {
    id: id(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    passwordHash: text("password_hash"),
    avatarUrl: text("avatar_url"),
    emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
    status: userStatus("status").notNull().default("active"),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex("users_email_uq").on(sql`lower(${t.email})`)],
);

/** Session ids are SHA-256 hashes of the opaque token stored in the cookie. */
export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: createdAt(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

export const oauthAccounts = pgTable(
  "oauth_accounts",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("oauth_provider_account_uq").on(t.provider, t.providerAccountId)],
);

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: text("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [index("password_reset_user_idx").on(t.userId)],
);

export const emailVerificationTokens = pgTable(
  "email_verification_tokens",
  {
    id: text("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [index("email_verification_user_idx").on(t.userId)],
);

export const rateLimits = pgTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(0),
  windowStart: timestamp("window_start", { withTimezone: true }).notNull().defaultNow(),
});

export const roles = pgTable("roles", {
  id: id(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: createdAt(),
});

export const userRoles = pgTable(
  "user_roles",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    grantedBy: uuid("granted_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.roleId] })],
);

/* ─────────────────────── 2. Profile & plan ─────────────────────── */

export const profiles = pgTable("profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  displayName: text("display_name").notNull(),
  headline: text("headline"),
  timezone: text("timezone").notNull().default("UTC"),
  totalXp: integer("total_xp").notNull().default(0),
  onboardingCompletedAt: timestamp("onboarding_completed_at", { withTimezone: true }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const userSettings = pgTable("user_settings", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  reminderTime: text("reminder_time").notNull().default("08:00"),
  dailyReminder: boolean("daily_reminder").notNull().default(true),
  streakReminder: boolean("streak_reminder").notNull().default(true),
  weeklyReview: boolean("weekly_review").notNull().default(true),
  emailNotifications: boolean("email_notifications").notNull().default(false),
  theme: text("theme").notNull().default("system"),
  updatedAt: updatedAt(),
});

export const skills = pgTable("skills", {
  id: id(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  order: integer("order").notNull().default(0),
});

export const goals = pgTable("goals", {
  id: id(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  skillId: uuid("skill_id").references(() => skills.id, { onDelete: "set null" }),
  order: integer("order").notNull().default(0),
});

export const userGoals = pgTable(
  "user_goals",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    goalId: uuid("goal_id")
      .notNull()
      .references(() => goals.id, { onDelete: "cascade" }),
    priority: goalPriority("priority").notNull(),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.goalId] })],
);

export const assessmentQuestions = pgTable("assessment_questions", {
  id: id(),
  key: text("key").notNull().unique(),
  kinds: assessmentKind("kinds").array().notNull(),
  section: text("section").notNull(),
  prompt: text("prompt").notNull(),
  helpText: text("help_text"),
  type: questionType("type").notNull(),
  options: jsonb("options").$type<AssessmentOption[]>().notNull().default([]),
  isRequired: boolean("is_required").notNull().default(true),
  order: integer("order").notNull().default(0),
  status: contentStatus("status").notNull().default("published"),
});

export const assessments = pgTable(
  "assessments",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    kind: assessmentKind("kind").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    summary: jsonb("summary").$type<Record<string, number>>(),
  },
  (t) => [uniqueIndex("assessments_user_kind_uq").on(t.userId, t.kind)],
);

export const assessmentAnswers = pgTable(
  "assessment_answers",
  {
    id: id(),
    assessmentId: uuid("assessment_id")
      .notNull()
      .references(() => assessments.id, { onDelete: "cascade" }),
    questionId: uuid("question_id")
      .notNull()
      .references(() => assessmentQuestions.id, { onDelete: "cascade" }),
    value: jsonb("value").$type<string | string[] | number>().notNull(),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("assessment_answers_uq").on(t.assessmentId, t.questionId)],
);

/* ─────────────────────────── 3. Content ─────────────────────────── */

const contentColumns = () => ({
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  category: text("category").notNull(),
  difficulty: difficulty("difficulty").notNull().default("beginner"),
  estimatedMinutes: integer("estimated_minutes").notNull().default(10),
  order: integer("order").notNull().default(0),
  status: contentStatus("status").notNull().default("draft"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const journeys = pgTable("journeys", {
  id: id(),
  slug: text("slug").notNull().unique(),
  subtitle: text("subtitle"),
  skillId: uuid("skill_id").references(() => skills.id, { onDelete: "set null" }),
  ...contentColumns(),
});

export const journeyModules = pgTable(
  "journey_modules",
  {
    id: id(),
    journeyId: uuid("journey_id")
      .notNull()
      .references(() => journeys.id, { onDelete: "cascade" }),
    ...contentColumns(),
  },
  (t) => [index("journey_modules_journey_idx").on(t.journeyId, t.order)],
);

export const lessons = pgTable(
  "lessons",
  {
    id: id(),
    moduleId: uuid("module_id")
      .notNull()
      .references(() => journeyModules.id, { onDelete: "cascade" }),
    slug: text("slug").notNull().unique(),
    skillId: uuid("skill_id").references(() => skills.id, { onDelete: "set null" }),
    xpReward: integer("xp_reward").notNull().default(50),
    content: jsonb("content").$type<LessonContent>().notNull(),
    ...contentColumns(),
  },
  (t) => [index("lessons_module_idx").on(t.moduleId, t.order)],
);

export const exercises = pgTable(
  "exercises",
  {
    id: id(),
    lessonId: uuid("lesson_id").references(() => lessons.id, { onDelete: "set null" }),
    slug: text("slug").notNull().unique(),
    type: exerciseType("type").notNull(),
    skillId: uuid("skill_id").references(() => skills.id, { onDelete: "set null" }),
    /** Practice-library tools are standalone exercises shown under PRACTICE. */
    isPractice: boolean("is_practice").notNull().default(false),
    xpReward: integer("xp_reward").notNull().default(30),
    config: jsonb("config").$type<ExerciseConfig>().notNull(),
    ...contentColumns(),
  },
  (t) => [index("exercises_lesson_idx").on(t.lessonId)],
);

export const quizzes = pgTable("quizzes", {
  id: id(),
  lessonId: uuid("lesson_id")
    .notNull()
    .unique()
    .references(() => lessons.id, { onDelete: "cascade" }),
  ...contentColumns(),
});

export const quizQuestions = pgTable(
  "quiz_questions",
  {
    id: id(),
    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quizzes.id, { onDelete: "cascade" }),
    prompt: text("prompt").notNull(),
    options: jsonb("options").$type<string[]>().notNull(),
    correctIndex: integer("correct_index").notNull(),
    explanation: text("explanation").notNull(),
    /** Stable key of the concept tested — drives spaced repetition. */
    conceptKey: text("concept_key").notNull(),
    order: integer("order").notNull().default(0),
  },
  (t) => [index("quiz_questions_quiz_idx").on(t.quizId)],
);

export const dailyActions = pgTable("daily_actions", {
  id: id(),
  lessonId: uuid("lesson_id")
    .notNull()
    .unique()
    .references(() => lessons.id, { onDelete: "cascade" }),
  successCriteria: text("success_criteria"),
  ...contentColumns(),
});

export const expertSources = pgTable("expert_sources", {
  id: id(),
  name: text("name").notNull(),
  credentials: text("credentials"),
  description: text("description"),
  url: text("url"),
  createdAt: createdAt(),
});

export const resources = pgTable("resources", {
  id: id(),
  slug: text("slug").notNull().unique(),
  type: resourceType("type").notNull(),
  skillId: uuid("skill_id").references(() => skills.id, { onDelete: "set null" }),
  body: text("body").notNull().default(""),
  url: text("url"),
  expertSourceId: uuid("expert_source_id").references(() => expertSources.id, { onDelete: "set null" }),
  ...contentColumns(),
});

export const contentTags = pgTable("content_tags", {
  id: id(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
});

export const contentTagRelations = pgTable(
  "content_tag_relations",
  {
    tagId: uuid("tag_id")
      .notNull()
      .references(() => contentTags.id, { onDelete: "cascade" }),
    contentType: text("content_type").notNull(),
    contentId: uuid("content_id").notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.tagId, t.contentType, t.contentId] }),
    index("content_tag_rel_content_idx").on(t.contentType, t.contentId),
  ],
);

/* ─────────────────────── 4. Learning activity ─────────────────────── */

export const growthPlans = pgTable(
  "growth_plans",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    primaryGoalId: uuid("primary_goal_id")
      .notNull()
      .references(() => goals.id),
    journeyId: uuid("journey_id").references(() => journeys.id, { onDelete: "set null" }),
    /** Ordered journey ids for the whole plan: primary goal first, then secondary goals, then the rest. */
    roadmap: jsonb("roadmap").$type<string[]>().notNull().default([]),
    level: difficulty("level").notNull(),
    dailyMinutes: integer("daily_minutes").notNull(),
    frequency: planFrequency("frequency").notNull(),
    durationDays: integer("duration_days").notNull().default(90),
    startDate: date("start_date").notNull(),
    situations: jsonb("situations").$type<string[]>().notNull().default([]),
    mainChallenge: text("main_challenge"),
    ninetyDayGoal: text("ninety_day_goal"),
    status: planStatus("status").notNull().default("active"),
    createdAt: createdAt(),
  },
  (t) => [index("growth_plans_user_idx").on(t.userId, t.status)],
);

export const userJourneys = pgTable(
  "user_journeys",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    journeyId: uuid("journey_id")
      .notNull()
      .references(() => journeys.id, { onDelete: "cascade" }),
    status: userJourneyStatus("status").notNull().default("active"),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.journeyId] })],
);

export const lessonProgress = pgTable(
  "lesson_progress",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    status: progressStatus("status").notNull().default("in_progress"),
    currentStep: integer("current_step").notNull().default(0),
    timeSpentSeconds: integer("time_spent_seconds").notNull().default(0),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    /** Local calendar day (user timezone) the lesson was completed. */
    completedOn: date("completed_on"),
  },
  (t) => [uniqueIndex("lesson_progress_user_lesson_uq").on(t.userId, t.lessonId)],
);

export const exerciseAttempts = pgTable(
  "exercise_attempts",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    exerciseId: uuid("exercise_id")
      .notNull()
      .references(() => exercises.id, { onDelete: "cascade" }),
    response: jsonb("response").$type<Record<string, unknown>>().notNull(),
    score: integer("score").notNull(),
    feedback: jsonb("feedback").$type<ExerciseFeedback>().notNull(),
    durationSeconds: integer("duration_seconds"),
    createdAt: createdAt(),
  },
  (t) => [index("exercise_attempts_user_idx").on(t.userId, t.createdAt)],
);

export const quizAttempts = pgTable(
  "quiz_attempts",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quizzes.id, { onDelete: "cascade" }),
    answers: jsonb("answers").$type<number[]>().notNull(),
    score: integer("score").notNull(),
    total: integer("total").notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("quiz_attempts_user_idx").on(t.userId)],
);

/**
 * The first answer a learner checks for each knowledge-check question. Instant
 * per-question feedback reveals the right answer, so the score always uses
 * this locked first answer.
 */
export const quizAnswerChecks = pgTable(
  "quiz_answer_checks",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    questionId: uuid("question_id")
      .notNull()
      .references(() => quizQuestions.id, { onDelete: "cascade" }),
    answer: integer("answer").notNull(),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.questionId] })],
);

export const dailyActionAttempts = pgTable(
  "daily_action_attempts",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    dailyActionId: uuid("daily_action_id")
      .notNull()
      .references(() => dailyActions.id, { onDelete: "cascade" }),
    /** Local day the mission was assigned. */
    actionDate: date("action_date").notNull(),
    status: actionStatus("status").notNull().default("committed"),
    outcome: actionOutcome("outcome"),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex("daily_action_attempts_uq").on(t.userId, t.dailyActionId),
    index("daily_action_attempts_user_date_idx").on(t.userId, t.actionDate),
  ],
);

export const reflections = pgTable(
  "reflections",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    kind: reflectionKind("kind").notNull(),
    lessonId: uuid("lesson_id").references(() => lessons.id, { onDelete: "set null" }),
    dailyActionAttemptId: uuid("daily_action_attempt_id").references(() => dailyActionAttempts.id, {
      onDelete: "cascade",
    }),
    answers: jsonb("answers").$type<ActionReflectionAnswers>().notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("reflections_user_idx").on(t.userId, t.createdAt)],
);

/** Spaced repetition: one row per (user, concept question). */
export const reviewItems = pgTable(
  "review_items",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    quizQuestionId: uuid("quiz_question_id")
      .notNull()
      .references(() => quizQuestions.id, { onDelete: "cascade" }),
    stage: integer("stage").notNull().default(0),
    /** null once the concept has graduated past the last interval. */
    dueOn: date("due_on"),
    lastReviewedAt: timestamp("last_reviewed_at", { withTimezone: true }),
    lapses: integer("lapses").notNull().default(0),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex("review_items_user_question_uq").on(t.userId, t.quizQuestionId),
    index("review_items_due_idx").on(t.userId, t.dueOn),
  ],
);

/* ─────────────────────── 5. Progress & rewards ─────────────────────── */

export const userSkills = pgTable(
  "user_skills",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
    baseline: integer("baseline").notNull(),
    score: integer("score").notNull(),
    updatedAt: updatedAt(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.skillId] })],
);

export const skillProgress = pgTable(
  "skill_progress",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
    delta: integer("delta").notNull(),
    scoreAfter: integer("score_after").notNull(),
    sourceType: text("source_type").notNull(),
    sourceId: uuid("source_id"),
    activityDate: date("activity_date").notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("skill_progress_user_idx").on(t.userId, t.skillId, t.activityDate)],
);

export const streaks = pgTable("streaks", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  current: integer("current").notNull().default(0),
  longest: integer("longest").notNull().default(0),
  lastActiveDate: date("last_active_date"),
  updatedAt: updatedAt(),
});

export const xpTransactions = pgTable(
  "xp_transactions",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    reason: xpReason("reason").notNull(),
    sourceType: text("source_type"),
    sourceId: uuid("source_id"),
    /** Guards against double-awarding the same thing (e.g. "lesson:<id>"). */
    idempotencyKey: text("idempotency_key").notNull(),
    activityDate: date("activity_date").notNull(),
    /** Whether this activity counts as a training day (streak, weekly strip). */
    countsAsTraining: boolean("counts_as_training").notNull().default(true),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex("xp_transactions_idem_uq").on(t.userId, t.idempotencyKey),
    index("xp_transactions_user_date_idx").on(t.userId, t.activityDate),
  ],
);

export const achievements = pgTable("achievements", {
  id: id(),
  key: text("key").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  xpReward: integer("xp_reward").notNull().default(0),
  order: integer("order").notNull().default(0),
});

export const userAchievements = pgTable(
  "user_achievements",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    achievementId: uuid("achievement_id")
      .notNull()
      .references(() => achievements.id, { onDelete: "cascade" }),
    earnedAt: timestamp("earned_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.achievementId] })],
);

export const weeklyReviews = pgTable(
  "weekly_reviews",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    weekStart: date("week_start").notNull(),
    stats: jsonb("stats").$type<WeeklyStats>().notNull(),
    reflection: text("reflection"),
    nextFocus: jsonb("next_focus").$type<NextFocus>().notNull(),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("weekly_reviews_user_week_uq").on(t.userId, t.weekStart)],
);

/* ─────────────────────────── 6. Coach ─────────────────────────── */

export const coachConversations = pgTable(
  "coach_conversations",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    mode: coachMode("mode").notNull(),
    title: text("title").notNull(),
    exerciseId: uuid("exercise_id").references(() => exercises.id, { onDelete: "set null" }),
    /** Scenario setup chosen by the user (audience, objective, persona…). */
    scenario: jsonb("scenario").$type<Record<string, string>>(),
    evaluation: jsonb("evaluation").$type<ExerciseFeedback>(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("coach_conversations_user_idx").on(t.userId, t.updatedAt)],
);

export const coachMessages = pgTable(
  "coach_messages",
  {
    id: id(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => coachConversations.id, { onDelete: "cascade" }),
    role: messageRole("role").notNull(),
    content: text("content").notNull(),
    evaluation: jsonb("evaluation").$type<ExerciseFeedback>(),
    createdAt: createdAt(),
  },
  (t) => [index("coach_messages_conversation_idx").on(t.conversationId, t.createdAt)],
);

/* ─────────────────────────── 7. Platform ─────────────────────────── */

export const notifications = pgTable(
  "notifications",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: notificationType("type").notNull(),
    channel: notificationChannel("channel").notNull().default("in_app"),
    title: text("title").notNull(),
    body: text("body").notNull(),
    url: text("url"),
    /** One notification of a type per user per local day. */
    dedupeKey: text("dedupe_key").notNull(),
    scheduledFor: timestamp("scheduled_for", { withTimezone: true }).notNull().defaultNow(),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex("notifications_dedupe_uq").on(t.userId, t.dedupeKey),
    index("notifications_user_idx").on(t.userId, t.readAt),
  ],
);

export const analyticsEvents = pgTable(
  "analytics_events",
  {
    id: id(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    properties: jsonb("properties").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: createdAt(),
  },
  (t) => [
    index("analytics_events_name_idx").on(t.name, t.createdAt),
    index("analytics_events_user_idx").on(t.userId, t.createdAt),
  ],
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: id(),
    actorId: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    ipAddress: text("ip_address"),
    createdAt: createdAt(),
  },
  (t) => [index("audit_logs_created_idx").on(t.createdAt)],
);
