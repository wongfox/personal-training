/** Spanish overlay for reference data: assessment questions, taxonomy and achievements. */
import { GOALS } from "@/lib/taxonomy";
import type { AssessmentOption } from "../../types";

export interface AssessmentQuestionTranslation {
  prompt: string;
  helpText?: string;
  options: AssessmentOption[];
}

/** Keyed by goal key (src/lib/taxonomy.ts GOALS). */
export const goalsEs: Record<string, string> = {
  communication: "Comunicación",
  confidence: "Confianza",
  leadership: "Liderazgo",
  intelligence: "Inteligencia",
  social_skills: "Habilidades sociales",
  networking: "Networking",
  personal_branding: "Marca personal",
  critical_thinking: "Pensamiento crítico",
  memory: "Memoria",
  storytelling: "Storytelling",
};

/** Keyed by skill key (src/lib/taxonomy.ts SKILLS). */
export const skillsEs: Record<string, { name: string; description: string }> = {
  communication: { name: "Comunicación", description: "Di lo que quieres decir, con claridad e intención." },
  confidence: { name: "Confianza", description: "Actúa con convicción serena, incluso bajo presión." },
  leadership: { name: "Liderazgo", description: "Haz avanzar a las personas y las decisiones." },
  intelligence: { name: "Inteligencia", description: "Piensa con claridad, decide bien y recuerda lo que importa." },
  social_skills: { name: "Habilidades sociales", description: "Lee el ambiente y conecta con las personas." },
  networking: { name: "Networking", description: "Construye relaciones que abren puertas." },
};

/** Keyed by category key (src/lib/taxonomy.ts CATEGORIES). */
export const categoriesEs: Record<string, string> = {
  communication: "Comunicación",
  executive_presence: "Presencia ejecutiva",
  storytelling: "Storytelling",
  personal_branding: "Marca personal",
  confidence: "Confianza",
  leadership: "Liderazgo",
  negotiation: "Negociación",
  critical_thinking: "Pensamiento crítico",
  memory: "Memoria",
  psychology: "Psicología",
  productivity: "Productividad",
  business: "Negocios",
  social_intelligence: "Inteligencia social",
  networking: "Networking",
};

/** Keyed by achievement key (src/server/services/rewards.ts ACHIEVEMENTS). */
export const achievementsEs: Record<string, { title: string; description: string }> = {
  first_step: { title: "Primer paso", description: "Completa tu primera lección." },
  out_in_the_world: { title: "Al mundo real", description: "Completa tu primera misión en el mundo real." },
  three_in_a_row: { title: "Tres seguidos", description: "Entrena tres días seguidos." },
  full_week: { title: "Semana completa", description: "Entrena siete días seguidos." },
  rehearsal: { title: "Ensayo", description: "Termina tu primera sesión de práctica." },
  reflective: { title: "Mirada interior", description: "Escribe cinco reflexiones." },
  ten_missions: { title: "Diez misiones", description: "Completa diez misiones en el mundo real." },
  it_sticks: { title: "Bien grabado", description: "Responde diez repasos espaciados." },
  thirty_days: { title: "Treinta días", description: "Entrena treinta días seguidos." },
};

const RATING_OPTIONS_ES: AssessmentOption[] = [
  { value: "1", label: "Casi nunca" },
  { value: "2", label: "A veces" },
  { value: "3", label: "A menudo" },
  { value: "4", label: "Normalmente" },
  { value: "5", label: "Casi siempre" },
];

const GOAL_OPTIONS_ES: AssessmentOption[] = GOALS.map((g) => ({ value: g.key, label: goalsEs[g.key] }));

