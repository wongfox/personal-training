"use client";

import { Brain, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FocusShell } from "@/components/focus-shell";
import { Button, ButtonLink } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/field";
import { Ring } from "@/components/ui/primitives";
import { useLocale, useT } from "@/i18n/client";
import { cn } from "@/lib/cn";
import { formatDay } from "@/lib/dates";
import { postJSON } from "@/lib/api-client";

interface Item {
  id: string;
  stage: number;
  prompt: string;
  options: string[];
  lessonTitle: string;
}

interface Result {
  correct: boolean;
  correctIndex: number;
  explanation: string;
  nextDueOn: string | null;
}

export function ReviewSession({ items }: { items: Item[] }) {
  const t = useT();
  const locale = useLocale();
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const finished = index >= items.length;
  const item = items[index];

  async function answer() {
    if (selected === null) return;
    setBusy(true);
    setError(null);
    try {
      const r = await postJSON<Result>(`/api/reviews/${item.id}`, { answer: selected });
      setResult(r);
      if (r.correct) setCorrectCount((c) => c + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("review.saveError"));
    } finally {
      setBusy(false);
    }
  }

  function next() {
    setResult(null);
    setSelected(null);
    setIndex((i) => i + 1);
    if (index + 1 >= items.length) router.refresh();
  }

  if (items.length === 0 || finished) {
    const empty = items.length === 0;
    return (
      <FocusShell footer={<ButtonLink href="/home">{t("common.backToToday")}</ButtonLink>}>
        <div className="flex min-h-[60dvh] flex-col items-center justify-center text-center">
          {empty ? (
            <span className="grid h-20 w-20 place-items-center rounded-full bg-success-soft text-success animate-pop">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-success text-surface">
                <Check size={28} strokeWidth={2.8} />
              </span>
            </span>
          ) : (
            <Ring
              value={(correctCount / items.length) * 100}
              size={168}
              stroke={9}
              tone="success"
              label={t("review.doneRingLabel", { correct: correctCount, total: items.length })}
            >
              <span className="font-display text-[44px] leading-none tabular-nums" aria-hidden>
                {correctCount}
                <span className="text-[22px] text-muted">/{items.length}</span>
              </span>
            </Ring>
          )}
          <h1 className="mt-7 font-display text-[34px] leading-tight">{empty ? t("review.emptyTitle") : t("review.doneTitle")}</h1>
          <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-ink-2">
            {empty ? t("review.emptyBody") : t("review.doneBody", { correct: correctCount, total: items.length })}
          </p>
        </div>
      </FocusShell>
    );
  }

  return (
    <FocusShell
      top={
        <div>
          <div className="flex items-center gap-2 text-[13px] font-medium text-muted">
            <Brain size={15} aria-hidden /> {t("review.progress", { current: index + 1, total: items.length })}
          </div>
          <div className="mt-2 flex gap-1" aria-hidden>
            {items.map((it, i) => (
              <span key={it.id} className={cn("h-1.5 flex-1 rounded-full transition-colors duration-300", i < index ? "bg-accent" : i === index ? "bg-hero" : "bg-surface-2")} />
            ))}
          </div>
        </div>
      }
      footer={
        result ? (
          <Button onClick={next}>{index + 1 < items.length ? t("review.next") : t("review.finish")}</Button>
        ) : (
          <Button onClick={answer} disabled={selected === null || busy}>
            {busy ? t("review.checking") : t("review.answer")}
          </Button>
        )
      }
    >
      <div key={item.id} className="pt-4 animate-rise">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-accent">{t("review.eyebrow")}</p>
        <p className="mt-1 text-[13px] text-muted">{t("review.fromLesson", { title: item.lessonTitle })}</p>
        <h1 className="mt-4 font-display text-[30px] leading-[1.15]">{item.prompt}</h1>
        <div role="radiogroup" aria-label={item.prompt} className="mt-6 space-y-2.5">
          {item.options.map((o, i) => {
            const isCorrect = !!result && i === result.correctIndex;
            const isWrong = !!result && i === selected && !isCorrect;
            const isSelected = selected === i;
            return (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={!!result}
                onClick={() => setSelected(i)}
                className={cn(
                  "flex w-full items-center gap-3.5 rounded-[22px] border bg-surface px-4 py-4 text-left text-[15px] leading-relaxed transition active:scale-[0.99]",
                  isCorrect ? "border-success bg-success-soft" : isWrong ? "border-danger bg-danger-soft" : isSelected ? "border-hero shadow-card" : "border-line hover:border-ink/25",
                )}
              >
                <span
                  className={cn(
                    "grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition",
                    isCorrect
                      ? "border-success bg-success text-surface"
                      : isWrong
                        ? "border-danger bg-danger text-surface"
                        : isSelected
                          ? "border-hero bg-hero text-hero-ink"
                          : "border-line",
                  )}
                  aria-hidden
                >
                  {isWrong ? <X size={13} strokeWidth={3} /> : (isSelected || isCorrect) && <Check size={13} strokeWidth={3} />}
                </span>
                <span className="min-w-0 flex-1">{o}</span>
              </button>
            );
          })}
        </div>
        {error && (
          <div className="mt-4">
            <FormAlert>{error}</FormAlert>
          </div>
        )}
        {result && (
          <div className={cn("mt-5 rounded-[24px] p-5 text-[15px] leading-relaxed animate-rise", result.correct ? "bg-success-soft" : "bg-surface-2")} aria-live="polite">
            <p className={cn("font-semibold", result.correct ? "text-success" : "text-danger")}>
              {result.correct ? t("review.remembered") : t("review.missed")}
            </p>
            <p className="mt-1 text-ink-2">{result.explanation}</p>
            <p className="mt-2 text-[13px] text-muted">
              {result.nextDueOn ? t("review.nextReview", { date: formatDay(result.nextDueOn, undefined, locale) }) : t("review.mastered")}
            </p>
          </div>
        )}
      </div>
    </FocusShell>
  );
}
