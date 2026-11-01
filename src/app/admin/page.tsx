import type { Metadata } from "next";
import Link from "next/link";
import { requirePermission } from "@/server/auth/current-user";
import { can } from "@/server/auth/rbac";
import { getDb } from "@/server/db";
import { getMetrics, reviewQueue } from "@/server/services/admin";
import { PageHeader, Panel } from "./ui";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  const user = await requirePermission("admin:access");
  const db = getDb();
  const showMetrics = can(user.roles, "metrics:read");
  const [metrics, queue] = await Promise.all([showMetrics ? getMetrics(db) : null, can(user.roles, "content:read") ? reviewQueue(db) : []]);

  return (
    <div className="max-w-6xl">
      <PageHeader title="Dashboard" subtitle="How learners are training — and what needs your attention." />

      {metrics && (
        <>
          <section aria-label="Key metrics" className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Kpi label="Registered users" value={metrics.registered} note={`${metrics.onboarded} with a plan`} />
            <Kpi label="DAU / WAU / MAU" value={`${metrics.dau} / ${metrics.wau} / ${metrics.mau}`} note="active learners (staff excluded)" />
            <Kpi label="Lessons completed" value={metrics.lessonsCompleted} note={`${metrics.lessonsThisWeek} this week`} />
            <Kpi label="Completion rate" value={`${metrics.completionRate}%`} note="lessons finished once started" />
            <Kpi label="Average streak" value={metrics.averageStreak} note="days, all learners" />
            <Kpi
              label="D7 retention"
              value={metrics.retention.cohort ? `${Math.round((metrics.retention.retained / metrics.retention.cohort) * 100)}%` : "—"}
              note={metrics.retention.cohort ? `${metrics.retention.retained} of ${metrics.retention.cohort} sign-ups` : "no 7-day cohort yet"}
            />
            <Kpi label="Active journeys" value={metrics.activeJourneys.reduce((s, j) => s + j.n, 0)} note={`${metrics.activeJourneys.length} programmes`} />
            <Kpi label="Weekly engagement" value={metrics.learners ? `${Math.round((metrics.wau / metrics.learners) * 100)}%` : "—"} note="WAU ÷ learners with a plan" />
          </section>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Panel>
              <h2 className="text-[15px] font-semibold">Daily active learners · 14 days</h2>
              <DailyBars data={metrics.daily} />
            </Panel>
            <Panel>
              <h2 className="text-[15px] font-semibold">Activation funnel</h2>
              <ul className="mt-4 space-y-3">
                {metrics.funnel.map((f) => {
                  const pct = metrics.funnel[0].n ? Math.round((f.n / metrics.funnel[0].n) * 100) : 0;
                  return (
                    <li key={f.label}>
                      <div className="flex justify-between text-[13px]">
                        <span>{f.label}</span>
                        <span className="tabular-nums text-ink-2">
                          {f.n} · {pct}%
                        </span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-surface-2">
                        <div className="h-2 rounded-full bg-ink" style={{ width: `${pct}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Panel>
            <Panel>
              <h2 className="text-[15px] font-semibold">Active journeys</h2>
              {metrics.activeJourneys.length === 0 ? (
                <p className="mt-3 text-[14px] text-muted">No active learners yet.</p>
              ) : (
                <ul className="mt-3 divide-y divide-line text-[14px]">
                  {metrics.activeJourneys.map((j) => (
                    <li key={j.title} className="flex justify-between py-2">
                      <span>{j.title}</span>
                      <span className="tabular-nums text-ink-2">{j.n}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
            <Panel>
              <h2 className="text-[15px] font-semibold">Events · last 30 days</h2>
              <ul className="mt-3 grid grid-cols-2 gap-x-6 text-[13px]">
                {metrics.events.slice(0, 16).map((e) => (
                  <li key={e.name} className="flex justify-between border-b border-line py-1.5">
                    <span className="font-mono text-[12px] text-ink-2">{e.name}</span>
                    <span className="tabular-nums">{e.n}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </>
      )}

      {queue.length > 0 || !metrics ? (
        <Panel className="mt-6">
          <h2 className="text-[15px] font-semibold">Waiting for review</h2>
          {queue.length === 0 ? (
            <p className="mt-2 text-[14px] text-muted">Nothing in review.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line text-[14px]">
              {queue.map((q) => (
                <li key={q.href} className="flex items-center justify-between py-2.5">
                  <span>
                    <span className="mr-2 text-[12px] uppercase tracking-wider text-muted">{q.kind}</span>
                    {q.title}
                  </span>
                  <Link href={q.href} className="text-[13px] font-medium underline underline-offset-4">
                    Open
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      ) : null}
    </div>
  );
}

function Kpi({ label, value, note }: { label: string; value: string | number; note?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <p className="text-[12px] text-muted">{label}</p>
      <p className="mt-1 text-[24px] font-semibold tabular-nums">{value}</p>
      {note && <p className="mt-0.5 text-[12px] text-ink-2">{note}</p>}
    </div>
  );
}

function DailyBars({ data }: { data: { day: string; n: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.n));
  if (data.length === 0) return <p className="mt-3 text-[14px] text-muted">No activity yet.</p>;
  return (
    <div className="mt-4 flex h-36 items-end gap-1.5" role="img" aria-label="Daily active learners for the last 14 days">
      {data.map((d) => (
        <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
          <span className="text-[10px] tabular-nums text-muted">{d.n}</span>
          <div className="w-full rounded-t-md bg-accent" style={{ height: `${(d.n / max) * 100}px` }} title={`${d.day}: ${d.n}`} />
          <span className="text-[9px] text-muted">{d.day.slice(8)}</span>
        </div>
      ))}
    </div>
  );
}
