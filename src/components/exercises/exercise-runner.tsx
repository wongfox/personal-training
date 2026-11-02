"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FormAlert } from "@/components/ui/field";
import { useT } from "@/i18n/client";
import { postJSON } from "@/lib/api-client";
import type { ExerciseFeedback } from "@/server/db/types";
import type { ClientExerciseConfig } from "@/server/engine/client-config";
import { FeedbackPanel, type Reveal } from "./feedback-panel";
import { PitchRunner } from "./pitch-runner";
import { RoleplayRunner } from "./roleplay-runner";
import { ChoiceRunner, DecisionRunner, OrderRunner, RecallRunner, RewriteRunner, StructureRunner } from "./runners";

export interface ExerciseOutcome {
  feedback: ExerciseFeedback;
  reveal?: Reveal;
  reward: { xp: number };
}

export function ExerciseRunner({
  exerciseId,
  config,
  onComplete,
  onRetry,
}: {
  exerciseId: string;
  config: ClientExerciseConfig;
  onComplete?: (outcome: ExerciseOutcome) => void;
  onRetry?: () => void;
}) {
  const t = useT();
  const [result, setResult] = useState<ExerciseOutcome | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [attemptKey, setAttemptKey] = useState(0);
  const startedAt = useRef<number | null>(null);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function submit(response: unknown) {
    setSubmitting(true);
    setError(null);
    try {
      const outcome = await postJSON<ExerciseOutcome>(`/api/exercises/${exerciseId}/attempts`, {
        response,
        durationSeconds: startedAt.current ? Math.round((Date.now() - startedAt.current) / 1000) : null,
      });
      setResult(outcome);
      onComplete?.(outcome);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("common.somethingWrong"));
    } finally {
      setSubmitting(false);
    }
  }

  function retry() {
    setResult(null);
    setAttemptKey((k) => k + 1);
    startedAt.current = Date.now();
    onRetry?.();
  }

  const props = { submitting, locked: result !== null, onSubmit: submit };
  let runner: React.ReactNode;
  switch (config.type) {
    case "choice":
      runner = <ChoiceRunner config={config} {...props} />;
      break;
    case "rewrite":
      runner = <RewriteRunner config={config} {...props} />;
      break;
    case "order":
      runner = <OrderRunner config={config} {...props} />;
      break;
    case "recall":
      runner = <RecallRunner config={config} {...props} />;
      break;
    case "structure":
      runner = <StructureRunner config={config} {...props} />;
      break;
    case "decision":
      runner = <DecisionRunner config={config} {...props} />;
      break;
    case "roleplay":
      runner = <RoleplayRunner exerciseId={exerciseId} config={config} {...props} />;
      break;
    case "pitch":
      runner = <PitchRunner config={config} {...props} />;
      break;
  }

  return (
    <div className="space-y-6">
      <div key={attemptKey}>{runner}</div>
      {error && <FormAlert>{error}</FormAlert>}
      {result && (
        <>
          <FeedbackPanel feedback={result.feedback} reveal={result.reveal} xp={result.reward.xp} />
          <button
            type="button"
            onClick={retry}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-surface-2 px-4 text-[14px] font-medium text-ink-2 transition hover:text-ink active:scale-[0.98]"
          >
            <RotateCcw size={15} aria-hidden /> {t("common.tryAgain")}
          </button>
        </>
      )}
    </div>
  );
}
