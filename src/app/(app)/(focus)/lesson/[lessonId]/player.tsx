"use client";

import { ArrowRight, Check, Clock, Flame, Quote, Sparkles, Target, Trophy, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ExerciseRunner } from "@/components/exercises/exercise-runner";
import { Rich } from "@/components/exercises/rich-text";
import { FocusShell } from "@/components/focus-shell";
import { LeafSprig } from "@/components/scene";
import { Button, ButtonLink } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/field";
import { Pill } from "@/components/ui/primitives";
import { useLocale, useT } from "@/i18n/client";
import { INTL_LOCALE } from "@/i18n/config";
import { postJSON } from "@/lib/api-client";
import { cn } from "@/lib/cn";
import type { OpenLessonView } from "@/server/services/learning";

const STEPS = ["hook", "why", "concept", "insight", "example", "exercise", "challenge", "reflection", "check", "complete"] as const;

const EXERCISE = 5;
const CHALLENGE = 6;
const REFLECTION = 7;
const CHECK = 8;
const COMPLETE = 9;

interface CompletionResult {
  queued?: boolean;
  alreadyCompleted: boolean;
  reward: {
    xp: number;
    totalXp: number;
    streak: { current: number; event: string | null };
    levelUp: { level: number; name: string } | null;
    skill: { key?: string; name: string; score: number; delta: number } | null;
    achievements: { key: string; title: string }[];
  };
  missionAttemptId: string | null;
  nextLesson: { title: string } | null;
  journeyCompleted: boolean;
}

