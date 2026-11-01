import { ArrowRight, Brain, CalendarCheck, Check, Clock, MessageCircle, Sparkles, Target } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { StreakBadge, WeekStrip } from "@/components/progress-widgets";
import { ContinueJourneyButton } from "./continue-journey";
import { ButtonLink } from "@/components/ui/button";
import { Card, Pill, ProgressBar, SectionTitle } from "@/components/ui/primitives";
import { formatDay, greeting, localDate } from "@/lib/dates";
import { categoryName } from "@/lib/taxonomy";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { trackDaily } from "@/server/platform";
import { getHomeData } from "@/server/services/home";

export const metadata: Metadata = { title: "Today" };

export default async function HomePage() {
  const user = await requireUser();
  const db = getDb();
  const today = localDate(user.timezone);
  const data = await getHomeData(db, user.id, today);
  if (!data) redirect("/onboarding");
  await trackDaily(db, user.id, "app_opened");

  const firstName = user.name.split(" ")[0];
  const { todayLesson, doneLesson, nextLesson } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-start justify-between gap-4 animate-fade">
        <div>
          <p className="text-[13px] text-muted">{formatDay(today, { weekday: "long", month: "long", day: "numeric" })}</p>
          <h1 className="mt-1 font-display text-[32px] leading-[1.05]">
            {greeting(user.timezone)}, {firstName}
          </h1>
          {data.streak.atRisk && data.streak.current > 0 && (
            <p className="mt-1.5 text-[13px] font-medium text-accent">Train today to keep your {data.streak.current}-day streak.</p>
          )}
        </div>
        <Link href="/profile" aria-label="Your streak and progress">
          <StreakBadge days={data.streak.current} atRisk={data.streak.atRisk} />
        </Link>
      </header>

      {/* Mission waiting for a check-in from a previous day */}
      {data.pendingMission && (
        <Link
          href={`/mission/${data.pendingMission.attemptId}`}
          className="flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent-soft px-4 py-3.5 animate-rise"
        >
          <CalendarCheck size={20} className="shrink-0 text-accent" />
          <span className="min-w-0 flex-1 text-[14px]">
            <span className="block font-semibold">Did you do it?</span>
            <span className="block truncate text-ink-2">{data.pendingMission.title}</span>
          </span>
          <ArrowRight size={18} className="text-accent" />
        </Link>
      )}

      {/* Today's training */}
      <section aria-labelledby="today-title" className="animate-rise">
        <div className="mb-3 flex items-baseline justify-between">
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">
            Day {data.dayNumber} <span className="text-line">/</span> {data.plan.durationDays}
          </p>
          {data.outline && <p className="text-[13px] text-muted">{data.outline.percent}% of {data.outline.journey.title}</p>}
        </div>

        {todayLesson ? (
          <div className="relative overflow-hidden rounded-[28px] bg-hero p-6 text-hero-ink">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/25 blur-3xl" aria-hidden />
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-hero-ink/60">Today&apos;s training</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-hero-ink/10 px-2.5 py-1 text-[12px] font-medium">{categoryName(todayLesson.category)}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-hero-ink/10 px-2.5 py-1 text-[12px] font-medium">
                <Clock size={12} /> {todayLesson.estimatedMinutes} min
              </span>
            </div>
            <h2 id="today-title" className="mt-3 font-display text-[30px] leading-[1.08]">
              {todayLesson.title}
            </h2>
            <p className="mt-2 text-[14px] text-hero-ink/70">{todayLesson.moduleTitle}</p>
            <ButtonLink href={`/lesson/${todayLesson.id}`} variant="accent" className="mt-6">
              {todayLesson.started ? "Continue training" : "Start today's training"}
              <ArrowRight size={18} />
            </ButtonLink>
          </div>
        ) : doneLesson ? (
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-success-soft text-success">
                <Check size={20} strokeWidth={2.6} />
              </span>
              <div>
                <p id="today-title" className="font-semibold">Today&apos;s training is done</p>
                <p className="text-[14px] text-ink-2">{doneLesson.title}</p>
              </div>
            </div>
            {nextLesson && (
              <p className="mt-5 border-t border-line pt-4 text-[14px] text-ink-2">
                Tomorrow: <span className="font-medium text-ink">{nextLesson.title}</span>
              </p>
            )}
          </Card>
        ) : data.masteryRep ? (
          <div className="relative overflow-hidden rounded-[28px] bg-hero p-6 text-hero-ink">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-hero-ink/60">Mastery block · today&apos;s rep</p>
            <h2 id="today-title" className="mt-3 font-display text-[30px] leading-[1.08]">
              {data.masteryRep.title.includes(":") ? data.masteryRep.title.split(":").slice(1).join(":").trim() : data.masteryRep.title}
            </h2>
            <p className="mt-2 text-[14px] text-hero-ink/70">
              {data.masteryRep.title.split(":")[0]} · {data.masteryRep.estimatedMinutes} min
            </p>
            {data.masteryRep.done ? (
              <p className="mt-6 flex items-center gap-2 text-[15px] font-medium">
                <Check size={18} strokeWidth={2.6} /> Done for today — come back tomorrow.
              </p>
            ) : (
              <ButtonLink href={`/practice/${data.masteryRep.slug}`} variant="accent" className="mt-6">
                Start today&apos;s rep
                <ArrowRight size={18} />
              </ButtonLink>
            )}
          </div>
        ) : data.continueJourney ? (
          <Card className="p-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">Next in your plan</p>
            <p className="mt-2 font-display text-[28px] leading-tight">{data.continueJourney.title}</p>
            <p className="mt-2 text-[15px] text-ink-2">You&apos;ve finished this journey. Pick up the next one in your roadmap.</p>
            <ContinueJourneyButton journeyId={data.continueJourney.id} />
          </Card>
        ) : data.journeyComplete ? (
          <Card className="p-6">
            <p className="font-display text-[26px]">Journey complete.</p>
            <p className="mt-2 text-[15px] text-ink-2">You finished {data.outline?.journey.title}. Choose your next journey to keep training.</p>
            <ButtonLink href="/journey#journeys" className="mt-5">Choose next journey</ButtonLink>
          </Card>
        ) : (
          <Card>
            <p className="text-[15px] text-ink-2">No journey selected yet.</p>
            <ButtonLink href="/journey#journeys" className="mt-4">Pick a journey</ButtonLink>
          </Card>
        )}
      </section>

      {/* Today's mission */}
      {(data.todaysMission || data.missionPreview) && (
        <section aria-labelledby="mission-title" className="animate-rise [animation-delay:60ms]">
          <SectionTitle>Today&apos;s mission</SectionTitle>
          <Card>
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface-2">
                <Target size={19} />
              </span>
              <div className="min-w-0">
                <h3 id="mission-title" className="text-[17px] font-semibold leading-snug">
                  {(data.todaysMission ?? data.missionPreview)!.title}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Pill>{(data.todaysMission ?? data.missionPreview)!.estimatedMinutes} min</Pill>
                  <Pill className="capitalize">{difficultyLabel((data.todaysMission ?? data.missionPreview)!.difficulty)}</Pill>
                </div>
              </div>
            </div>
            {data.todaysMission ? (
              data.todaysMission.status === "done" ? (
                <p className="mt-4 flex items-center gap-2 text-[14px] font-medium text-success">
                  <Check size={16} strokeWidth={2.6} /> Done{data.todaysMission.outcome ? ` · ${data.todaysMission.outcome}` : ""} — nice work.
                </p>
              ) : (
                <ButtonLink href={`/mission/${data.todaysMission.attemptId}`} variant="secondary" size="md" className="mt-5 w-full">
                  I did it — check in
                </ButtonLink>
              )
            ) : (
              <p className="mt-4 text-[13px] text-muted">Unlocks at the end of today&apos;s lesson.</p>
            )}
          </Card>
        </section>
      )}

      {/* Coach's read */}
      <section aria-labelledby="coach-title" className="animate-rise [animation-delay:120ms]">
        <SectionTitle
          action={
            <Link href="/coach" className="inline-flex items-center gap-1 text-[13px] font-medium text-ink-2 hover:text-ink">
              <MessageCircle size={14} /> Ask your coach
            </Link>
          }
        >
          <span id="coach-title">Coach&apos;s read</span>
        </SectionTitle>
        <Card className="border-l-[3px] border-accent">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-accent">{data.insight.focus}</p>
          <p className="mt-2 text-[16px] leading-relaxed">{data.insight.observation}</p>
          <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{data.insight.recommendation}</p>
          {data.insight.drill && (
            <Link
              href={data.insight.drill.href}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3.5 py-2 text-[13px] font-medium hover:bg-line"
            >
              Practise it: {data.insight.drill.label} <ArrowRight size={14} />
            </Link>
          )}
        </Card>
      </section>

      {/* Reviews / weekly review / checkpoint */}
      {(data.dueReviews > 0 || data.weeklyDue || data.checkpoint) && (
        <section className="space-y-2.5 animate-rise [animation-delay:160ms]">
          {data.checkpoint && (
            <PromptRow href={`/checkpoint/${data.checkpoint}`} icon={<Sparkles size={18} />} title={`Day ${data.checkpoint} checkpoint`} body="See how far you've come — before vs. now." />
          )}
          {data.weeklyDue && (
            <PromptRow href="/review/week" icon={<CalendarCheck size={18} />} title="Your week in review" body="Two minutes to look back and set next week's focus." />
          )}
          {data.dueReviews > 0 && (
            <PromptRow
              href="/review"
              icon={<Brain size={18} />}
              title={`${data.dueReviews} ${data.dueReviews === 1 ? "concept" : "concepts"} to refresh`}
              body="Quick recall keeps what you learned from fading."
            />
          )}
        </section>
      )}

      {/* Weekly progress */}
      <section aria-labelledby="week-title" className="animate-rise [animation-delay:200ms]">
        <SectionTitle>
          <span id="week-title">Week {data.week.number} of your plan</span>
        </SectionTitle>
        <Card>
          <WeekStrip monday={data.week.monday} days={data.week.days} today={today} />
          <div className="mt-5 flex items-center justify-between text-[14px]">
            <span className="font-medium">
              {data.week.count}/{data.week.target} training days
            </span>
            <span className="text-muted">
              {data.week.count >= data.week.target ? "Target hit" : `${data.week.target - data.week.count} to go`}
            </span>
          </div>
          <ProgressBar value={(data.week.count / data.week.target) * 100} tone="accent" className="mt-2" label="Weekly target" />
        </Card>
      </section>

      {/* Next goal */}
      <section className="animate-rise [animation-delay:240ms]">
        <Link href="/profile" className="flex items-center gap-4 rounded-2xl px-1 py-2">
          <div className="min-w-0 flex-1">
            <p className="text-[13px] text-muted">
              Level {data.level.level} · {data.level.name}
            </p>
            <p className="mt-0.5 text-[15px] font-medium">
              {data.level.nextLevelXp
                ? `${data.level.nextLevelXp - data.totalXp} XP to ${data.level.nextName}`
                : "Top level reached"}
            </p>
            <ProgressBar value={data.level.progress} className="mt-2" label="Level progress" />
          </div>
          <ArrowRight size={18} className="text-muted" />
        </Link>
      </section>
    </div>
  );
}

function difficultyLabel(d: string) {
  return d === "beginner" ? "Easy" : d === "intermediate" ? "Medium" : "Stretch";
}

function PromptRow({ href, icon, title, body }: { href: string; icon: React.ReactNode; title: string; body: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3.5 shadow-card transition hover:bg-surface-2">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-2 text-ink">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold">{title}</span>
        <span className="block text-[13px] text-ink-2">{body}</span>
      </span>
      <ArrowRight size={18} className="text-muted" />
    </Link>
  );
}
