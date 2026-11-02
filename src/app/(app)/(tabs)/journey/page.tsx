import { Check, ChevronDown, Lock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RoadmapTimeline } from "@/components/roadmap";
import { LeafSprig } from "@/components/scene";
import { Card, ProgressBar, SectionTitle } from "@/components/ui/primitives";
import { getTranslator } from "@/i18n/server";
import type { TFunction } from "@/i18n/translate";
import { cn } from "@/lib/cn";
import { localDate } from "@/lib/dates";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { getRoadmapView, listJourneys } from "@/server/services/catalog";
import type { OutlineModule } from "@/server/services/training";
import { getActivePlan, getJourneyOutline } from "@/server/services/training";
import { SwitchJourneyButton } from "./switch-journey";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("journey.title") };
}

type ModuleState = "completed" | "inProgress" | "upcoming";

function moduleProgress(m: OutlineModule): { pct: number; state: ModuleState } {
  const pct = m.lessons.length ? Math.round((m.completed / m.lessons.length) * 100) : 0;
  const state: ModuleState = pct === 100 ? "completed" : m.lessons.some((l) => l.state === "today") || m.completed > 0 ? "inProgress" : "upcoming";
  return { pct, state };
}

export default async function JourneyPage() {
  const user = await requireUser();
  const db = getDb();
  const today = localDate(user.timezone);
  const plan = await getActivePlan(db, user.id);
  if (!plan) redirect("/onboarding");
  const [outline, journeys, roadmap, { t }] = await Promise.all([
    plan.journeyId ? getJourneyOutline(db, user.id, plan.journeyId, today) : null,
    listJourneys(db, user.id),
    getRoadmapView(db, user.id, plan),
    getTranslator(),
  ]);

  return (
    <div className="space-y-8">
      {outline ? (
        <>
          <header className="relative isolate overflow-hidden rounded-[28px] bg-hero p-6 text-hero-ink shadow-card animate-fade">
            <LeafSprig className="absolute -top-3 -right-4 -z-10 h-36 w-36 text-hero-ink/20" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-hero-ink/70">{t("journey.yourJourney")}</p>
            <div className="mt-2 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="font-display text-[32px] leading-[1.05]">{outline.journey.title}</h1>
                {outline.journey.subtitle && <p className="mt-1.5 text-[14px] text-hero-ink/75">{outline.journey.subtitle}</p>}
              </div>
              <p className="shrink-0 font-display text-[34px] leading-none tabular-nums" aria-label={t("journey.percentComplete", { percent: outline.percent })}>
                {outline.percent}
                <span className="text-[18px]">%</span>
              </p>
            </div>
            <div
              className="mt-5 h-2 overflow-hidden rounded-full bg-hero-ink/15"
              role="progressbar"
              aria-valuenow={outline.percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={t("journey.percentComplete", { percent: outline.percent })}
            >
              <div className="h-full rounded-full bg-sun transition-[width] duration-700" style={{ width: `${outline.percent}%` }} />
            </div>
            <p className="mt-2.5 text-[13px] text-hero-ink/80">
              {t("journey.summary", { completed: outline.completed, total: outline.total, modules: outline.modules.length })}
            </p>
            {outline.modules.length > 1 && (
              <ol className="mt-4 flex flex-wrap gap-1.5" aria-label={t("journey.modulesLabel")}>
                {outline.modules.map((m, i) => {
                  const { pct, state } = moduleProgress(m);
                  return (
                    <li
                      key={m.id}
                      className={cn(
                        "grid h-9 min-w-9 place-items-center rounded-full px-2.5 text-[13px] font-semibold tabular-nums",
                        state === "completed" && "bg-hero-ink text-hero",
                        state === "inProgress" && "bg-sun-soft text-ink",
                        state === "upcoming" && "border border-hero-ink/30 text-hero-ink/70",
                      )}
                      aria-current={state === "inProgress" ? "step" : undefined}
                    >
                      <span aria-hidden>{state === "completed" ? <Check size={15} strokeWidth={3} /> : i + 1}</span>
                      <span className="sr-only">{t("journey.moduleChip", { n: i + 1, title: m.title, percent: pct })}</span>
                    </li>
                  );
                })}
              </ol>
            )}
          </header>

          <ol className="space-y-4">
            {outline.modules.map((m, i) => (
              <ModuleCard key={m.id} module={m} index={i} t={t} />
            ))}
          </ol>
        </>
      ) : (
        <header className="relative isolate overflow-hidden rounded-[28px] bg-hero p-6 text-hero-ink shadow-card">
          <LeafSprig className="absolute -top-3 -right-4 -z-10 h-32 w-32 text-hero-ink/20" />
          <h1 className="font-display text-[32px] leading-[1.05]">{t("journey.chooseTitle")}</h1>
          <p className="mt-2 text-[15px] text-hero-ink/80">{t("journey.chooseBody")}</p>
        </header>
      )}

      <section aria-labelledby="roadmap-title">
        <SectionTitle>
          <span id="roadmap-title">{t("journey.roadmapTitle", { days: plan.durationDays })}</span>
        </SectionTitle>
        <Card>
          <RoadmapTimeline stages={roadmap.stages} planDays={roadmap.planDays} lastDay={roadmap.lastDay} />
          <p className="mt-5 border-t border-line pt-4 text-[13px] text-ink-2">{t("journey.roadmapNote")}</p>
        </Card>
      </section>

      <section id="journeys" aria-labelledby="all-journeys" className="scroll-mt-6">
        <SectionTitle>
          <span id="all-journeys">{t("journey.allJourneys")}</span>
        </SectionTitle>
        <ul className="space-y-2.5">
          {journeys.map((j) => {
            const current = j.id === plan.journeyId;
            return (
              <li key={j.id}>
                <div className={cn("flex items-center gap-4 rounded-[22px] bg-surface p-4 shadow-card", current && "ring-2 ring-accent/40")}>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-snug">{j.title}</p>
                    <p className="mt-0.5 text-[13px] text-ink-2">
                      {t("common.lessons", { count: j.lessons })} · {t(`common.difficulty.${j.difficulty}`)}
                      {j.completed > 0 && ` · ${t("journey.doneCount", { count: j.completed })}`}
                    </p>
                  </div>
                  {current ? (
                    <span className="inline-flex shrink-0 items-center rounded-full bg-hero px-3 py-1.5 text-[12px] font-semibold text-hero-ink">
                      {t("journey.current")}
                    </span>
                  ) : (
                    <SwitchJourneyButton journeyId={j.id} title={j.title} />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function ModuleCard({ module: m, index, t }: { module: OutlineModule; index: number; t: TFunction }) {
  const { pct, state } = moduleProgress(m);
  return (
    <li className="animate-rise" style={{ animationDelay: `${index * 50}ms` }}>
      <Card className="p-0">
        <div className="p-5 pb-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{t("journey.module", { n: index + 1 })}</p>
            <p
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[12px] font-semibold",
                state === "completed" && "bg-success-soft text-success",
                state === "inProgress" && "bg-sun-soft text-ink",
                state === "upcoming" && "bg-surface-2 text-muted",
              )}
            >
              {t(`journey.state.${state}`)}
            </p>
          </div>
          <h2 className="mt-1.5 font-display text-[23px] leading-tight">{m.title}</h2>
          <p className="mt-1 text-[13px] text-muted">
            {t("journey.moduleMeta", { lessons: t("common.lessons", { count: m.lessons.length }), minutes: m.estimatedMinutes, percent: pct })}
          </p>
          <ProgressBar value={pct} tone={pct === 100 ? "success" : "accent"} className="mt-3" label={t("journey.moduleProgress", { title: m.title })} />
        </div>
        <details open={state === "inProgress"} className="group border-t border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-3 text-[13px] font-semibold text-ink-2 hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
            {t(`journey.lessonsToggle.${state}`)}
            <ChevronDown size={16} className="text-muted transition group-open:rotate-180" aria-hidden />
          </summary>
          <ol className="relative px-3 pb-3">
            {m.lessons.map((l, i) => {
              const content = (
                <>
                  <span
                    className={cn(
                      "relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2",
                      l.state === "completed" && "border-accent bg-accent text-accent-ink",
                      l.state === "today" && "border-sun bg-sun-soft",
                      l.state === "locked" && "border-line bg-surface text-muted",
                    )}
                    aria-hidden
                  >
                    {l.state === "completed" ? (
                      <Check size={13} strokeWidth={3} />
                    ) : l.state === "locked" ? (
                      <Lock size={10} strokeWidth={2.4} />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-sun" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block text-[15px] leading-snug", l.state === "locked" ? "text-ink-2" : "font-semibold", l.state === "completed" && "text-ink-2")}>
                      {l.title}
                    </span>
                    <span className={cn("block text-[12px]", l.state === "today" ? "font-medium text-accent" : "text-muted")}>
                      {l.state === "today" ? (l.started ? t("journey.lessonInProgressToday") : t("journey.lessonToday")) : t("common.minutes", { count: l.estimatedMinutes })}
                    </span>
                  </span>
                  {l.state === "locked" && <span className="sr-only">, {t("journey.lessonLocked")}</span>}
                  {l.state === "completed" && <span className="sr-only">, {t("journey.lessonDone")}</span>}
                </>
              );
              return (
                <li key={l.id} className="relative">
                  {i < m.lessons.length - 1 && <span className="absolute top-9 bottom-0 left-[19px] w-px border-l border-dashed border-line" aria-hidden />}
                  {l.state === "locked" ? (
                    <div className="flex items-center gap-3 px-2 py-2.5">{content}</div>
                  ) : (
                    <Link href={`/lesson/${l.id}`} className="flex items-center gap-3 rounded-2xl px-2 py-2.5 transition hover:bg-surface-2">
                      {content}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </details>
      </Card>
    </li>
  );
}
