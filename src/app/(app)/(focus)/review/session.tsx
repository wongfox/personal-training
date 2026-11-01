"use client";

import { Brain, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FocusShell } from "@/components/focus-shell";
import { Button, ButtonLink } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/field";
import { postJSON } from "@/lib/api-client";
import { cn } from "@/lib/cn";
import { formatDay } from "@/lib/dates";

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
      setError(e instanceof Error ? e.message : "Couldn't save.");
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
    return (
      <FocusShell footer={<ButtonLink href="/home">Back to today</ButtonLink>}>
        <div className="flex min-h-[60dvh] flex-col items-center justify-center text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-success-soft text-success">
            <Check size={28} strokeWidth={2.6} />
          </span>
          <h1 className="mt-6 font-display text-[32px]">{items.length === 0 ? "Nothing due." : "Refreshed."}</h1>
          <p className="mt-2 max-w-xs text-[15px] text-ink-2">
            {items.length === 0
              ? "Concepts come back 1, 3, 7, 14 and 30 days after you learn them. Check back tomorrow."
              : `${correctCount} of ${items.length} recalled. Missed ones come back tomorrow; the rest move further out.`}
          </p>
        </div>
      </FocusShell>
    );
  }

  return (
    <FocusShell
      top={
        <div className="flex items-center gap-2 text-[13px] text-muted">
          <Brain size={15} /> Review {index + 1} of {items.length}
        </div>
      }
      footer={
        result ? (
          <Button onClick={next}>{index + 1 < items.length ? "Next" : "Finish"}</Button>
        ) : (
          <Button onClick={answer} disabled={selected === null || busy}>
            {busy ? "Checking…" : "Answer"}
          </Button>
        )
      }
    >
      <div key={item.id} className="pt-4 animate-rise">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-accent">Do you remember?</p>
        <p className="mt-1 text-[13px] text-muted">From “{item.lessonTitle}”</p>
        <h1 className="mt-4 font-display text-[28px] leading-tight">{item.prompt}</h1>
        <div role="radiogroup" className="mt-6 space-y-2.5">
          {item.options.map((o, i) => (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={selected === i}
              disabled={!!result}
              onClick={() => setSelected(i)}
              className={cn(
                "w-full rounded-2xl border bg-surface px-4 py-3.5 text-left text-[15px] leading-relaxed transition",
                result && i === result.correctIndex
                  ? "border-success bg-success-soft"
                  : result && i === selected
                    ? "border-danger bg-danger-soft"
                    : selected === i
                      ? "border-ink shadow-card"
                      : "border-line",
              )}
            >
              {o}
            </button>
          ))}
        </div>
        {error && <div className="mt-4"><FormAlert>{error}</FormAlert></div>}
        {result && (
          <div className="mt-5 rounded-2xl bg-surface-2 p-4 text-[15px] leading-relaxed animate-rise" aria-live="polite">
            <p className={cn("font-semibold", result.correct ? "text-success" : "text-danger")}>
              {result.correct ? "You remembered." : "Not this time."}
            </p>
            <p className="mt-1 text-ink-2">{result.explanation}</p>
            <p className="mt-2 text-[13px] text-muted">
              {result.nextDueOn ? `Next review: ${formatDay(result.nextDueOn)}` : "Mastered — this one won't come back."}
            </p>
          </div>
        )}
      </div>
    </FocusShell>
  );
}
