import { and, eq, gt, isNull, sql } from "drizzle-orm";
import type { Executor } from "@/server/db";
import { invalidateUserSessions } from "@/server/auth/sessions";
import {
  emailVerificationTokens,
  oauthAccounts,
  passwordResetTokens,
  profiles,
  roles,
  streaks,
  userRoles,
  userSettings,
  users,
} from "@/server/db/schema";
import { generateToken, getDummyHash, hashPassword, sha256, verifyPassword } from "@/server/auth/crypto";
import { ROLE_INFO, type RoleKey } from "@/server/auth/rbac";
import { isValidTimeZone } from "@/lib/dates";

const RESET_TTL_MS = 60 * 60 * 1000;

export async function ensureRole(db: Executor, key: RoleKey): Promise<string> {
  await db
    .insert(roles)
    .values({ key, name: ROLE_INFO[key].name, description: ROLE_INFO[key].description })
    .onConflictDoNothing({ target: roles.key });
  const [row] = await db.select({ id: roles.id }).from(roles).where(eq(roles.key, key));
  return row.id;
}

export async function grantRole(db: Executor, userId: string, key: RoleKey, grantedBy?: string): Promise<void> {
  const roleId = await ensureRole(db, key);
  await db.insert(userRoles).values({ userId, roleId, grantedBy: grantedBy ?? null }).onConflictDoNothing();
}

export async function revokeRole(db: Executor, userId: string, key: RoleKey): Promise<void> {
  const [role] = await db.select({ id: roles.id }).from(roles).where(eq(roles.key, key));
  if (!role) return;
  await db.delete(userRoles).where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, role.id)));
}

