import { Check, Lock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, Pill, ProgressBar, Ring, SectionTitle } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { localDate } from "@/lib/dates";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import type { OutlineModule } from "@/server/services/training";
import { getActivePlan, getJourneyOutline } from "@/server/services/training";
import { listJourneys } from "@/server/services/catalog";
import { SwitchJourneyButton } from "./switch-journey";

export const metadata: Metadata = { title: "Journey" };

export default async function JourneyPage() {
  const user = await requireUser();
  const db = getDb();
  const today = localDate(user.timezone);
  const plan = await getActivePlan(db, user.id);
  if (!plan) redirect("/onboarding");
  const [outline, journeys] = await Promise.all([
    plan.journeyId ? getJourneyOutline(db, user.id, plan.journeyId, today) : null,
    listJourneys(db, user.id),
  ]);

  return (
    <div className="space-y-8">
      {outline ? (
        <>
          <header className="animate-fade">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-accent">Your journey</p>
            <div className="mt-2 flex items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-[34px] leading-[1.05]">{outline.journey.title}</h1>
                {outline.journey.subtitle && <p className="mt-1.5 text-[15px] text-ink-2">{outline.journey.subtitle}</p>}
              </div>
              <Ring value={outline.percent} size={60} label={`${outline.percent}% complete`}>
                <span className="text-[13px] font-semibold tabular-nums">{outline.percent}%</span>
              </Ring>
            </div>
            <p className="mt-3 text-[13px] text-muted">
              {outline.completed} of {outline.total} lessons · {outline.modules.length} modules
            </p>
          </header>

          <ol className="space-y-4">
            {outline.modules.map((m, i) => (
              <ModuleCard key={m.id} module={m} index={i} />
            ))}
          </ol>
        </>
      ) : (
        <header>
          <h1 className="font-display text-[34px]">Choose a journey</h1>
          <p className="mt-2 text-ink-2">Pick a path to start your daily training.</p>
        </header>
      )}

      <section id="journeys" aria-labelledby="all-journeys">
        <SectionTitle>
          <span id="all-journeys">All journeys</span>
        </SectionTitle>
        <ul className="space-y-2.5">
          {journeys.map((j) => (
            <li key={j.id}>
              <Card className="flex items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{j.title}</p>
                  <p className="mt-0.5 text-[13px] text-ink-2">
                    {j.lessons} lessons · {j.difficulty}
                    {j.completed > 0 && ` · ${j.completed} done`}
                  </p>
                </div>
                {j.id === plan.journeyId ? (
                  <Pill className="bg-accent-soft text-accent">Current</Pill>
                ) : (
                  <SwitchJourneyButton journeyId={j.id} title={j.title} />
                )}
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ModuleCard({ module: m, index }: { module: OutlineModule; index: number }) {
  const pct = m.lessons.length ? Math.round((m.completed / m.lessons.length) * 100) : 0;
  const state = pct === 100 ? "Completed" : m.lessons.some((l) => l.state === "today") || m.completed > 0 ? "In progress" : "Upcoming";
  return (
    <li className="animate-rise" style={{ animationDelay: `${index * 50}ms` }}>
      <Card className="p-0">
        <div className="p-5 pb-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">Module {index + 1}</p>
            <p className={cn("text-[12px] font-medium", state === "Completed" ? "text-success" : state === "In progress" ? "text-accent" : "text-muted")}>
              {state}
            </p>
          </div>
          <h2 className="mt-1 text-[19px] font-semibold">{m.title}</h2>
          <p className="mt-1 text-[13px] text-muted">
            {m.lessons.length} lessons · ~{m.estimatedMinutes} min · {pct}%
          </p>
          <ProgressBar value={pct} tone={pct === 100 ? "success" : "ink"} className="mt-3" label={`${m.title} progress`} />
        </div>
        <ol className="border-t border-line">
          {m.lessons.map((l, i) => {
            const content = (
              <>
                <span
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] font-semibold",
                    l.state === "completed" && "bg-success-soft text-success",
                    l.state === "today" && "bg-accent text-accent-ink",
                    l.state === "locked" && "border border-line text-muted",
                  )}
                  aria-hidden
                >
                  {l.state === "completed" ? <Check size={14} strokeWidth={3} /> : l.state === "locked" ? <Lock size={12} /> : i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cn("block text-[15px]", l.state === "locked" ? "text-ink-2" : "font-medium")}>{l.title}</span>
                  <span className="block text-[12px] text-muted">
                    {l.state === "today" ? (l.started ? "In progress · today" : "Today") : `${l.estimatedMinutes} min`}
                  </span>
                </span>
              </>
            );
            return (
              <li key={l.id} className="border-b border-line last:border-b-0">
                {l.state === "locked" ? (
                  <div className="flex items-center gap-3 px-5 py-3.5" aria-label={`${l.title}, locked`}>
                    {content}
                  </div>
                ) : (
                  <Link href={`/lesson/${l.id}`} className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-surface-2">
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </Card>
    </li>
  );
}
