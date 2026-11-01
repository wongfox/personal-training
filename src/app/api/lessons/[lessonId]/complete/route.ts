import { z } from "zod";
import { getDb } from "@/server/db";
import { apiHandler, readJson } from "@/server/http";
import { track } from "@/server/platform";
import { completeLesson } from "@/server/services/learning";
import { trackRewardEvents } from "@/server/services/reward-events";

const body = z.object({ reflection: z.string().max(2000).optional() });

export const POST = apiHandler<{ lessonId: string }>(async ({ user, today, request }, { lessonId }) => {
  const input = await readJson(request, body);
  const db = getDb();
  const result = await db.transaction((tx) => completeLesson(tx, user.id, today, lessonId, input));
  if (!result.alreadyCompleted) {
    await track(db, user.id, "lesson_completed", { lessonId });
    if (input.reflection?.trim()) await track(db, user.id, "reflection_completed", { kind: "lesson", lessonId });
    if (result.missionAttemptId) await track(db, user.id, "daily_action_started", { attemptId: result.missionAttemptId });
    if (result.journeyCompleted) await track(db, user.id, "journey_completed", { journeyId: result.journeyId });
  }
  await trackRewardEvents(db, user.id, result.reward);
  return result;
});
