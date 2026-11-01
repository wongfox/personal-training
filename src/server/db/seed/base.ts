/** Reference data: diagnostic questions shared by onboarding and checkpoints. */
import { GOALS } from "@/lib/taxonomy";
import type { AssessmentOption } from "../types";

type Kind = "onboarding" | "day_30" | "day_60" | "day_90";
const CHECKPOINTS: Kind[] = ["day_30", "day_60", "day_90"];

export interface QuestionSeed {
  key: string;
  kinds: Kind[];
  section: string;
  prompt: string;
  helpText?: string;
  type: "single" | "multi" | "text" | "scale";
  options: AssessmentOption[];
  isRequired: boolean;
}

const RATING_OPTIONS: AssessmentOption[] = [
  { value: "1", label: "Rarely" },
  { value: "2", label: "Sometimes" },
  { value: "3", label: "Often" },
  { value: "4", label: "Usually" },
  { value: "5", label: "Almost always" },
];

export const SELF_RATINGS = [
  { key: "rate_communication", skill: "communication", prompt: "I express my ideas clearly, even when it's complex." },
  { key: "rate_confidence", skill: "confidence", prompt: "I stay calm and assured when all eyes are on me." },
  { key: "rate_leadership", skill: "leadership", prompt: "I move discussions toward a decision." },
  { key: "rate_social_skills", skill: "social_skills", prompt: "I read the room and start conversations easily." },
  { key: "rate_networking", skill: "networking", prompt: "I build and keep up useful professional relationships." },
  { key: "rate_intelligence", skill: "intelligence", prompt: "I think problems through and decide well." },
] as const;

export const ASSESSMENT_QUESTIONS: QuestionSeed[] = [
  {
    key: "goals",
    kinds: ["onboarding"],
    section: "Goals",
    prompt: "What do you want to get better at?",
    helpText: "Pick as many as you like.",
    type: "multi",
    options: GOALS.map((g) => ({ value: g.key, label: g.name })),
    isRequired: true,
  },
  {
    key: "primary_goal",
    kinds: ["onboarding"],
    section: "Goals",
    prompt: "Which one matters most right now?",
    helpText: "Your plan starts here. The others become secondary goals.",
    type: "single",
    options: GOALS.map((g) => ({ value: g.key, label: g.name })),
    isRequired: true,
  },
  {
    key: "situations",
    kinds: ["onboarding"],
    section: "Situations",
    prompt: "Where do you most want to see the difference?",
    type: "multi",
    options: [
      { value: "work", label: "At work" },
      { value: "meetings", label: "In meetings" },
      { value: "presentations", label: "Presentations" },
      { value: "networking", label: "Networking" },
      { value: "social", label: "Social situations" },
      { value: "relationships", label: "Relationships" },
      { value: "public_speaking", label: "Public speaking" },
    ],
    isRequired: true,
  },
  {
    key: "level",
    kinds: ["onboarding"],
    section: "Level",
    prompt: "Where would you put yourself today?",
    type: "single",
    options: [
      { value: "beginner", label: "Beginner", description: "I'm starting from the basics." },
      { value: "intermediate", label: "Intermediate", description: "I know the ideas; I want them to stick." },
      { value: "advanced", label: "Advanced", description: "I'm good — I want to be exceptional." },
    ],
    isRequired: true,
  },
  {
    key: "minutes",
    kinds: ["onboarding"],
    section: "Time",
    prompt: "How much time can you give it on a training day?",
    type: "single",
    options: [
      { value: "5", label: "5 min", description: "A quick daily rep" },
      { value: "10", label: "10 min", description: "Lesson + exercise" },
      { value: "15", label: "15 min", description: "The full session" },
      { value: "30", label: "30 min", description: "Full session + practice" },
    ],
    isRequired: true,
  },
  {
    key: "frequency",
    kinds: ["onboarding"],
    section: "Time",
    prompt: "How often will you train?",
    type: "single",
    options: [
      { value: "daily", label: "Every day", description: "Fastest progress" },
      { value: "five_per_week", label: "5 days a week", description: "Weekdays" },
      { value: "three_per_week", label: "3 days a week", description: "Steady and sustainable" },
    ],
    isRequired: true,
  },
  {
    key: "challenge",
    kinds: ["onboarding"],
    section: "Challenge",
    prompt: "What gets in your way most?",
    type: "single",
    options: [
      { value: "express", label: "I know what I want to say but struggle to express it." },
      { value: "nerves", label: "I get nervous when all eyes are on me." },
      { value: "initiate", label: "I hesitate to start conversations with people I don't know." },
      { value: "ramble", label: "I ramble and lose people's attention." },
      { value: "influence", label: "I struggle to influence decisions." },
      { value: "overthink", label: "I overthink and decide slowly." },
      { value: "forget", label: "I forget names and details that matter." },
    ],
    isRequired: true,
  },
  ...SELF_RATINGS.map((r) => ({
    key: r.key,
    kinds: ["onboarding", ...CHECKPOINTS] as Kind[],
    section: "Self-rating",
    prompt: r.prompt,
    type: "scale" as const,
    options: RATING_OPTIONS,
    isRequired: true,
  })),
  {
    key: "ninety_day_goal",
    kinds: ["onboarding"],
    section: "Your goal",
    prompt: "What would you like to be better at 90 days from now?",
    helpText: "Be specific. You'll see this again at day 30, 60 and 90.",
    type: "text",
    options: [],
    isRequired: true,
  },
  {
    key: "checkpoint_change",
    kinds: CHECKPOINTS,
    section: "Reflection",
    prompt: "What feels different compared to when you started?",
    type: "text",
    options: [],
    isRequired: true,
  },
];
