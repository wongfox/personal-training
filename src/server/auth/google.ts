import "server-only";
import { Google } from "arctic";
import { appUrl } from "@/server/platform";

export function googleEnabled(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function googleClient(): Google {
  if (!googleEnabled()) throw new Error("Google sign-in is not configured.");
  return new Google(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    appUrl("/api/auth/google/callback"),
  );
}

export const GOOGLE_STATE_COOKIE = "pgos_oauth_state";
export const GOOGLE_VERIFIER_COOKIE = "pgos_oauth_verifier";
