"use client";

import { Check, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FocusShell } from "@/components/focus-shell";
import { Button, ButtonLink } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/field";
import { postJSON } from "@/lib/api-client";
import { cn } from "@/lib/cn";
import type { ReflectionFeedback } from "@/server/engine/coach-insight";
import type { getMission } from "@/server/services/learning";

type Mission = Awaited<ReturnType<typeof getMission>>;
type Outcome = "difficult" | "normal" | "good" | "excellent";

const OUTCOMES: { value: Outcome; emoji: string; label: string }[] = [
  { value: "difficult", emoji: "😞", label: "Difficult" },
  { value: "normal", emoji: "😐", label: "Normal" },
  { value: "good", emoji: "🙂", label: "Good" },
  { value: "excellent", emoji: "🔥", label: "Excellent" },
];

const QUESTIONS = [
  { key: "whatHappened", label: "What happened?", placeholder: "Where, with whom, what you said…" },
  { key: "whatWorked", label: "What worked?", placeholder: "Something you'd do again." },
  { key: "whatToImprove", label: "What could you improve?", placeholder: "One thing to change next time." },
  { key: "whatLearned", label: "What did you learn?", placeholder: "About the skill, or about yourself." },
] as const;

const RESPONSES: Record<Outcome, string> = {
  difficult: "Doing it when it's hard is exactly how the skill grows. The discomfort is the rep.",
  normal: "A normal rep is still a rep. Consistency is what turns this into instinct.",
  good: "That's the idea working in real life. Notice what made it land — and do it again.",
  excellent: "Excellent. Hold on to what you did differently; that's your new baseline.",
};

