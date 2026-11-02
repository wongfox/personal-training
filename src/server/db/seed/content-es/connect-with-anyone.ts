import type { JourneyTranslation } from "../translations";

export const connectWithAnyoneEs: JourneyTranslation = {
  title: "Conecta con cualquier persona",
  subtitle: "Inicia conversaciones, haz que te recuerden y construye relaciones reales",
  description:
    "Un recorrido práctico por los momentos que construyen una red de contactos: acercarte a alguien nuevo, mantener viva una conversación, lograr que te recuerden por las razones correctas y convertir un solo encuentro en una conexión duradera.",
  modules: [
    {
      title: "Abre la puerta",
      description: "Da el primer paso y mantén la conversación centrada en la otra persona.",
    },
    {
      title: "Que te recuerden por las razones correctas",
      description: "Nombres, señales y una presentación de una línea que la gente repite.",
    },
    {
      title: "Convierte momentos en relaciones",
      description: "Cierra bien, haz un buen seguimiento y mantén viva tu red dando primero.",
    },
  ],
  lessons: {
    /* ───────────────────────── Módulo 1 ───────────────────────── */
    "connect-enter-a-conversation": {
      title: "Cómo entrar en una conversación",
      description:
        "Usa la regla de los 3 segundos para acercarte a las personas antes de que pensarlo demasiado te convenza de no hacerlo.",
      content: {
        hook: "Cuanto más tiempo pasas al borde del salón decidiendo si acercarte a alguien, más razones encuentras para no hacerlo.",
        whyItMatters:
          "La mayoría de las oportunidades profesionales llegan a través de personas, y a las personas se las conoce una conversación a la vez. Si iniciar una conversación te resulta costoso, inicias menos, y tu red termina moldeada por quien casualmente se acerca a ti. Dar el primer paso es una habilidad que se aprende y se puede repetir.",
        coreConcept: {
          title: "La regla de los 3 segundos",
          body: [
            "La regla de los 3 segundos es simple: cuando notas a alguien con quien te gustaría hablar, acércate en pocos segundos, antes de que tu mente tenga tiempo de armar argumentos en contra. La duda no es neutral. Cada segundo que pasas deliberando le da más material a la inseguridad.",
            "No necesitas una frase ingeniosa para empezar. El contexto compartido hace el trabajo: el evento, el lugar, la charla que ambos acaban de escuchar, la fila del café. Una observación breve más una pregunta fácil bastan para comenzar.",
            "Elige puertas abiertas. Dos personas frente a frente y muy cerca están en plena conversación. Alguien que está solo, o un grupo con un espacio visible en su círculo, está abierto a compañía. Únete con contacto visual y una frase breve, y escucha antes de aportar.",
          ],
          keyPoints: [
            "Muévete en pocos segundos, antes de que pensarlo demasiado te convenza de no hacerlo.",
            "Usa el contexto compartido para abrir; no hace falta una frase ingeniosa.",
            "Acércate a personas que están solas o a grupos abiertos.",
            "Empieza con una pregunta fácil y luego escucha.",
          ],
        },
        expertInsight: {
          text: "La investigación sobre el “efecto foco” encontró que las personas sobrestiman sistemáticamente cuánto notan y juzgan los demás sus acciones. La incomodidad que temes al acercarte a alguien es mucho más visible para ti que para la otra persona.",
          source: "Thomas Gilovich, Victoria Medvec y Kenneth Savitsky",
          sourceDetail: "Investigación sobre el efecto foco, Journal of Personality and Social Psychology (2000)",
        },
        example: {
          situation:
            "En un desayuno del sector, Priya nota a alguien que está solo junto a la ventana, revisando su celular.",
          before:
            "Se dice que irá después de un café más. Para entonces, esa persona ya se unió a un grupo, y Priya pasa el evento hablando con colegas que ya conoce.",
          after:
            "Se acerca de inmediato: “¿Te molesta si me uno? Soy Priya, es mi primera vez en este evento. ¿Qué te trajo por aquí?”. Diez minutos después ya intercambiaron datos de contacto.",
          whyItWorks:
            "Actuó antes de que la duda creciera, usó el contexto compartido para abrir y le dio a la otra persona una pregunta fácil de responder.",
        },
        reflectionPrompt:
          "Piensa en la última vez que te contuviste de acercarte a alguien. ¿Qué historia te contaste en esos pocos segundos?",
      },
      exercise: {
        title: "Aprovecha el momento",
        description: "Elige la jugada que aplica bien la regla de los 3 segundos.",
        config: {
          type: "choice",
          scenario:
            "Estás en el coffee break de una conferencia. Un ponente cuya sesión disfrutaste está solo junto a la estación de café. Llevas un momento dando vueltas cerca.",
          question: "¿Qué haces?",
          options: [
            {
              text: "Esperar a que se vea menos ocupado y luego decidir si te acercas.",
              quality: "weak",
              feedback:
                "“Esperar a que se vea menos ocupado” es justamente cómo se cierra la oportunidad. La demora alimenta la duda.",
            },
            {
              text: "Pasar unos minutos preparando una pregunta aguda sobre su investigación y luego acercarte.",
              quality: "ok",
              feedback:
                "Prepararte no está mal, pero una preparación larga invita a la demora. Lo más probable es que alguien más llegue primero.",
            },
            {
              text: "Acercarte ahora: “Disfruté mucho tu sesión. Lo que dijiste sobre el onboarding se me quedó grabado. ¿Cómo ha sido la reacción?”",
              quality: "best",
              feedback: "Te moviste en segundos, usaste el contexto compartido y le diste una pregunta abierta y fácil.",
            },
            {
              text: "Dejarlo pasar y enviarle después una solicitud de conexión en línea.",
              quality: "weak",
              feedback: "Una solicitud sin conversación es fácil de ignorar. El momento en vivo vale mucho más.",
            },
          ],
        },
      },
      quiz: [
        {
          prompt: "¿Cuál es la idea central de la regla de los 3 segundos?",
          options: [
            "Que tu frase de apertura dure menos de tres segundos",
            "Acercarte en pocos segundos, antes de que pensarlo demasiado te convenza de no hacerlo",
            "Mantener el contacto visual tres segundos antes de hablar",
            "Retirarte de cualquier conversación que se estanque tres segundos",
          ],
          explanation:
            "La regla consiste en actuar rápido ante el impulso de acercarte, para que la duda no tenga tiempo de convertirse en evitación.",
        },
        {
          prompt: "En un evento, ¿a cuál de estos es más fácil unirse?",
          options: [
            "Dos personas de pie, muy cerca y frente a frente",
            "Una pareja inmersa en una conversación que parece seria",
            "Un grupo de tres con un espacio visible en su círculo",
            "Personas sentadas a mitad de una comida",
          ],
          explanation: "Un círculo abierto indica que el grupo está receptivo a que alguien nuevo se una.",
        },
        {
          prompt: "¿Qué funciona mejor para abrir una conversación con un desconocido en un evento?",
          options: [
            "Una observación sobre el contexto que comparten, seguida de una pregunta",
            "Un chiste preparado para romper el hielo",
            "Tu cargo y el nombre de tu empresa",
            "Un resumen detallado de lo que estás haciendo",
          ],
          explanation:
            "El contexto compartido les da a ambos algo fácil de qué hablar, y una pregunta le cede la palabra a la otra persona.",
        },
      ],
      action: {
        title: "Inicia una conversación nueva",
        description:
          "Inicia una conversación con alguien con quien normalmente no hablas. Cuando notes el momento, muévete en pocos segundos y abre con algo sobre el contexto que comparten.",
        successCriteria:
          "Iniciaste tú la conversación, a pocos segundos de notar la oportunidad, e hiciste al menos una pregunta.",
      },
    },
    "connect-be-interested": {
      title: "Interésate, no intentes ser interesante",
      description: "Mantén el foco en la otra persona y te recordará con calidez.",
      content: {
        hook: "Las personas que nos resultan más cautivadoras rara vez son las que tienen las mejores historias. Son las que nos hicieron sentir dignos de ser escuchados.",
        whyItMatters:
          "En el networking, en las reuniones con clientes y en la vida de equipo, la gente te juzga en gran medida por cómo se sintió la conversación. Si la dedicas a impresionar, aprendes poco y dejas una impresión débil. Si conviertes a la otra persona en el tema, descubres lo que le importa y te vuelves alguien con quien quiere volver a hablar.",
        coreConcept: {
          title: "Respuestas de apoyo antes que respuestas de desvío",
          body: [
            "Cuando alguien comparte algo, tienes dos opciones. Una respuesta de desvío lleva el tema hacia ti: “Ah, yo también fui ahí”. Una respuesta de apoyo lo mantiene en la otra persona: “¿Qué fue lo mejor?”.",
            "Las respuestas de desvío se sienten naturales porque buscamos puntos en común. Pero una serie de ellas convierte, sin que lo notes, la conversación en una competencia por el protagonismo. La otra persona deja de compartir y empieza a esperar su turno.",
            "Mostrar interés no significa esconderte. Comparte cuando te pregunten, y hazlo de forma breve. Tu movimiento por defecto, sobre todo al principio, es quedarte con su tema uno o dos turnos más antes de traer el tuyo.",
          ],
          keyPoints: [
            "Las respuestas de desvío se llevan el tema; las de apoyo lo dejan con la otra persona.",
            "Quédate con su tema un par de turnos antes de compartir el tuyo.",
            "La curiosidad te hace memorable con más seguridad que el ingenio.",
          ],
        },
        expertInsight: {
          text: "El sociólogo Charles Derber describió el “narcisismo conversacional”: el hábito de llevar las conversaciones de vuelta hacia uno mismo mediante respuestas de desvío. Lo contrastó con las respuestas de apoyo, que mantienen la atención en quien habla.",
          source: "Charles Derber",
          sourceDetail: "The Pursuit of Attention (1979)",
        },
        example: {
          situation: "Durante el almuerzo, un colega nuevo comenta que acaba de empezar a practicar remo.",
          before:
            "“¡Qué bien! Yo hice remo en la universidad. Entrenábamos a las seis de la mañana todos los días, era brutal…”. Cinco minutos después, la conversación gira completamente en torno a ti.",
          after:
            "“Remo, buenísimo. ¿Qué te llevó a empezar?”. Te cuenta que lo ayuda a sobrellevar una mudanza estresante, y descubres algo real sobre él.",
          whyItWorks:
            "Una sola pregunta de apoyo abrió una puerta que una respuesta de desvío habría cerrado. Ahora sabes qué le importa en este momento.",
        },
        reflectionPrompt:
          "En tus últimas conversaciones, ¿te desviaste o apoyaste más? ¿Qué te costó o qué ganaste con eso?",
      },
      exercise: {
        title: "Devuelve el foco",
        description: "Reescribe una respuesta de desvío como una respuesta de apoyo.",
        config: {
          type: "rewrite",
          instruction:
            "Una colega dice que acaba de volver de una semana en Lisboa. Reescribe la respuesta de abajo para que mantenga el foco en ella y termine con una pregunta.",
          original:
            "Ah, yo también fui a Lisboa el año pasado. Recorrimos toda la costa, fue increíble. La próxima vez tienes que ver Sintra.",
          tips: [
            "Quita la parte sobre tu propio viaje.",
            "Pregunta por su experiencia, no por la ciudad en general.",
            "Basta con una frase cálida más una pregunta abierta.",
          ],
          maxWords: 25,
          requireQuestion: true,
          keywords: ["te ", "tu ", "tú", "para ti", "elegiste"],
          modelAnswer: "¡Bienvenida! ¿Qué fue lo mejor del viaje para ti y qué te hizo elegir Lisboa?",
        },
      },
      quiz: [
        {
          prompt: "¿Qué respuesta es una respuesta de apoyo a “Acabo de empezar a aprender italiano”?",
          options: [
            "“Yo estudié italiano durante años, es complicado”.",
            "“La verdad, prefiero el francés”.",
            "“Mi pareja es italiana, de hecho”.",
            "“¿Qué te hizo elegir el italiano?”",
          ],
          explanation: "Una respuesta de apoyo mantiene el foco en la experiencia de quien habla, no en la tuya.",
        },
        {
          prompt: "¿Cuál es el principal riesgo de una serie de respuestas de desvío?",
          options: [
            "La conversación se vuelve una competencia por el protagonismo y la otra persona deja de compartir",
            "Pareces demasiado curioso",
            "Te quedas sin cosas que decir",
          ],
          explanation:
            "Cada desvío se lleva el tema. Repetido, le dice a la otra persona que su historia no es lo importante.",
        },
        {
          prompt: "Interesarte en lugar de intentar ser interesante significa...",
          options: [
            "No compartir nunca nada sobre ti",
            "Quedarte por defecto con su tema durante algunos turnos y compartir brevemente cuando encaje",
            "Hacer tantas preguntas como sea posible, lo más rápido posible",
            "Estar de acuerdo con todo lo que dice",
          ],
          explanation:
            "Se trata de adónde va tu atención por defecto, no de esconderte ni de interrogar a la otra persona.",
        },
      ],
      action: {
        title: "Cero desvíos durante cinco minutos",
        description:
          "En tus próximas tres conversaciones de hoy, no hagas ninguna respuesta de desvío durante los primeros cinco minutos. Pregunta, sigue su hilo y escucha.",
        successCriteria:
          "En al menos dos de las tres conversaciones mantuviste el foco en la otra persona durante los primeros cinco minutos y aprendiste algo nuevo sobre ella.",
      },
    },
    "connect-follow-up-questions": {
      title: "Haz la segunda pregunta",
      description:
        "Las preguntas de seguimiento demuestran que escuchaste y convierten la charla trivial en una conversación real.",
      content: {
        hook: "Cualquiera puede hacer la primera pregunta. En la segunda es donde la gente decide si de verdad estabas escuchando.",
        whyItMatters:
          "La mayoría de las conversaciones se quedan en la superficie porque cada pregunta salta a un tema nuevo. Las preguntas de seguimiento dan profundidad, te ayudan a entender lo que de verdad le importa a alguien y lo dejan sintiéndose escuchado. En las reuniones, además, sacan a la luz el problema real detrás de una afirmación vaga.",
        coreConcept: {
          title: "Construye sobre lo que acaban de decir",
          body: [
            "Una pregunta de seguimiento usa el material que la otra persona te acaba de dar. Puede retomar una palabra que enfatizó, preguntar qué hay detrás de una decisión o invitarla a ampliar: “¿Y cómo te fue?”.",
            "Una técnica simple es el espejo: repetir como pregunta las últimas palabras con significado. “Ha sido un trimestre agitado”. “¿Agitado?”. Parece algo ligero, pero lleva de forma confiable a que la gente diga más.",
            "Evita el cambio de tema: “Qué bien. Oye, ¿tienes vacaciones planeadas?”. Eso indica que estabas esperando tu turno, no escuchando. Quédate en el hilo al menos una vez antes de cambiar de dirección.",
          ],
          keyPoints: [
            "Usa algo que acaban de decir como materia prima para tu siguiente pregunta.",
            "Repite como espejo una o dos palabras clave para invitar a continuar.",
            "Pregunta “qué” y “cómo” en lugar de hacer preguntas de sí o no.",
            "Quédate en el hilo al menos una vez antes de cambiar de tema.",
          ],
        },
        expertInsight: {
          text: "Una investigación dirigida por Karen Huang en Harvard encontró que las personas que hacían más preguntas, en particular preguntas de seguimiento, les caían mejor a sus interlocutores. Las preguntas de seguimiento indican que estás escuchando y que te importa la respuesta.",
          source: "Karen Huang y colegas, Harvard Business School",
          sourceDetail: "“It Doesn't Hurt to Ask: Question-Asking Increases Liking” (2017)",
        },
        example: {
          situation: "En una reunión, el cliente dice: “Hemos estado replanteando cómo manejamos el onboarding”.",
          before:
            "“Perfecto. ¿Revisamos la propuesta?”. El comentario se pierde, junto con lo que quizá era la verdadera prioridad.",
          after:
            "“¿Replanteándolo en qué sentido? ¿Qué no está funcionando hoy?”. El cliente explica que los nuevos empleados tardan meses en ser productivos, lo que cambia toda la propuesta.",
          whyItWorks: "Una sola pregunta de seguimiento descubrió el problema real detrás de un comentario al pasar.",
        },
        reflectionPrompt:
          "¿Cuándo una pregunta de seguimiento que alguien te hizo te hizo sentir realmente escuchado? ¿Qué hizo que funcionara?",
      },
      exercise: {
        title: "Quédate en el hilo",
        description: "Reemplaza un cambio de tema por una pregunta de seguimiento real.",
        config: {
          type: "rewrite",
          instruction:
            "Alguien dice: “Acabamos de migrar todo nuestro sistema de almacén, así que ha sido un trimestre agitado”. Reescribe la respuesta para que se apoye en lo que dijo y termine con una pregunta.",
          original: "Qué bien. Oye, ¿tienes vacaciones planeadas?",
          tips: [
            "Retoma una palabra específica que usó: migración, almacén, agitado.",
            "Haz una pregunta abierta con “qué” o “cómo”.",
            "Sé breve para que hable la otra persona.",
          ],
          maxWords: 25,
          requireQuestion: true,
          keywords: ["migra", "almac", "agitad", "trimestre", "sistema"],
          modelAnswer: "¡Migrar todo el almacén en un solo trimestre! ¿Qué fue lo más difícil de hacer bien?",
        },
      },
      quiz: [
        {
          prompt:
            "Según la investigación de Karen Huang y sus colegas, ¿qué tipo de pregunta se asoció más con caer bien?",
          options: ["Preguntas de apertura", "Preguntas de seguimiento", "Preguntas sobre el clima", "Preguntas de sí o no"],
          explanation:
            "Las preguntas de seguimiento mostraban que las personas estaban escuchando, algo que sus interlocutores valoraban.",
        },
        {
          prompt: "Alguien dice: “Ha sido un mes difícil”. ¿Qué respuesta es un espejo?",
          options: ["“Igual yo”.", "“¿Has probado tomarte unos días libres?”", "“¿Un mes difícil?”"],
          explanation: "Un espejo repite como pregunta unas pocas palabras clave e invita a la persona a ampliar.",
        },
        {
          prompt: "¿Por qué cambiar de tema justo después de la respuesta de alguien debilita una conversación?",
          options: [
            "Indica que estabas esperando tu turno en lugar de escuchar",
            "Hace la conversación demasiado larga",
            "Obliga a la otra persona a hacer preguntas",
            "Se considera descortés en la mayoría de las culturas",
          ],
          explanation: "Saltar de tema le dice a la otra persona que su respuesta no te llegó.",
        },
      ],
      action: {
        title: "Dos preguntas de seguimiento seguidas",
        description:
          "Hoy, en una conversación, haz al menos dos preguntas de seguimiento seguidas, cada una apoyada en su respuesta anterior, antes de compartir algo sobre ti.",
        successCriteria:
          "Hiciste dos preguntas de seguimiento consecutivas y descubriste algo que de otro modo no habrías escuchado.",
      },
    },

    /* ───────────────────────── Módulo 2 ───────────────────────── */
    "connect-remember-names": {
      title: "Recuerda los nombres",
      description: "La mayoría de los nombres no se olvidan: nunca se guardaron. Así es como se guardan.",
      content: {
        hook: "No olvidaste su nombre. Nunca lo escuchaste, porque estabas ocupado planeando qué decir después.",
        whyItMatters:
          "Usar el nombre de alguien indica que esa persona dejó huella en ti. Olvidarlo, sobre todo en un segundo encuentro, indica lo contrario. En una sala llena de contactos nuevos, ser quien recuerda los nombres es una ventaja discreta pero real.",
        coreConcept: {
          title: "Escúchalo, repítelo, asócialo, úsalo",
          body: [
            "Los nombres se escapan en el momento de la presentación porque la atención está en otra parte. La solución empieza ahí: cuando alguien diga su nombre, trátalo como la palabra más importante de la conversación.",
            "Repítelo de inmediato (“Mucho gusto, Daniel”). Asócialo con algo vívido: a qué se dedica, de dónde es, un detalle que mencione. Úsalo una vez más durante la conversación y otra al despedirte.",
            "Después, anótalo junto con un detalle. Y si no lo captaste, vuelve a preguntar pronto: “¿Me repites tu nombre?”. Eso no cuesta nada en el primer minuto y cuesta mucho más después.",
          ],
          keyPoints: [
            "Presta toda tu atención al nombre en el momento en que lo escuchas.",
            "Repítelo de inmediato y asócialo con un detalle vívido.",
            "Úsalo de nuevo al final y anótalo después.",
            "Si no lo captaste, vuelve a preguntar en el primer minuto.",
          ],
        },
        expertInsight: {
          text: "Carnegie sostenía que el nombre de una persona es, para ella, una de las palabras más importantes que existen, y que recordarlo y usarlo es una de las formas más sencillas de hacer que alguien se sienta respetado.",
          source: "Dale Carnegie",
          sourceDetail: "Cómo ganar amigos e influir sobre las personas (1936)",
        },
        example: {
          situation: "Te presentan a cuatro personas al inicio de un taller entre equipos.",
          before:
            "Asientes con cada nombre mientras piensas en tu propia presentación. Para la hora del almuerzo, estás evitando dirigirte directamente a cualquiera.",
          after:
            "“Hola, Ana, tú estás en precios, ¿verdad?”. Repites cada nombre con un detalle, los usas durante la sesión y los anotas en el descanso.",
          whyItWorks: "La repetición y un detalle asociado convirtieron cada nombre de ruido pasajero en un recuerdo.",
        },
        reflectionPrompt:
          "¿De quién has estado evitando usar el nombre porque lo olvidaste? ¿Cómo podrías recuperarlo?",
      },
      exercise: {
        title: "Nombres y detalles",
        description:
          "Estudia a cinco personas que acabas de conocer y luego recuerda sus nombres y un detalle de cada una.",
        config: {
          type: "recall",
          instruction:
            "Acabas de conocer a estas cinco personas en un evento del sector. Estudia la lista y luego recuerda cada nombre con su detalle.",
          items: [
            "Daniel: gerente de logística, va al trabajo en bicicleta",
            "Ana: analista de precios, acaba de mudarse desde Oporto",
            "Kwame: fundador de una startup, está creando una app de agendamiento",
            "Sofia: directora de RR. HH., entrena para un maratón",
            "Lukas: líder de ventas, tiene hijas gemelas",
          ],
          studySeconds: 45,
          technique:
            "Di cada nombre en tu mente y luego imagínalo unido a su detalle: Daniel en una bicicleta cargada de cajas, Ana llevando una etiqueta de precio por las calles de Oporto.",
        },
      },
      quiz: [
        {
          prompt: "¿Por qué solemos “olvidar” un nombre segundos después de escucharlo?",
          options: [
            "Los nombres son más difíciles de recordar que otras palabras",
            "Nuestra atención estaba en otra parte, así que nunca se guardó bien",
            "Conocemos a demasiadas personas para recordarlas a todas",
          ],
          explanation:
            "La mayoría de los nombres se pierden al codificarlos: cuando nos los dicen, estamos pensando en nuestra propia respuesta.",
        },
        {
          prompt: "¿Qué es lo mejor si no captaste el nombre de alguien hace treinta segundos?",
          options: [
            "Evitar usar su nombre el resto de la conversación",
            "Esperar a que alguien más lo diga",
            "Buscarlo después en redes sociales",
            "Volver a preguntar ahora: “¿Me repites tu nombre?”",
          ],
          explanation:
            "Preguntar pronto es fácil y normal. Preguntar después de una hora es incómodo, así que el costo solo aumenta.",
        },
        {
          prompt: "¿Qué hábito ayuda más a que un nombre nuevo se quede?",
          options: [
            "Repetirlo de inmediato y asociarlo con un detalle vívido",
            "Escucharlo varias veces de boca de otras personas",
            "Dar un apretón de manos firme",
            "Anotarlo una semana después",
          ],
          explanation: "La repetición inmediata más la asociación le dan al nombre un ancla en la memoria.",
        },
      ],
      action: {
        title: "Tres nombres esta semana",
        description:
          "Aprende y usa esta semana los nombres de tres personas que acabes de conocer o que apenas conozcas. Anota cada uno con un solo detalle.",
        successCriteria:
          "Usaste cada nombre en una conversación al menos una vez y puedes recordar los tres con un detalle al día siguiente.",
      },
    },
    "connect-read-the-room": {
      title: "Lee el ambiente",
      description: "Nota las señales que envían las personas y ajústate antes de que la conversación se vuelva en tu contra.",
      content: {
        hook: "Cada conversación te está enviando datos. La mayoría de la gente está demasiado ocupada hablando como para leerlos.",
        whyItMatters:
          "Las mismas palabras pueden caer bien o mal según el ánimo, la energía y la atención de la otra persona. Leer el ambiente te permite ajustarte: profundizar cuando alguien está involucrado, aligerar o cerrar cuando no lo está. Es lo que hace que la gente diga que es fácil hablar contigo.",
        coreConcept: {
          title: "Observa y luego ajusta",
          body: [
            "Observa tres cosas en la otra persona. Compromiso: ¿sus respuestas se alargan o se acortan? Orientación: ¿sus hombros y pies apuntan hacia ti o hacia la salida? Energía: ¿está relajada y expansiva, o tensa y apurada?",
            "Luego ajusta. Si está involucrada, profundiza con una pregunta de seguimiento. Si se está apagando, sigue su ritmo, acorta tus intervenciones u ofrécele una salida elegante. Si parece tensa, nómbralo con suavidad: “Parece que ha sido un día intenso”.",
            "Las señales son pistas, no veredictos. Una mirada al celular puede significar aburrimiento o un hijo enfermo. Ante la duda, verifica con ligereza en lugar de suponer.",
          ],
          keyPoints: [
            "Observa el compromiso, la orientación y la energía.",
            "Profundiza cuando se inclinan hacia ti; aligera o cierra cuando se apagan.",
            "Nombra con suavidad lo que notas en lugar de ignorarlo.",
            "Trata las señales como pistas por verificar, no como conclusiones.",
          ],
        },
        expertInsight: {
          text: "El exnegociador del FBI Chris Voss describe el “etiquetado”: nombrar con calma la emoción que observas, por ejemplo: “Parece que este es un momento muy ocupado”. Hacerlo ayuda a que las personas se sientan comprendidas y a menudo reduce la tensión.",
          source: "Chris Voss",
          sourceDetail: "Rompe la barrera del no (Never Split the Difference, 2016)",
        },
        example: {
          situation:
            "A mitad de una actualización de proyecto, notas que tu directora dejó de tomar notas y no deja de mirar la hora.",
          before: "Sigues adelante con las doce diapositivas. Ella se va sin haber tomado ninguna decisión.",
          after:
            "“Veo que el tiempo está justo. Déjame darte la única decisión que necesito hoy, y el resto puede ir por correo”. Decide en dos minutos.",
          whyItWorks: "Leíste la señal, la nombraste y adaptaste el formato a la atención que ella realmente tenía.",
        },
        reflectionPrompt:
          "Piensa en una conversación que salió mal hace poco. ¿Qué señales había en ese momento que no viste?",
      },
      exercise: {
        title: "Detecta la señal",
        description: "Elige la respuesta que mejor lee el ambiente.",
        config: {
          type: "choice",
          scenario:
            "En una cena con clientes, la persona sentada a tu lado empezó a responder con monosílabos. Su cuerpo está girado en dirección contraria a ti y no deja de mirar su celular.",
          question: "¿Cuál es tu mejor jugada?",
          options: [
            {
              text: "Hacerle otra pregunta detallada sobre su trabajo para recuperar su interés.",
              quality: "ok",
              feedback: "La intención es buena, pero le pide más a alguien que está indicando que tiene menos para dar.",
            },
            {
              text: "Contar una historia más larga y entretenida para recuperar su atención.",
              quality: "weak",
              feedback: "Esto ignora las señales y hace que la conversación gire todavía más en torno a ti.",
            },
            {
              text: "Nombrarlo con ligereza y darle espacio: “Parece que está pasando algo. Si necesitas atender eso, adelante”.",
              quality: "best",
              feedback: "Lo notaste, lo nombraste sin juzgar y le diste una opción fácil. Eso genera confianza.",
            },
            {
              text: "Seguir como si nada; lo educado es no mencionarlo.",
              quality: "weak",
              feedback: "Ignorar señales claras suele dejar incómodos a ambos.",
            },
          ],
        },
      },
      quiz: [
        {
          prompt: "¿Qué conjunto de señales sugiere más que alguien quiere cerrar la conversación?",
          options: [
            "Respuestas más largas e inclinarse hacia ti",
            "Hacerte preguntas a ti también",
            "Reírse de tus comentarios",
            "Respuestas más cortas y el cuerpo girado hacia la salida",
          ],
          explanation:
            "Las respuestas que se acortan y la orientación lejos de ti son señales comunes de que el interés se está apagando.",
        },
        {
          prompt: "¿Qué es el “etiquetado”, según lo describe Chris Voss?",
          options: [
            "Nombrar con calma la emoción que observas en la otra persona",
            "Clasificar a las personas por tipo de personalidad",
            "Resumir la agenda al inicio de una reunión",
          ],
          explanation: "Nombrar una emoción observada (“Parece que…”) ayuda a que las personas se sientan comprendidas.",
        },
        {
          prompt: "¿Cómo deberías tratar una sola señal, como que alguien revise su celular?",
          options: [
            "Como prueba de que está aburrido",
            "Como una pista por verificar con ligereza, no como una conclusión",
            "Como algo que hay que ignorar por completo",
            "Como una razón para terminar la conversación de inmediato",
          ],
          explanation: "Una sola señal tiene muchas causas posibles. Verifica con suavidad en lugar de suponer.",
        },
      ],
      action: {
        title: "Tres señales, un ajuste",
        description:
          "En tu próxima reunión o conversación grupal, anota en silencio tres señales sobre cómo se sienten las personas y luego haz un ajuste deliberado en función de ellas.",
        successCriteria:
          "Puedes nombrar las tres señales que notaste, el ajuste que hiciste y cómo respondieron las personas.",
      },
    },
    "connect-one-line-intro": {
      title: "Preséntate en una línea",
      description: "Reemplaza tu cargo por una sola frase que la gente entienda y recuerde.",
      content: {
        hook: "“¿Y tú a qué te dedicas?” es la pregunta más común en cualquier evento, y la mayoría la responde con un cargo que nadie recuerda.",
        whyItMatters:
          "Tu presentación es la unidad más pequeña de tu marca personal. Un cargo le dice a la gente tu rango; una frase clara le dice qué problema resuelves y por qué podría querer volver a hablar contigo. Además, facilita que otros te describan ante alguien más.",
        coreConcept: {
          title: "A quién ayudas y con qué",
          body: [
            "Una buena frase de presentación sigue una forma simple: Ayudo a [quién] a [hacer o resolver qué]. “Ayudo a nuestros equipos de ventas a dedicar menos tiempo a tareas administrativas y más a los clientes” dice más que “Asociado Senior, Excelencia Comercial”.",
            "Usa palabras sencillas. La jerga interna te parece precisa a ti y no significa nada para un desconocido. Si una persona inteligente de otra industria no la entendería, reescríbela.",
            "Apunta a una frase que invite a una pregunta. “¿Y cómo haces eso?” es la mejor respuesta que puede recibir tu presentación. Ten listas dos o tres versiones y adáptalas a la persona con quien hablas.",
          ],
          keyPoints: [
            "Fórmula: Ayudo a [quién] a [lograr o resolver qué].",
            "Las palabras sencillas superan a los cargos y la jerga.",
            "Una buena presentación invita a una pregunta de seguimiento.",
            "Adapta el énfasis a tu audiencia.",
          ],
        },
        expertInsight: {
          text: "Chip y Dan Heath describen la “maldición del conocimiento”: una vez que sabemos algo bien, se vuelve difícil imaginar cómo es no saberlo. Por eso las descripciones que hacen los expertos de su propio trabajo suelen estar llenas de términos que los demás no pueden descifrar.",
          source: "Chip Heath y Dan Heath",
          sourceDetail: "Ideas que pegan (Made to Stick, 2007)",
        },
        example: {
          situation: "En un almuerzo de networking, alguien le pregunta a Leo a qué se dedica.",
          before:
            "“Soy Líder de Gobierno de Datos en la Oficina de Información Corporativa”. Un gesto cortés con la cabeza, y la conversación sigue por otro lado.",
          after:
            "“Me aseguro de que, cuando dos áreas citan una cifra, sea la misma cifra”. La otra persona se ríe: “¿Y cómo logras eso?”.",
          whyItWorks: "Nombra un problema conocido con palabras sencillas e invita de forma natural a una pregunta.",
        },
        reflectionPrompt:
          "¿Cómo respondes hoy a “¿A qué te dedicas?”? ¿Qué recordaría de ti un desconocido una hora después?",
      },
      exercise: {
        title: "Tu frase de presentación",
        description: "Convierte una presentación cargada de cargos en una sola frase clara.",
        config: {
          type: "rewrite",
          instruction:
            "Reescribe esta presentación como una sola línea que diga a quién ayuda Marco y con qué, con palabras sencillas que un desconocido entendería.",
          original:
            "Hola, soy Marco. Soy Asociado Senior en el equipo de Excelencia Comercial, principalmente veo temas de habilitación transversal y optimización de procesos.",
          tips: [
            "Empieza con “Ayudo a…” o describe el problema que resuelves.",
            "Quita los cargos y los nombres internos de equipos.",
            "Nombra un resultado concreto que a alguien le importaría.",
          ],
          maxWords: 25,
          keywords: ["ayudo", "para que", "me aseguro", "menos tiempo", "resuelvo"],
          modelAnswer:
            "Soy Marco. Ayudo a nuestros equipos de ventas a dedicar menos tiempo a tareas administrativas y más a los clientes.",
        },
      },
      quiz: [
        {
          prompt: "¿Qué presentación sigue mejor la fórmula de una línea?",
          options: [
            "“Soy jefe de Iniciativas Estratégicas en una consultora”.",
            "“Trabajo en finanzas, sobre todo en reportes”.",
            "“Ayudo a pequeños comercios a que no se queden sin sus productos más vendidos”.",
            "“Hago un poco de todo, la verdad”.",
          ],
          explanation: "Nombra a quién ayudas y qué problema resuelves, con palabras sencillas.",
        },
        {
          prompt: "¿Qué explica la “maldición del conocimiento” sobre las presentaciones?",
          options: [
            "Por qué los expertos suelen describir su trabajo con términos que los demás no pueden seguir",
            "Por qué la gente olvida rápido las presentaciones",
            "Por qué las presentaciones más largas suenan más creíbles",
          ],
          explanation:
            "Cuando conoces bien un campo, es difícil imaginar cómo suenan tus palabras para alguien que no lo conoce.",
        },
        {
          prompt: "¿Cuál es la mejor señal de que tu presentación funcionó?",
          options: [
            "La otra persona asiente con cortesía",
            "La otra persona pregunta: “¿Y cómo haces eso?”",
            "La otra persona se presenta de inmediato",
            "La dijiste sin dudar",
          ],
          explanation: "Una pregunta de seguimiento significa que tu frase despertó curiosidad y abrió una conversación.",
        },
      ],
      action: {
        title: "Pon a prueba tu frase de presentación",
        description:
          "Escribe tu presentación de una línea y úsala al menos dos veces esta semana, ya sea en un evento, una reunión o una llamada con alguien nuevo.",
        successCriteria:
          "La usaste dos veces y anotaste si cada persona hizo una pregunta de seguimiento. Si ninguna la hizo, ajusta la frase.",
      },
    },

    /* ───────────────────────── Módulo 3 ───────────────────────── */
    "connect-exit-gracefully": {
      title: "Sal de una conversación con elegancia",
      description: "Termina las conversaciones de forma que la gente se alegre de haberlas tenido.",
      content: {
        hook: "El miedo a quedarse atrapado es una de las principales razones por las que la gente evita iniciar conversaciones. Saber cómo salir hace más fácil empezar.",
        whyItMatters:
          "En los eventos, quedarte con una sola persona toda la noche los limita a ambos. En el trabajo diario, las conversaciones que se alargan sin rumbo consumen tiempo y buena voluntad. Una salida limpia y cálida protege la relación y te deja libre para conocer a otros. Bien hecha, es uno de los momentos que la gente más recuerda.",
        coreConcept: {
          title: "Cierra el círculo y luego sal",
          body: [
            "Una salida elegante tiene una forma simple. Espera una pausa natural. Anuncia el cierre (“No quiero acapararte toda la noche”). Retoma algo que dijo la otra persona, para que quede claro que escuchaste. Propón un siguiente paso o intercambien datos de contacto. Luego di su nombre y despídete.",
            "Que tu razón sea honesta y tenga que ver con la situación, no con la persona: saludar a un colega, ir por algo de comer, conocer a algunas personas más. Sin excusas elaboradas.",
            "No te alejes a mitad de una frase ni dejes que la conversación se apague en silencio. Un cierre deliberado se siente respetuoso; un final que se diluye con incomodidad se siente como un rechazo.",
          ],
          keyPoints: [
            "Espera una pausa natural y luego anuncia el cierre.",
            "Retoma algo que dijo antes de irte.",
            "Ofrece un siguiente paso o intercambien datos de contacto.",
            "Despídete de forma limpia, usando su nombre.",
          ],
        },
        expertInsight: {
          text: "Daniel Kahneman y sus colegas describieron la “regla del pico y el final”: las personas tienden a juzgar una experiencia sobre todo por su momento más intenso y por cómo terminó, más que por su duración total. Los finales pesan de forma desproporcionada.",
          source: "Daniel Kahneman y colegas",
          sourceDetail:
            "Investigación sobre la regla del pico y el final (década de 1990); Pensar rápido, pensar despacio (2011)",
        },
        example: {
          situation:
            "Llevas quince minutos conversando con un proveedor en una feria comercial y quieres visitar otros stands.",
          before:
            "Sigues asintiendo, esperando que él termine la conversación. Al final murmuras “Bueno…” y te alejas mientras está a mitad de una frase.",
          after:
            "“Henrik, esto ha sido muy útil, sobre todo lo que dijiste sobre los tiempos de entrega. Déjame tomar tu tarjeta; la próxima semana te envío nuestros volúmenes. Que disfrutes el resto de la feria”.",
          whyItWorks: "Retoma lo que importó, fija un siguiente paso concreto y les deja a ambos un buen final.",
        },
        reflectionPrompt:
          "¿Cómo sueles terminar las conversaciones en los eventos? ¿Qué impresión crees que deja ese final?",
      },
      exercise: {
        title: "Ordena la salida",
        description: "Pon en el orden correcto los pasos de una salida elegante.",
        config: {
          type: "order",
          instruction: "Ordena estos pasos según la secuencia de una salida elegante de una conversación.",
          items: [
            "Esperar una pausa natural en la conversación",
            "Anunciar el cierre: “No quiero acapararte toda la noche”",
            "Retomar algo que dijo y que valoraste",
            "Proponer un siguiente paso o intercambiar datos de contacto",
            "Decir su nombre, agradecer y despedirte de forma limpia",
          ],
          explanation:
            "Esperar la pausa evita interrumpir; anunciar el cierre prepara a la otra persona; retomar algo demuestra que escuchaste; el siguiente paso deja la puerta abierta; una despedida limpia crea un buen final.",
        },
      },
      quiz: [
        {
          prompt: "¿Qué sugiere la regla del pico y el final sobre las conversaciones?",
          options: [
            "Las conversaciones más largas siempre se recuerdan mejor",
            "Lo único que importa es el primer minuto",
            "La forma en que termina una conversación influye mucho en cómo se recuerda",
          ],
          explanation:
            "Las personas le dan mucho peso al momento más intenso y al final, así que una buena salida importa.",
        },
        {
          prompt: "¿Qué razón para salir funciona mejor?",
          options: [
            "Una excusa elaborada sobre una llamada urgente",
            "Una razón honesta y situacional, como “Prometí saludar a un colega”",
            "Ninguna razón; simplemente irte",
            "Decir que el tema te aburre",
          ],
          explanation:
            "Las razones honestas y situacionales son fáciles de aceptar y no dicen nada negativo de la otra persona.",
        },
        {
          prompt: "¿Por qué incluir un siguiente paso al salir?",
          options: [
            "Convierte una charla agradable en una relación que puedes continuar",
            "Hace que la conversación dure más",
            "Es una formalidad cortés con poco efecto",
            "Te permite ofrecer tus servicios",
          ],
          explanation:
            "Un siguiente paso concreto, aunque sea solo intercambiar datos, le da a la conexión un camino por recorrer.",
        },
      ],
      action: {
        title: "Una salida deliberada",
        description:
          "En tu próximo evento, llamada larga o conversación de pasillo, termina al menos una conversación usando la secuencia completa: pausa, anuncio, retomar algo, siguiente paso y despedida limpia.",
        successCriteria:
          "Terminaste la conversación de forma deliberada e incluiste algo que retomaste de lo que dijo y un siguiente paso.",
      },
    },
    "connect-follow-up-after-event": {
      title: "Haz seguimiento después del evento",
      description: "Un seguimiento específico y útil convierte una buena conversación en una relación.",
      content: {
        hook: "La mayoría de las conexiones prometedoras no fracasan en el evento. Se desvanecen la semana siguiente, cuando nadie hace seguimiento.",
        whyItMatters:
          "Una conversación crea un momento de buena voluntad que se desvanece rápido. Un seguimiento breve y específico lo captura mientras está fresco y demuestra que prestaste atención. Pocas personas lo hacen bien, así que hacerlo de forma constante te distingue.",
        coreConcept: {
          title: "Específico, útil y ligero",
          body: [
            "Un buen seguimiento tiene tres partes. Algo específico de su conversación, para que te recuerde. Algo útil: un artículo, conectarla con alguien, la respuesta a una pregunta que planteó. Y un siguiente paso ligero que pueda aceptar o ignorar fácilmente.",
            "Envíalo pronto, idealmente en uno o dos días, mientras la conversación sigue fresca para ambos.",
            "Evita el genérico “¡Un gusto conocerte, sigamos en contacto!”. Le pide a la otra persona que haga el trabajo de recordarte y no le da nada a qué responder.",
          ],
          keyPoints: [
            "Haz referencia a un momento específico de su conversación.",
            "Da algo útil antes de pedir nada.",
            "Haz que el siguiente paso sea ligero y fácil de aceptar.",
            "Envíalo mientras el recuerdo está fresco.",
          ],
        },
        expertInsight: {
          text: "El trabajo de Robert Cialdini sobre la reciprocidad describe cómo las personas se sienten inclinadas a devolver un favor o una amabilidad que recibieron. Ofrecer primero algo útil hace más natural una respuesta, y una relación que continúe.",
          source: "Robert Cialdini",
          sourceDetail: "Influencia: la psicología de la persuasión (Influence: The Psychology of Persuasion, 1984)",
        },
        example: {
          situation:
            "Sam conoció a Elena en una cumbre de retail. Ella mencionó que su equipo tiene dificultades con las devoluciones de productos.",
          before: "“Hola, Elena, un gusto conocerte ayer. ¡Sigamos en contacto! Saludos, Sam”. Sin respuesta.",
          after:
            "“Hola, Elena, un gusto conocerte en la cumbre. Mencionaste que tu equipo está replanteando las devoluciones; aquí tienes el caso de estudio del que te hablé. Si te sirve, con gusto intercambiamos ideas en una llamada corta”. Ella responde el mismo día.",
          whyItWorks: "Le recuerda quién es Sam, cumple una promesa y ofrece un siguiente paso fácil y opcional.",
        },
        reflectionPrompt:
          "¿A quién conociste hace poco con quien pensabas hacer seguimiento y no lo hiciste? ¿Qué te detuvo?",
      },
      exercise: {
        title: "Mejora el seguimiento",
        description: "Reescribe un seguimiento genérico para que sea específico, útil y ligero.",
        config: {
          type: "rewrite",
          instruction:
            "Conociste a Elena en una cumbre de retail. Te contó que su equipo está replanteando cómo maneja las devoluciones de productos, y le prometiste enviarle un caso de estudio. Reescribe este mensaje de seguimiento.",
          original: "Hola, un gusto conocerte ayer. ¡Sigamos en contacto! Saludos, Sam",
          tips: [
            "Menciona dónde se conocieron y lo que te contó.",
            "Incluye lo útil que prometiste.",
            "Termina con un siguiente paso ligero y opcional.",
          ],
          maxWords: 60,
          keywords: ["mencionaste", "devoluciones", "caso de estudio", "cumbre", "contaste"],
          modelAnswer:
            "Hola, Elena, un gusto conocerte en la cumbre de retail. Mencionaste que tu equipo está replanteando las devoluciones, así que aquí tienes el caso de estudio del que te hablé. Si te sirve, con gusto intercambiamos ideas en una llamada corta. Saludos, Sam",
        },
      },
      quiz: [
        {
          prompt: "¿Cuál es la principal debilidad de “¡Un gusto conocerte, sigamos en contacto!”?",
          options: [
            "Es demasiado formal",
            "Es demasiado largo",
            "Suena demasiado ansioso",
            "No le da nada específico que recordar ni a qué responder",
          ],
          explanation:
            "Los seguimientos genéricos obligan a la otra persona a hacer todo el trabajo de recordar y responder.",
        },
        {
          prompt: "¿Qué principio explica por qué dar primero algo útil aumenta las respuestas?",
          options: ["Escasez", "Reciprocidad", "Prueba social"],
          explanation: "Cialdini describió la reciprocidad: las personas tienden a querer devolver lo que recibieron.",
        },
        {
          prompt: "¿Cuál es el mejor momento para hacer seguimiento después de conocer a alguien?",
          options: [
            "Pronto, idealmente en uno o dos días, mientras la conversación está fresca",
            "Después de unas semanas, para no parecer demasiado interesado",
            "Solo cuando necesites algo de esa persona",
            "Justo antes del próximo evento",
          ],
          explanation:
            "La buena voluntad y el recuerdo se desvanecen rápido. Hacer seguimiento pronto hace que te ubiquen con facilidad.",
        },
      ],
      action: {
        title: "Envía un seguimiento real",
        description:
          "Envía un mensaje de seguimiento específico a alguien que conociste hace poco: haz referencia a su conversación, ofrece algo útil y sugiere un siguiente paso ligero.",
        successCriteria:
          "El mensaje se envió y contenía una referencia específica, algo útil y un siguiente paso opcional.",
      },
    },
    "connect-give-first": {
      title: "Da primero y mantén vivos los vínculos débiles",
      description:
        "Tus conocidos son la parte menos aprovechada de tu red. Los pequeños favores los mantienen vivos.",
      content: {
        hook: "La persona con más probabilidades de contarte sobre tu próxima oportunidad probablemente no es un amigo cercano. Es alguien con quien no hablas hace un año.",
        whyItMatters:
          "Los contactos cercanos tienden a saber lo mismo que tú. Los conocidos se mueven en otros círculos y se enteran de otras cosas. Mantener vivas esas conexiones más sueltas, sin que se sienta transaccional, es uno de los hábitos de mayor retorno en una carrera.",
        coreConcept: {
          title: "Vínculos débiles y el favor de cinco minutos",
          body: [
            "Tu red tiene vínculos fuertes (personas que ves a menudo) y vínculos débiles (conocidos, excolegas, personas que viste una vez). Los vínculos débiles son valiosos justamente porque te conectan con información y personas fuera de tu círculo habitual.",
            "La forma de mantenerlos vivos es dar primero. Adam Grant popularizó el “favor de cinco minutos”: un pequeño gesto que te cuesta poco y ayuda a otra persona, como conectarla con alguien, compartirle un enlace útil, darle un comentario rápido o hacerle un reconocimiento público.",
            "Hazlo sin pedir nada a cambio. Las relaciones construidas con pequeñas generosidades regulares están ahí cuando las necesitas; las que solo activas cuando necesitas algo se sienten transaccionales, y la gente lo nota.",
          ],
          keyPoints: [
            "Los vínculos débiles te conectan con información y oportunidades nuevas.",
            "Da primero, con favores pequeños y de bajo costo.",
            "Que tus favores no vengan con ningún pedido.",
            "Retoma el contacto con regularidad, no solo cuando necesitas algo.",
          ],
        },
        expertInsight: {
          text: "El sociólogo Mark Granovetter mostró que las personas a menudo se enteran de nuevas oportunidades, incluidos empleos, a través de conocidos más que de amigos cercanos, porque los conocidos tienden puentes hacia otros círculos sociales. Lo llamó “la fuerza de los vínculos débiles”.",
          source: "Mark Granovetter",
          sourceDetail: "“The Strength of Weak Ties”, American Journal of Sociology (1973)",
        },
        example: {
          situation:
            "Nadia no habla con Tomás, un excolega que ahora trabaja en otra empresa, desde hace más de un año.",
          before:
            "Planea escribirle solo cuando empiece a buscar un nuevo puesto, y luego le resulta incómodo contactarlo en frío.",
          after:
            "Ve un artículo sobre un tema que a él le interesa y se lo envía: “Vi esto y me acordé de tu trabajo en auditorías de proveedores. Espero que todo vaya bien”. Un mes después se juntan a tomar un café.",
          whyItWorks: "Un regalo pequeño y específico, sin ningún pedido, reactivó la relación desde la generosidad.",
        },
        reflectionPrompt: "¿Con qué conocido perdiste contacto que de verdad apreciaría saber de ti?",
      },
      exercise: {
        title: "Planea un favor de cinco minutos",
        description: "Planea cómo retomar el contacto con un vínculo débil dando primero.",
        config: {
          type: "structure",
          framework: "Reconexión dando primero",
          instruction:
            "Elige a un conocido con quien hayas perdido contacto y planea una reconexión pequeña y sin condiciones.",
          context:
            "Piensa en excolegas, personas que conociste en eventos o amigos de amigos que te cayeron bien pero que rara vez ves.",
          slots: [
            { key: "person", label: "La persona", hint: "Quién es y de dónde la conoces.", maxWords: 20 },
            {
              key: "care",
              label: "Lo que le importa",
              hint: "Un proyecto, una meta o un interés que sabes que le importa.",
              maxWords: 25,
            },
            {
              key: "favour",
              label: "Tu favor de cinco minutos",
              hint: "Conectarla con alguien, un artículo, un comentario o un reconocimiento.",
              maxWords: 30,
            },
            {
              key: "message",
              label: "Frase de apertura",
              hint: "La primera frase de tu mensaje, sin ningún pedido.",
              maxWords: 35,
            },
          ],
        },
      },
      quiz: [
        {
          prompt: "Según Granovetter, ¿por qué son valiosos los vínculos débiles?",
          options: [
            "Son más leales que los amigos cercanos",
            "Es más fácil pedirles favores",
            "Te conectan con información y círculos fuera del tuyo",
            "No requieren ningún esfuerzo para mantenerse",
          ],
          explanation:
            "Los conocidos tienden puentes hacia otras redes, así que se enteran de cosas que tu círculo cercano no conoce.",
        },
        {
          prompt: "¿Cuál es el mejor ejemplo de un favor de cinco minutos?",
          options: [
            "Presentar a dos personas que realmente podrían ayudarse entre sí",
            "Pedirle a un contacto antiguo que te recomiende para un empleo",
            "Darle “me gusta” a todas las publicaciones de alguien",
          ],
          explanation: "Un favor de cinco minutos te cuesta poco y crea valor real para otra persona.",
        },
        {
          prompt: "¿Por qué un favor para reconectar debe ir sin ningún pedido?",
          options: [
            "Pedir nunca es apropiado en el networking",
            "La generosidad sin condiciones genera confianza; un favor con un pedido adjunto se siente transaccional",
            "La gente no lee mensajes largos",
            "Ahorra tiempo",
          ],
          explanation: "Cuando está claro que dar no es la antesala de pedir, la relación se siente genuina.",
        },
      ],
      action: {
        title: "Reconecta dando",
        description:
          "Esta semana, retoma el contacto con alguien con quien no hablas hace tiempo enviándole un favor pequeño y específico (un enlace, conectarlo con alguien, un comentario o un reconocimiento) sin pedir nada a cambio.",
        successCriteria: "Enviaste el mensaje con un favor genuino y sin ningún pedido.",
      },
    },
  },
};
