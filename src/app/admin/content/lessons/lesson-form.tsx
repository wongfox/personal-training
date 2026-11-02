import { getTranslator } from "@/i18n/server";
import type { dailyActions, exercises, lessons, quizQuestions } from "@/server/db/schema";
import type { LessonContent } from "@/server/db/types";
import { hasSpanish } from "@/server/services/admin";
import { saveLessonAction } from "../../actions";
import { AdminForm } from "../../form";
import { LangTabs, PrefillButton } from "../../lang-tabs";
import { Area, difficultyOptions, englishHint, Input, MetaFields, Panel, PanelTitle, Select, SpanishIntro, SpanishMetaFields, spanishOf } from "../../ui";

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

const json = (value: unknown) => JSON.stringify(value, null, 2);
const str = (value: unknown) => (typeof value === "string" ? value : "");

/** The full lesson editor: the 10-step lesson structure, its exercise, knowledge check and mission — in English and Spanish. */
export async function LessonForm({
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
  const { t } = await getTranslator();
  const c = lesson?.content;
  const activeExercise = exercise && exercise.status !== "archived" ? exercise : null;
  const activeAction = action && action.status !== "archived" ? action : null;

  const english = (
    <>
      <Panel>
        <PanelTitle className="mb-4">{t("admin.lesson.details")}</PanelTitle>
        <MetaFields values={lesson ?? { order: nextOrder, estimatedMinutes: 10 }} canPublish={canPublish} minutes={{ min: 5, max: 15 }} />
        <Input label={t("admin.lesson.xpReward")} name="xpReward" type="number" min={0} max={500} defaultValue={lesson?.xpReward ?? 50} className="mt-4 max-w-40" />
      </Panel>

      <Panel>
        <PanelTitle className="mb-1">{t("admin.lesson.heading")}</PanelTitle>
        <p className="mb-4 text-[13px] text-muted">{t("admin.lesson.intro")}</p>
        <div className="grid gap-4">
          <Area label={t("admin.lesson.hook")} name="hook" defaultValue={c?.hook} required rows={2} />
          <Area label={t("admin.lesson.why")} name="whyItMatters" defaultValue={c?.whyItMatters} required rows={3} />
          <Input label={t("admin.lesson.conceptTitle")} name="conceptTitle" defaultValue={c?.coreConcept.title} required />
          <Area label={t("admin.lesson.conceptBody")} name="conceptBody" defaultValue={c?.coreConcept.body.join("\n\n")} required rows={7} hint={t("admin.lesson.conceptBodyHint")} />
          <Area label={t("admin.lesson.keyPoints")} name="keyPoints" defaultValue={c?.coreConcept.keyPoints.join("\n")} required rows={4} hint={t("admin.lesson.keyPointsHint")} />
          <Area label={t("admin.lesson.insight")} name="insightText" defaultValue={c?.expertInsight.text} required rows={3} hint={t("admin.lesson.insightHint")} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label={t("admin.lesson.insightSource")} name="insightSource" defaultValue={c?.expertInsight.source} required />
            <Input label={t("admin.lesson.insightDetail")} name="insightDetail" defaultValue={c?.expertInsight.sourceDetail} />
          </div>
          <Area label={t("admin.lesson.exSituation")} name="exSituation" defaultValue={c?.example.situation} required rows={2} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Area label={t("admin.lesson.exBefore")} name="exBefore" defaultValue={c?.example.before} required rows={3} />
            <Area label={t("admin.lesson.exAfter")} name="exAfter" defaultValue={c?.example.after} required rows={3} />
          </div>
          <Area label={t("admin.lesson.exWhy")} name="exWhy" defaultValue={c?.example.whyItWorks} required rows={2} />
          <Input label={t("admin.lesson.reflection")} name="reflectionPrompt" defaultValue={c?.reflectionPrompt} required />
        </div>
      </Panel>

      <Panel>
        <PanelTitle className="mb-1">{t("admin.lesson.exerciseHeading")}</PanelTitle>
        <p className="mb-4 text-[13px] text-muted">{t("admin.lesson.exerciseIntro")}</p>
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label={t("admin.lesson.exerciseTitle")} name="exerciseTitle" defaultValue={exercise?.title} />
            <Input label={t("admin.lesson.exerciseDescription")} name="exerciseDescription" defaultValue={exercise?.description} />
          </div>
          <Area
            label={t("admin.lesson.exerciseConfig")}
            name="exerciseConfig"
            defaultValue={activeExercise ? json(activeExercise.config) : lesson ? "" : json(EXAMPLE_EXERCISE)}
            rows={14}
            className="font-mono"
            spellCheck={false}
          />
        </div>
      </Panel>

      <Panel>
        <PanelTitle className="mb-1">{t("admin.lesson.missionHeading")}</PanelTitle>
        <p className="mb-4 text-[13px] text-muted">{t("admin.lesson.missionIntro")}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label={t("admin.lesson.mission")} name="actionTitle" defaultValue={action?.title} className="sm:col-span-2" />
          <Area label={t("admin.lesson.missionDescription")} name="actionDescription" defaultValue={action?.description} className="sm:col-span-2" rows={2} />
          <Input label={t("admin.lesson.doneWhen")} name="actionCriteria" defaultValue={action?.successCriteria ?? ""} className="sm:col-span-2" />
          <Select label={t("admin.fields.difficulty")} name="actionDifficulty" defaultValue={action?.difficulty ?? "beginner"} options={difficultyOptions(t)} />
          <Input label={t("admin.lesson.minutes")} name="actionMinutes" type="number" min={1} max={60} defaultValue={action?.estimatedMinutes ?? 10} />
        </div>
      </Panel>

      <Panel>
        <PanelTitle className="mb-1">{t("admin.lesson.quizHeading")}</PanelTitle>
        <p className="mb-4 text-[13px] text-muted">
          {t("admin.lesson.quizIntroBefore")} <code>conceptKey</code> {t("admin.lesson.quizIntroAfter")}
        </p>
        <Area
          label={t("admin.lesson.quiz")}
          name="quiz"
          defaultValue={
            questions?.length
              ? json(questions.map(({ prompt, options, correctIndex, explanation, conceptKey }) => ({ prompt, options, correctIndex, explanation, conceptKey })))
              : lesson
                ? ""
                : json(EXAMPLE_QUIZ)
          }
          rows={14}
          className="font-mono"
          spellCheck={false}
        />
      </Panel>
    </>
  );

  return (
    <AdminForm action={saveLessonAction} hidden={{ moduleId, ...(lesson ? { id: lesson.id } : {}) }} submitLabel={t(lesson ? "admin.lesson.save" : "admin.lesson.create")}>
      <LangTabs
        esMissing={!hasSpanish(lesson?.translations)}
        en={english}
        es={<SpanishLesson lesson={lesson} exercise={activeExercise} questions={questions ?? []} action={activeAction} />}
      />
    </AdminForm>
  );
}

/** The "Español" tab: every translatable lesson field, named `es_*`, with the English text as a placeholder. */
async function SpanishLesson({ lesson, exercise, questions, action }: { lesson?: Lesson; exercise: Exercise | null; questions: Question[]; action: Action | null }) {
  const { t } = await getTranslator();
  const es = spanishOf<{ title: string; description: string; content: LessonContent }>(lesson);
  const ec = es.content;
  const c = lesson?.content;
  const esExercise = spanishOf<{ title: string; description: string; config: unknown }>(exercise);
  const esAction = spanishOf<{ title: string; description: string; successCriteria: string }>(action);
  const translatedQuestions = questions
    .slice()
    .sort((a, b) => a.order - b.order)
    .filter((q) => Object.keys(q.translations?.es ?? {}).length > 0)
    .map((q) => {
      const qes = spanishOf<{ prompt: string; options: string[]; explanation: string }>(q);
      return { conceptKey: q.conceptKey, prompt: qes.prompt ?? q.prompt, options: qes.options ?? q.options, explanation: qes.explanation ?? q.explanation };
    });
  const englishQuestions = questions
    .slice()
    .sort((a, b) => a.order - b.order)
    .map(({ conceptKey, prompt, options, explanation }) => ({ conceptKey, prompt, options, explanation }));

  return (
    <>
      <SpanishIntro />
      <Panel>
        <PanelTitle className="mb-4">{t("admin.lesson.details")}</PanelTitle>
        <SpanishMetaFields english={{ title: lesson?.title, description: lesson?.description }} spanish={es} />
      </Panel>

      <Panel>
        <PanelTitle className="mb-1">{t("admin.lesson.es.contentHeading")}</PanelTitle>
        <p className="mb-4 text-[13px] text-muted">{t("admin.lesson.es.contentIntro")}</p>
        <div className="grid gap-4">
          <Area label={t("admin.lesson.es.hook")} name="es_hook" defaultValue={ec?.hook} placeholder={englishHint(t, c?.hook)} rows={2} />
          <Area label={t("admin.lesson.es.why")} name="es_whyItMatters" defaultValue={ec?.whyItMatters} placeholder={englishHint(t, c?.whyItMatters)} rows={3} />
          <Input label={t("admin.lesson.es.conceptTitle")} name="es_conceptTitle" defaultValue={ec?.coreConcept?.title} placeholder={englishHint(t, c?.coreConcept.title)} />
          <Area
            label={t("admin.lesson.conceptBody")}
            name="es_conceptBody"
            defaultValue={ec?.coreConcept?.body?.join("\n\n")}
            placeholder={englishHint(t, c?.coreConcept.body.join("\n\n"))}
            rows={7}
            hint={t("admin.lesson.conceptBodyHint")}
          />
          <Area
            label={t("admin.lesson.keyPoints")}
            name="es_keyPoints"
            defaultValue={ec?.coreConcept?.keyPoints?.join("\n")}
            placeholder={englishHint(t, c?.coreConcept.keyPoints.join("\n"))}
            rows={4}
            hint={t("admin.lesson.keyPointsHint")}
          />
          <Area label={t("admin.lesson.es.insight")} name="es_insightText" defaultValue={ec?.expertInsight?.text} placeholder={englishHint(t, c?.expertInsight.text)} rows={3} hint={t("admin.lesson.insightHint")} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label={t("admin.lesson.insightSource")}
              name="es_insightSource"
              defaultValue={ec?.expertInsight?.source}
              placeholder={c?.expertInsight.source}
              hint={t("admin.lesson.es.insightSourceHint")}
            />
            <Input label={t("admin.lesson.insightDetail")} name="es_insightDetail" defaultValue={ec?.expertInsight?.sourceDetail} placeholder={c?.expertInsight.sourceDetail} />
          </div>
          <Area label={t("admin.lesson.es.exSituation")} name="es_exSituation" defaultValue={ec?.example?.situation} placeholder={englishHint(t, c?.example.situation)} rows={2} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Area label={t("admin.lesson.exBefore")} name="es_exBefore" defaultValue={ec?.example?.before} placeholder={englishHint(t, c?.example.before)} rows={3} />
            <Area label={t("admin.lesson.exAfter")} name="es_exAfter" defaultValue={ec?.example?.after} placeholder={englishHint(t, c?.example.after)} rows={3} />
          </div>
          <Area label={t("admin.lesson.exWhy")} name="es_exWhy" defaultValue={ec?.example?.whyItWorks} placeholder={englishHint(t, c?.example.whyItWorks)} rows={2} />
          <Input label={t("admin.lesson.es.reflection")} name="es_reflectionPrompt" defaultValue={ec?.reflectionPrompt} placeholder={englishHint(t, c?.reflectionPrompt)} />
        </div>
      </Panel>

      <Panel>
        <PanelTitle className="mb-1">{t("admin.lesson.es.exerciseHeading")}</PanelTitle>
        {exercise ? (
          <>
            <p className="mb-4 text-[13px] text-muted">{t("admin.lesson.es.exerciseIntro")}</p>
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label={t("admin.lesson.exerciseTitle")} name="es_exerciseTitle" defaultValue={str(esExercise.title)} placeholder={englishHint(t, exercise.title)} />
                <Input label={t("admin.lesson.exerciseDescription")} name="es_exerciseDescription" defaultValue={str(esExercise.description)} placeholder={englishHint(t, exercise.description)} />
              </div>
              <Area
                label={t("admin.lesson.es.exerciseConfig")}
                name="es_exerciseConfig"
                defaultValue={esExercise.config ? json(esExercise.config) : ""}
                rows={14}
                className="font-mono"
                spellCheck={false}
              />
              <div>
                <PrefillButton target="es_exerciseConfig" value={json(exercise.config)} />
              </div>
            </div>
          </>
        ) : (
          <p className="text-[13px] text-muted">{t("admin.lesson.es.noExercise")}</p>
        )}
      </Panel>

      <Panel>
        <PanelTitle className="mb-4">{t("admin.lesson.es.missionHeading")}</PanelTitle>
        <div className="grid gap-4">
          <Input label={t("admin.lesson.mission")} name="es_actionTitle" defaultValue={str(esAction.title)} placeholder={englishHint(t, action?.title)} />
          <Area label={t("admin.lesson.missionDescription")} name="es_actionDescription" defaultValue={str(esAction.description)} placeholder={englishHint(t, action?.description)} rows={2} />
          <Input label={t("admin.lesson.doneWhen")} name="es_actionCriteria" defaultValue={str(esAction.successCriteria)} placeholder={englishHint(t, action?.successCriteria)} />
        </div>
      </Panel>

      <Panel>
        <PanelTitle className="mb-1">{t("admin.lesson.es.quizHeading")}</PanelTitle>
        {englishQuestions.length ? (
          <>
            <p className="mb-4 text-[13px] text-muted">{t("admin.lesson.es.quizIntro")}</p>
            <Area
              label={t("admin.lesson.es.quiz")}
              name="es_quiz"
              defaultValue={translatedQuestions.length ? json(translatedQuestions) : ""}
              rows={14}
              className="font-mono"
              spellCheck={false}
            />
            <div className="mt-4">
              <PrefillButton target="es_quiz" value={json(englishQuestions)} />
            </div>
          </>
        ) : (
          <p className="text-[13px] text-muted">{t("admin.lesson.es.noQuiz")}</p>
        )}
      </Panel>
    </>
  );
}
