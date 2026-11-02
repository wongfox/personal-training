import { eq } from "drizzle-orm";
import { Award, BookOpen, CalendarDays, ChevronRight, Clock, Dumbbell, Lock, NotebookPen, Settings, Shield, Target } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { StreakBadge } from "@/components/progress-widgets";
import { InstallButton } from "@/components/pwa/install-button";
import { LeafSprig } from "@/components/scene";
import { SignOutButton } from "@/components/sign-out-button";
import { Sparkline } from "@/components/sparkline";
import { ThemeToggle } from "@/components/theme-sync";
import { Card, ProgressBar, SectionTitle } from "@/components/ui/primitives";
import { INTL_LOCALE } from "@/i18n/config";
import { getTranslator } from "@/i18n/server";
import { cn } from "@/lib/cn";
import { formatDay, localDate } from "@/lib/dates";
import { requireUser } from "@/server/auth/current-user";
import { can } from "@/server/auth/rbac";
import { getDb } from "@/server/db";
import { userSettings } from "@/server/db/schema";
import { LEVELS } from "@/server/engine/progression";
import { getProfileData, listWeeklyReviews } from "@/server/services/progress";
import { getActivePlan } from "@/server/services/training";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("profile.title") };
}

export default async function ProfilePage() {
  const user = await requireUser();
  const db = getDb();
  const today = localDate(user.timezone);
  const plan = await getActivePlan(db, user.id);
  if (!plan) redirect("/onboarding");
  const [data, reviews, [settings], { t, locale }] = await Promise.all([
    getProfileData(db, user.id, today),
    listWeeklyReviews(db, user.id),
    db.select({ theme: userSettings.theme }).from(userSettings).where(eq(userSettings.userId, user.id)),
    getTranslator(),
  ]);
  const theme = settings?.theme === "light" || settings?.theme === "dark" ? settings.theme : "system";
  const num = new Intl.NumberFormat(INTL_LOCALE[locale]);
  const levelName = (name: string) => t(`common.levels.${name}`);
  /** Goal names from the database, translated when we know the key. */
  const goalName = (key: string, fallback: string) => {
    const path = `profile.goals.${key}`;
    const value = t(path);
    return value === path ? fallback : value;
  };

  const earnedCount = data.achievements.filter((a) => a.earnedAt).length;
  // Earned badges plus the next three to aim for — not a wall of locks.
  const shownAchievements = [...data.achievements.filter((a) => a.earnedAt), ...data.achievements.filter((a) => !a.earnedAt).slice(0, 3)];
  const initials = user.name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  const overall = data.skills.length ? Math.round(data.skills.reduce((s, k) => s + k.score, 0) / data.skills.length) : 0;
  const overallBaseline = data.skills.length ? Math.round(data.skills.reduce((s, k) => s + k.baseline, 0) / data.skills.length) : 0;
  const levelLabel = t("common.level", { level: data.level.level, name: levelName(data.level.name) });

  const stats = [
    { key: "daysTrained", value: data.totals.daysTrained, icon: CalendarDays },
    { key: "lessons", value: data.totals.lessons, icon: BookOpen },
    { key: "exercises", value: data.totals.exercises, icon: Dumbbell },
    { key: "missions", value: data.totals.actions, icon: Target },
    { key: "reflections", value: data.totals.reflections, icon: NotebookPen },
    { key: "minutes", value: data.totals.minutes, icon: Clock },
  ] as const;

  return (
    <div className="space-y-7">
      {/* Identity */}
      <header className="flex items-center gap-4 animate-fade">
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatarUrl} alt="" className="h-[72px] w-[72px] rounded-full object-cover ring-4 ring-surface shadow-card" referrerPolicy="no-referrer" />
        ) : (
          <span className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-full bg-hero font-display text-[28px] text-hero-ink ring-4 ring-surface shadow-card" aria-hidden>
            {initials}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-[32px] leading-none">{user.name}</h1>
          <p className="mt-1.5 text-[14px] text-ink-2">{levelLabel}</p>
        </div>
        <StreakBadge days={data.streak.current} />
      </header>

      {/* Level & XP */}
      <section aria-label={t("profile.levelProgress")} className="relative isolate overflow-hidden rounded-[28px] bg-hero p-6 text-hero-ink shadow-card animate-rise">
        <LeafSprig className="absolute -right-3 -bottom-4 -z-10 h-32 w-32 text-hero-ink/25" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-hero-ink/70">{levelLabel}</p>
        <p className="mt-2 font-display text-[44px] leading-none tabular-nums">
          {num.format(data.totalXp)} <span className="font-sans text-[15px] text-hero-ink/70">{t("profile.xpUnit")}</span>
        </p>
        <p className="mt-2 text-[13px] text-hero-ink/80">
          {data.level.nextLevelXp && data.level.nextName
            ? t("profile.xpToNext", { xp: num.format(data.level.nextLevelXp - data.totalXp), level: levelName(data.level.nextName) })
            : t("profile.topLevel")}
        </p>
        <div
          className="mt-4 h-2 overflow-hidden rounded-full bg-hero-ink/15"
          role="progressbar"
          aria-valuenow={data.level.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t("profile.levelProgress")}
        >
          <div className="h-full rounded-full bg-sun transition-[width] duration-700" style={{ width: `${data.level.progress}%` }} />
        </div>
        <ol className="mt-4 grid grid-cols-5 gap-1 text-center text-[10px] text-hero-ink/60">
          {LEVELS.map((l) => (
            <li key={l.name} className={cn("truncate", l.level <= data.level.level && "font-semibold text-hero-ink")}>
              {levelName(l.name)}
            </li>
          ))}
        </ol>
      </section>

      {/* Stats */}
      <section aria-labelledby="stats-title">
        <SectionTitle>
          <span id="stats-title">{t("profile.stats.title")}</span>
        </SectionTitle>
        <dl className="grid grid-cols-3 gap-2.5">
          {stats.map(({ key, value, icon: Icon }) => (
            <div key={key} className="rounded-[22px] bg-surface p-3.5 shadow-card">
              <dt className="flex items-start gap-1.5 text-[11px] leading-tight text-muted">
                <Icon size={14} strokeWidth={2} className="shrink-0 text-accent" aria-hidden />
                <span>{t(`profile.stats.${key}`)}</span>
              </dt>
              <dd className="mt-2 text-[22px] font-semibold leading-none tabular-nums">{num.format(value)}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2.5 px-1 text-[13px] text-muted">
          {t("profile.bestStreak")}: <span className="font-medium text-ink-2">{t("common.days", { count: data.streak.longest })}</span>
        </p>
      </section>

      {/* Skills */}
      <section aria-labelledby="skills-title">
        <SectionTitle>
          <span id="skills-title">{t("profile.skills")}</span>
        </SectionTitle>
        <Card>
          <div className="flex items-end justify-between gap-3 border-b border-line pb-4">
            <div>
              <p className="text-[13px] text-muted">{t("profile.overall")}</p>
              <p className="font-display text-[40px] leading-none tabular-nums">{overall}</p>
            </div>
            <p className="text-[13px] text-ink-2">
              {overall > overallBaseline ? (
                <span className="mr-1 rounded-full bg-success-soft px-2 py-0.5 font-semibold text-success">+{overall - overallBaseline}</span>
              ) : (
                <span className="mr-1">±0</span>
              )}
              {t("profile.sinceDay1")}
            </p>
          </div>
          {data.skills.every((s) => s.score === s.baseline) && <p className="mt-3 text-[13px] leading-relaxed text-muted">{t("profile.baselineNote")}</p>}
          <ul className="mt-1 space-y-1">
            {data.skills.map((s) => {
              const name = t(`taxonomy.skills.${s.key}`);
              return (
                <li key={s.key} className="flex items-center gap-4 py-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[15px] font-medium">{name}</span>
                      <span className="text-[13px] tabular-nums text-ink-2">
                        {s.score}
                        {s.score > s.baseline && <span className="ml-1 text-success">+{s.score - s.baseline}</span>}
                      </span>
                    </div>
                    <ProgressBar value={s.score} tone="accent" className="mt-2" label={t("profile.skillScore", { skill: name })} />
                  </div>
                  <Sparkline points={s.history.map((h) => h.score)} />
                </li>
              );
            })}
          </ul>
        </Card>
      </section>

      {/* Plan & goals */}
      <section aria-labelledby="plan-title">
        <SectionTitle>
          <span id="plan-title">{plan.title}</span>
        </SectionTitle>
        <Card className="space-y-3 text-[14px]">
          <Row label={t("profile.plan.primaryGoal")} value={goalName(plan.primaryGoalKey, plan.primaryGoalName)} />
          {plan.secondaryGoals.length > 0 && (
            <Row label={t("profile.plan.secondaryGoals")} value={plan.secondaryGoals.map((g) => goalName(g.key, g.name)).join(", ")} />
          )}
          <Row label={t("profile.plan.commitment")} value={`${t("common.minutes", { count: plan.dailyMinutes })} · ${t(`profile.frequency.${plan.frequency}`)}`} />
          <Row label={t("profile.plan.started")} value={formatDay(plan.startDate, { month: "long", day: "numeric", year: "numeric" }, locale)} />
          {plan.mainChallenge && <Row label={t("profile.plan.mainChallenge")} value={plan.mainChallenge} />}
          {plan.ninetyDayGoal && (
            <p className="-mx-1 mt-1 rounded-[20px] bg-accent-soft px-4 py-3.5 font-display text-[19px] italic leading-snug">“{plan.ninetyDayGoal}”</p>
          )}
        </Card>
      </section>

      {/* Achievements */}
      <section aria-labelledby="ach-title">
        <SectionTitle action={<span className="text-[12px] text-muted">{t("profile.earnedOf", { earned: earnedCount, total: data.achievements.length })}</span>}>
          <span id="ach-title">{t("profile.achievements")}</span>
        </SectionTitle>
        <ul className="grid grid-cols-3 gap-2.5">
          {shownAchievements.map((a) => (
            <li
              key={a.key}
              title={a.description}
              className={cn(
                "flex flex-col items-center rounded-[22px] p-3 text-center",
                a.earnedAt ? "bg-surface shadow-card" : "border border-dashed border-line",
              )}
            >
              <span
                className={cn("grid h-12 w-12 place-items-center rounded-2xl", a.earnedAt ? "bg-sun-soft text-sun" : "bg-surface-2 text-muted")}
                aria-label={a.earnedAt ? undefined : t("profile.locked")}
                role={a.earnedAt ? undefined : "img"}
              >
                {a.earnedAt ? <Award size={20} aria-hidden /> : <Lock size={15} aria-hidden />}
              </span>
              <span className={cn("mt-2 text-[12px] font-semibold leading-tight", !a.earnedAt && "text-muted")}>{a.title}</span>
              <span className="mt-0.5 line-clamp-3 text-[10px] leading-tight text-muted">{a.description}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* History */}
      <section aria-labelledby="hist-title">
        <SectionTitle>
          <span id="hist-title">{t("profile.history.title")}</span>
        </SectionTitle>
        {data.history.length === 0 ? (
          <p className="px-1 text-[14px] text-ink-2">{t("profile.history.empty")}</p>
        ) : (
          <ul className="divide-y divide-line rounded-[28px] bg-surface px-5 shadow-card">
            {data.history.slice(0, 6).map((h, i) => (
              <li key={i} className="flex items-center justify-between gap-3 py-3 text-[14px]">
                <span className="min-w-0">
                  {h.label} <span className="text-muted">· {formatDay(h.day, undefined, locale)}</span>
                </span>
                <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-0.5 text-[13px] font-semibold tabular-nums text-accent">+{h.amount}</span>
              </li>
            ))}
          </ul>
        )}
        {reviews.length > 0 && (
          <p className="mt-3 px-1 text-[13px] text-muted">
            {t("profile.history.reviews", { count: reviews.length, skill: t(`taxonomy.skills.${reviews[0].nextFocus.skillKey}`) })}
          </p>
        )}
      </section>

      {/* Preferences: appearance + language, saved to the account */}
      <section aria-labelledby="prefs-title">
        <SectionTitle>
          <span id="prefs-title">{t("profile.preferences.title")}</span>
        </SectionTitle>
        <Card className="space-y-5">
          <div>
            <p className="text-[15px] font-medium">{t("common.theme.label")}</p>
            <p className="mb-3 text-[13px] text-muted">{t("profile.preferences.themeHint")}</p>
            <ThemeToggle value={theme} />
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
            <div className="min-w-0">
              <p className="text-[15px] font-medium">{t("common.language")}</p>
              <p className="text-[13px] text-muted">{t("profile.preferences.languageHint")}</p>
            </div>
            <LanguageSwitcher className="shrink-0" />
          </div>
        </Card>
      </section>

      {/* Settings */}
      <section className="space-y-2.5">
        <InstallButton />
        <NavRow href="/settings" icon={<Settings size={18} />} label={t("profile.settingsLink")} />
        {can(user.roles, "admin:access") && <NavRow href="/admin" icon={<Shield size={18} />} label={t("profile.adminLink")} />}
        <SignOutButton />
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
    <Link href={href} className="flex items-center gap-3 rounded-[22px] bg-surface px-4 py-3 text-[15px] font-medium shadow-card hover:bg-surface-2">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent" aria-hidden>
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      <ChevronRight size={17} className="text-muted" aria-hidden />
    </Link>
  );
}
