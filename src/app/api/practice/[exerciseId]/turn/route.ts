import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { counterpartReply } from "@/server/ai/simulator";
import { getDb } from "@/server/db";
import { exercises } from "@/server/db/schema";
import { NotFoundError } from "@/server/errors";
import { apiHandler, readJson } from "@/server/http";
import { track } from "@/server/platform";

const body = z.object({
  turns: z
    .array(z.object({ role: z.enum(["user", "counterpart"]), text: z.string().trim().min(1).max(1500) }))
    .min(2)
    .max(20),
});

export const POST = apiHandler<{ exerciseId: string }>(
  async ({ user, request }, { exerciseId }) => {
    const { turns } = await readJson(request, body);
    const db = getDb();
    const [exercise] = await db
      .select()
      .from(exercises)
      .where(and(eq(exercises.id, exerciseId), eq(exercises.status, "published")));
    if (!exercise || exercise.config.type !== "roleplay") throw new NotFoundError("Scenario not found.");
    if (turns.filter((t) => t.role === "user").length === 1) {
      await track(db, user.id, "practice_started", { exerciseId, kind: exercise.config.mode });
    }
    return counterpartReply(exercise.config, turns);
  },
  { rateLimit: { key: "sim-turn", limit: 120, windowSeconds: 3600 } },
);
