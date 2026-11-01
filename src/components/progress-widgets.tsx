import { Flame } from "lucide-react";
import { addDays, type ISODate, weekdayShort } from "@/lib/dates";
import { cn } from "@/lib/cn";

export function StreakBadge({ days, atRisk, className }: { days: number; atRisk?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[14px] font-semibold tabular-nums",
        days > 0 ? "bg-accent-soft text-accent" : "bg-surface-2 text-muted",
        className,
      )}
      title={atRisk ? "Train today to keep your streak" : undefined}
      aria-label={`${days}-day streak${atRisk ? ", train today to keep it" : ""}`}
    >
      <Flame size={16} strokeWidth={2.4} className={cn(days > 0 && "fill-accent/25")} aria-hidden />
      {days}
    </span>
  );
}

/** Seven dots, Monday → Sunday, filled on training days. */
export function WeekStrip({ monday, days, today }: { monday: ISODate; days: ISODate[]; today: ISODate }) {
  const trained = new Set(days);
  return (
    <ol className="grid grid-cols-7 gap-2" aria-label="This week">
      {Array.from({ length: 7 }, (_, i) => {
        const d = addDays(monday, i);
        const done = trained.has(d);
        const isToday = d === today;
        return (
          <li key={d} className="flex flex-col items-center gap-1.5">
            <span className={cn("text-[11px] font-medium", isToday ? "text-ink" : "text-muted")}>{weekdayShort(d)}</span>
            <span
              className={cn(
                "grid h-8 w-8 place-items-center rounded-full border text-[11px] transition",
                done ? "border-accent bg-accent text-accent-ink" : isToday ? "border-2 border-ink" : "border-muted/40",
                d > today && "opacity-50",
              )}
              aria-label={`${d}${done ? ", trained" : ""}`}
            >
              {done ? "✓" : ""}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
