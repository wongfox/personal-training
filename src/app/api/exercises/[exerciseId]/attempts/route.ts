import { z } from "zod";
import { enrichWithAi } from "@/server/ai/evaluate";
import { getDb } from "@/server/db";
import { apiHandler, readJson } from "@/server/http";
import { track } from "@/server/platform";
import { prepareExercise, recordExerciseAttempt } from "@/server/services/learning";
import { trackRewardEvents } from "@/server/services/reward-events";

const body = z.object({ response: z.unknown(), durationSeconds: z.number().min(0).max(7200).nullish() });

export const POST = apiHandler<{ exerciseId: string }>(
  async ({ user, today, request }, { exerciseId }) => {
    const input = await readJson(request, body);
    const db = getDb();
    const prepared = await prepareExercise(db, user.id, today, exerciseId, input.response);
    // AI feedback (when configured) runs outside the transaction so a slow model call never holds it open.
    prepared.feedback = await enrichWithAi(user.id, prepared.exercise.config, prepared.response, prepared.feedback);
    const result = await db.transaction((tx) => recordExerciseAttempt(tx, user.id, today, prepared, input.durationSeconds ?? null));
    await track(db, user.id, prepared.exercise.isPractice ? "practice_completed" : "exercise_completed", {
      exerciseId,
      score: result.feedback.score,
    });
    await trackRewardEvents(db, user.id, result.reward);
    return result;
  },
  { rateLimit: { key: "exercise", limit: 60, windowSeconds: 3600 } },
);