export function MissionCheckIn({ mission }: { mission: Mission }) {
  const router = useRouter();
  const initial = mission.status === "done" ? (mission.reflection ? "complete" : "reflect") : "ask";
  const [stage, setStage] = useState<"ask" | "outcome" | "reflect" | "complete" | "later">(initial);
  const [outcome, setOutcome] = useState<Outcome | null>(mission.outcome);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [xp, setXp] = useState(0);
  const [feedback, setFeedback] = useState<ReflectionFeedback | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkIn(status: "done" | "not_yet", value?: Outcome) {
    setBusy(true);
    setError(null);
    try {
      const res = await postJSON<{ reward: { xp: number } | null }>(`/api/missions/${mission.id}/checkin`, { status, outcome: value });
      setXp((x) => x + (res.reward?.xp ?? 0));
      setStage(status === "done" ? "reflect" : "later");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save.");
    } finally {
      setBusy(false);
    }
  }

  async function saveReflection() {
    setBusy(true);
    setError(null);
    try {
      const res = await postJSON<{ reward: { xp: number }; feedback: ReflectionFeedback }>(`/api/missions/${mission.id}/reflection`, answers);
      setXp((x) => x + (res.reward?.xp ?? 0));
      setFeedback(res.feedback);
      setStage("complete");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save.");
    } finally {
      setBusy(false);
    }
  }

  const filled = Object.values(answers).some((v) => v.trim());

  const footer =
    stage === "reflect" ? (
      <div className="space-y-2">
        <Button onClick={saveReflection} disabled={!filled || busy}>
          {busy ? "Saving…" : "Save reflection"}
        </Button>
        <ButtonLink href="/home" variant="ghost">
          Skip for now
        </ButtonLink>
      </div>
    ) : stage === "complete" || stage === "later" ? (
      <ButtonLink href="/home">Back to today</ButtonLink>
    ) : undefined;

  return (
    <FocusShell top={<p className="text-[13px] text-muted">Mission check-in</p>} footer={footer}>
      <div className="pt-4">
        <div className="rounded-3xl bg-surface p-5 shadow-card">
          <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-accent">
            <Target size={14} /> Your mission
          </div>
          <h1 className="mt-2 font-display text-[26px] leading-tight">{mission.title}</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{mission.description}</p>
          <p className="mt-3 text-[12px] text-muted">From “{mission.lessonTitle}”</p>
        </div>

        {error && <div className="mt-4"><FormAlert>{error}</FormAlert></div>}

        {stage === "ask" && (
          <section className="mt-10 animate-rise">
            <h2 className="font-display text-[34px] leading-tight">Did you do it?</h2>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button onClick={() => setStage("outcome")} disabled={busy}>
                Yes
              </Button>
              <Button variant="secondary" onClick={() => checkIn("not_yet")} disabled={busy}>
                Not yet
              </Button>
            </div>
          </section>
        )}

        {stage === "outcome" && (
          <section className="mt-10 animate-rise">
            <h2 className="font-display text-[34px] leading-tight">How did it go?</h2>
            <div role="radiogroup" aria-label="How did it go?" className="mt-6 grid grid-cols-4 gap-2">
              {OUTCOMES.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  role="radio"
                  aria-checked={outcome === o.value}
                  disabled={busy}
                  onClick={() => {
                    setOutcome(o.value);
                    void checkIn("done", o.value);
                  }}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-2xl border bg-surface py-4 transition active:scale-95",
                    outcome === o.value ? "border-ink shadow-card" : "border-line",
                  )}
                >
                  <span className="text-[30px] leading-none" aria-hidden>
                    {o.emoji}
                  </span>
                  <span className="text-[12px] font-medium">{o.label}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {stage === "reflect" && (
          <section className="mt-8 animate-rise">
            {outcome && <p className="rounded-2xl bg-accent-soft p-4 text-[15px] leading-relaxed text-ink">{RESPONSES[outcome]}{xp ? ` +${xp} XP.` : ""}</p>}
            <h2 className="mt-8 font-display text-[28px] leading-tight">Reflect for a minute</h2>
            <p className="mt-1 text-[14px] text-ink-2">Your coach reads these to tailor what comes next.</p>
            <div className="mt-5 space-y-4">
              {QUESTIONS.map((q) => (
                <div key={q.key}>
                  <label htmlFor={q.key} className="text-[14px] font-semibold">
                    {q.label}
                  </label>
                  <textarea
                    id={q.key}
                    value={answers[q.key] ?? ""}
                    onChange={(e) => setAnswers({ ...answers, [q.key]: e.target.value })}
                    placeholder={q.placeholder}
                    maxLength={2000}
                    className="mt-1.5 min-h-20 w-full resize-none rounded-2xl border border-line bg-surface p-3.5 text-[16px] leading-relaxed outline-none focus:border-ink/40"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {stage === "later" && (
          <section className="mt-10 animate-rise">
            <h2 className="font-display text-[30px] leading-tight">No problem.</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-2">
              It stays open on your Home screen. Pick a specific moment for it — which meeting, which person — and it&apos;s far more likely to happen.
            </p>
          </section>
        )}

        {stage === "complete" && (
          <section className="mt-10 text-center animate-rise">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success-soft text-success animate-pop">
              <Check size={30} strokeWidth={2.6} />
            </div>
            <h2 className="mt-5 font-display text-[30px]">Mission logged.</h2>
            <p className="mx-auto mt-2 max-w-xs text-[15px] text-ink-2">
              {xp ? `+${xp} XP. ` : ""}Learn → practise → apply → reflect. That&apos;s the whole loop — and you just closed it.
            </p>
            {feedback && (
              <div className="mt-8 rounded-3xl border-l-[3px] border-accent bg-surface p-5 text-left shadow-card">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-accent">Coach&apos;s note</p>
                <p className="mt-2 font-display text-[22px] leading-snug">{feedback.headline}</p>
                <p className="mt-2 text-[15px] leading-relaxed">{feedback.observation}</p>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{feedback.nextStep}</p>
              </div>
            )}
          </section>
        )}
      </div>
    </FocusShell>
  );
}
