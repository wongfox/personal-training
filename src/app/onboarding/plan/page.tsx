import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RoadmapTimeline } from "@/components/roadmap";
import { ButtonLink } from "@/components/ui/button";
import { getRoadmapView } from "@/server/services/catalog";
import { localDate } from "@/lib/dates";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { FREQUENCY_LABEL } from "@/server/engine/plan";
import { getActivePlan, getJourneyOutline } from "@/server/services/training";

export const metadata: Metadata = { title: "Your Growth Plan" };

export default async function PlanRevealPage() {
  const user = await requireUser();
  const db = getDb();
  const plan = await getActivePlan(db, user.id);
  if (!plan) redirect("/home");
  const [outline, roadmap] = await Promise.all([
    plan.journeyId ? getJourneyOutline(db, user.id, plan.journeyId, localDate(user.timezone)) : null,
    getRoadmapView(db, user.id, plan),
  ]);

  const rows: [string, string][] = [
    ["Daily commitment", `${plan.dailyMinutes} minutes`],
    ["Rhythm", FREQUENCY_LABEL[plan.frequency]],
    ["Duration", `${plan.durationDays} days`],
    ["Level", plan.level[0].toUpperCase() + plan.level.slice(1)],
  ];

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-6 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="flex-1">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-accent animate-fade">Your plan is ready</p>
        <h1 className="mt-3 font-display text-[44px] leading-[1.02] animate-rise">{plan.title}</h1>

        <section className="mt-8 rounded-3xl bg-hero p-6 text-hero-ink animate-rise [animation-delay:120ms]">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] opacity-60">Primary goal</p>
          <p className="mt-1 font-display text-[30px] leading-tight">{plan.primaryGoalName}</p>
          {plan.secondaryGoals.length > 0 && (
            <>
              <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.14em] opacity-60">Secondary goals</p>
              <p className="mt-1 text-[16px]">{plan.secondaryGoals.map((g) => g.name).join(" · ")}</p>
            </>
          )}
        </section>

        <dl className="mt-3 grid grid-cols-2 gap-3 animate-rise [animation-delay:200ms]">
          {rows.map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-surface p-4 shadow-card">
              <dt className="text-[12px] text-muted">{k}</dt>
              <dd className="mt-1 text-[17px] font-medium">{v}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-3 rounded-2xl bg-surface p-5 shadow-card animate-rise [animation-delay:280ms]">
          <div className="flex items-baseline justify-between">
            <p className="text-[15px] font-semibold">Your roadmap</p>
            <p className="text-[12px] text-muted">{roadmap.totalLessons} lessons · {roadmap.planDays} days</p>
          </div>
          <div className="mt-4">
            <RoadmapTimeline stages={roadmap.stages} planDays={roadmap.planDays} lastDay={roadmap.lastDay} />
          </div>
          {outline?.todayLesson && (
            <p className="mt-5 border-t border-line pt-4 text-[14px] text-ink-2">
              Day 1: <span className="font-medium text-ink">{outline.todayLesson.title}</span>
            </p>
          )}
        </section>

        {plan.ninetyDayGoal && (
          <blockquote className="mt-6 border-l-2 border-accent pl-4 animate-rise [animation-delay:360ms]">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">In 90 days</p>
            <p className="mt-1 font-display text-[22px] italic leading-snug">“{plan.ninetyDayGoal}”</p>
          </blockquote>
        )}
      </div>

      <div className="pt-8">
        <ButtonLink href="/home">Start Day 1</ButtonLink>
      </div>
    </div>
  );
}
