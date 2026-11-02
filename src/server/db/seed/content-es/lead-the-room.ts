import type { JourneyTranslation } from "../translations";

export const leadTheRoomEs: JourneyTranslation = {
  title: "Lidera la sala",
  subtitle: "Haz avanzar decisiones, personas y acuerdos con calma y claridad.",
  description:
    "Nueve sesiones prácticas sobre la mecánica diaria del liderazgo: reuniones que de verdad deciden, feedback que cambia conductas, delegar sin microgestionar, e influir y negociar cuando no tienes el cargo ni todas las cartas.",
  modules: [
    {
      title: "Reuniones que deciden",
      description:
        "Convierte las reuniones, de un desfile de actualizaciones, en el lugar donde las decisiones se toman, tienen dueño y se cumplen.",
    },
    {
      title: "Feedback y delegación",
      description:
        "Ayuda a las personas a mejorar, cede responsabilidad real y logra que tu equipo pueda decirte la verdad sin riesgo.",
    },
    {
      title: "Influencia y negociación",
      description: "Haz avanzar a las personas y los acuerdos cuando no tienes el cargo ni todas las cartas.",
    },
  ],
  lessons: {
    /* ───────────────────────── Módulo 1 ───────────────────────── */
    "lead-meetings-that-decide": {
      title: "Dirige reuniones que terminan en decisiones",
      description:
        "Plantea cada punto de la agenda como una pregunta por responder, para que la reunión tenga una meta clara.",
      content: {
        hook: "La mayoría de las reuniones recurrentes terminan igual que empezaron: todos informados, nada decidido. El problema suele empezar en la invitación, no en la sala.",
        whyItMatters:
          "Una reunión sin una decisión explícita deriva hacia las actualizaciones, porque es lo más seguro de lo que se puede hablar. Eso consume horas de atención y empuja las decisiones reales a los pasillos y los mensajes privados. Los líderes que plantean sus reuniones en torno a decisiones consiguen equipos más rápidos y menos debates que se reabren.",
        coreConcept: {
          title: "Los puntos de la agenda son preguntas, no temas",
          body: [
            "Un tema como “Precios del tercer trimestre” invita a un recorrido de opiniones. Una pregunta como “¿Subimos el precio del plan básico en el tercer trimestre, sí o no?” le dice a todos cómo se ve el final. La pregunta se convierte en la meta de la reunión.",
            "Antes de enviar la invitación, escribe la decisión que necesitas, quién la toma y qué aporte necesitas de cada asistente. Si no puedes escribir la pregunta, probablemente necesitas un documento breve o una conversación uno a uno, no una reunión.",
            "Envía con anticipación el material de lectura previa y abre la reunión repitiendo la pregunta. Luego dedica el tiempo en vivo al desacuerdo y a las disyuntivas, no a leer diapositivas en voz alta. Las actualizaciones de estado pueden ir por escrito.",
          ],
          keyPoints: [
            "Reescribe cada tema de la agenda como una pregunta con un formato de respuesta claro.",
            "Nombra en la invitación a quien toma la decisión.",
            "Saca de la reunión las simples actualizaciones de estado.",
            "Si no puedes formular la pregunta, todavía no agendes la reunión.",
          ],
        },
        expertInsight: {
          text: "Andy Grove consideraba las reuniones una herramienta central del trabajo gerencial, no una distracción. Distinguía entre las reuniones de proceso, que son rutinarias, y las reuniones orientadas a una misión, convocadas para resolver un problema concreto, e insistía en que quien convoca una reunión de este tipo debe saber exactamente qué pretende lograr.",
          source: "Andy Grove",
          sourceDetail: "High Output Management (1983)",
        },
        example: {
          situation: "Marco, líder de equipo, dirige cada semana una reunión de producto de 60 minutos con ocho personas.",
          before:
            "Agenda: “Roadmap, métricas de onboarding, precios del tercer trimestre”. La hora se llena de actualizaciones; los precios reciben diez minutos apurados y se postergan para la próxima semana. Otra vez.",
          after:
            "Agenda: “1) ¿Lanzamos la versión 2 del onboarding antes o después del cambio de precios? Decide: Marco. 2) Plan básico: ¿subimos el precio en el tercer trimestre, sí o no? Decide: Lena, con aportes de Ventas y Finanzas”. Las métricas se envían el día anterior en una nota escrita.",
          whyItWorks:
            "Cada punto tiene un formato de respuesta y un responsable, así que la discusión converge en lugar de divagar. La gente llega habiendo leído los números y lista para debatir la disyuntiva.",
        },
        reflectionPrompt:
          "Piensa en tu próxima reunión recurrente. ¿Qué decisión debería producir y quién debería ser dueño de esa decisión?",
      },
      exercise: {
        title: "Convierte un tema en una decisión",
        description: "Reescribe un punto de agenda vago para que la reunión sepa exactamente qué tiene que decidir.",
        config: {
          type: "rewrite",
          instruction:
            "Reescribe este punto de la agenda como una pregunta de decisión clara. Indica quién decide y, si sirve, las opciones sobre la mesa.",
          original:
            "Punto 3 de la agenda: Conversar sobre la situación con el proveedor y los próximos pasos para la herramienta de analítica.",
          tips: [
            "Empieza por la decisión: “¿Vamos a…?” o “¿Cuál…?”.",
            "Haz evidente el formato de respuesta (sí/no, opción A o B).",
            "Nombra a quien decide y los aportes que necesitas.",
          ],
          maxWords: 40,
          keywords: ["decisión", "decision", "decid", "cuál", "sí o no"],
          modelAnswer:
            "Decisión: ¿renovamos 12 meses con nuestro proveedor actual de analítica o cambiamos a la alternativa más barata antes del 1 de junio? Decide: Priya. Aportes: comparación de costos (Finanzas) y riesgo de migración (Datos).",
        },
      },
      quiz: [
        {
          prompt:
            "Vas a agendar una reunión sobre un lanzamiento retrasado. ¿Qué línea de agenda la prepara mejor para decidir algo?",
          options: [
            "Estado del lanzamiento y bloqueos",
            "Conversación abierta sobre cómo va el lanzamiento",
            "¿Postergamos el lanzamiento dos semanas o recortamos la función de reportes para mantener la fecha? Decide: Ana",
            "Revisión del cronograma del lanzamiento con todo el equipo",
          ],
          explanation:
            "Una pregunta de decisión con opciones claras y una persona que decide le da a la reunión una meta. Las demás invitan a actualizaciones o a una conversación abierta que rara vez converge.",
        },
        {
          prompt:
            "La mitad de tu reunión semanal consiste en personas leyendo en voz alta actualizaciones de estado. ¿Cuál es el cambio más efectivo?",
          options: [
            "Limitar cada actualización a un minuto",
            "Pedir que traigan diapositivas para que las actualizaciones se vean más claras",
            "Cancelar la reunión para siempre",
            "Enviar las actualizaciones por escrito antes y usar la reunión para las decisiones pendientes",
          ],
          explanation:
            "Las actualizaciones funcionan bien por escrito; el tiempo en vivo vale más para el desacuerdo y las disyuntivas. Acortarlas ayuda un poco, pero la reunión sigue girando en torno al estado de las cosas.",
        },
        {
          prompt:
            "Quieres convocar una reunión, pero no puedes formular la decisión que debería producir. ¿Qué es lo más probable que eso indique?",
          options: [
            "Necesitas más asistentes para averiguarlo",
            "El problema aún no está listo para una reunión; acláralo primero por escrito o en una conversación uno a uno",
            "La reunión debería ser más larga",
            "El grupo debería decidir de qué hablar cuando se reúna",
          ],
          explanation:
            "Si no puedes escribir la pregunta, el grupo pasará la reunión descubriéndola, y eso sale caro. Un documento breve o una conversación suele afinar primero el problema.",
        },
      ],
      action: {
        title: "Replantea una reunión próxima",
        description:
          "Elige una reunión que organices o a la que asistas esta semana. Reescribe su agenda, o sugiérele una nueva versión a quien la organiza, para que cada punto sea una pregunta de decisión con una persona que decide. Pasa al menos una actualización de estado a una nota escrita.",
        successCriteria:
          "La agenda actualizada se envió o se compartió, con al menos un punto formulado como pregunta y una persona responsable de decidir.",
      },
    },
    "lead-who-decides": {
      title: "Deja claro quién decide",
      description:
        "Separa a quien aporta de quien toma la decisión, para que las decisiones dejen de estancarse buscando consenso.",
      content: {
        hook: "Cuando todos opinan y nadie decide, las decisiones no se toman. Se postergan.",
        whyItMatters:
          "Los derechos de decisión poco claros son una de las razones más comunes por las que equipos capaces avanzan lento. La gente espera un consenso que nunca llega o toma decisiones que luego se revierten en silencio. Nombrar desde el inicio a quien decide protege tanto la velocidad como la confianza.",
        coreConcept: {
          title: "Aportar no es votar",
          body: [
            "Las decisiones importantes involucran varios roles: quienes recomiendan, quienes deben estar de acuerdo, quienes aportan su opinión, quienes ejecutan y una persona que decide. La mayor parte de la fricción viene de confundir “escucharon mi opinión” con “tengo derecho a veto”.",
            "Di los roles en voz alta antes de la discusión: “Lena decide; Ventas y Finanzas aportan; decidimos a más tardar el viernes”. Así la gente puede debatir con fuerza sin temer que el desacuerdo termine en un punto muerto.",
            "Una vez tomada la decisión, quien decide explica su razonamiento, incluyendo qué aportes lo hicieron cambiar de opinión y cuáles no. Las personas aceptan mucho mejor una decisión en su contra cuando ven que realmente fueron escuchadas.",
          ],
          keyPoints: [
            "Nombra a una sola persona que decide por cada decisión, antes del debate.",
            "Deja claro quién aporta y quién, si alguien, debe aprobar.",
            "Fija una fecha límite para decidir.",
            "Cierra explicando el razonamiento, sobre todo a quienes no estaban de acuerdo.",
          ],
        },
        expertInsight: {
          text: "Paul Rogers y Marcia Blenko, de Bain & Company, describieron cómo las organizaciones se atascan cuando los roles de decisión no están claros. Propusieron asignar roles explícitos —recomendar, acordar, ejecutar, aportar y decidir— con un principio central: una sola persona es claramente dueña de la decisión final.",
          source: "Paul Rogers y Marcia Blenko",
          sourceDetail: "“Who Has the D?”, Harvard Business Review (2006)",
        },
        example: {
          situation:
            "Sofia, gerente de ingeniería, debe elegir entre dos planes de migración de base de datos. Tres ingenieros senior tienen opiniones firmes y opuestas.",
          before:
            "Agenda una conversación “para alinearnos”. Tras una hora de debate circular, sugiere que todos “lo sigan pensando”. Dos semanas después, el mismo debate vuelve a empezar.",
          after:
            "Abre con: “Tom recomendará un plan a más tardar el miércoles. Ravi y Mei, envíenme por escrito sus objeciones más fuertes. Decidiré el jueves y explicaré por qué”. El jueves elige el plan de Tom con una de las salvaguardas de Mei y le explica al equipo la disyuntiva.",
          whyItWorks:
            "Los roles claros permiten discrepar abiertamente sin temer un estancamiento. Una fecha límite y una explicación razonada hacen que la decisión se sostenga.",
        },
        reflectionPrompt:
          "¿Qué decisión de tu equipo está atascada ahora mismo? ¿Quién debería ser su dueño, y esa persona lo sabe?",
      },
      exercise: {
        title: "Destraba una decisión estancada",
        description: "Elige la jugada que vuelve a poner en marcha una decisión atascada entre equipos.",
        config: {
          type: "choice",
          scenario:
            "Tu equipo y el de marketing llevan tres reuniones debatiendo la fecha de lanzamiento de una funcionalidad. Ambos líderes tienen opiniones, el VP dijo “resuélvanlo juntos” y nadie ha dejado por escrito quién decide realmente.",
          question: "¿Cuál es la mejor siguiente jugada?",
          options: [
            {
              text: "Agendar una cuarta reunión con todos y presionar más por el consenso.",
              quality: "weak",
              feedback:
                "Más reuniones con los mismos roles confusos suelen producir el mismo estancamiento. El consenso es una esperanza, no un proceso de decisión.",
            },
            {
              text: "Pedirle al VP que decida en el momento, en la próxima reunión, sin una recomendación preparada.",
              quality: "ok",
              feedback:
                "Escalar sí aclara quién decide, pero sin una recomendación lo más probable es que el VP decida con poca información o devuelva el tema.",
            },
            {
              text: "Proponer los roles por escrito: tú recomiendas una fecha con aportes de marketing, el VP decide a más tardar el viernes y ambos equipos se comprometen con el resultado.",
              quality: "best",
              feedback:
                "Esto define quién recomienda, quién decide y una fecha límite. Convierte un debate abierto en un proceso con meta, sin atribuirte una autoridad que no tienes.",
            },
            {
              text: "Elegir tú la fecha y anunciarla, ya que tu equipo construye la funcionalidad.",
              quality: "weak",
              feedback:
                "Parece rápido, pero es probable que marketing o el VP reabran una decisión unilateral. Una decisión que se revierte cuesta más tiempo del que ahorró.",
            },
          ],
        },
      },
      quiz: [
        {
          prompt:
            "Un colega aportó su opinión sobre tu decisión y está molesto porque elegiste otro camino. ¿Qué preserva mejor la confianza?",
          options: [
            "Reabrir la decisión para que se sienta incluido",
            "Explicar qué evaluaste, cómo influyó su aporte y por qué elegiste distinto",
            "Recordarle que tú eras quien decidía",
            "No decir nada; la decisión habla por sí sola",
          ],
          explanation:
            "Las personas aceptan mejor las decisiones desfavorables cuando ven que su aporte se consideró de verdad. Reabrir invita a discutir sin fin; imponer la jerarquía erosiona la confianza.",
        },
        {
          prompt: "¿Qué frase establece mejor un proceso de decisión claro?",
          options: [
            "Alineémonos sobre esto antes del fin de semana.",
            "Todos opinan y nos quedamos con lo que diga la mayoría.",
            "Sigamos conversando hasta que se sienta bien.",
            "Jun decide a más tardar el jueves; diseño y soporte aportan; legal debe aprobar los términos.",
          ],
          explanation:
            "Nombra a una persona que decide, los roles de aporte, la única aprobación real y una fecha límite. “Alinearse” y las votaciones por mayoría dejan la responsabilidad en el aire.",
        },
        {
          prompt: "¿Por qué nombrar a quien decide antes del debate y no después?",
          options: [
            "Para que la gente pueda discutir abiertamente sin temer un punto muerto ni política oculta",
            "Para que quien decide pueda saltarse los aportes",
            "Para que la reunión sea más corta porque hay menos desacuerdo",
            "Para que nadie más se sienta responsable del resultado",
          ],
          explanation:
            "Saber quién decide permite a los participantes concentrarse en presentar su mejor argumento en lugar de disputarse el control. No reduce la necesidad de escuchar; hace que escuchar cuente.",
        },
      ],
      action: {
        title: "Nombra a quien decide en una decisión abierta",
        description:
          "Encuentra una decisión de tu equipo que lleve tiempo a la deriva. Envía un mensaje breve proponiendo quién recomienda, quién aporta, quién decide y para cuándo.",
        successCriteria:
          "Se envió un mensaje que nombra a una sola persona que decide y una fecha de decisión para una decisión real y pendiente.",
      },
    },
    "lead-close-the-loop": {
      title: "Cierra cada reunión con responsables y fechas",
      description:
        "Termina las reuniones de forma que la conversación se convierta en compromisos con nombre y verificables.",
      content: {
        hook: "Una reunión puede llegar a una gran decisión y aun así fracasar, porque nadie anotó quién hace qué a continuación.",
        whyItMatters:
          "Las decisiones se desgastan rápido cuando solo viven en la memoria de la gente. Cada asistente se va con una versión ligeramente distinta de lo acordado. Un cierre disciplinado de dos minutos evita semanas de “pensé que tú te encargabas de eso”.",
        coreConcept: {
          title: "El cierre de dos minutos",
          body: [
            "Reserva los últimos minutos de cada reunión para el cierre. Reformula cada decisión en una frase y conviértela en acciones con un único responsable y una fecha. “El equipo lo va a revisar” no es una acción; “Ravi envía la cotización revisada al cliente a más tardar el martes” sí lo es.",
            "Formula las acciones como próximos pasos concretos, no como intenciones. “Pensar en los precios” no se puede marcar como hecho; “redactar tres opciones de precio en una página”, sí.",
            "En pocas horas, envía un resumen breve por escrito: decisiones, acciones, responsables, fechas y preguntas abiertas. Empieza la siguiente reunión revisando esas acciones antes de sumar nuevas.",
          ],
          keyPoints: [
            "Reformula las decisiones en voz alta antes de que la gente se vaya.",
            "Cada acción tiene un responsable y una fecha.",
            "Escribe las acciones como próximos pasos concretos y visibles.",
            "Envía el resumen el mismo día y revísalo la próxima vez.",
          ],
        },
        expertInsight: {
          text: "El método de productividad de David Allen se centra en definir la “próxima acción”: el siguiente paso físico y visible que hace avanzar algo. Los compromisos vagos se estancan porque nadie sabe qué hacer primero; nombrar una próxima acción concreta elimina esa fricción.",
          source: "David Allen",
          sourceDetail: "Organízate con eficacia (Getting Things Done, 2001)",
        },
        example: {
          situation: "Priya, líder de proyecto, cierra con cuatro colegas una llamada de escalamiento de un cliente.",
          before:
            "“Buena conversación, equipo. Hagamos seguimiento de todo esto y volvemos a hablar la próxima semana”. Una semana después, dos personas redactaron el mismo correo y nadie llamó al cliente.",
          after:
            "“Déjenme cerrar. Decisión: ofrecemos una extensión de dos semanas, no un descuento. Acciones: Ravi le escribe al cliente hoy antes de las 5 p. m.; Mei actualiza el plan del proyecto a más tardar el miércoles; yo pongo al tanto a nuestro VP mañana temprano. El resumen les llega en menos de una hora”.",
          whyItWorks:
            "Decirlo en voz alta hace aflorar los desacuerdos mientras todos siguen en la sala. Un único responsable y una fecha hacen que el seguimiento sea verificable, no supuesto.",
        },
        reflectionPrompt:
          "En tu última reunión, ¿qué se acordó? ¿Todos los presentes podrían nombrar los mismos responsables y fechas?",
      },
      exercise: {
        title: "Ordena un buen cierre de reunión",
        description: "Pon en el orden correcto los pasos de un cierre de reunión eficaz y su seguimiento.",
        config: {
          type: "order",
          instruction: "Ordena estos pasos tal como los harías al final de una reunión y después.",
          items: [
            "Anunciar el cierre unos minutos antes de que se acabe el tiempo",
            "Reformular cada decisión en una frase",
            "Asignar a cada acción un único responsable y una fecha",
            "Confirmar las preguntas abiertas y quién las resolverá",
            "Enviar un resumen escrito el mismo día",
            "Revisar las acciones al inicio de la siguiente reunión",
          ],
          explanation:
            "Primero creas tiempo para el cierre, luego fijas las decisiones, después las conviertes en acciones con responsable y señalas lo que queda pendiente. El resumen lo vuelve duradero, y revisarlo la próxima vez genera responsabilidad.",
        },
      },
      quiz: [
        {
          prompt: "¿Cuál es una acción de reunión bien formulada?",
          options: [
            "Marketing revisará la idea del webinar",
            "Deberíamos pensar más en la pérdida de clientes",
            "Lucas envía al equipo un borrador del esquema del webinar a más tardar el jueves al mediodía",
            "Hacer seguimiento al presupuesto según sea necesario",
          ],
          explanation:
            "Tiene un responsable, un entregable concreto y una fecha límite. Las demás son intenciones que nadie puede marcar como hechas.",
        },
        {
          prompt: "¿Por qué reformular las decisiones en voz alta antes de que la gente salga de la reunión?",
          options: [
            "Para que la reunión se sienta más formal",
            "Para detectar interpretaciones distintas mientras todos siguen presentes",
            "Para que quien facilita tenga la última palabra",
            "Para no tener que escribir un resumen",
          ],
          explanation:
            "La gente suele irse con versiones sutilmente distintas de la misma decisión. Decirlo en voz alta expone la diferencia cuando corregirla es más barato.",
        },
        {
          prompt:
            "Dos acciones de la reunión de la semana pasada no se hicieron. ¿Cuál es la respuesta más útil en la próxima reunión?",
          options: [
            "Omitirlas y concentrarse en temas nuevos",
            "Reasignártelas todas en silencio",
            "Guardarlo para la próxima evaluación de desempeño",
            "Empezar revisándolas: confirmar al responsable, quitar bloqueos y fijar una fecha realista",
          ],
          explanation:
            "Revisar primero las acciones muestra que los compromisos importan y hace aflorar los bloqueos a tiempo. Omitirlas le enseña al equipo que los resúmenes son opcionales.",
        },
      ],
      action: {
        title: "Haz un cierre de dos minutos",
        description:
          "En tu próxima reunión, pide dos minutos al final. Reformula las decisiones, nombra un responsable y una fecha para cada acción, y envía un breve resumen escrito en las horas siguientes.",
        successCriteria:
          "Se envió un resumen con al menos una decisión y todas las acciones, cada una con un único responsable y una fecha.",
      },
    },

    /* ───────────────────────── Módulo 2 ───────────────────────── */
    "lead-feedback-people-act-on": {
      title: "Da feedback que la gente pueda aplicar",
      description: "Haz que tu feedback sea específico, cercano y directo para que cambie lo que la persona hace después.",
      content: {
        hook: "Los elogios vagos se olvidan y las críticas vagas generan resentimiento. En ambos casos, nada cambia.",
        whyItMatters:
          "La mayoría de las personas quiere mejorar, pero no puede actuar sobre un “buen trabajo” o un “sé más estratégico”. El feedback que nombra una conducta concreta y su efecto les da algo que repetir o ajustar mañana. Pocos hábitos de liderazgo tienen tanto impacto.",
        coreConcept: {
          title: "Situación, conducta, impacto y cuidado",
          body: [
            "El feedback útil tiene tres partes: la situación (cuándo y dónde), la conducta específica que observaste y el impacto que tuvo. “En la llamada con el cliente del martes, lo interrumpiste dos veces mientras explicaba el problema, y se quedó callado el resto de la llamada” es algo con lo que una persona puede trabajar.",
            "Ser directo es una forma de respeto. Suavizar un mensaje hasta que desaparece, o enterrarlo entre elogios, protege tu comodidad a costa de la otra persona.",
            "Termina con una petición o una pregunta orientada al futuro, no con un veredicto, e invita su punto de vista, porque puede que te falte contexto. Da el feedback pronto, haz las críticas en privado y sé tan específico con los elogios como con las críticas.",
          ],
          keyPoints: [
            "Nombra la situación, la conducta observable y su impacto.",
            "Describe acciones, no rasgos de personalidad.",
            "Sé directo porque te importa, no a pesar de ello.",
            "Cierra con una petición clara o una pregunta genuina.",
          ],
        },
        expertInsight: {
          text: "Kim Scott plantea el buen feedback en dos dimensiones: interesarse personalmente por la persona y desafiarla directamente. Interesarse sin desafiar deriva en lo que ella llama empatía ruinosa, mientras que desafiar sin interesarse se convierte en agresión desagradable.",
          source: "Kim Scott",
          sourceDetail: "Franqueza radical (Radical Candor, 2017)",
        },
        example: {
          situation:
            "Daniel, líder de diseño, necesita abordar las presentaciones de un diseñador junior, que se extienden demasiado y entierran la recomendación.",
          before:
            "“Tus presentaciones están un poco desenfocadas. ¿Quizás podrías intentar ser más conciso? Pero en general, ¡muy buen trabajo, de verdad!”",
          after:
            "“En la revisión de ayer, la recomendación apareció en la diapositiva 14 y el VP se fue antes de que llegáramos, así que no obtuvimos una decisión. La próxima vez, ¿podrías poner la recomendación en la primera diapositiva? ¿Qué te llevó a armarla de esa manera?”",
          whyItWorks:
            "Nombra el momento, la conducta y la consecuencia real; luego pide un cambio específico e invita la perspectiva del diseñador. Nada de lo que dice tiene que ver con su personalidad.",
        },
        reflectionPrompt:
          "¿Qué feedback le has estado guardando a alguien? ¿Qué conducta e impacto específicos nombrarías?",
      },
      exercise: {
        title: "Haz que el feedback sirva",
        description: "Convierte un comentario vago y demasiado suavizado en feedback sobre el que se pueda actuar.",
        config: {
          type: "rewrite",
          instruction:
            "Reescribe este feedback usando situación, conducta e impacto. Termina con una petición clara o una pregunta.",
          original:
            "Oye, una cosita, y seguro no es nada grave, pero a veces se te ve un poco negativo en las reuniones. En fin, ¡en general lo estás haciendo genial!",
          tips: [
            "Nombra una reunión o un momento específico.",
            "Describe lo que hizo, no quién es.",
            "Indica el impacto en el equipo o en el resultado.",
            "Cierra con una petición o una pregunta.",
          ],
          maxWords: 60,
          keywords: ["reunión", "reunion", "próxima vez", "proxima vez", "podr"],
          modelAnswer:
            "En la reunión de planificación de esta mañana, descartaste tres ideas antes de que sus autores terminaran de explicarlas. Después de eso, dos personas dejaron de participar. La próxima vez, ¿podrías hacer una pregunta sobre cada idea antes de criticarla? También me gustaría saber cómo viviste tú esa reunión.",
        },
      },
      quiz: [
        {
          prompt: "¿Qué comentario es el más fácil de poner en práctica?",
          options: [
            "Necesitas trabajar más en equipo.",
            "En la reunión diaria de hoy avisaste del bloqueo a tiempo, y eso le permitió a Ana reorganizar su trabajo. Sigue haciéndolo.",
            "¡Buen trabajo últimamente, sigue así!",
            "Eres muy detallista.",
          ],
          explanation:
            "El feedback positivo necesita la misma especificidad que la crítica. Nombrar el momento, la conducta y el impacto le dice a la persona exactamente qué repetir.",
        },
        {
          prompt:
            "Un gerente evita decirle a un colaborador muy querido que sus reportes tienen errores recurrentes, para mantener la relación cordial. En términos de Kim Scott, esto es:",
          options: ["Franqueza radical", "Agresión desagradable", "Empatía ruinosa", "Seguridad psicológica"],
          explanation:
            "Interesarse sin desafiar deja a la persona sin saber de un problema que la perjudicará después. El interés real incluye decir lo difícil.",
        },
        {
          prompt: "¿Por qué terminar un feedback crítico con una pregunta como “¿Qué tenías en mente ahí?”?",
          options: [
            "Para suavizar el mensaje y que se sienta menos directo",
            "Para que la persona decida si el feedback aplica o no",
            "Para evitar tener que dar una recomendación clara",
            "Para descubrir contexto que quizá no tienes y convertir la solución en un problema compartido",
          ],
          explanation:
            "Tú ves la conducta, no la intención ni las restricciones. Preguntar mantiene el mensaje directo y a la vez invita información que podría cambiar la solución adecuada.",
        },
      ],
      action: {
        title: "Da un feedback específico",
        description:
          "Hoy, dale a una persona feedback, positivo o constructivo, que nombre la situación, la conducta y su impacto, y que termine con una petición o una pregunta. En persona, en una llamada o en un mensaje breve.",
        successCriteria:
          "Diste un feedback en el que un observador neutral podría identificar un momento específico, una conducta y un impacto.",
      },
    },
    "lead-delegate-outcomes": {
      title: "Delega el resultado, no la tarea",
      description:
        "Entrega el trabajo con intención, límites y autoridad claros para que las personas puedan hacerse cargo de verdad.",
      content: {
        hook: "Si tienes que explicar cada paso, no has delegado. Solo agregaste un intermediario a tu propia lista de pendientes.",
        whyItMatters:
          "Los líderes que delegan tareas se convierten en cuellos de botella, porque cada decisión de criterio vuelve a ellos. Delegar el resultado, con la razón detrás, permite que la gente tome buenas decisiones que tú no anticipaste. Así escalas tu impacto y haces crecer a tu equipo al mismo tiempo.",
        coreConcept: {
          title: "Intención, límites, autoridad y seguimiento",
          body: [
            "Empieza por el resultado y por qué importa: cómo se ve el éxito y para quién es. Cuando la gente entiende el propósito, puede adaptarse con sensatez cuando el plan choca con la realidad.",
            "Luego nombra los límites, como la fecha límite, el presupuesto y lo innegociable, y el nivel de autoridad: decidir e informarte, recomendar para tu aprobación o explorar opciones primero. La autoridad mal calibrada es donde falla la mayoría de las delegaciones.",
            "Por último, acuerden puntos de seguimiento acordes con la experiencia de la persona en este tipo de tarea. Alguien con trayectoria puede necesitar un solo punto de control; alguien nuevo en ese trabajo quizá necesite una revisión rápida de su plan antes de empezar.",
          ],
          keyPoints: [
            "Empieza por el resultado y la razón detrás.",
            "Explicita los límites y lo innegociable.",
            "Sé explícito sobre la autoridad para decidir.",
            "Ajusta el seguimiento a la experiencia en esta tarea específica.",
          ],
        },
        expertInsight: {
          text: "La doctrina militar usa la “intención del comandante”: una declaración breve del propósito de una operación y del estado final deseado, para que quienes están en el terreno puedan actuar con sensatez cuando el plan detallado se desmorona. Chip y Dan Heath llevaron la idea al mundo de los negocios como una forma de mantener a todos enfocados en lo que más importa.",
          source: "Intención del comandante (doctrina militar)",
          sourceDetail: "Popularizada en Ideas que pegan (Made to Stick), de Chip y Dan Heath (2007)",
        },
        example: {
          situation: "Hannah, gerente de operaciones, necesita un nuevo proveedor de materiales de empaque.",
          before:
            "“¿Puedes conseguir tres cotizaciones de proveedores de empaque y enviármelas?”. Su colaborador le envía tres cotizaciones. Entonces Hannah se da cuenta de que ninguna cumple el requisito de reciclabilidad que nunca mencionó.",
          after:
            "“Necesitamos un nuevo proveedor de empaque para marzo, para reducir costos sin romper nuestro compromiso de reciclabilidad. El gasto tiene que quedar por debajo de lo que pagamos hoy, y los materiales reciclables son innegociables. Tú puedes armar la lista corta y negociar; yo firmo el contrato. Revisemos tu lista corta el próximo viernes”.",
          whyItWorks:
            "Ahora su colaborador conoce el objetivo, los límites duros y hasta dónde llega su autoridad, así que puede tomar decisiones de criterio sin volver por cada duda.",
        },
        reflectionPrompt:
          "¿Qué tarea estás reteniendo que otra persona podría asumir si le dieras la intención y la autoridad?",
      },
      exercise: {
        title: "Escribe una ficha de delegación",
        description: "Estructura una entrega de trabajo para que alguien se haga cargo del resultado, no solo de los pasos.",
        config: {
          type: "structure",
          framework: "Ficha de delegación",
          instruction:
            "Elige una tarea real que podrías delegar esta semana. Completa cada parte de la ficha tal como se la dirías a la persona.",
          context:
            "Mantén cada parte lo bastante corta como para decirla de un tirón. Si no puedes completar un espacio, es un vacío con el que la otra persona se habría topado después.",
          slots: [
            {
              key: "outcome",
              label: "Resultado y por qué",
              hint: "¿Cómo se ve el trabajo terminado y por qué importa?",
              maxWords: 35,
            },
            { key: "constraints", label: "Límites", hint: "Fecha límite, presupuesto, lo innegociable.", maxWords: 30 },
            {
              key: "authority",
              label: "Autoridad",
              hint: "¿Decide y me informa, recomienda para aprobación o explora primero?",
              maxWords: 25,
            },
            { key: "checkins", label: "Seguimiento", hint: "¿Cuándo y cómo van a revisar el avance?", maxWords: 20 },
          ],
        },
      },
      quiz: [
        {
          prompt:
            "Delegas un informe para un cliente y vuelve sin el único hallazgo que al cliente le importa. ¿Qué es lo más probable que haya fallado?",
          options: [
            "A la persona le faltaban habilidades para la tarea",
            "Describiste la tarea, pero no el resultado ni por qué importaba",
            "Le diste demasiada autoridad",
            "Programaste demasiados seguimientos",
          ],
          explanation:
            "Sin el propósito, la gente optimiza para completar la tarea tal como se describió. Compartir el “porqué” le permite priorizar lo que le importa al cliente.",
        },
        {
          prompt:
            "Una persona del equipo tiene experiencia en general, pero es nueva en negociaciones con proveedores. ¿Qué enfoque de seguimiento encaja mejor?",
          options: [
            "Ningún seguimiento; confiar plenamente",
            "Reportes diarios de avance hasta terminar",
            "Revisar su plan de negociación antes de la primera llamada y luego hacer seguimiento tras los hitos clave",
            "Llevar tú la negociación y que la persona observe",
          ],
          explanation:
            "La supervisión debe ajustarse a la experiencia en esta tarea específica, no a la antigüedad general. Una revisión temprana del plan detecta vacíos y deja a la persona a cargo.",
        },
        {
          prompt: "¿Qué frase define la autoridad con más claridad?",
          options: [
            "Manéjalo como mejor te parezca, pero consúltame todo.",
            "Siéntete libre de hacerte cargo.",
            "Avísame cómo te va.",
            "Puedes elegir al proveedor dentro del presupuesto acordado; si algo lo supera, tráeme una recomendación.",
          ],
          explanation:
            "Traza una línea clara entre lo que decide la persona y lo que requiere aprobación. Una autoridad vaga o contradictoria provoca parálisis o extralimitación.",
        },
      ],
      action: {
        title: "Delega un resultado hoy",
        description:
          "Elige una tarea que normalmente harías tú o microgestionarías. Delégala usando la ficha: resultado y por qué, límites, autoridad y un seguimiento acordado.",
        successCriteria:
          "La otra persona puede repetir el resultado, el límite clave y lo que tiene permitido decidir, y hay una fecha de seguimiento acordada.",
      },
    },
    "lead-safe-to-speak-up": {
      title: "Haz que sea seguro hablar",
      description: "Invita el desacuerdo y las malas noticias a tiempo con la forma en que preguntas y respondes.",
      content: {
        hook: "Si tu equipo solo te trae buenas noticias, no es porque todo vaya bien.",
        whyItMatters:
          "Los problemas son más baratos de resolver cuando alguien los detecta por primera vez. Si plantear una preocupación se siente riesgoso, la gente calla y los problemas salen a la luz tarde, cuando ya son caros. Los líderes moldean ese cálculo de riesgo cada día con pequeñas señales.",
        coreConcept: {
          title: "Las preguntas invitan, las reacciones deciden",
          body: [
            "La gente decide si hablar o no según lo que pasó la última vez que alguien lo hizo. Cómo reaccionas ante una mala noticia, un error o un cuestionamiento a tu idea le enseña más al equipo que cualquier política de puertas abiertas.",
            "Pregunta de manera que el desacuerdo sea la respuesta esperada. “¿Alguna duda?” suele recibir silencio; “¿Cuál es el mayor riesgo de este plan que no hemos discutido?” da por hecho que existe uno y convierte nombrarlo en un aporte.",
            "Cuando alguien plantea una preocupación, primero agradece y luego muestra curiosidad. Admitir tu propia incertidumbre, como “puede que se me esté escapando algo”, les da permiso a los demás para hacer lo mismo.",
          ],
          keyPoints: [
            "Presenta el trabajo como incierto, donde los aportes realmente se necesitan.",
            "Haz preguntas específicas que den por hecho que hay preocupaciones.",
            "Responde a las malas noticias con agradecimiento y curiosidad.",
            "Muestra que eres falible nombrando tu propia incertidumbre.",
          ],
        },
        expertInsight: {
          text: "Amy Edmondson describe la seguridad psicológica como la creencia compartida de que en el equipo es seguro asumir riesgos interpersonales, como hacer preguntas, admitir errores o discrepar. Insiste en que no se trata de ser amable ni de bajar los estándares; los líderes la construyen planteando el trabajo como un reto de aprendizaje, reconociendo su propia falibilidad y haciendo preguntas genuinas.",
          source: "Amy Edmondson",
          sourceDetail: "La organización sin miedo (The Fearless Organization, 2018)",
        },
        example: {
          situation: "Lucas, líder de equipo, presenta un plan de migración y quiere una crítica honesta de su equipo.",
          before: "“Ese es el plan. Creo que está bastante sólido. ¿Alguna duda? ¿No? Perfecto, avancemos”.",
          after:
            "“Esta es mi primera versión y seguro tiene huecos. Si esta migración fracasa dentro de dos meses, ¿cuál sería la razón más probable? Mei, tú ya hiciste una de estas. ¿Qué cambiarías?”",
          whyItWorks:
            "Lucas deja claro que el plan no está terminado, hace una pregunta que da por hecho que hay riesgos e invita a una persona concreta. El desacuerdo se vuelve la respuesta útil, no la incómoda.",
        },
        reflectionPrompt: "Piensa en la última vez que alguien te trajo una mala noticia. ¿Qué le enseñó tu reacción?",
      },
      exercise: {
        title: "Pide las preocupaciones reales",
        description: "Reescribe un mensaje cerrado para que invite a cuestionarlo con honestidad.",
        config: {
          type: "rewrite",
          instruction:
            "Reescribe este mensaje para que invite de verdad a plantear preocupaciones y desacuerdos. Termina con una pregunta específica.",
          original:
            "Este es el plan final de la reestructuración. Creo que cubrimos todo. Avísenme si hay algún problema, pero me gustaría avanzar el lunes.",
          tips: [
            "Deja claro que el plan todavía puede cambiar.",
            "Admite lo que podrías estar pasando por alto.",
            "Haz una pregunta específica que dé por hecho que hay riesgos.",
          ],
          maxWords: 50,
          requireQuestion: true,
          keywords: ["riesgo", "preocupa", "inquieta", "pasando por alto", "cambiar"],
          modelAnswer:
            "Este es mi borrador actual del plan de reestructuración. Confío en la dirección, pero seguramente estoy pasando por alto algo sobre cómo afecta su día a día. Antes de comprometernos el lunes, ¿qué cambio de este plan les preocupa más?",
        },
      },
      quiz: [
        {
          prompt: "¿Qué pregunta tiene más probabilidades de sacar a la luz preocupaciones reales sobre un plan?",
          options: [
            "¿Todos están de acuerdo?",
            "¿Alguna pregunta?",
            "Si este plan fracasa, ¿cuál habrá sido la causa más probable?",
            "Todos estamos de acuerdo con esto, ¿no?",
          ],
          explanation:
            "Da por hecho que existen riesgos y convierte nombrar uno en un acto útil. Las demás hacen que el silencio o el acuerdo sean la opción fácil por defecto.",
        },
        {
          prompt:
            "Un ingeniero junior te cuenta que cometió un error que retrasó un lanzamiento. ¿Qué respuesta construye mejor la seguridad psicológica?",
          options: [
            "Agradecerle que lo haya planteado rápido y luego preguntarle qué pasó y qué ayudaría a evitarlo",
            "Decirle que no pasa nada y seguir sin conversarlo",
            "Señalarle que debió detectarse antes",
            "Escalarlo a tu jefe para que se siga el proceso",
          ],
          explanation:
            "El agradecimiento premia el acto de hablar; la curiosidad convierte el error en aprendizaje. Restarle importancia se salta el aprendizaje, y culpar enseña a la gente a ocultar el próximo.",
        },
        {
          prompt: "¿Qué afirmación sobre la seguridad psicológica es correcta?",
          options: [
            "Significa evitar el conflicto para que el equipo esté cómodo",
            "Significa bajar los estándares para que la gente sienta menos presión",
            "Se crea principalmente anunciando una política de puertas abiertas",
            "Significa que las personas se sienten seguras para asumir riesgos interpersonales, como discrepar o admitir errores",
          ],
          explanation:
            "La seguridad psicológica convive perfectamente con estándares altos. Se trata de si la franqueza es segura, y se construye con el comportamiento diario, no con políticas declaradas.",
        },
      ],
      action: {
        title: "Haz una pregunta que busque riesgos",
        description:
          "Hoy, en una reunión o en una conversación uno a uno, haz una pregunta que dé por hecho que existe una preocupación, como “¿Cuál es el mayor riesgo del que no estamos hablando?”. Cuando alguien responda, agradécele antes de responder al contenido.",
        successCriteria:
          "Hiciste al menos una pregunta que busca riesgos y recibiste la primera respuesta con agradecimiento y una pregunta de seguimiento, no con una defensa.",
      },
    },

    /* ───────────────────────── Módulo 3 ───────────────────────── */
    "lead-influence-without-authority": {
      title: "Influye sin autoridad formal",
      description: "Consigue la cooperación de pares y otros equipos ofreciendo lo que ellos valoran.",
      content: {
        hook: "Las personas cuya ayuda más necesitas a menudo no dependen de ti, y tienen sus propias prioridades.",
        whyItMatters:
          "Gran parte del trabajo actual es transversal: necesitas tiempo de ingeniería, una revisión legal o los datos de otro equipo. Un cargo no te lo va a conseguir, y los favores aislados se agotan. Quienes entienden lo que valoran los demás pueden construir una cooperación que dure.",
        coreConcept: {
          title: "Piensa en monedas de cambio",
          body: [
            "Toda persona que necesitas valora algo: reconocimiento, tiempo ahorrado, avanzar en sus propios objetivos, menos riesgo, aprendizaje o, simplemente, que la consulten a tiempo. La influencia empieza por entender su mundo antes de hacer tu pedido.",
            "Plantea tus pedidos en función de sus prioridades, no solo de las tuyas. “Esto ayuda a mi lanzamiento” pesa menos que “Esto elimina la conciliación manual que tu equipo hace cada mes”.",
            "Ofrece algo a cambio y construye la relación antes de necesitarla. El intercambio funciona mejor como un patrón continuo, no como una negociación de último minuto.",
          ],
          keyPoints: [
            "Identifica lo que le importa a la otra persona antes de pedir.",
            "Plantea el pedido en función de sus objetivos.",
            "Ofrece a cambio algo que valore.",
            "Invierte en las relaciones antes de necesitarlas.",
          ],
        },
        expertInsight: {
          text: "Allan Cohen y David Bradford describen la influencia como un intercambio: las personas cooperan cuando reciben a cambio algo que valoran. A esas cosas valiosas las llaman “monedas”, como la inspiración, la ayuda con una tarea, el reconocimiento o el apoyo personal, y aconsejan entender el mundo de un colega antes de pedirle nada.",
          source: "Allan Cohen y David Bradford",
          sourceDetail: "Influence Without Authority",
        },
        example: {
          situation:
            "Nadia, product manager, necesita dos días de un ingeniero de datos de otro equipo que ya está sobrecargado.",
          before:
            "Le escribe a su jefe: “Necesitamos a Sam dos días para nuestro lanzamiento. Es de alta prioridad para nosotros”. El pedido queda sin respuesta durante una semana.",
          after:
            "Se entera de que al equipo de datos le pidieron reducir los incidentes en sus pipelines. Su mensaje: “El ajuste que necesitamos también eliminaría uno de los procesos inestables detrás de sus alertas de incidentes. ¿Podría Sam trabajar dos días junto a nuestro ingeniero? Nosotros nos encargamos de las pruebas y le daremos crédito a tu equipo en el anuncio del lanzamiento”.",
          whyItWorks:
            "Nadia vincula su pedido al objetivo del otro equipo, reduce su esfuerzo y ofrece un reconocimiento visible. Se convierte en un intercambio, no en un favor.",
        },
        reflectionPrompt: "¿De quién necesitas cooperación este mes y qué es lo que más valora esa persona ahora mismo?",
      },
      exercise: {
        title: "Arma un plan de influencia",
        description: "Prepara un pedido para alguien que no depende de ti.",
        config: {
          type: "structure",
          framework: "Mapa de monedas de cambio",
          instruction: "Piensa en un pedido real que necesitas hacerle a un par o a otro equipo. Mapéalo antes de pedir.",
          context:
            "La influencia funciona mejor cuando el pedido se plantea en función de los objetivos de la otra persona, no de los tuyos.",
          slots: [
            {
              key: "priorities",
              label: "Sus prioridades",
              hint: "¿Con qué indicadores los evalúan o qué les preocupa ahora mismo?",
              maxWords: 30,
            },
            {
              key: "currency",
              label: "Lo que valoran",
              hint: "Tiempo ahorrado, reconocimiento, menos riesgo, avance en sus objetivos…",
              maxWords: 25,
            },
            {
              key: "offer",
              label: "Lo que puedes ofrecer",
              hint: "Algo concreto que puedas dar a cambio.",
              maxWords: 25,
            },
            {
              key: "ask",
              label: "Tu pedido, en sus términos",
              hint: "Una o dos frases que conecten tu pedido con sus objetivos.",
              maxWords: 40,
            },
          ],
        },
      },
      quiz: [
        {
          prompt:
            "Necesitas que legal revise un contrato, pero el área está saturada. ¿Qué enfoque tiene más probabilidades de funcionar?",
          options: [
            "Marcar el pedido como urgente y copiar a su director",
            "Enviar el contrato con las cláusulas clave señaladas, un resumen de las diferencias frente a la plantilla estándar y un plazo realista",
            "Hacer seguimiento todos los días hasta que respondan",
            "Saltarte la revisión y asumir el riesgo",
          ],
          explanation:
            "Reducir su esfuerzo es una moneda que valoran. Escalar o insistir gasta una buena voluntad que vas a necesitar después.",
        },
        {
          prompt: "¿Por qué construir relaciones con otros equipos antes de necesitar algo de ellos?",
          options: [
            "Porque el intercambio funciona mejor como una relación continua, no como una transacción aislada",
            "Para poder cobrar favores después sin dar explicaciones",
            "Porque la gente no puede decirles que no a sus amigos",
            "Para poder saltarte los procesos formales",
          ],
          explanation:
            "La confianza y la comprensión de los objetivos del otro se construyen con el tiempo, y hacen que los intercambios futuros sean más fáciles y justos. No se trata de obligación ni de saltarse procesos.",
        },
        {
          prompt: "¿Qué forma de plantear un pedido a otro equipo es la más sólida?",
          options: [
            "Esto es prioridad máxima para mi equipo.",
            "Nuestro VP lo pidió.",
            "Te agradecería mucho tu ayuda; significaría mucho para mí.",
            "Esto eliminaría la revisión manual que tu equipo hace cada semana, y nosotros nos encargamos de la implementación.",
          ],
          explanation:
            "Vincula el pedido al propio objetivo del otro equipo y reduce su costo. Apelar a tus prioridades o a la jerarquía no les da ninguna razón para que les importe.",
        },
      ],
      action: {
        title: "Haz un pedido en su moneda",
        description:
          "Identifica algo que necesites de alguien fuera de tu línea de reporte. Antes de pedirlo, anota algo que a esa persona le importe y luego envía el pedido planteado en torno a eso, con algo concreto que puedas ofrecer.",
        successCriteria:
          "Se envió un pedido que se vincula explícitamente con el objetivo de la otra persona e incluye una oferta específica de tu parte.",
      },
    },
    "lead-interests-not-positions": {
      title: "Negocia intereses, no posiciones",
      description: "Mira debajo de las exigencias declaradas para encontrar acuerdos que ambas partes prefieran.",
      content: {
        hook: "Cuando dos personas discuten por un número, casi siempre están discutiendo por otra cosa.",
        whyItMatters:
          "Intercambiar exigencias de un lado a otro suele producir concesiones que dejan insatisfechas a ambas partes, o ningún acuerdo. Preguntar por qué alguien quiere lo que quiere a menudo revela opciones que ninguna de las partes había considerado. Funciona por igual en negociaciones salariales, acuerdos con proveedores y tironeos internos.",
        coreConcept: {
          title: "Pregunta por qué y luego amplía las opciones",
          body: [
            "Una posición es lo que alguien dice que quiere: “Lo necesitamos para el viernes”. Un interés es por qué lo quiere: su demo con el cliente es el lunes y necesita un margen. Las posiciones suelen chocar; los intereses, con frecuencia, no.",
            "Descubre los intereses con preguntas abiertas: “Ayúdame a entender qué te permite lograr el viernes”. Comparte también tus propios intereses, para que la otra parte pueda ayudarte a resolverlos.",
            "Genera opciones antes de comprometerte. Una vez que los intereses de ambas partes están a la vista, a menudo existe un paquete, como una entrega parcial el viernes y la versión completa el martes, que sirve mejor a ambos que partir la diferencia.",
          ],
          keyPoints: [
            "Separa lo que la gente pide de por qué lo quiere.",
            "Haz preguntas abiertas del tipo “ayúdame a entender”.",
            "Comparte tus intereses, no solo tus exigencias.",
            "Genera varias opciones antes de acordar una.",
          ],
        },
        expertInsight: {
          text: "Roger Fisher y William Ury sostienen que los negociadores eficaces se centran en los intereses y no en las posiciones, porque detrás de posiciones opuestas suele haber intereses compartidos o compatibles. Recomiendan inventar opciones de beneficio mutuo antes de decidir, en lugar de regatear un único punto.",
          source: "Roger Fisher y William Ury",
          sourceDetail: "Obtenga el sí (Getting to Yes, 1981)",
        },
        example: {
          situation:
            "Ventas le pide a Elena, líder de equipo, que construya una funcionalidad a medida para un prospecto en dos semanas. Su equipo tiene la agenda llena.",
          before:
            "“Dos semanas es imposible. Lo más pronto es el próximo trimestre”. Ventas escala el tema y los dos líderes pasan una semana discutiendo fechas.",
          after:
            "“Ayúdame a entender qué necesita ver el prospecto en dos semanas”. Resulta que necesitan pruebas de que la funcionalidad viene en camino antes de que cierre su presupuesto. Elena ofrece una demo con un prototipo y una fecha de entrega comprometida por escrito. Ventas cierra el trato; su equipo mantiene su plan.",
          whyItWorks:
            "Al preguntar por el interés detrás del plazo, Elena encontró una opción que le costó poco a su equipo y le dio a ventas lo que realmente necesitaba.",
        },
        reflectionPrompt:
          "Piensa en un desacuerdo actual. ¿Cuál es la posición de la otra parte y qué interés podría haber detrás?",
      },
      exercise: {
        title: "Encuentra el interés",
        description: "Elige la respuesta que hace avanzar una negociación estancada.",
        config: {
          type: "choice",
          scenario:
            "Estás negociando con un proveedor de software. Insiste en un contrato de tres años; tú quieres uno de un año porque el presupuesto del próximo año no está confirmado. Ambas partes ya repitieron su posición dos veces.",
          question: "¿Cuál es tu mejor siguiente paso?",
          options: [
            {
              text: "Mantenerte firme en un año y decir que no es negociable.",
              quality: "weak",
              feedback:
                "Repetir posiciones endurece a ambas partes, y no aprendes nada sobre lo que el proveedor realmente necesita.",
            },
            {
              text: "Partir la diferencia y ofrecer dos años.",
              quality: "ok",
              feedback:
                "Podría cerrar el trato, pero quizá no resuelva la preocupación real de ninguna de las partes, y aun así comprometerías un presupuesto que no tienes.",
            },
            {
              text: "Preguntar qué le aporta un plazo de tres años y explicar que tu limitación es un presupuesto sin confirmar, no falta de voluntad.",
              quality: "best",
              feedback:
                "Sacar a la luz los intereses, quizá previsibilidad de ingresos para ellos y certeza presupuestaria para ti, abre opciones como un plazo de un año con el precio de renovación asegurado.",
            },
            {
              text: "Amenazar con irte con un competidor si no aceptan un año.",
              quality: "weak",
              feedback:
                "La presión puede funcionar una vez, pero daña la relación y sigue ignorando lo que cada parte realmente necesita.",
            },
          ],
        },
      },
      quiz: [
        {
          prompt:
            "Una colega insiste en que la jornada del equipo fuera de la oficina sea en el centro de la ciudad. ¿Qué pregunta revela mejor su interés?",
          options: [
            "¿Por qué eres tan rígida con esto?",
            "¿Qué te facilitaría a ti o al equipo que sea en el centro?",
            "¿Aceptarías las afueras si lo sometemos a votación?",
            "¿No podemos simplemente llegar a un punto intermedio?",
          ],
          explanation:
            "Una pregunta abierta y sin juicio la invita a compartir la necesidad de fondo, quizá el acceso en transporte público o la visita de un cliente, que podría tener otras soluciones.",
        },
        {
          prompt: "¿Cuál es el principal riesgo de partir la diferencia demasiado pronto en una negociación?",
          options: [
            "Siempre toma demasiado tiempo llegar a eso",
            "Se considera mala etiqueta de negociación",
            "Puede terminar en un punto medio que no sirve a los intereses reales de ninguna de las partes",
            "Hace que la otra parte desconfíe de ti",
          ],
          explanation:
            "Ceder sobre posiciones se salta el paso de entender los intereses, así que mejores opciones para ambos quedan sin descubrir.",
        },
        {
          prompt:
            "Tu jefe quiere que asumas un proyecto nuevo y te preocupa la sobrecarga. ¿Qué respuesta aplica mejor la negociación basada en intereses?",
          options: [
            "Compartir tu preocupación por tu capacidad y preguntar qué resultado importa más, para proponer qué poner en pausa",
            "Decir que sí y trabajar más horas sin decir nada",
            "Rechazarlo porque ya tienes demasiado",
            "Pedir un aumento a cambio",
          ],
          explanation:
            "Nombrar tu interés (una carga de trabajo sostenible) y preguntar por el suyo (el resultado que importa) abre espacio para opciones como cambiar prioridades.",
        },
      ],
      action: {
        title: "Haz una pregunta de “ayúdame a entender”",
        description:
          "Hoy, en un desacuerdo o un pedido, grande o pequeño, pregúntale a la otra persona qué le permite lograr su posición antes de responder con tu propio punto de vista.",
        successCriteria:
          "Identificaste al menos un interés detrás de la posición declarada de alguien y lo escribiste en una frase.",
      },
    },
    "lead-know-your-walkaway": {
      title: "Define tu punto de retirada antes de sentarte a negociar",
      description: "Define tu mejor alternativa por adelantado para negociar desde la claridad, no desde la presión.",
      content: {
        hook: "Lo más poderoso que puedes llevar a una negociación es una idea clara de lo que harás si fracasa.",
        whyItMatters:
          "Sin una alternativa definida, la gente acepta malos acuerdos por miedo o rechaza buenos por orgullo. Conocer tu plan B de antemano establece un piso racional. Además te mantiene en calma, porque el resultado deja de sentirse como todo o nada.",
        coreConcept: {
          title: "Tu BATNA marca el piso",
          body: [
            "Tu BATNA (en español, MAAN: mejor alternativa a un acuerdo negociado) es lo que realmente harás si este acuerdo no se concreta. No es un deseo, sino una opción concreta, como otra oferta, desarrollarlo internamente o mantener la situación actual.",
            "Defínela antes de la conversación. Haz una lista de tus alternativas realistas, elige la más sólida y compara cualquier propuesta contra ella. Si el acuerdo supera tu BATNA, vale la pena considerarlo; si no, retirarte es lo racional.",
            "Mejora tu BATNA cuando puedas, porque es tu principal fuente de poder de negociación. Piensa también en las alternativas de la otra parte: cuanto más débiles sean sus opciones, más vale el acuerdo para ella.",
          ],
          keyPoints: [
            "Define tu alternativa concreta antes de negociar.",
            "Evalúa las ofertas frente a tu BATNA, no frente a tus esperanzas.",
            "Fortalece tus alternativas para fortalecer tu posición.",
            "Estima también las alternativas de la otra parte.",
          ],
        },
        expertInsight: {
          text: "Fisher y Ury introdujeron el BATNA, la mejor alternativa a un acuerdo negociado, como el estándar con el que debe medirse cualquier propuesta. Sostienen que te protege tanto de aceptar condiciones que deberías rechazar como de rechazar condiciones que te convendría aceptar.",
          source: "Roger Fisher y William Ury",
          sourceDetail: "Obtenga el sí (Getting to Yes, 1981)",
        },
        example: {
          situation: "Omar, analista senior, está por negociar un aumento con su jefe.",
          before:
            "Entra esperando un “aumento justo” y sin plan B. Cuando le ofrecen un ajuste pequeño, lo acepta en el acto y luego lo resiente durante meses.",
          after:
            "Antes de la reunión, anota sus alternativas: una oferta informal de otra empresa, o quedarse y buscar un ascenso en el próximo ciclo. Decide qué es aceptable en relación con ellas. En la reunión pide una cifra específica y explica su razonamiento; cuando le ofrecen menos, pide como parte del paquete una fecha por escrito para evaluar su ascenso.",
          whyItWorks:
            "Conocer sus alternativas le dio a Omar un estándar claro y serenidad. Negoció sobre el fondo en lugar de reaccionar a la primera oferta.",
        },
        reflectionPrompt:
          "En una negociación que tienes por delante, ¿qué harías realmente si no se llega a un acuerdo?",
      },
      exercise: {
        title: "Compara una oferta con tus alternativas",
        description: "Evalúa un acuerdo real frente a tus opciones realistas de retirada.",
        config: {
          type: "decision",
          instruction:
            "Decide si aceptar la renovación, hacer una contraoferta o retirarte. Puntúa cada opción según los criterios y nombra tu BATNA.",
          prompt:
            "Estás renovando un contrato de software y el precio del proveedor es bastante más alto que el del año pasado. Alternativas: cambiarte a un competidor más barato, lo que requeriría una migración de dos meses, o desarrollar una herramienta interna más simple que tu equipo estima que tomaría un trimestre. El contrato actual vence en seis semanas.",
          suggestedCriteria: [
            "Costo total a dos años",
            "Interrupción y riesgo de migración",
            "Tiempo disponible antes del vencimiento",
            "Fuerza de cada alternativa como poder de negociación",
            "Relación a largo plazo con el proveedor",
          ],
        },
      },
      quiz: [
        {
          prompt:
            "Un reclutador te ofrece un puesto con tu sueldo actual. No tienes otras ofertas y te gusta tu trabajo actual. ¿Cuál es tu BATNA?",
          options: [
            "El sueldo que esperas conseguir",
            "Quedarte en tu trabajo actual",
            "La mejor oferta posible del reclutador",
            "Una contraoferta que podrías pedir",
          ],
          explanation:
            "Tu BATNA es lo que realmente harás si no hay acuerdo; en este caso, quedarte donde estás. Las esperanzas y las contraofertas hipotéticas no son alternativas.",
        },
        {
          prompt:
            "Una oferta está por debajo de lo que esperabas, pero es claramente mejor que tu mejor alternativa. ¿Qué sugiere pensar en términos de BATNA?",
          options: [
            "Rechazarla porque está por debajo de tu meta",
            "Aceptarla de inmediato sin conversar",
            "Tomarla en serio y seguir negociando a partir de ahí, porque supera tu alternativa",
            "Esperar en silencio a que la otra parte la mejore",
          ],
          explanation:
            "Comparar frente a tu BATNA y no frente a tus esperanzas evita que rechaces un acuerdo que te deja mejor. Aun así puedes negociar, desde una base realista.",
        },
        {
          prompt: "Antes de negociar con un proveedor, ¿qué paso mejora más tu posición?",
          options: [
            "Conseguir una cotización creíble de un segundo proveedor",
            "Preparar una exigencia inicial firme",
            "Ensayar frases persuasivas",
            "Agendar la reunión cerca del cierre de trimestre del proveedor",
          ],
          explanation:
            "Una alternativa real fortalece tu BATNA, la fuente central de poder de negociación. Las tácticas ayudan en el margen; las alternativas cambian el equilibrio.",
        },
      ],
      action: {
        title: "Escribe tu punto de retirada",
        description:
          "Elige una negociación en la que estés o que esperes pronto: una compra, un plazo, un sueldo, el alcance de un proyecto. Anota tus alternativas realistas, elige tu BATNA y fija el punto por debajo del cual preferirías optar por ella.",
        successCriteria:
          "Tienes una nota escrita que nombra tu BATNA en una frase concreta y el umbral a partir del cual te retirarías.",
      },
    },
  },
};