/** Keyed by question key (src/server/db/seed/base.ts ASSESSMENT_QUESTIONS). Option values and order match the English. */
export const assessmentQuestionsEs: Record<string, AssessmentQuestionTranslation> = {
  goals: {
    prompt: "¿En qué quieres mejorar?",
    helpText: "Elige todas las que quieras.",
    options: GOAL_OPTIONS_ES,
  },
  primary_goal: {
    prompt: "¿Cuál es la más importante ahora?",
    helpText: "Tu plan empieza aquí. Las demás pasan a ser metas secundarias.",
    options: GOAL_OPTIONS_ES,
  },
  situations: {
    prompt: "¿Dónde quieres notar más la diferencia?",
    options: [
      { value: "work", label: "En el trabajo" },
      { value: "meetings", label: "En reuniones" },
      { value: "presentations", label: "Presentaciones" },
      { value: "networking", label: "Networking" },
      { value: "social", label: "Situaciones sociales" },
      { value: "relationships", label: "Relaciones personales" },
      { value: "public_speaking", label: "Hablar en público" },
    ],
  },
  level: {
    prompt: "¿En qué nivel te ubicarías hoy?",
    options: [
      { value: "beginner", label: "Principiante", description: "Estoy empezando desde lo básico." },
      { value: "intermediate", label: "Intermedio", description: "Conozco las ideas; quiero que se vuelvan hábito." },
      { value: "advanced", label: "Avanzado", description: "Ya tengo buen nivel; quiero llegar a lo excepcional." },
    ],
  },
  minutes: {
    prompt: "¿Cuánto tiempo puedes dedicarle en un día de entrenamiento?",
    options: [
      { value: "5", label: "5 min", description: "Un ejercicio rápido al día" },
      { value: "10", label: "10 min", description: "Lección + ejercicio" },
      { value: "15", label: "15 min", description: "La sesión completa" },
      { value: "30", label: "30 min", description: "Sesión completa + práctica" },
    ],
  },
  frequency: {
    prompt: "¿Con qué frecuencia vas a entrenar?",
    options: [
      { value: "daily", label: "Todos los días", description: "El progreso más rápido" },
      { value: "five_per_week", label: "5 días a la semana", description: "De lunes a viernes" },
      { value: "three_per_week", label: "3 días a la semana", description: "Constante y sostenible" },
    ],
  },
  challenge: {
    prompt: "¿Qué es lo que más te frena?",
    options: [
      { value: "express", label: "Sé lo que quiero decir, pero me cuesta expresarlo." },
      { value: "nerves", label: "Los nervios me ganan cuando todas las miradas están puestas en mí." },
      { value: "initiate", label: "Dudo en iniciar conversaciones con personas que no conozco." },
      { value: "ramble", label: "Me extiendo demasiado y pierdo la atención de la gente." },
      { value: "influence", label: "Me cuesta influir en las decisiones." },
      { value: "overthink", label: "Le doy demasiadas vueltas a las cosas y tardo en decidir." },
      { value: "forget", label: "Olvido nombres y detalles importantes." },
    ],
  },
  rate_communication: {
    prompt: "Expreso mis ideas con claridad, incluso cuando son complejas.",
    options: RATING_OPTIONS_ES,
  },
  rate_confidence: {
    prompt: "Mantengo la calma y la seguridad cuando todas las miradas están puestas en mí.",
    options: RATING_OPTIONS_ES,
  },
  rate_leadership: {
    prompt: "Llevo las conversaciones hacia una decisión.",
    options: RATING_OPTIONS_ES,
  },
  rate_social_skills: {
    prompt: "Leo el ambiente e inicio conversaciones con facilidad.",
    options: RATING_OPTIONS_ES,
  },
  rate_networking: {
    prompt: "Construyo y mantengo relaciones profesionales útiles.",
    options: RATING_OPTIONS_ES,
  },
  rate_intelligence: {
    prompt: "Analizo bien los problemas y tomo buenas decisiones.",
    options: RATING_OPTIONS_ES,
  },
  ninety_day_goal: {
    prompt: "¿En qué te gustaría haber mejorado dentro de 90 días?",
    helpText: "Concreta lo más que puedas. Volverás a ver esto en los días 30, 60 y 90.",
    options: [],
  },
  checkpoint_change: {
    prompt: "¿Qué sientes diferente en comparación con cuando empezaste?",
    options: [],
  },
};
