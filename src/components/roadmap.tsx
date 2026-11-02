"use client";

import { Check, Star } from "lucide-react";
import { useT } from "@/i18n/client";
import { cn } from "@/lib/cn";
import type { RoadmapStage } from "@/server/engine/plan";

/** The plan as a vertical rail of journeys on the plan's calendar days, at the learner's rhythm. */
export function RoadmapTimeline({ stages, planDays, lastDay }: { stages: RoadmapStage[]; planDays: number; lastDay: number }) {
  const t = useT();
  const days = (s: RoadmapStage) =>
    s.fromDay === s.toDay ? t("journey.roadmap.day", { day: s.fromDay }) : t("journey.roadmap.days", { from: s.fromDay, to: s.toDay });
  return (
    <ol className="relative">
      {stages.map((s, i) => (
        <li key={s.id} className="relative flex gap-4 pb-6 last:pb-0" aria-current={s.status === "current" ? "step" : undefined}>
          {i < stages.length - 1 || lastDay < planDays ? (
            <span
              className={cn("absolute top-9 bottom-0 left-[17px] w-0.5 rounded-full", s.status === "done" ? "bg-accent" : "bg-line")}
              aria-hidden
            />
          ) : null}
          <span
            className={cn(
              "relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full text-[13px] font-semibold tabular-nums",
              s.status === "done" && "bg-accent text-accent-ink",
              s.status === "current" && "bg-hero text-hero-ink shadow-card ring-4 ring-accent-soft",
              s.status === "upcoming" && "border-2 border-line bg-surface text-muted",
            )}
            aria-hidden
          >
            {s.status === "done" ? <Check size={16} strokeWidth={3} /> : i + 1}
          </span>
          <div
            className={cn(
              "min-w-0 flex-1",
              s.status === "current" && "-mt-1 rounded-[20px] bg-accent-soft px-4 py-3",
              s.status !== "current" && "pt-0.5",
            )}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              {days(s)}
              {s.toDay > planDays && ` · ${t("journey.roadmap.beyond", { day: planDays })}`}
            </p>
            <p className={cn("mt-0.5 text-[16px] leading-snug", s.status === "upcoming" ? "text-ink-2" : "font-semibold")}>
              {s.title}
              {s.status === "current" && (
                <span className="ml-2 inline-flex rounded-full bg-hero px-2 py-0.5 align-middle text-[11px] font-semibold text-hero-ink">
                  {t("journey.roadmap.now")}
                </span>
              )}
            </p>
            <p className="text-[13px] text-muted">
              {s.completed > 0 ? t("journey.roadmap.lessonsDone", { done: s.completed, total: s.lessons }) : t("common.lessons", { count: s.lessons })}
            </p>
          </div>
        </li>
      ))}
      {lastDay < planDays && (
        <li className="relative flex gap-4">
          <span
            className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-dashed border-line bg-surface text-sun"
            aria-hidden
          >
            <Star size={15} className="fill-sun/30" />
          </span>
          <div className="pt-0.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              {t("journey.roadmap.days", { from: lastDay + 1, to: planDays })}
            </p>
            <p className="mt-0.5 text-[16px] text-ink-2">{t("journey.roadmap.masteryTitle")}</p>
            <p className="text-[13px] text-muted">{t("journey.roadmap.masteryBody")}</p>
          </div>
        </li>
      )}
    </ol>
  );
}
