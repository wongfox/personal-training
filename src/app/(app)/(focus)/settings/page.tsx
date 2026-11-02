import { desc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { FocusShell } from "@/components/focus-shell";
import { getTranslator } from "@/i18n/server";
import { formatDay } from "@/lib/dates";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { notifications, profiles, userSettings, users } from "@/server/db/schema";
import { DeleteAccount, EmailStatus, PasswordForm } from "./account-security";
import { SettingsForm } from "./form";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("settings.title") };
}

export default async function SettingsPage({ searchParams }: PageProps<"/settings">) {
  const user = await requireUser();
  const { verified } = await searchParams;
  const db = getDb();
  const { t, locale } = await getTranslator();
  const [[settings], [profile], [account], recent] = await Promise.all([
    db.select().from(userSettings).where(eq(userSettings.userId, user.id)),
    db.select().from(profiles).where(eq(profiles.userId, user.id)),
    db.select({ emailVerifiedAt: users.emailVerifiedAt, passwordHash: users.passwordHash }).from(users).where(eq(users.id, user.id)),
    db.select().from(notifications).where(eq(notifications.userId, user.id)).orderBy(desc(notifications.createdAt)).limit(5),
  ]);
  const sectionTitle = "px-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-muted";

  return (
    <FocusShell closeHref="/profile" top={<p className="text-[13px] text-muted">{t("settings.title")}</p>}>
      <div className="pt-4">
        <h1 className="font-display text-[36px] leading-none">{t("settings.title")}</h1>
        <div className="mt-7">
          <EmailStatus verified={Boolean(account?.emailVerifiedAt)} email={user.email} notice={typeof verified === "string" ? verified : undefined} />
        </div>
        <SettingsForm
          initial={{
            displayName: profile?.displayName ?? user.name,
            timezone: profile?.timezone ?? "UTC",
            reminderTime: settings?.reminderTime ?? "08:00",
            dailyReminder: settings?.dailyReminder ?? true,
            streakReminder: settings?.streakReminder ?? true,
            weeklyReview: settings?.weeklyReview ?? true,
            emailNotifications: settings?.emailNotifications ?? false,
            theme: settings?.theme === "light" || settings?.theme === "dark" ? settings.theme : "system",
          }}
        />

        <section className="mt-10 space-y-3">
          <h2 className={sectionTitle}>{t("settings.security")}</h2>
          <PasswordForm hasPassword={Boolean(account?.passwordHash)} />
        </section>

        {recent.length > 0 && (
          <section className="mt-10">
            <h2 className={sectionTitle}>{t("settings.recentReminders")}</h2>
            <ul className="mt-3 divide-y divide-line rounded-[28px] bg-surface px-5 shadow-card">
              {recent.map((n) => (
                <li key={n.id} className="py-3">
                  <p className="text-[14px] font-medium">{n.title}</p>
                  <p className="text-[13px] text-ink-2">{n.body}</p>
                  <p className="mt-0.5 text-[11px] text-muted">{formatDay(n.createdAt.toISOString().slice(0, 10), undefined, locale)}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12 border-t border-line pt-6">
          <DeleteAccount />
        </section>
      </div>
    </FocusShell>
  );
}
