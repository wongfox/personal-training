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

const INTL: Record<string, string> = { en: "en-US", es: "es-PE" };

export function weekdayShort(date: ISODate, locale = "en", width: "narrow" | "short" = "narrow"): string {
  const s = toUTC(date).toLocaleDateString(INTL[locale] ?? "en-US", { weekday: width, timeZone: "UTC" });
  return s.charAt(0).toUpperCase() + s.slice(1).replace(".", "");
}

export function formatDay(date: ISODate, opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }, locale = "en"): string {
  const s = toUTC(date).toLocaleDateString(INTL[locale] ?? "en-US", { ...opts, timeZone: "UTC" });
  return locale === "es" ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

/** "morning" | "afternoon" | "evening" — the caller translates it (common.greeting.*). */
export function greetingPart(timeZone: string, now: Date = new Date()): "morning" | "afternoon" | "evening" {
  const h = localHour(timeZone, now);
  if (h < 5) return "evening";
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}
