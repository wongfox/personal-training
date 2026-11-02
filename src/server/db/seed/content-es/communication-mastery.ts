import type { JourneyTranslation } from "../translations";

export const communicationMasteryEs: JourneyTranslation = {
  title: "Dominio de la comunicación",
  subtitle: "Di lo que quieres decir, con claridad e intención.",
  description:
    "Nueve sesiones breves que reconstruyen cómo abres conversaciones, cómo planteas tu punto en contextos ejecutivos y cómo conviertes información en historias que la gente recuerda. Cada idea se practica hoy mismo, en tu trabajo real.",
  modules: [
    {
      title: "Primeras impresiones",
      description:
        "Los primeros momentos de cualquier conversación enmarcan todo lo que viene después. Aprende a abrir con claridad, a presentarte con propósito y a hacer que la gente se sienta escuchada.",
    },
    {
      title: "Comunicación ejecutiva",
      description:
        "Las audiencias senior tienen poco tiempo y mucho en juego. Aprende a empezar por la respuesta, a sostener tu postura con calma, a manejar preguntas difíciles y a eliminar las palabras que diluyen tu autoridad.",
    },
    {
      title: "Contar historias",
      description:
        "Los datos informan; las historias mueven. Aprende una estructura simple para historias de trabajo y cómo usar el contraste para que tu mensaje se quede.",
    },
  ],
  lessons: {
    /* ───────────────────────── Module 1 ───────────────────────── */
    "comms-first-sentence-counts": {
      title: "Tu primera frase es tu primera impresión",
      description: "Por qué los primeros segundos de una conversación determinan cómo se escucha todo lo demás.",
      content: {
        hook: "La mayoría de la gente usa su primera frase para entrar en calor. Para cuando llega al punto, quien escucha ya decidió cuánta atención darle.",
        whyItMatters:
          "Colegas, clientes y líderes senior se forman rápido una impresión de ti, y rara vez la revisan a propósito. Una primera frase clara te gana la atención que el resto de tu mensaje necesita. Una vaga te obliga a esforzarte el doble para recuperarla.",
        coreConcept: {
          title: "Abre con señal, no con ruido",
          body: [
            "Quien escucha usa los primeros segundos para responder dos preguntas silenciosas: ¿vale la pena prestarle atención a esta persona?, y ¿de qué se trata esto? Frases de arranque como 'Bueno, rapidito…' o 'No sé si esto viene al caso, pero…' responden mal a ambas.",
            "Una buena apertura cumple una sola función: decir qué vienes a plantear o a pedir. Puede ser una conclusión, una solicitud o un tema claro. No necesita ser ingeniosa.",
            "No estás tratando de lucirte. Estás tratando de eliminar las conjeturas para que quien te escucha se relaje y pueda seguirte.",
          ],
          keyPoints: [
            "La gente decide cuánta atención prestar desde la primera frase.",
            "Elimina las frases de calentamiento; empieza por el tema, el pedido o la conclusión.",
            "Una apertura clara muestra respeto por el tiempo de quien escucha.",
            "Lo simple le gana a lo ingenioso: la meta es orientar, no impresionar.",
          ],
        },
        expertInsight: {
          text: "Las investigaciones sobre 'rebanadas finas' (thin slices) de comportamiento encontraron que las personas se forman juicios a partir de exposiciones muy breves a alguien, y que esos juicios rápidos suelen coincidir con impresiones formadas durante periodos mucho más largos. Los primeros momentos pesan más de lo que parece.",
          source: "Nalini Ambady y Robert Rosenthal",
          sourceDetail: "Investigación sobre juicios a partir de 'thin slices', inicios de los años noventa",
        },
        example: {
          situation: "Leo, analista de datos, entra a la reunión diaria del equipo para advertir un problema en un reporte.",
          before:
            "\"Hola, perdón, este, ayer estaba revisando unas cosas y no estoy del todo seguro, pero creo que tal vez hay algo raro con algunos de los números…\"",
          after:
            "\"El reporte semanal de ingresos cuenta dos veces los reembolsos. Tengo una solución y necesito diez minutos con finanzas para confirmarla.\"",
          whyItWorks:
            "La segunda versión nombra el problema, muestra que Leo se hace cargo y hace un pedido concreto en dos frases. Todos saben al instante por qué habla y qué necesita.",
        },
        reflectionPrompt:
          "Piensa en la última vez que tomaste la palabra en una reunión. ¿Cuál fue tu primera frase real, y cómo habría sonado tu punto en una sola línea?",
      },
      exercise: {
        title: "Elige la apertura más sólida",
        description: "Escoge la frase de apertura que capta la atención más rápido.",
        config: {
          type: "choice",
          scenario:
            "Eres Ana, product manager. Tienes 30 segundos en una reunión de coordinación con la dirección para plantear un riesgo: un retraso del proveedor va a atrasar dos semanas el lanzamiento de la app móvil, a menos que el equipo apruebe horas extra.",
          question: "¿Qué frase de apertura funciona mejor?",
          options: [
            {
              text: "\"Perdón por quitarles tiempo, sé que todos están ocupados, pero hay un tema del proveedor que quería mencionar.\"",
              quality: "weak",
              feedback:
                "Disculparte y minimizar antes del punto le enseña a la gente a restarle importancia. Quien escucha sigue sin saber qué está en juego.",
            },
            {
              text: "\"Bueno, primero un poco de contexto: llevamos unos seis meses trabajando con el proveedor y…\"",
              quality: "ok",
              feedback:
                "El contexto es útil, pero empezar por él obliga a los líderes a esperar para saber por qué estás hablando. Ponlo después del titular.",
            },
            {
              text: "\"El lanzamiento móvil se atrasa dos semanas a menos que hoy aprobemos horas extra para el proveedor.\"",
              quality: "best",
              feedback:
                "Plantea la consecuencia, la causa y la decisión necesaria en una sola frase. Los líderes pueden responder de inmediato.",
            },
            {
              text: "\"Solo tengo una preguntita sobre el cronograma del proveedor, si les parece.\"",
              quality: "weak",
              feedback:
                "Presentar un riesgo serio como una 'preguntita' lo minimiza, y pedir permiso retrasa todavía más el punto.",
            },
          ],
        },
      },
      quiz: [
        {
          prompt:
            "Necesitas la aprobación de tu jefe para un cambio de presupuesto. ¿Qué primera frase le da la señal más clara?",
          options: [
            "\"¿Tienes un segundo? He estado pensando en unos temas del presupuesto.\"",
            "\"Necesito tu aprobación para mover 5000 de eventos a herramientas este trimestre.\"",
            "\"Bueno, como sabes, el presupuesto ha estado ajustado este año…\"",
            "\"Puede que sea una idea tonta, pero escúchame.\"",
          ],
          explanation:
            "Empezar por el pedido concreto le dice a tu jefe qué decisión se le está pidiendo tomar, así puede escuchar el resto con un propósito.",
        },
        {
          prompt: "¿Cuál es la función principal de la frase de apertura en una conversación de trabajo?",
          options: [
            "Generar sintonía antes de entrar en materia",
            "Mostrar cuánto contexto tienes",
            "Orientar a quien escucha sobre tu punto, tu pedido o el tema",
            "Sonar impresionante y seguro",
          ],
          explanation:
            "La función de una apertura es orientar. La sintonía y el contexto importan, pero funcionan mejor cuando quien escucha ya sabe hacia dónde vas.",
        },
        {
          prompt: "¿Por qué frases como 'No sé si esto viene al caso, pero…' debilitan un mensaje?",
          options: [
            "Hacen que el mensaje sea demasiado largo para recordarlo",
            "Invitan a quien escucha a restarle valor a lo que sigue antes de oírlo",
            "Son gramaticalmente incorrectas",
            "Suenan demasiado formales para la mayoría de los lugares de trabajo",
          ],
          explanation:
            "Los descargos anticipados le dicen a quien escucha cómo juzgar tu punto: como posiblemente irrelevante. Las primeras impresiones se quedan, así que ese encuadre tiende a durar.",
        },
      ],
      action: {
        title: "Hoy, empieza una vez por el punto",
        description:
          "En tu próxima reunión, mensaje o llamada en la que necesites plantear algo, haz que tu primerísima frase sea la conclusión, el pedido o el riesgo. Sin calentamiento, sin disculpas.",
        successCriteria:
          "Hoy entregaste al menos un mensaje cuya primera frase planteaba tu punto, y notaste cómo respondió la otra persona.",
      },
    },

    "comms-introduce-yourself-clearly": {
      title: "Preséntate en una línea clara",
      description: "Reemplaza el típico 'soy de tal área' por una presentación que la gente pueda recordar y repetir.",
      content: {
        hook: "\"Estoy en operaciones, hago un poco de todo.\" Es la presentación más común en el mundo laboral, y casi nadie la recuerda.",
        whyItMatters:
          "Las presentaciones ocurren en arranques de proyecto, llamadas con clientes, conferencias y equipos nuevos. Una olvidable hace que la gente no sepa cuándo involucrarte. Una clara convierte un momento de cortesía en una razón para que alguien vuelva a buscarte.",
        coreConcept: {
          title: "A quién ayudas, con qué y por qué importa",
          body: [
            "Una presentación útil responde lo que un desconocido realmente quiere saber: qué haces por personas como él. Los cargos rara vez responden eso; los resultados sí.",
            "Una estructura simple funciona en casi cualquier contexto: tu rol, a quién ayudas y el resultado que generas. Agrega un foco actual si el momento lo permite.",
            "Empieza por lo más relevante para esta audiencia. La misma persona puede presentarse de forma distinta ante un cliente, un ingeniero y un reclutador, y las tres versiones pueden ser ciertas.",
          ],
          keyPoints: [
            "Los resultados se recuerdan más que los cargos.",
            "Estructura: rol, a quién ayudas, el resultado que generas.",
            "Pon primero el dato más relevante para esta audiencia.",
            "Que sean una o dos frases; deja que las preguntas hagan el resto.",
          ],
        },
        expertInsight: {
          text: "Las primeras investigaciones sobre la formación de impresiones mostraron que los primeros rasgos que escuchamos sobre alguien moldean cómo interpretamos todo lo que viene después. Aquello con lo que abres se convierte en el lente para el resto de tu presentación.",
          source: "Solomon Asch",
          sourceDetail: "Estudios sobre la formación de impresiones de personalidad, 1946",
        },
        example: {
          situation: "Marta, business partner de finanzas, se presenta en el arranque de un proyecto con varios equipos.",
          before:
            "\"Hola, soy Marta, estoy en finanzas. Más o menos apoyo a algunos equipos con temas de números, presupuestos y ese tipo de cosas.\"",
          after:
            "\"Soy Marta, business partner de finanzas para los equipos de producto. Los ayudo a convertir sus planes en presupuestos que la dirección apruebe, así que involúcrenme antes de ponerle precio a cualquier cosa.\"",
          whyItWorks:
            "La segunda versión dice a quién atiende, el resultado que genera y exactamente cuándo deberían involucrarla. Le da al equipo una razón para recurrir a ella.",
        },
        reflectionPrompt:
          "Si mañana un colega te presentara a alguien importante, ¿qué frase te gustaría que usara?",
      },
      exercise: {
        title: "Reescribe una presentación olvidable",
        description: "Convierte una presentación vaga en una línea clara basada en resultados.",
        config: {
          type: "rewrite",
          instruction:
            "Reescribe esta presentación para el arranque de un proyecto con varios equipos. Nombra el rol, a quién ayudas y el resultado que generas.",
          original:
            "Hola a todos, soy Sam. Estoy en el equipo de éxito del cliente; supongo que hago muchas cosas distintas, la verdad, como onboarding, algo de cuentas y lo que vaya surgiendo.",
          tips: [
            "Reemplaza 'muchas cosas distintas' por un resultado claro.",
            "Di a quién ayudas, no solo en qué equipo estás.",
            "Elimina 'supongo', 'la verdad' y 'lo que vaya surgiendo'.",
          ],
          maxWords: 35,
          keywords: ["ayud", "clientes", "para que", "onboarding"],
          modelAnswer:
            "Soy Sam, de éxito del cliente. Ayudo a los nuevos clientes a completar su onboarding en el primer mes, para que vean valor rápido y renueven.",
        },
      },
      quiz: [
        {
          prompt: "Vas a conocer a un posible cliente. ¿Qué presentación tiene más probabilidades de ser recordada?",
          options: [
            "\"Soy asociado senior en la práctica de consultoría.\"",
            "\"Trabajo en muchos proyectos distintos en la firma.\"",
            "\"Ayudo a empresas de retail a reducir los quiebres de stock mejorando cómo pronostican la demanda.\"",
            "\"Llevo ocho años en la firma en distintos roles.\"",
          ],
          explanation:
            "Nombra a quién ayudas y el resultado que generas, que es justo lo que un cliente intenta averiguar.",
        },
        {
          prompt: "¿Por qué podrías presentarte de forma distinta ante un ingeniero que ante un cliente?",
          options: [
            "Porque conviene empezar por lo más relevante para quien escucha",
            "Porque los ingenieros prefieren presentaciones más largas",
            "Porque a los clientes no les importa tu rol",
            "No deberías; la coherencia importa más que la relevancia",
          ],
          explanation:
            "Lo que la gente escucha primero enmarca todo lo demás. Elegir el dato verdadero más relevante para cada audiencia es enfoque, no incoherencia.",
        },
        {
          prompt: "¿Cuál es la principal debilidad de 'hago un poco de todo'?",
          options: [
            "Suena arrogante",
            "No le da a quien escucha ninguna pista de cuándo involucrarte",
            "Es demasiado específica",
            "Revela demasiado sobre tu rol",
          ],
          explanation:
            "Una presentación debería decirle a la gente cuándo le eres útil. 'Un poco de todo' la deja adivinando, así que normalmente la olvida.",
        },
      ],
      action: {
        title: "Redacta y usa tu presentación en una línea",
        description:
          "Escribe tu presentación en una frase: rol, a quién ayudas, resultado. Úsala hoy una vez: en una reunión, en la firma de tu correo, en una llamada o en tu perfil de mensajería.",
        successCriteria:
          "Escribiste una presentación de una frase de 30 palabras o menos y la usaste al menos una vez con una persona real o en un perfil real.",
      },
    },

    "comms-make-people-feel-heard": {
      title: "Haz que la gente se sienta escuchada antes de responder",
      description: "Usa el etiquetado para mostrar que entendiste a alguien antes de plantear tu propio punto.",
      content: {
        hook: "La gente rara vez cambia de opinión mientras todavía se siente incomprendida. Tu contraargumento no puede llegar hasta que crean que escuchaste el suyo.",
        whyItMatters:
          "En reuniones tensas, conversaciones de feedback y llamadas con clientes, la forma más rápida de bajar la actitud defensiva es mostrar que entendiste. Cuesta una frase y muchas veces salva toda la conversación.",
        coreConcept: {
          title: "Nombra lo que escuchas y haz una pausa",
          body: [
            "Una etiqueta es una frase corta que nombra la emoción o la preocupación detrás de lo que alguien dijo: 'Parece que el plazo se siente poco realista'. No es estar de acuerdo; es la prueba de que estabas escuchando.",
            "Las etiquetas funcionan mejor cuando son tentativas y específicas. Empieza con 'Parece que…', 'Suena a que…' o 'Da la impresión de que…', y luego deja de hablar y permite que la otra persona responda.",
            "Evita 'Te entiendo' o 'Te escucho'. Afirman comprensión sin demostrarla, y a menudo suenan a la antesala de un 'pero'.",
          ],
          keyPoints: [
            "Sentirse comprendido baja la actitud defensiva.",
            "Etiqueta la preocupación: 'Parece que…', y haz una pausa.",
            "Una etiqueta es reconocimiento, no acuerdo.",
            "Demuestra que entiendes; no te limites a decirlo.",
          ],
        },
        expertInsight: {
          text: "El exnegociador del FBI Chris Voss describe el 'etiquetado' como nombrar en voz alta los sentimientos o la postura de la otra persona. Sostiene que esto desactiva las emociones negativas y anima a la gente a seguir hablando, lo que te da mejor información.",
          source: "Chris Voss",
          sourceDetail: "Rompe la barrera del no (Never Split the Difference, 2016)",
        },
        example: {
          situation: "Un director comercial frustrado le dice a Priya, líder de ingeniería, que su equipo 'siempre llega tarde'.",
          before:
            "\"Eso no es justo. Entregamos las dos últimas versiones a tiempo, y los retrasos fueron porque ventas cambió el alcance.\"",
          after:
            "\"Parece que los retrasos te han puesto en una situación difícil con los clientes.\" (pausa) \"Cuéntame cuál es la venta que está más en riesgo.\"",
          whyItWorks:
            "Priya nombra la preocupación real del director antes de defender a su equipo. La tensión baja, y la conversación pasa de buscar culpables al problema concreto en el que sí puede ayudar.",
        },
        reflectionPrompt:
          "Recuerda un desacuerdo reciente. ¿Cuál era la preocupación de fondo de la otra persona, y cómo podrías haberla nombrado en una frase?",
      },
      exercise: {
        title: "Elige la respuesta que demuestra que escuchaste",
        description: "Escoge la respuesta con más probabilidades de bajar la tensión y mantener abierta la conversación.",
        config: {
          type: "choice",
          scenario:
            "En una reunión uno a uno, alguien de tu equipo te dice: \"Me siguen metiendo en los incendios de otros equipos y mi propio proyecto se está atrasando. Nadie parece darse cuenta.\"",
          question: "¿Cuál es la mejor primera respuesta?",
          options: [
            {
              text: "\"Te entiendo. Todos estamos al límite ahora, la verdad.\"",
              quality: "weak",
              feedback:
                "Decir que entiendes y luego generalizarlo a todos achica su preocupación. Puede sentirse como que le restas importancia.",
            },
            {
              text: "\"Simplemente diles que no a los otros equipos.\"",
              quality: "weak",
              feedback:
                "Saltar al consejo se salta el reconocimiento. Además, puede sentir que pasaste por alto la parte de que nadie lo nota.",
            },
            {
              text: "\"Parece que estás cargando trabajo extra que nadie está viendo.\"",
              quality: "best",
              feedback:
                "Nombra tanto la carga de trabajo como la sensación de ser invisible, y luego deja espacio. Es probable que se abra más.",
            },
            {
              text: "\"¿Qué equipos te están metiendo en sus temas? Hagamos una lista.\"",
              quality: "ok",
              feedback:
                "Práctico y con buena intención, pero pasar primero a resolver el problema puede saltarse la frustración que acaba de compartir.",
            },
          ],
        },
      },
      quiz: [
        {
          prompt: "Un cliente dice: \"Nos prometieron esta funcionalidad hace meses.\" ¿Qué respuesta es una etiqueta?",
          options: [
            "\"Lo escucho, pero la hoja de ruta cambió.\"",
            "\"Parece que ustedes planificaron en torno a esa promesa y ahora se sienten decepcionados.\"",
            "\"Esa decisión se tomó antes de que yo llegara.\"",
            "\"Permítame consultarlo con el equipo de producto y le respondo.\"",
          ],
          explanation:
            "Una etiqueta nombra la preocupación o la emoción detrás de las palabras. Las demás respuestas defienden, desvían o posponen sin reconocer lo que siente el cliente.",
        },
        {
          prompt: "¿Qué deberías hacer justo después de usar una etiqueta?",
          options: [
            "Explicar tu propia postura",
            "Hacer una pausa y dejar que la otra persona responda",
            "Preguntar si acertaste y luego disculparte",
            "Repetir la etiqueta con otras palabras",
          ],
          explanation:
            "El silencio después de una etiqueta invita a la otra persona a confirmar, corregir o ampliar, y de ahí sale la información útil.",
        },
        {
          prompt: "¿Por qué 'Te entiendo' suele ser menos eficaz que una etiqueta específica?",
          options: [
            "Es demasiado formal",
            "Es demasiado largo",
            "Afirma comprensión sin mostrar qué entendiste",
            "Te obliga a estar de acuerdo",
          ],
          explanation:
            "Una etiqueta específica demuestra que escuchaste. Una afirmación genérica le pide a la persona que te crea, y muchas veces precede a un 'pero'.",
        },
      ],
      action: {
        title: "Etiqueta antes de responder",
        description:
          "Hoy, en una conversación en la que alguien comparta una frustración o preocupación, responde primero con una etiqueta ('Parece que…') y luego haz una pausa de al menos dos segundos antes de decir cualquier otra cosa.",
        successCriteria:
          "Usaste al menos una etiqueta en una conversación real, hiciste una pausa después y anotaste qué dijo la otra persona a continuación.",
      },
    },

    /* ───────────────────────── Module 2 ───────────────────────── */
    "comms-bottom-line-up-front": {
      title: "Pon la conclusión por delante",
      description: "Empieza por tu conclusión para que la gente ocupada reciba la respuesta antes que la historia de fondo.",
      content: {
        hook: "La mayoría de los reportes de avance se escriben en el orden en que ocurrió el trabajo. Los ejecutivos los leen en el orden que necesitan: primero la respuesta.",
        whyItMatters:
          "A la gente senior la interrumpen constantemente y a menudo solo lee las primeras líneas de un mensaje. Si tu conclusión está en el cuarto párrafo, puede que nunca la vean. Ponerla primero es la forma de conseguir decisiones en lugar de preguntas de seguimiento.",
        coreConcept: {
          title: "Primero la respuesta, luego el respaldo",
          body: [
            "BLUF (bottom line up front, 'lo esencial por delante') significa que tu primera frase plantea la conclusión, la recomendación o la decisión que necesitas. Todo lo que sigue es respaldo que el lector puede consultar según lo necesite.",
            "El instinto de ir construyendo hacia la respuesta viene de querer mostrar tu trabajo. Pero un lector que todavía no conoce tu conclusión no puede saber qué detalles importan.",
            "Una prueba simple: si alguien leyera solo tu primera frase, ¿sabría qué quieres? Si no, sube la respuesta.",
          ],
          keyPoints: [
            "Primera frase: la conclusión o el pedido.",
            "Después, dos o tres razones de respaldo.",
            "Detalles e historia al final, o en un adjunto.",
            "Prueba: ¿alguien podría actuar solo con tu primera línea?",
          ],
        },
        expertInsight: {
          text: "El Principio de la Pirámide de Barbara Minto recomienda empezar por la idea principal y agrupar debajo los argumentos que la sostienen. Los lectores asimilan la información con más facilidad cuando conocen la conclusión que los detalles deben respaldar.",
          source: "Barbara Minto",
          sourceDetail: "El principio de la pirámide (The Pyramid Principle)",
        },
        example: {
          situation: "Daniel, gerente de operaciones, le escribe a su directora sobre un problema con un proveedor.",
          before:
            "\"Hola, Claire: el mes pasado empezamos a ver algunos retrasos de nuestro proveedor de empaques. Lo revisamos y encontramos algunos problemas con su capacidad. Hablamos con dos alternativas y pedimos cotizaciones. Una es un poco más cara pero más confiable…\"",
          after:
            "\"Hola, Claire: recomiendo cambiar de proveedor de empaques antes del 1 de marzo; necesito tu aprobación a más tardar el viernes. El proveedor actual ha fallado cuatro entregas, y la alternativa cuesta un 3 % más pero garantiza capacidad. Detalles abajo.\"",
          whyItWorks:
            "Claire conoce la recomendación, el plazo y el costo-beneficio en dos frases. Puede aprobar desde su celular o seguir leyendo si quiere el detalle.",
        },
        reflectionPrompt:
          "Abre el último reporte que le enviaste a alguien senior. ¿Dónde estaba tu conclusión real, y cuántas líneas tuvo que leer para encontrarla?",
      },
      exercise: {
        title: "Dale la vuelta al reporte",
        description: "Reescribe un reporte cronológico para que la conclusión vaya primero.",
        config: {
          type: "rewrite",
          instruction:
            "Reescribe este reporte de avance para tu director. Pon la conclusión y la decisión que necesitas en la primera frase.",
          original:
            "Bueno, esta semana corrimos la prueba de precios en las dos landing pages. Tomó un poco más de lo esperado por unos problemas de medición, que arreglamos el martes. Después llegaron los datos y parece que la página del plan anual convirtió notablemente mejor. Creo que probablemente deberíamos considerar ponerla como predeterminada, si estás de acuerdo.",
          tips: [
            "Empieza por la recomendación, no por la cronología.",
            "Nombra la decisión que necesitas de su parte.",
            "Quédate con uno o dos datos de respaldo; elimina la historia de la medición.",
          ],
          maxWords: 45,
          keywords: ["recomiendo", "predeterminad", "aprob", "anual"],
          modelAnswer:
            "Recomiendo que la página del plan anual sea la predeterminada; ¿puedes aprobarlo esta semana? En la prueba de esta semana convirtió notablemente mejor que la página mensual. Adjunto los resultados completos.",
        },
      },
      quiz: [
        {
          prompt:
            "Le escribes a una vicepresidenta que normalmente solo lee las dos primeras líneas. ¿Qué debería ir ahí?",
          options: [
            "Un resumen de todo lo que hizo el equipo este mes",
            "El contexto que explica por qué surgió el problema",
            "Tu recomendación y la decisión que necesitas de ella",
            "Un saludo amable y un aviso de que el correo es largo",
          ],
          explanation:
            "Si solo lee dos líneas, esas líneas tienen que permitirle actuar. El contexto es respaldo, no el titular.",
        },
        {
          prompt: "En el Principio de la Pirámide, ¿qué va en la cima de la pirámide?",
          options: [
            "Los datos que respaldan tu argumento",
            "La idea principal o conclusión única",
            "La cronología de los hechos",
            "Las preguntas abiertas",
          ],
          explanation:
            "La idea principal va arriba; los argumentos de respaldo se agrupan debajo, y los datos, debajo de ellos.",
        },
        {
          prompt: "¿Por qué la gente suele enterrar su conclusión al final?",
          options: [
            "Porque a los ejecutivos les gusta el suspenso",
            "Porque escribe en el orden en que ocurrió el trabajo, para mostrar esfuerzo",
            "Porque las conclusiones importan menos que el proceso",
            "Porque los programas de correo ocultan la primera línea",
          ],
          explanation:
            "Escribir de forma cronológica refleja cómo vivimos el trabajo. Se siente exhaustivo, pero obliga al lector a excavar para encontrar el punto.",
        },
      ],
      action: {
        title: "Envía un mensaje BLUF",
        description:
          "Antes de enviar hoy tu próximo reporte, pedido o informe, reescríbelo para que la primera frase sea la conclusión o la decisión que necesitas. Mueve el contexto al final.",
        successCriteria:
          "Enviaste al menos un mensaje con el que alguien podría actuar leyendo solo la primera frase.",
      },
    },

    "comms-authority-without-aggression": {
      title: "Habla con autoridad sin sonar agresivo",
      description: "Combina una postura firme con apertura genuina para sonar seguro, no combativo.",
      content: {
        hook: "Muchos profesionales oscilan entre dos modos: tan suaves que los ignoran, o tan contundentes que generan resistencia. La autoridad está en el medio.",
        whyItMatters:
          "En las reuniones de liderazgo, quien suena serenamente seguro suele ser quien define la decisión. Presionar demasiado hace que los demás defiendan su postura en lugar de considerar la tuya. Ambos extremos te cuestan influencia.",
        coreConcept: {
          title: "Firme en el punto, abierto con la persona",
          body: [
            "La autoridad viene de la convicción sobre tu postura, no de presionar a los demás. Puedes plantear tu punto de vista con claridad y aun así mostrar curiosidad real por el de ellos.",
            "La agresividad suele filtrarse a través de absolutos ('obviamente', 'siempre', 'eso está mal'), interrupciones y velocidad. La autoridad se transmite con frases declarativas cortas, un ritmo pausado y reconociendo otros puntos de vista sin retroceder en el tuyo.",
            "Un patrón útil: plantea tu postura, da tu razón más fuerte y luego invita a que te cuestionen. 'Mi opinión es X, porque Y. ¿Qué se me está escapando?' La invitación transmite confianza, no duda.",
          ],
          keyPoints: [
            "Plantea tu opinión en una frase declarativa simple.",
            "Cambia absolutos y ataques por razones.",
            "Reconoce otros puntos de vista sin abandonar el tuyo.",
            "Invitar a que te cuestionen muestra confianza, no debilidad.",
          ],
        },
        expertInsight: {
          text: "Una investigación de Daniel Ames y Francis Flynn encontró que la asertividad y la eficacia percibida como líder siguen una forma de U invertida: tanto quienes eran vistos como poco asertivos como quienes eran vistos como excesivamente asertivos fueron calificados como menos eficaces que quienes estaban en un rango moderado.",
          source: "Daniel Ames y Francis Flynn",
          sourceDetail: "Investigación sobre asertividad y liderazgo, Journal of Personality and Social Psychology (2007)",
        },
        example: {
          situation: "Inés, directora de marketing, no está de acuerdo con un colega que quiere recortar el presupuesto de marca.",
          before:
            "\"Sinceramente, es una pésima idea. Todo el mundo sabe que recortar la inversión en marca siempre sale mal. Ya lo intentamos antes y fue un desastre.\"",
          after:
            "\"Yo mantendría el presupuesto de marca. Después del último recorte tuvimos dos trimestres con menos oportunidades de venta. Entiendo la presión de costos, así que busquemos ahorros en otro lado. ¿Qué necesitarías ver para estar de acuerdo?\"",
          whyItWorks:
            "Inés es igual de clara sobre su postura, pero argumenta con evidencia en lugar de calificativos, reconoce la preocupación real y le da a su colega un camino para estar de acuerdo sin quedar mal.",
        },
        reflectionPrompt:
          "Cuando no estás de acuerdo bajo presión, ¿tiendes a ser demasiado suave o demasiado tajante? ¿Cómo suena eso en tus palabras?",
      },
      exercise: {
        title: "Encuentra la respuesta con autoridad",
        description: "Elige la respuesta que es firme en el fondo y respetuosa en el tono.",
        config: {
          type: "choice",
          scenario:
            "En una reunión de planificación, un colega senior dice: \"Deberíamos lanzar en los cinco mercados a la vez. Hacerlo por fases es demasiado lento.\" Tú crees que un piloto en dos mercados es más seguro.",
          question: "¿Qué respuesta tiene más autoridad sin escalar el conflicto?",
          options: [
            {
              text: "\"O sea, puede ser, solo me preocupa un poquito que sea riesgoso… Pero tú sabes más.\"",
              quality: "weak",
              feedback:
                "Los rodeos y la deferencia entierran tu opinión. Lo más probable es que la sala escuche acuerdo, no una preocupación.",
            },
            {
              text: "\"Eso es demasiado riesgoso y, sinceramente, ese enfoque nunca funciona.\"",
              quality: "weak",
              feedback:
                "Los absolutos y el desdén provocan una reacción defensiva. El debate pasa a ser sobre ganar, no sobre el lanzamiento.",
            },
            {
              text: "\"Yo haría primero un piloto en dos mercados. Así aprendemos qué se rompe antes de que se rompa cinco veces. ¿Qué hace que las fases te parezcan demasiado lentas?\"",
              quality: "best",
              feedback:
                "Una recomendación clara, una razón concreta y una pregunta genuina. Firme en el fondo, abierto con la persona.",
            },
            {
              text: "\"Veámoslo después, fuera de la reunión.\"",
              quality: "ok",
              feedback:
                "A veces es útil, pero aquí evita plantear tu opinión justo cuando la decisión se está formando en la sala.",
            },
          ],
        },
      },
      quiz: [
        {
          prompt: "¿Qué frase tiene más probabilidades de hacer que una afirmación firme suene agresiva?",
          options: [
            "\"Mi recomendación es postergar.\"",
            "\"Obviamente cualquiera puede ver que esto no va a funcionar.\"",
            "\"Yo lo veo distinto.\"",
            "\"Esto es lo que muestran los datos.\"",
          ],
          explanation:
            "'Obviamente cualquiera puede ver' implica que quienes no están de acuerdo son tontos. Ataca a las personas, no al problema.",
        },
        {
          prompt:
            "Planteas una opinión firme y luego preguntas: \"¿Qué se me está escapando?\" ¿Cómo es más probable que se perciba?",
          options: [
            "Como señal de que no estás seguro de tu postura",
            "Como confianza, porque te sientes lo bastante seguro como para invitar a que te cuestionen",
            "Como algo pasivo-agresivo",
            "Como un cambio de tema",
          ],
          explanation:
            "Seguir una postura clara con una pregunta real muestra que puedes sostener una opinión y aun así aprender. Se percibe como seguridad, no como duda.",
        },
        {
          prompt: "¿Qué sugiere la investigación sobre asertividad respecto a la eficacia en el liderazgo?",
          options: [
            "Cuanto más asertivo, más eficaz",
            "La asertividad no influye en la eficacia percibida",
            "Tanto la falta como el exceso de asertividad tienden a reducir la eficacia percibida",
            "La baja asertividad es la mejor calificada de forma consistente",
          ],
          explanation:
            "Ames y Flynn encontraron un patrón de U invertida: la asertividad moderada tendía a calificarse como más eficaz que cualquiera de los dos extremos.",
        },
      ],
      action: {
        title: "Discrepa con calma una vez",
        description:
          "La próxima vez que hoy no estés de acuerdo con algo, usa el patrón: \"Mi opinión es X, porque Y. ¿Qué se me está escapando?\" Dilo a un ritmo pausado, sin 'obviamente', 'siempre' ni 'nunca'.",
        successCriteria:
          "Expresaste un desacuerdo con una postura clara, una razón y una pregunta abierta, sin absolutos.",
      },
    },

    "comms-answer-hard-questions": {
      title: "Responde preguntas difíciles en tres movimientos",
      description: "Da una respuesta directa, una razón y un siguiente paso; luego deja de hablar.",
      content: {
        hook: "Cuando una persona senior hace una pregunta difícil, la mayoría responde otra pregunta, más fácil, y con lujo de detalles. Y se nota.",
        whyItMatters:
          "Las preguntas difíciles en revisiones, entrevistas y reuniones con clientes son momentos en los que se evalúa tu criterio. Una respuesta corta y directa genera confianza incluso cuando la noticia es mala. Una larga y divagante hace que la gente se pregunte qué estás evitando.",
        coreConcept: {
          title: "Respuesta, razón, siguiente paso",
          body: [
            "Empieza con una respuesta directa a la pregunta que realmente te hicieron: sí, no, un número, una fecha o 'todavía no lo sé'. Luego da la razón más importante. Después di qué pasa a continuación.",
            "La presión nos empuja a llenar el silencio con contexto. Resiste. Una pausa de dos segundos antes de responder se ve reflexiva, no improvisada.",
            "Si no sabes, dilo con claridad y comprométete a cuándo lo sabrás. 'No lo sé; te lo confirmo el jueves' es una respuesta sólida. Adivinar no lo es.",
          ],
          keyPoints: [
            "Responde la pregunta que te hicieron, en las primeras palabras.",
            "Una razón, no cinco.",
            "Cierra con un siguiente paso o un compromiso.",
            "Una pausa breve es mejor que una respuesta apurada.",
          ],
        },
        expertInsight: {
          text: "Daniel Kahneman describe un pensamiento rápido y automático (Sistema 1) y otro más lento y deliberado (Sistema 2). Bajo presión, el sistema rápido tiende a quedarse con la primera respuesta que se le ocurre; una pausa breve le da al sistema deliberado la oportunidad de elegir la respuesta que de verdad quieres dar.",
          source: "Daniel Kahneman",
          sourceDetail: "Pensar rápido, pensar despacio (2011)",
        },
        example: {
          situation: "El director financiero le pregunta a Tom, líder de proyecto: \"¿Vamos a cumplir el plazo de marzo?\"",
          before:
            "\"Bueno, han pasado muchas cosas. La integración resultó más compleja, y en enero perdimos a un desarrollador, pero el equipo está trabajando muy duro y estamos haciendo todo lo posible…\"",
          after:
            "\"No, vamos encaminados a mediados de abril. La integración necesitó un rediseño que no habíamos previsto. El viernes traigo dos opciones para recuperar tiempo.\"",
          whyItWorks:
            "El director financiero recibe la respuesta en la primera palabra, una razón honesta y un compromiso concreto. Una mala noticia entregada así genera credibilidad.",
        },
        reflectionPrompt:
          "¿Qué tipo de pregunta te hace divagar más: sobre plazos, números, errores u opiniones? ¿Por qué esa?",
      },
      exercise: {
        title: "Arma una respuesta en tres movimientos",
        description: "Estructura una respuesta concisa a una pregunta difícil.",
        config: {
          type: "structure",
          framework: "Respuesta – Razón – Siguiente paso",
          instruction:
            "En una revisión de equipo, tu directora pregunta: \"¿Por qué subió la cancelación de clientes el último trimestre?\" Completa cada parte de una respuesta concisa.",
          context:
            "Sabes que la cancelación subió principalmente porque un aumento de precios golpeó más fuerte a las cuentas pequeñas. Estás preparando una oferta de retención, pero aún no la has cerrado.",
          slots: [
            {
              key: "answer",
              label: "Respuesta directa",
              hint: "Responde el 'por qué' en una frase.",
              maxWords: 20,
            },
            {
              key: "reason",
              label: "Razón o evidencia clave",
              hint: "El dato de respaldo más importante.",
              maxWords: 25,
            },
            {
              key: "next",
              label: "Siguiente paso",
              hint: "Qué vas a hacer y para cuándo.",
              maxWords: 20,
            },
          ],
        },
      },
      quiz: [
        {
          prompt:
            "Un cliente pregunta: \"¿Esto va a costar más que la cotización original?\" Sí, costará más. ¿Cuál es la mejor primera frase?",
          options: [
            "\"Hay muchas variables en juego, así que es difícil decirlo.\"",
            "\"Sí, alrededor de un 10 % más, principalmente por las integraciones adicionales.\"",
            "\"Permítame explicarle cómo evolucionó el proyecto en el último mes.\"",
            "\"Hemos trabajado duro para mantener los costos bajos todo el tiempo.\"",
          ],
          explanation:
            "Responde la pregunta en la primera palabra y da la razón principal. Todo lo demás puede venir después si lo piden.",
        },
        {
          prompt: "Te hacen una pregunta que todavía no puedes responder. ¿Cuál es la respuesta más sólida?",
          options: [
            "Dar tu mejor suposición con seguridad",
            "Hablar de temas relacionados que sí conoces",
            "\"Todavía no lo sé. Lo confirmo el jueves.\"",
            "Derivar la pregunta a un colega sin avisarle",
          ],
          explanation:
            "Una admisión simple más un compromiso es honesta y accionable. Adivinar pone en riesgo tu credibilidad cuando llegue la respuesta real.",
        },
        {
          prompt: "¿Por qué puede ayudar una pausa breve antes de responder una pregunta difícil?",
          options: [
            "Incomoda a quien pregunta",
            "Le da al pensamiento deliberado un momento para elegir tu respuesta",
            "Indica que la pregunta fue injusta",
            "Te da tiempo para cambiar de tema",
          ],
          explanation:
            "Una pausa breve te permite ir más allá de la primera respuesta refleja y elegir la que de verdad quieres dar.",
        },
      ],
      action: {
        title: "Responde primero, una vez",
        description:
          "La próxima vez que hoy alguien te haga una pregunta directa, empieza con la respuesta misma (sí, no, un número, una fecha o 'todavía no lo sé') antes de cualquier contexto.",
        successCriteria:
          "Respondiste al menos una pregunta real con la respuesta en tus primeras palabras, seguida de una razón y un siguiente paso.",
      },
    },

    "comms-cut-hedges": {
      title: "Elimina los rodeos y los atenuantes",
      description: "Quita las palabras pequeñas que, sin que lo notes, le restan autoridad a lo que dices y escribes.",
      content: {
        hook: "\"Solo creo que tal vez podríamos posiblemente revisar esto, ¿no?\" Cinco atenuantes, una idea y casi ningún impacto.",
        whyItMatters:
          "Los atenuantes se sienten corteses, pero en exceso transmiten una inseguridad que quizás no tienes. Colegas y líderes evalúan tus ideas en parte por cómo las planteas. Eliminar el relleno hace que la misma idea suene a recomendación en lugar de a deseo.",
        coreConcept: {
          title: "Dilo una vez, con claridad",
          body: [
            "Entre los atenuantes más comunes están 'solo', 'tal vez', 'creo que', 'como que', 'un poco', 'posiblemente' y '¿tiene sentido?'. Cada uno por separado es inofensivo. Apilados, le dicen a quien escucha que no te tome en serio.",
            "Conserva un matiz solo cuando aporta información real. 'Probablemente terminemos el viernes' es honesto si hay un riesgo genuino. 'Solo quería tal vez consultar' no es información; es una disculpa.",
            "Eliminar los rodeos no es lo mismo que eliminar la calidez. Puedes ser amable y directo: 'Gracias por esto. Recomiendo cambiar el titular.'",
          ],
          keyPoints: [
            "Detecta a los sospechosos de siempre: solo, tal vez, creo que, como que, posiblemente.",
            "Conserva los matices que reflejan una incertidumbre real; elimina el resto.",
            "Ser directo y ser cálido pueden ir de la mano.",
            "Relee tus mensajes una vez antes de enviarlos, a la caza de atenuantes.",
          ],
        },
        expertInsight: {
          text: "Las investigaciones sobre el habla 'sin poder' (powerless speech), incluidos los primeros estudios sobre testimonios en tribunales, encontraron que los rodeos, las vacilaciones y las coletillas interrogativas frecuentes tienden a reducir la credibilidad y la competencia que se le atribuyen a quien habla, incluso cuando el contenido es idéntico.",
          source: "Investigación sobre el estilo de habla sin poder",
          sourceDetail: "p. ej., Erickson, Lind, Johnson y O'Barr (1978)",
        },
        example: {
          situation: "Nora, diseñadora UX, da feedback sobre la propuesta de un colega en el chat del equipo.",
          before:
            "\"Hola, perdón, solo una pequeña idea, puede que me equivoque, pero ¿tal vez el flujo de registro es como un poco largo? No estoy segura, ¡solo es una idea!\"",
          after:
            "\"Gracias por compartirlo. El flujo de registro se siente largo; yo lo reduciría de cinco pasos a tres. Con gusto hago un boceto.\"",
          whyItWorks:
            "Nora conserva la calidez y deja de lado el lenguaje que la borra. Su sugerencia ahora se lee como una recomendación profesional con un siguiente paso claro.",
        },
        reflectionPrompt: "¿Qué atenuante usas más a menudo, y en qué situaciones aparece más?",
      },
      exercise: {
        title: "Quita los atenuantes",
        description: "Reescribe un mensaje lleno de rodeos para que suene a recomendación.",
        config: {
          type: "rewrite",
          instruction:
            "Reescribe este mensaje para tu líder de equipo. Mantenlo cortés, elimina todo atenuante innecesario y deja clara la recomendación.",
          original:
            "¡Hola! Perdón por molestarte, solo quería tal vez comentarte que como que creo que posiblemente tendríamos que mover un poco la reunión de revisión, ¿si te parece bien? No estoy del todo seguro, pero puede que los datos no estén listos. ¿Tiene sentido?",
          tips: [
            "Empieza con la recomendación.",
            "Quédate con una sola razón.",
            "Elimina 'solo', 'tal vez', 'como que', 'posiblemente' y la pregunta final.",
          ],
          maxWords: 30,
          keywords: ["recomiendo", "mover", "posponer", "datos"],
          modelAnswer:
            "Recomiendo mover la reunión de revisión al jueves. Los datos no estarán listos para el martes, y revisarlos incompletos le haría perder el tiempo a todos.",
        },
      },
      quiz: [
        {
          prompt: "¿Qué matiz aporta información real y vale la pena conservar?",
          options: [
            "\"Solo quería consultar…\"",
            "\"Probablemente terminemos el viernes; el proveedor todavía nos debe un archivo.\"",
            "\"Esta es como una buena idea.\"",
            "\"Perdón, tal vez me equivoco, pero…\"",
          ],
          explanation:
            "Aquí 'probablemente' refleja una dependencia real que el lector debe conocer. Las demás transmiten vacilación sin aportar información.",
        },
        {
          prompt:
            "A un colega le preocupa que eliminar los atenuantes lo haga sonar grosero. ¿Cuál es el mejor consejo?",
          options: [
            "Conservar los atenuantes; la cortesía es lo más importante",
            "Reemplazar los atenuantes por signos de exclamación",
            "Mantener la calidez con un agradecimiento o un reconocimiento, y plantear el punto con claridad",
            "Eliminar atenuantes solo al escribirles a colegas junior",
          ],
          explanation:
            "La calidez viene del reconocimiento y del tono, no de debilitar tu punto. Puedes ser amable y claro a la vez.",
        },
        {
          prompt: "¿Por qué terminar con '¿Tiene sentido?' suele debilitar un mensaje?",
          options: [
            "Sugiere que dudas de tu propia claridad",
            "Es demasiado informal para el trabajo",
            "Hace que el mensaje sea demasiado corto",
            "Es una pregunta capciosa",
          ],
          explanation:
            "Presenta tu mensaje como posiblemente confuso. Una pregunta específica, como '¿Alguna objeción con el jueves?', invita a opinar sin restarte fuerza.",
        },
      ],
      action: {
        title: "Auditoría de atenuantes antes de enviar",
        description:
          "Antes de enviar hoy tus próximos tres mensajes o correos, relee cada uno y borra todo 'solo', 'tal vez', 'como que' y 'creo que' que no refleje una incertidumbre real.",
        successCriteria:
          "Editaste al menos tres mensajes salientes y eliminaste al menos un atenuante innecesario de cada uno.",
      },
    },

    /* ───────────────────────── Module 3 ───────────────────────── */
    "comms-story-spine": {
      title: "Cuenta una historia de trabajo en menos de un minuto",
      description: "Usa una estructura narrativa simple para convertir un reporte o un ejemplo en algo que la gente recuerde.",
      content: {
        hook: "Probablemente compartiste una docena de datos esta semana. ¿Cuáles va a repetir alguien mañana? Los que venían envueltos en una historia.",
        whyItMatters:
          "Las historias ayudan a la gente a recordar, a que algo le importe y a actuar. En entrevistas, pitches y reportes de equipo, una historia corta sobre un cliente o una decisión suele lograr más que una diapositiva llena de números. La mayoría de los profesionales nunca las usa porque cree que las historias tienen que ser largas o dramáticas.",
        coreConcept: {
          title: "La columna vertebral de la historia",
          body: [
            "La columna vertebral de una historia (story spine) es un esqueleto simple: había una situación normal, luego algo cambió, y por eso vino una serie de consecuencias, hasta llegar a una resolución. Sirve tanto para un reporte de 30 segundos como para una conferencia magistral.",
            "En el trabajo se comprime en cuatro tiempos: el estado normal, el cambio o problema, lo que hiciste al respecto y qué es distinto ahora. Agrega la lección si no es obvia.",
            "Mantén un personaje principal, un problema y un punto de giro. Los detalles que no hacen avanzar la historia deben salir.",
          ],
          keyPoints: [
            "Estado normal → cambio → acciones → nueva normalidad.",
            "Un personaje, un problema, un punto de giro.",
            "Los detalles concretos le ganan a las afirmaciones generales.",
            "Cierra con lo que es distinto ahora o con lo que significa.",
          ],
        },
        expertInsight: {
          text: "La 'columna vertebral de la historia' es una herramienta de improvisación creada por el profesor de teatro Kenn Adams. Llegó a un público más amplio cuando Emma Coats, exartista de storyboard de Pixar, incluyó una versión en su muy difundida lista de reglas para contar historias.",
          source: "Kenn Adams; popularizada por Emma Coats",
          sourceDetail: "Story spine, de la práctica de improvisación y las 'reglas de narrativa de Pixar' de Coats",
        },
        example: {
          situation: "Lucía, gerente de atención al cliente, explica por qué quiere extender el horario del chat.",
          before:
            "\"Nuestros datos muestran que el volumen de tickets en la noche aumentó y que los tiempos de respuesta después de las 6 p. m. son más lentos, así que deberíamos considerar ampliar la cobertura del chat.\"",
          after:
            "\"Todas las noches, nuestro chat cerraba a las 6. Entonces, el mes pasado, un cliente hospitalario tuvo un error de facturación a las 7 p. m. y esperó hasta la mañana. Por eso, escaló el problema a su director general. Cubrimos las noches durante dos semanas como prueba y, desde entonces, las quejas después de las 6 se acabaron.\"",
          whyItWorks:
            "Un cliente, un momento y un cambio hacen que los mismos datos sean imposibles de ignorar. Los líderes pueden imaginar el costo de no hacer nada.",
        },
        reflectionPrompt:
          "Piensa en un resultado que lograste este año. ¿Cuál era la 'normalidad' antes, y cuál fue el momento en que las cosas cambiaron?",
      },
      exercise: {
        title: "Ordena la historia",
        description: "Organiza los tiempos de una historia de trabajo breve en una columna vertebral clara.",
        config: {
          type: "order",
          instruction:
            "Ordena estas frases para formar una historia que un líder de ventas podría contar en una reunión de equipo.",
          items: [
            "Durante dos años, enviamos a cada cliente nuevo el mismo manual de bienvenida de 40 páginas.",
            "Entonces, un cliente nuevo nos dijo que nunca lo abrió y casi cancela en la segunda semana.",
            "Por eso, reemplazamos el manual por una llamada de bienvenida de 20 minutos.",
            "Por eso, los clientes empezaron a usar el producto en su primera semana.",
            "Hoy la llamada de bienvenida es estándar, y las cancelaciones tempranas han bajado.",
          ],
          explanation:
            "La historia avanza del estado normal al cambio que lo interrumpió, a las acciones tomadas y a la nueva normalidad. Cada paso causa el siguiente, y eso es lo que la hace fácil de seguir.",
        },
      },
      quiz: [
        {
          prompt: "¿Qué apertura prepara mejor una historia de trabajo?",
          options: [
            "\"Las historias son muy importantes en los negocios.\"",
            "\"Todos los lunes, nuestro equipo pasaba tres horas armando a mano el mismo reporte.\"",
            "\"Estos son cinco aprendizajes clave de este trimestre.\"",
            "\"Déjenme darles algo de contexto sobre nuestras herramientas.\"",
          ],
          explanation:
            "Establece un estado normal concreto, que prepara un cambio. Las demás son afirmaciones o agendas, no aperturas de una historia.",
        },
        {
          prompt: "Tienes 45 segundos para contar una historia en una entrevista. ¿Qué deberías cortar primero?",
          options: [
            "El punto de giro",
            "El resultado",
            "Los detalles de contexto que no afectan lo que pasó",
            "El personaje principal",
          ],
          explanation:
            "La columna vertebral necesita el personaje, el cambio y el resultado. El contexto que no impulsa la acción es lo que hace que una historia se arrastre.",
        },
        {
          prompt: "¿Por qué 'por eso' hace que una historia sea más fácil de seguir?",
          options: [
            "Hace que la historia suene más formal",
            "Vincula cada hecho con el anterior como causa y efecto, así quien escucha ve por qué pasaron las cosas",
            "Agrega suspenso",
            "Te permite incluir más detalles",
          ],
          explanation:
            "Los vínculos causales convierten una lista de hechos en una narración. La gente sigue y recuerda la causa y el efecto con más facilidad que una simple secuencia.",
        },
      ],
      action: {
        title: "Cuenta una historia hoy",
        description:
          "Hoy, en una reunión, llamada o conversación, reemplaza un reporte de datos por una historia breve usando la columna vertebral: estado normal, cambio, lo que hiciste, qué es distinto ahora. Que dure menos de un minuto.",
        successCriteria:
          "Contaste una historia de trabajo de menos de un minuto usando los cuatro tiempos, y notaste si la gente hizo preguntas de seguimiento.",
      },
    },

    "comms-contrast-makes-it-stick": {
      title: "Usa el contraste para que tu mensaje se quede",
      description: "Muestra la brecha entre lo que es y lo que podría ser, para que la gente sienta la necesidad de cambiar.",
      content: {
        hook: "\"Deberíamos mejorar el onboarding\" es fácil de aceptar y fácil de ignorar. Muéstrale a la gente la brecha y prestará atención.",
        whyItMatters:
          "Las propuestas, los pitches y las solicitudes de cambio muchas veces fracasan no porque la idea sea mala, sino porque la situación actual se siente aceptable. El contraste hace visible el costo de quedarse igual, y eso es lo que mueve a la gente a actuar.",
        coreConcept: {
          title: "Lo que es frente a lo que podría ser",
          body: [
            "El contraste pone dos imágenes una al lado de la otra: cómo son las cosas hoy y cómo podrían ser. La tensión entre ambas crea una razón para moverse.",
            "Haz concretos ambos lados. 'Hoy, una persona recién contratada espera nueve días para tener acceso a los sistemas. Podría tenerlo listo el primer día.' Los contrastes vagos como 'mejor' o 'más eficiente' no generan tensión.",
            "En presentaciones más largas, ve y vuelve entre ambos lados varias veces, y termina en el futuro mejor y en el paso que los lleva hasta ahí.",
          ],
          keyPoints: [
            "Muestra la realidad de hoy y luego el futuro posible.",
            "Haz que ambos lados sean específicos y visuales.",
            "La brecha genera la motivación, no los adjetivos.",
            "Termina en el futuro y en el primer paso.",
          ],
        },
        expertInsight: {
          text: "La diseñadora de presentaciones Nancy Duarte analizó muchos discursos célebres y encontró que los más sólidos se mueven una y otra vez entre 'lo que es' y 'lo que podría ser'. Esa oscilación crea una tensión que hace que la audiencia desee el nuevo futuro.",
          source: "Nancy Duarte",
          sourceDetail: "Resonate (2010)",
        },
        example: {
          situation: "Omar, gerente de TI, pide presupuesto para automatizar la aprobación de gastos.",
          before:
            "\"Automatizar la aprobación de gastos haría el proceso más eficiente y mejoraría la experiencia de los colaboradores.\"",
          after:
            "\"Hoy, una rendición de gastos pasa por cuatro bandejas de entrada y tarda dos semanas en pagarse. Con la automatización, se aprueba el mismo día y se paga en el siguiente ciclo.\"",
          whyItWorks:
            "El 'hoy' concreto hace real el problema, y el 'podría ser' concreto hace tangible el beneficio. La brecha es la que persuade.",
        },
        reflectionPrompt:
          "¿Qué cambio estás tratando de impulsar en tu trabajo ahora mismo? Describe la realidad de hoy y el futuro mejor en una frase cada uno.",
      },
      exercise: {
        title: "Agrega el contraste",
        description: "Reescribe una propuesta plana para que muestre la brecha entre hoy y mañana.",
        config: {
          type: "rewrite",
          instruction:
            "Reescribe esta línea de propuesta usando contraste: una frase concreta sobre cómo están las cosas hoy y otra sobre cómo podrían estar.",
          original:
            "Creo que un tablero de proyectos compartido realmente ayudaría a mejorar la visibilidad y la comunicación entre los equipos, y probablemente haría todo más eficiente en general.",
          tips: [
            "Empieza con 'Hoy,' y describe un problema concreto.",
            "Sigue con cómo podría ser, con la misma concreción.",
            "Reemplaza 'eficiente' y 'visibilidad' por cosas que la gente pueda imaginar.",
          ],
          maxWords: 45,
          keywords: ["hoy", "en cambio", "podría", "con un"],
          modelAnswer:
            "Hoy, el estado de los proyectos vive en seis hojas de cálculo, y los líderes pasan los lunes por la mañana persiguiendo actualizaciones. Con un tablero compartido, cualquiera podría ver el estado de cada proyecto en un minuto.",
        },
      },
      quiz: [
        {
          prompt: "¿Qué línea usa el contraste de forma más eficaz?",
          options: [
            "\"Nuestro nuevo proceso será mucho mejor.\"",
            "\"Hoy, los clientes esperan tres días por una cotización. El próximo trimestre, podrían tenerla en una hora.\"",
            "\"El cambio es difícil, pero necesario.\"",
            "\"Tenemos que ser más ágiles y estar más centrados en el cliente.\"",
          ],
          explanation:
            "Ambos lados son concretos y comparables, así que la brecha es evidente. Las demás son afirmaciones sin una imagen.",
        },
        {
          prompt: "¿Por qué importa mostrar la situación actual al proponer un cambio?",
          options: [
            "Demuestra que investigaste",
            "Hace visible el costo de no hacer nada",
            "Hace la presentación más larga",
            "Muestra respeto por las decisiones pasadas",
          ],
          explanation:
            "Muchas propuestas fracasan porque el statu quo se siente aceptable. Un 'lo que es' vívido hace que quedarse igual se sienta costoso.",
        },
        {
          prompt: "En una presentación larga que usa contraste, ¿dónde deberías terminar?",
          options: [
            "En los problemas de hoy, para dejar urgencia",
            "En un resumen de todos los datos",
            "En el futuro mejor y el primer paso para llegar ahí",
            "En los riesgos de la propuesta",
          ],
          explanation:
            "Terminar en el futuro posible, con un siguiente paso claro, convierte en acción la tensión que creaste.",
        },
      ],
      action: {
        title: "Propón con contraste",
        description:
          "Elige una idea para la que quieras el apoyo de alguien. Hoy, en un mensaje o una conversación, descríbela con una frase que empiece con 'Hoy…' y otra con 'En cambio, podríamos…'.",
        successCriteria:
          "Compartiste una propuesta usando una situación actual concreta y una situación futura concreta, y anotaste la respuesta.",
      },
    },
  },
};
