import { sql } from "drizzle-orm";
import type { Executor } from "@/server/db";
import { rateLimits } from "@/server/db/schema";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Fixed-window rate limiter stored in Postgres, so limits hold across
 * serverless instances. A single atomic upsert increments the counter and
 * resets it when the window has elapsed.
 */
export async function rateLimit(
  db: Executor,
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const windowInterval = sql.raw(`interval '${Math.floor(windowSeconds)} seconds'`);
  const [row] = await db
    .insert(rateLimits)
    .values({ key, count: 1, windowStart: new Date() })
    .onConflictDoUpdate({
      target: rateLimits.key,
      set: {
        count: sql`case when ${rateLimits.windowStart} < now() - ${windowInterval} then 1 else ${rateLimits.count} + 1 end`,
        windowStart: sql`case when ${rateLimits.windowStart} < now() - ${windowInterval} then now() else ${rateLimits.windowStart} end`,
      },
    })
    .returning({ count: rateLimits.count, windowStart: rateLimits.windowStart });

  const elapsed = (Date.now() - new Date(row.windowStart).getTime()) / 1000;
  return {
    allowed: row.count <= limit,
    remaining: Math.max(0, limit - row.count),
    retryAfterSeconds: Math.max(1, Math.ceil(windowSeconds - elapsed)),
  };
}
