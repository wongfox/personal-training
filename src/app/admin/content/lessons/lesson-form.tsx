import type { dailyActions, exercises, lessons, quizQuestions } from "@/server/db/schema";
import { saveLessonAction } from "../../actions";
import { AdminForm } from "../../form";
import { Area, DIFFICULTY_OPTIONS, Input, MetaFields, Panel, Select } from "../../ui";

type Lesson = typeof lessons.$inferSelect;
type Exercise = typeof exercises.$inferSelect;
type Question = typeof quizQuestions.$inferSelect;
type Action = typeof dailyActions.$inferSelect;

const EXAMPLE_EXERCISE = {
  type: "choice",
  scenario: "Describe the situation…",
  question: "What's the strongest move?",
  options: [
    { text: "Option A", quality: "best", feedback: "Why it works." },
    { text: "Option B", quality: "weak", feedback: "Why it doesn't." },
  ],
};

const EXAMPLE_QUIZ = [{ prompt: "Question?", options: ["A", "B", "C"], correctIndex: 0, explanation: "Why A.", conceptKey: "my-concept-key" }];

/** The full lesson editor: the 10-step lesson structure, its exercise, knowledge check and mission. */
export function LessonForm({
  moduleId,
  lesson,
  exercise,
  questions,
  action,
  canPublish,
  nextOrder = 1,
}: {
  moduleId: string;
  lesson?: Lesson;
  exercise?: Exercise | null;
  questions?: Question[];
  action?: Action | null;
  canPublish: boolean;
  nextOrder?: number;
}) {
  const c = lesson?.content;
  return (
    <AdminForm action={saveLessonAction} hidden={{ moduleId, ...(lesson ? { id: lesson.id } : {}) }} submitLabel={lesson ? "Save lesson" : "Create lesson"}>
      <Panel>
        <h2 className="mb-4 text-[15px] font-semibold">Details</h2>
        <MetaFields values={lesson ?? { order: nextOrder, estimatedMinutes: 10 }} canPublish={canPublish} minutes={{ min: 5, max: 15 }} />
        <Input label="XP reward" name="xpReward" type="number" min={0} max={500} defaultValue={lesson?.xpReward ?? 50} className="mt-4 max-w-40" />
      </Panel>

      <Panel>
        <h2 className="mb-1 text-[15px] font-semibold">Lesson</h2>
        <p className="mb-4 text-[13px] text-muted">One powerful idea. Hook → why it matters → core concept → expert insight → example → reflection.</p>
        <div className="grid gap-4">
          <Area label="1 · Hook" name="hook" defaultValue={c?.hook} required rows={2} />
          <Area label="2 · Why it matters" name="whyItMatters" defaultValue={c?.whyItMatters} required rows={3} />
          <Input label="3 · Core concept — title" name="conceptTitle" defaultValue={c?.coreConcept.title} required />
          <Area label="Core concept — body" name="conceptBody" defaultValue={c?.coreConcept.body.join("\n\n")} required rows={7} hint="Separate paragraphs with a blank line." />
          <Area label="Core concept — key points" name="keyPoints" defaultValue={c?.coreConcept.keyPoints.join("\n")} required rows={4} hint="One per line." />
          <Area label="4 · Expert insight" name="insightText" defaultValue={c?.expertInsight.text} required rows={3} hint="Paraphrase accurately. Never invent quotes or statistics." />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Insight source" name="insightSource" defaultValue={c?.expertInsight.source} required />
            <Input label="Source detail (optional)" name="insightDetail" defaultValue={c?.expertInsight.sourceDetail} />
          </div>
          <Area label="5 · Example — situation" name="exSituation" defaultValue={c?.example.situation} required rows={2} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Area label="Before (weak)" name="exBefore" defaultValue={c?.example.before} required rows={3} />
            <Area label="After (strong)" name="exAfter" defaultValue={c?.example.after} required rows={3} />
          </div>
          <Area label="Why it works" name="exWhy" defaultValue={c?.example.whyItWorks} required rows={2} />
          <Input label="8 · Reflection prompt" name="reflectionPrompt" defaultValue={c?.reflectionPrompt} required />
        </div>
      </Panel>

      <Panel>
        <h2 className="mb-1 text-[15px] font-semibold">6 · Interactive exercise</h2>
        <p className="mb-4 text-[13px] text-muted">
          Types: choice, rewrite, order, recall, structure, decision, roleplay, pitch. The config is validated on save; leave it empty for no exercise.
        </p>
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Exercise title" name="exerciseTitle" defaultValue={exercise?.title} />
            <Input label="Exercise description" name="exerciseDescription" defaultValue={exercise?.description} />
          </div>
          <Area
            label="Exercise config (JSON)"
            name="exerciseConfig"
            defaultValue={exercise && exercise.status !== "archived" ? JSON.stringify(exercise.config, null, 2) : lesson ? "" : JSON.stringify(EXAMPLE_EXERCISE, null, 2)}
            rows={14}
            className="font-mono"
            spellCheck={false}
          />
        </div>
      </Panel>

      <Panel>
        <h2 className="mb-1 text-[15px] font-semibold">7 · Real-world mission</h2>
        <p className="mb-4 text-[13px] text-muted">Something the learner can do today, outside the app.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Mission" name="actionTitle" defaultValue={action?.title} className="sm:col-span-2" />
          <Area label="Description" name="actionDescription" defaultValue={action?.description} className="sm:col-span-2" rows={2} />
          <Input label="Done when…" name="actionCriteria" defaultValue={action?.successCriteria ?? ""} className="sm:col-span-2" />
          <Select label="Difficulty" name="actionDifficulty" defaultValue={action?.difficulty ?? "beginner"} options={DIFFICULTY_OPTIONS} />
          <Input label="Minutes" name="actionMinutes" type="number" min={1} max={60} defaultValue={action?.estimatedMinutes ?? 10} />
        </div>
      </Panel>

      <Panel>
        <h2 className="mb-1 text-[15px] font-semibold">9 · Knowledge check</h2>
        <p className="mb-4 text-[13px] text-muted">
          JSON array of questions. <code>conceptKey</code> is the concept&apos;s identity for spaced repetition — keep it stable when editing wording.
        </p>
        <Area
          label="Questions (JSON)"
          name="quiz"
          defaultValue={questions?.length ? JSON.stringify(questions.map(({ prompt, options, correctIndex, explanation, conceptKey }) => ({ prompt, options, correctIndex, explanation, conceptKey })), null, 2) : lesson ? "" : JSON.stringify(EXAMPLE_QUIZ, null, 2)}
          rows={14}
          className="font-mono"
          spellCheck={false}
        />
      </Panel>
    </AdminForm>
  );
}
