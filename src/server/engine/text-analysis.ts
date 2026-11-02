/**
 * Deterministic language analysis used to give instant, specific feedback on
 * what a learner writes or says — hedges, apologies, length, questions,
 * structure. It runs with no AI provider; when one is connected, AI feedback
 * is layered on top of (not instead of) these measurable signals.
 *
 * Bilingual: every function takes the learner's language (default English).
 * Spanish matching is accent-insensitive ("que" matches "qué"), and Spanish
 * questions may use ¿…?.
 */
import type { Locale } from "@/i18n/config";
import type { DimensionScore, ExerciseFeedback, FeedbackDimension } from "@/server/db/types";

/* ─────────────────────────── Word lists ─────────────────────────── */

interface Lexicon {
  hedges: string[];
  apologies: string[];
  fillers: string[];
  empathy: string[];
  callToAction: string[];
  structure: string[];
  story: string[];
  stopwords: Set<string>;
}

const EN: Lexicon = {
  hedges: [
    "i think",
    "i guess",
    "i feel like",
    "i believe",
    "maybe",
    "perhaps",
    "just",
    "sort of",
    "kind of",
    "kinda",
    "probably",
    "hopefully",
    "possibly",
    "i'm not sure",
    "i am not sure",
    "a little",
    "a bit",
    "somewhat",
    "i was wondering",
    "if that's ok",
    "if that's okay",
    "if you don't mind",
    "does that make sense",
    "not sure if",
    "i might be wrong",
    "this might be",
    "basically",
  ],
  apologies: ["sorry", "apologize", "apologise", "apologies"],
  fillers: ["um", "uh", "erm", "you know", "literally", "so yeah", "like,"],
  empathy: [
    "sounds like",
    "it seems",
    "i hear",
    "i understand",
    "makes sense",
    "fair point",
    "good point",
    "i appreciate",
    "thank you",
    "thanks",
    "you mentioned",
    "you said",
    "great question",
    "that must",
    "i can see",
  ],
  callToAction: [
    "approve",
    "decide",
    "decision",
    "next step",
    "agree",
    "commit",
    "sign off",
    "green light",
    "i recommend",
    "we recommend",
    "my recommendation",
    "i propose",
    "let's",
    "shall we",
    "would you be open",
    "can we",
    "by friday",
    "by monday",
    "this week",
    "today",
  ],
  structure: [
    "first",
    "second",
    "third",
    "because",
    "for example",
    "for instance",
    "which means",
    "so that",
    "as a result",
    "in short",
    "bottom line",
    "the point is",
    "here's why",
    "three",
    "two things",
  ],
  story: [
    "when",
    "last year",
    "last month",
    "last week",
    "yesterday",
    "imagine",
    "picture this",
    "story",
    "turned out",
    "realized",
    "realised",
    "until",
    "then",
    "suddenly",
    "that's when",
  ],
  stopwords: new Set(
    "the a an and or but if then so of to in on at for with from by about as is are was were be been it its this that these those i you he she we they me my your our their them us what how why which who do does did have has had not no yes can could would should will just very really also there here than too into out up down over more most some any all".split(
      " ",
    ),
  ),
};

