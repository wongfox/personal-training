import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/primitives";
import { getTranslator } from "@/i18n/server";
import { AuthFooter, AuthHero } from "../auth-hero";
import { ForgotPasswordForm } from "../auth-forms";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("auth.forgot.metaTitle") };
}

export default async function ForgotPasswordPage({ searchParams }: PageProps<"/forgot-password">) {
  const { admin } = await searchParams;
  const { t } = await getTranslator();
  const isAdmin = admin === "1";
  return (
    <>
      <AuthHero
        title={isAdmin ? t("auth.forgot.adminTitle") : t("auth.forgot.title")}
        body={isAdmin ? t("auth.forgot.adminBody") : t("auth.forgot.body")}
      />
      <Card className="mt-6 p-6">
        <ForgotPasswordForm />
      </Card>
      <AuthFooter>
        {t("auth.forgot.remembered")}{" "}
        <Link href="/login" className="font-medium text-ink underline underline-offset-4">
          {t("auth.forgot.signIn")}
        </Link>
      </AuthFooter>
    </>
  );
}
