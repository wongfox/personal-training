import { sql } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { seedAll } from "@/server/db/seed";
import { setupDatabase } from "./helpers";

const TABLES = ["journeys", "journey_modules", "lessons", "exercises", "quizzes", "quiz_questions", "daily_actions", "resources", "skills", "goals", "assessment_questions", "achievements"];

describe("seed: Spanish overlays", () => {
  it("gives every seeded content row a Spanish translation, and re-seeding keeps CMS edits", async () => {
    const db = await setupDatabase();
    const missing: Record<string, string> = {};
    for (const table of TABLES) {
      const res = await db.execute(sql.raw(`select count(*)::int as total, count(*) filter (where translations ? 'es')::int as es from ${table}`));
      const { total, es } = (res as unknown as { rows: { total: number; es: number }[] }).rows[0];
      expect(total, table).toBeGreaterThan(0);
      if (es !== total) missing[table] = `${es}/${total}`;
    }
    expect(missing).toEqual({});

    await db.execute(sql`update resources set translations = '{"es":{"title":"Editado en el CMS"}}' where slug = (select slug from resources order by "order" limit 1)`);
    await db.transaction((tx) => seedAll(tx));
    const res = await db.execute(sql`select translations->'es'->>'title' as title from resources order by "order" limit 1`);
    expect((res as unknown as { rows: { title: string }[] }).rows[0].title).toBe("Editado en el CMS");
  }, 120_000);
});