const ES: Lexicon = {
  hedges: [
    "creo que",
    "pienso que",
    "siento que",
    "me parece que",
    "supongo",
    "tal vez",
    "quizás",
    "quizá",
    "a lo mejor",
    "puede que",
    "puede ser que",
    "probablemente",
    "posiblemente",
    "ojalá",
    "no estoy seguro",
    "no estoy segura",
    "no sé si",
    "un poco",
    "un poquito",
    "más o menos",
    "algo así",
    "de alguna manera",
    "solo quería",
    "solamente quería",
    "me preguntaba",
    "si no es molestia",
    "si no te molesta",
    "si no le molesta",
    "si te parece bien",
    "si está bien",
    "no sé si tiene sentido",
    "podría estar equivocado",
    "podría estar equivocada",
    "básicamente",
  ],
  apologies: ["perdón", "perdona", "perdone", "lo siento", "disculpa", "disculpe", "disculpas", "disculpen", "me disculpo", "lamento"],
  fillers: ["eh", "em", "ehm", "este,", "o sea", "pues,", "bueno,", "tipo,", "como que", "digamos", "en plan"],
  empathy: [
    "suena a",
    "suena como",
    "parece que",
    "te escucho",
    "te entiendo",
    "entiendo",
    "comprendo",
    "tiene sentido",
    "buen punto",
    "tienes razón",
    "aprecio",
    "valoro",
    "gracias",
    "mencionaste",
    "dijiste",
    "comentaste",
    "buena pregunta",
    "me imagino",
    "debe ser",
    "veo que",
  ],
  callToAction: [
    "aprobar",
    "apruebe",
    "aprueben",
    "apruebes",
    "aprobemos",
    "decidir",
    "decidamos",
    "decisión",
    "siguiente paso",
    "próximo paso",
    "acordar",
    "acordemos",
    "comprometernos",
    "me comprometo",
    "luz verde",
    "recomiendo",
    "recomendamos",
    "mi recomendación",
    "propongo",
    "hagamos",
    "vamos a",
    "podemos",
    "podríamos",
    "te parece si",
    "estarías dispuesto",
    "estarías dispuesta",
    "para el viernes",
    "para el lunes",
    "esta semana",
    "hoy",
  ],
  structure: [
    "primero",
    "en primer lugar",
    "segundo",
    "en segundo lugar",
    "tercero",
    "por último",
    "finalmente",
    "porque",
    "por ejemplo",
    "lo que significa",
    "para que",
    "como resultado",
    "en resumen",
    "en pocas palabras",
    "en conclusión",
    "lo importante es",
    "el punto es",
    "la clave es",
    "por eso",
    "tres",
    "dos cosas",
  ],
  story: [
    "cuando",
    "el año pasado",
    "el mes pasado",
    "la semana pasada",
    "ayer",
    "imagina",
    "imagínate",
    "una vez",
    "historia",
    "resultó",
    "me di cuenta",
    "nos dimos cuenta",
    "hasta que",
    "entonces",
    "de repente",
    "fue ahí cuando",
    "en ese momento",
  ],
  stopwords: new Set(
    "el la los las un una unos unas y o u e pero si sino de del al a en con por para sin sobre entre como que se es son era eran fue fueron ser estar esta este esto estos estas ese esa eso esos esas aquel lo le les me te nos mi mis tu tus su sus nuestro nuestra yo tu el ella nosotros ellos ellas usted ustedes muy mas menos ya no ni hay tan tambien cuando donde quien cual cuales porque pues asi aqui alli algo todo toda todos todas otro otra otros otras puede pueden hacer hace tiene tienen tener he ha han hemos solo cada mucho mucha muchos muchas poco hasta desde durante".split(
      " ",
    ),
  ),
};

const COMBINING_MARKS = new RegExp("\\p{M}", "gu");

/** Lower-case and strip accents, so "Qué" and "que" compare equal. */
export function normalizeText(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(COMBINING_MARKS, "");
}

/** Spanish phrases are matched in normalised form but reported as written. */
const ES_NORMALIZED: Record<keyof Omit<Lexicon, "stopwords">, { phrase: string; norm: string }[]> = {
  hedges: ES.hedges.map((p) => ({ phrase: p, norm: normalizeText(p) })),
  apologies: ES.apologies.map((p) => ({ phrase: p, norm: normalizeText(p) })),
  fillers: ES.fillers.map((p) => ({ phrase: p, norm: normalizeText(p) })),
  empathy: ES.empathy.map((p) => ({ phrase: p, norm: normalizeText(p) })),
  callToAction: ES.callToAction.map((p) => ({ phrase: p, norm: normalizeText(p) })),
  structure: ES.structure.map((p) => ({ phrase: p, norm: normalizeText(p) })),
  story: ES.story.map((p) => ({ phrase: p, norm: normalizeText(p) })),
};

const OPEN_QUESTION = ["what", "how", "why", "tell me", "walk me through", "which"];
/** Accented interrogatives are unambiguous; unaccented ones only count right after "¿". */
const ES_OPEN_ACCENTED = /(qué|cómo|cuál|cuáles|dónde|cuándo|quién|quiénes|cuánto|cuánta|cuántos|cuántas|cuéntame|cuénteme|explícame|háblame|platícame)/;
const ES_OPEN_PLAIN = /(¿\s*(que|como|por que|cual|cuales|donde|cuando|quien|quienes|cuanto|cuanta|cuantos|cuantas)\b|\b(cuentame|cuenteme|explicame|hablame|platicame|que tal)\b)/;

