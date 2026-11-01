"use client";

import { ChevronDown, ChevronUp, Eye, Lightbulb, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { DecisionConfig, RecallConfig, StructureConfig } from "@/server/db/types";
import type { ClientExerciseConfig } from "@/server/engine/client-config";
import { analyzeText } from "@/server/engine/text-analysis";

type Of<T extends ClientExerciseConfig["type"]> = Extract<ClientExerciseConfig, { type: T }>;

export interface RunnerProps<C> {
  config: C;
  submitting: boolean;
  locked: boolean;
  onSubmit: (response: unknown) => void;
}

const textareaClass =
  "w-full resize-none rounded-2xl border border-line bg-surface p-4 text-[16px] leading-relaxed outline-none placeholder:text-muted focus:border-ink/40 disabled:opacity-70";

function wordCount(s: string) {
  return s.trim() ? s.trim().split(/\s+/).length : 0;
}

/* ─────────────────────────── Choice ─────────────────────────── */

export function ChoiceRunner({ config, submitting, locked, onSubmit }: RunnerProps<Of<"choice">>) {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-surface-2 p-4 text-[15px] leading-relaxed">{config.scenario}</div>
      <p className="text-[17px] font-semibold">{config.question}</p>
      <div role="radiogroup" className="space-y-2.5">
        {config.options.map((o, i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={selected === i}
            disabled={locked}
            onClick={() => setSelected(i)}
            className={cn(
              "w-full rounded-2xl border bg-surface px-4 py-3.5 text-left text-[15px] leading-relaxed transition",
              selected === i ? "border-ink shadow-card" : "border-line hover:border-ink/30",
            )}
          >
            {o}
          </button>
        ))}
      </div>
      {!locked && (
        <Button onClick={() => selected !== null && onSubmit({ selected })} disabled={selected === null || submitting}>
          {submitting ? "Checking…" : "Check my answer"}
        </Button>
      )}
    </div>
  );
}

/* ─────────────────────────── Rewrite ─────────────────────────── */

