/**
 * Calendar-day helpers. Training days are counted in the learner's own
 * timezone, and stored as ISO dates ("YYYY-MM-DD"), so a late-evening session
 * in Lima doesn't count as "tomorrow" because the server runs on UTC.
 */

export type ISODate = string;

export function isValidTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export function localDate(timeZone: string, now: Date = new Date()): ISODate {
  const tz = isValidTimeZone(timeZone) ? timeZone : "UTC";
  // en-CA formats as YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(
    now,
  );
}

export function localHour(timeZone: string, now: Date = new Date()): number {
  const tz = isValidTimeZone(timeZone) ? timeZone : "UTC";
  const h = new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", hourCycle: "h23" }).format(now);
  return Number(h);
}

function toUTC(date: ISODate): Date {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function fromUTC(date: Date): ISODate {
  return date.toISOString().slice(0, 10);
}

export function addDays(date: ISODate, days: number): ISODate {
  const d = toUTC(date);
  d.setUTCDate(d.getUTCDate() + days);
  return fromUTC(d);
}

/** Whole days from `from` to `to` (positive when `to` is later). */
export function diffDays(from: ISODate, to: ISODate): number {
  return Math.round((toUTC(to).getTime() - toUTC(from).getTime()) / 86_400_000);
}

/** Monday of the week containing `date`. */
export function startOfWeek(date: ISODate): ISODate {
  const day = toUTC(date).getUTCDay(); // 0 = Sunday
  return addDays(date, day === 0 ? -6 : 1 - day);
}

export function eachDay(from: ISODate, to: ISODate): ISODate[] {
  const out: ISODate[] = [];
  for (let d = from; d <= to; d = addDays(d, 1)) out.push(d);
  return out;
}

export function weekdayShort(date: ISODate): string {
  return toUTC(date).toLocaleDateString("en-US", { weekday: "narrow", timeZone: "UTC" });
}

export function formatDay(date: ISODate, opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }): string {
  return toUTC(date).toLocaleDateString("en-US", { ...opts, timeZone: "UTC" });
}

export function greeting(timeZone: string, now: Date = new Date()): string {
  const h = localHour(timeZone, now);
  if (h < 5) return "Good evening";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
