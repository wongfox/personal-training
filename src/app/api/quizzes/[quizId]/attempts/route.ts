import { z } from "zod";
import { getDb } from "@/server/db";
import { apiHandler, readJson } from "@/server/http";
import { track } from "@/server/platform";
import { submitQuiz } from "@/server/services/learning";
import { trackRewardEvents } from "@/server/services/reward-events";

const body = z.object({ answers: z.array(z.number().int().min(0).max(10)).min(1).max(20) });

export const POST = apiHandler<{ quizId: string }>(async ({ user, today, request }, { quizId }) => {
  const input = await readJson(request, body);
  const db = getDb();
  await track(db, user.id, "quiz_started", { quizId });
  const result = await db.transaction((tx) => submitQuiz(tx, user.id, today, quizId, input.answers));
  await track(db, user.id, "quiz_completed", { quizId, score: result.score, total: result.total });
  await trackRewardEvents(db, user.id, result.reward);
  return result;
});