export function RewriteRunner({ config, submitting, locked, onSubmit }: RunnerProps<Of<"rewrite">>) {
  const [text, setText] = useState("");
  const [showTips, setShowTips] = useState(false);
  const words = wordCount(text);
  const live = useMemo(() => analyzeText(text), [text]);
  const weak = [...new Set([...live.hedges, ...live.apologies])];
  return (
    <div className="space-y-4">
      <p className="text-[16px] leading-relaxed">{config.instruction}</p>
      <blockquote className="rounded-2xl border-l-[3px] border-line bg-surface-2 p-4 text-[15px] italic leading-relaxed text-ink-2">
        {config.original}
      </blockquote>
      {config.tips.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowTips((v) => !v)}
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink-2"
            aria-expanded={showTips}
          >
            <Lightbulb size={15} /> {showTips ? "Hide tips" : "Show tips"}
          </button>
          {showTips && (
            <ul className="mt-2 space-y-1 pl-1 text-[14px] text-ink-2">
              {config.tips.map((t) => (
                <li key={t}>— {t}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div>
        <label htmlFor="rewrite" className="sr-only">
          Your version
        </label>
        <textarea
          id="rewrite"
          value={text}
          disabled={locked}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your version…"
          maxLength={2000}
          className={cn(textareaClass, "min-h-32")}
        />
        <div className="mt-1.5 flex items-center justify-between text-[12px]">
          <span className={cn(weak.length ? "text-danger" : "text-muted")}>
            {weak.length ? `Weak phrases: ${weak.join(", ")}` : text ? "No hedges detected" : ""}
          </span>
          <span className={cn("tabular-nums", words > config.maxWords ? "text-danger" : "text-muted")}>
            {words}/{config.maxWords} words
          </span>
        </div>
      </div>
      {!locked && (
        <Button onClick={() => onSubmit({ text })} disabled={words < 3 || submitting}>
          {submitting ? "Reviewing…" : "Get feedback"}
        </Button>
      )}
    </div>
  );
}

/* ─────────────────────────── Order ─────────────────────────── */

export function OrderRunner({ config, submitting, locked, onSubmit }: RunnerProps<Of<"order">>) {
  const [items, setItems] = useState(config.items);
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
  };
  return (
    <div className="space-y-4">
      <p className="text-[16px] leading-relaxed">{config.instruction}</p>
      <ol className="space-y-2">
        {items.map((item, i) => (
          <li key={item.key} className="flex items-center gap-2 rounded-2xl border border-line bg-surface py-2 pl-4 pr-2">
            <span className="w-5 shrink-0 text-[13px] tabular-nums text-muted">{i + 1}</span>
            <span className="flex-1 text-[15px] leading-snug">{item.text}</span>
            {!locked && (
              <span className="flex flex-col">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="grid h-8 w-9 place-items-center rounded-lg text-ink-2 hover:bg-surface-2 disabled:opacity-25" aria-label={`Move “${item.text}” up`}>
                  <ChevronUp size={18} />
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="grid h-8 w-9 place-items-center rounded-lg text-ink-2 hover:bg-surface-2 disabled:opacity-25" aria-label={`Move “${item.text}” down`}>
                  <ChevronDown size={18} />
                </button>
              </span>
            )}
          </li>
        ))}
      </ol>
      {!locked && (
        <Button onClick={() => onSubmit({ order: items.map((i) => i.key) })} disabled={submitting}>
          {submitting ? "Checking…" : "Check the order"}
        </Button>
      )}
    </div>
  );
}

/* ─────────────────────────── Recall ─────────────────────────── */

export function RecallRunner({ config, submitting, locked, onSubmit }: RunnerProps<RecallConfig>) {
  const [phase, setPhase] = useState<"ready" | "study" | "recall">("ready");
  const [left, setLeft] = useState(config.studySeconds);
  const [text, setText] = useState("");

  useEffect(() => {
    if (phase !== "study") return;
    if (left <= 0) {
      setPhase("recall");
      return;
    }
    const t = window.setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [phase, left]);

  if (phase === "ready" && !locked) {
    return (
      <div className="space-y-4">
        <p className="text-[16px] leading-relaxed">{config.instruction}</p>
        <div className="rounded-2xl bg-surface-2 p-4 text-[14px] leading-relaxed text-ink-2">
          <span className="font-semibold text-ink">Technique: </span>
          {config.technique}
        </div>
        <Button onClick={() => setPhase("study")}>
          <Eye size={18} /> Show me ({config.studySeconds}s)
        </Button>
      </div>
    );
  }
  if (phase === "study") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">Memorise</p>
          <span className="rounded-full bg-accent-soft px-3 py-1 text-[14px] font-semibold tabular-nums text-accent" aria-live="polite">
            {left}s
          </span>
        </div>
        <ul className="space-y-2">
          {config.items.map((item) => (
            <li key={item} className="rounded-2xl bg-surface px-4 py-3 text-[15px] shadow-card">
              {item}
            </li>
          ))}
        </ul>
        <Button variant="secondary" onClick={() => setPhase("recall")}>
          I&apos;m ready
        </Button>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <p className="text-[16px] leading-relaxed">Now write down everything you remember — one per line, in any order.</p>
      <textarea
        value={text}
        disabled={locked}
        onChange={(e) => setText(e.target.value)}
        className={cn(textareaClass, "min-h-44")}
        placeholder="One per line…"
        aria-label="What you remember"
      />
      {!locked && (
        <Button onClick={() => onSubmit({ text })} disabled={submitting || text.trim().length < 2}>
          {submitting ? "Scoring…" : "Check my recall"}
        </Button>
      )}
    </div>
  );
}

/* ─────────────────────────── Structure ─────────────────────────── */

export function StructureRunner({ config, submitting, locked, onSubmit }: RunnerProps<StructureConfig>) {
  const [slots, setSlots] = useState<Record<string, string>>({});
  const filled = config.slots.filter((s) => wordCount(slots[s.key] ?? "") >= 3).length;
  return (
    <div className="space-y-4">
      <p className="text-[16px] leading-relaxed">{config.instruction}</p>
      {config.context && <div className="rounded-2xl bg-surface-2 p-4 text-[15px] leading-relaxed">{config.context}</div>}
      <ol className="space-y-3">
        {config.slots.map((s, i) => {
          const words = wordCount(slots[s.key] ?? "");
          return (
            <li key={s.key}>
              <label htmlFor={`slot-${s.key}`} className="flex items-baseline gap-2 text-[14px] font-semibold">
                <span className="text-muted tabular-nums">{i + 1}</span> {s.label}
              </label>
              <textarea
                id={`slot-${s.key}`}
                value={slots[s.key] ?? ""}
                disabled={locked}
                onChange={(e) => setSlots({ ...slots, [s.key]: e.target.value })}
                placeholder={s.hint}
                className={cn(textareaClass, "mt-1.5 min-h-20")}
              />
              <p className={cn("mt-1 text-right text-[12px] tabular-nums", words > s.maxWords ? "text-danger" : "text-muted")}>
                {words}/{s.maxWords}
              </p>
            </li>
          );
        })}
      </ol>
      {!locked && (
        <Button onClick={() => onSubmit({ slots })} disabled={filled < config.slots.length || submitting}>
          {submitting ? "Reviewing…" : `Get feedback${filled < config.slots.length ? ` (${filled}/${config.slots.length})` : ""}`}
        </Button>
      )}
    </div>
  );
}

/* ─────────────────────────── Decision ─────────────────────────── */

export function DecisionRunner({ config, submitting, locked, onSubmit }: RunnerProps<DecisionConfig>) {
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [criteria, setCriteria] = useState(config.suggestedCriteria.slice(0, 4).map((name) => ({ name, weight: 3 })));
  const [scores, setScores] = useState<Record<string, number>>({});
  const named = options.map((o) => o.trim()).filter(Boolean);
  const complete =
    named.length >= 2 &&
    criteria.length >= 1 &&
    named.every((_, oi) => criteria.every((_, ci) => scores[`${oi}:${ci}`]));

  const submit = () =>
    onSubmit({
      options: named,
      criteria,
      scores: named.map((_, oi) => criteria.map((_, ci) => scores[`${oi}:${ci}`] ?? 3)),
    });

  return (
    <div className="space-y-5">
      <p className="text-[16px] leading-relaxed">{config.instruction}</p>
      <div className="rounded-2xl bg-surface-2 p-4 text-[15px] leading-relaxed">{config.prompt}</div>

      <fieldset>
        <legend className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">1 · Your options</legend>
        <div className="mt-2 space-y-2">
          {options.map((o, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={o}
                disabled={locked}
                onChange={(e) => setOptions(options.map((x, j) => (j === i ? e.target.value : x)))}
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                className="h-12 flex-1 rounded-xl border border-line bg-surface px-3 text-[16px] outline-none focus:border-ink/40"
                aria-label={`Option ${i + 1}`}
              />
              {options.length > 2 && !locked && (
                <button type="button" onClick={() => setOptions(options.filter((_, j) => j !== i))} className="grid w-10 place-items-center text-muted" aria-label="Remove option">
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
          {options.length < 4 && !locked && (
            <button type="button" onClick={() => setOptions([...options, ""])} className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink-2">
              <Plus size={15} /> Add option
            </button>
          )}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">2 · What matters (weight 1–5)</legend>
        <ul className="mt-2 space-y-2">
          {criteria.map((c, ci) => (
            <li key={ci} className="flex items-center gap-2">
              <input
                value={c.name}
                disabled={locked}
                onChange={(e) => setCriteria(criteria.map((x, j) => (j === ci ? { ...x, name: e.target.value } : x)))}
                className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-surface px-3 text-[15px] outline-none focus:border-ink/40"
                aria-label={`Criterion ${ci + 1}`}
              />
              <Segment value={c.weight} disabled={locked} onChange={(w) => setCriteria(criteria.map((x, j) => (j === ci ? { ...x, weight: w } : x)))} label={`Weight for ${c.name}`} />
            </li>
          ))}
        </ul>
      </fieldset>

      {named.length >= 2 && (
        <fieldset>
          <legend className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">3 · Score each option (1–5)</legend>
          <div className="mt-2 space-y-3">
            {named.map((o, oi) => (
              <div key={oi} className="rounded-2xl bg-surface p-4 shadow-card">
                <p className="font-semibold">{o}</p>
                <ul className="mt-2 space-y-2">
                  {criteria.map((c, ci) => (
                    <li key={ci} className="flex items-center justify-between gap-2 text-[14px]">
                      <span className="min-w-0 truncate text-ink-2">{c.name || `Criterion ${ci + 1}`}</span>
                      <Segment value={scores[`${oi}:${ci}`] ?? 0} disabled={locked} onChange={(v) => setScores({ ...scores, [`${oi}:${ci}`]: v })} label={`${o} on ${c.name}`} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </fieldset>
      )}

      {!locked && (
        <Button onClick={submit} disabled={!complete || submitting}>
          {submitting ? "Calculating…" : "See the result"}
        </Button>
      )}
    </div>
  );
}

function Segment({ value, onChange, disabled, label }: { value: number; onChange: (v: number) => void; disabled?: boolean; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex shrink-0 gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          disabled={disabled}
          onClick={() => onChange(n)}
          className={cn(
            "h-8 w-8 rounded-lg text-[13px] font-semibold tabular-nums transition",
            value === n ? "bg-ink text-bg" : value > 0 && n < value ? "bg-surface-2 text-ink" : "bg-surface-2 text-muted",
          )}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
