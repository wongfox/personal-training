"use client";

import { ArrowRight, Check, Flame, Quote, Sparkles, Target, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ExerciseRunner } from "@/components/exercises/exercise-runner";
import { FocusShell } from "@/components/focus-shell";
import { Button, ButtonLink } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/field";
import { Pill } from "@/components/ui/primitives";
import { postJSON } from "@/lib/api-client";
import { cn } from "@/lib/cn";
import { categoryName } from "@/lib/taxonomy";
import type { OpenLessonView } from "@/server/services/learning";

const STEPS = [
  { key: "hook", label: "Today's idea" },
  { key: "why", label: "Why it matters" },
  { key: "concept", label: "Core concept" },
  { key: "insight", label: "Expert insight" },
  { key: "example", label: "Example" },
  { key: "exercise", label: "Practise" },
  { key: "challenge", label: "Real-world mission" },
  { key: "reflection", label: "Reflect" },
  { key: "check", label: "Knowledge check" },
  { key: "complete", label: "Complete" },
] as const;

const EXERCISE = 5;
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
    skill: { name: string; score: number; delta: number } | null;
    achievements: { key: string; title: string }[];
  };
  missionAttemptId: string | null;
  nextLesson: { title: string } | null;
  journeyCompleted: boolean;
}

export function LessonPlayer({ lesson }: { lesson: OpenLessonView }) {
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
  const current = STEPS[step];

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
      setCompleteError(e instanceof Error ? e.message : "Couldn't save. Try again.");
    }
  }

  const canContinue = step === EXERCISE ? exerciseDone : step === CHECK ? quizDone : true;
  const next = () => {
    if (step === CHECK) void complete();
    else setStep((s) => Math.min(COMPLETE, s + 1));
  };

  const footer =
    step === COMPLETE ? (
      <ButtonLink href="/home">Back to today</ButtonLink>
    ) : (
      <div className="space-y-2">
        {completeError && <FormAlert>{completeError}</FormAlert>}
        <Button onClick={next} disabled={!canContinue}>
          {step === CHECK ? "Finish lesson" : step === 6 ? "I'll do it today" : step === 7 && !reflection.trim() ? "Skip for now" : "Continue"}
          <ArrowRight size={18} />
        </Button>
        {step > 0 && (
          <button type="button" onClick={() => setStep((s) => s - 1)} className="w-full py-2 text-[14px] text-muted hover:text-ink">
            Back
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
              <span key={s.key} className={cn("h-1 flex-1 rounded-full transition-colors duration-300", i <= step ? "bg-ink" : "bg-surface-2")} />
            ))}
          </div>
          <p className="mt-2 text-[12px] text-muted" aria-live="polite">
            {current.label} · {step + 1} of {STEPS.length}
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
              <Pill>{categoryName(lesson.category)}</Pill>
              <Pill>{lesson.estimatedMinutes} min</Pill>
              {lesson.completed && <Pill className="bg-success-soft text-success">Completed</Pill>}
            </div>
            <h1 className="mt-5 font-display text-[38px] leading-[1.04]">{lesson.title}</h1>
            <p className="mt-6 text-[20px] leading-relaxed text-ink-2">{c.hook}</p>
          </section>
        )}

        {step === 1 && (
          <section>
            <Eyebrow>Why it matters</Eyebrow>
            <p className="mt-4 font-display text-[28px] leading-[1.2]">{c.whyItMatters}</p>
          </section>
        )}

        {step === 2 && (
          <section>
            <Eyebrow>Core concept</Eyebrow>
            <h2 className="mt-3 font-display text-[30px] leading-tight">{c.coreConcept.title}</h2>
            <div className="prose-lesson mt-5 text-[17px] leading-[1.65] text-ink-2">
              {c.coreConcept.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <ul className="mt-6 space-y-2.5 rounded-3xl bg-surface p-5 shadow-card">
              {c.coreConcept.keyPoints.map((k) => (
                <li key={k} className="flex gap-3 text-[15px] leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  {k}
                </li>
              ))}
            </ul>
          </section>
        )}

        {step === 3 && (
          <section>
            <Eyebrow>Expert insight</Eyebrow>
            <figure className="mt-5 rounded-3xl bg-hero p-6 text-hero-ink">
              <Quote size={26} className="text-accent" aria-hidden />
              <blockquote className="mt-3 font-display text-[24px] leading-[1.3]">{c.expertInsight.text}</blockquote>
              <figcaption className="mt-5 text-[14px] text-hero-ink/70">
                — {c.expertInsight.source}
                {c.expertInsight.sourceDetail && <span className="block text-[13px] text-hero-ink/50">{c.expertInsight.sourceDetail}</span>}
              </figcaption>
            </figure>
          </section>
        )}

        {step === 4 && (
          <section>
            <Eyebrow>Example</Eyebrow>
            <p className="mt-4 text-[16px] leading-relaxed">{c.example.situation}</p>
            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-line p-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">Before</p>
                <p className="mt-2 text-[16px] leading-relaxed text-ink-2">{c.example.before}</p>
              </div>
              <div className="rounded-2xl bg-surface p-4 shadow-card ring-1 ring-success/30">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-success">After</p>
                <p className="mt-2 text-[16px] font-medium leading-relaxed">{c.example.after}</p>
              </div>
            </div>
            <p className="mt-5 text-[15px] leading-relaxed text-ink-2">
              <span className="font-semibold text-ink">Why it works: </span>
              {c.example.whyItWorks}
            </p>
          </section>
        )}

        {step === EXERCISE && lesson.exercise && (
          <section>
            <Eyebrow>Practise</Eyebrow>
            <h2 className="mt-3 text-[22px] font-semibold leading-snug">{lesson.exercise.title}</h2>
            <p className="mt-1.5 text-[15px] text-ink-2">{lesson.exercise.description}</p>
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

        {step === 6 && (
          <section>
            <Eyebrow>Real-world mission</Eyebrow>
            {lesson.action ? (
              <>
                <div className="mt-5 rounded-3xl bg-surface p-6 shadow-card">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-accent-soft text-accent">
                    <Target size={20} />
                  </span>
                  <h2 className="mt-4 font-display text-[28px] leading-tight">{lesson.action.title}</h2>
                  <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{lesson.action.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Pill>{lesson.action.estimatedMinutes} min</Pill>
                    <Pill className="capitalize">{lesson.action.difficulty}</Pill>
                  </div>
                </div>
                {lesson.action.successCriteria && (
                  <p className="mt-4 text-[14px] leading-relaxed text-ink-2">
                    <span className="font-semibold text-ink">You&apos;ve done it when: </span>
                    {lesson.action.successCriteria}
                  </p>
                )}
                <p className="mt-6 text-[14px] text-muted">We&apos;ll ask you how it went later today.</p>
              </>
            ) : (
              <p className="mt-4 text-ink-2">Use today&apos;s idea once before tonight.</p>
            )}
          </section>
        )}

        {step === 7 && (
          <section>
            <Eyebrow>Reflect</Eyebrow>
            <h2 className="mt-3 font-display text-[28px] leading-tight">{c.reflectionPrompt}</h2>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              maxLength={2000}
              placeholder="A sentence or two is enough."
              className="mt-6 min-h-36 w-full resize-none rounded-2xl border border-line bg-surface p-4 text-[16px] leading-relaxed outline-none focus:border-ink/40"
              aria-label={c.reflectionPrompt}
            />
          </section>
        )}

        {step === CHECK && lesson.quiz && (
          <section>
            <Eyebrow>Knowledge check</Eyebrow>
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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-accent">{children}</p>;
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
      setError(e instanceof Error ? e.message : "Couldn't check that.");
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
      setFinal(res.score !== undefined ? res : { score: all.length, total: questions.length });
      onDone(res.reward?.xp ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save your answers.");
    } finally {
      setBusy(false);
    }
  }

  if (final) {
    return (
      <div className="mt-6 rounded-3xl bg-surface p-6 text-center shadow-card">
        <p className="font-display text-[44px] leading-none tabular-nums">
          {final.score}/{final.total}
        </p>
        <p className="mt-3 text-[15px] text-ink-2">
          {final.score === final.total ? "Clean sweep. These ideas will come back for a quick review over the next weeks." : "Good — the ones you missed will come back in your reviews."}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <p className="text-[13px] text-muted">
        Question {index + 1} of {questions.length}
      </p>
      <h2 className="mt-2 text-[20px] font-semibold leading-snug">{q.prompt}</h2>
      <div role="radiogroup" className="mt-5 space-y-2.5">
        {q.options.map((o, i) => {
          const isCorrect = checked && i === checked.correctIndex;
          const isWrong = checked && i === selected && !checked.correct;
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={selected === i}
              disabled={!!checked}
              onClick={() => setSelected(i)}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-2xl border bg-surface px-4 py-3.5 text-left text-[15px] leading-relaxed transition",
                isCorrect ? "border-success bg-success-soft" : isWrong ? "border-danger bg-danger-soft" : selected === i ? "border-ink shadow-card" : "border-line",
              )}
            >
              {o}
              {isCorrect && <Check size={18} className="shrink-0 text-success" strokeWidth={2.6} />}
            </button>
          );
        })}
      </div>
      {checked && (
        <div className="mt-4 animate-rise rounded-2xl bg-surface-2 p-4 text-[15px] leading-relaxed" aria-live="polite">
          <p className={cn("font-semibold", checked.correct ? "text-success" : "text-danger")}>{checked.correct ? "Correct." : "Not quite."}</p>
          <p className="mt-1 text-ink-2">{checked.explanation}</p>
        </div>
      )}
      {error && <div className="mt-3"><FormAlert>{error}</FormAlert></div>}
      <div className="mt-5">
        {checked ? (
          <Button variant="secondary" onClick={advance} disabled={busy}>
            {index + 1 < questions.length ? "Next question" : busy ? "Saving…" : "See my score"}
          </Button>
        ) : (
          <Button variant="secondary" onClick={check} disabled={selected === null || busy}>
            {busy ? "Checking…" : "Check"}
          </Button>
        )}
      </div>
    </div>
  );
}

function Completion({ result, earnedBefore, lessonTitle }: { result: CompletionResult; earnedBefore: number; lessonTitle: string }) {
  if (result.queued) {
    return (
      <section className="pt-10 text-center">
        <h1 className="font-display text-[34px]">Saved offline.</h1>
        <p className="mt-3 text-ink-2">Your lesson is stored on this device and will sync as soon as you&apos;re back online.</p>
      </section>
    );
  }
  const r = result.reward;
  const total = r.xp + earnedBefore;
  return (
    <section className="pt-6 text-center">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-success-soft text-success animate-pop">
        <Check size={36} strokeWidth={2.6} />
      </div>
      <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">{result.alreadyCompleted ? "Reviewed" : "Lesson complete"}</p>
      <h1 className="mt-2 font-display text-[34px] leading-tight">{lessonTitle}</h1>

      <dl className="mt-8 grid grid-cols-3 gap-2.5 text-left">
        <Stat icon={<Sparkles size={16} />} label="XP earned" value={`+${total}`} />
        <Stat icon={<Flame size={16} />} label="Streak" value={`${r.streak.current} day${r.streak.current === 1 ? "" : "s"}`} />
        <Stat icon={<Trophy size={16} />} label={r.skill?.name ?? "Skill"} value={r.skill ? `${r.skill.score}${r.skill.delta ? ` (+${r.skill.delta})` : ""}` : "—"} />
      </dl>

      {(r.levelUp || r.achievements.length > 0 || result.journeyCompleted) && (
        <ul className="mt-4 space-y-2 text-left">
          {r.levelUp && <Banner>Level {r.levelUp.level} — {r.levelUp.name}. You levelled up.</Banner>}
          {r.achievements.map((a) => (
            <Banner key={a.key}>Achievement unlocked: {a.title}</Banner>
          ))}
          {result.journeyCompleted && <Banner>Journey complete. Choose your next one from the Journey tab.</Banner>}
        </ul>
      )}

      {result.missionAttemptId && !result.alreadyCompleted && (
        <div className="mt-6 rounded-2xl border border-line p-4 text-left">
          <p className="text-[13px] font-semibold">Your mission is live.</p>
          <p className="mt-1 text-[14px] text-ink-2">Check in from Home once you&apos;ve done it — that&apos;s where the real progress happens.</p>
        </div>
      )}
      {result.nextLesson && (
        <p className="mt-6 text-[14px] text-ink-2">
          Tomorrow: <span className="font-medium text-ink">{result.nextLesson.title}</span>
        </p>
      )}
    </section>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface p-3.5 shadow-card">
      <dt className="flex items-center gap-1.5 text-[12px] text-muted">
        {icon}
        <span className="truncate">{label}</span>
      </dt>
      <dd className="mt-1.5 text-[17px] font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

function Banner({ children }: { children: React.ReactNode }) {
  return <li className="rounded-2xl bg-accent-soft px-4 py-3 text-[14px] font-medium text-accent animate-rise">{children}</li>;
}
