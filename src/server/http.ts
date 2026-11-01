import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";
import { localDate } from "@/lib/dates";
import { getSession } from "@/server/auth/current-user";
import { rateLimit } from "@/server/auth/rate-limit";
import type { SessionUser } from "@/server/auth/sessions";
import { getDb } from "@/server/db";
import { AppError, RateLimitError } from "@/server/errors";

export interface ApiContext {
  user: SessionUser;
  today: string;
  request: Request;
}

/**
 * Cookie-authenticated writes must come from our own origin (CSRF defence in
 * depth on top of SameSite=Lax). Bearer-token clients (native apps) are not
 * exposed to CSRF and skip the check.
 */
export function sameOrigin(request: Request): boolean {
  if (request.headers.get("authorization")?.startsWith("Bearer ")) return true;
  const origin = request.headers.get("origin");
  if (!origin) return request.headers.get("sec-fetch-site") === "same-origin";
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function apiError(status: number, error: string) {
  return NextResponse.json({ error }, { status });
}

/**
 * Wraps a route handler: session (cookie or bearer), onboarding gate, CSRF,
 * optional per-user rate limit, and consistent JSON errors.
 */
export function apiHandler<P>(
  handler: (ctx: ApiContext, params: P) => Promise<unknown>,
  opts: { rateLimit?: { key: string; limit: number; windowSeconds: number } } = {},
) {
  return async (request: Request, segment: { params: Promise<P> }) => {
    try {
      if (request.method !== "GET" && !sameOrigin(request)) return apiError(403, "Cross-origin request blocked.");
      const session = await getSession();
      if (!session) return apiError(401, "Sign in to continue.");
      if (!session.user.onboarded) return apiError(403, "Finish onboarding first.");
      if (opts.rateLimit) {
        const r = await rateLimit(getDb(), `${opts.rateLimit.key}:${session.user.id}`, opts.rateLimit.limit, opts.rateLimit.windowSeconds);
        if (!r.allowed) throw new RateLimitError();
      }
      const ctx: ApiContext = { user: session.user, today: localDate(session.user.timezone), request };
      const result = await handler(ctx, await segment.params);
      return NextResponse.json(result ?? { ok: true });
    } catch (error) {
      if (error instanceof AppError) return apiError(error.status, error.message);
      if (error instanceof z.ZodError) return apiError(400, error.issues[0]?.message ?? "Invalid request.");
      if (error instanceof SyntaxError) return apiError(400, "Invalid JSON.");
      console.error("[api]", error);
      return apiError(500, "Something went wrong on our side.");
    }
  };
}

export async function readJson<T extends z.ZodType>(request: Request, schema: T): Promise<z.infer<T>> {
  const text = await request.text();
  if (text.length > 64_000) throw new AppError("Request too large.", 413, "too_large");
  return schema.parse(text ? JSON.parse(text) : {});
}
