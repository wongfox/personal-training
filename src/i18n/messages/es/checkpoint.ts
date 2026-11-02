import type { Messages } from "../en";

export const checkpoint: Messages["checkpoint"] = {
  metaTitle: "Punto de control",
  notYetTitle: "El día {day} aún no llega.",
  notYetBody: "Sigue entrenando — se abre cuando completes {day} días de tu plan.",
  topLabel: "Punto de control del día {day}",
  day: "Día {day}",
  title: "Antes → Ahora",
  goal: "Tu meta a 90 días",
  measured: "Habilidad medida",
  totals: {
    daysTrained: "Días entrenados",
    lessons: "Lecciones",
    missions: "Misiones",
    exercises: "Ejercicios",
    reflections: "Reflexiones",
    bestStreak: "Mejor racha",
  },
  selfRating: "Cómo te calificas",
  outOfFive: "/ 5",
  form: {
    title: "¿Qué tan cierto es esto hoy?",
    submit: "Ver antes → ahora",
  },
  errors: {
    unknown: "Punto de control desconocido.",
    invalid: "Respuestas no válidas.",
    noPlan: "No hay un plan activo.",
  },
};
