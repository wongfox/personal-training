import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "../auth-forms";

export const metadata: Metadata = { title: "Reset password" };

export default async function ForgotPasswordPage({ searchParams }: PageProps<"/forgot-password">) {
  const { admin } = await searchParams;
  return (
    <>
      <h1 className="font-display text-[40px] leading-[1.02]">{admin === "1" ? "Secure your admin account." : "Reset your password."}</h1>
      <p className="mt-2 text-[15px] text-ink-2">
        {admin === "1"
          ? "Your email is confirmed and this account now has admin access. For safety, its previous password was cleared — choose a new one with the link we'll send."
          : "We'll email you a link to choose a new one."}
      </p>
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
