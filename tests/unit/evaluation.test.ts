import { describe, expect, it } from "vitest";
import type { ExerciseConfig } from "@/server/db/types";
import { buildCoachInsight, type InsightSignals } from "@/server/engine/coach-insight";
import { itemRecalled, scoreExercise } from "@/server/engine/exercise-scoring";
import { buildPlan, pickJourney } from "@/server/engine/plan";
import { analyzeText, evaluateText } from "@/server/engine/text-analysis";
import { can, grantableRoles } from "@/server/auth/rbac";
import { hashPassword, verifyPassword } from "@/server/auth/crypto";

describe("text analysis", () => {
  it("finds hedges, apologies and fillers on word boundaries", () => {
    const m = analyzeText("Sorry, I think maybe we could just, um, adjust the plan?");
    expect(m.hedges).toEqual(expect.arrayContaining(["i think", "maybe", "just"]));
    expect(m.apologies).toContain("sorry");
    expect(m.fillers).toContain("um");
    expect(m.questions).toBe(1);
    // "adjust" must not count as "just"
    expect(analyzeText("We will adjust the plan.").hedges).toEqual([]);
  });

  it("scores confident, concise writing above hedged rambling", () => {
    const strong = evaluateText("I recommend we launch on Monday. It cuts churn by 4% because onboarding is faster.", ["confidence", "conciseness", "authority"], { wordBudget: 40 });
    const weak = evaluateText("Sorry, I just think maybe we could possibly launch at some point, if that's okay, I'm not sure though.", ["confidence", "conciseness", "authority"], { wordBudget: 40 });
    expect(strong.score).toBeGreaterThan(weak.score + 25);
    expect(weak.flagged?.length).toBeGreaterThan(2);
    expect(weak.improvements[0]).toMatch(/Weak phrases/);
  });
});

describe("exercise scoring", () => {
  const choice: ExerciseConfig = {
    type: "choice",
    scenario: "s",
    question: "q",
    options: [
      { text: "weak", quality: "weak", feedback: "w" },
      { text: "best", quality: "best", feedback: "b" },
      { text: "ok", quality: "ok", feedback: "o" },
    ],
  };
  it("grades choices by option quality and points to the best move", () => {
    expect(scoreExercise(choice, { selected: 1 }).score).toBe(100);
    const ok = scoreExercise(choice, { selected: 2 });
    expect(ok.score).toBe(60);
    expect(ok.improvements.join(" ")).toMatch(/best/);
    expect(() => scoreExercise(choice, { selected: 9 })).toThrow();
    expect(() => scoreExercise(choice, { selected: "x" })).toThrow();
  });

  it("grades ordering by position", () => {
    const order: ExerciseConfig = { type: "order", instruction: "i", items: ["a", "b", "c", "d"], explanation: "e" };
    expect(scoreExercise(order, { order: [0, 1, 2, 3] }).score).toBe(100);
    expect(scoreExercise(order, { order: [1, 0, 2, 3] }).score).toBe(50);
    expect(() => scoreExercise(order, { order: [0, 0, 1, 2] })).toThrow();
  });

  it("penalises rewrites that barely change the original", () => {
    const rewrite: ExerciseConfig = {
      type: "rewrite",
      instruction: "i",
      original: "Sorry to bother you, I just think maybe we should consider moving the launch date if possible.",
      tips: [],
      maxWords: 20,
      keywords: ["launch"],
      modelAnswer: "I recommend we move the launch to May 3.",
    };
    const copy = scoreExercise(rewrite, { text: rewrite.original });
    const good = scoreExercise(rewrite, { text: "I recommend moving the launch to May 3 so QA can finish." });
    expect(good.score).toBeGreaterThan(copy.score + 30);
  });

  it("recognises recalled items by their key words", () => {
    expect(itemRecalled("Priya Shah — logistics lead at Halvorsen", "priya, logistics at halvorsen")).toBe(true);
    expect(itemRecalled("Priya Shah — logistics lead at Halvorsen", "someone from marketing")).toBe(false);
  });

  it("scores roleplay transcripts and asks for a close in networking", () => {
    const cfg: ExerciseConfig = {
      type: "roleplay",
      mode: "networking",
      setting: "s",
      counterpart: { name: "Ana", role: "CEO", persona: "p" },
      objective: "o",
      openingLine: "Hi, what do you do?",
      scriptedTurns: ["a", "b", "c"],
      focus: ["curiosity", "conciseness", "confidence"],
    };
    const fb = scoreExercise(cfg, {
      turns: [
        { role: "counterpart", text: "Hi, what do you do?" },
        { role: "user", text: "I run logistics for a rail company. What brought you here today?" },
      ],
    });
    expect(fb.score).toBeGreaterThan(50);
    expect(fb.improvements.join(" ")).toMatch(/contact|next step/);
  });

  it("flags a pitch that never asks for what it wants", () => {
    const cfg: ExerciseConfig = { type: "pitch", briefing: "b", audiences: ["x"], objectives: ["Get approval"], durations: [3], suggestedTopics: ["t"] };
    const fb = scoreExercise(cfg, {
      audience: "Executive committee",
      objective: "Get approval",
      duration: 3,
      topic: "Digital commerce",
      text: "Our digital channel has grown steadily over the past year and there are many interesting trends in the market that we have been looking at closely with the team in recent months.",
    });
    expect(fb.improvements.join(" ")).toMatch(/never actually ask/);
  });
});

