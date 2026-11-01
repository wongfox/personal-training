import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { FocusShell } from "@/components/focus-shell";
import { ButtonLink } from "@/components/ui/button";
import { localDate } from "@/lib/dates";
import { SKILLS } from "@/lib/taxonomy";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { type CheckpointDay, getCheckpointData } from "@/server/services/progress";
import { getActivePlan } from "@/server/services/training";
import { CheckpointForm } from "./form";

export const metadata: Metadata = { title: "Checkpoint" };

export default async function CheckpointPage({ params }: PageProps<"/checkpoint/[day]">) {
  const day = Number((await params).day);
  if (![30, 60, 90].includes(day)) notFound();
  const user = await requireUser();
  const db = getDb();
  const today = localDate(user.timezone);
  const plan = await getActivePlan(db, user.id);
  if (!plan) redirect("/onboarding");
  const data = await getCheckpointData(db, user.id, day as CheckpointDay, today, plan);

  if (!data.available) {
    return (
      <FocusShell footer={<ButtonLink href="/home">Back to today</ButtonLink>}>
        <div className="pt-16 text-center">
          <h1 className="font-display text-[32px]">Day {day} isn&apos;t here yet.</h1>
          <p className="mt-3 text-ink-2">Keep training — your checkpoint opens on day {day + 1} of your plan.</p>
        </div>
      </FocusShell>
    );
  }

  const skillName = (key: string) => SKILLS.find((s) => s.key === key)?.name ?? key;

  return (
    <FocusShell top={<p className="text-[13px] text-muted">Day {day} checkpoint</p>}>
      <div className="pt-4">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-accent">Day {day}</p>
        <h1 className="mt-2 font-display text-[40px] leading-[1.02]">Before → Now</h1>
        {data.ninetyDayGoal && (
          <blockquote className="mt-5 border-l-2 border-accent pl-4">
            <p className="text-[12px] text-muted">Your 90-day goal</p>
            <p className="mt-1 font-display text-[20px] italic leading-snug">“{data.ninetyDayGoal}”</p>
          </blockquote>
        )}

        <section className="mt-8">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">Measured skill</h2>
          <ul className="mt-3 space-y-3 rounded-3xl bg-surface p-5 shadow-card">
            {data.skills.map((s) => (
              <li key={s.key}>
                <div className="flex items-baseline justify-between text-[14px]">
                  <span className="font-medium">{s.name}</span>
                  <span className="tabular-nums text-ink-2">
                    {s.baseline} → <span className="font-semibold text-ink">{s.score}</span>
                    {s.score > s.baseline && <span className="ml-1 text-success">+{s.score - s.baseline}</span>}
                  </span>
                </div>
                <div className="relative mt-1.5 h-1.5 rounded-full bg-surface-2">
                  <div className="absolute inset-y-0 left-0 rounded-full bg-ink/25" style={{ width: `${s.baseline}%` }} />
                  <div className="absolute inset-y-0 left-0 rounded-full bg-accent transition-[width] duration-700" style={{ width: `${s.score}%`, opacity: 0.85 }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6 grid grid-cols-3 gap-2.5">
          {[
            ["Days trained", data.totals.daysTrained],
            ["Lessons", data.totals.lessons],
            ["Missions", data.totals.actions],
            ["Exercises", data.totals.exercises],
            ["Reflections", data.totals.reflections],
            ["Best streak", data.totals.longestStreak],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-surface p-3.5 shadow-card">
              <p className="text-[12px] text-muted">{k}</p>
              <p className="mt-1 text-[20px] font-semibold tabular-nums">{v}</p>
            </div>
          ))}
        </section>

        {data.completed && data.now ? (
          <section className="mt-8">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">How you rate yourself</h2>
            <ul className="mt-3 divide-y divide-line rounded-3xl bg-surface px-5 shadow-card">
              {Object.keys(data.now).map((k) => (
                <li key={k} className="flex items-center justify-between py-3 text-[14px]">
                  <span>{skillName(k)}</span>
                  <span className="tabular-nums">
                    {data.before[k] ?? "—"} → <span className="font-semibold">{data.now![k]}</span> / 5
                  </span>
                </li>
              ))}
            </ul>
            <ButtonLink href="/home" className="mt-8">
              Back to today
            </ButtonLink>
          </section>
        ) : (
          <CheckpointForm day={day} questions={data.questions} />
        )}
      </div>
    </FocusShell>
  );
}
