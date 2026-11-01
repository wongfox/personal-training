import { z } from "zod";
import { getDb } from "@/server/db";
import { apiHandler, readJson } from "@/server/http";
import { checkQuizAnswer } from "@/server/services/learning";

const body = z.object({ questionId: z.uuid(), answer: z.number().int().min(0).max(10) });

export const POST = apiHandler<{ quizId: string }>(async ({ user, today, request }, { quizId }) => {
  const input = await readJson(request, body);
  return checkQuizAnswer(getDb(), user.id, today, quizId, input.questionId, input.answer);
});
