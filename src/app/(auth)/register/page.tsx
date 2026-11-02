import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/primitives";
import { getTranslator } from "@/i18n/server";
import { getCurrentUser } from "@/server/auth/current-user";
import { googleEnabled } from "@/server/auth/google";
import { AuthFooter, AuthHero, OrDivider } from "../auth-hero";
import { RegisterForm } from "../auth-forms";
import { GoogleButton } from "../google-button";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("auth.register.metaTitle") };
}

export default async function RegisterPage() {
  if (await getCurrentUser()) redirect("/home");
  const { t } = await getTranslator();
  return (
    <>
      <AuthHero title={t("auth.register.title")} body={t("auth.register.body")} />
      <Card className="mt-6 space-y-5 p-6">
        {googleEnabled() && (
          <>
            <GoogleButton label={t("auth.register.google")} />
            <OrDivider label={t("auth.or")} />
          </>
        )}
        <RegisterForm />
      </Card>
      <AuthFooter>
        {t("auth.register.already")}{" "}
        <Link href="/login" className="font-medium text-ink underline underline-offset-4">
          {t("auth.register.signIn")}
        </Link>
      </AuthFooter>
    </>
  );
}
