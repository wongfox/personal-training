/**
 * Turns onboarding answers into a Personal Growth Plan.
 */
import type { Locale } from "@/i18n/config";
import { categorySkill, GOALS, skillName as taxonomySkillName, type GoalKey, type SkillKey } from "@/lib/taxonomy";
import type { DifficultyLevel } from "@/server/db/types";

export type Frequency = "daily" | "five_per_week" | "three_per_week";

export interface OnboardingAnswers {
  goals: GoalKey[];
  primaryGoal: GoalKey;
  situations: string[];
  level: DifficultyLevel;
  minutes: number;
  frequency: Frequency;
  challenge: string;
  ninetyDayGoal: string;
  /** 1–5 self-rating per skill. */
  selfRatings: Partial<Record<SkillKey, number>>;
}

export interface JourneyOption {
  id: string;
  slug: string;
  title: string;
  category: string;
}

/** When no journey trains a skill directly, the closest neighbour does. */
const SKILL_FALLBACK: Record<SkillKey, SkillKey[]> = {
  communication: ["confidence"],
  confidence: ["communication"],
  leadership: ["communication"],
  intelligence: ["communication"],
  social_skills: ["networking", "communication"],
  networking: ["social_skills", "communication"],
};

export function goalSkill(goal: GoalKey): SkillKey {
  return GOALS.find((g) => g.key === goal)?.skill ?? "communication";
}

export function pickJourney(primaryGoal: GoalKey, journeys: JourneyOption[]): JourneyOption | null {
  if (journeys.length === 0) return null;
  // A journey whose own category is the goal wins (e.g. a storytelling journey).
  const exact = journeys.find((j) => j.category === primaryGoal);
  if (exact) return exact;
  const skill = goalSkill(primaryGoal);
  for (const s of [skill, ...SKILL_FALLBACK[skill]]) {
    const match = journeys.find((j) => categorySkill(j.category) === s);
    if (match) return match;
  }
  return journeys[0];
}

/**
 * The whole plan as an ordered sequence of journeys: the primary goal's
 * journey first, then the secondary goals', then everything else — so the
 * 90 days are filled with real lessons, not one short journey.
 */
export function buildRoadmap(primaryGoal: GoalKey, secondaryGoals: GoalKey[], journeys: JourneyOption[]): string[] {
  const order: string[] = [];
  for (const goal of [primaryGoal, ...secondaryGoals]) {
    const j = pickJourney(goal, journeys);
    if (j && !order.includes(j.id)) order.push(j.id);
  }
  for (const j of journeys) if (!order.includes(j.id)) order.push(j.id);
  return order;
}

export interface RoadmapStage {
  id: string;
  title: string;
  lessons: number;
  completed: number;
  status: "done" | "current" | "upcoming";
  /** Plan days covered (1-based, non-overlapping). */
  fromDay: number;
  toDay: number;
}

/**
 * Lays the journeys out on the plan's calendar at the learner's rhythm
 * (e.g. 5 lessons a week means each lesson takes 7/5 calendar days).
 */
export function scheduleRoadmap(stages: Omit<RoadmapStage, "fromDay" | "toDay">[], lessonsPerWeek: number): RoadmapStage[] {
  const daysPerLesson = 7 / lessonsPerWeek;
  let cursor = 0;
  let lastDay = 0;
  return stages.map((s) => {
    cursor += s.lessons;
    const fromDay = lastDay + 1;
    const toDay = Math.max(fromDay, Math.ceil(cursor * daysPerLesson));
    lastDay = toDay;
    return { ...s, fromDay, toDay };
  });
}

export const FREQUENCY_DAYS: Record<Frequency, number> = { daily: 7, five_per_week: 5, three_per_week: 3 };

export const FREQUENCY_LABEL: Record<Frequency, string> = {
  daily: "Every day",
  five_per_week: "5 days a week",
  three_per_week: "3 days a week",
};

const FREQUENCY_LABEL_ES: Record<Frequency, string> = {
  daily: "Todos los días",
  five_per_week: "5 días a la semana",
  three_per_week: "3 días a la semana",
};

export function frequencyLabel(frequency: Frequency, locale: Locale = "en"): string {
  return (locale === "es" ? FREQUENCY_LABEL_ES : FREQUENCY_LABEL)[frequency];
}

/** The plan's name, e.g. "Juan's Growth Plan" / "Plan de crecimiento de Juan". */
export function planTitle(firstName: string, locale: Locale = "en"): string {
  const name = firstName.trim().split(/\s+/)[0];
  if (locale === "es") return name ? `Plan de crecimiento de ${name}` : "Tu plan de crecimiento";
  return name ? `${name}'s Growth Plan` : "Your Growth Plan";
}

export interface PlanDraft {
  title: string;
  primaryGoal: GoalKey;
  secondaryGoals: GoalKey[];
  journey: JourneyOption | null;
  level: DifficultyLevel;
  dailyMinutes: number;
  frequency: Frequency;
  durationDays: number;
  weeklyTarget: number;
  focusSkills: SkillKey[];
}

export function buildPlan(firstName: string, a: OnboardingAnswers, journeys: JourneyOption[], locale: Locale = "en"): PlanDraft {
  const primaryGoal = a.goals.includes(a.primaryGoal) ? a.primaryGoal : (a.goals[0] ?? "communication");
  const secondaryGoals = a.goals.filter((g) => g !== primaryGoal).slice(0, 3);
  const focusSkills = [...new Set([primaryGoal, ...secondaryGoals].map(goalSkill))];
  return {
    title: planTitle(firstName, locale),
    primaryGoal,
    secondaryGoals,
    journey: pickJourney(primaryGoal, journeys),
    level: a.level,
    dailyMinutes: a.minutes,
    frequency: a.frequency,
    durationDays: 90,
    weeklyTarget: FREQUENCY_DAYS[a.frequency],
    focusSkills,
  };
}

export function skillName(key: string, locale: Locale = "en"): string {
  return taxonomySkillName(key, locale);
}
