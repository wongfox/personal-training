"use client";

import { Check, ChevronDown, ChevronUp, Eye, Lightbulb, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Ring } from "@/components/ui/primitives";
import { useLocale, useT } from "@/i18n/client";
import { INTL_LOCALE } from "@/i18n/config";
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
  "w-full resize-none rounded-[22px] border border-line bg-surface p-4 text-[16px] leading-relaxed outline-none placeholder:text-muted focus:border-accent/50 disabled:opacity-70";

const inputClass = "rounded-[16px] border border-line bg-surface px-3.5 text-[16px] outline-none placeholder:text-muted focus:border-accent/50";

const legendClass = "text-[12px] font-semibold uppercase tracking-[0.12em] text-muted";

function wordCount(s: string) {
  return s.trim() ? s.trim().split(/\s+/).length : 0;
}

/** Soft sage card for scenarios, context and briefings coming from the exercise. */
function ContextCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-[24px] bg-accent-soft p-5 text-[15px] leading-relaxed text-ink", className)}>{children}</div>;
}

/* ─────────────────────────── Choice ─────────────────────────── */

export function ChoiceRunner({ config, submitting, locked, onSubmit }: RunnerProps<Of<"choice">>) {
  const t = useT();
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="space-y-4">
      <ContextCard>{config.scenario}</ContextCard>
      <p className="font-display text-[22px] leading-snug">{config.question}</p>
      <div role="radiogroup" aria-label={config.question} className="space-y-2.5">
        {config.options.map((o, i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={selected === i}
            disabled={locked}
            onClick={() => setSelected(i)}
            className={cn(
              "flex w-full items-center gap-3.5 rounded-[22px] border bg-surface px-4 py-4 text-left text-[15px] leading-relaxed transition active:scale-[0.99]",
              selected === i ? "border-hero shadow-card" : "border-line hover:border-ink/25",
            )}
          >
            <CheckCircle on={selected === i} />
            <span className="min-w-0 flex-1">{o}</span>
          </button>
        ))}
      </div>
      {!locked && (
        <Button onClick={() => selected !== null && onSubmit({ selected })} disabled={selected === null || submitting}>
          {submitting ? t("exercises.choice.checking") : t("exercises.choice.check")}
        </Button>
      )}
    </div>
  );
}

/** Circular check mark used by option tiles. */
function CheckCircle({ on }: { on: boolean }) {
  return (
    <span
      className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition", on ? "border-hero bg-hero text-hero-ink" : "border-line")}
      aria-hidden
    >
      {on && <Check size={13} strokeWidth={3} />}
    </span>
  );
}

/* ─────────────────────────── Rewrite ─────────────────────────── */

export function RewriteRunner({ config, submitting, locked, onSubmit }: RunnerProps<Of<"rewrite">>) {
  const t = useT();
  const locale = useLocale();
  const [text, setText] = useState("");
  const [showTips, setShowTips] = useState(false);
  const words = wordCount(text);
  const live = useMemo(() => analyzeText(text), [text]);
  const weak = [...new Set([...live.hedges, ...live.apologies])];
  const list = new Intl.ListFormat(INTL_LOCALE[locale], { style: "short", type: "unit" });
  return (
    <div className="space-y-4">
      <p className="text-[16px] leading-relaxed">{config.instruction}</p>
      <blockquote className="rounded-[22px] border-l-[3px] border-accent/40 bg-surface-2 p-4 text-[15px] italic leading-relaxed text-ink-2">
        {config.original}
      </blockquote>
      {config.tips.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowTips((v) => !v)}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-surface-2 px-3.5 text-[14px] font-medium text-ink-2 transition hover:text-ink"
            aria-expanded={showTips}
          >
            <Lightbulb size={15} aria-hidden /> {showTips ? t("exercises.rewrite.hideTips") : t("exercises.rewrite.showTips")}
          </button>
          {showTips && (
            <ul className="mt-3 space-y-2 rounded-[22px] bg-accent-soft p-4 text-[14px] leading-relaxed text-ink-2 animate-rise">
              {config.tips.map((tip) => (
                <li key={tip} className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div>
        <label htmlFor="rewrite" className="sr-only">
          {t("exercises.rewrite.label")}
        </label>
        <textarea
          id="rewrite"
          value={text}
          disabled={locked}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("exercises.rewrite.placeholder")}
          maxLength={2000}
          className={cn(textareaClass, "min-h-32")}
        />
        <div className="mt-1.5 flex items-center justify-between gap-3 px-1 text-[12px]">
          <span className={cn(weak.length ? "text-danger" : "text-muted")}>
            {weak.length ? t("exercises.rewrite.weak", { list: list.format(weak) }) : text ? t("exercises.rewrite.noHedges") : ""}
          </span>
          <span className={cn("shrink-0 tabular-nums", words > config.maxWords ? "text-danger" : "text-muted")}>
            {t("exercises.rewrite.count", { count: words, max: config.maxWords })}
          </span>
        </div>
      </div>
      {!locked && (
        <Button onClick={() => onSubmit({ text })} disabled={words < 3 || submitting}>
          {submitting ? t("exercises.rewrite.reviewing") : t("exercises.rewrite.submit")}
        </Button>
      )}
    </div>
  );
}

/* ─────────────────────────── Order ─────────────────────────── */

export function OrderRunner({ config, submitting, locked, onSubmit }: RunnerProps<Of<"order">>) {
  const t = useT();
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
          <li key={item.key} className="flex items-center gap-3 rounded-[22px] bg-surface py-2 pl-3 pr-2 shadow-card">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-soft text-[13px] font-semibold tabular-nums text-accent">{i + 1}</span>
            <span className="flex-1 py-1.5 text-[15px] leading-snug">{item.text}</span>
            {!locked && (
              <span className="flex flex-col">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="grid h-8 w-9 place-items-center rounded-xl text-ink-2 hover:bg-surface-2 disabled:opacity-25"
                  aria-label={t("exercises.order.moveUp", { item: item.text })}
                >
                  <ChevronUp size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                  className="grid h-8 w-9 place-items-center rounded-xl text-ink-2 hover:bg-surface-2 disabled:opacity-25"
                  aria-label={t("exercises.order.moveDown", { item: item.text })}
                >
                  <ChevronDown size={18} />
                </button>
              </span>
            )}
          </li>
        ))}
      </ol>
      {!locked && (
        <Button onClick={() => onSubmit({ order: items.map((i) => i.key) })} disabled={submitting}>
          {submitting ? t("exercises.order.checking") : t("exercises.order.check")}
        </Button>
      )}
    </div>
  );
}

