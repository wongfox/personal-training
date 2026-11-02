import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { DawnScene } from "@/components/scene";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/field";
import { Card } from "@/components/ui/primitives";
import { getTranslator } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("auth.verify.metaTitle") };
}

/**
 * The emailed link opens this page; confirming takes an explicit POST, so mail
 * scanners that prefetch links can't consume the token (or sign anyone out).
 * It deliberately lives outside the sign-in route group: opening it must not
 * clear a signed-in learner's unsynced offline progress.
 */
export default async function VerifyEmailPage({ searchParams }: PageProps<"/verify-email">) {
  const { token, state } = await searchParams;
  const { t } = await getTranslator();
  const valid = typeof token === "string" && token.length >= 20 && token.length <= 128;
  const invalid = state === "invalid" || !valid;
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[440px] flex-col px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-8">
      <header className="flex items-center justify-between gap-3 py-3">
        <Link href="/" aria-label={t("auth.homeLabel")}>
          <Wordmark />
        </Link>
        <LanguageSwitcher />
      </header>
      <main className="flex flex-1 flex-col justify-center pb-16 animate-rise">
        <div className="relative h-[112px] overflow-hidden rounded-[28px] shadow-card" aria-hidden>
          <DawnScene className="absolute inset-0" />
        </div>
        <h1 className="mt-6 font-display text-[38px] leading-[1.04] tracking-[-0.01em]">
          {invalid ? t("auth.verify.expiredTitle") : t("auth.verify.title")}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{invalid ? t("auth.verify.expiredBody") : t("auth.verify.body")}</p>
        <Card className="mt-6 space-y-3 p-6">
          {invalid ? (
            <FormAlert>{t("auth.verify.expiredAlert")}</FormAlert>
          ) : (
            <form method="post" action="/api/auth/verify-email">
              <input type="hidden" name="token" value={token} />
              <Button type="submit">{t("auth.verify.submit")}</Button>
            </form>
          )}
          <Link href="/home" className="block py-2 text-center text-[15px] text-ink-2 underline-offset-4 hover:underline">
            {t("auth.verify.backToApp")}
          </Link>
        </Card>
      </main>
    </div>
  );
}
