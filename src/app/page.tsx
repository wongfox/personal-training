import { ArrowRight, BookOpen, Clock, Dumbbell, Footprints, PenLine, Quote, TrendingUp } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ComponentType } from "react";
import { Wordmark } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { DawnScene, LeafSprig } from "@/components/scene";
import { getTranslator } from "@/i18n/server";
import { getCurrentUser } from "@/server/auth/current-user";

type Icon = ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;

const LOOP: { key: string; icon: Icon }[] = [
  { key: "learn", icon: BookOpen },
  { key: "practise", icon: Dumbbell },
  { key: "apply", icon: Footprints },
  { key: "reflect", icon: PenLine },
];

export default async function Landing() {
  const user = await getCurrentUser();
  if (user) redirect(user.onboarded ? "/home" : "/onboarding");
  const { t } = await getTranslator();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:max-w-5xl lg:px-8">
      <header className="flex items-center justify-between gap-3 py-3">
        <Wordmark />
        <LanguageSwitcher />
      </header>

      <main className="flex flex-1 flex-col gap-6 pt-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-12 lg:pt-12">
        {/* Hero */}
        <section className="space-y-6 animate-rise">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">{t("landing.eyebrow")}</p>
            <h1 className="mt-3 font-display text-[48px] leading-[0.98] tracking-[-0.01em] lg:text-[68px]">
              {t("landing.titleLine1")}
              <br />
              <span className="italic text-ink-2">{t("landing.titleLine2")}</span>
            </h1>
            <p className="mt-4 max-w-md text-[16px] leading-relaxed text-ink-2">{t("landing.lede")}</p>
          </div>

          {/* Scene card: the light dawn illustration keeps its own fixed text colours in both themes. */}
          <div className="relative isolate overflow-hidden rounded-[28px] p-6 text-[#1d2620] shadow-card">
            <DawnScene className="absolute inset-0 -z-10" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2e4a3b]/80">{t("landing.hero.eyebrow")}</p>
            <p className="mt-2 max-w-[75%] font-display text-[28px] leading-[1.08]">{t("landing.hero.title")}</p>
            <p className="mt-2 flex items-center gap-1.5 text-[13px] text-[#1d2620]/70">
              <span>{t("taxonomy.categories.communication")}</span>
              <span aria-hidden>·</span>
              <Clock size={13} aria-hidden /> {t("common.minutes", { count: 12 })}
            </p>
            <Link
              href="/register"
              className="mt-[88px] inline-flex h-12 items-center gap-2 rounded-full bg-[#1f3328] pr-2 pl-5 text-[15px] font-semibold text-[#f6f1e7] shadow-card transition hover:bg-[#2e4a3b] active:scale-[0.98]"
            >
              {t("landing.hero.cta")}
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f6f1e7]/15" aria-hidden>
                <ArrowRight size={17} />
              </span>
            </Link>
          </div>

          <Link
            href="/login"
            className="flex h-12 w-full items-center justify-center rounded-full border border-line bg-surface text-[15px] font-medium text-ink shadow-card transition hover:bg-surface-2"
          >
            {t("landing.signIn")}
          </Link>
        </section>

        {/* The daily loop */}
        <section aria-labelledby="loop-title" className="space-y-3 animate-rise [animation-delay:120ms]">
          <h2 id="loop-title" className="px-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">
            {t("landing.loopTitle")}
          </h2>
          <ol className="grid grid-cols-2 gap-3">
            {LOOP.map(({ key, icon: Icon }, i) => (
              <li key={key} className="rounded-[24px] bg-surface p-4 shadow-card">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-soft text-accent">
                    <Icon size={20} strokeWidth={1.8} />
                  </span>
                  <span className="font-mono text-[11px] text-muted" aria-hidden>
                    0{i + 1}
                  </span>
                </div>
                <p className="mt-3 font-display text-[21px] leading-none">{t(`landing.loop.${key}.title`)}</p>
                <p className="mt-1.5 text-[13px] leading-snug text-ink-2">{t(`landing.loop.${key}.body`)}</p>
              </li>
            ))}
            <li className="relative col-span-2 overflow-hidden rounded-[24px] bg-hero p-5 text-hero-ink shadow-card">
              <LeafSprig className="absolute -right-3 -bottom-4 h-28 w-28 text-hero-ink/40" />
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-hero-ink/15">
                  <TrendingUp size={20} strokeWidth={1.8} />
                </span>
                <p className="font-display text-[22px] leading-none">{t("landing.loop.improve.title")}</p>
                <span className="ml-auto font-mono text-[11px] opacity-60" aria-hidden>
                  05
                </span>
              </div>
              <p className="mt-2.5 max-w-[80%] text-[14px] leading-snug opacity-85">{t("landing.loop.improve.body")}</p>
            </li>
          </ol>

          <figure className="rounded-[28px] bg-accent-soft px-6 py-6 text-ink">
            <div className="flex items-center gap-2">
              <Quote size={22} className="shrink-0 fill-accent/25 text-accent" aria-hidden />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">{t("landing.quote.eyebrow")}</span>
            </div>
            <blockquote className="mt-3 font-display text-[22px] leading-[1.3]">{t("landing.quote.body")}</blockquote>
            <figcaption className="mt-3 text-[14px] leading-relaxed text-ink-2">{t("landing.quote.footer")}</figcaption>
          </figure>
        </section>
      </main>
    </div>
  );
}
