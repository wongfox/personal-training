import { type NextRequest, NextResponse } from "next/server";

/**
 * Optimistic gate only: bounces requests without a session cookie away from
 * app screens before any rendering work. Real validation (expiry, status,
 * roles) happens in the data access layer on every request.
 */
const COOKIE = process.env.NODE_ENV === "production" ? "__Host-pgos_session" : "pgos_session";
const PROTECTED = ["/home", "/journey", "/practice", "/explore", "/profile", "/lesson", "/mission", "/review", "/checkpoint", "/coach", "/settings", "/onboarding", "/admin"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(COOKIE);
  if (!hasSession && PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icons|sw.js|manifest.webmanifest|offline).*)"],
};
