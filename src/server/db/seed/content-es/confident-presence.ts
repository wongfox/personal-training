import type { JourneyTranslation } from "../translations";

export const confidentPresenceEs: JourneyTranslation = {
  title: "Presencia segura",
  subtitle: "Actúa con convicción serena, incluso bajo presión.",
  description:
    "Nueve sesiones prácticas sobre el juego interior, la voz y el cuerpo que sostienen tu mensaje, y los momentos que te ponen a prueba: tomar la palabra, enfrentar objeciones y recuperarte de los errores. Aquí la confianza es un conjunto de conductas que se entrenan, no un rasgo de personalidad.",
  modules: [
    {
      title: "El juego interior",
      description:
        "La confianza empieza antes de hablar. Aprende a trabajar con los nervios en lugar de luchar contra ellos, a preparar tu estado a propósito y a guiarte a ti mismo en los momentos de presión.",
    },
    {
      title: "Voz y cuerpo",
      description:
        "La gente percibe la confianza antes de procesar tus palabras. Aprende a usar las pausas, a cerrar bien tus frases y a mantener una presencia física estable y atenta.",
    },
    {
      title: "Sostener tu postura",
      description:
        "La confianza se pone a prueba en momentos concretos. Aprende a hablar temprano, a responder a las objeciones sin ceder ni pelear, y a recuperarte con limpieza cuando te equivocas.",
    },
  ],
  lessons: {
    /* ───────────────────────── Module 1 ───────────────────────── */
    "conf-reframe-nerves": {
      title: "Reinterpreta los nervios como preparación",
      description: "Trata las señales físicas de los nervios como energía para rendir, no como una advertencia.",
      content: {
        hook: "Antes de una presentación importante, la mayoría de la gente se dice que tiene que calmarse. Rara vez funciona, y hay una instrucción mejor.",
        whyItMatters:
          "El corazón acelerado, la cara caliente y las manos inquietas aparecen antes de entrevistas, pitches y conversaciones difíciles. Si los interpretas como prueba de que no estás preparado, empeoran. Si los interpretas como tu cuerpo alistándose para rendir, puedes usarlos.",
        coreConcept: {
          title: "Las mismas señales, otra historia",
          body: [
            "La ansiedad y el entusiasmo se sienten notablemente parecidos en el cuerpo: ambos aceleran el corazón y agudizan la atención. La principal diferencia es la historia que te cuentas sobre ellos.",
            "Intentar pasar a la fuerza de una activación alta a la calma es un salto grande, y suele fallar. Pasar de 'ansioso' a 'listo' o 'entusiasmado' mantiene la energía y cambia su dirección.",
            "Esto no es fingir que te sientes bien. Es elegir la interpretación que te ayuda a rendir: 'Mi cuerpo se está preparando para algo que importa'.",
          ],
          keyPoints: [
            "Los nervios y el entusiasmo comparten las mismas señales físicas.",
            "Forzar la calma es difícil; redirigir la energía es más fácil.",
            "Nómbralo como preparación: 'Me estoy alistando para esto'.",
            "Los nervios suelen significar que te importa el resultado.",
          ],
        },
        expertInsight: {
          text: "Una investigación de Alison Wood Brooks encontró que las personas que reinterpretaban la ansiedad previa como entusiasmo, por ejemplo diciendo 'Estoy entusiasmado', tendían a rendir mejor en tareas como hablar en público que quienes intentaban calmarse.",
          source: "Alison Wood Brooks",
          sourceDetail: "Investigación sobre la reinterpretación de la ansiedad, Journal of Experimental Psychology: General (2014)",
        },
        example: {
          situation: "Hana, consultora, está a punto de presentar sus hallazgos al directorio de un cliente.",
          before:
            "Piensa: \"El corazón me late a mil. Me voy a quedar en blanco. Necesito calmarme ya.\" Trata de ralentizarlo todo y se pone más tensa.",
          after:
            "Piensa: \"El corazón me late fuerte porque esto importa. Eso es energía. Estoy lista para usarla.\" Respira lento una vez y abre con su primera frase.",
          whyItWorks:
            "Hana no lucha contra las señales de su cuerpo. Las reinterpreta como combustible, y eso la mantiene enfocada en la audiencia en lugar de en reprimir sus nervios.",
        },
        reflectionPrompt:
          "¿Qué señales físicas te avisan de que tienes nervios? ¿Qué significarían esas mismas señales si las interpretaras como preparación?",
      },
      exercise: {
        title: "Reescribe tu guion interno",
        description: "Convierte un diálogo interno ansioso en una frase de preparación.",
        config: {
          type: "rewrite",
          instruction:
            "Reescribe este monólogo interno antes de una presentación. Mantén la honestidad sobre las señales físicas, pero reinterprétalas como preparación.",
          original:
            "Ay no, me tiemblan las manos y el corazón me late a mil. Todos van a ver lo nervioso que estoy. No estoy listo para esto. Necesito calmarme o lo voy a arruinar.",
          tips: [
            "Reconoce las señales físicas; no las niegues.",
            "Reinterprétalas como energía o entusiasmo.",
            "Termina enfocándote en tu primera acción.",
          ],
          maxWords: 35,
          keywords: ["entusiasm", "listo", "lista", "energía", "importa"],
          modelAnswer:
            "El corazón me late rápido porque esto me importa. Es energía, y la voy a usar. Me entusiasma compartir esto. Primera frase: la recomendación.",
        },
      },
      quiz: [
        {
          prompt:
            "Faltan cinco minutos para una entrevista de trabajo y el corazón te late con fuerza. ¿Qué frase interna tiene más probabilidades de ayudarte?",
          options: [
            "\"Cálmate, cálmate, cálmate.\"",
            "\"Esto es entusiasmo; es mi cuerpo preparándose.\"",
            "\"No pienses en eso.\"",
            "\"No importa si fallo.\"",
          ],
          explanation:
            "Reinterpretar la activación como entusiasmo mantiene la energía y la dirige hacia la tarea. Forzar la calma o reprimir pensamientos suele ser contraproducente.",
        },
        {
          prompt: "¿Por qué suele ser más fácil pasar de la ansiedad al entusiasmo que a la calma?",
          options: [
            "El entusiasmo no requiere ningún esfuerzo",
            "Ambos son estados de alta energía, así que cambias la interpretación, no el nivel de activación",
            "La calma es una emoción negativa",
            "El entusiasmo te hace menos consciente de la audiencia",
          ],
          explanation:
            "La ansiedad y el entusiasmo comparten señales físicas similares. Cambiar la etiqueta es un paso pequeño; bajar a la calma es uno grande.",
        },
        {
          prompt: "Un colega dice que reinterpretar los nervios es 'mentirte a ti mismo'. ¿Cuál es la mejor respuesta?",
          options: [
            "Tiene razón; solo funciona si te lo crees por completo",
            "No es negación: reconoces las señales y eliges una interpretación más útil",
            "Solo funciona para personas extrovertidas",
            "Se trata de ocultarle los nervios a la audiencia",
          ],
          explanation:
            "Reinterpretar no niega lo que sientes. Acepta las señales y cambia lo que significan para ti.",
        },
      ],
      action: {
        title: "Di 'Es energía' antes de un momento clave",
        description:
          "Antes de tu próximo momento de nervios de hoy (una llamada, una reunión, hacer una pregunta), nota una señal física y dite: \"Esto es energía. Puedo usarla.\"",
        successCriteria:
          "Usaste la reinterpretación antes de al menos un momento real y anotaste si cambió tu forma de empezar.",
      },
    },

    "conf-pre-meeting-routine": {
      title: "Crea una rutina de dos minutos antes de cada reunión",
      description: "Usa una rutina corta y repetible para llegar a los momentos importantes con foco, no con la cabeza en otra parte.",
      content: {
        hook: "Mucha gente entra a reuniones importantes directo desde su bandeja de entrada, todavía medio leyendo el último correo. Después se pregunta por qué se siente dispersa.",
        whyItMatters:
          "Tu estado al entrar a una sala suele definir cómo van los primeros minutos. Una rutina corta y constante te da una forma confiable de activarte, incluso en un mal día o después de una reunión difícil.",
        coreConcept: {
          title: "Los mismos pasos, siempre",
          body: [
            "Una rutina previa es una secuencia corta que repites antes de los momentos que importan. Como es familiar, le indica a tu mente que es hora de enfocarse, y les da a los nervios algo útil que hacer.",
            "Una versión práctica toma dos minutos: cierra las demás pestañas, respira lento varias veces con exhalaciones más largas, recuerda tu punto clave y decide tu primera frase.",
            "El poder está en la repetición, no en los pasos específicos. Elige una secuencia que de verdad puedas hacer en un pasillo o antes de una videollamada, y mantenla igual.",
          ],
          keyPoints: [
            "Las rutinas convierten el foco en un hábito, no en una esperanza.",
            "Elimina distracciones, respira lento, recuerda tu punto.",
            "Decide tu primera frase antes de entrar.",
            "Que sea corta e idéntica cada vez.",
          ],
        },
        expertInsight: {
          text: "La psicología del deporte lleva mucho tiempo estudiando las rutinas previas a la ejecución, como la secuencia constante que siguen los deportistas antes de un tiro libre o un saque. La investigación en esta área sugiere que las rutinas bien practicadas ayudan a manejar la atención y la activación bajo presión.",
          source: "Investigación en psicología del deporte sobre rutinas previas a la ejecución",
        },
        example: {
          situation: "Kenji, gerente de ventas, tiene llamadas seguidas y un pitch clave con un cliente a las 3 p. m.",
          before:
            "Termina una llamada interna tensa a las 2:59, entra al pitch mientras sigue respondiendo un mensaje y abre con \"Perdón, denme un segundo…\"",
          after:
            "A las 2:55 cierra todo, respira lento cinco veces, relee su objetivo de una línea para la llamada y dice su frase de apertura una vez. A las 3:00 empieza: \"Gracias por su tiempo. Hoy quiero mostrarles cómo reducir a la mitad el tiempo de onboarding.\"",
          whyItWorks:
            "La rutina crea un corte limpio entre la llamada anterior y esta. Kenji llega con la atención y la apertura listas.",
        },
        reflectionPrompt:
          "¿Qué sueles hacer en los dos minutos previos a una reunión importante? ¿Qué cambiarías?",
      },
      exercise: {
        title: "Ordena la rutina",
        description: "Organiza una rutina de dos minutos antes de una reunión en la secuencia más eficaz.",
        config: {
          type: "order",
          instruction:
            "Pon estos pasos en el orden que mejor te prepara en los dos minutos previos a una reunión importante.",
          items: [
            "Cierra tu correo, el chat y las pestañas que no tengan que ver.",
            "Respira lento cinco veces, haciendo cada exhalación más larga que la inhalación.",
            "Recuerda el único resultado que quieres de esta reunión.",
            "Di tu frase de apertura una vez, en voz baja o mentalmente.",
            "Entra a la sala o a la llamada y di esa apertura.",
          ],
          explanation:
            "Primero eliminas distracciones, luego calmas el cuerpo, después enfocas la mente en el objetivo y finalmente ensayas el primer movimiento. Cada paso se apoya en el anterior, y el último es acción, no más reflexión.",
        },
      },
      quiz: [
        {
          prompt: "¿Qué hace que una rutina previa a una reunión sea eficaz con el tiempo?",
          options: [
            "Cambiarla cada vez para que siga siendo interesante",
            "Repetir la misma secuencia corta de forma constante",
            "Hacerla lo más larga posible",
            "Hacerla solo para las reuniones más importantes del año",
          ],
          explanation:
            "La constancia es lo que convierte la rutina en una señal confiable de foco. Una secuencia corta que sí haces le gana a una elaborada que te saltas.",
        },
        {
          prompt: "Tienes 60 segundos antes de una videollamada. ¿Qué paso aporta más?",
          options: [
            "Revisar el correo una última vez",
            "Decidir tu frase de apertura",
            "Releer toda la agenda palabra por palabra",
            "Ajustar tu fondo",
          ],
          explanation:
            "Saber tu primera frase elimina el momento de incertidumbre más estresante y te permite empezar con intención.",
        },
        {
          prompt: "¿Por qué incluir respiraciones lentas con exhalaciones más largas en una rutina?",
          options: [
            "Hacen que los demás te vean tranquilo",
            "Las exhalaciones lentas y prolongadas se usan ampliamente para ayudar a calmar el cuerpo bajo estrés",
            "Reemplazan la necesidad de preparar el contenido",
            "Garantizan que no vas a sentir nervios",
          ],
          explanation:
            "Respirar lento con exhalaciones más largas es una forma común y práctica de bajar la tensión física. Ayuda; no elimina los nervios.",
        },
      ],
      action: {
        title: "Haz tu rutina una vez",
        description:
          "Antes de una reunión o llamada de hoy, tómate dos minutos para hacer la rutina: elimina distracciones, respira lento cinco veces, recuerda tu objetivo y di tu frase de apertura.",
        successCriteria:
          "Completaste los cuatro pasos antes de una reunión real y abriste con la frase que preparaste.",
      },
    },

    "conf-coach-yourself": {
      title: "Háblate como lo haría un coach",
      description: "Usa el diálogo interno con distancia para pensar con claridad cuando la presión endurece tu voz interior.",
      content: {
        hook: "Nunca le dirías a un colega: \"Vas a hacer el ridículo\". Sin embargo, mucha gente se dice exactamente eso antes de un momento importante.",
        whyItMatters:
          "Bajo presión, el diálogo interno suele volverse crítico y catastrófico, y ese ruido desplaza el pensamiento claro. Un pequeño cambio en cómo te hablas puede convertir al crítico interno en un coach interno.",
        coreConcept: {
          title: "Toma distancia cambiando el pronombre",
          body: [
            "Cuando piensas en primera persona ('No puedo con esto'), estás dentro de la emoción. Hablarte por tu nombre o de 'tú' ('María, te preparaste para esto') crea un poco de distancia, como si aconsejaras a un amigo.",
            "Esa distancia te ayuda a ver la situación con más objetividad. La mayoría de la gente da mejores consejos a otros que a sí misma; esto aprovecha esa habilidad.",
            "Un buen diálogo interno de coach es específico y mira hacia adelante: qué hacer a continuación, no cómo te sientes al respecto. 'Conoces los números. Empieza por la recomendación.'",
          ],
          keyPoints: [
            "El diálogo interno en primera persona te mantiene dentro de la emoción.",
            "Usa tu nombre o el 'tú' para crear una distancia útil.",
            "Guíate como guiarías a un amigo.",
            "Enfócate en la siguiente acción, no en el resultado que temes.",
          ],
        },
        expertInsight: {
          text: "El psicólogo Ethan Kross y sus colegas han estudiado el 'diálogo interno con distancia', como usar tu propio nombre o la segunda persona. Su investigación sugiere que este pequeño cambio puede ayudar a regular las emociones y a pensar con más claridad en situaciones estresantes.",
          source: "Ethan Kross",
          sourceDetail: "Cháchara (Chatter, 2021) e investigación relacionada sobre el autodistanciamiento",
        },
        example: {
          situation: "Rafael, líder de equipo, está a punto de darle un feedback difícil a una colaboradora de alto desempeño.",
          before:
            "\"Odio esto. Lo voy a decir mal, ella se va a molestar y no voy a saber qué hacer.\"",
          after:
            "\"Rafael, ya has hecho esto antes. Te importa su crecimiento. Empieza con el ejemplo concreto y después escucha.\"",
          whyItWorks:
            "La voz de coach es más tranquila y práctica. Le recuerda a Rafael su intención y le da un primer movimiento en lugar de una lista de miedos.",
        },
        reflectionPrompt:
          "¿Qué suele decirte tu crítico interno antes de un momento de mucha presión? ¿Qué te diría en cambio un coach que te apoya?",
      },
      exercise: {
        title: "Elige la voz de coach",
        description: "Escoge el diálogo interno con más probabilidades de ayudar bajo presión.",
        config: {
          type: "choice",
          scenario:
            "Elena está a punto de presentar los resultados trimestrales a la alta dirección. Un indicador está por debajo de la meta, y le preocupa que la cuestionen.",
          question: "¿Qué frase interna tiene más probabilidades de ayudarla a desempeñarse bien?",
          options: [
            {
              text: "\"Elena, sabes por qué el número está bajo. Dilo primero y explica la solución.\"",
              quality: "best",
              feedback:
                "Con distancia, específica y enfocada en la acción. Convierte la preocupación en un plan para el momento exacto que teme.",
            },
            {
              text: "\"Solo me queda esperar que nadie pregunte por ese número.\"",
              quality: "weak",
              feedback:
                "Esperar que no llegue la pregunta la deja sin preparación y más ansiosa cuando llegue.",
            },
            {
              text: "\"Me va a ir bien, me va a ir bien.\"",
              quality: "ok",
              feedback:
                "Tranquilizador, pero vago y todavía en primera persona. No le dice qué hacer.",
            },
            {
              text: "\"No puedo creer que no llegué a la meta. Van a pensar que soy incompetente.\"",
              quality: "weak",
              feedback:
                "La autocrítica y el suponer lo que piensan los demás aumentan la presión y desvían la atención de la presentación.",
            },
          ],
        },
      },
      quiz: [
        {
          prompt: "¿Cuál es un ejemplo de diálogo interno con distancia?",
          options: [
            "\"Tengo muchísimos nervios ahora mismo.\"",
            "\"¿Por qué siempre arruino esto?\"",
            "\"Sam, te preparaste. Empieza por el resumen.\"",
            "\"Ojalá que esto salga bien.\"",
          ],
          explanation:
            "Usar tu propio nombre y darte una instrucción concreta crea distancia y te orienta a la acción.",
        },
        {
          prompt: "¿Por qué suele ayudar el diálogo interno con distancia?",
          options: [
            "Suprime por completo las emociones",
            "Te permite ver la situación más como un asesor que como un participante",
            "Hace que los demás te vean seguro",
            "Solo funciona si lo dices en voz alta",
          ],
          explanation:
            "Tomar distancia te da la perspectiva que naturalmente le ofrecerías a un amigo: más tranquila, más objetiva y más práctica.",
        },
        {
          prompt: "¿Qué hace más útil el diálogo interno de coach justo antes de un momento importante?",
          options: [
            "Enumerar todo lo que podría salir mal",
            "Repetir afirmaciones generales",
            "Nombrar la siguiente acción concreta",
            "Pensar en lo que otros podrían estar juzgando",
          ],
          explanation:
            "Una acción concreta le da a tu atención un lugar útil adonde ir. La preocupación y el consuelo vago no.",
        },
      ],
      action: {
        title: "Guíate por tu nombre",
        description:
          "Antes de un momento de hoy que te incomode, háblate en silencio por tu nombre y date una instrucción concreta (p. ej., \"Ana, abre con el pedido.\").",
        successCriteria:
          "Usaste al menos una vez el diálogo interno con tu nombre y una instrucción concreta, y anotaste cómo te sentiste después.",
      },
    },

    /* ───────────────────────── Module 2 ───────────────────────── */
    "conf-power-of-the-pause": {
      title: "Reemplaza las muletillas por pausas",
      description: "Cambia los 'eh', 'o sea' y '¿me entiendes?' por silencios breves que transmiten serenidad.",
      content: {
        hook: "El silencio se siente eterno para quien habla y reflexivo para quien escucha. Las muletillas aparecen cuando lo olvidamos.",
        whyItMatters:
          "Unas pocas muletillas son normales e inofensivas. Un flujo constante hace que incluso las buenas ideas suenen improvisadas, y es de lo primero que nota quien te escucha cuando hablas bajo presión. Las pausas le dan peso a tu mensaje y te dan tiempo para pensar.",
        coreConcept: {
          title: "Deja que el silencio trabaje",
          body: [
            "Muletillas como 'eh', 'este', 'o sea', 'bueno' y '¿me entiendes?' suelen aparecer cuando tu boca va más rápido que tu pensamiento. Llenan el hueco porque el silencio se siente riesgoso.",
            "La solución no es hablar más rápido ni esforzarte más. Es cerrar la boca al terminar una idea y hacer una pausa antes de la siguiente. Una pausa de uno o dos segundos suena deliberada para la audiencia.",
            "Las pausas también son énfasis. Un breve silencio antes de una cifra clave o después de una recomendación le dice a la gente: esto importa.",
          ],
          keyPoints: [
            "Las muletillas llenan un silencio al que le temes.",
            "Termina la idea, cierra la boca, haz una pausa.",
            "Las pausas se perciben como serenidad, no como duda.",
            "Haz una pausa antes o después de la frase que quieres que recuerden.",
          ],
        },
        expertInsight: {
          text: "Los clubes de Toastmasters usan desde hace mucho el rol de 'contador de muletillas' (Ah-Counter): un miembro cuenta cada muletilla que usa quien habla y luego le da el reporte. La práctica refleja un principio simple: no puedes cambiar un hábito que no notas, así que primero viene la conciencia.",
          source: "Toastmasters International",
          sourceDetail: "El rol de contador de muletillas (Ah-Counter) en las reuniones",
        },
        example: {
          situation: "Grace, analista de producto, presenta una recomendación a su equipo.",
          before:
            "\"Este, eh, básicamente lo que encontramos es que, o sea, los usuarios abandonan en el checkout, y, ¿me entiendes?, creemos que, eh, el problema es el costo de envío, así que, bueno, eso.\"",
          after:
            "\"Los usuarios abandonan en el checkout. (pausa) La razón principal es el costo de envío que se muestra en el último paso. (pausa) Recomendamos mostrarlo desde el inicio.\"",
          whyItWorks:
            "El mismo contenido, sin muletillas y con pausas deliberadas, suena como el hallazgo de alguien que está seguro de su análisis.",
        },
        reflectionPrompt:
          "¿Qué muletilla usas más? ¿En qué tipo de momentos aparece con más frecuencia?",
      },
      exercise: {
        title: "Limpia tu forma de decirlo",
        description: "Reescribe una respuesta llena de muletillas como tres frases nítidas.",
        config: {
          type: "rewrite",
          instruction:
            "Reescribe esta respuesta hablada tal como te gustaría decirla: sin muletillas, con frases cortas, cada una con una idea completa.",
          original:
            "Este, eh, bueno, básicamente el proyecto está, o sea, más o menos en camino, diría yo, y, ¿me entiendes?, lo único es que, eh, la fase de pruebas podría tomar, como, un poco más de lo que pensábamos, así que, bueno, ahí estamos más o menos.",
          tips: [
            "Elimina cada 'eh', 'este', 'o sea', '¿me entiendes?' y 'bueno'.",
            "Usa frases cortas; cada una termina con una pausa natural.",
            "Plantea primero el estado y luego el riesgo.",
          ],
          maxWords: 30,
          keywords: ["según lo previsto", "a tiempo", "en camino", "pruebas", "riesgo"],
          modelAnswer:
            "El proyecto va según lo previsto. El único riesgo son las pruebas, que podrían tomar una semana más de lo planeado. Confirmo la nueva fecha el viernes.",
        },
      },
      quiz: [
        {
          prompt: "¿Cuál suele ser la forma más eficaz de reducir las muletillas?",
          options: [
            "Hablar más rápido para que no haya huecos",
            "Memorizar toda tu presentación palabra por palabra",
            "Terminar cada idea, cerrar la boca y hacer una pausa",
            "Reemplazar 'eh' por 'bueno'",
          ],
          explanation:
            "Las muletillas llenan huecos. Permitirte pausas cortas elimina la necesidad de usarlas. Hablar más rápido o memorizar tiende a crear muletillas nuevas.",
        },
        {
          prompt: "¿Cómo suele percibir la audiencia una pausa de dos segundos?",
          options: [
            "Como que olvidaste qué decir",
            "Como algo deliberado y sereno",
            "Como una falta de respeto",
            "Como un problema técnico",
          ],
          explanation:
            "Las pausas se sienten largas para quien habla, pero quien escucha suele percibirlas como reflexión y control.",
        },
        {
          prompt: "¿Dónde es más útil una pausa para dar énfasis?",
          options: [
            "En medio de una palabra",
            "Justo antes o después de tu punto clave",
            "Solo al final de una presentación",
            "Antes de cada frase por igual",
          ],
          explanation:
            "Una pausa alrededor de tu frase clave señala importancia y le da a la gente tiempo para asimilarla.",
        },
      ],
      action: {
        title: "Sé tu propio contador de muletillas",
        description:
          "Grábate (nota de voz o video) respondiendo, durante un minuto aproximadamente, una pregunta que te hacen seguido en el trabajo. Cuenta tus muletillas y luego vuelve a grabarlo con pausas deliberadas.",
        successCriteria:
          "Hiciste dos grabaciones y la segunda tiene menos muletillas que la primera.",
      },
    },

    "conf-land-your-sentences": {
      title: "Aterriza tus frases",
      description: "Termina tus afirmaciones con un tono estable o descendente para que tu punto suene a punto, no a pregunta.",
      content: {
        hook: "\"¿Creo que deberíamos lanzar en mayo?\" Las palabras dicen recomendación. El tono ascendente dice pedido de permiso.",
        whyItMatters:
          "La forma en que termina una frase define cómo se recibe. Cuando una recomendación sube al final, quien escucha puede percibir inseguridad o una solicitud de aprobación. Aterrizar tus frases clave hace que tu opinión suene firme sin que tengas que hablar más fuerte.",
        coreConcept: {
          title: "Las afirmaciones bajan, las preguntas suben",
          body: [
            "En general, un tono que sube al final de una frase indica una pregunta o una invitación a responder. Un tono estable o descendente suele indicar que terminaste una idea.",
            "Mucha gente usa un tono ascendente en sus afirmaciones, sobre todo cuando quiere sonar amable o confirmar que los demás están de acuerdo. En una charla casual no hay problema. En una recomendación o una decisión, puede hacer que tu opinión suene tentativa.",
            "Practica aterrizar la última palabra de tus frases clave: deja que el tono baje, se asiente y se detenga. Luego haz una pausa. Si quieres opiniones, haz una pregunta real por separado.",
          ],
          keyPoints: [
            "Final ascendente = pregunta; final descendente o estable = afirmación.",
            "Aterriza tus recomendaciones; guarda el tono ascendente para las preguntas reales.",
            "Asienta la última palabra y luego haz una pausa.",
            "Pide opiniones con una pregunta aparte y clara.",
          ],
        },
        expertInsight: {
          text: "Los lingüistas que estudian el 'uptalk', la entonación ascendente en las afirmaciones, señalan que puede cumplir funciones sociales útiles, como comprobar que el otro entiende o conservar el turno de palabra. También señalan que quien escucha puede interpretarla como inseguridad, y que las percepciones varían según la comunidad y el contexto.",
          source: "Investigación lingüística sobre el uptalk (high rising terminal)",
        },
        example: {
          situation: "Chloe, ejecutiva de cuentas, le recomienda a su director un precio de renovación.",
          before:
            "\"Entonces, ¿recomiendo mantener el precio del año pasado? ¿Porque es una cuenta estratégica? ¿Y podrían irse?\"",
          after:
            "\"Recomiendo mantener el precio del año pasado. Es una cuenta estratégica, y un aumento podría llevarlos a evaluar alternativas. ¿Ves alguna razón para no hacerlo?\"",
          whyItWorks:
            "Ahora las afirmaciones de Chloe suenan a afirmaciones, y su pedido de opinión es una sola pregunta genuina. Su director escucha una recomendación segura que sigue abierta a cuestionamientos.",
        },
        reflectionPrompt:
          "¿En qué contextos notas que tus frases suben al final? ¿Qué podrías estar buscando en esos momentos?",
      },
      exercise: {
        title: "Identifica la frase bien aterrizada",
        description: "Elige la forma de decirlo que suena más firme y aun así invita a opinar.",
        config: {
          type: "choice",
          scenario:
            "Estás recomendando una nueva herramienta a tu equipo. Quieres que tu recomendación suene firme y, aun así, escuchar las dudas.",
          question: "¿Qué forma de decirlo funciona mejor? (Las flechas indican el tono al final de cada frase.)",
          options: [
            {
              text: "\"¿Deberíamos cambiarnos a la nueva herramienta? ↗ ¿Es más rápida? ↗ ¿Y más barata? ↗\"",
              quality: "weak",
              feedback:
                "Todas las frases suben, así que la recomendación suena como una serie de preguntas en busca de aprobación.",
            },
            {
              text: "\"Deberíamos cambiarnos a la nueva herramienta. ↘ Es más rápida y más barata. ↘ ¿Qué dudas tienen? ↗\"",
              quality: "best",
              feedback:
                "Las afirmaciones aterrizan, y la única pregunta real sube. Suenas decidido y abierto a la vez.",
            },
            {
              text: "\"Deberíamos cambiarnos a la nueva herramienta. ↘ Es más rápida y más barata. ↘ Fin de la discusión. ↘\"",
              quality: "weak",
              feedback:
                "Aterrizado, pero cerrarte a las opiniones convierte la confianza en desdén y te hace perder apoyo.",
            },
            {
              text: "\"Tal vez podríamos pensar en la nueva herramienta. → Podría ser más rápida. →\"",
              quality: "ok",
              feedback:
                "El tono es estable, pero las palabras atenuadas siguen haciendo que suene tentativo.",
            },
          ],
        },
      },
      quiz: [
        {
          prompt: "¿Cuándo es más apropiado un tono ascendente al final de una frase?",
          options: [
            "Al plantear una recomendación",
            "Al hacer una pregunta genuina",
            "Al anunciar una decisión",
            "Al reportar una cifra",
          ],
          explanation:
            "Por convención, la entonación ascendente marca una pregunta. En las afirmaciones, puede hacer que tu opinión suene insegura.",
        },
        {
          prompt: "Quieres transmitir seguridad y, a la vez, apertura a otras opiniones. ¿Cuál es el mejor enfoque?",
          options: [
            "Hacer que todas las frases suban para sonar amable",
            "Aterrizar tu recomendación y luego hacer una pregunta clara",
            "Evitar pedir opiniones para transmitir más seguridad",
            "Hablar más fuerte en la última palabra",
          ],
          explanation:
            "Separar la afirmación de la pregunta te da claridad y apertura a la vez.",
        },
        {
          prompt: "¿Cuál es una visión equilibrada del uptalk?",
          options: [
            "Siempre es señal de poca confianza",
            "Nunca afecta cómo se percibe a las personas",
            "Puede cumplir funciones sociales, pero en afirmaciones clave puede percibirse como inseguridad",
            "Es algo exclusivo de las personas jóvenes",
          ],
          explanation:
            "El uptalk tiene funciones sociales reales, y las percepciones varían. Lo práctico es elegir tu entonación a propósito en las afirmaciones que necesitan sonar firmes.",
        },
      ],
      action: {
        title: "Aterriza tres frases",
        description:
          "En una reunión o llamada de hoy, aterriza a propósito la última palabra de al menos tres afirmaciones (deja que el tono se asiente y luego haz una pausa). Haz cualquier pregunta por separado.",
        successCriteria:
          "Aterrizaste al menos tres afirmaciones en una conversación real y mantuviste tu pregunta por separado.",
      },
    },

    "conf-grounded-presence": {
      title: "Quietud y presencia",
      description: "Usa una postura bien plantada, un contacto visual estable y menos movimientos nerviosos para transmitir la calma que quieres sentir.",
      content: {
        hook: "Bajo presión, algunas personas se encogen y otras empujan demasiado. La presencia no es ninguna de las dos cosas; es estar en la sala de forma plena y tranquila.",
        whyItMatters:
          "Antes de procesar tus palabras, la gente lee tu cuerpo: si transmites calma, distracción o tensión. Una presencia estable y quieta hace que tu mensaje sea más fácil de creer, en persona y frente a la cámara.",
        coreConcept: {
          title: "Arraigo, apertura, conexión",
          body: [
            "La quietud transmite soltura. Moverte todo el tiempo, tocarte la cara o hacer clic con el bolígrafo aleja la atención de lo que dices. Planta los pies, o siéntate con ambos pies en el suelo, y deja que tus manos descansen cuando no estés gesticulando.",
            "La conexión viene de la atención. Mira a una persona mientras terminas una idea y luego pasa a otra. En video, mira a la cámara cuando plantees tu punto clave.",
            "No se trata de mantener una 'pose de poder'. Se trata de eliminar las pequeñas señales de incomodidad para que tu atención, y la de tu audiencia, se mantenga en la conversación.",
          ],
          keyPoints: [
            "Planta los pies; deja descansar las manos entre gestos.",
            "Termina cada idea mirando a una persona.",
            "Reduce los movimientos nerviosos que le quitan atención a tus palabras.",
            "Busca presencia, no una actuación de confianza.",
          ],
        },
        expertInsight: {
          text: "Patsy Rodenburg, coach de voz y actuación, describe tres 'círculos' de energía: retraída y hacia adentro (primer círculo), proyectada hacia los demás sin conectar (tercer círculo), y una conexión presente y en ambas direcciones (segundo círculo). Sostiene que la presencia en el segundo círculo es lo que el público experimenta como confianza genuina.",
          source: "Patsy Rodenburg",
          sourceDetail: "The Second Circle (2007)",
        },
        example: {
          situation: "Víctor, líder de finanzas, presenta un pronóstico al equipo directivo.",
          before:
            "Se balancea un poco, hace clic con el bolígrafo, mira más las diapositivas que a la sala y dice apurado la cifra final mientras mira sus notas.",
          after:
            "Planta los pies, deja el bolígrafo, mira al CEO mientras plantea el pronóstico, hace una pausa y luego se dirige al COO para hablar de los riesgos.",
          whyItWorks:
            "Su contenido no cambió en nada. Eliminar los movimientos nerviosos y sostener el contacto visual en la cifra clave hace que el pronóstico suene a algo que él respalda.",
        },
        reflectionPrompt:
          "Bajo presión, ¿tiendes a replegarte hacia adentro o a empujar hacia afuera? ¿Qué hábito físico lo delata?",
      },
      exercise: {
        title: "Diseña tu chequeo de presencia",
        description: "Crea una lista personal para revisar justo antes de hablar.",
        config: {
          type: "structure",
          framework: "Asentar – Soltar – Conectar",
          instruction:
            "Crea un chequeo de presencia breve y personal que puedas hacer en los 10 segundos previos a hablar en una reunión o llamada.",
          context:
            "Piensa en tus propios hábitos bajo presión: movimientos nerviosos, postura, adónde se va tu mirada. Haz que cada señal sea específica para ti.",
          slots: [
            {
              key: "ground",
              label: "Asentar",
              hint: "¿Cómo vas a asentar tu postura de pie o sentado? (p. ej., ambos pies apoyados, espalda contra la silla)",
              maxWords: 15,
            },
            {
              key: "release",
              label: "Soltar",
              hint: "¿Qué movimiento nervioso o tensión vas a soltar? (p. ej., dejar el bolígrafo, bajar los hombros)",
              maxWords: 15,
            },
            {
              key: "connect",
              label: "Conectar",
              hint: "¿Adónde irá tu mirada en tu punto clave? (p. ej., a una persona o a la cámara)",
              maxWords: 15,
            },
          ],
        },
      },
      quiz: [
        {
          prompt: "En una videollamada, ¿cuándo es más valioso mirar directamente a la cámara?",
          options: [
            "Durante toda la llamada, sin excepción",
            "Al plantear tu punto clave o tu recomendación",
            "Solo cuando hablan los demás",
            "Nunca; mirar las caras siempre es mejor",
          ],
          explanation:
            "Mirar a la cámara en tu frase clave crea la sensación de contacto visual cuando más importa. Mirar las caras el resto del tiempo te mantiene atento a las reacciones.",
        },
        {
          prompt: "¿Qué cambio mejora más tu presencia durante una presentación?",
          options: [
            "Mantener una postura amplia durante dos minutos antes",
            "Eliminar los movimientos nerviosos habituales y terminar cada idea mirando a una persona",
            "Moverte constantemente para mostrar energía",
            "Mantener la vista en las diapositivas para evitar errores",
          ],
          explanation:
            "La quietud y la atención directa mantienen el foco en tu mensaje. Moverte todo el tiempo o mirar fijo las diapositivas lo alejan.",
        },
        {
          prompt: "En el modelo de Rodenburg, ¿qué caracteriza la energía del 'tercer círculo'?",
          options: [
            "Replegarse y evitar la atención",
            "Proyectar energía hacia los demás sin una conexión real",
            "Una participación presente y en ambas direcciones",
            "Quietud física total",
          ],
          explanation:
            "El tercer círculo es transmitirle a la gente sin conectar con ella. Puede parecer confianza, pero se siente distante; el segundo círculo es el estado presente y en ambas direcciones.",
        },
      ],
      action: {
        title: "Haz tu chequeo de presencia",
        description:
          "Antes de hablar en una reunión o llamada de hoy, haz tu chequeo Asentar – Soltar – Conectar y luego plantea tu punto principal mirando a una persona o a la cámara.",
        successCriteria:
          "Hiciste las tres señales antes de hablar al menos una vez y sostuviste el contacto visual durante tu punto clave.",
      },
    },

    /* ───────────────────────── Module 3 ───────────────────────── */
    "conf-speak-up-early": {
      title: "Habla en los primeros diez minutos",
      description: "Haz tu primer aporte temprano para que el silencio no se vuelva costumbre.",
      content: {
        hook: "Cuanto más tiempo pasas en silencio en una reunión, más alta se siente la vara para tu primer comentario. Para el minuto 40, tiene que ser brillante.",
        whyItMatters:
          "Las ideas que se quedan en tu cabeza no cuentan. Muchos profesionales capaces pasan desapercibidos simplemente porque hablan poco o tarde. Aportar temprano hace más fácil seguir aportando, y muestra tu compromiso.",
        coreConcept: {
          title: "Baja la vara para tu primer aporte",
          body: [
            "Tu primer comentario no necesita ser una gran idea. Retomar el punto de alguien, hacer una pregunta aclaratoria o resumir la discusión cuentan, y rompen el silencio.",
            "Esperar el momento perfecto suele significar esperar para siempre. Decide antes de la reunión que vas a hablar dentro de los primeros diez minutos.",
            "Prepara un aporte con anticipación: una pregunta, un dato o una opinión sobre un punto de la agenda. Tenerlo listo elimina la mayor parte de la duda.",
          ],
          keyPoints: [
            "Cuanto más dura el silencio, más cuesta romperlo.",
            "Una pregunta o retomar un punto cuenta como primer aporte.",
            "Comprométete a hablar dentro de los primeros diez minutos.",
            "Prepara un punto antes de entrar.",
          ],
        },
        expertInsight: {
          text: "El trabajo de Amy Edmondson sobre la seguridad psicológica muestra que las personas sopesan constantemente el riesgo personal de hablar frente a sus beneficios, y a menudo eligen el silencio. Los costos de quedarse callado suelen ser invisibles: la idea que nunca se escuchó simplemente desaparece.",
          source: "Amy Edmondson",
          sourceDetail: "La organización sin miedo (The Fearless Organization, 2018)",
        },
        example: {
          situation: "Aisha, analista recién incorporada, asiste a una reunión semanal de planificación con gerentes senior.",
          before:
            "Espera un momento en que su idea suene lo bastante inteligente. La reunión termina. A la semana siguiente, alguien plantea una idea parecida.",
          after:
            "A los cinco minutos, dice: \"Retomando el punto de Mark, los datos de cancelación muestran que la mayoría de las bajas ocurre en el segundo mes. ¿Deberíamos revisar primero el onboarding?\"",
          whyItWorks:
            "Aisha retoma un punto existente, agrega un dato y hace una pregunta clara. Es de bajo riesgo, realmente útil y hace que su voz entre temprano en la sala.",
        },
        reflectionPrompt:
          "¿En qué reunión recurrente hablas menos? ¿Qué historia te cuentas sobre por qué?",
      },
      exercise: {
        title: "Convierte una intervención tímida en un aporte",
        description: "Reescribe un comentario vacilante como un aporte claro y temprano.",
        config: {
          type: "rewrite",
          instruction:
            "Reescribe este comentario para que retome la discusión, agregue un punto y termine con una pregunta clara.",
          original:
            "Perdón, seguro es una pregunta tonta y quizás alguien ya lo mencionó, pero solo quería preguntar, eh, ¿tal vez podríamos pensar en algún momento en el lado del cliente?",
          tips: [
            "Elimina la disculpa y la autocrítica.",
            "Conecta con lo que se acaba de decir ('Retomando…').",
            "Termina con una pregunta específica.",
          ],
          maxWords: 35,
          requireQuestion: true,
          keywords: ["retomando", "cliente", "deberíamos", "cómo"],
          modelAnswer:
            "Retomando ese punto, ¿cómo afectará este cambio a los clientes en su primera semana? ¿Deberíamos probarlo con un grupo pequeño antes de lanzarlo?",
        },
      },
      quiz: [
        {
          prompt: "¿Cuál es un primer aporte de bajo riesgo pero valioso en una reunión?",
          options: [
            "Esperar hasta tener una propuesta totalmente desarrollada",
            "Una pregunta aclaratoria que retome el punto de alguien",
            "Quedarte en silencio para observar la dinámica",
            "Discrepar con fuerza con la persona de mayor rango",
          ],
          explanation:
            "Una pregunta aclaratoria aporta valor, muestra compromiso y rompe tu silencio sin exigir una idea perfecta.",
        },
        {
          prompt: "¿Por qué cuesta más hablar cuanto más tiempo pasas en silencio?",
          options: [
            "Porque las reuniones se vuelven más técnicas con el tiempo",
            "Porque la vara que percibes para tu primer comentario no deja de subir",
            "Porque los demás dejan de escuchar después de diez minutos",
            "Porque las personas senior hablan al final",
          ],
          explanation:
            "Un silencio largo hace sentir que tu primer comentario debe justificar la espera. Hablar temprano mantiene la vara en un nivel realista.",
        },
        {
          prompt: "Según el trabajo de Edmondson, ¿por qué la gente suele quedarse callada en el trabajo?",
          options: [
            "No tiene ideas",
            "Sopesa el riesgo personal de hablar frente al beneficio y elige la seguridad",
            "Es introvertida por naturaleza",
            "Prefiere la comunicación escrita",
          ],
          explanation:
            "El silencio suele ser una respuesta racional a un riesgo interpersonal percibido. Reconocer ese cálculo te ayuda a elegir distinto.",
        },
      ],
      action: {
        title: "Habla dentro de los primeros diez minutos",
        description:
          "Antes de tu próxima reunión de hoy, anota una pregunta o un punto. Luego di algo, aunque sea retomar brevemente un punto o hacer una pregunta, dentro de los primeros diez minutos.",
        successCriteria: "Hiciste un aporte en los primeros diez minutos de una reunión real.",
      },
    },

    "conf-handle-pushback": {
      title: "Maneja las objeciones sin ceder ni pelear",
      description: "Responde a los cuestionamientos reconociendo, sosteniendo tu postura e invitando al siguiente paso.",
      content: {
        hook: "Cuando alguien te cuestiona, se activan dos reflejos: ceder para acabar con la incomodidad, o atrincherarte para ganar. Ninguno de los dos es confianza.",
        whyItMatters:
          "Las objeciones son parte normal de la toma de decisiones. Cómo respondes muestra si tu opinión resiste la presión. Ceder le enseña a la gente que tus posturas son negociables; pelear le enseña que no se te puede cuestionar.",
        coreConcept: {
          title: "Reconoce, sostén, invita",
          body: [
            "Primero, reconoce la preocupación detrás de la objeción. 'Es una preocupación válida sobre el costo' muestra que la escuchaste y baja la tensión sin conceder nada.",
            "Luego sostén tu postura, o ajústala solo si te dieron una razón real para hacerlo. Reafirma tu opinión y la razón clave con calma, sin repetirlo todo.",
            "Por último, invita a un siguiente paso: una pregunta, una prueba o un criterio. '¿Qué necesitarías ver para sentirte cómodo?' lleva la conversación de posturas opuestas a resolver el problema juntos.",
          ],
          keyPoints: [
            "Reconoce la preocupación antes de responder.",
            "Cambia de opinión por información nueva, no por incomodidad.",
            "Reafirma tu postura de forma breve y tranquila.",
            "Invita a un criterio, una prueba o un siguiente paso.",
          ],
        },
        expertInsight: {
          text: "Roger Fisher y William Ury proponen separar a las personas del problema y enfocarse en los intereses de fondo en lugar de en posiciones fijas. Ante una objeción, eso significa tratar a la otra persona como una aliada para resolver su preocupación, no como un rival a vencer.",
          source: "Roger Fisher y William Ury",
          sourceDetail: "Obtenga el sí (Getting to Yes, 1981)",
        },
        example: {
          situation:
            "Mei, gerente de proyecto, propone un retraso de dos semanas. Una líder senior involucrada responde: \"Eso es inaceptable. Se lo prometimos al cliente.\"",
          before:
            "Ceder: \"Tienes razón, perdón, ya veremos cómo lo hacemos.\" O pelear: \"Bueno, si nos hubieras dado las especificaciones a tiempo, no estaríamos aquí.\"",
          after:
            "\"El compromiso con el cliente importa, y lo tomo en serio. Aun así, recomiendo el retraso: entregar ahora pone en riesgo una falla en su entorno productivo. ¿Qué nos ayudaría a manejarlo con ellos: una entrega parcial o una llamada tuya?\"",
          whyItWorks:
            "Mei reconoce la preocupación real de su interlocutora, sostiene su postura con una razón clara y ofrece dos siguientes pasos concretos. La conversación pasa del 'si' al 'cómo'.",
        },
        reflectionPrompt:
          "Ante una objeción, ¿tu reflejo es ceder o pelear? Recuerda un momento concreto y lo que dijiste.",
      },
      exercise: {
        title: "Estructura tu respuesta a una objeción",
        description: "Arma una respuesta tranquila en tres partes ante un cuestionamiento real.",
        config: {
          type: "structure",
          framework: "Reconocer – Sostener – Invitar",
          instruction:
            "Propusiste contratar a un consultor externo para un proyecto de tres meses. Tu jefe responde: \"No tenemos presupuesto para eso.\" Arma tu respuesta.",
          context:
            "Crees que el consultor cuesta menos que el retraso que enfrentará el equipo sin capacidad adicional.",
          slots: [
            {
              key: "acknowledge",
              label: "Reconocer",
              hint: "Nombra su preocupación sin conceder el punto.",
              maxWords: 15,
            },
            {
              key: "hold",
              label: "Sostener",
              hint: "Reafirma tu postura y la razón más sólida.",
              maxWords: 25,
            },
            {
              key: "invite",
              label: "Invitar",
              hint: "Ofrece un siguiente paso, una prueba o una pregunta.",
              maxWords: 20,
            },
          ],
        },
      },
      quiz: [
        {
          prompt: "Un colega dice que tu plan es \"demasiado riesgoso\". ¿Cuál es la mejor primera frase?",
          options: [
            "\"No es riesgoso para nada.\"",
            "\"Tienes razón, descartémoslo.\"",
            "\"El riesgo es una preocupación válida. ¿Qué parte te preocupa más?\"",
            "\"Dijiste lo mismo la última vez y te equivocaste.\"",
          ],
          explanation:
            "Reconoce la preocupación y obtiene información específica, sin ceder ni atacar.",
        },
        {
          prompt: "¿Cuándo deberías cambiar tu postura ante una objeción?",
          options: [
            "Cuando la otra persona tiene más rango",
            "Cuando la conversación se pone incómoda",
            "Cuando te da información nueva o una razón mejor",
            "Nunca; cambiar se ve débil",
          ],
          explanation:
            "Las personas seguras actualizan su postura con evidencia, no con presión. Cambiar por una buena razón demuestra criterio.",
        },
        {
          prompt:
            "¿Por qué cerrar una respuesta a una objeción con una invitación como '¿Qué necesitarías ver?'?",
          options: [
            "Para terminar la conversación rápido",
            "Para pasar de posturas opuestas a resolver juntos la preocupación",
            "Para poner a la otra persona en aprietos",
            "Para evitar plantear tu opinión",
          ],
          explanation:
            "Pedir criterios enfoca a ambos en los intereses y los siguientes pasos, que es donde el acuerdo se vuelve posible.",
        },
      ],
      action: {
        title: "Reconoce antes de responder",
        description:
          "La próxima vez que hoy alguien cuestione una de tus ideas, empieza tu respuesta reconociendo su preocupación en una frase; luego reafirma tu opinión con una razón y haz una pregunta.",
        successCriteria:
          "Respondiste a un cuestionamiento real usando los tres pasos, sin conceder solo para acabar con la tensión.",
      },
    },

    "conf-recover-from-mistakes": {
      title: "Recupérate de un error en público",
      description: "Asume el error brevemente, corrígelo y sigue adelante, sin disculparte de más ni esconderlo.",
      content: {
        hook: "Rara vez la gente recuerda el error. Lo que recuerda es cómo lo manejaste.",
        whyItMatters:
          "Todo el mundo se equivoca con un número, incumple un plazo o dice algo fuera de lugar en una reunión. Disculparte de más hace que un error pequeño parezca grande; esconderlo destruye la confianza. Una recuperación limpia muchas veces aumenta cuánto confían en ti.",
        coreConcept: {
          title: "Asúmelo, corrígelo, sigue adelante",
          body: [
            "Asúmelo en una frase, sin excusas: 'Antes te di una cifra equivocada'. No un párrafo de contexto, ni cinco disculpas.",
            "Corrígelo: da la información correcta o di qué estás haciendo para reparar el impacto. Si no puedes corregirlo ahora, di cuándo lo harás.",
            "Sigue adelante: vuelve a la agenda o a la tarea. Quedarte en el error mantiene la atención de todos en él. Después, anota en privado qué harás distinto y suéltalo.",
          ],
          keyPoints: [
            "Una frase para asumirlo, sin excusas.",
            "Corrígelo o comprométete a cuándo lo harás.",
            "Vuelve a la tarea; no te quedes en el error.",
            "Aprende en privado; trátate como tratarías a un colega.",
          ],
        },
        expertInsight: {
          text: "La investigación de Kristin Neff sobre la autocompasión sugiere que tratar tus propios errores con la comprensión que le ofrecerías a un amigo, en lugar de con una autocrítica dura, se asocia con una mayor disposición a reconocer los errores y a esforzarse por mejorar.",
          source: "Kristin Neff",
          sourceDetail: "Investigación sobre la autocompasión",
        },
        example: {
          situation:
            "Luca, analista de ventas, se da cuenta en plena reunión de que un pronóstico que presentó usaba los precios del año pasado.",
          before:
            "\"Ay no, perdón, perdón, soy un desastre, no puedo creer que hice eso, estaba apurado por otras tres cosas, perdón, de verdad lo siento, a todos…\"",
          after:
            "\"Corrección: el pronóstico que mostré usaba los precios del año pasado. La cifra correcta es alrededor de un 6 % más alta. Les envío la presentación corregida dentro de la próxima hora. Volvamos a la división por regiones.\"",
          whyItWorks:
            "Luca asume el error, da la información correcta y hace avanzar la reunión en cuatro frases cortas. La gente se va recordando su confiabilidad, no el error.",
        },
        reflectionPrompt:
          "Piensa en un error reciente. ¿Cuánto tiempo le diste vueltas, y cómo habría sido 'asúmelo, corrígelo, sigue adelante'?",
      },
      exercise: {
        title: "Reescribe la disculpa excesiva",
        description: "Convierte una disculpa llena de pánico en una recuperación limpia.",
        config: {
          type: "rewrite",
          instruction:
            "Reescribe este mensaje a un cliente. Asume el error en una frase, plantea la solución y sigue adelante. Una disculpa como máximo.",
          original:
            "Lo siento muchísimo, de verdad no puedo creer que esto haya pasado, me siento fatal. Creo que ayer, sin querer, le envié la versión equivocada del contrato, lo cual es completamente mi culpa; he estado desbordado esta semana, pero eso no es excusa. De nuevo, lo siento muchísimo por cualquier confusión que esto haya podido causar.",
          tips: [
            "Una frase para asumirlo; elimina las excusas.",
            "Di exactamente qué estás haciendo para corregirlo.",
            "Cierra mirando hacia adelante, no disculpándote otra vez.",
          ],
          maxWords: 40,
          keywords: ["correcta", "adjunto", "equivocada", "disculpa"],
          modelAnswer:
            "Disculpas: ayer le envié una versión equivocada del contrato. Adjunto la versión correcta, con las cláusulas modificadas resaltadas. Por favor, descarte el archivo anterior. Con gusto lo revisamos juntos mañana.",
        },
      },
      quiz: [
        {
          prompt:
            "En plena presentación te das cuenta de que un gráfico tiene una cifra equivocada. ¿Cuál es la mejor jugada?",
          options: [
            "Ignorarlo y esperar que nadie lo note",
            "Detenerte y disculparte varias veces para que vean que te importa",
            "Plantear la corrección en una frase, dar la cifra correcta y continuar",
            "Explicar en detalle por qué ocurrió el error",
          ],
          explanation:
            "Una corrección breve y objetiva protege la confianza y mantiene la atención en el contenido, no en el error.",
        },
        {
          prompt: "¿Por qué disculparse de más suele ser contraproducente?",
          options: [
            "Hace que un error pequeño parezca más grande y mantiene la atención en él",
            "Es riesgoso desde el punto de vista legal",
            "Muestra que tienes demasiada confianza",
            "La gente prefiere que no haya ninguna disculpa",
          ],
          explanation:
            "Las disculpas repetidas amplifican el error y pueden desviar la conversación hacia manejar tus emociones en lugar de resolver el problema.",
        },
        {
          prompt: "Después de un error en público, ¿qué respuesta interna favorece más el aprendizaje?",
          options: [
            "\"Soy un inútil; esto siempre me pasa.\"",
            "\"En realidad no fue mi culpa.\"",
            "\"Fue un error real. ¿Qué voy a revisar la próxima vez?\"",
            "\"Total, nadie se va a acordar.\"",
          ],
          explanation:
            "Una reflexión honesta y autocompasiva reconoce el error y se enfoca en mejorar, sin autocrítica dura ni negación.",
        },
      ],
      action: {
        title: "Practica una corrección limpia",
        description:
          "Hoy, corrige una cosa, por pequeña que sea (un error de tipeo en un mensaje enviado, una hora equivocada, una cifra imprecisa), usando una frase para asumirlo, la corrección y ninguna disculpa extra.",
        successCriteria:
          "Hiciste una corrección real con una sola frase para asumirlo y una solución clara, y luego seguiste adelante.",
      },
    },
  },
};
