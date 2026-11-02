import type { PracticeTranslations } from "../translations";

const NETWORKING_OBJECTIVE =
  "Practica el recorrido completo: preséntate en una línea, haz una pregunta para abrir, profundiza en su respuesta, cierra con elegancia e intercambien datos de contacto.";

export const practiceToolsEs: PracticeTranslations = {
  /* ───────────────────── Simulador de conversación ───────────────────── */
  "practice-conversation-potential-client": {
    title: "Simulador de conversación: El cliente potencial",
    description:
      "Conoce a una clienta potencial en un evento y convierte la charla casual en un siguiente paso real, sin hacer un pitch de ventas.",
    config: {
      type: "roleplay",
      mode: "conversation",
      setting: "Un evento nocturno del sector. Estás cerca de la barra cuando alguien se voltea y se presenta.",
      counterpart: {
        name: "Laura Mendes",
        role: "Directora de Operaciones en una empresa de logística mediana",
        persona:
          "Amable pero ocupada; esta noche ya conoció a varios proveedores y se desconecta rápido ante los discursos de venta genéricos. Se abre cuando alguien le pregunta por sus desafíos reales y habla en un lenguaje sencillo. Comparte más cuando siente que la escuchan en lugar de venderle.",
      },
      objective:
        "Preséntate en una línea clara, descubre un desafío real que esté enfrentando y acuerden un siguiente paso natural, sin hacer un pitch de ventas.",
      openingLine: "Hola, mucho gusto. ¿A qué te dedicas?",
      scriptedTurns: [
        "Interesante. ¿Y con qué tipo de empresas sueles trabajar?",
        "Entiendo. La verdad, nuestro mayor dolor de cabeza ahora es lograr que los distintos equipos trabajen con los mismos números. ¿Cómo abordarías algo así?",
        "Esto me ha servido. Tengo que alcanzar a alguien antes de que se vaya. ¿Qué propondrías como siguiente paso?",
      ],
      focus: ["clarity", "curiosity", "conciseness", "persuasion"],
    },
  },
  "practice-conversation-colleague-pushback": {
    title: "Simulador de conversación: El colega escéptico",
    description:
      "Un par cuestiona tu idea en plena reunión. Mantén la calma, despierta tu curiosidad y encuentra puntos en común.",
    config: {
      type: "roleplay",
      mode: "conversation",
      setting:
        "La reunión semanal del equipo. Acabas de proponer que el reporte mensual de desempeño pase a un dashboard de autoservicio.",
      counterpart: {
        name: "Tom Becker",
        role: "Analista sénior y tu par",
        persona:
          "Agudo, escéptico y protector de los procesos que él mismo construyó. No es hostil, pero se opone con fuerza cuando percibe trabajo extra o riesgo para su equipo. Respeta a quienes reconocen sus preocupaciones antes de defender su propia idea.",
      },
      objective:
        "Reconoce su preocupación, pregunta qué hay detrás y lleva la conversación hacia una prueba pequeña que ambos puedan respaldar, sin ponerte a la defensiva.",
      openingLine:
        "No estoy tan seguro de esto. Intentamos algo parecido hace dos años y generó más preguntas que respuestas.",
      scriptedTurns: [
        "Puede ser. Pero ¿quién se encarga cuando los números del dashboard no coincidan con lo que reporta finanzas?",
        "Bueno, está más pensado de lo que esperaba. Lo que me sigue preocupando es la carga de trabajo de mi equipo durante el cambio.",
        "Si lo intentáramos, ¿cómo sería un primer paso pequeño y cómo sabríamos que está funcionando?",
      ],
      focus: ["empathy", "curiosity", "confidence", "persuasion"],
    },
  },
  "practice-conversation-ask-for-resources": {
    title: "Simulador de conversación: Pedir recursos",
    description: "Presenta a tu jefa un caso claro y bien argumentado para conseguir más personas, tiempo o presupuesto.",
    config: {
      type: "roleplay",
      mode: "conversation",
      setting:
        "Una reunión uno a uno con tu jefa. Tu proyecto se está retrasando porque el equipo está repartido entre demasiados frentes.",
      counterpart: {
        name: "Sarah Lin",
        role: "Gerente de área y tu jefa directa",
        persona:
          "Te apoya, pero tiene presión presupuestal desde arriba. Responde a disyuntivas claras y a evidencia, no a quejas. Si el pedido es vago, contraataca con preguntas puntuales sobre prioridades.",
      },
      objective:
        "Plantea con claridad el problema y su impacto, haz un pedido concreto, muestra lo que se pierde si nada cambia y acuerden un siguiente paso concreto.",
      openingLine: "Querías hablar del proyecto. ¿Qué está pasando?",
      scriptedTurns: [
        "Te entiendo. Pero este trimestre no hay mucho margen para sumar gente. ¿Qué pasa si no sumamos a nadie?",
        "Bien. Si solo pudiera darte una parte de lo que pides, ¿qué sería lo más importante?",
        "Déjame pensarlo. ¿Qué debería llevar exactamente a mi próxima reunión de presupuesto?",
      ],
      focus: ["clarity", "confidence", "structure", "persuasion", "executive_presence"],
    },
  },
  "practice-conversation-supplier-price-rise": {
    title: "Simulador de conversación: El aumento de precios del proveedor",
    description: "Un proveedor de muchos años quiere subir sus precios. Negocia sin dañar la relación.",
    config: {
      type: "roleplay",
      mode: "conversation",
      setting:
        "Una videollamada con tu proveedor de empaques. Te enviaron un correo anunciando un aumento de precios a partir del próximo trimestre.",
      counterpart: {
        name: "Javier Ortega",
        role: "Gerente de cuentas clave de tu proveedor de empaques",
        persona:
          "Cortés, experimentado y firme. Le pidieron proteger el margen, pero valora la cuenta y quiere conservarla. Cede con más facilidad en plazos, volumen o condiciones de pago que en el precio de lista.",
      },
      objective:
        "Entiende qué está detrás del aumento, no aceptes la primera cifra, explora intercambios como plazos, volumen o condiciones y termina la llamada con una propuesta concreta para revisar.",
      openingLine:
        "Gracias por darte el tiempo. Como te comenté en mi correo, nuestros costos han subido y necesitamos aumentar los precios un ocho por ciento a partir del próximo trimestre.",
      scriptedTurns: [
        "Entiendo que no es una buena noticia. Pero el aumento en nuestros costos de materiales es real, y todos los clientes están viendo un ajuste.",
        "Podría haber algo de flexibilidad, pero necesitaría algo a cambio. ¿Qué podrías ofrecer de tu lado?",
        "Déjame llevar esto a mi equipo. ¿Qué debería incluir exactamente en la propuesta para que podamos cerrarlo?",
      ],
      focus: ["confidence", "curiosity", "persuasion", "authority"],
    },
  },

  /* ───────────────────── Práctica de networking ───────────────────── */
  "practice-networking-ceo": {
    title: "Práctica de networking: Conocer a una CEO",
    description: "Tienes dos minutos con una líder de alto nivel. Ve al grano, muestra curiosidad y deja huella.",
    config: {
      type: "roleplay",
      mode: "networking",
      setting:
        "La recepción de un foro de liderazgo. La CEO de una empresa que admiras está libre por un momento entre una conversación y otra.",
      counterpart: {
        name: "Catherine Doyle",
        role: "CEO de un grupo minorista regional",
        persona:
          "Directa, con poco tiempo y cortés. Conoce a mucha gente que quiere algo de ella, así que solo se abre con quienes van al grano y muestran curiosidad genuina. Disfruta las preguntas sobre estrategia y le desagradan los halagos.",
      },
      objective: NETWORKING_OBJECTIVE,
      openingLine: "Hola, creo que no nos conocemos. Soy Catherine.",
      scriptedTurns: [
        "Mucho gusto. Cuéntame un poco más sobre lo que estás haciendo.",
        "Interesante enfoque. Nosotros estamos lidiando con algo parecido: cómo movernos más rápido sin perder el control. ¿Qué has visto que funcione?",
        "Debería seguir saludando a otras personas, pero disfruté esta conversación. ¿Cómo te gustaría que nos mantengamos en contacto?",
      ],
      focus: ["conciseness", "confidence", "curiosity", "executive_presence"],
    },
  },
  "practice-networking-supplier": {
    title: "Práctica de networking: Conocer a un proveedor",
    description: "Genera sintonía con un posible proveedor en una feria comercial y descubre si hay encaje.",
    config: {
      type: "roleplay",
      mode: "networking",
      setting:
        "Una feria comercial. Te detienes en el stand de un fabricante de componentes que tu equipo viene evaluando.",
      counterpart: {
        name: "Henrik Larsen",
        role: "Director comercial en un fabricante de componentes",
        persona:
          "Cálido, conversador y con una tendencia natural a vender. Valora a los compradores que tienen claro lo que necesitan y se vuelve más franco sobre plazos de entrega y limitaciones cuando le hacen preguntas directas y específicas.",
      },
      objective: NETWORKING_OBJECTIVE,
      openingLine: "¡Hola, qué gusto tenerte por aquí! ¿Ya conoces lo que hacemos o te doy el recorrido rápido?",
      scriptedTurns: [
        "Excelente. ¿Y qué está buscando tu equipo en este momento?",
        "Tiene sentido. Siendo honesto, los plazos de entrega están ajustados en toda la industria ahora mismo. ¿Qué sería lo más importante para ti si trabajáramos juntos?",
        "No perdamos este hilo. ¿Cuál es la mejor manera de continuar la conversación después de la feria?",
      ],
      focus: ["clarity", "curiosity", "structure"],
    },
  },
  "practice-networking-potential-client": {
    title: "Práctica de networking: Conocer a un cliente potencial",
    description: "Abre una conversación con alguien que toma decisiones y gánate un seguimiento, no un rechazo cortés.",
    config: {
      type: "roleplay",
      mode: "networking",
      setting:
        "Un desayuno del sector para líderes de operaciones en salud. Te sientas junto a alguien en una mesa compartida.",
      counterpart: {
        name: "Amira Haddad",
        role: "Jefa de Compras en un grupo hospitalario",
        persona:
          "Profesional y algo reservada; los proveedores la abordan todo el tiempo y espera un discurso de venta. Se relaja cuando la conversación gira en torno a sus prioridades y no a tu producto, y respeta a quienes no presionan.",
      },
      objective: NETWORKING_OBJECTIVE,
      openingLine: "Buenos días. ¿Está libre este asiento o le estoy quitando el lugar a alguien?",
      scriptedTurns: [
        "Gracias. ¿Y qué te trae a este desayuno?",
        "Ya veo. Por nuestro lado, el gran tema de este año es hacer más con presupuestos más ajustados. ¿Cómo ves que eso se está dando?",
        "Ya va a empezar la sesión. Si tiene sentido volver a conversar, ¿cómo nos mantenemos en contacto?",
      ],
      focus: ["empathy", "curiosity", "clarity", "persuasion"],
    },
  },
  "practice-networking-event": {
    title: "Práctica de networking: El evento de networking",
    description:
      "Acércate a alguien que no conoces en una noche de networking llena de gente y llévate una conexión genuina.",
    config: {
      type: "roleplay",
      mode: "networking",
      setting:
        "Una noche de networking en la ciudad para profesionales de tecnología y negocios. Alguien está de pie, a solas, cerca de la ventana.",
      counterpart: {
        name: "Chris Novak",
        role: "Product Manager en una startup fintech",
        persona:
          "Amable pero algo reservado; vino solo y siente alivio cuando otra persona inicia la conversación. Se abre rápido cuando le preguntan por su trabajo y disfruta intercambiar ideas.",
      },
      objective: NETWORKING_OBJECTIVE,
      openingLine: "Ah, hola. Sí, la verdad es que soy algo nuevo en este tipo de eventos.",
      scriptedTurns: [
        "Mucho gusto. ¿Y a qué te dedicas?",
        "Suena interesante. He estado tratando de ver cómo ampliar mi red más allá del mundo de producto. ¿Qué te ha servido a ti?",
        "La verdad, disfruté mucho esta conversación. ¿Intercambiamos datos antes de que la gente nos separe?",
      ],
      focus: ["confidence", "curiosity", "flow"],
    },
  },
  "practice-networking-business-dinner": {
    title: "Práctica de networking: La cena de negocios",
    description:
      "Construye una relación durante la cena con la persona sentada a tu lado, equilibrando calidez y negocios.",
    config: {
      type: "roleplay",
      mode: "networking",
      setting: "Una cena de negocios organizada por una empresa socia. Te sientan junto a alguien que no conoces.",
      counterpart: {
        name: "Mónica Ruiz",
        role: "Directora de Finanzas de la empresa socia",
        persona:
          "Serena y observadora, con un humor seco. En la cena prefiere una conversación relajada antes que hablar de trabajo, pero aprecia el pensamiento de negocio agudo cuando surge de forma natural. Se fija en si la gente escucha o solo espera su turno para hablar.",
      },
      objective: NETWORKING_OBJECTIVE,
      openingLine: "Parece que somos vecinos de mesa esta noche. Soy Mónica. ¿De dónde conoces a los anfitriones?",
      scriptedTurns: [
        "Ah, ya veo. ¿Y fuera del trabajo, en qué inviertes tu tiempo?",
        "Qué bonito. Siento que estas cenas son el único momento en que de verdad me entero de en qué están trabajando otros equipos. ¿Qué es lo más importante que tienes entre manos ahora?",
        "Ha sido un placer. Me encantaría seguir con esta conversación. ¿Cuál es la forma más fácil de contactarte?",
      ],
      focus: ["empathy", "flow", "curiosity", "executive_presence"],
    },
  },
  "practice-networking-conference-coffee": {
    title: "Práctica de networking: El coffee break de la conferencia",
    description: "Acércate a un ponente durante una pausa de diez minutos y aprovecha al máximo un tiempo corto.",
    config: {
      type: "roleplay",
      mode: "networking",
      setting:
        "El coffee break de una conferencia, justo después de una sesión que disfrutaste. El ponente está en la estación de café.",
      counterpart: {
        name: "Ben Okafor",
        role: "Jefe de Datos en una aseguradora y ponente del día",
        persona:
          "Accesible y todavía con energía después de su charla. Disfruta mucho más las preguntas específicas sobre su contenido que los elogios generales. Tiene poco tiempo antes de la siguiente sesión y, con cortesía, mantendrá la conversación en movimiento.",
      },
      objective: NETWORKING_OBJECTIVE,
      openingLine: "Hola. ¿Estuviste en la sesión o solo viniste por el café?",
      scriptedTurns: [
        "Gracias, muy amable. ¿Qué relación tienes con el tema?",
        "Buen punto. La verdad, lo más difícil para nosotros fue lograr que la gente confiara en los datos. ¿Te ha pasado algo parecido?",
        "Ya va a empezar la siguiente sesión. Mantengámonos en contacto. ¿Cuál es la mejor forma de ubicarte?",
      ],
      focus: ["conciseness", "curiosity", "confidence"],
    },
  },

  /* ───────────────────── Entrenador de presentaciones ───────────────────── */
  "practice-presentation-trainer": {
    title: "Entrenador de presentaciones",
    description:
      "Elige audiencia, objetivo y tiempo; luego construye la apertura de tu presentación y recibe feedback.",
    config: {
      type: "pitch",
      briefing:
        "Elige a quién le hablas, qué necesitas de esa audiencia y cuánto tiempo tienes. Luego escribe, o di en voz alta y transcribe, la apertura de tu presentación: los primeros 30 a 60 segundos. Plantea tu idea principal desde el inicio, deja claro por qué le importa a esta audiencia y di qué le vas a pedir. Recibirás feedback sobre claridad, estructura y presencia.",
      audiences: ["Comité ejecutivo", "Tu equipo", "Un cliente potencial", "Inversionistas", "El público de una conferencia"],
      objectives: ["Obtener aprobación", "Informar y alinear", "Persuadir a la acción", "Conseguir presupuesto"],
      durations: [1, 3, 5],
      suggestedTopics: [
        "Estrategia de comercio digital",
        "Por qué deberíamos reemplazar nuestra herramienta de reportes",
        "Resultados del trimestre y prioridades para el siguiente",
        "Una propuesta para probar un sprint de proyecto de cuatro días",
        "La expansión a un nuevo mercado regional",
      ],
    },
  },

  /* ───────────────────── Organizador de ideas ───────────────────── */
  "practice-organizer-scr": {
    title: "Organizador de ideas: Situación, Complicación, Resolución",
    description:
      "Estructura una recomendación como lo hacen los consultores, para que quien te lee la entienda en segundos.",
    config: {
      type: "structure",
      framework: "Situación, Complicación, Resolución (Minto)",
      instruction:
        "Elige una recomendación que necesites hacer. Completa cada bloque de forma breve. Juntos deben leerse como un solo argumento, corto y persuasivo.",
      context: "Tema de ejemplo: tu equipo necesita aprobación para reemplazar una herramienta de planificación desactualizada.",
      slots: [
        {
          key: "situation",
          label: "Situación",
          hint: "El contexto estable con el que tu audiencia ya está de acuerdo.",
          maxWords: 35,
        },
        {
          key: "complication",
          label: "Complicación",
          hint: "Qué cambió o salió mal, y por qué ahora hay que actuar.",
          maxWords: 35,
        },
        {
          key: "resolution",
          label: "Resolución",
          hint: "Tu recomendación, dicha sin rodeos, y el primer paso.",
          maxWords: 40,
        },
      ],
    },
  },
  "practice-organizer-prep": {
    title: "Organizador de ideas: PREP",
    description: "Responde cualquier pregunta con una idea clara, una razón, un ejemplo y un cierre firme.",
    config: {
      type: "structure",
      framework: "PREP: Punto, Razón, Ejemplo, Punto",
      instruction:
        "Usa PREP para responder una pregunta que podrían hacerte en una reunión. Mantén cada bloque corto; la fuerza está en el orden.",
      context: "Pregunta de ejemplo: “¿Deberíamos mantener la reunión semanal de avance?”",
      slots: [
        { key: "point", label: "Punto", hint: "Tu respuesta en una oración.", maxWords: 20 },
        { key: "reason", label: "Razón", hint: "La razón principal por la que lo crees.", maxWords: 30 },
        { key: "example", label: "Ejemplo", hint: "Un caso, dato o historia concreta que lo demuestre.", maxWords: 40 },
        {
          key: "point_again",
          label: "Punto (de nuevo)",
          hint: "Repite tu respuesta, idealmente con un siguiente paso.",
          maxWords: 20,
        },
      ],
    },
  },

  /* ───────────────────── Constructor de historias ───────────────────── */
  "practice-story-builder": {
    title: "Constructor de historias",
    description:
      "Convierte una experiencia real de trabajo en una historia breve, con un arco claro y una lección que la gente recuerde.",
    config: {
      type: "structure",
      framework: "Contexto, Desafío, Punto de giro, Lección",
      instruction:
        "Elige un momento real de tu trabajo: un proyecto, un error, una conversación difícil. Conviértelo en una historia que puedas contar en menos de dos minutos.",
      context:
        "Las buenas historias para entrevistas, presentaciones y charlas con el equipo son específicas, breves y terminan con algo útil.",
      slots: [
        {
          key: "context",
          label: "Contexto",
          hint: "Dónde y cuándo. Lo justo para que quien escucha pueda imaginarlo.",
          maxWords: 35,
        },
        { key: "challenge", label: "Desafío", hint: "Qué estaba en juego y qué lo hacía difícil.", maxWords: 40 },
        {
          key: "turning_point",
          label: "Punto de giro",
          hint: "La decisión, la acción o el descubrimiento que cambió las cosas.",
          maxWords: 40,
        },
        { key: "lesson", label: "Lección", hint: "Qué puedes llevarte tú, o quien te escucha.", maxWords: 30 },
      ],
    },
  },

  /* ───────────────────── Marco de decisión ───────────────────── */
  "practice-decision-internal-move": {
    title: "Marco de decisión: El movimiento interno",
    description: "Sopesa un traslado interno tentador frente a quedarte donde te valoran.",
    config: {
      type: "decision",
      instruction:
        "Enumera tus opciones, elige los criterios que más te importan, asígnales un peso y puntúa cada opción. Luego anota qué te haría cambiar de opinión.",
      prompt:
        "Te ofrecieron un puesto en otra área: mayor alcance y más visibilidad, un nuevo jefe al que no conoces y el mismo sueldo. Tu equipo actual está a mitad de un proyecto y depende de ti.",
      suggestedCriteria: [
        "Aprendizaje y crecimiento",
        "Dirección de carrera a largo plazo",
        "Relación con el jefe",
        "Impacto en tu equipo actual",
        "Carga de trabajo y bienestar",
        "Visibilidad ante la alta dirección",
      ],
    },
  },
  "practice-decision-build-or-buy": {
    title: "Marco de decisión: Desarrollar o comprar",
    description: "Decide si tu equipo debería desarrollar una herramienta interna o comprar un producto listo para usar.",
    config: {
      type: "decision",
      instruction:
        "Define las opciones, elige y pondera tus criterios y luego puntúa cada opción. Termina nombrando el mayor riesgo de la opción que prefieres.",
      prompt:
        "Tu equipo necesita una mejor forma de hacer seguimiento al onboarding de clientes. Ingeniería dice que podría desarrollar una herramienta en unos meses; un proveedor ofrece un producto listo, con licencia anual y algunos límites de personalización.",
      suggestedCriteria: [
        "Costo total a tres años",
        "Tiempo hasta generar valor",
        "Encaje con los procesos actuales",
        "Carga de mantenimiento",
        "Flexibilidad para cambiar más adelante",
        "Riesgo del proveedor o de la entrega",
      ],
    },
  },

  /* ───────────────────── Entrenador de memoria ───────────────────── */
  "practice-memory-event-names": {
    title: "Entrenador de memoria: Nombres en un evento",
    description: "Recuerda los nombres y los detalles de seis personas que conociste en un evento.",
    config: {
      type: "recall",
      instruction:
        "Conociste a estas seis personas en la recepción de una conferencia. Estudia la lista y luego recuerda cada nombre con su detalle.",
      items: [
        "Elena: dirige el equipo de devoluciones de una tienda de moda",
        "Marcus: exprofesor, ahora trabaja en aprendizaje y desarrollo",
        "Yuki: trabaja en ingeniería de datos y toca en una banda de jazz",
        "Omar: fundador de una startup de delivery de comida",
        "Grace: líder de compras, se muda a Singapur",
        "Pablo: gerente de ventas, hincha del mismo equipo de fútbol que tú",
      ],
      studySeconds: 60,
      technique:
        "Asocia cada nombre con una imagen vívida de su detalle. Imagina a Elena rodeada de paquetes devueltos, a Yuki tocando saxofón sobre una base de datos, a Grace subiendo a un avión.",
    },
  },
  "practice-memory-briefing": {
    title: "Entrenador de memoria: El briefing",
    description: "Retén las cifras y los puntos clave de un briefing para poder hablar sin notas.",
    config: {
      type: "recall",
      instruction:
        "Estás por presentarle a tu director una revisión trimestral (ficticia). Estudia los puntos clave y luego recuérdalos en orden.",
      items: [
        "Ingresos: 4% por encima del plan",
        "Participación online: sube al 31% de las ventas",
        "Riesgo principal: retrasos de proveedores en la región norte",
        "Reclamos de clientes: bajan por segundo trimestre consecutivo",
        "Contrataciones: dos de cinco puestos cubiertos",
        "Decisión pendiente: aprobar el nuevo contrato de alquiler del almacén antes del viernes",
      ],
      studySeconds: 60,
      technique:
        "Agrupa los puntos en tres pares (desempeño, riesgos y personas, decisión) y recórrelos por una ruta que conozcas bien, como tu trayecto de cada mañana, dejando un par en cada parada.",
    },
  },

  /* ───────────────────── Herramientas de reescritura ───────────────────── */
  "practice-hedge-hunter-follow-up": {
    title: "Cazador de muletillas: El seguimiento nervioso",
    description: "Quita las disculpas y los rodeos de un mensaje de seguimiento para que reciba respuesta.",
    config: {
      type: "rewrite",
      instruction: "Reescribe este mensaje para que sea directo, cordial y claro sobre qué necesitas y para cuándo.",
      original:
        "Perdón por molestarte otra vez, solo quería saber si quizás tuviste oportunidad de revisar la propuesta. ¡No te preocupes si no, sé que estás súper ocupado!",
      tips: [
        "Elimina “perdón”, “solo”, “quizás” y “no te preocupes”.",
        "Plantea el pedido y un plazo.",
        "Explica por qué importa ese plazo.",
      ],
      maxWords: 30,
      keywords: ["antes del", "necesito", "podrías", "por favor", "para el"],
      modelAnswer:
        "¿Podrías revisar la propuesta antes del jueves? Necesito tu aprobación para confirmar el pedido al proveedor el viernes.",
    },
  },
  "practice-hedge-hunter-recommendation": {
    title: "Cazador de muletillas: La recomendación tímida",
    description: "Convierte una sugerencia tentativa en una recomendación clara, con una razón.",
    config: {
      type: "rewrite",
      instruction: "Reescríbelo como una recomendación segura: primero la decisión, luego la razón.",
      original:
        "Creo que tal vez podríamos considerar mover un poco el lanzamiento, ¿si les parece bien a todos? Es solo una idea, no estoy seguro.",
      tips: [
        "Empieza con “Recomiendo” o “Deberíamos”.",
        "Especifica qué cambia.",
        "Agrega una razón que sostenga la propuesta.",
      ],
      maxWords: 30,
      keywords: ["recomiendo", "deberíamos", "propongo"],
      modelAnswer:
        "Recomiendo mover el lanzamiento dos semanas para corregir el error en los pagos. Lanzar con ese error pone en riesgo la confianza de los clientes.",
    },
  },
  "practice-bottom-line-up-front": {
    title: "Resumen ejecutivo: La conclusión primero",
    description:
      "Reescribe una actualización enredada para que un ejecutivo con poco tiempo capte la idea en la primera línea.",
    config: {
      type: "rewrite",
      instruction:
        "Reescribe esta actualización para un líder de alto nivel. Pon la conclusión primero y luego la causa, el impacto y lo que necesitas de esa persona.",
      original:
        "Hola, como sabes, venimos trabajando con el proveedor de empaques desde hace unos meses y ha habido varias idas y vueltas sobre el nuevo diseño. La semana pasada nos dijeron que podría haber algunos problemas de su lado con los materiales y, después de varias llamadas, parece que la entrega se va a retrasar, probablemente una semana, lo que significa que quizás haya que mover la fecha de lanzamiento. No creemos que haya impacto en el presupuesto. Dime qué crees que deberíamos hacer con los socios minoristas.",
      tips: [
        "Abre con la conclusión: qué está pasando.",
        "Da la causa en una oración corta.",
        "Cierra con la decisión o la acción concreta que necesitas.",
      ],
      maxWords: 45,
      keywords: ["conclusión", "en resumen", "aprobación", "necesito tu", "decisión"],
      modelAnswer:
        "Conclusión: el lanzamiento se retrasará una semana por una demora del proveedor en los materiales. No hay impacto en el presupuesto. Necesito tu aprobación para informar hoy a nuestros socios minoristas.",
    },
  },
  "practice-ask-better-questions": {
    title: "Haz mejores preguntas",
    description: "Convierte preguntas cerradas y sin salida en preguntas abiertas que hagan hablar a la gente.",
    config: {
      type: "rewrite",
      instruction:
        "Un colega acaba de volver de un congreso de su sector de tres días. Reescribe esta pregunta cerrada como una pregunta abierta que invite a una respuesta real.",
      original: "Entonces, ¿te fue bien en el congreso?",
      tips: [
        "Empieza con “qué” o “cómo”.",
        "Pregunta por algo específico: una idea, una persona, una sorpresa.",
        "Haz que sea fácil responder con una historia breve.",
      ],
      maxWords: 20,
      requireQuestion: true,
      keywords: ["qué", "cómo", "cuál", "cuéntame"],
      modelAnswer: "¿Cuál fue la idea del congreso que crees que realmente vas a aplicar?",
    },
  },
};
