/**
 * The feedback engine: reads the learner's recent signals (missions,
 * reflections, exercise scores, consistency) and writes one specific
 * observation plus what to do next — the "coach's read" on the Home screen.
 * Written in the learner's language (`locale`, default English).
 */
import type { Locale } from "@/i18n/config";
import type { DimensionScore } from "@/server/db/types";
import { dimensionLabels, normalizeText } from "./text-analysis";

export interface InsightSignals {
  primarySkill: { key: string; name: string };
  skills: { key: string; name: string; score: number; baseline: number }[];
  /** Missions from the last 14 days, newest first. */
  actions: { status: "committed" | "done" | "not_yet" | "skipped"; outcome: string | null; title: string }[];
  /** Free text from recent reflections, newest first. */
  reflections: string[];
  /** Recent scored exercises, newest first. */
  exercises: { score: number; dimensions?: DimensionScore[]; flaggedCount: number }[];
  daysTrainedLast7: number;
  weeklyTarget: number;
  /** Days since the plan started (1 on the first day). */
  daysInPlan: number;
  streak: number;
  lessonsCompleted: number;
  next: { title: string; skillName: string } | null;
}

export interface CoachInsight {
  observation: string;
  recommendation: string;
  focus: string;
  tone: "welcome" | "praise" | "nudge" | "challenge";
  /** A concrete practice rep that trains exactly the focus. */
  drill?: { href: string; label: string };
}

/** Which practice tool trains which measured dimension. */
const DRILLS: Record<string, { slug: string; label: Record<Locale, string> }> = {
  confidence: { slug: "practice-hedge-hunter-recommendation", label: { en: "Hedge Hunter", es: "Cazador de muletillas" } },
  authority: { slug: "practice-hedge-hunter-recommendation", label: { en: "Hedge Hunter", es: "Cazador de muletillas" } },
  conciseness: { slug: "practice-bottom-line-up-front", label: { en: "Bottom line up front", es: "La conclusión primero" } },
  executive_presence: { slug: "practice-bottom-line-up-front", label: { en: "Bottom line up front", es: "La conclusión primero" } },
  clarity: { slug: "practice-organizer-prep", label: { en: "Thought Organizer (PREP)", es: "Organizador de ideas (PREP)" } },
  structure: { slug: "practice-organizer-scr", label: { en: "Thought Organizer (SCR)", es: "Organizador de ideas (SCR)" } },
  storytelling: { slug: "practice-story-builder", label: { en: "Story Builder", es: "Constructor de historias" } },
  persuasion: { slug: "practice-presentation-trainer", label: { en: "Presentation Trainer", es: "Entrenador de presentaciones" } },
  curiosity: { slug: "practice-ask-better-questions", label: { en: "Ask better questions", es: "Haz mejores preguntas" } },
  empathy: { slug: "practice-conversation-colleague-pushback", label: { en: "Conversation Simulator", es: "Simulador de conversación" } },
  flow: { slug: "practice-conversation-potential-client", label: { en: "Conversation Simulator", es: "Simulador de conversación" } },
};

function drillFor(key: string, locale: Locale): CoachInsight["drill"] {
  const d = DRILLS[key];
  return d ? { href: `/practice/${d.slug}`, label: d.label[locale] } : undefined;
}

