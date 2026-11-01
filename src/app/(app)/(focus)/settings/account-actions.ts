"use server";

import { redirect } from "next/navigation";
import { deleteSessionCookie, getRequestMeta, getSession } from "@/server/auth/current-user";
import { rateLimit } from "@/server/auth/rate-limit";
import { getDb } from "@/server/db";
import { audit } from "@/server/platform";
import { changePassword, deleteAccount } from "@/server/services/accounts";
import { passwordSchema } from "@/server/validation";

export interface AccountState {
  error?: string;
  ok?: string;
}

export async function changePasswordAction(_prev: AccountState, fd: FormData): Promise<AccountState> {
  const session = await getSession();
  if (!session) redirect("/login");
  const current = String(fd.get("current") ?? "");
  const parsed = passwordSchema.safeParse(String(fd.get("next") ?? ""));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const db = getDb();
  const limit = await rateLimit(db, `change-password:${session.user.id}`, 5, 3600);
  if (!limit.allowed) return { error: "Too many attempts. Try again later." };
  const result = await changePassword(db, session.user.id, current, parsed.data, session.sessionId);
  if (!result.ok) return { error: result.error };
  const { ipAddress } = await getRequestMeta();
  await audit(db, { actorId: session.user.id, action: "auth.password_change", entityType: "user", entityId: session.user.id, ipAddress });
  return { ok: "Password updated. Other devices were signed out." };
}

export async function deleteAccountAction(_prev: AccountState, fd: FormData): Promise<AccountState> {
  const session = await getSession();
  if (!session) redirect("/login");
  if (String(fd.get("confirm") ?? "").trim() !== "DELETE") return { error: "Type DELETE to confirm." };
  const db = getDb();
  const { ipAddress } = await getRequestMeta();
  const result = await deleteAccount(db, session.user.id);
  if (!result.ok) return { error: result.error };
  await audit(db, { actorId: null, action: "user.delete_self", entityType: "user", entityId: session.user.id, ipAddress });
  await deleteSessionCookie();
  redirect("/");
}
