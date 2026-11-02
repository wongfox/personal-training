"use client";

import { Flame } from "lucide-react";
import { useLocale, useT } from "@/i18n/client";
import { addDays, formatDay, type ISODate, weekdayShort } from "@/lib/dates";
import { cn } from "@/lib/cn";

export function StreakBadge({ days, atRisk, className }: { days: number; atRisk?: boolean; className?: string }) {
  const t = useT();
  return (
    <span
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[14px] font-semibold tabular-nums",
        days > 0 ? "bg-sun-soft text-ink" : "bg-surface-2 text-muted",
        className,
      )}
      title={atRisk ? t("profile.streakBadge.atRisk") : undefined}
      aria-label={`${t("profile.streakBadge.label", { count: days })}${atRisk ? t("profile.streakBadge.atRiskSuffix") : ""}`}
    >
      <Flame size={16} strokeWidth={2.4} className={cn(days > 0 && "fill-sun/25 text-sun")} aria-hidden />
      {days}
    </span>
  );
}

/** Seven dots, Monday → Sunday, filled on training days. */
export function WeekStrip({ monday, days, today }: { monday: ISODate; days: ISODate[]; today: ISODate }) {
  const t = useT();
  const locale = useLocale();
  const trained = new Set(days);
  return (
    <ol className="grid grid-cols-7 gap-2" aria-label={t("profile.weekStrip.label")}>
      {Array.from({ length: 7 }, (_, i) => {
        const d = addDays(monday, i);
        const done = trained.has(d);
        const isToday = d === today;
        const date = formatDay(d, { weekday: "long", month: "short", day: "numeric" }, locale);
        return (
          <li key={d} className="flex flex-col items-center gap-1.5">
            <span className={cn("text-[11px] font-medium", isToday ? "text-ink" : "text-muted")}>{weekdayShort(d, locale)}</span>
            <span
              className={cn(
                "grid h-8 w-8 place-items-center rounded-full border text-[11px] transition",
                done ? "border-hero bg-hero text-hero-ink" : isToday ? "border-2 border-ink" : "border-muted/40",
                d > today && "opacity-50",
              )}
              aria-label={done ? t("profile.weekStrip.trained", { date }) : date}
            >
              {done ? "✓" : ""}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
