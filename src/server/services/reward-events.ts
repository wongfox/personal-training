import type { Executor } from "@/server/db";
import { track } from "@/server/platform";
import type { ActivityResult } from "./rewards";

/** Emits streak analytics implied by a reward (kept out of the reward transaction). */
export async function trackRewardEvents(db: Executor, userId: string, reward: ActivityResult | null): Promise<void> {
  if (!reward?.streak.event) return;
  if (reward.streak.event === "restarted") await track(db, userId, "streak_lost", { lost: reward.streak.lost });
  if (reward.streak.event === "started" || reward.streak.event === "restarted") await track(db, userId, "streak_started");
}
