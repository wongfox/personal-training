"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { PitchConfig } from "@/server/db/types";
import type { RunnerProps } from "./runners";

function Chips({ label, options, value, onChange, disabled }: { label: string; options: string[]; value: string; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <fieldset>
      <legend className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</legend>
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
              "rounded-full border px-3.5 py-2 text-[14px] transition",
              value === o ? "border-ink bg-ink text-bg" : "border-line bg-surface hover:border-ink/30",
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
  const [audience, setAudience] = useState(config.audiences[0] ?? "");
  const [objective, setObjective] = useState(config.objectives[0] ?? "");
  const [duration, setDuration] = useState(config.durations[1] ?? config.durations[0] ?? 3);
  const [topic, setTopic] = useState(config.suggestedTopics[0] ?? "");
  const [text, setText] = useState("");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const budget = duration * 130;

  return (
    <div className="space-y-5">
      <p className="text-[16px] leading-relaxed">{config.briefing}</p>
      <Chips label="Audience" options={config.audiences} value={audience} onChange={setAudience} disabled={locked} />
      <Chips label="Objective" options={config.objectives} value={objective} onChange={setObjective} disabled={locked} />
      <Chips label="Duration" options={config.durations.map((d) => `${d} min`)} value={`${duration} min`} onChange={(v) => setDuration(Number.parseInt(v, 10))} disabled={locked} />
      <div>
        <label htmlFor="topic" className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">
          Topic
        </label>
        <input
          id="topic"
          list="topics"
          value={topic}
          disabled={locked}
          onChange={(e) => setTopic(e.target.value)}
          className="mt-2 h-12 w-full rounded-xl border border-line bg-surface px-3 text-[16px] outline-none focus:border-ink/40"
        />
        <datalist id="topics">
          {config.suggestedTopics.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>
      </div>
      <div className="rounded-2xl bg-surface-2 p-4 text-[14px] leading-relaxed">
        You have <span className="font-semibold">{duration} minute{duration > 1 ? "s" : ""}</span> with{" "}
        <span className="font-semibold">{audience.toLowerCase()}</span> on <span className="font-semibold">{topic || "your topic"}</span>. Your
        objective: <span className="font-semibold">{objective.toLowerCase()}</span>. Write your opening exactly as you&apos;d say it.
      </div>
      <div>
        <textarea
          value={text}
          disabled={locked}
          onChange={(e) => setText(e.target.value)}
          maxLength={4000}
          placeholder="Good morning. In the next three minutes…"
          className="min-h-48 w-full resize-none rounded-2xl border border-line bg-surface p-4 text-[16px] leading-relaxed outline-none focus:border-ink/40"
          aria-label="Your opening"
        />
        <p className={cn("mt-1 text-right text-[12px] tabular-nums", words > budget ? "text-danger" : "text-muted")}>
          {words} words · ~{Math.max(1, Math.round((words / 130) * 60))}s spoken
        </p>
      </div>
      {!locked && (
        <Button onClick={() => onSubmit({ audience, objective, duration, topic, text })} disabled={words < 15 || !topic.trim() || submitting}>
          {submitting ? "Evaluating…" : "Evaluate my opening"}
        </Button>
      )}
    </div>
  );
}