/* ─────────────────────────── Recall ─────────────────────────── */

export function RecallRunner({ config, submitting, locked, onSubmit }: RunnerProps<RecallConfig>) {
  const t = useT();
  const [phase, setPhase] = useState<"ready" | "study" | "recall">("ready");
  const [left, setLeft] = useState(config.studySeconds);
  const [text, setText] = useState("");

  useEffect(() => {
    if (phase !== "study") return;
    const timer = window.setTimeout(() => {
      if (left <= 1) setPhase("recall");
      else setLeft(left - 1);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [phase, left]);

  if (phase === "ready" && !locked) {
    return (
      <div className="space-y-4">
        <p className="text-[16px] leading-relaxed">{config.instruction}</p>
        <ContextCard className="text-[14px] text-ink-2">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">{t("exercises.recall.technique")}</span>
          <span className="mt-1 block">{config.technique}</span>
        </ContextCard>
        <Button onClick={() => setPhase("study")}>
          <Eye size={18} aria-hidden /> {t("exercises.recall.show", { seconds: config.studySeconds })}
        </Button>
      </div>
    );
  }
  if (phase === "study") {
    const pct = config.studySeconds > 0 ? (left / config.studySeconds) * 100 : 0;
    return (
      <div className="space-y-5">
        <p className={cn(legendClass, "text-center")}>{t("exercises.recall.memorise")}</p>
        <div className="flex justify-center">
          <Ring value={pct} size={176} stroke={9} tone="accent" label={t("exercises.recall.timerLabel", { count: left })}>
            <span className="flex flex-col items-center" aria-hidden>
              <span className="font-display text-[52px] leading-none tabular-nums">{left}</span>
              <span className="mt-1 text-[12px] text-muted">{t("exercises.recall.secondsUnit")}</span>
            </span>
          </Ring>
        </div>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {config.items.map((item) => (
            <li key={item} className="rounded-[18px] bg-surface px-4 py-3 text-[15px] shadow-card">
              {item}
            </li>
          ))}
        </ul>
        <Button onClick={() => setPhase("recall")}>{t("exercises.recall.ready")}</Button>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <p className="font-display text-[22px] leading-snug">{t("exercises.recall.prompt")}</p>
      <textarea
        value={text}
        disabled={locked}
        onChange={(e) => setText(e.target.value)}
        className={cn(textareaClass, "min-h-44")}
        placeholder={t("exercises.recall.placeholder")}
        aria-label={t("exercises.recall.label")}
      />
      {!locked && (
        <Button onClick={() => onSubmit({ text })} disabled={submitting || text.trim().length < 2}>
          {submitting ? t("exercises.recall.scoring") : t("exercises.recall.submit")}
        </Button>
      )}
    </div>
  );
}

/* ─────────────────────────── Structure ─────────────────────────── */

export function StructureRunner({ config, submitting, locked, onSubmit }: RunnerProps<StructureConfig>) {
  const t = useT();
  const [slots, setSlots] = useState<Record<string, string>>({});
  const filled = config.slots.filter((s) => wordCount(slots[s.key] ?? "") >= 3).length;
  return (
    <div className="space-y-4">
      <p className="text-[16px] leading-relaxed">{config.instruction}</p>
      {config.context && <ContextCard>{config.context}</ContextCard>}
      <ol className="space-y-3">
        {config.slots.map((s, i) => {
          const words = wordCount(slots[s.key] ?? "");
          const done = words >= 3;
          return (
            <li key={s.key} className="rounded-[24px] bg-surface p-4 shadow-card">
              <label htmlFor={`slot-${s.key}`} className="flex items-center gap-2.5 text-[15px] font-semibold">
                <span
                  className={cn(
                    "grid h-6 w-6 shrink-0 place-items-center rounded-full text-[12px] tabular-nums transition",
                    done ? "bg-accent text-accent-ink" : "bg-surface-2 text-muted",
                  )}
                  aria-hidden
                >
                  {done ? <Check size={13} strokeWidth={3} /> : i + 1}
                </span>
                {s.label}
              </label>
              <textarea
                id={`slot-${s.key}`}
                value={slots[s.key] ?? ""}
                disabled={locked}
                onChange={(e) => setSlots({ ...slots, [s.key]: e.target.value })}
                placeholder={s.hint}
                className={cn(textareaClass, "mt-2.5 min-h-20 bg-bg/40")}
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
          {submitting
            ? t("exercises.structure.reviewing")
            : filled < config.slots.length
              ? t("exercises.structure.submitProgress", { filled, total: config.slots.length })
              : t("exercises.structure.submit")}
        </Button>
      )}
    </div>
  );
}

/* ─────────────────────────── Decision ─────────────────────────── */

export function DecisionRunner({ config, submitting, locked, onSubmit }: RunnerProps<DecisionConfig>) {
  const t = useT();
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
      <ContextCard>{config.prompt}</ContextCard>

      <fieldset className="rounded-[24px] bg-surface p-4 shadow-card">
        <legend className={cn(legendClass, "float-left w-full")}>{t("exercises.decision.optionsLegend")}</legend>
        <div className="clear-both space-y-2 pt-3">
          {options.map((o, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={o}
                disabled={locked}
                onChange={(e) => setOptions(options.map((x, j) => (j === i ? e.target.value : x)))}
                placeholder={t("exercises.decision.optionPlaceholder", { letter: String.fromCharCode(65 + i) })}
                className={cn(inputClass, "h-12 min-w-0 flex-1")}
                aria-label={t("exercises.decision.optionLabel", { n: i + 1 })}
              />
              {options.length > 2 && !locked && (
                <button
                  type="button"
                  onClick={() => setOptions(options.filter((_, j) => j !== i))}
                  className="grid w-10 place-items-center rounded-full text-muted hover:bg-surface-2"
                  aria-label={t("exercises.decision.removeOption")}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
          {options.length < 4 && !locked && (
            <button
              type="button"
              onClick={() => setOptions([...options, ""])}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-surface-2 px-3.5 text-[14px] font-medium text-ink-2 hover:text-ink"
            >
              <Plus size={15} aria-hidden /> {t("exercises.decision.addOption")}
            </button>
          )}
        </div>
      </fieldset>

      <fieldset className="rounded-[24px] bg-surface p-4 shadow-card">
        <legend className={cn(legendClass, "float-left w-full")}>{t("exercises.decision.criteriaLegend")}</legend>
        <ul className="clear-both space-y-2.5 pt-3">
          {criteria.map((c, ci) => (
            <li key={ci} className="flex flex-wrap items-center gap-2">
              <input
                value={c.name}
                disabled={locked}
                onChange={(e) => setCriteria(criteria.map((x, j) => (j === ci ? { ...x, name: e.target.value } : x)))}
                className={cn(inputClass, "h-11 min-w-0 flex-1 basis-32 text-[15px]")}
                aria-label={t("exercises.decision.criterionLabel", { n: ci + 1 })}
              />
              <Segment
                value={c.weight}
                disabled={locked}
                onChange={(w) => setCriteria(criteria.map((x, j) => (j === ci ? { ...x, weight: w } : x)))}
                label={t("exercises.decision.weightFor", { name: c.name })}
              />
            </li>
          ))}
        </ul>
      </fieldset>

      {named.length >= 2 && (
        <fieldset>
          <legend className={legendClass}>{t("exercises.decision.scoreLegend")}</legend>
          <div className="mt-2 space-y-3">
            {named.map((o, oi) => (
              <div key={oi} className="rounded-[24px] bg-surface p-4 shadow-card">
                <p className="font-display text-[19px] leading-snug">{o}</p>
                <ul className="mt-2 space-y-2">
                  {criteria.map((c, ci) => {
                    const criterion = c.name || t("exercises.decision.criterionLabel", { n: ci + 1 });
                    return (
                      <li key={ci} className="flex items-center justify-between gap-2 text-[14px]">
                        <span className="min-w-0 truncate text-ink-2">{criterion}</span>
                        <Segment
                          value={scores[`${oi}:${ci}`] ?? 0}
                          disabled={locked}
                          onChange={(v) => setScores({ ...scores, [`${oi}:${ci}`]: v })}
                          label={t("exercises.decision.scoreFor", { option: o, criterion })}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </fieldset>
      )}

      {!locked && (
        <Button onClick={submit} disabled={!complete || submitting}>
          {submitting ? t("exercises.decision.calculating") : t("exercises.decision.submit")}
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
            "h-8 w-8 rounded-full text-[13px] font-semibold tabular-nums transition active:scale-95",
            value === n ? "bg-hero text-hero-ink" : value > 0 && n < value ? "bg-accent-soft text-accent" : "bg-surface-2 text-muted",
          )}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
