"use client";

import { Check, Frown, Laugh, Meh, Quote, Smile, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FocusShell } from "@/components/focus-shell";
import { LeafSprig } from "@/components/scene";
import { Button, ButtonLink } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/field";
import { useT } from "@/i18n/client";
import { postJSON } from "@/lib/api-client";
import { cn } from "@/lib/cn";
import type { ReflectionFeedback } from "@/server/engine/coach-insight";
import type { getMission } from "@/server/services/learning";

type Mission = Awaited<ReturnType<typeof getMission>>;
type Outcome = "difficult" | "normal" | "good" | "excellent";

const OUTCOMES = [
  { value: "difficult", icon: Frown },
  { value: "normal", icon: Meh },
  { value: "good", icon: Smile },
  { value: "excellent", icon: Laugh },
] as const satisfies readonly { value: Outcome; icon: unknown }[];

const QUESTIONS = ["whatHappened", "whatWorked", "whatToImprove", "whatLearned"] as const;

export function MissionCheckIn({ mission }: { mission: Mission }) {
  const t = useT();
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
      setError(e instanceof Error ? e.message : t("mission.saveError"));
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
      setError(e instanceof Error ? e.message : t("mission.saveError"));
    } finally {
      setBusy(false);
    }
  }

  const filled = Object.values(answers).some((v) => v.trim());

  const footer =
    stage === "reflect" ? (
      <div className="space-y-2">
        {!filled && <p className="text-center text-[13px] text-muted">{t("mission.reflect.needOne")}</p>}
        <Button onClick={saveReflection} disabled={!filled || busy}>
          {busy ? t("common.saving") : t("mission.reflect.save")}
        </Button>
        <ButtonLink href="/home" variant="ghost">
          {t("common.skipForNow")}
        </ButtonLink>
      </div>
    ) : stage === "complete" || stage === "later" ? (
      <ButtonLink href="/home">{t("common.backToToday")}</ButtonLink>
    ) : undefined;

  return (
    <FocusShell top={<p className="text-[13px] font-medium text-muted">{t("mission.topLabel")}</p>} footer={footer}>
      <div className="pt-4">
        {/* The mission itself */}
        <div className="flex gap-4 rounded-[28px] bg-surface p-5 shadow-card">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[16px] bg-accent-soft text-accent" aria-hidden>
            <Target size={22} strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">{t("mission.yourMission")}</p>
            <h1 className="mt-1 font-display text-[24px] leading-[1.15]">{mission.title}</h1>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{mission.description}</p>
            <p className="mt-3 text-[12px] text-muted">{t("mission.fromLesson", { title: mission.lessonTitle })}</p>
          </div>
        </div>

        {error && (
          <div className="mt-4">
            <FormAlert>{error}</FormAlert>
          </div>
        )}

        {stage === "ask" && (
          <section className="mt-10 animate-rise">
            <h2 className="font-display text-[36px] leading-tight">{t("mission.ask.title")}</h2>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button onClick={() => setStage("outcome")} disabled={busy}>
                {t("mission.ask.yes")}
              </Button>
              <Button variant="secondary" onClick={() => checkIn("not_yet")} disabled={busy}>
                {t("mission.ask.notYet")}
              </Button>
            </div>
          </section>
        )}

        {stage === "outcome" && (
          <section className="relative mt-8 overflow-hidden rounded-[28px] bg-hero p-6 text-hero-ink shadow-card animate-rise">
            <LeafSprig className="absolute -top-2 -right-2 h-24 w-24 text-hero-ink/25" />
            <h2 className="font-display text-[30px] leading-tight">{t("mission.outcome.title")}</h2>
            <p className="mt-1.5 text-[13px] text-hero-ink/75">{t("mission.outcome.hint")}</p>
            <div role="radiogroup" aria-label={t("mission.outcome.title")} className="mt-5 grid grid-cols-4 gap-2">
              {OUTCOMES.map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={outcome === value}
                  aria-label={t(`mission.outcomes.${value}`)}
                  disabled={busy}
                  onClick={() => {
                    setOutcome(value);
                    void checkIn("done", value);
                  }}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-[20px] py-3.5 transition active:scale-95",
                    outcome === value ? "bg-hero-ink text-hero" : "bg-hero-ink/10 hover:bg-hero-ink/20",
                  )}
                >
                  <Icon size={30} strokeWidth={1.6} aria-hidden />
                  <span className="text-[12px] font-medium">{t(`mission.outcomes.${value}`)}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {stage === "reflect" && (
          <section className="mt-8 animate-rise">
            {outcome && (
              <p className="rounded-[24px] bg-accent-soft p-5 text-[15px] leading-relaxed text-ink">
                {t(`mission.responses.${outcome}`)}
                {xp ? <span className="ml-1 font-semibold text-accent">{t("common.plusXp", { count: xp })}</span> : null}
              </p>
            )}
            <h2 className="mt-8 font-display text-[30px] leading-tight">{t("mission.reflect.title")}</h2>
            <p className="mt-1 text-[14px] text-ink-2">{t("mission.reflect.body")}</p>
            <div className="mt-5 space-y-3">
              {QUESTIONS.map((key) => (
                <div key={key} className="rounded-[24px] bg-surface p-4 shadow-card">
                  <label htmlFor={key} className="flex items-center gap-2.5 text-[15px] font-semibold">
                    <span
                      className={cn(
                        "grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition",
                        answers[key]?.trim() ? "border-accent bg-accent text-accent-ink" : "border-line",
                      )}
                      aria-hidden
                    >
                      {answers[key]?.trim() && <Check size={11} strokeWidth={3} />}
                    </span>
                    {t(`mission.questions.${key}.label`)}
                  </label>
                  <textarea
                    id={key}
                    value={answers[key] ?? ""}
                    onChange={(e) => setAnswers({ ...answers, [key]: e.target.value })}
                    placeholder={t(`mission.questions.${key}.placeholder`)}
                    maxLength={2000}
                    className="mt-2.5 min-h-20 w-full resize-none rounded-[18px] border border-line bg-bg/40 p-3.5 text-[16px] leading-relaxed outline-none placeholder:text-muted focus:border-accent/50"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {stage === "later" && (
          <section className="mt-10 animate-rise">
            <h2 className="font-display text-[32px] leading-tight">{t("mission.later.title")}</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{t("mission.later.body")}</p>
          </section>
        )}

        {stage === "complete" && (
          <section className="mt-10 text-center animate-rise">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-success-soft text-success animate-pop">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-success text-surface">
                <Check size={28} strokeWidth={2.8} />
              </span>
            </div>
            <h2 className="mt-5 font-display text-[32px]">{t("mission.complete.title")}</h2>
            <p className="mx-auto mt-2 max-w-xs text-[15px] leading-relaxed text-ink-2">
              {xp ? <span className="font-semibold text-accent">{t("common.plusXp", { count: xp })} · </span> : null}
              {t("mission.complete.body")}
            </p>
            {feedback && (
              <figure className="mt-8 rounded-[28px] bg-accent-soft p-6 text-left text-ink">
                <div className="flex items-center gap-2">
                  <Quote size={20} className="shrink-0 fill-accent/25 text-accent" aria-hidden />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">{t("mission.complete.coachNote")}</span>
                </div>
                <p className="mt-3 font-display text-[22px] leading-snug">{feedback.headline}</p>
                <p className="mt-2 text-[15px] leading-relaxed">{feedback.observation}</p>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{feedback.nextStep}</p>
              </figure>
            )}
          </section>
        )}
      </div>
    </FocusShell>
  );
}
