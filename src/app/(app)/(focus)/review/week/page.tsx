import { BookOpen, CalendarDays, Clock, Eye, Flame, Quote, Sparkles, Target, TrendingUp } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FocusShell } from "@/components/focus-shell";
import { LeafSprig } from "@/components/scene";
import { ButtonLink } from "@/components/ui/button";
import { getTranslator } from "@/i18n/server";
import { INTL_LOCALE } from "@/i18n/config";
import { formatDay, localDate } from "@/lib/dates";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { reviewableWeek, weeklyReviewDue } from "@/server/services/home";
import { computeWeeklyStats, listWeeklyReviews } from "@/server/services/progress";
import { getActivePlan } from "@/server/services/training";
import { WeeklyReviewForm } from "./form";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("review.week.metaTitle") };
}

export default async function WeeklyReviewPage() {
  const user = await requireUser();
  const db = getDb();
  const today = localDate(user.timezone);
  const plan = await getActivePlan(db, user.id);
  if (!plan) redirect("/onboarding");
  const week = reviewableWeek(plan.startDate, today);
  const { t, locale } = await getTranslator();
  const nf = new Intl.NumberFormat(INTL_LOCALE[locale]);

  if (!(await weeklyReviewDue(db, user.id, today, plan.startDate))) {
    const [last] = await listWeeklyReviews(db, user.id);
    const opens = formatDay(week.nextOpensOn, { weekday: "long", month: "short", day: "numeric" }, locale);
    // Mid-sentence in Spanish: "se abre el lunes, 3 nov."
    const date = locale === "es" ? opens.charAt(0).toLowerCase() + opens.slice(1) : opens;
    return (
      <FocusShell footer={<ButtonLink href="/home">{t("common.backToToday")}</ButtonLink>}>
        <div className="pt-6">
          <div className="relative overflow-hidden rounded-[28px] bg-hero p-6 text-hero-ink shadow-card">
            <LeafSprig className="absolute -top-2 -right-2 h-24 w-24 text-hero-ink/25" />
            <span className="grid h-11 w-11 place-items-center rounded-[14px] bg-hero-ink/12" aria-hidden>
              <CalendarDays size={20} strokeWidth={1.8} />
            </span>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-hero-ink/65">{t("review.week.eyebrow")}</p>
            <h1 className="mt-2 max-w-[92%] font-display text-[30px] leading-[1.12]">{t("review.week.notDueTitle", { date })}</h1>
            <p className="mt-3 text-[14px] leading-relaxed text-hero-ink/75">{t("review.week.notDueBody")}</p>
          </div>
          {last && (
            <figure className="mt-4 rounded-[28px] bg-accent-soft px-6 py-6 text-ink">
              <div className="flex items-center gap-2">
                <Quote size={22} className="shrink-0 fill-accent/25 text-accent" aria-hidden />
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">{t("review.week.currentFocus")}</span>
              </div>
              <p className="mt-3 font-display text-[24px] leading-[1.2]">{last.nextFocus.headline}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{last.nextFocus.detail}</p>
            </figure>
          )}
        </div>
      </FocusShell>
    );
  }

  const { stats } = await computeWeeklyStats(db, user.id, today, plan, week.weekStart);
  const rows: { key: string; icon: React.ReactNode; label: string; value: string }[] = [
    { key: "lessons", icon: <BookOpen size={17} />, label: t("review.week.stats.lessons"), value: `${stats.lessonsCompleted}/${stats.lessonsTarget}` },
    { key: "missions", icon: <Target size={17} />, label: t("review.week.stats.missions"), value: `${stats.actionsCompleted}/${stats.actionsTarget}` },
    { key: "days", icon: <CalendarDays size={17} />, label: t("review.week.stats.days"), value: `${stats.daysTrained}/7` },
    { key: "streak", icon: <Flame size={17} />, label: t("review.week.stats.streak"), value: t("common.days", { count: stats.currentStreak }) },
    { key: "time", icon: <Clock size={17} />, label: t("review.week.stats.time"), value: t("common.minutes", { count: stats.minutesTrained }) },
    { key: "xp", icon: <Sparkles size={17} />, label: t("review.week.stats.xp"), value: nf.format(stats.xpEarned) },
  ];
  const skill = (s: { key: string } | null | undefined, fallbackKey: string) => t(`taxonomy.skills.${s?.key ?? fallbackKey}`);

  return (
    <FocusShell top={<p className="text-[13px] font-medium text-muted">{t("review.week.eyebrow")}</p>}>
      <div className="pt-4">
        <header className="relative overflow-hidden rounded-[28px] bg-hero p-6 text-hero-ink shadow-card">
          <LeafSprig className="absolute -top-2 -right-2 h-28 w-28 text-hero-ink/25" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-hero-ink/65">
            {t("review.week.range", { week: week.index, start: formatDay(stats.weekStart, undefined, locale), end: formatDay(stats.weekEnd, undefined, locale) })}
          </p>
          <h1 className="mt-2 font-display text-[42px] leading-none">{t("review.week.title")}</h1>
          <div className="mt-5 flex gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-hero-ink/12 px-3 py-1.5 text-[13px] font-medium">
              <Flame size={14} aria-hidden /> {t("common.days", { count: stats.currentStreak })}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-hero-ink/12 px-3 py-1.5 text-[13px] font-medium">
              <Sparkles size={14} aria-hidden /> {t("common.plusXp", { count: nf.format(stats.xpEarned) })}
            </span>
          </div>
        </header>

        <dl className="mt-4 divide-y divide-line rounded-[28px] bg-surface px-5 shadow-card">
          {rows.map((r) => (
            <div key={r.key} className="flex items-center gap-3 py-3.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[12px] bg-accent-soft text-accent" aria-hidden>
                {r.icon}
              </span>
              <dt className="min-w-0 flex-1 text-[15px] text-ink-2">{r.label}</dt>
              <dd className="text-[16px] font-semibold tabular-nums">{r.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-[24px] bg-success-soft p-4">
            <p className="flex items-center gap-1.5 text-[12px] font-medium text-success">
              <TrendingUp size={14} aria-hidden /> {t("review.week.strongest")}
            </p>
            <p className="mt-1.5 text-[17px] font-semibold">{stats.strongestSkill ? skill(stats.strongestSkill, stats.strongestSkill.key) : "—"}</p>
            {stats.strongestSkill && <p className="text-[12px] text-ink-2">{t("review.week.delta", { delta: stats.strongestSkill.delta })}</p>}
          </div>
          <div className="rounded-[24px] bg-sun-soft p-4">
            <p className="flex items-center gap-1.5 text-[12px] font-medium text-ink-2">
              <Eye size={14} className="text-sun" aria-hidden /> {t("review.week.needsAttention")}
            </p>
            <p className="mt-1.5 text-[17px] font-semibold">{skill(stats.needsAttention, plan.primarySkill.key)}</p>
            <p className="text-[12px] text-ink-2">{t("review.week.delta", { delta: stats.needsAttention?.delta ?? 0 })}</p>
          </div>
        </div>

        <WeeklyReviewForm />
      </div>
    </FocusShell>
  );
}
