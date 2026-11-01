import { eq } from "drizzle-orm";
import { beforeAll, describe, expect, it } from "vitest";
import { rateLimit } from "@/server/auth/rate-limit";
import { createSession, invalidateUserSessions, validateSessionToken } from "@/server/auth/sessions";
import type { DB } from "@/server/db";
import { sessions, users } from "@/server/db/schema";
import {
  authenticate,
  createEmailVerification,
  createPasswordReset,
  grantRole,
  registerUser,
  resetPassword,
  upsertGoogleUser,
  verifyEmail,
} from "@/server/services/accounts";
import { setupDatabase } from "./helpers";

describe("accounts and sessions", () => {
  let db: DB;
  beforeAll(async () => {
    process.env.SUPER_ADMIN_EMAILS = "boss@example.com";
    db = await setupDatabase();
  });

  it("registers, rejects duplicate emails case-insensitively and authenticates", async () => {
    const reg = await registerUser(db, { name: "Ana", email: "Ana@Example.com", password: "a long enough password" });
    expect(reg.ok).toBe(true);
    expect((await registerUser(db, { name: "Ana", email: "ana@example.com", password: "another password!" })).ok).toBe(false);
    expect((await authenticate(db, "ANA@example.com", "a long enough password")).ok).toBe(true);
    expect(await authenticate(db, "ana@example.com", "wrong password")).toEqual({ ok: false, error: "invalid_credentials" });
    expect(await authenticate(db, "nobody@example.com", "whatever")).toEqual({ ok: false, error: "invalid_credentials" });
  });

  it("stores only hashed session ids, and expires, slides and revokes sessions", async () => {
    const reg = await registerUser(db, { name: "Sam", email: "sam@example.com", password: "a long enough password" });
    if (!reg.ok) throw new Error();
    const { token } = await createSession(db, reg.userId);
    const rows = await db.select().from(sessions).where(eq(sessions.userId, reg.userId));
    expect(rows[0].id).not.toBe(token);
    const valid = await validateSessionToken(db, token);
    expect(valid?.user.email).toBe("sam@example.com");
    expect(valid?.user.roles).toContain("USER");
    expect(valid?.user.onboarded).toBe(false);
    expect(await validateSessionToken(db, "forged-token")).toBeNull();

    await db.update(sessions).set({ expiresAt: new Date(Date.now() - 1000) }).where(eq(sessions.userId, reg.userId));
    expect(await validateSessionToken(db, token)).toBeNull();

    const s2 = await createSession(db, reg.userId);
    await db.update(users).set({ status: "suspended" }).where(eq(users.id, reg.userId));
    expect(await validateSessionToken(db, s2.token)).toBeNull();
    await db.update(users).set({ status: "active" }).where(eq(users.id, reg.userId));

    const s3 = await createSession(db, reg.userId);
    await invalidateUserSessions(db, reg.userId);
    expect(await validateSessionToken(db, s3.token)).toBeNull();
  });

  it("bootstraps super admins from SUPER_ADMIN_EMAILS only after the email is verified", async () => {
    const reg = await registerUser(db, { name: "Boss", email: "boss@example.com", password: "a long enough password" });
    if (!reg.ok) throw new Error();
    const { token } = await createSession(db, reg.userId);
    expect((await validateSessionToken(db, token))?.user.roles).not.toContain("SUPER_ADMIN");
    const verification = await createEmailVerification(db, reg.userId);
    expect(await verifyEmail(db, "not-a-real-token-xxxxxxxxxxxxxxx")).toBeNull();
    expect(await verifyEmail(db, verification)).toBe(reg.userId);
    expect(await verifyEmail(db, verification)).toBeNull(); // single use
    expect((await validateSessionToken(db, token))?.user.roles).toEqual(expect.arrayContaining(["USER", "SUPER_ADMIN"]));
    await grantRole(db, reg.userId, "COACH");
    expect((await validateSessionToken(db, token))?.user.roles).toContain("COACH");
  });

  it("resets passwords with single-use, expiring tokens", async () => {
    await registerUser(db, { name: "Lu", email: "lu@example.com", password: "original password" });
    expect(await createPasswordReset(db, "missing@example.com")).toBeNull();
    const reset = await createPasswordReset(db, "lu@example.com");
    expect(reset).not.toBeNull();
    const userId = await resetPassword(db, reset!.token, "brand new password");
    expect(userId).toBeTruthy();
    expect(await resetPassword(db, reset!.token, "second attempt pass")).toBeNull();
    expect((await authenticate(db, "lu@example.com", "brand new password")).ok).toBe(true);
    expect((await authenticate(db, "lu@example.com", "original password")).ok).toBe(false);
  });

  it("links Google sign-in only for verified emails", async () => {
    await registerUser(db, { name: "Gi", email: "gi@example.com", password: "a long enough password" });
    expect((await upsertGoogleUser(db, { sub: "g-1", email: "gi@example.com", emailVerified: false, name: "Gi" })).ok).toBe(false);
    // Someone pre-registered gi@example.com with a password but never proved the address.
    const squatter = await createSession(db, (await authenticate(db, "gi@example.com", "a long enough password") as { userId: string }).userId);
    const linked = await upsertGoogleUser(db, { sub: "g-1", email: "gi@example.com", emailVerified: true, name: "Gi" });
    expect(linked.ok).toBe(true);
    // The mailbox owner (via Google) takes over: the unproven password and its sessions die.
    expect((await authenticate(db, "gi@example.com", "a long enough password")).ok).toBe(false);
    expect(await validateSessionToken(db, squatter.token)).toBeNull();
    const fresh = await upsertGoogleUser(db, { sub: "g-2", email: "new@example.com", emailVerified: true, name: "New" });
    expect(fresh.ok).toBe(true);
    const again = await upsertGoogleUser(db, { sub: "g-2", email: "new@example.com", emailVerified: true, name: "New" });
    expect(again).toEqual(fresh);
  });

  it("rate limits within a window", async () => {
    const results = [];
    for (let i = 0; i < 4; i++) results.push(await rateLimit(db, "test:key", 3, 60));
    expect(results.map((r) => r.allowed)).toEqual([true, true, true, false]);
  });
});
