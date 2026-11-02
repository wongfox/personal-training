import { Hourglass, Quote } from "lucide-react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { FocusShell } from "@/components/focus-shell";
import { LeafSprig } from "@/components/scene";
import { ButtonLink } from "@/components/ui/button";
import { getTranslator } from "@/i18n/server";
import { INTL_LOCALE } from "@/i18n/config";
import { localDate } from "@/lib/dates";
import { SKILLS } from "@/lib/taxonomy";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { type CheckpointDay, getCheckpointData } from "@/server/services/progress";
import { getActivePlan } from "@/server/services/training";
import { CheckpointForm } from "./form";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("checkpoint.metaTitle") };
}

export default async function CheckpointPage({ params }: PageProps<"/checkpoint/[day]">) {
  const day = Number((await params).day);
  if (![30, 60, 90].includes(day)) notFound();
  const user = await requireUser();
  const db = getDb();
  const today = localDate(user.timezone);
  const plan = await getActivePlan(db, user.id);
  if (!plan) redirect("/onboarding");
  const data = await getCheckpointData(db, user.id, day as CheckpointDay, today, plan);
  const { t, locale } = await getTranslator();
  const nf = new Intl.NumberFormat(INTL_LOCALE[locale]);

  if (!data.available) {
    return (
      <FocusShell footer={<ButtonLink href="/home">{t("common.backToToday")}</ButtonLink>}>
        <div className="flex min-h-[60dvh] flex-col items-center justify-center text-center">
          <span className="grid h-16 w-16 place-items-center rounded-[22px] bg-surface text-accent shadow-card" aria-hidden>
            <Hourglass size={24} strokeWidth={1.8} />
          </span>
          <h1 className="mt-6 font-display text-[32px] leading-tight">{t("checkpoint.notYetTitle", { day })}</h1>
          <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-ink-2">{t("checkpoint.notYetBody", { day })}</p>
        </div>
      </FocusShell>
    );
  }

  const skillName = (key: string) => (SKILLS.some((s) => s.key === key) ? t(`taxonomy.skills.${key}`) : key);
  const totals: [string, number][] = [
    [t("checkpoint.totals.daysTrained"), data.totals.daysTrained],
    [t("checkpoint.totals.lessons"), data.totals.lessons],
    [t("checkpoint.totals.missions"), data.totals.actions],
    [t("checkpoint.totals.exercises"), data.totals.exercises],
    [t("checkpoint.totals.reflections"), data.totals.reflections],
    [t("checkpoint.totals.bestStreak"), data.totals.longestStreak],
  ];

  return (
    <FocusShell top={<p className="text-[13px] font-medium text-muted">{t("checkpoint.topLabel", { day })}</p>}>
      <div className="pt-4">
        <header className="relative overflow-hidden rounded-[28px] bg-hero p-6 text-hero-ink shadow-card">
          <LeafSprig className="absolute -top-2 -right-2 h-28 w-28 text-hero-ink/25" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-hero-ink/65">{t("checkpoint.day", { day })}</p>
          <h1 className="mt-2 font-display text-[42px] leading-[1.02]">{t("checkpoint.title")}</h1>
        </header>

        {data.ninetyDayGoal && (
          <figure className="mt-4 rounded-[28px] bg-accent-soft px-6 py-6 text-ink">
            <div className="flex items-center gap-2">
              <Quote size={22} className="shrink-0 fill-accent/25 text-accent" aria-hidden />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">{t("checkpoint.goal")}</span>
            </div>
            <blockquote className="mt-3 font-display text-[22px] leading-[1.3]">{data.ninetyDayGoal}</blockquote>
          </figure>
        )}

        <section className="mt-8">
          <h2 className="px-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">{t("checkpoint.measured")}</h2>
          <ul className="mt-3 space-y-4 rounded-[28px] bg-surface p-5 shadow-card">
            {data.skills.map((s) => (
              <li key={s.key}>
                <div className="flex items-baseline justify-between text-[14px]">
                  <span className="font-medium">{skillName(s.key)}</span>
                  <span className="tabular-nums text-ink-2">
                    {nf.format(s.baseline)} → <span className="font-semibold text-ink">{nf.format(s.score)}</span>
                    {s.score > s.baseline && <span className="ml-1 text-success">+{nf.format(s.score - s.baseline)}</span>}
                  </span>
                </div>
                <div className="relative mt-2 h-2 rounded-full bg-surface-2">
                  <div className="absolute inset-y-0 left-0 rounded-full bg-ink/20" style={{ width: `${s.baseline}%` }} />
                  <div className="absolute inset-y-0 left-0 rounded-full bg-accent transition-[width] duration-700" style={{ width: `${s.score}%`, opacity: 0.85 }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-4 grid grid-cols-3 gap-2.5">
          {totals.map(([label, value]) => (
            <div key={label} className="rounded-[22px] bg-surface p-3.5 shadow-card">
              <p className="truncate text-[12px] text-muted">{label}</p>
              <p className="mt-1 text-[22px] font-semibold tabular-nums">{nf.format(value)}</p>
            </div>
          ))}
        </section>

        {data.completed && data.now ? (
          <section className="mt-8">
            <h2 className="px-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">{t("checkpoint.selfRating")}</h2>
            <ul className="mt-3 divide-y divide-line rounded-[28px] bg-surface px-5 shadow-card">
              {Object.keys(data.now).map((k) => (
                <li key={k} className="flex items-center justify-between gap-3 py-3.5 text-[14px]">
                  <span>{skillName(k)}</span>
                  <span className="shrink-0 tabular-nums">
                    {data.before[k] ?? "—"} → <span className="font-semibold">{data.now![k]}</span> {t("checkpoint.outOfFive")}
                  </span>
                </li>
              ))}
            </ul>
            <ButtonLink href="/home" className="mt-8">
              {t("common.backToToday")}
            </ButtonLink>
          </section>
        ) : (
          <CheckpointForm day={day} questions={data.questions} />
        )}
      </div>
    </FocusShell>
  );
}
