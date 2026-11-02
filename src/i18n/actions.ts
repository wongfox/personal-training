"use server";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getSession } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { profiles } from "@/server/db/schema";
import { isLocale, LOCALE_COOKIE } from "./config";

/** Switches the language: remembered in a cookie (public pages) and on the profile (everywhere). */
export async function setLocaleAction(locale: string): Promise<void> {
  if (!isLocale(locale)) return;
  (await cookies()).set(LOCALE_COOKIE, locale, {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
  });
  const session = await getSession();
  if (session) await getDb().update(profiles).set({ locale }).where(eq(profiles.userId, session.user.id));
  revalidatePath("/", "layout");
}
