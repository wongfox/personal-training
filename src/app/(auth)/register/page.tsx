import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/current-user";
import { googleEnabled } from "@/server/auth/google";
import { RegisterForm } from "../auth-forms";
import { GoogleButton } from "../google-button";

export const metadata: Metadata = { title: "Create your account" };

export default async function RegisterPage() {
  if (await getCurrentUser()) redirect("/home");
  return (
    <>
      <h1 className="font-display text-[40px] leading-[1.02]">Start training.</h1>
      <p className="mt-2 text-[15px] text-ink-2">
        Three minutes of questions, then a 90-day plan built around you.
      </p>
      <div className="mt-8 space-y-6">
        {googleEnabled() && (
          <>
            <GoogleButton label="Sign up with Google" />
            <div className="flex items-center gap-3 text-[12px] uppercase tracking-[0.14em] text-muted">
              <span className="h-px flex-1 bg-line" />
              or
              <span className="h-px flex-1 bg-line" />
            </div>
          </>
        )}
        <RegisterForm />
      </div>
      <p className="mt-auto pt-10 text-center text-[15px] text-ink-2">
        Already training?{" "}
        <Link href="/login" className="font-medium text-ink underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </>
  );
}
