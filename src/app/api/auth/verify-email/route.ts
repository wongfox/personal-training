import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getSession } from "@/server/auth/current-user";
import { invalidateUserSessions } from "@/server/auth/sessions";
import { getDb } from "@/server/db";
import { users } from "@/server/db/schema";
import { sameOrigin } from "@/server/http";
import { audit } from "@/server/platform";
import { verifyEmail } from "@/server/services/accounts";

/**
 * Email confirmation link target. Single-use, expiring token; never reveals
 * why it failed.
 *
 * Whoever clicks the link proves they own the mailbox — not that they own
 * the account's sessions or password. So unless the click comes from the
 * account's own signed-in session, every other session is closed; and if the
 * verification grants an admin role, the (unproven) password is cleared too,
 * forcing the mailbox owner through password reset.
 */
/** Old-style links (GET) only open the confirmation page — GET never changes state. */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  return NextResponse.redirect(new URL(`/verify-email?token=${encodeURIComponent(token)}`, request.url), 303);
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Cross-origin request blocked." }, { status: 403 });
  const form = await request.formData();
  const raw = form.get("token");
  const token = typeof raw === "string" ? raw : "";
  if (token.length < 20 || token.length > 128) return NextResponse.redirect(new URL("/settings?verified=invalid", request.url), 303);
  const db = getDb();
  const session = await getSession();
  const result = await db.transaction((tx) => verifyEmail(tx, token));
  if (!result) return NextResponse.redirect(new URL("/settings?verified=invalid", request.url), 303);

  const sameUser = session?.user.id === result.userId;
  if (!sameUser) await invalidateUserSessions(db, result.userId);
  if (result.bootstrapped && !sameUser) {
    await db.update(users).set({ passwordHash: null }).where(eq(users.id, result.userId));
    await invalidateUserSessions(db, result.userId);
  }
  await audit(db, { actorId: result.userId, action: "auth.email_verified", entityType: "user", entityId: result.userId, metadata: { bootstrapped: result.bootstrapped, sameUser } });

  if (result.bootstrapped && !sameUser) return NextResponse.redirect(new URL("/forgot-password?admin=1", request.url), 303);
  return NextResponse.redirect(new URL(sameUser ? "/settings?verified=1" : "/login?verified=1", request.url), 303);
}
