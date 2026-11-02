"use client";

import { ArrowLeft, CalendarClock, Check, Gauge, Target } from "lucide-react";
import { useMemo, useRef, useState, useTransition } from "react";
import { LogoMark } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { DawnScene } from "@/components/scene";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/field";
import { ProgressBar } from "@/components/ui/primitives";
import { useT } from "@/i18n/client";
import { cn } from "@/lib/cn";
import type { AssessmentQuestionView } from "@/server/services/onboarding";
import { submitOnboarding } from "./actions";

type Answer = string | string[];

export function OnboardingWizard({ firstName, questions }: { firstName: string; questions: AssessmentQuestionView[] }) {
  const t = useT();
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
    const points = [
      { key: "goals", icon: Target },
      { key: "rhythm", icon: CalendarClock },
      { key: "baseline", icon: Gauge },
    ] as const;
    return (
      <Shell>
        <header className="flex items-center justify-between gap-3 py-2">
          <LogoMark size={36} />
          <LanguageSwitcher />
        </header>
        <div className="flex flex-1 flex-col justify-center py-6 animate-rise">
          {/* The dawn scene is light in both themes, so its label keeps fixed colours. */}
          <div className="relative isolate h-[150px] overflow-hidden rounded-[28px] p-5 shadow-card">
            <DawnScene className="absolute inset-0 -z-10" />
            <span className="inline-flex rounded-full bg-[#fffcf7]/85 px-3.5 py-1.5 text-[12px] font-semibold text-[#2e4a3b] backdrop-blur">
              {t("onboarding.intro.eyebrow")}
            </span>
          </div>
          <h1 className="mt-7 font-display text-[42px] leading-[1.02] tracking-[-0.01em]">
            {t("onboarding.intro.greeting", { name: firstName })}
            <br />
            <span className="italic text-ink-2">{t("onboarding.intro.title")}</span>
          </h1>
          <p className="mt-4 max-w-sm text-[16px] leading-relaxed text-ink-2">{t("onboarding.intro.body")}</p>
          <ul className="mt-6 grid grid-cols-3 gap-2.5">
            {points.map(({ key, icon: Icon }) => (
              <li key={key} className="flex flex-col items-center gap-2 rounded-[22px] bg-surface px-2 py-4 text-center shadow-card">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent-soft text-accent" aria-hidden>
                  <Icon size={19} strokeWidth={1.8} />
                </span>
                <span className="text-[12px] font-medium leading-tight text-ink-2">{t(`onboarding.intro.points.${key}`)}</span>
              </li>
            ))}
          </ul>
        </div>
        <Button onClick={() => setStep(0)}>{t("onboarding.intro.begin")}</Button>
      </Shell>
    );
  }

  if (!q) return null;
  const isRating = q.type === "scale";

  return (
    <Shell>
      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface text-ink-2 shadow-card transition hover:text-ink"
          aria-label={t("common.back")}
        >
          <ArrowLeft size={19} />
        </button>
        <ProgressBar value={((step + 1) / total) * 100} label={t("onboarding.progress")} tone="accent" className="h-2" />
        <span className="w-12 text-right text-[12px] tabular-nums text-muted">
          <span aria-hidden>
            {step + 1}/{total}
          </span>
          <span className="sr-only">{t("onboarding.stepOf", { current: step + 1, total })}</span>
        </span>
      </div>

      <div key={q.key} className="flex flex-1 flex-col pt-8 animate-rise">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-accent">
          {isRating ? t("onboarding.ratingEyebrow") : q.section}
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
              placeholder={t("onboarding.textPlaceholder")}
              className="min-h-40 w-full resize-none rounded-[22px] border border-line bg-surface p-5 text-[17px] leading-relaxed shadow-card outline-none placeholder:text-muted focus:border-accent/50"
              aria-label={q.prompt}
            />
          ) : isRating ? (
            <div role="radiogroup" aria-label={q.prompt} className="space-y-2.5">
              {options.map((o) => {
                const selected = value === o.value;
                return (
                  <OptionTile key={o.value} selected={selected} onClick={() => choose(o.value)} role="radio">
                    <span className="flex items-center gap-3">
                      <span className="flex gap-1" aria-hidden>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <span
                            key={n}
                            className={cn(
                              "h-1.5 w-3 rounded-full",
                              n <= Number(o.value) ? (selected ? "bg-sun" : "bg-accent") : selected ? "bg-hero-ink/25" : "bg-surface-2",
                            )}
                          />
                        ))}
                      </span>
                      {o.label}
                    </span>
                  </OptionTile>
                );
              })}
            </div>
          ) : (
            <div
              role={q.type === "multi" ? "group" : "radiogroup"}
              aria-label={q.prompt}
              className={cn(q.type === "multi" && q.key === "goals" ? "grid grid-cols-2 gap-2.5" : "space-y-2.5")}
            >
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
                    <span className="min-w-0">
                      <span className="block">{o.label}</span>
                      {o.description && (
                        <span className={cn("mt-0.5 block text-[13px] font-normal", selected ? "text-hero-ink/75" : "text-muted")}>
                          {o.description}
                        </span>
                      )}
                    </span>
                  </OptionTile>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-3">
          <FormAlert>{error}</FormAlert>
        </div>
      )}
      {(q.type === "multi" || q.type === "text" || step + 1 === total) && (
        <div className="pt-5">
          <Button onClick={() => next()} disabled={!canContinue || pending} aria-busy={pending}>
            {pending ? t("onboarding.building") : step + 1 === total ? t("onboarding.submit") : t("common.continue")}
          </Button>
        </div>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
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
        "flex w-full items-center justify-between gap-3 rounded-[22px] text-left text-[15px] font-medium shadow-card transition active:scale-[0.99]",
        compact ? "min-h-14 px-4 py-3" : "min-h-16 px-5 py-3.5",
        selected ? "bg-hero text-hero-ink" : "bg-surface text-ink hover:bg-surface-2",
      )}
    >
      {children}
      <span
        className={cn(
          "grid h-6 w-6 shrink-0 place-items-center rounded-full border transition",
          selected ? "border-hero-ink bg-hero-ink text-hero" : "border-line",
        )}
        aria-hidden
      >
        {selected && <Check size={14} strokeWidth={3} />}
      </span>
    </button>
  );
}
