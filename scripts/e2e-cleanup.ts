/**
 * Removes everything the e2e suite created in a real database:
 * accounts with @e2e.test emails (cascades to their progress) and the
 * draft journey the admin test creates. Usage:
 *   npx tsx --env-file=.env.local scripts/e2e-cleanup.ts
 */
import { eq, like } from "drizzle-orm";
import { closeDb, getDb } from "@/server/db";
import { journeys, users } from "@/server/db/schema";

async function main() {
  const db = getDb();
  const removedUsers = await db.delete(users).where(like(users.email, "%@e2e.test")).returning({ email: users.email });
  const removedJourneys = await db.delete(journeys).where(eq(journeys.slug, "negotiation-lab")).returning({ slug: journeys.slug });
  console.log(`[e2e-cleanup] removed ${removedUsers.length} test accounts, ${removedJourneys.length} test journey(s)`);
  await closeDb();
}

main().catch(async (e) => {
  console.error(e);
  await closeDb();
  process.exit(1);
});
