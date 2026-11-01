import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/field";

export const metadata: Metadata = { title: "Confirm your email" };

/**
 * The emailed link opens this page; confirming takes an explicit POST, so mail
 * scanners that prefetch links can't consume the token (or sign anyone out).
 * It deliberately lives outside the sign-in route group: opening it must not
 * clear a signed-in learner's unsynced offline progress.
 */
export default async function VerifyEmailPage({ searchParams }: PageProps<"/verify-email">) {
  const { token, state } = await searchParams;
  const valid = typeof token === "string" && token.length >= 20 && token.length <= 128;
  const invalid = state === "invalid" || !valid;
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[440px] flex-col px-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-8">
      <header className="py-4">
        <Link href="/" aria-label="Personal Growth OS home">
          <Wordmark />
        </Link>
      </header>
      <main className="flex flex-1 flex-col justify-center pb-24 animate-rise">
        <h1 className="font-display text-[40px] leading-[1.02]">{invalid ? "This link has expired." : "Confirm your email."}</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
          {invalid
            ? "Confirmation links work once and last three days. Sign in and request a fresh one from Settings."
            : "One tap to confirm this address belongs to you. It keeps your account — and your progress — recoverable."}
        </p>
        <div className="mt-8 space-y-3">
          {invalid ? (
            <FormAlert>Request a new confirmation link from Settings → Resend link.</FormAlert>
          ) : (
            <form method="post" action="/api/auth/verify-email">
              <input type="hidden" name="token" value={token} />
              <Button type="submit">Confirm my email</Button>
            </form>
          )}
          <Link href="/home" className="block py-2 text-center text-[15px] text-ink-2 underline-offset-4 hover:underline">
            Back to the app
          </Link>
        </div>
      </main>
    </div>
  );
}
