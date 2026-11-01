/**
 * Canonical taxonomy. Skills are what we score; categories are finer content
 * labels that roll up into a skill; goals are what learners pick at onboarding.
 * The database is seeded from these lists and stays the runtime source of truth.
 */

export const SKILLS = [
  { key: "communication", name: "Communication", description: "Say what you mean, clearly and with intent." },
  { key: "confidence", name: "Confidence", description: "Act with calm conviction, even under pressure." },
  { key: "leadership", name: "Leadership", description: "Move people and decisions forward." },
  { key: "intelligence", name: "Intelligence", description: "Think clearly, decide well, remember what matters." },
  { key: "social_skills", name: "Social Skills", description: "Read the room and connect with people." },
  { key: "networking", name: "Networking", description: "Build relationships that open doors." },
] as const;

export type SkillKey = (typeof SKILLS)[number]["key"];

export const CATEGORIES = [
  { key: "communication", name: "Communication", skill: "communication" },
  { key: "executive_presence", name: "Executive Presence", skill: "communication" },
  { key: "storytelling", name: "Storytelling", skill: "communication" },
  { key: "personal_branding", name: "Personal Branding", skill: "networking" },
  { key: "confidence", name: "Confidence", skill: "confidence" },
  { key: "leadership", name: "Leadership", skill: "leadership" },
  { key: "negotiation", name: "Negotiation", skill: "leadership" },
  { key: "critical_thinking", name: "Critical Thinking", skill: "intelligence" },
  { key: "memory", name: "Memory", skill: "intelligence" },
  { key: "psychology", name: "Psychology", skill: "intelligence" },
  { key: "productivity", name: "Productivity", skill: "intelligence" },
  { key: "business", name: "Business", skill: "leadership" },
  { key: "social_intelligence", name: "Social Intelligence", skill: "social_skills" },
  { key: "networking", name: "Networking", skill: "networking" },
] as const satisfies readonly { key: string; name: string; skill: SkillKey }[];

export type CategoryKey = (typeof CATEGORIES)[number]["key"];

export const GOALS = [
  { key: "communication", name: "Communication", skill: "communication" },
  { key: "confidence", name: "Confidence", skill: "confidence" },
  { key: "leadership", name: "Leadership", skill: "leadership" },
  { key: "intelligence", name: "Intelligence", skill: "intelligence" },
  { key: "social_skills", name: "Social skills", skill: "social_skills" },
  { key: "networking", name: "Networking", skill: "networking" },
  { key: "personal_branding", name: "Personal branding", skill: "networking" },
  { key: "critical_thinking", name: "Critical thinking", skill: "intelligence" },
  { key: "memory", name: "Memory", skill: "intelligence" },
  { key: "storytelling", name: "Storytelling", skill: "communication" },
] as const satisfies readonly { key: string; name: string; skill: SkillKey }[];

export type GoalKey = (typeof GOALS)[number]["key"];

export function categoryName(key: string): string {
  return CATEGORIES.find((c) => c.key === key)?.name ?? key.replace(/_/g, " ");
}

export function categorySkill(key: string): SkillKey {
  return CATEGORIES.find((c) => c.key === key)?.skill ?? "communication";
}

export const RESOURCE_TYPE_LABELS: Record<string, string> = {
  lesson: "Lesson",
  insight: "Expert insight",
  framework: "Framework",
  case_study: "Case study",
  video: "Video",
  exercise: "Exercise",
  cheat_sheet: "Cheat sheet",
  template: "Template",
};
