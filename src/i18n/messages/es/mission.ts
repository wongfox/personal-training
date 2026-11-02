import type { Messages } from "../en";

export const mission: Messages["mission"] = {
  metaTitle: "Registro de misión",
  topLabel: "Registro de misión",
  yourMission: "Tu misión",
  fromLesson: "De “{title}”",
  saveError: "No se pudo guardar.",
  ask: {
    title: "¿Lo hiciste?",
    yes: "Sí",
    notYet: "Todavía no",
  },
  outcome: {
    title: "¿Cómo te fue?",
    hint: "Un toque para registrarla y luego una breve reflexión.",
  },
  outcomes: {
    difficult: "Difícil",
    normal: "Normal",
    good: "Bien",
    excellent: "Excelente",
  },
  responses: {
    difficult: "Hacerlo cuando cuesta es justo lo que hace crecer la habilidad. La incomodidad es el entrenamiento.",
    normal: "Una repetición normal sigue siendo una repetición. La constancia es lo que lo convierte en instinto.",
    good: "Esa es la idea funcionando en la vida real. Fíjate en qué hizo que funcionara — y repítelo.",
    excellent: "Excelente. Quédate con lo que hiciste diferente; ese es tu nuevo punto de partida.",
  },
  reflect: {
    title: "Reflexiona un minuto",
    body: "Tu coach lee esto para ajustar lo que viene.",
    needOne: "Responde al menos una pregunta para guardar.",
    save: "Guardar reflexión",
  },
  questions: {
    whatHappened: { label: "¿Qué pasó?", placeholder: "Dónde, con quién, qué dijiste…" },
    whatWorked: { label: "¿Qué funcionó?", placeholder: "Algo que volverías a hacer." },
    whatToImprove: { label: "¿Qué podrías mejorar?", placeholder: "Una cosa que cambiarías la próxima vez." },
    whatLearned: { label: "¿Qué aprendiste?", placeholder: "Sobre la habilidad o sobre ti." },
  },
  later: {
    title: "No pasa nada.",
    body: "Sigue abierta en tu pantalla de Inicio. Elige un momento concreto para hacerla — qué reunión, con qué persona — y será mucho más probable que suceda.",
  },
  complete: {
    title: "Misión registrada.",
    body: "Aprender → practicar → aplicar → reflexionar. Ese es el ciclo completo — y acabas de cerrarlo.",
    coachNote: "Nota de tu coach",
  },
};
