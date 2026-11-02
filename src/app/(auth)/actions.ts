"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getTranslator } from "@/i18n/server";
import type { TFunction } from "@/i18n/translate";
import {
  deleteSessionCookie,
  getRequestMeta,
  getSession,
  setSessionCookie,
} from "@/server/auth/current-user";
import { rateLimit } from "@/server/auth/rate-limit";
import { can } from "@/server/auth/rbac";
import { createSession, invalidateSession, invalidateUserSessions, validateSessionToken } from "@/server/auth/sessions";
import { getDb } from "@/server/db";
import { profiles } from "@/server/db/schema";
import { appUrl, audit, sendEmail, track } from "@/server/platform";
import { authenticate, createEmailVerification, createPasswordReset, registerUser, resetPassword } from "@/server/services/accounts";
import {
  fieldErrors,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/server/validation";

export interface FormState {
  error?: string;
  fields?: Record<string, string>;
  success?: string;
  values?: Record<string, string>;
}

function value(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  // Resolve the visitor's language before a session exists: afterwards it would read the new profile's default.
  const { t, locale } = await getTranslator();
  const raw = {
    name: value(formData, "name"),
    email: value(formData, "email"),
    password: value(formData, "password"),
    timezone: value(formData, "timezone") || undefined,
  };
  const keep = { name: raw.name, email: raw.email };
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) return { fields: fieldErrors(parsed.error), values: keep };

  const db = getDb();
  const meta = await getRequestMeta();
  const limit = await rateLimit(db, `register:${meta.ipAddress ?? "unknown"}`, 5, 3600);
  if (!limit.allowed) return { error: t("auth.errors.tooManySignups"), values: keep };

  const result = await registerUser(db, parsed.data);
  if (!result.ok) return { fields: { email: t("auth.errors.emailTaken") }, values: keep };
  // Keep the language the visitor picked before signing up.
  await db.update(profiles).set({ locale }).where(eq(profiles.userId, result.userId));

  const session = await createSession(db, result.userId, meta);
  await setSessionCookie(session.token, session.expiresAt);
  await audit(db, { actorId: result.userId, action: "auth.register", entityType: "user", entityId: result.userId, ipAddress: meta.ipAddress });
  await track(db, result.userId, "onboarding_started");
  await sendVerificationEmail(t, result.userId, parsed.data.email, parsed.data.name);
  redirect("/onboarding");
}

async function sendVerificationEmail(t: TFunction, userId: string, email: string, name: string) {
  const token = await createEmailVerification(getDb(), userId);
  await sendEmail({
    to: email,
    subject: t("auth.email.verifySubject"),
    text: t("auth.email.verifyBody", { name, link: appUrl(`/verify-email?token=${encodeURIComponent(token)}`) }),
  });
}

