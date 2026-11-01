import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import type { RoadmapStage } from "@/server/engine/plan";

/** The 90-day plan as a vertical timeline of journeys, week ranges at the learner's rhythm. */
export function RoadmapTimeline({ stages, planWeeks, lastWeek }: { stages: RoadmapStage[]; planWeeks: number; lastWeek: number }) {
  const weeks = (s: RoadmapStage) => (s.fromWeek === s.toWeek ? `Week ${s.fromWeek}` : `Weeks ${s.fromWeek}–${s.toWeek}`);
  return (
    <ol className="relative space-y-0">
      {stages.map((s, i) => (
        <li key={s.id} className="relative flex gap-4 pb-5 last:pb-0">
          {i < stages.length - 1 || lastWeek < planWeeks ? <span className="absolute top-7 left-[11px] h-full w-px bg-line" aria-hidden /> : null}
          <span
            className={cn(
              "relative z-10 mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] font-semibold",
              s.status === "done" && "border-success bg-success text-bg",
              s.status === "current" && "border-accent bg-accent text-accent-ink",
              s.status === "upcoming" && "border-line bg-bg text-muted",
            )}
            aria-hidden
          >
            {s.status === "done" ? <Check size={13} strokeWidth={3} /> : i + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-muted">{weeks(s)}</p>
            <p className={cn("text-[16px] leading-snug", s.status === "upcoming" ? "text-ink-2" : "font-semibold")}>
              {s.title}
              {s.status === "current" && <span className="ml-2 text-[12px] font-medium text-accent">Now</span>}
            </p>
            <p className="text-[13px] text-muted">
              {s.completed > 0 ? `${s.completed}/${s.lessons} lessons` : `${s.lessons} lessons`}
            </p>
          </div>
        </li>
      ))}
      {lastWeek < planWeeks && (
        <li className="relative flex gap-4">
          <span className="relative z-10 mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-dashed border-line bg-bg text-[11px] text-muted" aria-hidden>
            ★
          </span>
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-muted">
              Weeks {lastWeek + 1}–{planWeeks}
            </p>
            <p className="text-[16px] text-ink-2">Mastery block</p>
            <p className="text-[13px] text-muted">Spaced reviews, harder practice scenarios and your day-60 and day-90 checkpoints.</p>
          </div>
        </li>
      )}
    </ol>
  );
}
