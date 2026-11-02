import { ArrowRight, CalendarDays, Clock, Gauge, Repeat, Quote } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ComponentType } from "react";
import { RoadmapTimeline } from "@/components/roadmap";
import { LeafSprig } from "@/components/scene";
import { getTranslator } from "@/i18n/server";
import { localDate } from "@/lib/dates";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { getRoadmapView } from "@/server/services/catalog";
import { getActivePlan, getJourneyOutline } from "@/server/services/training";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("plan.metaTitle") };
}

type Icon = ComponentType<{ size?: number; strokeWidth?: number }>;

export default async function PlanRevealPage() {
  const user = await requireUser();
  const db = getDb();
  const plan = await getActivePlan(db, user.id);
  if (!plan) redirect("/home");
  const [outline, roadmap] = await Promise.all([
    plan.journeyId ? getJourneyOutline(db, user.id, plan.journeyId, localDate(user.timezone)) : null,
    getRoadmapView(db, user.id, plan),
  ]);
  const { t } = await getTranslator();

  const rows: { label: string; value: string; icon: Icon }[] = [
    { label: t("plan.rows.daily"), value: t("common.minutes", { count: plan.dailyMinutes }), icon: Clock },
    { label: t("plan.rows.rhythm"), value: t(`plan.frequency.${plan.frequency}`), icon: Repeat },
    { label: t("plan.rows.duration"), value: t("common.days", { count: plan.durationDays }), icon: CalendarDays },
    { label: t("plan.rows.level"), value: t(`common.difficulty.${plan.level}`), icon: Gauge },
  ];

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="flex-1">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-accent animate-fade">{t("plan.ready")}</p>
        <h1 className="mt-3 font-display text-[42px] leading-[1.02] tracking-[-0.01em] animate-rise">{plan.title}</h1>

        <section className="relative mt-7 overflow-hidden rounded-[28px] bg-hero p-6 text-hero-ink shadow-card animate-rise [animation-delay:120ms]">
          <LeafSprig className="absolute -right-4 -bottom-5 h-32 w-32 text-hero-ink/35" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-65">{t("plan.primaryGoal")}</p>
          <p className="mt-1 font-display text-[30px] leading-tight">{plan.primaryGoalName}</p>
          {plan.secondaryGoals.length > 0 && (
            <>
              <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] opacity-65">{t("plan.secondaryGoals")}</p>
              <ul className="mt-2 flex max-w-[85%] flex-wrap gap-2">
                {plan.secondaryGoals.map((g) => (
                  <li key={g.key} className="rounded-full bg-hero-ink/15 px-3 py-1 text-[13px] font-medium">
                    {g.name}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <dl className="mt-3 grid grid-cols-2 gap-3 animate-rise [animation-delay:200ms]">
          {rows.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-[22px] bg-surface p-4 shadow-card">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-soft text-accent" aria-hidden>
                <Icon size={17} strokeWidth={1.8} />
              </span>
              <dt className="mt-3 text-[12px] text-muted">{label}</dt>
              <dd className="mt-0.5 text-[16px] font-semibold">{value}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-3 rounded-[28px] bg-surface p-5 shadow-card animate-rise [animation-delay:280ms]">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-display text-[22px] leading-none">{t("plan.roadmap")}</h2>
            <p className="text-[12px] text-muted">
              {t("common.lessons", { count: roadmap.totalLessons })} · {t("common.days", { count: roadmap.planDays })}
            </p>
          </div>
          <div className="mt-5">
            <RoadmapTimeline stages={roadmap.stages} planDays={roadmap.planDays} lastDay={roadmap.lastDay} />
          </div>
          {outline?.todayLesson && (
            <p className="mt-5 border-t border-line pt-4 text-[14px] text-ink-2">
              {t("plan.dayOne")}: <span className="font-medium text-ink">{outline.todayLesson.title}</span>
            </p>
          )}
        </section>

        {plan.ninetyDayGoal && (
          <figure className="mt-3 rounded-[28px] bg-accent-soft px-6 py-6 text-ink animate-rise [animation-delay:360ms]">
            <div className="flex items-center gap-2">
              <Quote size={20} className="shrink-0 fill-accent/25 text-accent" aria-hidden />
              <figcaption className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">{t("plan.inNinetyDays")}</figcaption>
            </div>
            <blockquote className="mt-3 font-display text-[22px] italic leading-snug">“{plan.ninetyDayGoal}”</blockquote>
          </figure>
        )}
      </div>

      <div className="pt-8">
        <Link
          href="/home"
          className="flex h-14 w-full items-center justify-between gap-2 rounded-full bg-hero pr-2 pl-6 text-[16px] font-semibold text-hero-ink shadow-card transition hover:brightness-110 active:scale-[0.98]"
        >
          {t("plan.start")}
          <span className="grid h-10 w-10 place-items-center rounded-full bg-hero-ink/15" aria-hidden>
            <ArrowRight size={18} />
          </span>
        </Link>
      </div>
    </div>
  );
}
