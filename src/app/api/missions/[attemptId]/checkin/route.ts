import { z } from "zod";
import { getDb } from "@/server/db";
import { apiHandler, readJson } from "@/server/http";
import { track } from "@/server/platform";
import { checkInMission } from "@/server/services/learning";
import { trackRewardEvents } from "@/server/services/reward-events";

const body = z.object({
  status: z.enum(["done", "not_yet", "skipped"]),
  outcome: z.enum(["difficult", "normal", "good", "excellent"]).optional(),
});

export const POST = apiHandler<{ attemptId: string }>(async ({ user, today, request }, { attemptId }) => {
  const input = await readJson(request, body);
  const db = getDb();
  const result = await db.transaction((tx) => checkInMission(tx, user.id, today, attemptId, input));
  if (result.status === "done") await track(db, user.id, "daily_action_completed", { attemptId, outcome: input.outcome });
  if (result.reward) await trackRewardEvents(db, user.id, result.reward);
  return result;
});