export function LessonPlayer({ lesson }: { lesson: OpenLessonView }) {
  const t = useT();
  const router = useRouter();
  const startStep = lesson.completed ? 0 : Math.min(lesson.currentStep, CHECK);
  const [step, setStep] = useState(startStep);
  const [exerciseDone, setExerciseDone] = useState(!lesson.exercise || lesson.completed || startStep > EXERCISE);
  const [quizDone, setQuizDone] = useState(!lesson.quiz || lesson.completed || startStep > CHECK);
  const [reflection, setReflection] = useState("");
  const [earned, setEarned] = useState(0);
  const [completion, setCompletion] = useState<CompletionResult | null>(null);
  const [completeError, setCompleteError] = useState<string | null>(null);
  const lastStepAt = useRef<number | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const c = lesson.content;
  const stepLabel = (i: number) => t(`lesson.steps.${STEPS[i]}`);
  const reflectionWords = reflection.trim() ? reflection.trim().split(/\s+/).length : 0;

  // Persist progress whenever the learner moves forward (queued if offline).
  useEffect(() => {
    if (lesson.completed && step < COMPLETE) return;
    const now = Date.now();
    const seconds = lastStepAt.current ? Math.round((now - lastStepAt.current) / 1000) : 0;
    lastStepAt.current = now;
    void postJSON(`/api/lessons/${lesson.id}/progress`, { step, seconds }, { queueOffline: true }).catch(() => {});
    topRef.current?.scrollIntoView({ block: "start" });
  }, [step, lesson.id, lesson.completed]);

  async function complete() {
    setCompleteError(null);
    try {
      const result = await postJSON<CompletionResult>(
        `/api/lessons/${lesson.id}/complete`,
        { reflection: reflection.trim() || undefined },
        { queueOffline: true },
      );
      setCompletion(result);
      setStep(COMPLETE);
      router.refresh();
    } catch (e) {
      setCompleteError(e instanceof Error ? e.message : t("lesson.saveError"));
    }
  }

  const canContinue = step === EXERCISE ? exerciseDone : step === CHECK ? quizDone : true;
  const next = () => {
    if (step === CHECK) void complete();
    else setStep((s) => Math.min(COMPLETE, s + 1));
  };

  const footer =
    step === COMPLETE ? (
      <ButtonLink href="/home">{t("common.backToToday")}</ButtonLink>
    ) : (
      <div className="space-y-2">
        {completeError && <FormAlert>{completeError}</FormAlert>}
        <Button onClick={next} disabled={!canContinue}>
          {step === CHECK
            ? t("lesson.actions.finish")
            : step === CHALLENGE
              ? t("lesson.actions.commit")
              : step === REFLECTION && reflectionWords < 4
                ? t("common.skipForNow")
                : t("common.continue")}
          <ArrowRight size={18} />
        </Button>
        {step > 0 && (
          <button type="button" onClick={() => setStep((s) => s - 1)} className="w-full rounded-full py-2 text-[14px] text-muted hover:text-ink">
            {t("common.back")}
          </button>
        )}
      </div>
    );

  return (
    <FocusShell
      top={
        <div>
          <div className="flex gap-1" aria-hidden>
            {STEPS.map((s, i) => (
              <span
                key={s}
                className={cn("h-1.5 flex-1 rounded-full transition-colors duration-300", i < step ? "bg-accent" : i === step ? "bg-hero" : "bg-surface-2")}
              />
            ))}
          </div>
          <p className="mt-2 text-[12px] font-medium text-muted" aria-live="polite">
            {t("lesson.progress", { step: stepLabel(step), current: step + 1, total: STEPS.length })}
          </p>
        </div>
      }
      footer={footer}
    >
      <div ref={topRef} className="scroll-mt-24" />
      <div key={step} className="animate-rise pt-4">
        {step === 0 && (
          <section>
            <div className="flex flex-wrap gap-2">
              <Pill>{t(`taxonomy.categories.${lesson.category}`)}</Pill>
              <Pill>
                <Clock size={12} aria-hidden /> {t("common.minutes", { count: lesson.estimatedMinutes })}
              </Pill>
              {lesson.completed && (
                <Pill className="bg-success-soft text-success">
                  <Check size={12} strokeWidth={2.6} aria-hidden /> {t("lesson.completed")}
                </Pill>
              )}
            </div>
            <StepEyebrow className="mt-6">{stepLabel(0)}</StepEyebrow>
            <h1 className="mt-2 font-display text-[40px] leading-[1.04] tracking-[-0.01em]">{lesson.title}</h1>
            <div className="mt-6 rounded-[28px] bg-accent-soft p-6">
              <p className="font-display text-[22px] leading-[1.35] text-ink">{c.hook}</p>
            </div>
          </section>
        )}

        {step === 1 && (
          <section>
            <StepEyebrow>{stepLabel(1)}</StepEyebrow>
            <p className="mt-4 font-display text-[30px] leading-[1.2] tracking-[-0.01em]">{c.whyItMatters}</p>
          </section>
        )}

        {step === 2 && (
          <section>
            <StepEyebrow>{stepLabel(2)}</StepEyebrow>
            <h2 className="mt-3 font-display text-[32px] leading-[1.1] tracking-[-0.01em]">{c.coreConcept.title}</h2>
            <div className="prose-lesson mt-5 space-y-4 text-[17px] leading-[1.65] text-ink-2">
              {c.coreConcept.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <ul className="mt-6 space-y-3 rounded-[28px] bg-surface p-5 shadow-card">
              {c.coreConcept.keyPoints.map((k) => (
                <li key={k} className="flex gap-3 text-[15px] leading-relaxed">
                  <CheckDot />
                  <span>{k}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {step === 3 && (
          <section>
            <StepEyebrow>{stepLabel(3)}</StepEyebrow>
            <figure className="relative mt-5 overflow-hidden rounded-[28px] bg-hero p-6 text-hero-ink shadow-card">
              <LeafSprig className="absolute -top-2 -right-2 h-24 w-24 text-hero-ink/25" />
              <Quote size={26} className="fill-hero-ink/15 text-hero-ink/70" aria-hidden />
              <blockquote className="relative mt-3 font-display text-[25px] leading-[1.3]">{c.expertInsight.text}</blockquote>
              <figcaption className="mt-5 text-[14px] text-hero-ink/75">
                — {c.expertInsight.source}
                {c.expertInsight.sourceDetail && <span className="block text-[13px] text-hero-ink/55">{c.expertInsight.sourceDetail}</span>}
              </figcaption>
            </figure>
          </section>
        )}

        {step === 4 && (
          <section>
            <StepEyebrow>{stepLabel(4)}</StepEyebrow>
            <p className="mt-4 text-[16px] leading-relaxed">{c.example.situation}</p>
            <div className="mt-5 space-y-3">
              <div className="rounded-[24px] bg-surface-2 p-5">
                <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-surface text-muted" aria-hidden>
                    <X size={12} strokeWidth={2.6} />
                  </span>
                  {t("lesson.example.before")}
                </p>
                <p className="mt-2 text-[16px] leading-relaxed text-ink-2">{c.example.before}</p>
              </div>
              <div className="rounded-[24px] bg-surface p-5 shadow-card ring-1 ring-success/30">
                <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-success">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-success text-surface" aria-hidden>
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {t("lesson.example.after")}
                </p>
                <p className="mt-2 text-[16px] font-medium leading-relaxed">{c.example.after}</p>
              </div>
            </div>
            <div className="mt-4 rounded-[24px] bg-accent-soft p-5 text-[15px] leading-relaxed text-ink-2">
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-accent">{t("lesson.example.whyItWorks")}</p>
              <p className="mt-1.5">{c.example.whyItWorks}</p>
            </div>
          </section>
        )}

        {step === EXERCISE && lesson.exercise && (
          <section>
            <StepEyebrow>{stepLabel(EXERCISE)}</StepEyebrow>
            <h2 className="mt-3 font-display text-[28px] leading-[1.12]">{lesson.exercise.title}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{lesson.exercise.description}</p>
            <div className="mt-6">
              <ExerciseRunner
                exerciseId={lesson.exercise.id}
                config={lesson.exercise.config}
                onComplete={(o) => {
                  setExerciseDone(true);
                  setEarned((x) => x + o.reward.xp);
                }}
              />
            </div>
          </section>
        )}

        {step === CHALLENGE && (
          <section>
            <StepEyebrow>{stepLabel(CHALLENGE)}</StepEyebrow>
            {lesson.action ? (
              <>
                <div className="relative mt-5 overflow-hidden rounded-[28px] bg-hero p-6 text-hero-ink shadow-card">
                  <LeafSprig className="absolute -top-2 -right-2 h-24 w-24 text-hero-ink/25" />
                  <span className="grid h-12 w-12 place-items-center rounded-[16px] bg-hero-ink/12 text-hero-ink">
                    <Target size={22} strokeWidth={1.8} />
                  </span>
                  <h2 className="mt-4 max-w-[90%] font-display text-[28px] leading-[1.12]">{lesson.action.title}</h2>
                  <p className="mt-3 text-[16px] leading-relaxed text-hero-ink/80">{lesson.action.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-hero-ink/12 px-3 py-1 text-[12px] font-medium">
                      <Clock size={12} aria-hidden /> {t("common.minutes", { count: lesson.action.estimatedMinutes })}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-hero-ink/12 px-3 py-1 text-[12px] font-medium">
                      {t(`common.missionDifficulty.${lesson.action.difficulty}`)}
                    </span>
                  </div>
                </div>
                {lesson.action.successCriteria && (
                  <div className="mt-4 flex gap-3 rounded-[24px] bg-surface p-5 shadow-card">
                    <CheckDot />
                    <p className="text-[15px] leading-relaxed text-ink-2">
                      <span className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-accent">{t("lesson.mission.doneWhen")}</span>
                      <span className="mt-1 block">{lesson.action.successCriteria}</span>
                    </p>
                  </div>
                )}
                <p className="mt-6 text-center text-[14px] text-muted">{t("lesson.mission.later")}</p>
              </>
            ) : (
              <p className="mt-4 rounded-[24px] bg-accent-soft p-5 text-[16px] leading-relaxed text-ink">{t("lesson.mission.fallback")}</p>
            )}
          </section>
        )}

        {step === REFLECTION && (
          <section>
            <StepEyebrow>{stepLabel(REFLECTION)}</StepEyebrow>
            <h2 className="mt-3 font-display text-[30px] leading-[1.15]">{c.reflectionPrompt}</h2>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              maxLength={2000}
              placeholder={t("lesson.reflection.placeholder")}
              className="mt-6 min-h-40 w-full resize-none rounded-[24px] border border-line bg-surface p-5 text-[16px] leading-relaxed shadow-card outline-none placeholder:text-muted focus:border-accent/50"
              aria-label={c.reflectionPrompt}
            />
            <p className={cn("mt-2 px-1 text-[13px]", reflectionWords >= 4 ? "text-success" : "text-muted")}>
              {reflectionWords === 0 ? t("lesson.reflection.empty") : reflectionWords < 4 ? t("lesson.reflection.tooShort") : t("lesson.reflection.ready")}
            </p>
          </section>
        )}

        {step === CHECK && lesson.quiz && (
          <section>
            <StepEyebrow>{stepLabel(CHECK)}</StepEyebrow>
            <QuizRunner
              quizId={lesson.quiz.id}
              questions={lesson.quiz.questions}
              onDone={(xp) => {
                setQuizDone(true);
                setEarned((x) => x + xp);
              }}
            />
          </section>
        )}

        {step === COMPLETE && completion && <Completion result={completion} earnedBefore={earned} lessonTitle={lesson.title} />}
      </div>
    </FocusShell>
  );
}

function StepEyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-[12px] font-semibold uppercase tracking-[0.14em] text-accent", className)}>{children}</p>;
}

/** Small filled circle with a check — the bullet used across lesson cards. */
function CheckDot() {
  return (
    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent text-accent-ink" aria-hidden>
      <Check size={12} strokeWidth={3} />
    </span>
  );
}

function QuizRunner({
  quizId,
  questions,
  onDone,
}: {
  quizId: string;
  questions: { id: string; prompt: string; options: string[] }[];
  onDone: (xp: number) => void;
}) {
  const t = useT();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [checked, setChecked] = useState<{ correct: boolean; correctIndex: number; explanation: string } | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [final, setFinal] = useState<{ score: number; total: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const q = questions[index];

  async function check() {
    if (selected === null) return;
    setBusy(true);
    setError(null);
    try {
      setChecked(await postJSON(`/api/quizzes/${quizId}/check`, { questionId: q.id, answer: selected }));
    } catch (e) {
      setError(e instanceof Error ? e.message : t("lesson.quiz.checkError"));
    } finally {
      setBusy(false);
    }
  }

  async function advance() {
    const all = [...answers, selected!];
    setAnswers(all);
    setChecked(null);
    setSelected(null);
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      return;
    }
    setBusy(true);
    try {
      const res = await postJSON<{ score: number; total: number; reward: { xp: number } }>(`/api/quizzes/${quizId}/attempts`, { answers: all }, { queueOffline: true });
      // Queued offline: there's no score yet — never show a made-up one.
      setFinal(res.score !== undefined ? res : { score: -1, total: questions.length });
      onDone(res.reward?.xp ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("lesson.quiz.saveError"));
    } finally {
      setBusy(false);
    }
  }

  if (final && final.score < 0) {
    return (
      <div className="mt-6 rounded-[28px] bg-surface p-6 text-center shadow-card">
        <p className="font-display text-[28px] leading-tight">{t("lesson.quiz.offlineTitle")}</p>
        <p className="mt-3 text-[15px] text-ink-2">{t("lesson.quiz.offlineBody")}</p>
      </div>
    );
  }

  if (final) {
    return (
      <div className="mt-6 rounded-[28px] bg-surface p-7 text-center shadow-card">
        <p className="font-display text-[52px] leading-none tabular-nums">
          {final.score}/{final.total}
        </p>
        <p className="sr-only">{t("lesson.quiz.scoreLabel", { score: final.score, total: final.total })}</p>
        <p className="mx-auto mt-4 max-w-xs text-[15px] leading-relaxed text-ink-2">
          {final.score === final.total ? t("lesson.quiz.perfect") : t("lesson.quiz.partial")}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] text-muted">{t("lesson.quiz.question", { current: index + 1, total: questions.length })}</p>
        <span className="flex gap-1.5" aria-hidden>
          {questions.map((qq, i) => (
            <span key={qq.id} className={cn("h-2 w-2 rounded-full", i < index ? "bg-accent" : i === index ? "bg-hero" : "bg-surface-2")} />
          ))}
        </span>
      </div>
      <h2 className="mt-3 font-display text-[26px] leading-[1.18]">{q.prompt}</h2>
      <div role="radiogroup" aria-label={q.prompt} className="mt-5 space-y-2.5">
        {q.options.map((o, i) => {
          const isCorrect = !!checked && i === checked.correctIndex;
          const isWrong = !!checked && i === selected && !checked.correct;
          return (
            <OptionTile
              key={i}
              selected={selected === i}
              state={isCorrect ? "correct" : isWrong ? "wrong" : undefined}
              disabled={!!checked}
              onClick={() => setSelected(i)}
            >
              {o}
            </OptionTile>
          );
        })}
      </div>
      {checked && (
        <div
          className={cn("mt-4 animate-rise rounded-[24px] p-5 text-[15px] leading-relaxed", checked.correct ? "bg-success-soft" : "bg-surface-2")}
          aria-live="polite"
        >
          <p className={cn("font-semibold", checked.correct ? "text-success" : "text-danger")}>
            {checked.correct ? t("lesson.quiz.correct") : t("lesson.quiz.notQuite")}
          </p>
          <p className="mt-1 text-ink-2">{checked.explanation}</p>
        </div>
      )}
      {error && (
        <div className="mt-3">
          <FormAlert>{error}</FormAlert>
        </div>
      )}
      <div className="mt-5">
        {checked ? (
          <Button variant="secondary" onClick={advance} disabled={busy}>
            {index + 1 < questions.length ? t("lesson.quiz.next") : busy ? t("common.saving") : t("lesson.quiz.seeScore")}
          </Button>
        ) : (
          <Button variant="secondary" onClick={check} disabled={selected === null || busy}>
            {busy ? t("lesson.quiz.checking") : t("lesson.quiz.check")}
          </Button>
        )}
      </div>
    </div>
  );
}

/** Rounded answer tile with a circular check mark on the left. */
function OptionTile({
  selected,
  state,
  disabled,
  onClick,
  children,
}: {
  selected: boolean;
  state?: "correct" | "wrong";
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3.5 rounded-[22px] border bg-surface px-4 py-4 text-left text-[15px] leading-relaxed transition active:scale-[0.99]",
        state === "correct"
          ? "border-success bg-success-soft"
          : state === "wrong"
            ? "border-danger bg-danger-soft"
            : selected
              ? "border-hero shadow-card"
              : "border-line hover:border-ink/25",
      )}
    >
      <span
        className={cn(
          "grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition",
          state === "correct"
            ? "border-success bg-success text-surface"
            : state === "wrong"
              ? "border-danger bg-danger text-surface"
              : selected
                ? "border-hero bg-hero text-hero-ink"
                : "border-line",
        )}
        aria-hidden
      >
        {state === "wrong" ? <X size={13} strokeWidth={3} /> : (selected || state === "correct") && <Check size={13} strokeWidth={3} />}
      </span>
      <span className="min-w-0 flex-1">{children}</span>
    </button>
  );
}

function Completion({ result, earnedBefore, lessonTitle }: { result: CompletionResult; earnedBefore: number; lessonTitle: string }) {
  const t = useT();
  const locale = useLocale();
  const nf = new Intl.NumberFormat(INTL_LOCALE[locale]);
  if (result.queued) {
    return (
      <section className="pt-10 text-center">
        <h1 className="font-display text-[34px]">{t("lesson.complete.offlineTitle")}</h1>
        <p className="mx-auto mt-3 max-w-xs text-ink-2">{t("lesson.complete.offlineBody")}</p>
      </section>
    );
  }
  const r = result.reward;
  const total = r.xp + earnedBefore;
  const skillLabel = r.skill ? (r.skill.key ? t(`taxonomy.skills.${r.skill.key}`) : r.skill.name) : t("lesson.complete.skill");
  return (
    <section className="pt-6 text-center">
      <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-success-soft text-success animate-pop">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-success text-surface">
          <Check size={34} strokeWidth={2.8} />
        </span>
      </div>
      <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-accent">
        {result.alreadyCompleted ? t("lesson.complete.reviewed") : t("lesson.complete.eyebrow")}
      </p>
      <h1 className="mt-2 font-display text-[34px] leading-[1.1]">{lessonTitle}</h1>

      <dl className="mt-8 grid grid-cols-3 gap-2.5 text-left">
        <Stat icon={<Sparkles size={16} />} label={t("lesson.complete.xpEarned")} value={`+${nf.format(total)}`} />
        <Stat icon={<Flame size={16} />} label={t("lesson.complete.streak")} value={t("common.days", { count: r.streak.current })} />
        <Stat
          icon={<Trophy size={16} />}
          label={skillLabel}
          value={r.skill ? `${nf.format(r.skill.score)}${r.skill.delta ? ` (+${nf.format(r.skill.delta)})` : ""}` : "—"}
        />
      </dl>

      {(r.levelUp || r.achievements.length > 0 || result.journeyCompleted) && (
        <ul className="mt-4 space-y-2 text-left">
          {r.levelUp && <Banner>{t("lesson.complete.levelUp", { level: r.levelUp.level, name: t(`common.levels.${r.levelUp.name}`) })}</Banner>}
          {r.achievements.map((a) => (
            <Banner key={a.key}>{t("lesson.complete.achievement", { title: a.title })}</Banner>
          ))}
          {result.journeyCompleted && <Banner>{t("lesson.complete.journeyDone")}</Banner>}
        </ul>
      )}

      {result.missionAttemptId && !result.alreadyCompleted && (
        <div className="relative mt-6 overflow-hidden rounded-[28px] bg-hero p-5 text-left text-hero-ink shadow-card">
          <LeafSprig className="absolute -top-2 -right-2 h-20 w-20 text-hero-ink/25" />
          <span className="grid h-10 w-10 place-items-center rounded-[14px] bg-hero-ink/12" aria-hidden>
            <Target size={18} strokeWidth={1.8} />
          </span>
          <p className="mt-3 font-display text-[20px] leading-tight">{t("lesson.complete.missionLiveTitle")}</p>
          <p className="mt-1.5 max-w-[90%] text-[14px] leading-relaxed text-hero-ink/80">{t("lesson.complete.missionLiveBody")}</p>
        </div>
      )}
      {result.nextLesson && (
        <p className="mt-6 text-[14px] text-ink-2">
          <Rich template={t("lesson.complete.tomorrow")} values={{ title: <span className="font-medium text-ink">{result.nextLesson.title}</span> }} />
        </p>
      )}
    </section>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[22px] bg-surface p-3.5 shadow-card">
      <dt className="flex items-center gap-1.5 text-[12px] text-muted">
        <span className="shrink-0 text-accent">{icon}</span>
        <span className="truncate">{label}</span>
      </dt>
      <dd className="mt-1.5 text-[17px] font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

function Banner({ children }: { children: React.ReactNode }) {
  return <li className="rounded-[20px] bg-accent-soft px-4 py-3 text-[14px] font-medium text-accent animate-rise">{children}</li>;
}
