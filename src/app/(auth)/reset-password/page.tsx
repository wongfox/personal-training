import type { Metadata } from "next";
import Link from "next/link";
import { FormAlert } from "@/components/ui/field";
import { Card } from "@/components/ui/primitives";
import { getTranslator } from "@/i18n/server";
import { AuthHero } from "../auth-hero";
import { ResetPasswordForm } from "../auth-forms";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("auth.reset.metaTitle") };
}

export default async function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  const { token } = await searchParams;
  const { t } = await getTranslator();
  const valid = typeof token === "string" && token.length >= 20;
  return (
    <>
      <AuthHero title={t("auth.reset.title")} body={valid ? t("auth.reset.body") : undefined} />
      <Card className="mt-6 p-6">
        {valid ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="space-y-5">
            <FormAlert>{t("auth.reset.incomplete")}</FormAlert>
            <Link href="/forgot-password" className="block text-center font-medium underline underline-offset-4">
              {t("auth.reset.requestNew")}
            </Link>
          </div>
        )}
      </Card>
    </>
  );
}