function escape(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countPhrase(lower: string, p: string): number {
  const re = new RegExp(`(^|[^a-z'])${escape(p)}(?=$|[^a-z'])`, "g");
  return lower.match(re)?.length ?? 0;
}

function findAll(text: string, phrases: string[]): string[] {
  const lower = text.toLowerCase();
  const hits: string[] = [];
  for (const p of phrases) {
    const count = countPhrase(lower, p);
    for (let i = 0; i < count; i++) hits.push(p);
  }
  return hits;
}

function findAllEs(text: string, phrases: { phrase: string; norm: string }[]): string[] {
  const norm = normalizeText(text);
  const hits: string[] = [];
  for (const p of phrases) {
    const count = countPhrase(norm, p.norm);
    for (let i = 0; i < count; i++) hits.push(p.phrase);
  }
  return hits;
}

export function contentWords(text: string, locale: Locale = "en"): string[] {
  if (locale === "es") return (normalizeText(text).match(/[a-z][a-z'-]{2,}/g) ?? []).filter((w) => !ES.stopwords.has(w));
  return (text.toLowerCase().match(/[a-z][a-z'-]{2,}/g) ?? []).filter((w) => !EN.stopwords.has(w));
}

export interface TextMetrics {
  words: number;
  sentences: number;
  avgSentenceLength: number;
  questions: number;
  openQuestions: number;
  hedges: string[];
  apologies: string[];
  fillers: string[];
  empathy: string[];
  callToAction: string[];
  structure: string[];
  story: string[];
  hasNumbers: boolean;
  exclamations: number;
  firstSentenceIsQuestion: boolean;
}

function analyzeSpanish(clean: string): TextMetrics {
  const words = clean ? clean.split(/\s+/).length : 0;
  const sentenceParts = clean.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);
  const sentences = Math.max(1, sentenceParts.length);
  // "¿…?" is one question; a lone "¿" or "?" (a forgotten mark) counts too.
  const questions = (clean.match(/¿[^¿?]*\?|[¿?]/g) ?? []).length;
  const questionSentences = sentenceParts.filter((s) => s.includes("?") || s.includes("¿"));
  const openQuestions = questionSentences.filter((s) => ES_OPEN_ACCENTED.test(s.toLowerCase()) || ES_OPEN_PLAIN.test(normalizeText(s))).length;
  return {
    words,
    sentences,
    avgSentenceLength: words / sentences,
    questions,
    openQuestions,
    hedges: findAllEs(clean, ES_NORMALIZED.hedges),
    apologies: findAllEs(clean, ES_NORMALIZED.apologies),
    fillers: findAllEs(clean, ES_NORMALIZED.fillers),
    empathy: findAllEs(clean, ES_NORMALIZED.empathy),
    callToAction: findAllEs(clean, ES_NORMALIZED.callToAction),
    structure: findAllEs(clean, ES_NORMALIZED.structure),
    story: findAllEs(clean, ES_NORMALIZED.story),
    hasNumbers: /\d/.test(clean),
    exclamations: (clean.match(/!/g) ?? []).length,
    firstSentenceIsQuestion: /[?¿]/.test(sentenceParts[0] ?? ""),
  };
}

export function analyzeText(text: string, locale: Locale = "en"): TextMetrics {
  const clean = text.trim();
  if (locale === "es") return analyzeSpanish(clean);
  const words = clean ? clean.split(/\s+/).length : 0;
  const sentenceParts = clean.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);
  const sentences = Math.max(1, sentenceParts.length);
  const questions = (clean.match(/\?/g) ?? []).length;
  const questionSentences = sentenceParts.filter((s) => s.includes("?"));
  const openQuestions = questionSentences.filter((s) =>
    OPEN_QUESTION.some((q) => s.toLowerCase().includes(q)),
  ).length;
  return {
    words,
    sentences,
    avgSentenceLength: words / sentences,
    questions,
    openQuestions,
    hedges: findAll(clean, EN.hedges),
    apologies: findAll(clean, EN.apologies),
    fillers: findAll(clean, EN.fillers),
    empathy: findAll(clean, EN.empathy),
    callToAction: findAll(clean, EN.callToAction),
    structure: findAll(clean, EN.structure),
    story: findAll(clean, EN.story),
    hasNumbers: /\d/.test(clean),
    exclamations: (clean.match(/!/g) ?? []).length,
    firstSentenceIsQuestion: (sentenceParts[0] ?? "").includes("?"),
  };
}

/** Accent- and case-insensitive "does the text contain this phrase" (used for keyword checks). */
export function containsPhrase(text: string, phrase: string, locale: Locale = "en"): boolean {
  if (locale === "es") return normalizeText(text).includes(normalizeText(phrase));
  return text.toLowerCase().includes(phrase.toLowerCase());
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const uniq = <T,>(xs: T[]) => [...new Set(xs)];

/* ─────────────────────────── Copy ─────────────────────────── */

export const DIMENSION_LABELS: Record<FeedbackDimension, string> = {
  clarity: "Clarity",
  confidence: "Confidence",
  conciseness: "Conciseness",
  curiosity: "Curiosity",
  empathy: "Empathy",
  flow: "Conversational flow",
  authority: "Authority",
  structure: "Structure",
  executive_presence: "Executive presence",
  storytelling: "Storytelling",
  persuasion: "Persuasion",
};

const DIMENSION_LABELS_ES: Record<FeedbackDimension, string> = {
  clarity: "Claridad",
  confidence: "Seguridad",
  conciseness: "Concisión",
  curiosity: "Curiosidad",
  empathy: "Empatía",
  flow: "Fluidez conversacional",
  authority: "Autoridad",
  structure: "Estructura",
  executive_presence: "Presencia ejecutiva",
  storytelling: "Storytelling",
  persuasion: "Persuasión",
};

export function dimensionLabels(locale: Locale = "en"): Record<FeedbackDimension, string> {
  return locale === "es" ? DIMENSION_LABELS_ES : DIMENSION_LABELS;
}

const TIPS: Record<Locale, Record<FeedbackDimension, string>> = {
  en: {
    clarity: "Use shorter sentences — one idea each — and drop filler words.",
    confidence: "Cut hedges and apologies. State your view, then invite challenge.",
    conciseness: "Lead with the point and cut anything the listener doesn't need to act.",
    curiosity: "Ask at least one open question (what / how / why) before talking about yourself.",
    empathy: "Acknowledge the other person's point in their words before adding yours.",
    flow: "Build on what they just said — pick up one of their words or ideas.",
    authority: "Open with a clear statement, not a question, and back it with one concrete fact.",
    structure: "Give it a shape: point → reason → example → ask.",
    executive_presence: "Be brief, be specific, and own your recommendation.",
    storytelling: "Anchor it in a moment: who, when, what changed — then the lesson.",
    persuasion: "Make a specific ask and give the strongest reason for it.",
  },
  es: {
    clarity: "Usa frases más cortas —una idea por frase— y elimina las muletillas.",
    confidence: "Quita las dudas y las disculpas. Di lo que piensas y luego invita a que lo cuestionen.",
    conciseness: "Empieza por lo principal y quita todo lo que la otra persona no necesita para actuar.",
    curiosity: "Haz al menos una pregunta abierta (qué / cómo / por qué) antes de hablar de ti.",
    empathy: "Reconoce el punto de la otra persona con sus palabras antes de agregar el tuyo.",
    flow: "Construye sobre lo que acaba de decir: retoma una de sus palabras o ideas.",
    authority: "Abre con una afirmación clara, no con una pregunta, y respáldala con un dato concreto.",
    structure: "Dale forma: idea → razón → ejemplo → pedido.",
    executive_presence: "Sé breve, sé específico y hazte cargo de tu recomendación.",
    storytelling: "Ánclalo en un momento: quién, cuándo, qué cambió… y luego la lección.",
    persuasion: "Haz un pedido concreto y da la razón más fuerte para aceptarlo.",
  },
};

const STRENGTH_COPY: Record<Locale, Record<FeedbackDimension, string>> = {
  en: {
    clarity: "Easy to follow — clean, short sentences.",
    confidence: "You sound sure of yourself — no hedging.",
    conciseness: "Tight. Nothing wasted.",
    curiosity: "Good questions that invite the other person in.",
    empathy: "You acknowledged the other person well.",
    flow: "You built naturally on what they said.",
    authority: "You led with a clear position.",
    structure: "Clear structure the listener can follow.",
    executive_presence: "Brief, specific and assured — executive register.",
    storytelling: "Concrete, story-like detail that sticks.",
    persuasion: "A clear ask backed by a reason.",
  },
  es: {
    clarity: "Fácil de seguir: frases limpias y cortas.",
    confidence: "Suenas segura o seguro de ti: sin rodeos.",
    conciseness: "Preciso. Nada sobra.",
    curiosity: "Buenas preguntas que invitan a la otra persona a participar.",
    empathy: "Reconociste muy bien a la otra persona.",
    flow: "Construiste de forma natural sobre lo que dijo.",
    authority: "Abriste con una posición clara.",
    structure: "Una estructura clara que se puede seguir.",
    executive_presence: "Breve, concreto y con aplomo: registro ejecutivo.",
    storytelling: "Detalles concretos, como de historia, que se quedan en la memoria.",
    persuasion: "Un pedido claro respaldado por una razón.",
  },
};

const NOTES = {
  en: {
    longSentences: (n: number) => `Sentences average ${n} words — break them up.`,
    tooShort: "Too short to read as confident — it sounds disengaged.",
    overBudget: (words: number, budget: number) => `${words} words against a budget of ${budget}.`,
    weakPhrases: (list: string) => `Weak phrases to cut: ${list}.`,
  },
  es: {
    longSentences: (n: number) => `Tus frases tienen ${n} palabras en promedio: divídelas.`,
    tooShort: "Demasiado corto para transmitir seguridad: suena a desinterés.",
    overBudget: (words: number, budget: number) => `${words} palabras frente a un límite de ${budget}.`,
    weakPhrases: (list: string) => `Frases débiles para quitar: ${list}.`,
  },
} satisfies Record<Locale, unknown>;

/* ─────────────────────────── Scoring ─────────────────────────── */

export interface ScoringContext {
  /** Word budget for conciseness. */
  wordBudget: number;
  /** What the other person last said (for conversational flow). */
  counterpartText?: string;
}

function addressesListener(text: string, locale: Locale): number {
  if (locale === "es") return (normalizeText(text).match(/\b(tu|tus|te|ti|contigo|usted|ustedes)\b/g) ?? []).length;
  return (text.toLowerCase().match(/\byou(r|'re)?\b/g) ?? []).length;
}

function hasContrast(text: string, locale: Locale): boolean {
  return locale === "es" ? /\b(pero|sin embargo)\b/.test(normalizeText(text)) : /\bbut\b/i.test(text);
}

function hasReason(text: string, locale: Locale): boolean {
  return locale === "es" ? /\b(porque|ya que|dado que|debido a)\b/.test(normalizeText(text)) : /\bbecause\b/i.test(text);
}

export function scoreDimension(dim: FeedbackDimension, m: TextMetrics, ctx: ScoringContext, text: string, locale: Locale = "en"): DimensionScore {
  const label = dimensionLabels(locale)[dim];
  const notes = NOTES[locale];
  switch (dim) {
    case "clarity": {
      let s = 88;
      if (m.avgSentenceLength > 22) s -= (m.avgSentenceLength - 22) * 2.5;
      s -= m.fillers.length * 8;
      if (m.words < 6) s -= 35;
      return { key: dim, label, score: clamp(s), note: m.avgSentenceLength > 22 ? notes.longSentences(Math.round(m.avgSentenceLength)) : undefined };
    }
    case "confidence": {
      // A one- or two-word reply isn't confident, it's disengaged.
      if (m.words < 4) return { key: dim, label, score: 25, note: notes.tooShort };
      const s = 92 - m.hedges.length * 12 - m.apologies.length * 15 - Math.max(0, m.exclamations - 1) * 5;
      return { key: dim, label, score: clamp(Math.max(10, s)) };
    }
    case "conciseness": {
      const b = ctx.wordBudget;
      let s: number;
      if (m.words <= b) s = m.words < Math.max(6, b * 0.2) ? 55 : 92;
      else s = 92 - ((m.words - b) / b) * 90;
      return { key: dim, label, score: clamp(s), note: m.words > b ? notes.overBudget(m.words, b) : undefined };
    }
    case "curiosity": {
      const base = m.questions === 0 ? 30 : m.questions === 1 ? 72 : 85;
      return { key: dim, label, score: clamp(base + Math.min(m.openQuestions, 2) * 6) };
    }
    case "empathy": {
      const you = addressesListener(text, locale);
      return { key: dim, label, score: clamp(48 + uniq(m.empathy).length * 18 + Math.min(you, 3) * 5) };
    }
    case "flow": {
      const theirs = new Set(contentWords(ctx.counterpartText ?? "", locale));
      const overlap = uniq(contentWords(text, locale).filter((w) => theirs.has(w))).length;
      return { key: dim, label, score: clamp(45 + Math.min(overlap, 3) * 13 + (m.questions > 0 ? 12 : 0)) };
    }
    case "authority": {
      let s = 62 + Math.min(uniq(m.structure).length, 2) * 8 + (m.hasNumbers ? 8 : 0) - m.hedges.length * 12 - m.apologies.length * 14;
      if (!m.firstSentenceIsQuestion) s += 8;
      return { key: dim, label, score: clamp(s) };
    }
    case "structure": {
      return {
        key: dim,
        label,
        score: clamp(42 + Math.min(uniq(m.structure).length, 3) * 14 + (m.callToAction.length > 0 ? 14 : 0)),
      };
    }
    case "executive_presence": {
      const c = scoreDimension("confidence", m, ctx, text, locale).score;
      const a = scoreDimension("authority", m, ctx, text, locale).score;
      const k = scoreDimension("conciseness", m, ctx, text, locale).score;
      return { key: dim, label, score: clamp((c + a + k) / 3) };
    }
    case "storytelling": {
      return {
        key: dim,
        label,
        score: clamp(38 + Math.min(uniq(m.story).length, 3) * 13 + (m.hasNumbers ? 8 : 0) + (hasContrast(text, locale) ? 8 : 0)),
      };
    }
    case "persuasion": {
      return {
        key: dim,
        label,
        score: clamp(
          40 + Math.min(uniq(m.callToAction).length, 2) * 15 + (hasReason(text, locale) ? 12 : 0) + (m.hasNumbers ? 10 : 0) - m.hedges.length * 6,
        ),
      };
    }
  }
}

export function flaggedPhrases(m: TextMetrics): NonNullable<ExerciseFeedback["flagged"]> {
  return [
    ...uniq(m.hedges).map((phrase) => ({ phrase, kind: "hedge" as const })),
    ...uniq(m.apologies).map((phrase) => ({ phrase, kind: "apology" as const })),
    ...uniq(m.fillers).map((phrase) => ({ phrase, kind: "filler" as const })),
  ];
}

/** Scores text against a set of dimensions and writes specific feedback. */
export function evaluateText(
  text: string,
  dims: FeedbackDimension[],
  ctx: ScoringContext,
  locale: Locale = "en",
): Omit<ExerciseFeedback, "summary"> & { metrics: TextMetrics } {
  const m = analyzeText(text, locale);
  const dimensions = dims.map((d) => scoreDimension(d, m, ctx, text, locale));
  const score = clamp(dimensions.reduce((s, d) => s + d.score, 0) / Math.max(1, dimensions.length));
  const sorted = [...dimensions].sort((a, b) => b.score - a.score);
  const strengths = sorted.filter((d) => d.score >= 75).slice(0, 2).map((d) => STRENGTH_COPY[locale][d.key]);
  const improvements = sorted
    .filter((d) => d.score < 70)
    .reverse()
    .slice(0, 3)
    .map((d) => d.note ? `${TIPS[locale][d.key]} (${d.note})` : TIPS[locale][d.key]);

  const flagged = flaggedPhrases(m);
  if (flagged.length > 0) {
    improvements.unshift(NOTES[locale].weakPhrases(flagged.map((f) => `“${f.phrase}”`).join(", ")));
  }
  return { score, dimensions, strengths, improvements: uniq(improvements).slice(0, 3), flagged, source: "rules", metrics: m };
}

const SUMMARIES: Record<Locale, [string, string, string, string]> = {
  en: [
    "Strong. This would land well in a real conversation.",
    "Solid — a couple of adjustments and it's excellent.",
    "A good start. Focus on the fixes below.",
    "Not there yet — try again using the tips below.",
  ],
  es: [
    "Muy bien. Esto funcionaría en una conversación real.",
    "Sólido: con un par de ajustes queda excelente.",
    "Buen comienzo. Enfócate en las mejoras de abajo.",
    "Todavía no: vuelve a intentarlo con los consejos de abajo.",
  ],
};

export function summaryForScore(score: number, locale: Locale = "en"): string {
  const s = SUMMARIES[locale];
  if (score >= 85) return s[0];
  if (score >= 70) return s[1];
  if (score >= 50) return s[2];
  return s[3];
}

/** Word-level Jaccard similarity, used to spot rewrites that barely changed. */
export function similarity(a: string, b: string, locale: Locale = "en"): number {
  const A = new Set(contentWords(a, locale));
  const B = new Set(contentWords(b, locale));
  if (A.size === 0 && B.size === 0) return 1;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter++;
  return inter / (A.size + B.size - inter);
}
