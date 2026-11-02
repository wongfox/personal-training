import { ArrowRight, Brain, CalendarCheck, Check, Clock, Compass, Dumbbell, MessageCircle, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DayPills, type PlanItem, PlanChecklist, QuickTile, QuoteCard } from "@/components/home-widgets";
import { MissionMoodCard } from "@/components/mood-checkin";
import { StreakBadge } from "@/components/progress-widgets";
import { DawnScene } from "@/components/scene";
import { ProgressBar } from "@/components/ui/primitives";
import { getTranslator } from "@/i18n/server";
import { formatDay, greetingPart, localDate } from "@/lib/dates";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { trackDaily } from "@/server/platform";
import { getHomeData } from "@/server/services/home";
import { ContinueJourneyButton } from "./continue-journey";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("home.title") };
}

export default async function HomePage() {
  const user = await requireUser();
  const db = getDb();
  const today = localDate(user.timezone);
  const data = await getHomeData(db, user.id, today);
  if (!data) redirect("/onboarding");
  await trackDaily(db, user.id, "app_opened");
  const { t, locale } = await getTranslator();

  const firstName = user.name.split(" ")[0];
  const { todayLesson, doneLesson, nextLesson } = data;
  const done = new Set(data.doneToday);
  const mission = data.todaysMission;
  const outcomeLabel = (o: string | null | undefined) => (o ? t(`home.missionCard.outcomes.${o}`) : "");

  // Today's plan: the day's lesson, its mission, due reviews and an optional practice rep.
  const items: PlanItem[] = [];
  const lesson = todayLesson ?? doneLesson;
  if (lesson) {
    items.push({
      key: "lesson",
      title: lesson.title,
      subtitle: t("home.plan.lesson"),
      meta: t("common.minutes", { count: lesson.estimatedMinutes }),
      done: Boolean(doneLesson),
      href: todayLesson ? `/lesson/${todayLesson.id}` : undefined,
    });
  } else if (data.masteryRep) {
    items.push({
      key: "rep",
      title: data.masteryRep.title,
      subtitle: t("home.plan.practice"),
      meta: t("common.minutes", { count: data.masteryRep.estimatedMinutes }),
      done: data.masteryRep.done,
      href: data.masteryRep.done ? undefined : `/practice/${data.masteryRep.slug}`,
    });
  }
  if (mission || data.missionPreview) {
    const m = (mission ?? data.missionPreview)!;
    items.push({
      key: "mission",
      title: m.title,
      subtitle: mission ? (mission.status === "done" ? t("home.missionCard.done", { outcome: outcomeLabel(mission.outcome) }) : t("home.plan.mission")) : t("home.plan.missionLocked"),
      meta: t("common.minutes", { count: m.estimatedMinutes }),
      done: mission?.status === "done",
      href: mission ? `/mission/${mission.attemptId}` : undefined,
    });
  }
  if (data.dueReviews > 0 || done.has("review_completed")) {
    items.push({
      key: "review",
      title: data.dueReviews > 0 ? t("home.plan.review", { count: data.dueReviews }) : t("home.plan.reviewDone"),
      subtitle: t("home.plan.reviewSub"),
      done: data.dueReviews === 0,
      href: data.dueReviews > 0 ? "/review" : undefined,
    });
  }
  if (!data.masteryRep) {
    items.push({ key: "practice", title: t("home.plan.practice"), subtitle: t("home.plan.practiceSub"), done: done.has("practice_completed"), href: "/practice" });
  }
  const completed = items.filter((i) => i.done).length;
  const percent = items.length ? Math.round((completed / items.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <header className="flex items-start justify-between gap-4 animate-fade">
        <div className="min-w-0">
          <p className="text-[13px] text-muted">{formatDay(today, { weekday: "long", month: "long", day: "numeric" }, locale)}</p>
          <h1 className="mt-1 font-display text-[32px] leading-[1.05]">
            {t(`common.greeting.${greetingPart(user.timezone)}`)}, {firstName}
          </h1>
          {data.streak.atRisk && data.streak.current > 0 && (
            <p className="mt-1.5 text-[13px] font-medium text-accent">{t("home.streakAtRisk", { count: data.streak.current })}</p>
          )}
        </div>
        <Link href="/profile" aria-label={t("home.streakLabel", { count: data.streak.current })} className="flex items-center gap-2">
          <StreakBadge days={data.streak.current} atRisk={data.streak.atRisk} />
          <span className="grid h-10 w-10 place-items-center rounded-full bg-hero font-display text-[17px] text-hero-ink" aria-hidden>
            {firstName.slice(0, 1).toUpperCase()}
          </span>
        </Link>
      </header>

      {/* A mission from an earlier day still waiting for its check-in */}
      {data.pendingMission && (
        <div className="animate-rise">
          <MissionMoodCard attemptId={data.pendingMission.attemptId} title={data.pendingMission.title} eyebrow={t("home.pendingMission.title")} />
        </div>
      )}

      {/* Today's training */}
      <section aria-labelledby="today-title" className="animate-rise">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">
            {t("home.dayOf", { day: data.dayNumber, total: data.plan.durationDays })}
          </p>
          {data.outline && (
            <p className="truncate text-[13px] text-muted">{t("home.journeyPercent", { percent: data.outline.percent, journey: data.outline.journey.title })}</p>
          )}
        </div>

        {todayLesson ? (
          <SceneCard>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2e4a3b]/80">{t("home.hero.eyebrow")}</p>
            <h2 id="today-title" className="mt-2 max-w-[78%] font-display text-[28px] leading-[1.08]">
              {todayLesson.title}
            </h2>
            <p className="mt-2 flex items-center gap-1.5 text-[13px] text-[#1d2620]/70">
              <span>{t(`taxonomy.categories.${todayLesson.category}`)}</span>
              <span aria-hidden>·</span>
              <Clock size={13} aria-hidden /> {t("common.minutes", { count: todayLesson.estimatedMinutes })}
            </p>
            <Link
              href={`/lesson/${todayLesson.id}`}
              className="mt-[92px] inline-flex h-12 items-center gap-2 rounded-full bg-[#1f3328] pr-2 pl-5 text-[15px] font-semibold text-[#f6f1e7] shadow-card transition hover:bg-[#2e4a3b] active:scale-[0.98]"
            >
              {todayLesson.started ? t("home.hero.continue") : t("home.hero.start")}
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f6f1e7]/15">
                <ArrowRight size={17} />
              </span>
            </Link>
          </SceneCard>
        ) : doneLesson ? (
          <SceneCard>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#2e4a3b] text-[#f6f1e7]">
              <Check size={20} strokeWidth={2.6} />
            </span>
            <h2 id="today-title" className="mt-3 max-w-[80%] font-display text-[26px] leading-[1.1]">
              {t("home.hero.doneTitle")}
            </h2>
            <p className="mt-1.5 max-w-[80%] text-[14px] text-[#1d2620]/70">{doneLesson.title}</p>
            {nextLesson && (
              <p className="mt-[72px] inline-block rounded-full bg-[#fffcf7]/85 px-4 py-2 text-[13px] text-[#1d2620] backdrop-blur">
                {t("home.hero.tomorrow", { title: nextLesson.title })}
              </p>
            )}
          </SceneCard>
        ) : data.masteryRep ? (
          <SceneCard>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2e4a3b]/80">{t("home.hero.masteryEyebrow")}</p>
            <h2 id="today-title" className="mt-2 max-w-[80%] font-display text-[28px] leading-[1.08]">
              {data.masteryRep.title.includes(":") ? data.masteryRep.title.split(":").slice(1).join(":").trim() : data.masteryRep.title}
            </h2>
            <p className="mt-2 text-[13px] text-[#1d2620]/70">
              {data.masteryRep.title.split(":")[0]} · {t("common.minutes", { count: data.masteryRep.estimatedMinutes })}
            </p>
            {data.masteryRep.done ? (
              <p className="mt-[84px] inline-flex items-center gap-2 rounded-full bg-[#fffcf7]/85 px-4 py-2 text-[14px] font-medium">
                <Check size={16} strokeWidth={2.6} /> {t("home.hero.masteryDone")}
              </p>
            ) : (
              <Link
                href={`/practice/${data.masteryRep.slug}`}
                className="mt-[84px] inline-flex h-12 items-center gap-2 rounded-full bg-[#1f3328] pr-2 pl-5 text-[15px] font-semibold text-[#f6f1e7] shadow-card transition hover:bg-[#2e4a3b]"
              >
                {t("home.hero.masteryStart")}
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f6f1e7]/15">
                  <ArrowRight size={17} />
                </span>
              </Link>
            )}
          </SceneCard>
        ) : data.continueJourney ? (
          <section className="rounded-[28px] bg-surface p-6 shadow-card">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{t("home.hero.nextInPlan")}</p>
            <h2 id="today-title" className="mt-2 font-display text-[28px] leading-tight">{data.continueJourney.title}</h2>
            <p className="mt-2 text-[15px] text-ink-2">{t("home.hero.nextInPlanBody")}</p>
            <ContinueJourneyButton journeyId={data.continueJourney.id} />
          </section>
        ) : data.journeyComplete ? (
          <section className="rounded-[28px] bg-surface p-6 shadow-card">
            <h2 id="today-title" className="font-display text-[26px]">{t("home.hero.journeyCompleteTitle")}</h2>
            <p className="mt-2 text-[15px] text-ink-2">{t("home.hero.journeyCompleteBody", { journey: data.outline?.journey.title ?? "" })}</p>
            <PillLink href="/journey#journeys">{t("home.hero.chooseNext")}</PillLink>
          </section>
        ) : (
          <section className="rounded-[28px] bg-surface p-6 shadow-card">
            <h2 id="today-title" className="text-[15px] text-ink-2">{t("home.hero.noJourney")}</h2>
            <PillLink href="/journey#journeys">{t("home.hero.pickJourney")}</PillLink>
          </section>
        )}
      </section>

      {/* Shortcuts */}
      <nav aria-label={t("nav.main")} className="grid grid-cols-4 gap-3 animate-rise [animation-delay:40ms]">
        <QuickTile href="/practice" label={t("home.tiles.practice")} icon={Dumbbell} />
        <QuickTile href="/review" label={t("home.tiles.review")} icon={Brain} badge={data.dueReviews} />
        <QuickTile href="/coach" label={t("home.tiles.coach")} icon={MessageCircle} />
        <QuickTile href="/explore" label={t("home.tiles.explore")} icon={Compass} />
      </nav>

      {/* Today's mission: one-tap check-in once it's live */}
      {mission && mission.status !== "done" && mission.attemptId !== data.pendingMission?.attemptId && (
        <div className="animate-rise [animation-delay:80ms]">
          <MissionMoodCard attemptId={mission.attemptId} title={mission.title} />
        </div>
      )}

      {/* Week + today's plan */}
      <section aria-labelledby="week-title" className="space-y-3 animate-rise [animation-delay:120ms]">
        <h2 id="week-title" className="px-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">
          {t("home.plan.weekLabel", { week: data.week.number })}
        </h2>
        <DayPills start={data.week.monday} today={today} trained={data.week.days} locale={locale} label={t("home.plan.weekLabel", { week: data.week.number })} />
        {items.length > 0 && (
          <PlanChecklist title={t("home.plan.title")} summary={t("home.plan.summary", { done: completed, total: items.length })} items={items} percent={percent} />
        )}
      </section>

      {/* Coach's read */}
      <section aria-label={t("home.coachRead")} className="animate-rise [animation-delay:160ms]">
        <QuoteCard
          eyebrow={`${t("home.coachRead")} · ${data.insight.focus}`}
          footer={
            <div className="space-y-3">
              <p className="text-[14px] leading-relaxed text-ink-2">{data.insight.recommendation}</p>
              <div className="flex flex-wrap gap-2">
                {data.insight.drill && (
                  <Link
                    href={data.insight.drill.href}
                    className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-2 text-[13px] font-medium text-accent-ink hover:opacity-90"
                  >
                    {t("home.practiseIt", { tool: data.insight.drill.label })} <ArrowRight size={14} />
                  </Link>
                )}
                <Link href="/coach" className="inline-flex items-center gap-1.5 rounded-full bg-surface/70 px-3.5 py-2 text-[13px] font-medium hover:bg-surface">
                  <MessageCircle size={14} /> {t("home.askCoach")}
                </Link>
              </div>
            </div>
          }
        >
          {data.insight.observation}
        </QuoteCard>
      </section>

      {/* Weekly review / checkpoint */}
      {(data.weeklyDue || data.checkpoint) && (
        <section className="space-y-2.5 animate-rise [animation-delay:200ms]">
          {data.checkpoint && (
            <PromptRow
              href={`/checkpoint/${data.checkpoint}`}
              icon={<Sparkles size={18} />}
              title={t("home.prompts.checkpointTitle", { day: data.checkpoint })}
              body={t("home.prompts.checkpointBody")}
            />
          )}
          {data.weeklyDue && (
            <PromptRow href="/review/week" icon={<CalendarCheck size={18} />} title={t("home.prompts.weeklyTitle")} body={t("home.prompts.weeklyBody")} />
          )}
        </section>
      )}

      {/* Next level */}
      <section className="animate-rise [animation-delay:240ms]">
        <Link href="/profile" className="flex items-center gap-4 rounded-[22px] bg-surface px-5 py-4 shadow-card">
          <div className="min-w-0 flex-1">
            <p className="text-[13px] text-muted">
              {t("common.level", { level: data.level.level, name: t(`common.levels.${data.level.name}`) })}
            </p>
            <p className="mt-0.5 text-[15px] font-medium">
              {data.level.nextLevelXp
                ? t("home.nextGoal.toNext", { xp: data.level.nextLevelXp - data.totalXp, level: t(`common.levels.${data.level.nextName}`) })
                : t("home.nextGoal.top")}
            </p>
            <ProgressBar value={data.level.progress} className="mt-2" label={t("common.level", { level: data.level.level, name: t(`common.levels.${data.level.name}`) })} />
          </div>
          <ArrowRight size={18} className="text-muted" />
        </Link>
      </section>
    </div>
  );
}

/** Hero card over the dawn landscape. Text colours are fixed: the scene is light in both themes. */
function SceneCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate overflow-hidden rounded-[28px] p-6 text-[#1d2620] shadow-card">
      <DawnScene className="absolute inset-0 -z-10" />
      {children}
    </div>
  );
}

function PillLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="mt-5 inline-flex h-12 items-center gap-2 rounded-full bg-hero pr-2 pl-5 text-[15px] font-semibold text-hero-ink transition hover:opacity-95">
      {children}
      <span className="grid h-8 w-8 place-items-center rounded-full bg-hero-ink/15">
        <ArrowRight size={17} />
      </span>
    </Link>
  );
}

function PromptRow({ href, icon, title, body }: { href: string; icon: React.ReactNode; title: string; body: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-[22px] bg-surface px-4 py-3.5 shadow-card transition hover:bg-surface-2">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold">{title}</span>
        <span className="block text-[13px] text-ink-2">{body}</span>
      </span>
      <ArrowRight size={18} className="text-muted" />
    </Link>
  );
}
