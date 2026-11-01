import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "../auth-forms";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="font-display text-[40px] leading-[1.02]">Reset your password.</h1>
      <p className="mt-2 text-[15px] text-ink-2">We&apos;ll email you a link to choose a new one.</p>
      <div className="mt-8">
        <ForgotPasswordForm />
      </div>
      <p className="mt-auto pt-10 text-center text-[15px] text-ink-2">
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-ink underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </>
  );
}