const HESITATION = /\b(nervous|anxious|hesitat\w*|afraid|scared|awkward|froze|freeze|didn'?t know what to say|blank(ed)?|overthink\w*|shy|intimidat\w*|avoid\w*)\b/i;
const WIN = /\b(worked|went well|felt good|confident|easier|natural|they (smiled|laughed|agreed)|success)\b/i;
/* Spanish patterns run on accent-stripped, lower-case text. */
const HESITATION_ES = /\b(nervios\w*|ansios\w*|ansiedad|dud(e|o|a|aba|as)|vacil\w*|mied\w*|asust\w*|incomod\w*|me congele|me trabe|me bloquee|bloque\w*|no supe que decir|me quede en blanco|en blanco|pienso demasiado|sobrepens\w*|timid\w*|verguenza|intimid\w*|evit\w*)\b/;
const WIN_ES = /\b(funciono|salio bien|me senti bien|segur[oa]|confianza|mas facil|natural|(sonrio|sonrieron|se rio|se rieron|acepto|aceptaron|estuvo de acuerdo)|exito)\b/;

function hesitates(text: string, locale: Locale): boolean {
  return locale === "es" ? HESITATION_ES.test(normalizeText(text)) : HESITATION.test(text);
}

function isWin(text: string, locale: Locale): boolean {
  return locale === "es" ? WIN_ES.test(normalizeText(text)) : WIN.test(text);
}

const COPY = {
  en: {
    welcomeObservation: (skill: string) => `Your plan starts with ${skill.toLowerCase()}: one idea a day, practised the same day in real life.`,
    welcomeRecommendation: "Do today's lesson, then take its mission into your day. Small reps, every day — that's the whole method.",
    improving: (skill: string, gain: number) => `You're improving your ${skill.toLowerCase()} (+${gain} since you started)`,
    initiating: "Initiating",
    reps: "You're putting in the reps",
    hesitateObservation: (lead: string) => `${lead}, but your reflections suggest you still hesitate at the moment you need to start — the first sentence, the first step.`,
    hesitateRecommendation: "Lower the bar: decide your opening line before the moment arrives, then say it within three seconds. Rehearse it once first, where it's safe.",
    networkingDrill: "Networking Practice",
    application: "Application",
    avoidedObservation: (avoided: number, of: number) => `You're learning the ideas, but ${avoided} of your last ${of} missions didn't happen yet. Knowledge only turns into skill when you use it.`,
    avoidedRecommendation: "Pick the moment for today's mission now — which meeting, which person, what time. A specific plan more than doubles follow-through.",
    flaggedDetail: (n: number) => ` — ${n} hedge or apology phrases in your recent answers`,
    weakObservation: (improving: string | null, label: string, detail: string, avg: number) =>
      `${improving ? improving + ". Your" : "Your"} weakest signal right now is ${label.toLowerCase()}${detail} (averaging ${avg}/100).`,
    curiosityRecommendation: "In your next conversation, ask two questions before you share anything about yourself.",
    weakRecommendation: (label: string) => `Before you hit submit or speak, reread once for ${label.toLowerCase()} only — then do one focused rep.`,
    consistency: "Consistency",
    consistencyObservation: (days: number, window: number, expected: number) =>
      `You trained ${days} of the last ${window} days against a plan of ${expected}. Skills compound with frequency, not intensity.`,
    consistencyRecommendation: "Shrink the session instead of skipping it: even the 5-minute version keeps the habit alive.",
    momentum: "Momentum",
    momentumObservation: (day: number) => `Day ${day} done right: you learned it, practised it and took it into your day. That loop is the whole method.`,
    tomorrow: (title: string) => `Tomorrow: “${title}”. Same time, same rhythm.`,
    comeBack: "Come back tomorrow — same time, same rhythm.",
    wins: (n: number) => `, and your missions are landing — ${n} recent ${n === 1 ? "win" : "wins"}`,
    inARow: (n: number) => `${n} days in a row.`,
    steady: (lessons: number, streak: number) => `Steady work: ${lessons} lessons done and a ${streak}-day streak.`,
    raise: (title: string) => `Raise the difficulty a notch. Next up: “${title}”.`,
    harder: "Try a harder practice scenario this week to stretch the skill.",
  },
  es: {
    welcomeObservation: (skill: string) => `Tu plan empieza por ${skill.toLowerCase()}: una idea al día, practicada ese mismo día en la vida real.`,
    welcomeRecommendation: "Haz la lección de hoy y lleva su misión a tu día. Repeticiones pequeñas, todos los días: ese es todo el método.",
    improving: (skill: string, gain: number) => `Estás mejorando tu ${skill.toLowerCase()} (+${gain} desde que empezaste)`,
    initiating: "Dar el primer paso",
    reps: "Estás haciendo las repeticiones",
    hesitateObservation: (lead: string) => `${lead}, pero tus reflexiones muestran que todavía dudas justo en el momento de empezar: la primera frase, el primer paso.`,
    hesitateRecommendation: "Baja la exigencia: decide tu frase de apertura antes de que llegue el momento y dila en menos de tres segundos. Ensáyala antes una vez, donde te sientas seguro o segura.",
    networkingDrill: "Práctica de networking",
    application: "Aplicación",
    avoidedObservation: (avoided: number, of: number) => `Estás aprendiendo las ideas, pero ${avoided} de tus últimas ${of} misiones todavía no se hicieron. El conocimiento solo se vuelve habilidad cuando lo usas.`,
    avoidedRecommendation: "Elige ahora el momento para la misión de hoy: qué reunión, qué persona, a qué hora. Un plan concreto duplica las probabilidades de cumplirlo.",
    flaggedDetail: (n: number) => `: ${n} frases de duda o disculpa en tus respuestas recientes`,
    weakObservation: (improving: string | null, label: string, detail: string, avg: number) =>
      `${improving ? improving + ". Tu" : "Tu"} punto más débil ahora mismo es ${label.toLowerCase()}${detail} (promedio de ${avg}/100).`,
    curiosityRecommendation: "En tu próxima conversación, haz dos preguntas antes de contar algo sobre ti.",
    weakRecommendation: (label: string) => `Antes de enviar o de hablar, relee una vez pensando solo en ${label.toLowerCase()} y luego haz una repetición enfocada.`,
    consistency: "Constancia",
    consistencyObservation: (days: number, window: number, expected: number) =>
      `Entrenaste ${days} de los últimos ${window} días frente a un plan de ${expected}. Las habilidades crecen con la frecuencia, no con la intensidad.`,
    consistencyRecommendation: "Achica la sesión en lugar de saltártela: incluso la versión de 5 minutos mantiene vivo el hábito.",
    momentum: "Impulso",
    momentumObservation: (day: number) => `Día ${day} bien hecho: lo aprendiste, lo practicaste y lo llevaste a tu día. Ese ciclo es todo el método.`,
    tomorrow: (title: string) => `Mañana: “${title}”. Misma hora, mismo ritmo.`,
    comeBack: "Vuelve mañana: misma hora, mismo ritmo.",
    wins: (n: number) => `, y tus misiones están funcionando: ${n} ${n === 1 ? "logro reciente" : "logros recientes"}`,
    inARow: (n: number) => `${n} días seguidos.`,
    steady: (lessons: number, streak: number) => `Trabajo constante: ${lessons} lecciones hechas y una racha de ${streak} días.`,
    raise: (title: string) => `Sube un poco la dificultad. Lo siguiente: “${title}”.`,
    harder: "Prueba esta semana un escenario de práctica más difícil para estirar la habilidad.",
  },
} satisfies Record<Locale, unknown>;

function weakestDimension(exercises: InsightSignals["exercises"], locale: Locale): { key: string; label: string; avg: number } | null {
  const labels = dimensionLabels(locale);
  const sums = new Map<string, { total: number; n: number }>();
  for (const e of exercises.slice(0, 8)) {
    for (const d of e.dimensions ?? []) {
      const s = sums.get(d.key) ?? { total: 0, n: 0 };
      s.total += d.score;
      s.n += 1;
      sums.set(d.key, s);
    }
  }
  let worst: { key: string; label: string; avg: number } | null = null;
  for (const [key, { total, n }] of sums) {
    if (n < 2) continue;
    const avg = total / n;
    if (!worst || avg < worst.avg) worst = { key, label: labels[key as keyof typeof labels] ?? key, avg };
  }
  return worst && worst.avg < 68 ? worst : null;
}

export function buildCoachInsight(s: InsightSignals, locale: Locale = "en"): CoachInsight {
  const c = COPY[locale];
  if (s.lessonsCompleted === 0 && s.actions.length === 0) {
    return {
      tone: "welcome",
      focus: s.primarySkill.name,
      observation: c.welcomeObservation(s.primarySkill.name),
      recommendation: c.welcomeRecommendation,
    };
  }

  const improving = [...s.skills]
    .map((k) => ({ ...k, gain: k.score - k.baseline }))
    .sort((a, b) => b.gain - a.gain)[0];
  const improvingClause = improving && improving.gain >= 3 && s.daysInPlan >= 3 ? c.improving(improving.name, improving.gain) : null;

  // 1. Reflections say they hesitate.
  const hesitant = s.reflections.slice(0, 5).filter((r) => hesitates(r, locale)).length;
  const avoided = s.actions.slice(0, 5).filter((a) => a.status === "not_yet" || a.status === "skipped").length;
  const difficult = s.actions.slice(0, 5).filter((a) => a.outcome === "difficult").length;
  if (hesitant >= 2 || (hesitant >= 1 && avoided + difficult >= 1)) {
    return {
      tone: "challenge",
      focus: c.initiating,
      observation: c.hesitateObservation(improvingClause ?? c.reps),
      recommendation: c.hesitateRecommendation,
      drill: { href: "/practice/practice-networking-event", label: c.networkingDrill },
    };
  }

  // 2. Missions not getting done.
  if (avoided >= 2) {
    return {
      tone: "nudge",
      focus: c.application,
      observation: c.avoidedObservation(avoided, Math.min(5, s.actions.length)),
      recommendation: c.avoidedRecommendation,
    };
  }

  // 3. A measurable weakness in how they write/speak.
  const weak = weakestDimension(s.exercises, locale);
  if (weak) {
    const flagged = s.exercises.slice(0, 5).reduce((n, e) => n + e.flaggedCount, 0);
    const detail = weak.key === "confidence" && flagged > 0 ? c.flaggedDetail(flagged) : "";
    return {
      tone: "challenge",
      focus: weak.label,
      observation: c.weakObservation(improvingClause, weak.label, detail, Math.round(weak.avg)),
      recommendation: weak.key === "curiosity" ? c.curiosityRecommendation : c.weakRecommendation(weak.label),
      drill: drillFor(weak.key, locale),
    };
  }

  // 4. Consistency — judged only on the days the plan has actually been running.
  const window = Math.min(7, s.daysInPlan);
  const expected = Math.ceil((s.weeklyTarget * window) / 7);
  if (s.daysInPlan >= 3 && s.daysTrainedLast7 < Math.ceil(expected / 2)) {
    return {
      tone: "nudge",
      focus: c.consistency,
      observation: c.consistencyObservation(s.daysTrainedLast7, window, expected),
      recommendation: c.consistencyRecommendation,
    };
  }

  // 5. Early days: encourage the rhythm rather than judge it.
  if (s.daysInPlan < 3 && !improvingClause) {
    return {
      tone: "praise",
      focus: c.momentum,
      observation: c.momentumObservation(s.daysInPlan),
      recommendation: s.next ? c.tomorrow(s.next.title) : c.comeBack,
    };
  }

  // 6. Wins.
  const wins =
    s.actions.slice(0, 5).filter((a) => a.outcome === "good" || a.outcome === "excellent").length +
    s.reflections.slice(0, 3).filter((r) => isWin(r, locale)).length;
  return {
    tone: "praise",
    focus: improving?.name ?? s.primarySkill.name,
    observation: improvingClause
      ? `${improvingClause}${wins > 0 ? c.wins(wins) : ""}. ${s.streak >= 3 ? c.inARow(s.streak) : ""}`.trim()
      : c.steady(s.lessonsCompleted, s.streak),
    recommendation: s.next ? c.raise(s.next.title) : c.harder,
  };
}

export interface ReflectionFeedback {
  headline: string;
  observation: string;
  nextStep: string;
}

/** Only quote the learner back when they actually said something. */
function meaningful(text: string | undefined): text is string {
  // At least three different real words — "ok", "fine", "ok ok ok" don't qualify.
  return Boolean(text) && new Set((normalizeText(text!).match(/[a-z']{2,}/g) ?? [])).size >= 3;
}

function quote(text: string, max = 110): string {
  const t = text.trim().replace(/\s+/g, " ").replace(/[.!]+$/, "");
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

const REFLECTION_COPY = {
  en: {
    excellent: "That's a new baseline.",
    good: "It landed.",
    difficult: "Hard reps count double.",
    normal: "A clean rep.",
    didItAnyway: "You felt the hesitation and did it anyway — that's exactly the muscle this builds.",
    nerves: "The nerves showed up. That's normal at this stage; what matters is that you started.",
    keep: (q: string) => `Keep this: “${q}”. Name it, so you can repeat it on purpose.`,
    edge: "Difficult usually means you were at the edge of your skill — the right place to practise.",
    habit: "Doing it is what turns an idea into a habit.",
    thin: "A few more words would make this reflection useful — what exactly did you say, and how did they react?",
    changeOne: (q: string) => `Next time, change one thing: “${q}”. Decide now where you'll try it.`,
    tomorrowLesson: (t: string) => ` Tomorrow's lesson: “${t}”.`,
    pickOne: "Before tomorrow, pick one thing you'd do differently — it's the fastest way to improve.",
    nextLesson: (t: string) => ` Next lesson: “${t}”.`,
  },
  es: {
    excellent: "Ese es tu nuevo punto de partida.",
    good: "Funcionó.",
    difficult: "Las repeticiones difíciles cuentan doble.",
    normal: "Una repetición bien hecha.",
    didItAnyway: "Sentiste la duda y lo hiciste de todos modos: ese es justo el músculo que esto construye.",
    nerves: "Aparecieron los nervios. Es normal en esta etapa; lo que importa es que empezaste.",
    keep: (q: string) => `Quédate con esto: “${q}”. Ponle nombre para poder repetirlo a propósito.`,
    edge: "Difícil suele significar que estabas en el límite de tu habilidad: el lugar correcto para practicar.",
    habit: "Hacerlo es lo que convierte una idea en un hábito.",
    thin: "Con algunas palabras más, esta reflexión te serviría mucho más: ¿qué dijiste exactamente y cómo reaccionó la otra persona?",
    changeOne: (q: string) => `La próxima vez, cambia una sola cosa: “${q}”. Decide ahora dónde lo vas a intentar.`,
    tomorrowLesson: (t: string) => ` La lección de mañana: “${t}”.`,
    pickOne: "Antes de mañana, elige una cosa que harías diferente: es la forma más rápida de mejorar.",
    nextLesson: (t: string) => ` Siguiente lección: “${t}”.`,
  },
} satisfies Record<Locale, unknown>;

/**
 * Immediate, specific feedback on a mission reflection, written from the
 * learner's own words: what to keep, what to change, and the next rep.
 */
export function reflectionFeedback(
  input: {
    outcome: "difficult" | "normal" | "good" | "excellent" | null;
    answers: { whatHappened?: string; whatWorked?: string; whatToImprove?: string; whatLearned?: string };
    next: { title: string } | null;
  },
  locale: Locale = "en",
): ReflectionFeedback {
  const c = REFLECTION_COPY[locale];
  const { outcome, answers: a, next } = input;
  const all = [a.whatHappened, a.whatWorked, a.whatToImprove, a.whatLearned].filter(Boolean).join(" ");
  const hesitated = hesitates(all, locale);

  const headline = outcome === "excellent" ? c.excellent : outcome === "good" ? c.good : outcome === "difficult" ? c.difficult : c.normal;

  const parts: string[] = [];
  if (hesitated && (outcome === "good" || outcome === "excellent")) parts.push(c.didItAnyway);
  else if (hesitated) parts.push(c.nerves);
  if (meaningful(a.whatWorked)) parts.push(c.keep(quote(a.whatWorked)));
  if (!parts.length) parts.push(outcome === "difficult" ? c.edge : c.habit);

  const thin = ![a.whatHappened, a.whatWorked, a.whatToImprove, a.whatLearned].some(meaningful);
  if (thin) parts.unshift(c.thin);
  const nextStep = meaningful(a.whatToImprove)
    ? `${c.changeOne(quote(a.whatToImprove))}${next ? c.tomorrowLesson(next.title) : ""}`
    : `${c.pickOne}${next ? c.nextLesson(next.title) : ""}`;

  return { headline, observation: parts.join(" "), nextStep };
}
