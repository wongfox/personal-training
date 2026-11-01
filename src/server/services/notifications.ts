/**
 * Reminder engine. Run by a scheduler (e.g. Vercel Cron hitting
 * /api/cron/notifications every 15 minutes). Rules:
 *  - at most ONE reminder per learner per local day (enforced by a unique dedupe key),
 *  - only at/after the learner's chosen reminder time,
 *  - the most useful reminder wins: streak at risk > missed-day recovery >
 *    checkpoint > weekly review > daily reminder,
 *  - nothing if they've already trained today.
 * Delivery is in-app (stored) plus email when the learner opted in; the
 * channel column is ready for web/native push.
 */
import { and, eq, isNotNull } from "drizzle-orm";
import { diffDays, localDate } from "@/lib/dates";
import type { Executor } from "@/server/db";
import { growthPlans, notifications, profiles, streaks, userSettings, users } from "@/server/db/schema";
import { appUrl, sendEmail } from "@/server/platform";
import { dueCheckpoint, weeklyReviewDue } from "./home";

type NotificationType = (typeof notifications.$inferInsert)["type"];

export interface ReminderCandidate {
  type: NotificationType;
  title: string;
  body: string;
  url: string;
}

export interface ReminderInput {
  trainedToday: boolean;
  streak: number;
  daysSinceLastTraining: number | null;
  dayNumber: number;
  checkpoint: number | null;
  weeklyDue: boolean;
  prefs: { dailyReminder: boolean; streakReminder: boolean; weeklyReview: boolean };
}

/** Pure: picks the single most useful reminder for today, or none. */
export function chooseReminder(i: ReminderInput): ReminderCandidate | null {
  if (i.trainedToday) return null;
  if (i.prefs.streakReminder && i.streak >= 2 && i.daysSinceLastTraining === 1) {
    return { type: "streak_reminder", title: `Keep your ${i.streak}-day streak`, body: "Five minutes today keeps it alive. Today's lesson is ready.", url: "/home" };
  }
  if (i.daysSinceLastTraining !== null && i.daysSinceLastTraining >= 2 && i.daysSinceLastTraining <= 7) {
    return { type: "missed_day_recovery", title: "Pick up where you left off", body: "No guilt, no catch-up. Just today's lesson — one idea, a few minutes.", url: "/home" };
  }
  if (i.checkpoint) {
    return { type: "checkpoint", title: `Your day-${i.checkpoint} checkpoint is ready`, body: "See how far you've come: before vs. now.", url: `/checkpoint/${i.checkpoint}` };
  }
  if (i.prefs.weeklyReview && i.weeklyDue) {
    return { type: "weekly_review", title: "Your week in review", body: "Two minutes to look back and set next week's focus.", url: "/review/week" };
  }
  if (i.prefs.dailyReminder) {
    return { type: "daily_reminder", title: "Today's training is ready", body: "One idea, one exercise, one real-world mission.", url: "/home" };
  }
  return null;
}

function minutesOf(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function localMinutes(tz: string, now: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(now);
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return h * 60 + m;
}

export async function runReminders(db: Executor, now = new Date()): Promise<{ checked: number; created: number }> {
  const rows = await db
    .select({
      userId: users.id,
      email: users.email,
      name: users.name,
      timezone: profiles.timezone,
      settings: userSettings,
      streak: streaks,
      startDate: growthPlans.startDate,
    })
    .from(users)
    .innerJoin(profiles, and(eq(profiles.userId, users.id), isNotNull(profiles.onboardingCompletedAt)))
    .innerJoin(growthPlans, and(eq(growthPlans.userId, users.id), eq(growthPlans.status, "active")))
    .leftJoin(userSettings, eq(userSettings.userId, users.id))
    .leftJoin(streaks, eq(streaks.userId, users.id))
    .where(eq(users.status, "active"));

  let created = 0;
  for (const r of rows) {
    const reminderTime = r.settings?.reminderTime ?? "08:00";
    if (localMinutes(r.timezone, now) < minutesOf(reminderTime)) continue;
    const today = localDate(r.timezone, now);
    const last = r.streak?.lastActiveDate ?? null;
    const dayNumber = diffDays(r.startDate, today) + 1;
    const candidate = chooseReminder({
      trainedToday: last === today,
      streak: r.streak?.current ?? 0,
      daysSinceLastTraining: last ? diffDays(last, today) : null,
      dayNumber,
      checkpoint: await dueCheckpoint(db, r.userId, dayNumber),
      weeklyDue: await weeklyReviewDue(db, r.userId, today, r.startDate),
      prefs: {
        dailyReminder: r.settings?.dailyReminder ?? true,
        streakReminder: r.settings?.streakReminder ?? true,
        weeklyReview: r.settings?.weeklyReview ?? true,
      },
    });
    if (!candidate) continue;
    const emailOptIn = r.settings?.emailNotifications ?? false;
    const inserted = await db
      .insert(notifications)
      .values({ userId: r.userId, ...candidate, channel: emailOptIn ? "email" : "in_app", dedupeKey: `day:${today}` })
      .onConflictDoNothing()
      .returning({ id: notifications.id });
    if (!inserted.length) continue;
    created++;
    if (emailOptIn) {
      await sendEmail({ to: r.email, subject: candidate.title, text: `${candidate.body}\n\n${appUrl(candidate.url)}` });
    }
    await db.update(notifications).set({ sentAt: new Date() }).where(eq(notifications.id, inserted[0].id));
  }
  return { checked: rows.length, created };
}
