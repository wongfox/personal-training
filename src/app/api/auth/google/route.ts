import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { GOOGLE_STATE_COOKIE, GOOGLE_VERIFIER_COOKIE, googleClient, googleEnabled } from "@/server/auth/google";

export async function GET(request: Request) {
  if (!googleEnabled()) {
    return NextResponse.redirect(new URL("/login?error=google_unavailable", request.url));
  }
  const state = generateState();
  const verifier = generateCodeVerifier();
  const url = googleClient().createAuthorizationURL(state, verifier, ["openid", "profile", "email"]);

  const jar = await cookies();
  const opts = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  };
  jar.set(GOOGLE_STATE_COOKIE, state, opts);
  jar.set(GOOGLE_VERIFIER_COOKIE, verifier, opts);
  return NextResponse.redirect(url);
}
