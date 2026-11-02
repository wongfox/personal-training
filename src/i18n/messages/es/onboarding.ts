import type { Messages } from "../en";

export const onboarding: Messages["onboarding"] = {
  metaTitle: "Tu diagnóstico",
  intro: {
    eyebrow: "Unos tres minutos",
    greeting: "Hola, {name}.",
    title: "Armemos tu plan.",
    body: "Unas preguntas rápidas. Tus respuestas definen tus metas, tu entrenamiento diario y cómo mediremos tu progreso en los días 30, 60 y 90.",
    points: {
      goals: "Tus metas",
      rhythm: "Tu ritmo",
      baseline: "Tu punto de partida",
    },
    begin: "Comenzar",
  },
  progress: "Progreso del diagnóstico",
  stepOf: "Pregunta {current} de {total}",
  ratingEyebrow: "¿Qué tan cierto es esto hoy?",
  textPlaceholder: "p. ej., Presentar ante la dirección sin notas y obtener una decisión clara.",
  building: "Creando tu plan…",
  submit: "Crear mi plan",
};
