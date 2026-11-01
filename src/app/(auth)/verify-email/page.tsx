import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/field";

export const metadata: Metadata = { title: "Confirm your email" };

/**
 * The emailed link opens this page; confirming takes an explicit POST, so mail
 * scanners that prefetch links can't consume the token (or sign anyone out).
 */
export default async function VerifyEmailPage({ searchParams }: PageProps<"/verify-email">) {
  const { token } = await searchParams;
  const valid = typeof token === "string" && token.length >= 20 && token.length <= 128;
  return (
    <>
      <h1 className="font-display text-[40px] leading-[1.02]">Confirm your email.</h1>
      <p className="mt-2 text-[15px] text-ink-2">One tap and your account is verified.</p>
      <div className="mt-8">
        {valid ? (
          <form method="post" action="/api/auth/verify-email">
            <input type="hidden" name="token" value={token} />
            <Button type="submit">Confirm my email</Button>
          </form>
        ) : (
          <FormAlert>This confirmation link is incomplete. Request a new one from Settings.</FormAlert>
        )}
      </div>
    </>
  );
}
