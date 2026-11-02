"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/field";
import { useT } from "@/i18n/client";
import { cn } from "@/lib/cn";
import type { AssessmentQuestionView } from "@/server/services/onboarding";
import { submitCheckpointAction } from "./actions";

export function CheckpointForm({ day, questions }: { day: number; questions: AssessmentQuestionView[] }) {
  const t = useT();
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const complete = questions.every((q) => !q.isRequired || (values[q.key] ?? "").trim());

  return (
    <section className="mt-8 space-y-4">
      <h2 className="font-display text-[30px] leading-tight">{t("checkpoint.form.title")}</h2>
      {questions.map((q) =>
        q.type === "scale" ? (
          <div key={q.key} className="rounded-[24px] bg-surface p-4 shadow-card">
            <p className="text-[15px] font-medium leading-snug">{q.prompt}</p>
            <div role="radiogroup" aria-label={q.prompt} className="mt-3 flex flex-wrap gap-2">
              {q.options.map((o) => {
                const on = values[q.key] === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setValues({ ...values, [q.key]: o.value })}
                    className={cn(
                      "rounded-full px-3.5 py-2 text-[13px] leading-tight transition active:scale-[0.98]",
                      on ? "bg-hero text-hero-ink shadow-card" : "bg-surface-2 text-ink hover:bg-accent-soft",
                    )}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div key={q.key} className="rounded-[24px] bg-surface p-4 shadow-card">
            <label htmlFor={q.key} className="text-[15px] font-medium leading-snug">
              {q.prompt}
            </label>
            <textarea
              id={q.key}
              value={values[q.key] ?? ""}
              onChange={(e) => setValues({ ...values, [q.key]: e.target.value })}
              maxLength={2000}
              className="mt-2.5 min-h-28 w-full resize-none rounded-[18px] border border-line bg-bg/40 p-4 text-[16px] outline-none focus:border-accent/50"
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
        {pending ? t("common.saving") : t("checkpoint.form.submit")}
      </Button>
    </section>
  );
}
