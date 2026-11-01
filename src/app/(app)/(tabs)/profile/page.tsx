import { Award, ChevronRight, Lock, LogOut, Settings, Shield } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/(auth)/actions";
import { StreakBadge } from "@/components/progress-widgets";
import { InstallButton } from "@/components/pwa/install-button";
import { Sparkline } from "@/components/sparkline";
import { Card, ProgressBar, SectionTitle } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { formatDay, localDate } from "@/lib/dates";
import { requireUser } from "@/server/auth/current-user";
import { can } from "@/server/auth/rbac";
import { getDb } from "@/server/db";
import { FREQUENCY_LABEL } from "@/server/engine/plan";
import { getProfileData, listWeeklyReviews } from "@/server/services/progress";
import { getActivePlan, getJourneyOutline } from "@/server/services/training";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const user = await requireUser();
  const db = getDb();
  const today = localDate(user.timezone);
  const plan = await getActivePlan(db, user.id);
  if (!plan) redirect("/onboarding");
  const [data, outline, reviews] = await Promise.all([
    getProfileData(db, user.id, today),
    plan.journeyId ? getJourneyOutline(db, user.id, plan.journeyId, today) : null,
    listWeeklyReviews(db, user.id),
  ]);
  const initials = user.name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  const overall = data.skills.length ? Math.round(data.skills.reduce((s, k) => s + k.score, 0) / data.skills.length) : 0;
  const overallBaseline = data.skills.length ? Math.round(data.skills.reduce((s, k) => s + k.baseline, 0) / data.skills.length) : 0;

  return (
    <div className="space-y-7">
      <header className="flex items-center gap-4 animate-fade">
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatarUrl} alt="" className="h-16 w-16 rounded-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <span className="grid h-16 w-16 place-items-center rounded-full bg-ink font-display text-[24px] text-bg">{initials}</span>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-[30px] leading-none">{user.name}</h1>
          <p className="mt-1.5 text-[14px] text-ink-2">
            Level {data.level.level} · {data.level.name}
          </p>
        </div>
        <StreakBadge days={data.streak.current} />
      </header>

      {/* Level & XP */}
      <Card>
        <div className="flex items-baseline justify-between">
          <p className="text-[28px] font-semibold tabular-nums">
            {data.totalXp.toLocaleString("en-US")} <span className="text-[14px] font-normal text-muted">XP</span>
          </p>
          <p className="text-[13px] text-muted">
            {data.level.nextLevelXp ? `${(data.level.nextLevelXp - data.totalXp).toLocaleString("en-US")} to ${data.level.nextName}` : "Top level"}
          </p>
        </div>
        <ProgressBar value={data.level.progress} tone="accent" className="mt-3" label="Level progress" />
        <div className="mt-4 grid grid-cols-5 gap-1 text-center text-[10px] text-muted">
          {["Explorer", "Learner", "Practitioner", "Performer", "Master"].map((n, i) => (
            <span key={n} className={cn(i + 1 <= data.level.level && "font-semibold text-ink")}>
              {n}
            </span>
          ))}
        </div>
      </Card>

      {/* Skills */}
      <section aria-labelledby="skills-title">
        <SectionTitle>
          <span id="skills-title">Skills</span>
        </SectionTitle>
        <Card>
          <div className="flex items-end justify-between border-b border-line pb-4">
            <div>
              <p className="text-[13px] text-muted">Overall</p>
              <p className="text-[32px] font-semibold leading-none tabular-nums">{overall}</p>
            </div>
            <p className="text-[13px] text-ink-2">
              {overall > overallBaseline ? <span className="font-semibold text-success">+{overall - overallBaseline}</span> : "±0"} since day 1
            </p>
          </div>
          <ul className="mt-2 divide-y divide-line">
            {data.skills.map((s) => (
              <li key={s.key} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[15px] font-medium">{s.name}</span>
                    <span className="text-[13px] tabular-nums text-ink-2">
                      {s.score}
                      {s.score > s.baseline && <span className="ml-1 text-success">+{s.score - s.baseline}</span>}
                    </span>
                  </div>
                  <ProgressBar value={s.score} className="mt-1.5" label={`${s.name} score`} />
                </div>
                <Sparkline points={s.history.map((h) => h.score)} />
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Stats */}
      <section aria-labelledby="stats-title">
        <SectionTitle>
          <span id="stats-title">Statistics</span>
        </SectionTitle>
        <dl className="grid grid-cols-3 gap-2.5">
          {[
            ["Days trained", data.totals.daysTrained],
            ["Lessons", data.totals.lessons],
            ["Exercises", data.totals.exercises],
            ["Missions", data.totals.actions],
            ["Reflections", data.totals.reflections],
            ["Minutes", data.totals.minutes],
            ["Current streak", data.streak.current],
            ["Best streak", data.streak.longest],
            ["Journey", outline ? `${outline.percent}%` : "—"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-surface p-3.5 shadow-card">
              <dt className="text-[11px] text-muted">{k}</dt>
              <dd className="mt-1 text-[20px] font-semibold tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Plan & goals */}
      <section aria-labelledby="plan-title">
        <SectionTitle>
          <span id="plan-title">{plan.title}</span>
        </SectionTitle>
        <Card className="space-y-3 text-[14px]">
          <Row label="Primary goal" value={plan.primaryGoalName} />
          {plan.secondaryGoals.length > 0 && <Row label="Secondary goals" value={plan.secondaryGoals.map((g) => g.name).join(", ")} />}
          <Row label="Commitment" value={`${plan.dailyMinutes} min · ${FREQUENCY_LABEL[plan.frequency]}`} />
          <Row label="Started" value={formatDay(plan.startDate, { month: "long", day: "numeric", year: "numeric" })} />
          {plan.mainChallenge && <Row label="Main challenge" value={plan.mainChallenge} />}
          {plan.ninetyDayGoal && <p className="border-t border-line pt-3 font-display text-[18px] italic leading-snug">“{plan.ninetyDayGoal}”</p>}
        </Card>
      </section>

      {/* Achievements */}
      <section aria-labelledby="ach-title">
        <SectionTitle>
          <span id="ach-title">Achievements</span>
        </SectionTitle>
        <ul className="grid grid-cols-3 gap-2.5">
          {data.achievements.map((a) => (
            <li
              key={a.key}
              title={a.description}
              className={cn("flex flex-col items-center rounded-2xl p-3 text-center", a.earnedAt ? "bg-surface shadow-card" : "border border-dashed border-line")}
            >
              <span className={cn("grid h-10 w-10 place-items-center rounded-full", a.earnedAt ? "bg-accent-soft text-accent" : "bg-surface-2 text-muted")}>
                {a.earnedAt ? <Award size={18} /> : <Lock size={14} />}
              </span>
              <span className={cn("mt-2 text-[12px] font-medium leading-tight", !a.earnedAt && "text-muted")}>{a.title}</span>
              <span className="mt-0.5 text-[10px] leading-tight text-muted">{a.description}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* History */}
      <section aria-labelledby="hist-title">
        <SectionTitle>
          <span id="hist-title">Recent activity</span>
        </SectionTitle>
        {data.history.length === 0 ? (
          <p className="text-[14px] text-ink-2">Your training history will show up here.</p>
        ) : (
          <ul className="divide-y divide-line rounded-3xl bg-surface px-5 shadow-card">
            {data.history.map((h, i) => (
              <li key={i} className="flex items-center justify-between py-3 text-[14px]">
                <span>
                  {h.label} <span className="text-muted">· {formatDay(h.day)}</span>
                </span>
                <span className="font-semibold tabular-nums text-accent">+{h.amount}</span>
              </li>
            ))}
          </ul>
        )}
        {reviews.length > 0 && (
          <p className="mt-3 text-[13px] text-muted">
            {reviews.length} weekly review{reviews.length > 1 ? "s" : ""} completed · last focus: {reviews[0].nextFocus.skillName}
          </p>
        )}
      </section>

      {/* Settings */}
      <section className="space-y-2">
        <InstallButton />
        <NavRow href="/settings" icon={<Settings size={18} />} label="Settings & notifications" />
        {can(user.roles, "admin:access") && <NavRow href="/admin" icon={<Shield size={18} />} label="Admin panel" />}
        <form action={logoutAction}>
          <button type="submit" className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-[15px] text-danger hover:bg-danger-soft">
            <LogOut size={18} /> Sign out
          </button>
        </form>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function NavRow({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3.5 text-[15px] shadow-card hover:bg-surface-2">
      {icon}
      <span className="flex-1">{label}</span>
      <ChevronRight size={17} className="text-muted" />
    </Link>
  );
}