function superAdminEmails(): string[] {
  return (process.env.SUPER_ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * SUPER_ADMIN_EMAILS only takes effect once the address is proven to belong to
 * the account holder (email link or a Google-verified address) — otherwise
 * anyone could claim admin by registering that email first.
 */
async function applyBootstrapRoles(db: Executor, userId: string, email: string): Promise<boolean> {
  if (!superAdminEmails().includes(email.toLowerCase())) return false;
  await grantRole(db, userId, "SUPER_ADMIN");
  return true;
}

/** Profile, settings, streak row and base role for a brand-new account. */
async function scaffoldUser(db: Executor, userId: string, name: string, timezone?: string) {
  const tz = timezone && isValidTimeZone(timezone) ? timezone : "UTC";
  await db.insert(profiles).values({ userId, displayName: name, timezone: tz }).onConflictDoNothing();
  await db.insert(userSettings).values({ userId }).onConflictDoNothing();
  await db.insert(streaks).values({ userId }).onConflictDoNothing();
  await grantRole(db, userId, "USER");
}

const VERIFY_TTL_MS = 3 * 24 * 60 * 60 * 1000;

export async function createEmailVerification(db: Executor, userId: string): Promise<string> {
  const token = generateToken();
  await db.insert(emailVerificationTokens).values({ id: sha256(token), userId, expiresAt: new Date(Date.now() + VERIFY_TTL_MS) });
  return token;
}

/** Marks the email as verified (single-use token) and applies bootstrap roles. Returns the user id. */
export async function verifyEmail(db: Executor, token: string): Promise<{ userId: string; bootstrapped: boolean } | null> {
  const [row] = await db
    .select()
    .from(emailVerificationTokens)
    .where(and(eq(emailVerificationTokens.id, sha256(token)), isNull(emailVerificationTokens.usedAt), gt(emailVerificationTokens.expiresAt, new Date())));
  if (!row) return null;
  const [user] = await db.update(users).set({ emailVerifiedAt: new Date() }).where(eq(users.id, row.userId)).returning({ id: users.id, email: users.email });
  await db.update(emailVerificationTokens).set({ usedAt: new Date() }).where(and(eq(emailVerificationTokens.userId, row.userId), isNull(emailVerificationTokens.usedAt)));
  const bootstrapped = user ? await applyBootstrapRoles(db, user.id, user.email) : false;
  return { userId: row.userId, bootstrapped };
}

/** Operator bootstrap (CLI): a verified account with the given role. */
export async function createVerifiedUser(db: Executor, input: { name: string; email: string; password: string; role?: RoleKey }) {
  const existing = await findUserByEmail(db, input.email);
  const userId =
    existing?.id ??
    (
      await db
        .insert(users)
        .values({ email: input.email.toLowerCase(), name: input.name, passwordHash: await hashPassword(input.password), emailVerifiedAt: new Date() })
        .returning({ id: users.id })
    )[0].id;
  if (!existing) await scaffoldUser(db, userId, input.name);
  if (input.role) await grantRole(db, userId, input.role);
  return userId;
}

export async function findUserByEmail(db: Executor, email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(sql`lower(${users.email}) = ${email.toLowerCase()}`)
    .limit(1);
  return user ?? null;
}

export type RegisterResult = { ok: true; userId: string } | { ok: false; error: "email_taken" };

export async function registerUser(
  db: Executor,
  input: { name: string; email: string; password: string; timezone?: string },
): Promise<RegisterResult> {
  if (await findUserByEmail(db, input.email)) return { ok: false, error: "email_taken" };
  const passwordHash = await hashPassword(input.password);
  const [user] = await db
    .insert(users)
    .values({ email: input.email.toLowerCase(), name: input.name, passwordHash })
    .onConflictDoNothing()
    .returning({ id: users.id });
  if (!user) return { ok: false, error: "email_taken" };
  await scaffoldUser(db, user.id, input.name, input.timezone);
  return { ok: true, userId: user.id };
}

export type AuthResult =
  | { ok: true; userId: string }
  | { ok: false; error: "invalid_credentials" | "suspended" };

export async function authenticate(db: Executor, email: string, password: string): Promise<AuthResult> {
  const user = await findUserByEmail(db, email);
  if (!user?.passwordHash) {
    await verifyPassword(password, await getDummyHash()); // equalise timing
    return { ok: false, error: "invalid_credentials" };
  }
  if (!(await verifyPassword(password, user.passwordHash))) return { ok: false, error: "invalid_credentials" };
  if (user.status !== "active") return { ok: false, error: "suspended" };
  await db.update(users).set({ lastSeenAt: new Date() }).where(eq(users.id, user.id));
  return { ok: true, userId: user.id };
}

export interface GoogleProfile {
  sub: string;
  email: string;
  emailVerified: boolean;
  name: string;
  picture?: string;
}

/**
 * Signs in with Google. Links to an existing account only when Google
 * asserts the email is verified, so an unverified Google address can't take
 * over a password account.
 */
export async function upsertGoogleUser(
  db: Executor,
  profile: GoogleProfile,
  timezone?: string,
): Promise<AuthResult> {
  const [linked] = await db
    .select({ userId: oauthAccounts.userId, status: users.status })
    .from(oauthAccounts)
    .innerJoin(users, eq(users.id, oauthAccounts.userId))
    .where(and(eq(oauthAccounts.provider, "google"), eq(oauthAccounts.providerAccountId, profile.sub)));
  if (linked) {
    if (linked.status !== "active") return { ok: false, error: "suspended" };
    return { ok: true, userId: linked.userId };
  }
  if (!profile.emailVerified) return { ok: false, error: "invalid_credentials" };

  const existing = await findUserByEmail(db, profile.email);
  if (existing) {
    if (existing.status !== "active") return { ok: false, error: "suspended" };
    await db.insert(oauthAccounts).values({ userId: existing.id, provider: "google", providerAccountId: profile.sub });
    if (!existing.emailVerifiedAt) {
      // The address was never proven by the password account, so whoever set
      // that password may not own the mailbox: Google's verified owner wins,
      // the unproven password is dropped and its sessions are closed.
      await db.update(users).set({ emailVerifiedAt: new Date(), passwordHash: null }).where(eq(users.id, existing.id));
      await invalidateUserSessions(db, existing.id);
    }
    await applyBootstrapRoles(db, existing.id, existing.email);
    return { ok: true, userId: existing.id };
  }

  const [user] = await db
    .insert(users)
    .values({
      email: profile.email.toLowerCase(),
      name: profile.name || profile.email.split("@")[0],
      avatarUrl: profile.picture ?? null,
      emailVerifiedAt: new Date(),
    })
    .returning({ id: users.id });
  await db.insert(oauthAccounts).values({ userId: user.id, provider: "google", providerAccountId: profile.sub });
  await scaffoldUser(db, user.id, profile.name, timezone);
  await applyBootstrapRoles(db, user.id, profile.email);
  return { ok: true, userId: user.id };
}

export async function changePassword(
  db: Executor,
  userId: string,
  current: string,
  next: string,
  keepSessionId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) return { ok: false, error: "Account not found." };
  // Google-only accounts have no password yet and may set one.
  if (user.passwordHash && !(await verifyPassword(current, user.passwordHash))) return { ok: false, error: "Your current password is incorrect." };
  await db.update(users).set({ passwordHash: await hashPassword(next) }).where(eq(users.id, userId));
  await invalidateUserSessions(db, userId, keepSessionId);
  return { ok: true };
}

/** Permanently deletes an account and everything it owns (cascades). */
export async function deleteAccount(db: Executor, userId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const [isSuper] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(userRoles)
    .innerJoin(roles, eq(roles.id, userRoles.roleId))
    .where(and(eq(userRoles.userId, userId), eq(roles.key, "SUPER_ADMIN")));
  if (Number(isSuper?.n) > 0) {
    const [others] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(userRoles)
      .innerJoin(roles, eq(roles.id, userRoles.roleId))
      .where(and(eq(roles.key, "SUPER_ADMIN"), sql`${userRoles.userId} <> ${userId}`));
    if (Number(others?.n) === 0) return { ok: false, error: "You're the only super admin. Grant the role to someone else first." };
  }
  await db.delete(users).where(eq(users.id, userId));
  return { ok: true };
}

/** Returns a raw token to email, or null when the account doesn't exist (caller must not reveal which). */
export async function createPasswordReset(db: Executor, email: string): Promise<{ token: string; name: string } | null> {
  const user = await findUserByEmail(db, email);
  if (!user || user.status !== "active") return null;
  const token = generateToken();
  await db.insert(passwordResetTokens).values({
    id: sha256(token),
    userId: user.id,
    expiresAt: new Date(Date.now() + RESET_TTL_MS),
  });
  return { token, name: user.name };
}

export async function resetPassword(db: Executor, token: string, newPassword: string): Promise<string | null> {
  const id = sha256(token);
  const [row] = await db
    .select()
    .from(passwordResetTokens)
    .where(and(eq(passwordResetTokens.id, id), isNull(passwordResetTokens.usedAt), gt(passwordResetTokens.expiresAt, new Date())));
  if (!row) return null;
  const passwordHash = await hashPassword(newPassword);
  await db.update(users).set({ passwordHash }).where(eq(users.id, row.userId));
  // Burn every outstanding reset token for the account, not just this one.
  await db
    .update(passwordResetTokens)
    .set({ usedAt: new Date() })
    .where(and(eq(passwordResetTokens.userId, row.userId), isNull(passwordResetTokens.usedAt)));
  return row.userId;
}
