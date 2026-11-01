import { NextResponse } from "next/server";
import { getDb } from "@/server/db";
import { audit } from "@/server/platform";
import { verifyEmail } from "@/server/services/accounts";

/** Email confirmation link target. Single-use, expiring token; never reveals why it failed. */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  if (token.length < 20 || token.length > 128) return NextResponse.redirect(new URL("/settings?verified=invalid", request.url));
  const db = getDb();
  const userId = await db.transaction((tx) => verifyEmail(tx, token));
  if (!userId) return NextResponse.redirect(new URL("/settings?verified=invalid", request.url));
  await audit(db, { actorId: userId, action: "auth.email_verified", entityType: "user", entityId: userId });
  return NextResponse.redirect(new URL("/settings?verified=1", request.url));
}
