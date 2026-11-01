import { z } from "zod";
import { getDb } from "@/server/db";
import { apiHandler, readJson } from "@/server/http";
import { track } from "@/server/platform";
import { answerReview } from "@/server/services/learning";

const body = z.object({ answer: z.number().int().min(0).max(10) });

export const POST = apiHandler<{ itemId: string }>(async ({ user, today, request }, { itemId }) => {
  const input = await readJson(request, body);
  const db = getDb();
  const result = await db.transaction((tx) => answerReview(tx, user.id, today, itemId, input.answer));
  await track(db, user.id, "review_completed", { itemId, correct: result.correct });
  return result;
});
