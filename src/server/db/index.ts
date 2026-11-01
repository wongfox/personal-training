/**
 * Database access.
 *
 * - DATABASE_URL set (production, Neon): node-postgres pool against Neon's
 *   pooled endpoint. Neon recommends `pg` for long-lived Node servers and
 *   Vercel Fluid compute.
 * - DATABASE_URL unset (local development / tests): PGlite — real Postgres
 *   compiled to WASM, persisted to PGLITE_DIR. Refuses to run in production
 *   unless PGLITE_DIR is set explicitly (used by the e2e suite).
 *
 * The client is created lazily so importing this module never opens a
 * connection (build workers import route modules without querying).
 */
import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { attachDatabasePool } from "@vercel/functions";
import { Pool } from "pg";
import * as schema from "./schema";

export type Schema = typeof schema;
export type DB = PgDatabase<PgQueryResultHKT, Schema>;
/** A transaction handle exposes the same query surface as the root client. */
export type Tx = Parameters<Parameters<DB["transaction"]>[0]>[0];
export type Executor = DB | Tx;

type Holder = { db?: DB; close?: () => Promise<void> };
const holder = ((globalThis as { __pgos_db?: Holder }).__pgos_db ??= {});

function createDb(): DB {
  const url = process.env.DATABASE_URL;
  if (url) {
    const pool = new Pool({ connectionString: strictSsl(url), max: Number(process.env.DATABASE_POOL_MAX ?? 5) });
    // On Vercel Fluid compute, lets idle pooled connections close before a function suspends
    // (Neon's recommended setup for node-postgres on Vercel). A no-op elsewhere.
    attachDatabasePool(pool);
    holder.close = () => pool.end();
    return drizzlePg({ client: pool, schema }) as unknown as DB;
  }

  const dir = process.env.PGLITE_DIR;
  if (process.env.NODE_ENV === "production" && !dir) {
    throw new Error("DATABASE_URL is required in production.");
  }
  const dataDir = dir === "memory://" ? undefined : (dir ?? "./.data/pglite");
  if (dataDir) mkdirSync(path.dirname(path.resolve(dataDir)), { recursive: true });
  const client = new PGlite(dataDir);
  holder.close = () => client.close();
  return drizzlePglite({ client, schema }) as unknown as DB;
}

export function getDb(): DB {
  holder.db ??= createDb();
  return holder.db;
}

export async function closeDb(): Promise<void> {
  await holder.close?.();
  holder.db = undefined;
  holder.close = undefined;
}

export { schema };

/**
 * pg currently treats sslmode=require as full certificate verification and will
 * weaken it to libpq semantics in v9. Pin the strict behaviour explicitly
 * (Neon serves valid certificates), which also silences the deprecation warning.
 */
export function strictSsl(url: string): string {
  try {
    const u = new URL(url);
    if (u.searchParams.get("sslmode") === "require") u.searchParams.set("sslmode", "verify-full");
    return u.toString();
  } catch {
    return url;
  }
}
