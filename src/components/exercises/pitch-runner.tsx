"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Ring } from "@/components/ui/primitives";
import { useT } from "@/i18n/client";
import { cn } from "@/lib/cn";
import type { PitchConfig } from "@/server/db/types";
import { Rich } from "./rich-text";
import type { RunnerProps } from "./runners";

const WORDS_PER_MINUTE = 130;

function clock(seconds: number) {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function Chips({ label, options, value, onChange, disabled }: { label: string; options: string[]; value: string; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <fieldset>
      <legend className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={value === o}
            disabled={disabled}
            onClick={() => onChange(o)}
            className={cn(
              "rounded-full px-4 py-2 text-[14px] transition active:scale-[0.98]",
              value === o ? "bg-hero text-hero-ink shadow-card" : "bg-surface text-ink shadow-card hover:bg-surface-2",
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function PitchRunner({ config, submitting, locked, onSubmit }: RunnerProps<PitchConfig>) {
  const t = useT();
  const [audience, setAudience] = useState(config.audiences[0] ?? "");
  const [objective, setObjective] = useState(config.objectives[0] ?? "");
  const [duration, setDuration] = useState(config.durations[1] ?? config.durations[0] ?? 3);
  const [topic, setTopic] = useState(config.suggestedTopics[0] ?? "");
  const [text, setText] = useState("");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const budget = duration * WORDS_PER_MINUTE;
  const spokenSeconds = (words / WORDS_PER_MINUTE) * 60;
  const slotSeconds = duration * 60;
  const over = words > budget;

  return (
    <div className="space-y-5">
      <p className="text-[16px] leading-relaxed">{config.briefing}</p>
      <Chips label={t("exercises.pitch.audience")} options={config.audiences} value={audience} onChange={setAudience} disabled={locked} />
      <Chips label={t("exercises.pitch.objective")} options={config.objectives} value={objective} onChange={setObjective} disabled={locked} />
      <div>
        <label htmlFor="topic" className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
          {t("exercises.pitch.topic")}
        </label>
        <input
          id="topic"
          list="topics"
          value={topic}
          disabled={locked}
          onChange={(e) => setTopic(e.target.value)}
          className="mt-2 h-12 w-full rounded-[16px] border border-line bg-surface px-3.5 text-[16px] outline-none focus:border-accent/50"
        />
        <datalist id="topics">
          {config.suggestedTopics.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>
      <div className="rounded-[24px] bg-accent-soft p-5 text-[14px] leading-relaxed text-ink">
        <Rich
          template={t("exercises.pitch.brief")}
          values={{
            duration: <span className="font-semibold">{t("exercises.pitch.minutes", { count: duration })}</span>,
            audience: <span className="font-semibold">{audience.toLowerCase()}</span>,
            topic: <span className="font-semibold">{topic || t("exercises.pitch.yourTopic")}</span>,
            objective: <span className="font-semibold">{objective.toLowerCase()}</span>,
          }}
        />
      </div>
      <div>
        <textarea
          value={text}
          disabled={locked}
          onChange={(e) => setText(e.target.value)}
          maxLength={4000}
          placeholder={t("exercises.pitch.placeholder")}
          className="min-h-48 w-full resize-none rounded-[24px] border border-line bg-surface p-4 text-[16px] leading-relaxed outline-none placeholder:text-muted focus:border-accent/50"
          aria-label={t("exercises.pitch.label")}
        />
        <p className={cn("mt-1 px-1 text-right text-[12px] tabular-nums", over ? "text-danger" : "text-muted")}>
          {t("exercises.pitch.words", { count: words })}
        </p>
      </div>

      {/* Timer: estimated speaking time against the chosen slot. */}
      <section className="rounded-[28px] bg-surface px-5 pt-6 pb-5 shadow-card">
        <div className="flex justify-center">
          <Ring
            value={slotSeconds > 0 ? (spokenSeconds / slotSeconds) * 100 : 0}
            size={196}
            stroke={10}
            tone={over ? "ink" : "accent"}
            label={t("exercises.pitch.ringLabel", { time: clock(spokenSeconds), slot: clock(slotSeconds) })}
          >
            <span className="flex flex-col items-center" aria-hidden>
              <span className="text-[44px] font-semibold leading-none tracking-tight tabular-nums">{clock(spokenSeconds)}</span>
              <span className="mt-1.5 text-[12px] text-muted">{t("exercises.pitch.ofSlot", { time: clock(slotSeconds) })}</span>
            </span>
          </Ring>
        </div>
        {over && <p className="mt-3 text-center text-[13px] text-danger">{t("exercises.pitch.overBudget")}</p>}
        <fieldset className="mt-5">
          <legend className="sr-only">{t("exercises.pitch.duration")}</legend>
          <div
            role="radiogroup"
            aria-label={t("exercises.pitch.duration")}
            className="grid auto-cols-fr grid-flow-col gap-2.5"
          >
            {config.durations.map((d) => (
              <button
                key={d}
                type="button"
                role="radio"
                aria-checked={duration === d}
                aria-label={t("exercises.pitch.minutes", { count: d })}
                disabled={locked}
                onClick={() => setDuration(d)}
                className={cn(
                  "flex aspect-[5/4] flex-col items-center justify-center rounded-[20px] transition active:scale-95",
                  duration === d ? "bg-hero text-hero-ink shadow-card" : "bg-surface-2 text-ink hover:bg-accent-soft",
                )}
              >
                <span className="text-[22px] font-semibold leading-none tabular-nums">{d}</span>
                <span className={cn("mt-1 text-[11px]", duration === d ? "text-hero-ink/70" : "text-muted")}>{t("exercises.pitch.minutesShort")}</span>
              </button>
            ))}
          </div>
        </fieldset>
        {!locked && (
          <Button className="mt-5" onClick={() => onSubmit({ audience, objective, duration, topic, text })} disabled={words < 15 || !topic.trim() || submitting}>
            {submitting ? t("exercises.pitch.evaluating") : t("exercises.pitch.submit")}
          </Button>
        )}
      </section>
    </div>
  );
}
