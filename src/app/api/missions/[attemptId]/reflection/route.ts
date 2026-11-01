import { z } from "zod";
import { getDb } from "@/server/db";
import { apiHandler, readJson } from "@/server/http";
import { track } from "@/server/platform";
import { saveMissionReflection } from "@/server/services/learning";
import { trackRewardEvents } from "@/server/services/reward-events";

const answer = z.string().max(2000).optional();
const body = z.object({ whatHappened: answer, whatWorked: answer, whatToImprove: answer, whatLearned: answer });

export const POST = apiHandler<{ attemptId: string }>(async ({ user, today, request }, { attemptId }) => {
  const input = await readJson(request, body);
  const db = getDb();
  const reward = await db.transaction((tx) => saveMissionReflection(tx, user.id, today, attemptId, input));
  await track(db, user.id, "reflection_completed", { kind: "action", attemptId });
  await trackRewardEvents(db, user.id, reward);
  return { reward };
});
