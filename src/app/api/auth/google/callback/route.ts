import { decodeIdToken } from "arctic";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getRequestMeta, setSessionCookie } from "@/server/auth/current-user";
import { GOOGLE_STATE_COOKIE, GOOGLE_VERIFIER_COOKIE, googleClient, googleEnabled } from "@/server/auth/google";
import { createSession } from "@/server/auth/sessions";
import { getDb } from "@/server/db";
import { audit } from "@/server/platform";
import { upsertGoogleUser } from "@/server/services/accounts";

interface GoogleClaims {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

export async function GET(request: Request) {
  const fail = (code: string) => NextResponse.redirect(new URL(`/login?error=${code}`, request.url));
  if (!googleEnabled()) return fail("google_unavailable");

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const jar = await cookies();
  const storedState = jar.get(GOOGLE_STATE_COOKIE)?.value;
  const verifier = jar.get(GOOGLE_VERIFIER_COOKIE)?.value;
  jar.delete(GOOGLE_STATE_COOKIE);
  jar.delete(GOOGLE_VERIFIER_COOKIE);

  if (!code || !state || !storedState || !verifier || state !== storedState) return fail("google_failed");

  let claims: GoogleClaims;
  try {
    const tokens = await googleClient().validateAuthorizationCode(code, verifier);
    // The ID token comes straight from Google's token endpoint over TLS, so
    // OIDC permits using its claims without re-verifying the signature.
    claims = decodeIdToken(tokens.idToken()) as GoogleClaims;
  } catch {
    return fail("google_failed");
  }
  if (!claims.email) return fail("google_failed");

  const db = getDb();
  const result = await upsertGoogleUser(db, {
    sub: claims.sub,
    email: claims.email,
    emailVerified: claims.email_verified === true,
    name: claims.name ?? "",
    picture: claims.picture,
  });
  if (!result.ok) return fail(result.error === "suspended" ? "suspended" : "google_failed");

  const meta = await getRequestMeta();
  const session = await createSession(db, result.userId, meta);
  await setSessionCookie(session.token, session.expiresAt);
  await audit(db, { actorId: result.userId, action: "auth.login", entityType: "user", entityId: result.userId, metadata: { method: "google" }, ipAddress: meta.ipAddress });
  return NextResponse.redirect(new URL("/home", request.url));
}
