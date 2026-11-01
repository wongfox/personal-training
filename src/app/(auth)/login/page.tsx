import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/current-user";
import { googleEnabled } from "@/server/auth/google";
import { LoginForm } from "../auth-forms";
import { GoogleButton } from "../google-button";

export const metadata: Metadata = { title: "Sign in" };

const ERRORS: Record<string, string> = {
  google_unavailable: "Google sign-in isn't configured on this server yet. Use email and password.",
  google_failed: "Google sign-in didn't complete. Please try again.",
  suspended: "This account is suspended. Contact support.",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  if (await getCurrentUser()) redirect("/home");
  const { error, verified } = await searchParams;
  const notice = typeof error === "string" ? ERRORS[error] : verified === "1" ? "Email confirmed. Sign in to continue." : undefined;

  return (
    <>
      <h1 className="font-display text-[40px] leading-[1.02]">Welcome back.</h1>
      <p className="mt-2 text-[15px] text-ink-2">Pick up where you left off.</p>
      <div className="mt-8 space-y-6">
        {googleEnabled() && <GoogleButton label="Continue with Google" />}
        {googleEnabled() && <OrDivider />}
        <LoginForm notice={notice} />
      </div>
      <p className="mt-auto pt-10 text-center text-[15px] text-ink-2">
        New here?{" "}
        <Link href="/register" className="font-medium text-ink underline underline-offset-4">
          Create an account
        </Link>
      </p>
    </>
  );
}

function OrDivider() {
  return (
    <div className="flex items-center gap-3 text-[12px] uppercase tracking-[0.14em] text-muted">
      <span className="h-px flex-1 bg-line" />
      or
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
