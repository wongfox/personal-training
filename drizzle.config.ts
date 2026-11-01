import { defineConfig } from "drizzle-kit";

// Migrations are generated from the schema and committed under ./drizzle.
// They are applied by `npm run db:migrate` (see scripts/migrate.ts), which works
// for both Neon (DATABASE_URL_UNPOOLED / DATABASE_URL) and local PGlite.
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  strict: true,
  verbose: true,
});
