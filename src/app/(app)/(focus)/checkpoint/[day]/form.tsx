"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import type { AssessmentQuestionView } from "@/server/services/onboarding";
import { submitCheckpointAction } from "./actions";

export function CheckpointForm({ day, questions }: { day: number; questions: AssessmentQuestionView[] }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const complete = questions.every((q) => !q.isRequired || (values[q.key] ?? "").trim());

  return (
    <section className="mt-8 space-y-6">
      <h2 className="font-display text-[28px] leading-tight">How true is this today?</h2>
      {questions.map((q) =>
        q.type === "scale" ? (
          <div key={q.key}>
            <p className="text-[15px] font-medium">{q.prompt}</p>
            <div role="radiogroup" aria-label={q.prompt} className="mt-2 grid grid-cols-5 gap-1.5">
              {q.options.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  role="radio"
                  aria-checked={values[q.key] === o.value}
                  onClick={() => setValues({ ...values, [q.key]: o.value })}
                  className={cn(
                    "rounded-xl border px-1 py-2.5 text-[12px] leading-tight transition",
                    values[q.key] === o.value ? "border-ink bg-ink text-bg" : "border-line bg-surface",
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div key={q.key}>
            <label htmlFor={q.key} className="text-[15px] font-medium">
              {q.prompt}
            </label>
            <textarea
              id={q.key}
              value={values[q.key] ?? ""}
              onChange={(e) => setValues({ ...values, [q.key]: e.target.value })}
              maxLength={2000}
              className="mt-2 min-h-28 w-full resize-none rounded-2xl border border-line bg-surface p-4 text-[16px] outline-none focus:border-ink/40"
            />
          </div>
        ),
      )}
      {error && <FormAlert>{error}</FormAlert>}
      <Button
        disabled={!complete || pending}
        onClick={() =>
          start(async () => {
            const res = await submitCheckpointAction(day, values);
            if (res?.error) setError(res.error);
          })
        }
      >
        {pending ? "Saving…" : "See before → now"}
      </Button>
    </section>
  );
}
