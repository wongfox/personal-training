"use client";

import { ArrowUpRight, Check, Lightbulb, Sparkles, Zap } from "lucide-react";
import { Ring } from "@/components/ui/primitives";
import { useT } from "@/i18n/client";
import { cn } from "@/lib/cn";
import type { ExerciseFeedback } from "@/server/db/types";

export interface Reveal {
  modelAnswer?: string;
  bestOption?: string;
  correctOrder?: string[];
  explanation?: string;
}

export function scoreTone(score: number) {
  return score >= 80 ? "success" : score >= 55 ? "accent" : "ink";
}

const cardLabel = "text-[11px] font-semibold uppercase tracking-[0.14em]";

export function FeedbackPanel({ feedback, reveal, xp }: { feedback: ExerciseFeedback; reveal?: Reveal; xp?: number }) {
  const t = useT();
  const [nextTip, ...moreImprovements] = feedback.improvements;
  return (
    <section aria-live="polite" className="space-y-3 animate-rise">
      {/* Score */}
      <div className="flex items-center gap-4 rounded-[28px] bg-surface p-5 shadow-card">
        <Ring value={feedback.score} size={84} stroke={7} tone={scoreTone(feedback.score)} label={t("exercises.feedback.scoreLabel", { score: feedback.score })}>
          <span className="font-display text-[26px] leading-none tabular-nums">{feedback.score}</span>
        </Ring>
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-1.5 text-[12px] text-muted">
            {feedback.source === "ai" ? (
              <>
                <Sparkles size={12} aria-hidden /> {t("exercises.feedback.coach")}
              </>
            ) : (
              <>
                <Zap size={12} aria-hidden /> {t("exercises.feedback.instant")}
              </>
            )}
            {xp ? <span className="rounded-full bg-accent-soft px-2 py-0.5 font-semibold text-accent">{t("common.plusXp", { count: xp })}</span> : null}
          </p>
          <p className="mt-1.5 font-display text-[19px] leading-snug">{feedback.summary}</p>
        </div>
      </div>

      {/* Dimensions */}
      {feedback.dimensions && feedback.dimensions.length > 0 && (
        <div className="rounded-[28px] bg-surface p-5 shadow-card">
          <p className={cn(cardLabel, "text-muted")}>{t("exercises.feedback.breakdown")}</p>
          <ul className="mt-3 space-y-3.5">
            {feedback.dimensions.map((d) => (
              <li key={d.key}>
                <div className="flex items-baseline justify-between text-[13px]">
                  <span className="font-medium">{d.label}</span>
                  <span className="tabular-nums text-muted">{d.score}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className={cn("h-full rounded-full transition-[width] duration-700", d.score >= 80 ? "bg-success" : d.score >= 55 ? "bg-accent" : "bg-ink/60")}
                    style={{ width: `${d.score}%` }}
                  />
                </div>
                {d.note && <p className="mt-1 text-[12px] text-ink-2">{d.note}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weak phrases */}
      {feedback.flagged && feedback.flagged.length > 0 && (
        <div className="rounded-[28px] bg-surface p-5 shadow-card">
          <p className={cn(cardLabel, "text-muted")}>{t("exercises.feedback.weakPhrases")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {feedback.flagged.map((f) => (
              <span key={f.phrase} className="rounded-full bg-danger-soft px-3 py-1 text-[13px] text-danger line-through decoration-1">
                {f.phrase}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* What worked */}
      {feedback.strengths.length > 0 && (
        <div className="rounded-[28px] bg-surface p-5 shadow-card">
          <p className={cn(cardLabel, "text-success")}>{t("exercises.feedback.worked")}</p>
          <ul className="mt-3 space-y-3">
            {feedback.strengths.map((s) => (
              <li key={s} className="flex gap-3 text-[15px] leading-relaxed">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-success text-surface" aria-hidden>
                  <Check size={13} strokeWidth={3} />
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Try this next */}
      {nextTip && (
        <div className="rounded-[28px] bg-accent-soft p-5 text-ink">
          <p className={cn(cardLabel, "flex items-center gap-2 text-accent")}>
            <Lightbulb size={14} aria-hidden /> {t("exercises.feedback.tryNext")}
          </p>
          <p className="mt-2 font-display text-[19px] leading-snug">{nextTip}</p>
          {moreImprovements.length > 0 && (
            <ul className="mt-3 space-y-2.5 border-t border-accent/15 pt-3">
              {moreImprovements.map((s) => (
                <li key={s} className="flex gap-3 text-[14px] leading-relaxed text-ink-2">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-accent/40 text-accent" aria-hidden>
                    <ArrowUpRight size={12} strokeWidth={2.6} />
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Reveals */}
      {reveal?.modelAnswer && (
        <div className="rounded-[28px] border border-line p-5">
          <p className={cn(cardLabel, "text-muted")}>{t("exercises.feedback.modelAnswer")}</p>
          <p className="mt-2 font-display text-[19px] leading-snug">“{reveal.modelAnswer}”</p>
        </div>
      )}
      {reveal?.bestOption && feedback.score < 100 && (
        <div className="rounded-[28px] border border-line p-5">
          <p className={cn(cardLabel, "text-muted")}>{t("exercises.feedback.bestOption")}</p>
          <p className="mt-2 text-[15px] leading-relaxed">{reveal.bestOption}</p>
        </div>
      )}
      {reveal?.correctOrder && feedback.score < 100 && (
        <div className="rounded-[28px] border border-line p-5">
          <p className={cn(cardLabel, "text-muted")}>{t("exercises.feedback.sequence")}</p>
          <ol className="mt-3 space-y-2 text-[15px]">
            {reveal.correctOrder.map((s, i) => (
              <li key={s} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-surface-2 text-[12px] font-semibold tabular-nums text-ink-2">{i + 1}</span>
                <span className="pt-0.5">{s}</span>
              </li>
            ))}
          </ol>
          {reveal.explanation && <p className="mt-3 text-[14px] text-ink-2">{reveal.explanation}</p>}
        </div>
      )}
    </section>
  );
}
