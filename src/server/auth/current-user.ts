import "server-only";
import { cookies, headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { getDb } from "@/server/db";
import { can, type Permission } from "./rbac";
import { type SessionUser, validateSessionToken, type ValidatedSession } from "./sessions";

export const SESSION_COOKIE = process.env.NODE_ENV === "production" ? "__Host-pgos_session" : "pgos_session";

export async function setSessionCookie(token: string, expiresAt: Date): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function deleteSessionCookie(): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Resolves the session from the cookie or, for native/mobile clients, from an
 * `Authorization: Bearer <token>` header. Memoised per request.
 */
export const getSession = cache(async (): Promise<ValidatedSession | null> => {
  const cookieToken = (await cookies()).get(SESSION_COOKIE)?.value;
  const auth = (await headers()).get("authorization");
  const bearer = auth?.startsWith("Bearer ") ? auth.slice(7).trim() : undefined;
  // An explicit bearer token wins, so the CSRF exemption for bearer requests can never ride on a cookie.
  const token = bearer ?? cookieToken;
  if (!token) return null;
  return validateSessionToken(getDb(), token);
});

export async function getCurrentUser(): Promise<SessionUser | null> {
  return (await getSession())?.user ?? null;
}

/** For app screens: signed in and onboarded, otherwise redirected to the right step. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.onboarded) redirect("/onboarding");
  return user;
}

/** Signed in, onboarding state irrelevant (onboarding screens themselves). */
export async function requireSignedIn(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/** Admin screens. Unauthorised users get a 404 so admin routes aren't discoverable. */
export async function requirePermission(permission: Permission): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!can(user.roles, permission)) notFound();
  return user;
}

/**
 * The client IP, taken only from what our own infrastructure sets — clients
 * can put anything in these headers themselves:
 *  - On Vercel (or with TRUST_PROXY=vercel), the platform overwrites x-real-ip.
 *  - Otherwise use the RIGHTMOST x-forwarded-for hop: it was appended by the
 *    proxy (or Next's server) directly in front of us, not by the client.
 */
export function clientIp(h: Headers): string | null {
  if (process.env.VERCEL || process.env.TRUST_PROXY === "vercel") {
    const real = h.get("x-real-ip")?.trim();
    if (real) return real;
  }
  const hops = (h.get("x-forwarded-for") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return hops.at(-1) ?? null;
}

export async function getRequestMeta(): Promise<{ ipAddress: string | null; userAgent: string | null }> {
  const h = await headers();
  return { ipAddress: clientIp(h), userAgent: h.get("user-agent") };
}