export async function resendVerificationAction(): Promise<{ ok?: string; error?: string }> {
  const { t } = await getTranslator();
  const session = await getSession();
  if (!session) return { error: t("auth.errors.signInFirst") };
  const db = getDb();
  const limit = await rateLimit(db, `verify-resend:${session.user.id}`, 3, 3600);
  if (!limit.allowed) return { error: t("auth.errors.resendLimit") };
  await sendVerificationEmail(t, session.user.id, session.user.email, session.user.name);
  return { ok: t("auth.errors.resendSent") };
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { t } = await getTranslator();
  const raw = { email: value(formData, "email"), password: value(formData, "password") };
  const keep = { email: raw.email };
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) return { fields: fieldErrors(parsed.error), values: keep };

  const db = getDb();
  const meta = await getRequestMeta();
  const [byIp, byAccount, accountCeiling] = await Promise.all([
    rateLimit(db, `login-ip:${meta.ipAddress ?? "unknown"}`, 30, 900),
    // Per account *and* network: a stranger hammering your email can't lock you out from yours.
    rateLimit(db, `login:${parsed.data.email}:${meta.ipAddress ?? "unknown"}`, 8, 900),
    // IP-independent ceiling per account: rotating addresses can't buy unlimited guesses.
    rateLimit(db, `login-account:${parsed.data.email}`, 25, 900),
  ]);
  if (!byIp.allowed || !byAccount.allowed || !accountCeiling.allowed) {
    await audit(db, { actorId: null, action: "auth.login_locked", entityType: "user", metadata: { email: parsed.data.email }, ipAddress: meta.ipAddress });
    const minutes = Math.ceil(Math.max(byIp.retryAfterSeconds, byAccount.retryAfterSeconds, accountCeiling.retryAfterSeconds) / 60);
    return { error: t("auth.errors.tooManyAttemptsIn", { count: minutes }), values: keep };
  }

  const result = await authenticate(db, parsed.data.email, parsed.data.password);
  if (!result.ok) {
    await audit(db, { actorId: null, action: "auth.login_failed", entityType: "user", metadata: { email: parsed.data.email, reason: result.error }, ipAddress: meta.ipAddress });
    return {
      error: result.error === "suspended" ? t("auth.errors.suspended") : t("auth.errors.invalidCredentials"),
      values: keep,
    };
  }

  const session = await createSession(db, result.userId, meta);
  await setSessionCookie(session.token, session.expiresAt);
  await audit(db, { actorId: result.userId, action: "auth.login", entityType: "user", entityId: result.userId, metadata: { method: "password" }, ipAddress: meta.ipAddress });
  // Staff who never trained (e.g. an operator-created admin) land in the back office, not onboarding.
  const signedIn = await validateSessionToken(db, session.token);
  if (signedIn && !signedIn.user.onboarded && can(signedIn.user.roles, "admin:access")) redirect("/admin");
  redirect("/home");
}

export async function logoutAction(): Promise<void> {
  const session = await getSession();
  if (session) await invalidateSession(getDb(), session.sessionId);
  await deleteSessionCookie();
  redirect("/login");
}

export async function forgotPasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { t } = await getTranslator();
  const parsed = forgotPasswordSchema.safeParse({ email: value(formData, "email") });
  if (!parsed.success) return { fields: fieldErrors(parsed.error) };

  const sent = t("auth.forgot.sent");
  const db = getDb();
  const meta = await getRequestMeta();
  const [byIp, byAccount] = await Promise.all([
    rateLimit(db, `forgot-ip:${meta.ipAddress ?? "unknown"}`, 10, 3600),
    rateLimit(db, `forgot:${parsed.data.email}`, 3, 3600),
  ]);
  // Same response either way so the endpoint can't be used to probe accounts.
  if (!byIp.allowed || !byAccount.allowed) return { success: sent };

  const reset = await createPasswordReset(db, parsed.data.email);
  if (reset) {
    const link = appUrl(`/reset-password?token=${encodeURIComponent(reset.token)}`);
    await sendEmail({
      to: parsed.data.email,
      subject: t("auth.email.resetSubject"),
      text: t("auth.email.resetBody", { name: reset.name, link }),
    });
  }
  return { success: sent };
}

export async function resetPasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const { t } = await getTranslator();
  const parsed = resetPasswordSchema.safeParse({ token: value(formData, "token"), password: value(formData, "password") });
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    if (fields.token) return { error: t("auth.errors.resetInvalid") };
    return { fields };
  }
  const db = getDb();
  const meta = await getRequestMeta();
  const limit = await rateLimit(db, `reset-ip:${meta.ipAddress ?? "unknown"}`, 10, 3600);
  if (!limit.allowed) return { error: t("auth.errors.tooManyAttempts") };

  const userId = await resetPassword(db, parsed.data.token, parsed.data.password);
  if (!userId) return { error: t("auth.errors.resetExpired") };

  await invalidateUserSessions(db, userId);
  const session = await createSession(db, userId, meta);
  await setSessionCookie(session.token, session.expiresAt);
  await audit(db, { actorId: userId, action: "auth.password_reset", entityType: "user", entityId: userId, ipAddress: meta.ipAddress });
  redirect("/home");
}
