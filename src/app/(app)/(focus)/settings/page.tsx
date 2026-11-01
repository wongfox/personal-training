import { desc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { FocusShell } from "@/components/focus-shell";
import { formatDay } from "@/lib/dates";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { notifications, profiles, userSettings } from "@/server/db/schema";
import { SettingsForm } from "./form";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUser();
  const db = getDb();
  const [[settings], [profile], recent] = await Promise.all([
    db.select().from(userSettings).where(eq(userSettings.userId, user.id)),
    db.select().from(profiles).where(eq(profiles.userId, user.id)),
    db.select().from(notifications).where(eq(notifications.userId, user.id)).orderBy(desc(notifications.createdAt)).limit(5),
  ]);

  return (
    <FocusShell closeHref="/profile" top={<p className="text-[13px] text-muted">Settings</p>}>
      <div className="pt-4">
        <h1 className="font-display text-[34px] leading-none">Settings</h1>
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
        {recent.length > 0 && (
          <section className="mt-10">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">Recent reminders</h2>
            <ul className="mt-3 divide-y divide-line rounded-3xl bg-surface px-5 shadow-card">
              {recent.map((n) => (
                <li key={n.id} className="py-3">
                  <p className="text-[14px] font-medium">{n.title}</p>
                  <p className="text-[13px] text-ink-2">{n.body}</p>
                  <p className="mt-0.5 text-[11px] text-muted">{formatDay(n.createdAt.toISOString().slice(0, 10))}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </FocusShell>
  );
}
