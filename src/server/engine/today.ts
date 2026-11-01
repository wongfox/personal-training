/**
 * "One powerful idea per day": decides which lesson is today's, and which are
 * completed, available or still locked, from ordered lessons + progress.
 */
import type { ISODate } from "@/lib/dates";

export type LessonState = "completed" | "today" | "locked";

export interface LessonProgressRef {
  status: "in_progress" | "completed";
  completedOn: ISODate | null;
  currentStep: number;
}

export interface TodayResolution {
  /** The lesson to train today (null when today's is already done or the journey is complete). */
  todayLessonId: string | null;
  /** Lesson completed today, if any. */
  doneTodayLessonId: string | null;
  /** First lesson not yet completed — tomorrow's lesson when today's is done. */
  nextLessonId: string | null;
  journeyComplete: boolean;
  states: Map<string, LessonState>;
}

export function resolveToday(
  orderedLessonIds: string[],
  progress: Map<string, LessonProgressRef>,
  today: ISODate,
): TodayResolution {
  const states = new Map<string, LessonState>();
  const doneToday = orderedLessonIds.find((id) => progress.get(id)?.completedOn === today) ?? null;
  const firstIncomplete = orderedLessonIds.find((id) => progress.get(id)?.status !== "completed") ?? null;

  for (const id of orderedLessonIds) {
    if (progress.get(id)?.status === "completed") states.set(id, "completed");
    else if (!doneToday && id === firstIncomplete) states.set(id, "today");
    else states.set(id, "locked");
  }

  return {
    todayLessonId: doneToday ? null : firstIncomplete,
    doneTodayLessonId: doneToday,
    nextLessonId: firstIncomplete,
    journeyComplete: orderedLessonIds.length > 0 && firstIncomplete === null,
    states,
  };
}
