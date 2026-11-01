import { describe, expect, it } from "vitest";
import { addDays, diffDays, localDate, startOfWeek } from "@/lib/dates";
import {
  applySkillGain,
  applyTrainingDay,
  baselineScore,
  initialReview,
  levelForXp,
  scheduleReview,
  visibleStreak,
} from "@/server/engine/progression";
import { resolveToday } from "@/server/engine/today";

describe("dates", () => {
  it("computes the local calendar day in the learner's timezone", () => {
    const lateNightLima = new Date("2026-03-02T03:30:00Z"); // 22:30 on Mar 1 in Lima (UTC-5)
    expect(localDate("America/Lima", lateNightLima)).toBe("2026-03-01");
    expect(localDate("UTC", lateNightLima)).toBe("2026-03-02");
    expect(localDate("Not/AZone", lateNightLima)).toBe("2026-03-02");
  });
  it("does date arithmetic across month boundaries", () => {
    expect(addDays("2026-02-27", 3)).toBe("2026-03-02");
    expect(diffDays("2026-02-27", "2026-03-02")).toBe(3);
    expect(startOfWeek("2026-11-01")).toBe("2026-10-26"); // Sunday → Monday before
    expect(startOfWeek("2026-10-26")).toBe("2026-10-26");
  });
});

describe("levels", () => {
  it("maps XP to the five named levels", () => {
    expect(levelForXp(0)).toMatchObject({ level: 1, name: "Explorer", nextName: "Learner" });
    expect(levelForXp(499).level).toBe(1);
    expect(levelForXp(500)).toMatchObject({ level: 2, name: "Learner" });
    expect(levelForXp(1000).progress).toBe(50);
    expect(levelForXp(9999)).toMatchObject({ level: 5, name: "Master", nextLevelXp: null, progress: 100 });
  });
});

describe("streaks", () => {
  const empty = { current: 0, longest: 0, lastActiveDate: null };
  it("starts, continues, ignores same-day repeats and restarts after a gap", () => {
    const d1 = applyTrainingDay(empty, "2026-01-01");
    expect(d1).toMatchObject({ current: 1, longest: 1, event: "started" });
    const again = applyTrainingDay(d1, "2026-01-01");
    expect(again).toMatchObject({ current: 1, event: "same_day" });
    const d2 = applyTrainingDay(d1, "2026-01-02");
    expect(d2).toMatchObject({ current: 2, longest: 2, event: "continued" });
    const gap = applyTrainingDay(d2, "2026-01-05");
    expect(gap).toMatchObject({ current: 1, longest: 2, event: "restarted", lost: 2 });
  });
  it("shows a streak at risk the day after training and zero after a missed day", () => {
    const s = { current: 4, longest: 4, lastActiveDate: "2026-01-10" };
    expect(visibleStreak(s, "2026-01-10")).toEqual({ current: 4, atRisk: false });
    expect(visibleStreak(s, "2026-01-11")).toEqual({ current: 4, atRisk: true });
    expect(visibleStreak(s, "2026-01-12")).toEqual({ current: 0, atRisk: false });
  });
});

describe("spaced repetition", () => {
  it("walks 1 → 3 → 7 → 14 → 30 days, then graduates", () => {
    let s = initialReview("2026-01-01");
    expect(s.dueOn).toBe("2026-01-02");
    const dues: (string | null)[] = [];
    let today = "2026-01-02";
    for (let i = 0; i < 5; i++) {
      s = scheduleReview(s, true, today);
      dues.push(s.dueOn);
      if (s.dueOn) today = s.dueOn;
    }
    expect(dues).toEqual(["2026-01-05", "2026-01-12", "2026-01-26", "2026-02-25", null]);
  });
  it("sends a missed concept back to tomorrow and counts the lapse", () => {
    const s = scheduleReview({ stage: 3, dueOn: "2026-01-10", lapses: 0 }, false, "2026-01-10");
    expect(s).toEqual({ stage: 0, dueOn: "2026-01-11", lapses: 1 });
  });
});

describe("skills", () => {
  it("applies diminishing returns and caps at 100", () => {
    expect(applySkillGain(20, 4).delta).toBe(3);
    expect(applySkillGain(90, 4).delta).toBeLessThan(applySkillGain(20, 4).delta);
    expect(applySkillGain(99, 10).score).toBe(100);
    expect(applySkillGain(50, 1).delta).toBe(1);
  });
  it("derives a starting score from level and self-rating", () => {
    expect(baselineScore(3, "beginner")).toBe(20);
    expect(baselineScore(5, "advanced")).toBe(62);
    expect(baselineScore(1, "beginner")).toBe(8);
  });
});

describe("today's lesson", () => {
  const ids = ["a", "b", "c"];
  it("serves the first incomplete lesson and locks the rest", () => {
    const r = resolveToday(ids, new Map(), "2026-01-01");
    expect(r.todayLessonId).toBe("a");
    expect([...r.states.values()]).toEqual(["today", "locked", "locked"]);
  });
  it("after finishing today's lesson, the next one waits for tomorrow", () => {
    const progress = new Map([["a", { status: "completed" as const, completedOn: "2026-01-01", currentStep: 9 }]]);
    const sameDay = resolveToday(ids, progress, "2026-01-01");
    expect(sameDay.todayLessonId).toBeNull();
    expect(sameDay.doneTodayLessonId).toBe("a");
    expect(sameDay.nextLessonId).toBe("b");
    expect(sameDay.states.get("b")).toBe("locked");
    const nextDay = resolveToday(ids, progress, "2026-01-02");
    expect(nextDay.todayLessonId).toBe("b");
    expect(nextDay.states.get("b")).toBe("today");
  });
  it("reports a completed journey", () => {
    const done = new Map(ids.map((id) => [id, { status: "completed" as const, completedOn: "2025-12-01", currentStep: 9 }]));
    expect(resolveToday(ids, done, "2026-01-01").journeyComplete).toBe(true);
  });
});
