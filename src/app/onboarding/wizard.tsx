"use client";

import { ArrowLeft, Check } from "lucide-react";
import { useMemo, useRef, useState, useTransition } from "react";
import { LogoMark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/field";
import { ProgressBar } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import type { AssessmentQuestionView } from "@/server/services/onboarding";
import { submitOnboarding } from "./actions";

type Answer = string | string[];

export function OnboardingWizard({ firstName, questions }: { firstName: string; questions: AssessmentQuestionView[] }) {
  const [step, setStep] = useState(-1); // -1 = intro
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const advancing = useRef(false);

  // The "main goal" question is skipped when only one goal was picked.
  const visible = useMemo(
    () =>
      questions.filter((q) => {
        if (q.key !== "primary_goal") return true;
        const goals = answers.goals;
        return Array.isArray(goals) && goals.length > 1;
      }),
    [questions, answers.goals],
  );
  const q = step >= 0 ? visible[step] : null;
  const total = visible.length;

  const options = useMemo(() => {
    if (!q) return [];
    if (q.key === "primary_goal") {
      const picked = (answers.goals as string[]) ?? [];
      return q.options.filter((o) => picked.includes(o.value));
    }
    return q.options;
  }, [q, answers.goals]);

  const value = q ? answers[q.key] : undefined;
  const canContinue =
    !!q &&
    (q.type === "multi"
      ? Array.isArray(value) && value.length > 0
      : q.type === "text"
        ? typeof value === "string" && value.trim().length >= 3
        : typeof value === "string" && value.length > 0);

  function finish(final: Record<string, Answer>) {
    const payload: Record<string, unknown> = { ...final };
    const goals = (final.goals as string[]) ?? [];
    if (goals.length === 1) payload.primary_goal = goals[0];
    setError(null);
    startTransition(async () => {
      const result = await submitOnboarding(payload);
      if (result?.error) setError(result.error);
    });
  }

  function next(nextAnswers = answers) {
    if (step + 1 >= total) finish(nextAnswers);
    else setStep((s) => s + 1);
  }

  function choose(v: string) {
    if (!q) return;
    if (q.type === "multi") {
      const current = (answers[q.key] as string[]) ?? [];
      setAnswers({ ...answers, [q.key]: current.includes(v) ? current.filter((x) => x !== v) : [...current, v] });
      return;
    }
    const updated = { ...answers, [q.key]: v };
    setAnswers(updated);
    if (advancing.current) return;
    advancing.current = true;
    // Single-choice questions advance on their own after a beat.
    window.setTimeout(() => {
      advancing.current = false;
      next(updated);
    }, 220);
  }

  if (step === -1) {
    return (
      <Shell>
        <div className="flex flex-1 flex-col justify-center animate-rise">
          <LogoMark size={44} />
          <h1 className="mt-8 font-display text-[44px] leading-[1.02]">
            Hi {firstName}.
            <br />
            <span className="text-muted">Let&apos;s build your plan.</span>
          </h1>
          <p className="mt-5 max-w-sm text-[16px] leading-relaxed text-ink-2">
            A few quick questions — about three minutes. Your answers shape your goals, your daily training and how we
            measure your progress at day 30, 60 and 90.
          </p>
        </div>
        <Button onClick={() => setStep(0)}>Begin</Button>
      </Shell>
    );
  }

  if (!q) return null;
  const isRating = q.type === "scale";

  return (
    <Shell>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          className="-ml-2 grid h-10 w-10 place-items-center rounded-full text-ink-2 hover:bg-surface-2"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <ProgressBar value={((step + 1) / total) * 100} label="Onboarding progress" />
        <span className="w-12 text-right text-[12px] tabular-nums text-muted">
          {step + 1}/{total}
        </span>
      </div>

      <div key={q.key} className="flex flex-1 flex-col pt-8 animate-rise">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-accent">
          {isRating ? "How true is this today?" : q.section}
        </p>
        <h1 className="mt-3 font-display text-[32px] leading-[1.08]">{q.prompt}</h1>
        {q.helpText && <p className="mt-2 text-[15px] text-ink-2">{q.helpText}</p>}

        <div className="mt-7 flex-1">
          {q.type === "text" ? (
            <textarea
              autoFocus
              value={(value as string) ?? ""}
              onChange={(e) => setAnswers({ ...answers, [q.key]: e.target.value })}
              maxLength={500}
              placeholder="e.g. Present to leadership without notes and get a clear decision."
              className="min-h-36 w-full resize-none rounded-2xl border border-line bg-surface p-4 text-[17px] leading-relaxed outline-none placeholder:text-muted focus:border-ink/40"
              aria-label={q.prompt}
            />
          ) : isRating ? (
            <div role="radiogroup" aria-label={q.prompt} className="space-y-2.5">
              {options.map((o) => (
                <OptionTile key={o.value} selected={value === o.value} onClick={() => choose(o.value)} role="radio">
                  <span className="flex items-center gap-3">
                    <span className="flex gap-1" aria-hidden>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span key={n} className={cn("h-1.5 w-3 rounded-full", n <= Number(o.value) ? "bg-accent" : "bg-surface-2")} />
                      ))}
                    </span>
                    {o.label}
                  </span>
                </OptionTile>
              ))}
            </div>
          ) : (
            <div role={q.type === "multi" ? "group" : "radiogroup"} aria-label={q.prompt} className={cn(q.type === "multi" && q.key === "goals" ? "grid grid-cols-2 gap-2.5" : "space-y-2.5")}>
              {options.map((o) => {
                const selected = q.type === "multi" ? ((value as string[]) ?? []).includes(o.value) : value === o.value;
                return (
                  <OptionTile
                    key={o.value}
                    selected={selected}
                    onClick={() => choose(o.value)}
                    role={q.type === "multi" ? "checkbox" : "radio"}
                    compact={q.key === "goals"}
                  >
                    <span>
                      <span className="block">{o.label}</span>
                      {o.description && <span className="mt-0.5 block text-[13px] font-normal text-muted">{o.description}</span>}
                    </span>
                  </OptionTile>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {error && <div className="mb-3"><FormAlert>{error}</FormAlert></div>}
      {(q.type === "multi" || q.type === "text" || step + 1 === total) && (
        <Button onClick={() => next()} disabled={!canContinue || pending} aria-busy={pending}>
          {pending ? "Building your plan…" : step + 1 === total ? "Build my plan" : "Continue"}
        </Button>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-6 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      {children}
    </div>
  );
}

function OptionTile({
  selected,
  onClick,
  children,
  role,
  compact,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  role: "radio" | "checkbox";
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-2xl border bg-surface text-left text-[15px] font-medium transition active:scale-[0.99]",
        compact ? "min-h-14 px-4 py-3" : "min-h-16 px-4 py-3.5",
        selected ? "border-ink shadow-card" : "border-line hover:border-ink/30",
      )}
    >
      {children}
      <span
        className={cn(
          "grid h-6 w-6 shrink-0 place-items-center rounded-full border transition",
          selected ? "border-ink bg-ink text-bg" : "border-line",
        )}
        aria-hidden
      >
        {selected && <Check size={14} strokeWidth={3} />}
      </span>
    </button>
  );
}
