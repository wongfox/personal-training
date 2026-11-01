import type { Metadata } from "next";
import Link from "next/link";
import { FormAlert } from "@/components/ui/field";
import { ResetPasswordForm } from "../auth-forms";

export const metadata: Metadata = { title: "Choose a new password" };

export default async function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  const { token } = await searchParams;
  const valid = typeof token === "string" && token.length >= 20;
  return (
    <>
      <h1 className="font-display text-[40px] leading-[1.02]">Choose a new password.</h1>
      <div className="mt-8">
        {valid ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="space-y-6">
            <FormAlert>This reset link is incomplete. Request a new one.</FormAlert>
            <Link href="/forgot-password" className="block text-center font-medium underline underline-offset-4">
              Request a new link
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
