import { ArrowRight, Compass } from "lucide-react";
import Link from "next/link";
import { getTranslator } from "@/i18n/server";

export default async function NotFound() {
  const { t } = await getTranslator();
  return (
    <div className="mx-auto flex min-h-dvh max-w-[440px] flex-col items-center justify-center px-6 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-[22px] bg-accent-soft text-accent shadow-card" aria-hidden>
        <Compass size={28} strokeWidth={1.7} />
      </span>
      <h1 className="mt-7 font-display text-[34px] leading-tight">{t("common.notFoundTitle")}</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{t("common.notFoundBody")}</p>
      <Link
        href="/home"
        className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-hero pr-2 pl-5 text-[15px] font-semibold text-hero-ink shadow-card transition hover:brightness-110"
      >
        {t("common.backToToday")}
        <span className="grid h-8 w-8 place-items-center rounded-full bg-hero-ink/15" aria-hidden>
          <ArrowRight size={17} />
        </span>
      </Link>
    </div>
  );
}
