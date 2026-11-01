import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FocusShell } from "@/components/focus-shell";
import { ButtonLink } from "@/components/ui/button";
import { formatDay, localDate } from "@/lib/dates";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { reviewableWeek, weeklyReviewDue } from "@/server/services/home";
import { computeWeeklyStats, listWeeklyReviews } from "@/server/services/progress";
import { getActivePlan } from "@/server/services/training";
import { WeeklyReviewForm } from "./form";

export const metadata: Metadata = { title: "Your week" };

export default async function WeeklyReviewPage() {
  const user = await requireUser();
  const db = getDb();
  const today = localDate(user.timezone);
  const plan = await getActivePlan(db, user.id);
  if (!plan) redirect("/onboarding");
  const week = reviewableWeek(plan.startDate, today);

  if (!(await weeklyReviewDue(db, user.id, today, plan.startDate))) {
    const [last] = await listWeeklyReviews(db, user.id);
    return (
      <FocusShell footer={<ButtonLink href="/home">Back to today</ButtonLink>}>
        <div className="pt-10">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-accent">Weekly review</p>
          <h1 className="mt-2 font-display text-[34px] leading-tight">Your next review opens {formatDay(week.nextOpensOn, { weekday: "long", month: "short", day: "numeric" })}.</h1>
          <p className="mt-3 text-[15px] text-ink-2">Each plan week is reviewed once, after its seventh day.</p>
          {last && (
            <div className="mt-8 rounded-3xl bg-ink p-6 text-bg">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-bg/60">This week&apos;s focus</p>
              <p className="mt-2 font-display text-[26px] leading-tight">{last.nextFocus.headline}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-bg/80">{last.nextFocus.detail}</p>
            </div>
          )}
        </div>
      </FocusShell>
    );
  }

  const { stats } = await computeWeeklyStats(db, user.id, today, plan, week.weekStart);
  const rows: [string, string][] = [
    ["Lessons completed", `${stats.lessonsCompleted}/${stats.lessonsTarget}`],
    ["Missions completed", `${stats.actionsCompleted}/${stats.actionsTarget}`],
    ["Days trained", `${stats.daysTrained}/7`],
    ["Current streak", `${stats.currentStreak} day${stats.currentStreak === 1 ? "" : "s"}`],
    ["Time trained", `${stats.minutesTrained} min`],
    ["XP earned", `${stats.xpEarned}`],
  ];

  return (
    <FocusShell top={<p className="text-[13px] text-muted">Weekly review</p>}>
      <div className="pt-4">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-accent">
          Week {week.index} · {formatDay(stats.weekStart)} – {formatDay(stats.weekEnd)}
        </p>
        <h1 className="mt-2 font-display text-[40px] leading-none">Your week</h1>

        <dl className="mt-7 divide-y divide-line rounded-3xl bg-surface px-5 shadow-card">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-3.5">
              <dt className="text-[15px] text-ink-2">{k}</dt>
              <dd className="text-[16px] font-semibold tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-success-soft p-4">
            <p className="text-[12px] text-success">Strongest skill</p>
            <p className="mt-1 text-[17px] font-semibold">{stats.strongestSkill?.name ?? "—"}</p>
            {stats.strongestSkill && <p className="text-[12px] text-ink-2">+{stats.strongestSkill.delta} this week</p>}
          </div>
          <div className="rounded-2xl bg-accent-soft p-4">
            <p className="text-[12px] text-accent">Needs attention</p>
            <p className="mt-1 text-[17px] font-semibold">{stats.needsAttention?.name ?? plan.primarySkill.name}</p>
            <p className="text-[12px] text-ink-2">+{stats.needsAttention?.delta ?? 0} this week</p>
          </div>
        </div>

        <WeeklyReviewForm />
      </div>
    </FocusShell>
  );
}
