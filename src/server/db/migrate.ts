import path from "node:path";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { migrate as migratePg } from "drizzle-orm/node-postgres/migrator";
import type { PgliteDatabase } from "drizzle-orm/pglite";
import { migrate as migratePglite } from "drizzle-orm/pglite/migrator";
import { Pool } from "pg";
import { getDb } from "./index";

const migrationsFolder = path.join(process.cwd(), "drizzle");

/**
 * Applies pending migrations. On Neon, migrations run over the direct
 * (unpooled) connection when DATABASE_URL_UNPOOLED is provided, since
 * PgBouncer transaction pooling does not support session-level statements.
 */
export async function migrateDatabase(): Promise<void> {
  const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
  if (url) {
    const pool = new Pool({ connectionString: url, max: 1 });
    try {
      await migratePg(drizzlePg({ client: pool }), { migrationsFolder });
    } finally {
      await pool.end();
    }
    return;
  }
  await migratePglite(getDb() as unknown as PgliteDatabase, { migrationsFolder });
}
