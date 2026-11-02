import Link from "next/link";
import { Wordmark } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ClearLocalDataOnMount } from "@/components/sign-out-button";
import { getTranslator } from "@/i18n/server";

export default async function AuthLayout({ children }: LayoutProps<"/">) {
  const { t } = await getTranslator();
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[440px] flex-col px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-8">
      <header className="flex items-center justify-between gap-3 py-3">
        <Link href="/" aria-label={t("auth.homeLabel")}>
          <Wordmark />
        </Link>
        <LanguageSwitcher />
      </header>
      <main className="flex flex-1 flex-col pt-4 animate-rise">{children}</main>
      <ClearLocalDataOnMount />
    </div>
  );
}
