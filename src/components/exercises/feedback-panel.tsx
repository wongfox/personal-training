"use client";

import { ArrowUpRight, Check, Sparkles } from "lucide-react";
import { Ring } from "@/components/ui/primitives";
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

export function FeedbackPanel({ feedback, reveal, xp }: { feedback: ExerciseFeedback; reveal?: Reveal; xp?: number }) {
  return (
    <section aria-live="polite" className="space-y-4 animate-rise">
      <div className="flex items-center gap-4 rounded-3xl bg-surface p-5 shadow-card">
        <Ring value={feedback.score} size={64} stroke={5} tone={scoreTone(feedback.score)} label={`Score ${feedback.score} out of 100`}>
          <span className="text-[17px] font-semibold tabular-nums">{feedback.score}</span>
        </Ring>
        <div className="min-w-0">
          <p className="text-[16px] font-semibold leading-snug">{feedback.summary}</p>
          <p className="mt-1 flex items-center gap-1.5 text-[12px] text-muted">
            {feedback.source === "ai" ? (
              <>
                <Sparkles size={12} /> Coach feedback
              </>
            ) : (
              "Instant feedback"
            )}
            {xp ? <span className="font-semibold text-accent">· +{xp} XP</span> : null}
          </p>
        </div>
      </div>

      {feedback.dimensions && feedback.dimensions.length > 0 && (
        <div className="rounded-3xl bg-surface p-5 shadow-card">
          <ul className="space-y-3">
            {feedback.dimensions.map((d) => (
              <li key={d.key}>
                <div className="flex items-baseline justify-between text-[13px]">
                  <span className="font-medium">{d.label}</span>
                  <span className="tabular-nums text-muted">{d.score}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className={cn("h-full rounded-full", d.score >= 80 ? "bg-success" : d.score >= 55 ? "bg-accent" : "bg-ink/60")}
                    style={{ width: `${d.score}%` }}
                  />
                </div>
                {d.note && <p className="mt-1 text-[12px] text-ink-2">{d.note}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {feedback.flagged && feedback.flagged.length > 0 && (
        <div>
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">Weak phrases spotted</p>
          <div className="flex flex-wrap gap-2">
            {feedback.flagged.map((f) => (
              <span key={f.phrase} className="rounded-full bg-danger-soft px-3 py-1 text-[13px] text-danger line-through decoration-1">
                {f.phrase}
              </span>
            ))}
          </div>
        </div>
      )}

      {(feedback.strengths.length > 0 || feedback.improvements.length > 0) && (
        <ul className="space-y-2.5">
          {feedback.strengths.map((s) => (
            <li key={s} className="flex gap-3 text-[15px] leading-relaxed">
              <Check size={18} className="mt-0.5 shrink-0 text-success" strokeWidth={2.6} />
              <span>{s}</span>
            </li>
          ))}
          {feedback.improvements.map((s) => (
            <li key={s} className="flex gap-3 text-[15px] leading-relaxed">
              <ArrowUpRight size={18} className="mt-0.5 shrink-0 text-accent" strokeWidth={2.4} />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      )}

      {reveal?.modelAnswer && (
        <div className="rounded-2xl border border-line p-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">One strong version</p>
          <p className="mt-2 font-display text-[19px] leading-snug">“{reveal.modelAnswer}”</p>
        </div>
      )}
      {reveal?.bestOption && feedback.score < 100 && (
        <div className="rounded-2xl border border-line p-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">Strongest move</p>
          <p className="mt-2 text-[15px]">{reveal.bestOption}</p>
        </div>
      )}
      {reveal?.correctOrder && feedback.score < 100 && (
        <div className="rounded-2xl border border-line p-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">The sequence</p>
          <ol className="mt-2 space-y-1.5 text-[15px]">
            {reveal.correctOrder.map((s, i) => (
              <li key={s} className="flex gap-2">
                <span className="w-5 shrink-0 tabular-nums text-muted">{i + 1}.</span>
                {s}
              </li>
            ))}
          </ol>
          {reveal.explanation && <p className="mt-3 text-[14px] text-ink-2">{reveal.explanation}</p>}
        </div>
      )}
    </section>
  );
}
