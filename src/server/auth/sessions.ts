import { and, eq, gt, lt, ne } from "drizzle-orm";
import type { Executor } from "@/server/db";
import { profiles, roles, sessions, userRoles, users } from "@/server/db/schema";
import { generateToken, sha256 } from "./crypto";

export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const REFRESH_THRESHOLD_MS = 15 * 24 * 60 * 60 * 1000;

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  roles: string[];
  timezone: string;
  locale: "en" | "es";
  onboarded: boolean;
}

export interface ValidatedSession {
  sessionId: string;
  expiresAt: Date;
  user: SessionUser;
}

export async function createSession(
  db: Executor,
  userId: string,
  meta: { ipAddress?: string | null; userAgent?: string | null } = {},
): Promise<{ token: string; expiresAt: Date }> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(sessions).values({
    id: sha256(token),
    userId,
    expiresAt,
    ipAddress: meta.ipAddress ?? null,
    userAgent: meta.userAgent?.slice(0, 300) ?? null,
  });
  return { token, expiresAt };
}

/** Looks a raw token up, enforces expiry and account status, and slides the expiry window. */
export async function validateSessionToken(db: Executor, token: string): Promise<ValidatedSession | null> {
  if (!token || token.length > 128) return null;
  const sessionId = sha256(token);
  const [row] = await db
    .select({
      sessionId: sessions.id,
      expiresAt: sessions.expiresAt,
      userId: users.id,
      email: users.email,
      name: users.name,
      avatarUrl: users.avatarUrl,
      status: users.status,
      timezone: profiles.timezone,
      locale: profiles.locale,
      onboardedAt: profiles.onboardingCompletedAt,
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (!row) return null;
  if (row.expiresAt.getTime() <= Date.now() || row.status !== "active") {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return null;
  }

  let expiresAt = row.expiresAt;
  if (expiresAt.getTime() - Date.now() < REFRESH_THRESHOLD_MS) {
    expiresAt = new Date(Date.now() + SESSION_TTL_MS);
    await db.update(sessions).set({ expiresAt }).where(eq(sessions.id, sessionId));
  }

  const roleRows = await db
    .select({ key: roles.key })
    .from(userRoles)
    .innerJoin(roles, eq(roles.id, userRoles.roleId))
    .where(eq(userRoles.userId, row.userId));

  return {
    sessionId,
    expiresAt,
    user: {
      id: row.userId,
      email: row.email,
      name: row.name,
      avatarUrl: row.avatarUrl,
      roles: roleRows.map((r) => r.key),
      timezone: row.timezone ?? "UTC",
      locale: row.locale === "es" ? "es" : "en",
      onboarded: Boolean(row.onboardedAt),
    },
  };
}

export async function invalidateSession(db: Executor, sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

/** Signs a user out everywhere (password reset, suspension). Optionally keeps one session. */
export async function invalidateUserSessions(db: Executor, userId: string, keepSessionId?: string): Promise<void> {
  await db
    .delete(sessions)
    .where(keepSessionId ? and(eq(sessions.userId, userId), ne(sessions.id, keepSessionId)) : eq(sessions.userId, userId));
}

export async function deleteExpiredSessions(db: Executor): Promise<void> {
  await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
}

export async function countActiveSessions(db: Executor, userId: string): Promise<number> {
  const rows = await db
    .select({ id: sessions.id })
    .from(sessions)
    .where(and(eq(sessions.userId, userId), gt(sessions.expiresAt, new Date())));
  return rows.length;
}
