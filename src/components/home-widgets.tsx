import { Check, Quote } from "lucide-react";
import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { addDays, type ISODate, weekdayShort } from "@/lib/dates";

/** Rounded-square shortcut tile (icon + label), as in a four-up row. */
export function QuickTile({ href, label, icon: Icon, badge }: { href: string; label: string; icon: ComponentType<{ size?: number; strokeWidth?: number }>; badge?: number }) {
  return (
    <Link href={href} className="group flex flex-col items-center gap-2">
      <span className="relative grid aspect-square w-full place-items-center rounded-[22px] bg-surface text-accent shadow-card transition group-hover:-translate-y-0.5 group-active:scale-95">
        <Icon size={24} strokeWidth={1.7} />
        {badge ? (
          <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-sun px-1 text-[11px] font-semibold text-white">{badge}</span>
        ) : null}
      </span>
      <span className="text-[12px] font-medium text-ink-2">{label}</span>
    </Link>
  );
}

/** Five-to-seven day pills (weekday + date), today highlighted, trained days marked. */
export function DayPills({ start, today, trained, locale, label }: { start: ISODate; today: ISODate; trained: ISODate[]; locale: string; label: string }) {
  const done = new Set(trained);
  return (
    <ol className="grid grid-cols-7 gap-1.5" aria-label={label}>
      {Array.from({ length: 7 }, (_, i) => {
        const d = addDays(start, i);
        const isToday = d === today;
        return (
          <li
            key={d}
            className={cn(
              "flex flex-col items-center rounded-[16px] py-2 text-center transition",
              isToday ? "bg-hero text-hero-ink shadow-card" : "bg-surface text-ink",
              d > today && "opacity-55",
            )}
            aria-current={isToday ? "date" : undefined}
          >
            <span className={cn("text-[10px] font-medium", isToday ? "text-hero-ink/70" : "text-muted")}>{weekdayShort(d, locale, "short")}</span>
            <span className="mt-0.5 text-[16px] font-semibold tabular-nums">{d.slice(8)}</span>
            <span className={cn("mt-1 h-1.5 w-1.5 rounded-full", done.has(d) ? (isToday ? "bg-sun" : "bg-accent") : "bg-transparent")} aria-hidden />
          </li>
        );
      })}
    </ol>
  );
}

export interface PlanItem {
  key: string;
  title: string;
  subtitle: string;
  meta?: string;
  done: boolean;
  href?: string;
}

/** "Today's plan": checklist with a progress bar, dotted rail between items. */
export function PlanChecklist({ title, summary, items, percent }: { title: string; summary: string; items: PlanItem[]; percent: number }) {
  return (
    <section className="rounded-[28px] bg-surface p-5 shadow-card">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-[24px] leading-none">{title}</h2>
          <p className="mt-1.5 text-[13px] text-muted">{summary}</p>
        </div>
        <span className="text-[14px] font-semibold tabular-nums text-ink-2">{percent}%</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label={summary}>
        <div className="h-full rounded-full bg-accent transition-[width] duration-700" style={{ width: `${percent}%` }} />
      </div>
      <ol className="relative mt-4">
        {items.map((item, i) => {
          const row = (
            <>
              <span
                className={cn(
                  "relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2",
                  item.done ? "border-accent bg-accent text-accent-ink" : "border-line bg-surface",
                )}
                aria-hidden
              >
                {item.done && <Check size={13} strokeWidth={3} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className={cn("block truncate text-[15px] font-semibold", item.done && "text-ink-2")}>{item.title}</span>
                <span className="block truncate text-[12px] text-muted">{item.subtitle}</span>
              </span>
              {item.meta && <span className="shrink-0 text-[12px] tabular-nums text-muted">{item.meta}</span>}
            </>
          );
          return (
            <li key={item.key} className="relative">
              {i < items.length - 1 && <span className="absolute top-8 bottom-0 left-[11px] w-px border-l border-dashed border-line" aria-hidden />}
              {item.href ? (
                <Link href={item.href} className="-mx-2 flex items-center gap-3 rounded-2xl px-2 py-2.5 transition hover:bg-surface-2" aria-label={`${item.title}${item.done ? " ✓" : ""}`}>
                  {row}
                </Link>
              ) : (
                <div className="flex items-center gap-3 py-2.5">{row}</div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** Soft sage card with large quote marks and serif text. */
export function QuoteCard({ eyebrow, children, footer }: { eyebrow?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <figure className="rounded-[28px] bg-accent-soft px-6 py-6 text-ink">
      <div className="flex items-center gap-2">
        <Quote size={22} className="shrink-0 fill-accent/25 text-accent" aria-hidden />
        {eyebrow && <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">{eyebrow}</span>}
      </div>
      <blockquote className="mt-3 font-display text-[21px] leading-[1.3]">{children}</blockquote>
      {footer && <figcaption className="mt-4">{footer}</figcaption>}
    </figure>
  );
}