describe("plan building", () => {
  const journeys = [
    { id: "1", slug: "communication-mastery", title: "Communication Mastery", category: "communication" },
    { id: "2", slug: "confident-presence", title: "Confident Presence", category: "confidence" },
    { id: "5", slug: "connect-with-anyone", title: "Connect with Anyone", category: "social_intelligence" },
  ];
  it("routes goals to the right journey, with fallbacks", () => {
    expect(pickJourney("confidence", journeys)?.slug).toBe("confident-presence");
    expect(pickJourney("storytelling", journeys)?.slug).toBe("communication-mastery");
    expect(pickJourney("networking", journeys)?.slug).toBe("connect-with-anyone");
    expect(pickJourney("leadership", journeys)?.slug).toBe("communication-mastery");
  });
  it("builds a named plan with primary and up to three secondary goals", () => {
    const plan = buildPlan("Juan Pérez", {
      goals: ["communication", "confidence", "networking", "memory", "leadership"],
      primaryGoal: "communication",
      situations: ["meetings"],
      level: "intermediate",
      minutes: 15,
      frequency: "daily",
      challenge: "express",
      ninetyDayGoal: "x",
      selfRatings: {},
    }, journeys);
    expect(plan.title).toBe("Juan's Growth Plan");
    expect(plan.secondaryGoals).toEqual(["confidence", "networking", "memory"]);
    expect(plan.dailyMinutes).toBe(15);
    expect(plan.durationDays).toBe(90);
  });
});

describe("coach insight", () => {
  const base: InsightSignals = {
    primarySkill: { key: "confidence", name: "Confidence" },
    skills: [{ key: "confidence", name: "Confidence", score: 30, baseline: 20 }],
    actions: [],
    reflections: [],
    exercises: [],
    daysTrainedLast7: 5,
    weeklyTarget: 5,
    daysInPlan: 20,
    streak: 5,
    lessonsCompleted: 4,
    next: { title: "Open the conversation", skillName: "Confidence" },
  };
  it("welcomes brand-new learners", () => {
    expect(buildCoachInsight({ ...base, lessonsCompleted: 0 }).tone).toBe("welcome");
  });
  it("spots hesitation in reflections and recommends tomorrow's lesson", () => {
    const i = buildCoachInsight({
      ...base,
      reflections: ["I was nervous and hesitated before talking", "felt awkward at first"],
      actions: [{ status: "not_yet", outcome: null, title: "t" }],
    });
    expect(i.observation).toMatch(/improving your confidence/);
    expect(i.observation).toMatch(/hesitate/);
    expect(i.recommendation).toMatch(/Open the conversation/);
  });
  it("nudges inconsistent training", () => {
    expect(buildCoachInsight({ ...base, daysTrainedLast7: 1 }).focus).toBe("Consistency");
    // …but never on the first days of a plan.
    expect(buildCoachInsight({ ...base, daysTrainedLast7: 1, daysInPlan: 1, skills: [] }).focus).toBe("Momentum");
  });
});

describe("rbac", () => {
  it("separates content, user and admin powers", () => {
    expect(can(["CONTENT_MANAGER"], "content:write")).toBe(true);
    expect(can(["CONTENT_MANAGER"], "content:publish")).toBe(false);
    expect(can(["COACH"], "users:read")).toBe(true);
    expect(can(["COACH"], "users:manage")).toBe(false);
    expect(can(["USER"], "admin:access")).toBe(false);
    expect(grantableRoles(["ADMIN"])).not.toContain("SUPER_ADMIN");
    expect(grantableRoles(["SUPER_ADMIN"])).toContain("ADMIN");
  });
});

describe("password hashing", () => {
  it("verifies the right password and rejects the wrong one", async () => {
    const hash = await hashPassword("correct horse battery");
    expect(hash.startsWith("scrypt$")).toBe(true);
    expect(await verifyPassword("correct horse battery", hash)).toBe(true);
    expect(await verifyPassword("wrong horse battery", hash)).toBe(false);
    expect(await verifyPassword("x", "garbage")).toBe(false);
  });
});
