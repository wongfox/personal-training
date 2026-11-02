import type { Metadata } from "next";
import Link from "next/link";
import { getTranslator } from "@/i18n/server";
import { requirePermission } from "@/server/auth/current-user";
import { can } from "@/server/auth/rbac";
import { getDb } from "@/server/db";
import { getMetrics, reviewQueue } from "@/server/services/admin";
import { formatNumber, PageHeader, Panel, PanelTitle } from "./ui";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("admin.dashboard.title") };
}

export default async function AdminDashboard() {
  const user = await requirePermission("admin:access");
  const { t, locale } = await getTranslator();
  const db = getDb();
  const showMetrics = can(user.roles, "metrics:read");
  const [metrics, queue] = await Promise.all([showMetrics ? getMetrics(db) : null, can(user.roles, "content:read") ? reviewQueue(db) : []]);
  const n = (value: number) => formatNumber(value, locale);
  const pct = (part: number, whole: number) => (whole ? `${Math.round((part / whole) * 100)}%` : "—");

  return (
    <div className="max-w-6xl">
      <PageHeader title={t("admin.dashboard.title")} subtitle={t("admin.dashboard.subtitle")} />

      {metrics && (
        <>
          <section aria-label={t("admin.dashboard.keyMetrics")} className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Kpi label={t("admin.dashboard.registered")} value={n(metrics.registered)} note={t("admin.dashboard.registeredNote", { count: n(metrics.onboarded) })} />
            <Kpi label={t("admin.dashboard.active")} value={`${n(metrics.dau)} / ${n(metrics.wau)} / ${n(metrics.mau)}`} note={t("admin.dashboard.activeNote")} />
            <Kpi label={t("admin.dashboard.lessons")} value={n(metrics.lessonsCompleted)} note={t("admin.dashboard.lessonsNote", { count: n(metrics.lessonsThisWeek) })} />
            <Kpi label={t("admin.dashboard.completion")} value={`${metrics.completionRate}%`} note={t("admin.dashboard.completionNote")} />
            <Kpi label={t("admin.dashboard.streak")} value={n(metrics.averageStreak)} note={t("admin.dashboard.streakNote")} />
            <Kpi
              label={t("admin.dashboard.retention")}
              value={pct(metrics.retention.retained, metrics.retention.cohort)}
              note={
                metrics.retention.cohort
                  ? t("admin.dashboard.retentionNote", { retained: n(metrics.retention.retained), cohort: n(metrics.retention.cohort) })
                  : t("admin.dashboard.retentionEmpty")
              }
            />
            <Kpi
              label={t("admin.dashboard.inJourney")}
              value={n(metrics.activeJourneys.reduce((s, j) => s + j.n, 0))}
              note={t("admin.dashboard.inJourneyNote", { count: metrics.activeJourneys.length })}
            />
            <Kpi label={t("admin.dashboard.engagement")} value={pct(metrics.wau, metrics.learners)} note={t("admin.dashboard.engagementNote")} />
          </section>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Panel>
              <PanelTitle>{t("admin.dashboard.daily")}</PanelTitle>
              <DailyBars data={metrics.daily} label={t("admin.dashboard.dailyAria")} empty={t("admin.dashboard.noActivity")} />
            </Panel>
            <Panel>
              <PanelTitle>{t("admin.dashboard.funnel")}</PanelTitle>
              <ul className="mt-4 space-y-3">
                {metrics.funnel.map((f) => {
                  const share = metrics.funnel[0].n ? Math.round((f.n / metrics.funnel[0].n) * 100) : 0;
                  return (
                    <li key={f.key}>
                      <div className="flex justify-between gap-3 text-[13px]">
                        <span>{t(`admin.dashboard.funnelSteps.${f.key}`)}</span>
                        <span className="tabular-nums text-ink-2">
                          {n(f.n)} · {share}%
                        </span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-surface-2">
                        <div className="h-2 rounded-full bg-hero" style={{ width: `${share}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Panel>
            <Panel>
              <PanelTitle>{t("admin.dashboard.activeJourneys")}</PanelTitle>
              {metrics.activeJourneys.length === 0 ? (
                <p className="mt-3 text-[14px] text-muted">{t("admin.dashboard.noActiveLearners")}</p>
              ) : (
                <ul className="mt-3 divide-y divide-line text-[14px]">
                  {metrics.activeJourneys.map((j) => (
                    <li key={j.title} className="flex justify-between gap-3 py-2">
                      <span className="min-w-0 truncate">{j.title}</span>
                      <span className="tabular-nums text-ink-2">{n(j.n)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
            <Panel>
              <PanelTitle>{t("admin.dashboard.events")}</PanelTitle>
              <ul className="mt-3 grid gap-x-6 text-[13px] sm:grid-cols-2">
                {metrics.events.slice(0, 16).map((e) => (
                  <li key={e.name} className="flex justify-between gap-3 border-b border-line py-1.5">
                    <span className="min-w-0 truncate font-mono text-[12px] text-ink-2">{e.name}</span>
                    <span className="tabular-nums">{n(e.n)}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </>
      )}

      {queue.length > 0 || !metrics ? (
        <Panel className="mt-6">
          <PanelTitle>{t("admin.dashboard.review")}</PanelTitle>
          {queue.length === 0 ? (
            <p className="mt-2 text-[14px] text-muted">{t("admin.dashboard.nothingInReview")}</p>
          ) : (
            <ul className="mt-3 divide-y divide-line text-[14px]">
              {queue.map((q) => (
                <li key={q.href} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="min-w-0">
                    <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{t(`admin.kinds.${q.kindKey}`)}</span>
                    {q.title}
                  </span>
                  <Link href={q.href} className="shrink-0 text-[13px] font-medium underline underline-offset-4">
                    {t("admin.dashboard.open")}
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
    <div className="rounded-[22px] bg-surface p-4 shadow-card">
      <p className="text-[12px] text-muted">{label}</p>
      <p className="mt-1 font-display text-[30px] leading-none tabular-nums">{value}</p>
      {note && <p className="mt-1.5 text-[12px] text-ink-2">{note}</p>}
    </div>
  );
}

function DailyBars({ data, label, empty }: { data: { day: string; n: number }[]; label: string; empty: string }) {
  const max = Math.max(1, ...data.map((d) => d.n));
  if (data.length === 0) return <p className="mt-3 text-[14px] text-muted">{empty}</p>;
  return (
    <div className="mt-4 flex h-36 items-end gap-1.5" role="img" aria-label={label}>
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
