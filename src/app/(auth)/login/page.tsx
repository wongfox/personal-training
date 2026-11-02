import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/primitives";
import { getTranslator } from "@/i18n/server";
import { getCurrentUser } from "@/server/auth/current-user";
import { googleEnabled } from "@/server/auth/google";
import { AuthFooter, AuthHero, OrDivider } from "../auth-hero";
import { LoginForm } from "../auth-forms";
import { GoogleButton } from "../google-button";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("auth.login.metaTitle") };
}

const NOTICES = new Set(["google_unavailable", "google_failed", "suspended"]);

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  if (await getCurrentUser()) redirect("/home");
  const { t } = await getTranslator();
  const { error, verified } = await searchParams;
  const notice =
    typeof error === "string" && NOTICES.has(error)
      ? t(`auth.login.notices.${error}`)
      : verified === "1"
        ? t("auth.login.verified")
        : undefined;

  return (
    <>
      <AuthHero title={t("auth.login.title")} body={t("auth.login.body")} />
      <Card className="mt-6 space-y-5 p-6">
        {googleEnabled() && <GoogleButton label={t("auth.login.google")} />}
        {googleEnabled() && <OrDivider label={t("auth.or")} />}
        <LoginForm notice={notice} />
      </Card>
      <AuthFooter>
        {t("auth.login.newHere")}{" "}
        <Link href="/register" className="font-medium text-ink underline underline-offset-4">
          {t("auth.login.createAccount")}
        </Link>
      </AuthFooter>
    </>
  );
}
