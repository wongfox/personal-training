/**
 * Database CLI.
 *   npm run db:migrate            apply migrations
 *   npm run db:seed [-- --force]  seed reference data + content
 *   npm run db:setup              migrate + seed
 *   npm run admin:grant -- <email> <ROLE>
 *   npm run admin:create -- <email> <password> [name]   (verified SUPER_ADMIN account)
 */
import { closeDb, getDb } from "@/server/db";
import { migrateDatabase } from "@/server/db/migrate";
import { seedAll } from "@/server/db/seed";
import { isRoleKey } from "@/server/auth/rbac";
import { createVerifiedUser, findUserByEmail, grantRole } from "@/server/services/accounts";
import { passwordSchema } from "@/server/validation";

async function main() {
  const [command, ...args] = process.argv.slice(2);
  const target = process.env.DATABASE_URL ? "Neon/Postgres (DATABASE_URL)" : `PGlite (${process.env.PGLITE_DIR ?? "./.data/pglite"})`;
  console.log(`[db] ${command} → ${target}`);

  if (command === "migrate" || command === "setup") {
    await migrateDatabase();
    console.log("[db] migrations applied");
  }
  if (command === "seed" || command === "setup") {
    const report = await getDb().transaction((tx) => seedAll(tx, { force: args.includes("--force") }));
    console.log("[db] seeded", report);
  }
  if (command === "grant") {
    const [email, role] = args;
    if (!email || !role || !isRoleKey(role)) throw new Error("Usage: admin:grant -- <email> <SUPER_ADMIN|ADMIN|CONTENT_MANAGER|COACH|USER>");
    const db = getDb();
    const user = await findUserByEmail(db, email);
    if (!user) throw new Error(`No user with email ${email}`);
    await grantRole(db, user.id, role);
    console.log(`[db] granted ${role} to ${email}`);
  }
  if (command === "create-admin") {
    const [email, password, name = "Admin"] = args;
    if (!email || !password) throw new Error("Usage: admin:create -- <email> <password> [name]");
    passwordSchema.parse(password);
    await getDb().transaction((tx) => createVerifiedUser(tx, { email, password, name, role: "SUPER_ADMIN" }));
    console.log(`[db] ${email} is a verified SUPER_ADMIN`);
  }
  await closeDb();
}

main().catch(async (e) => {
  console.error(e);
  await closeDb();
  process.exit(1);
});
