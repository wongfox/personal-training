// Starts a throwaway app instance for the e2e suite: fresh PGlite database,
// migrated and seeded, then `next dev` (or `next start` when E2E_PROD=1).
import { spawn, spawnSync } from "node:child_process";
import { rmSync } from "node:fs";

const port = process.argv[2] ?? "3100";
const dir = process.env.E2E_DB_DIR ?? ".data/e2e";
rmSync(dir, { recursive: true, force: true });

const env = {
  ...process.env,
  PGLITE_DIR: dir,
  DATABASE_URL: "",
  APP_URL: `http://localhost:${port}`,
  ANTHROPIC_API_KEY: "",
  ANTHROPIC_AUTH_TOKEN: "",
};
const shell = process.platform === "win32";

const setup = spawnSync("npx", ["tsx", "scripts/db.ts", "setup"], { env, stdio: "inherit", shell });
if (setup.status !== 0) process.exit(setup.status ?? 1);
const admin = spawnSync("npx", ["tsx", "scripts/db.ts", "create-admin", "admin@e2e.test", '"a long enough password"', "Root"], { env, stdio: "inherit", shell });
if (admin.status !== 0) process.exit(admin.status ?? 1);

const args = process.env.E2E_PROD ? ["next", "start", "-p", port] : ["next", "dev", "-p", port];
const server = spawn("npx", args, { env, stdio: "inherit", shell });
const stop = () => server.kill();
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
server.on("exit", (code) => process.exit(code ?? 0));
