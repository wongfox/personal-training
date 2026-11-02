import type { JourneyTranslation } from "../translations";

export const sharperThinkingEs: JourneyTranslation = {
  title: "Pensamiento agudo",
  subtitle: "Estructura problemas, decide con menos sesgos y recuerda lo que importa.",
  description:
    "Nueve sesiones sobre la mecánica práctica de pensar bien: organizar las ideas para que otros las sigan, tomar decisiones que resistan el escrutinio y usar técnicas de memoria respaldadas por la investigación para aprender más rápido y retener más.",
  modules: [
    {
      title: "Pensamiento estructurado",
      description:
        "Organiza problemas e ideas para que tú, y todas las personas con las que trabajas, puedan verlos con claridad.",
    },
    {
      title: "Decisiones y sesgos",
      description:
        "Toma decisiones que se sostengan anticipando el fracaso, evaluando las opciones con intención y revisando tus propios puntos ciegos.",
    },
    {
      title: "Memoria y aprendizaje",
      description:
        "Usa técnicas respaldadas por la investigación para recordar personas, ideas e información cuando importa.",
    },
  ],
  lessons: {
    /* ───────────────────────── Módulo 1 ───────────────────────── */
    "think-answer-first": {
      title: "Empieza por la respuesta",
      description: "Pon tu conclusión primero y tus razones después, para que la gente capte la idea en segundos.",
      content: {
        hook: "Las personas ocupadas deciden en las primeras líneas si tu mensaje importa. Si tu idea principal está al final, muchas nunca llegan a ella.",
        whyItMatters:
          "Por naturaleza escribimos en el orden en que pensamos: contexto, análisis y luego conclusión. Quien lee necesita lo contrario. Empezar por la respuesta le ahorra tiempo, hace que tu razonamiento sea más fácil de verificar y te hace sonar más decidido.",
        coreConcept: {
          title: "La pirámide: respuesta y luego razones",
          body: [
            "Empieza por tu idea principal: la respuesta, la recomendación o el pedido. Luego da las pocas razones clave que la sostienen y, solo después, el detalle de cada razón.",
            "Funciona porque las personas procesan las ideas con más facilidad cuando saben adónde vas. Cada argumento llega como evidencia de algo, no como un dato suelto que tienen que retener hasta el final.",
            "Una prueba rápida: si el lector se detuviera después de tu primera frase, ¿sabría qué concluiste o qué quieres? Si no, sube la conclusión.",
          ],
          keyPoints: [
            "Pon la conclusión o el pedido en la primera frase.",
            "Sostenla con dos a cuatro razones clave.",
            "Deja el detalle debajo de las razones, no antes.",
            "Prueba: ¿la primera línea se sostiene por sí sola?",
          ],
        },
        expertInsight: {
          text: "Barbara Minto, exconsultora de McKinsey, desarrolló el Principio de la Pirámide: presentar las ideas de arriba abajo, empezando por la idea rectora y siguiendo con los argumentos de apoyo agrupados, porque los lectores captan las ideas con más facilidad cuando conocen primero la conclusión.",
          source: "Barbara Minto",
          sourceDetail: "The Pyramid Principle",
        },
        example: {
          situation: "Chloe, analista financiera, le escribe a su director tras investigar un sobrecosto en el presupuesto.",
          before:
            "“Revisé los números del segundo trimestre en todas las regiones y, después de compararlos con el pronóstico y hablar con los líderes regionales, parece que hubo algunos factores, principalmente en la región Oeste y relacionados con los fletes, lo que significa que quizá tengamos que ajustar…”",
          after:
            "“Vamos a exceder el presupuesto del segundo trimestre a menos que limitemos este mes los costos de flete de la región Oeste. Dos razones: allí los recargos por combustible subieron mucho y dos pedidos grandes se despacharon por envío exprés. Recomiendo pasar los pedidos restantes del Oeste a envío estándar. Detalle abajo”.",
          whyItWorks:
            "El director conoce la conclusión y la acción recomendada en dos frases y puede decidir si sigue leyendo.",
        },
        reflectionPrompt:
          "Mira el último mensaje largo que enviaste. ¿Dónde estaba tu idea principal y cómo se leería si la movieras a la primera línea?",
      },
      exercise: {
        title: "Sube la respuesta",
        description: "Reestructura una actualización que da vueltas para que empiece por lo importante.",
        config: {
          type: "rewrite",
          instruction:
            "Reescribe esta actualización para que la primera frase indique la conclusión o la recomendación, seguida de razones breves que la respalden.",
          original:
            "Bueno, pasé los últimos días revisando nuestro flujo de onboarding, hablé con algunos clientes y revisé la analítica. Pasan muchas cosas, pero algo que salió varias veces es que el paso de configuración pide demasiada información de entrada, y mucha gente abandona ahí. Así que estaba pensando que tal vez podríamos simplificarlo.",
          tips: [
            "Empieza por la recomendación.",
            "Da dos o tres razones que la respalden.",
            "Elimina la historia de cómo lo descubriste.",
          ],
          maxWords: 50,
          keywords: ["recomiendo", "propongo", "deberíamos", "deberiamos", "simplific"],
          modelAnswer:
            "Recomiendo simplificar el paso de configuración del onboarding y dejar solo los campos esenciales. Dos razones: ahí abandona la mayoría de los usuarios nuevos, y los clientes que entrevisté dicen que pide demasiado y muy pronto. Puedo compartir un borrador el viernes.",
        },
      },
      quiz: [
        {
          prompt: "¿Qué frase de apertura sigue mejor el principio de empezar por la respuesta?",
          options: [
            "He estado revisando las propuestas de los proveedores durante la última semana.",
            "Hay varias consideraciones respecto a los proveedores.",
            "Deberíamos elegir al Proveedor B: es más barato a tres años y se integra con nuestro CRM.",
            "Como sabes, el contrato con el proveedor vence pronto.",
          ],
          explanation:
            "Plantea la recomendación y anticipa las razones. Las demás aperturas hacen esperar al lector para llegar a lo importante.",
        },
        {
          prompt: "Tu jefe te pide una actualización rápida sobre un proyecto retrasado. ¿Cuál es la mejor estructura?",
          options: [
            "Historia del cronograma, luego los problemas y luego la nueva fecha",
            "La nueva fecha estimada y lo que necesitas, luego las causas principales y luego los detalles si te los piden",
            "Una disculpa, luego las causas y luego la nueva fecha",
            "Cada tarea en detalle, para que no se escape nada",
          ],
          explanation:
            "Empieza por lo que necesita saber o hacer. Las causas y el detalle respaldan la conclusión y pueden omitirse si tiene poco tiempo.",
        },
        {
          prompt: "¿Por qué poner la conclusión primero hace que los argumentos de apoyo sean más fáciles de seguir?",
          options: [
            "Siempre hace que el mensaje sea más corto",
            "Oculta los razonamientos débiles",
            "Suena más seguro",
            "Los lectores pueden interpretar cada punto como evidencia de una afirmación que ya conocen",
          ],
          explanation:
            "Conocer el destino le da a cada argumento un lugar donde aterrizar. Sin él, los lectores deben retener datos dispersos hasta el final.",
        },
      ],
      action: {
        title: "Envía un mensaje que empiece por la respuesta",
        description:
          "Antes de enviar hoy tu próximo correo o mensaje importante, reescríbelo para que la primera frase sea la conclusión o el pedido, seguida de las razones clave.",
        successCriteria:
          "Se envió un mensaje cuya primera frase, por sí sola, le dice al lector qué concluiste o qué quieres.",
      },
    },
    "think-mece": {
      title: "Divide los problemas en partes limpias",
      description: "Separa un problema en partes que no se superpongan ni dejen vacíos.",
      content: {
        hook: "Un problema enredado muchas veces no es difícil. Simplemente se cortó en partes que se superponen y dejan huecos.",
        whyItMatters:
          "Cuando un problema se divide en partes superpuestas, la gente cuenta dos veces lo mismo y discute sin entenderse. Cuando faltan partes, la causa real se esconde en la zona que nadie examinó. Una división limpia acelera el análisis y afina las discusiones.",
        coreConcept: {
          title: "Mutuamente excluyentes, colectivamente exhaustivas",
          body: [
            "MECE (del inglés mutually exclusive, collectively exhaustive) significa dividir un problema en partes mutuamente excluyentes (sin superposición) y colectivamente exhaustivas (sin que falte nada). La utilidad se divide limpiamente en ingresos y costos; los ingresos, en número de ventas y precio promedio.",
            "Formas confiables de dividir: por fórmula (ingresos = volumen × precio), por etapa del proceso (atraer, convertir, retener), por segmento (clientes nuevos vs. existentes) o por opuestos reales (causas internas vs. externas).",
            "Un MECE perfecto no siempre es posible, y está bien. Lo importante es revisar tu división: ¿algo podría caer en dos categorías? ¿Hay alguna causa probable que no encaje en ninguna? Corrige eso y tu análisis se afina rápidamente.",
          ],
          keyPoints: [
            "Sin superposición entre las partes.",
            "Sin vacíos: juntas cubren todo el problema.",
            "Divide por fórmula, proceso, segmento u opuestos reales.",
            "Revisa si hay doble conteo o categorías faltantes.",
          ],
        },
        expertInsight: {
          text: "El principio MECE está muy asociado con McKinsey & Company y es central en el trabajo de Barbara Minto sobre el razonamiento estructurado. Agrupar las ideas de modo que no se superpongan ni dejen vacíos hace que un argumento sea más fácil de seguir y más difícil de rebatir.",
          source: "Barbara Minto / McKinsey & Company",
          sourceDetail: "The Pyramid Principle",
        },
        example: {
          situation:
            "A Ravi, líder de operaciones, le preguntan por qué empeoraron los tiempos de respuesta del soporte al cliente.",
          before:
            "Hace una lista: “personal, la nueva herramienta, volumen de tickets, feriados, agentes lentos, tickets más difíciles”. El equipo discute, porque los feriados y el personal se superponen, y “agentes lentos” puede significar casi cualquier cosa.",
          after:
            "Lo divide en demanda (número de tickets, esfuerzo por ticket) y capacidad (horas disponibles de los agentes, tickets atendidos por hora). Cada sospecha encaja en una categoría, y los datos muestran rápidamente que la demanda subió mientras la capacidad se mantuvo igual.",
          whyItWorks:
            "La división MECE convierte una lista de sospechas en una estructura que los datos pueden poner a prueba, y evita que la gente discuta por etiquetas superpuestas.",
        },
        reflectionPrompt:
          "Elige un problema en el que estés trabajando. ¿En qué dos o tres categorías MECE podrías dividirlo?",
      },
      exercise: {
        title: "Detecta la división limpia",
        description: "Elige la división que mejor evita superposiciones y vacíos.",
        config: {
          type: "choice",
          scenario:
            "Los ingresos mensuales de tu tienda online cayeron. Tu jefe te pide estructurar la investigación antes de que alguien empiece a escarbar.",
          question: "¿Qué división es el punto de partida más MECE?",
          options: [
            {
              text: "Problemas de marketing, problemas del sitio web, actividad de la competencia, estacionalidad, malas reseñas",
              quality: "ok",
              feedback:
                "Todas son plausibles, pero se superponen (las malas reseñas pueden ser un problema del sitio o de marketing) y pueden pasar por alto causas como el precio.",
            },
            {
              text: "Lo que controlamos y lo que nos preocupa",
              quality: "weak",
              feedback: "No son opuestos: una causa puede ser ambas cosas, y muchas causas podrían no encajar en ninguna.",
            },
            {
              text: "Número de pedidos y valor promedio por pedido",
              quality: "best",
              feedback:
                "Los ingresos equivalen al número de pedidos por el valor promedio por pedido, así que estas dos partes cubren todo sin superponerse. Luego cada una puede dividirse más.",
            },
            {
              text: "Compradores en celular, compradores en computadora y clientes recurrentes",
              quality: "weak",
              feedback:
                "Los clientes recurrentes se superponen con ambos grupos de dispositivos, así que la misma caída podría contarse dos veces.",
            },
          ],
        },
      },
      quiz: [
        {
          prompt: "¿Qué división de los “costos de personal” totales de una empresa es MECE?",
          options: [
            "Sueldos, bonos y personal de ingeniería",
            "Personal senior, personal remoto y personal en oficina",
            "Costos de empleados y costos de contratistas",
            "Sueldos y empleados con ingresos altos",
          ],
          explanation:
            "Toda persona a la que se le paga es empleado o contratista, sin superposición. Las demás opciones mezclan categorías, así que el mismo costo podría contarse dos veces.",
        },
        {
          prompt:
            "La lista de tu equipo sobre las razones de la baja respuesta a una encuesta incluye “demasiado larga” y “demasiadas preguntas”. ¿Cuál es el problema MECE?",
          options: [
            "Hay un vacío en la lista",
            "Se superponen y pueden contar dos veces la misma causa",
            "Son demasiado específicas para ser útiles",
            "Ninguno; ambas son razones válidas",
          ],
          explanation:
            "La extensión y el número de preguntas describen en gran parte el mismo problema. Unirlas evita inflar su importancia y aclara el análisis.",
        },
        {
          prompt: "¿Cuál es una forma confiable de crear una división MECE?",
          options: [
            "Usar una fórmula, como utilidad = ingresos − costos",
            "Hacer una lluvia de ideas con todas las causas posibles en una sola lista",
            "Agrupar las causas según quién las planteó",
            "Ordenar las ideas según qué tan probables parecen",
          ],
          explanation:
            "Los componentes de una fórmula cubren todo el resultado sin superponerse, por definición. Las listas de lluvia de ideas son buena materia prima, pero rara vez son MECE tal como están.",
        },
      ],
      action: {
        title: "Aplica MECE a un problema real",
        description:
          "Toma hoy un problema de tu trabajo o tu vida, como un presupuesto, un retraso o una meta estancada. Divídelo en papel en dos a cuatro categorías MECE y revisa si hay superposiciones o vacíos.",
        successCriteria:
          "Tienes una división escrita en la que cada causa probable encaja exactamente en una categoría, y marcaste cuál investigar primero.",
      },
    },
    "think-first-principles": {
      title: "Razona desde primeros principios",
      description: "Reduce un problema a lo que realmente es cierto y reconstruye tu solución desde ahí.",
      content: {
        hook: "Mucho de lo que llamamos “así se hace” es simplemente cómo se hizo la última vez.",
        whyItMatters:
          "Razonar por analogía, copiando lo que hacen otros, es rápido y suele estar bien. Pero también arrastra los supuestos y las restricciones de otras personas. Cuando estás atascado o hay mucho en juego, descomponer un problema hasta sus fundamentos puede revelar opciones que la convención esconde.",
        coreConcept: {
          title: "Cuestiona los supuestos, reconstruye desde los hechos",
          body: [
            "Pensar desde primeros principios significa identificar las verdades básicas de un problema y razonar a partir de ellas, en lugar de partir de las soluciones existentes. La pregunta central: ¿qué sabemos con certeza aquí y qué estamos simplemente suponiendo?",
            "Un método práctico: plantea el problema, enumera los supuestos detrás del enfoque actual y cuestiona cada uno (“¿Esto es realmente cierto? ¿Quién lo dice?”). Luego construye una solución usando solo lo que sobrevive.",
            "No lo harás con todo, porque es lento. Úsalo cuando una restricción parezca arbitraria, cuando los costos se mantengan obstinadamente altos o cuando todas las soluciones disponibles se vean iguales.",
          ],
          keyPoints: [
            "Separa los hechos de los supuestos heredados.",
            "Cuestiona cada supuesto: ¿es realmente cierto?",
            "Reconstruye la solución con lo que queda.",
            "Resérvalo para problemas importantes o estancados.",
          ],
        },
        expertInsight: {
          text: "Aristóteles describió los primeros principios como las verdades fundamentales de las que se deriva el resto del conocimiento y que no pueden deducirse de nada más básico. Quienes resuelven problemas hoy usan la idea como una disciplina: razonar desde los fundamentos, no desde los precedentes.",
          source: "Aristóteles",
          sourceDetail: "Filosofía griega clásica",
        },
        example: {
          situation:
            "Jonas dirige la capacitación de un equipo de ventas y le dicen que el programa anual de inducción “tiene que ser” un bootcamp presencial de cinco días.",
          before: "Intenta meter más contenido en los cinco días y pelea por un presupuesto mayor para el local.",
          after:
            "Enumera los supuestos: tiene que ser presencial, con todos a la vez y de cinco días. Luego pregunta qué se necesita realmente: los nuevos vendedores deben poder hacer una demo del producto y manejar las objeciones comunes antes de reunirse con clientes. Lo reconstruye como módulos cortos a su propio ritmo, seguidos de un día presencial de práctica en vivo.",
          whyItWorks:
            "Separar el objetivo real del formato heredado le permitió a Jonas encontrar un enfoque más barato, centrado en la habilidad que de verdad importa.",
        },
        reflectionPrompt: "¿Qué “así se hace” de tu trabajo nunca has cuestionado?",
      },
      exercise: {
        title: "Desármalo y vuelve a armarlo",
        description: "Aplica el razonamiento desde primeros principios a un problema real tuyo.",
        config: {
          type: "structure",
          framework: "Análisis desde primeros principios",
          instruction:
            "Elige un problema en el que el enfoque habitual se sienta caro, lento o estancado. Recorre cada paso en orden.",
          context:
            "Sé implacable en el paso de los supuestos: todo lo que no puedas verificar va ahí, no en “lo que es cierto”.",
          slots: [
            { key: "problem", label: "El problema", hint: "Plantéalo en una frase.", maxWords: 25 },
            {
              key: "assumptions",
              label: "Supuestos",
              hint: "¿Qué da por sentado el enfoque actual?",
              maxWords: 40,
            },
            {
              key: "truths",
              label: "Lo que es realmente cierto",
              hint: "¿Qué hechos o requisitos sobreviven al cuestionamiento?",
              maxWords: 40,
            },
            {
              key: "rebuild",
              label: "Solución reconstruida",
              hint: "Un enfoque nuevo construido solo a partir de esas verdades.",
              maxWords: 40,
            },
          ],
        },
      },
      quiz: [
        {
          prompt:
            "Tu equipo dice que un reporte debe hacerse cada semana “porque siempre ha sido así”. ¿Cuál es el movimiento desde primeros principios?",
          options: [
            "Mantenerlo semanal para evitar trastornos",
            "Preguntar qué decisiones respalda el reporte y con qué frecuencia se toman realmente esas decisiones",
            "Hacerlo diario, por si acaso",
            "Preguntarle a una empresa similar con qué frecuencia hace el suyo",
          ],
          explanation:
            "Vincular el reporte con las decisiones a las que sirve revela el requisito real. Copiar a otra empresa es razonar por analogía, lo que arrastra sus supuestos.",
        },
        {
          prompt: "¿Cuál es un ejemplo de razonar por analogía en lugar de desde primeros principios?",
          options: [
            "Preguntar qué necesita fundamentalmente el cliente",
            "Enumerar los componentes básicos del costo de un producto",
            "Fijar tus precios en lo que cobra un competidor",
            "Verificar si una regulación realmente te aplica",
          ],
          explanation:
            "Copiar el precio de un competidor adopta como supuestos sus costos y su estrategia. Puede ser razonable, pero no es razonar desde tus propios fundamentos.",
        },
        {
          prompt: "¿Cuándo vale más la pena el esfuerzo de pensar desde primeros principios?",
          options: [
            "En cada decisión rutinaria del día",
            "Solo en problemas técnicos de ingeniería",
            "Cuando necesitas una respuesta en los próximos cinco minutos",
            "Cuando el enfoque estándar está estancado, es costoso o se basa en restricciones antiguas",
          ],
          explanation:
            "Es lento y exigente, así que resérvalo para problemas en los que la convención claramente está fallando. Para las decisiones rutinarias, las analogías sensatas son eficientes.",
        },
      ],
      action: {
        title: "Cuestiona un supuesto",
        description:
          "Elige un proceso, una regla o un hábito en el trabajo o en casa. Escribe el supuesto que hay detrás y luego pregúntale a alguien involucrado, o revisa la fuente, si es realmente necesario.",
        successCriteria: "Identificaste un supuesto y confirmaste si es una restricción real o un hábito heredado.",
      },
    },

    /* ───────────────────────── Módulo 2 ───────────────────────── */
    "think-pre-mortem": {
      title: "Haz un pre-mortem",
      description: "Imagina que tu plan ya fracasó para descubrir riesgos mientras todavía puedes corregirlos.",
      content: {
        hook: "Cuando un proyecto fracasa, todos pueden explicar por qué. Un pre-mortem te permite escuchar esas explicaciones antes de empezar.",
        whyItMatters:
          "Los equipos entusiasmados con un plan tienden a subestimar sus riesgos, y a la gente le cuesta criticar un plan que le gusta a su líder. Un pre-mortem convierte encontrar fallas en la tarea asignada, no en un acto de deslealtad. Toma minutos y a menudo saca a la luz el problema que habría hundido el proyecto.",
        coreConcept: {
          title: "Asume que fracasó y luego explica por qué",
          body: [
            "En un pre-mortem le dices al equipo: “Imaginen que estamos a seis meses de hoy y este proyecto fracasó rotundamente. Tómense unos minutos y escriban todas las razones”. Cada persona escribe por su cuenta antes de que nadie hable.",
            "Tratar el fracaso como algo que ya ocurrió cambia la forma de pensar. En lugar de debatir si algo podría salir mal, la gente genera historias concretas de cómo salió mal, lo que suele revelar riesgos más específicos.",
            "Reúne las razones, agrúpalas y elige las más probables o más dañinas. Luego cambia el plan: agrega una salvaguarda, ajusta un paso o define una señal de alerta temprana a vigilar.",
          ],
          keyPoints: [
            "Asume que el plan ya fracasó.",
            "Pide que cada persona escriba primero sus razones por su cuenta.",
            "Agrupa y prioriza los riesgos.",
            "Cambia el plan para los riesgos principales.",
          ],
        },
        expertInsight: {
          text: "El psicólogo Gary Klein desarrolló el pre-mortem para contrarrestar el exceso de confianza en la planificación. Pedirle a un equipo que imagine que un proyecto fracasó y explique por qué legitima el disenso y ayuda a las personas a expresar preocupaciones que de otro modo se guardarían.",
          source: "Gary Klein",
          sourceDetail: "“Performing a Project Premortem”, Harvard Business Review (2007)",
        },
        example: {
          situation: "Amara, gerente de marketing, está por lanzar una campaña para una nueva línea de productos.",
          before:
            "En la revisión final pregunta: “¿Todos conformes?”. Todos asienten. Tras el lanzamiento, la landing page colapsa con el tráfico y el código de descuento falla al momento de pagar.",
          after:
            "Hace un pre-mortem de 15 minutos: “Es una semana después del lanzamiento y la campaña fracasó. ¿Por qué?”. Cada persona escribe por su cuenta. Dos señalan códigos de descuento sin probar; otra, la velocidad de la página con mucho tráfico. Agrega una prueba de carga y una prueba de los códigos a la lista de verificación del lanzamiento.",
          whyItWorks:
            "Escribir por separado evitó el pensamiento de grupo, y plantear el fracaso como un hecho convirtió señalar problemas en el aporte esperado.",
        },
        reflectionPrompt:
          "Piensa en un plan que estás por ejecutar. Si fracasara, ¿cuál sería la razón más probable?",
      },
      exercise: {
        title: "Sigue los pasos del pre-mortem",
        description: "Ordena los pasos de un pre-mortem en la secuencia correcta.",
        config: {
          type: "order",
          instruction: "Ordena estos pasos del pre-mortem tal como los harías.",
          items: [
            "Explicarle el plan al equipo",
            "Pedir a todos que imaginen que el plan fracasó rotundamente",
            "Hacer que cada persona escriba sus razones por su cuenta",
            "Compartir las razones una por una en el grupo",
            "Agrupar y priorizar los riesgos según probabilidad e impacto",
            "Actualizar el plan con salvaguardas para los riesgos principales",
          ],
          explanation:
            "Primero todos necesitan conocer el plan y luego el planteamiento del fracaso. Escribir por separado va antes de compartir para evitar el pensamiento de grupo. Priorizar enfoca el esfuerzo, y la sesión solo rinde frutos si el plan realmente cambia.",
        },
      },
      quiz: [
        {
          prompt:
            "¿Por qué pedir que las personas escriban las razones del fracaso en silencio antes de cualquier discusión?",
          options: [
            "Para ahorrar tiempo en la reunión",
            "Para evitar que las voces tempranas o de mayor jerarquía moldeen las respuestas de los demás",
            "Para mantener las respuestas anónimas por razones legales",
            "Para que el líder pueda filtrar las respuestas primero",
          ],
          explanation:
            "Escribir por separado captura la visión de cada persona antes de que entre en juego la presión social, lo que revela una gama más amplia de riesgos.",
        },
        {
          prompt: "¿En qué se diferencia un pre-mortem de simplemente preguntar “¿Qué podría salir mal?”?",
          options: [
            "Solo funciona para proyectos grandes",
            "Requiere un facilitador externo",
            "Trata el fracaso como algo que ya ocurrió, lo que impulsa explicaciones específicas",
            "Se centra en quién tendría la culpa",
          ],
          explanation:
            "Dar el fracaso por hecho lleva a las personas de juzgar si algo podría fallar a explicar cómo falló, lo que suele producir riesgos más concretos.",
        },
        {
          prompt: "Tu pre-mortem reveló diez riesgos. ¿Cuál es el mejor paso siguiente?",
          options: [
            "Atender los diez por igual antes de empezar",
            "Priorizarlos y ajustar el plan para los pocos más probables o más dañinos",
            "Registrarlos y seguir según lo planeado",
            "Cancelar el proyecto por los riesgos",
          ],
          explanation:
            "No todos los riesgos merecen el mismo esfuerzo. Priorizar te permite actuar sobre los pocos críticos; registrar riesgos sin actuar desperdicia el ejercicio.",
        },
      ],
      action: {
        title: "Haz un pre-mortem de cinco minutos",
        description:
          "Elige un plan que estés por ejecutar: un proyecto, una presentación, un viaje. Solo o con un colega, imagina que fracasó y enumera al menos cinco razones. Elige la principal y cambia algo del plan.",
        successCriteria:
          "Tienes una lista escrita de al menos cinco razones de fracaso y un cambio concreto hecho al plan.",
      },
    },
    "think-weighted-criteria": {
      title: "Decide con criterios ponderados",
      description: "Toma decisiones complejas acordando qué importa antes de comparar las opciones.",
      content: {
        hook: "Cuando una decisión parece imposible, suele ser porque estás comparando las opciones en varias cosas distintas a la vez.",
        whyItMatters:
          "La intuición funciona bien en decisiones conocidas y rápidas. En las grandes, como una contratación, un proveedor o una oferta de trabajo, tiende a aferrarse a lo más llamativo. Escribir criterios y pesos hace que tu razonamiento sea visible, consistente y más fácil de discutir.",
        coreConcept: {
          title: "Primero los criterios, después las opciones",
          body: [
            "Antes de mirar de cerca las opciones, enumera lo que importa: costo, calidad, riesgo, tiempo, alineación con tus objetivos. Hacerlo primero evita que construyas criterios a la medida para justificar tu favorita.",
            "Asigna a cada criterio un peso según su importancia, por ejemplo del 1 al 5. Puntúa cada opción en cada criterio y multiplica. Los totales te dan una comparación estructurada, no un veredicto.",
            "Si el resultado te sorprende, tómalo como información. Puede que un peso esté mal, que falte un criterio o que tu intuición esté reaccionando a algo que todavía no has nombrado. Ajusta y vuelve a mirar.",
          ],
          keyPoints: [
            "Define los criterios antes de evaluar las opciones.",
            "Pondera los criterios según cuánto importan.",
            "Puntúa cada opción y luego compara los totales.",
            "Usa las sorpresas para descubrir criterios faltantes.",
          ],
        },
        expertInsight: {
          text: "Daniel Kahneman recomendaba estructurar los juicios importantes evaluando varias dimensiones por separado y de forma independiente antes de formarse una opinión general. Así se limita cuánto una sola impresión fuerte, como una entrevista impecable, tiñe toda la decisión.",
          source: "Daniel Kahneman",
          sourceDetail: "Pensar rápido, pensar despacio (2011)",
        },
        example: {
          situation: "Ines, líder de equipo, está eligiendo entre tres candidatos para un puesto senior.",
          before:
            "Se inclina por el candidato que dio la entrevista más pulida y luego le cuesta justificarlo cuando un colega le pregunta cómo se compara en profundidad técnica.",
          after:
            "Primero fija los criterios (profundidad técnica ×5, colaboración ×4, experiencia en el sector ×3, comunicación ×3), puntúa a cada candidato de forma independiente y compara. El candidato más pulido queda segundo; el de mayor puntaje era más callado, pero más fuerte en lo que el puesto realmente necesita.",
          whyItWorks:
            "Puntuar las dimensiones por separado evitó que una impresión llamativa dominara todo, y los puntajes escritos hicieron que su decisión fuera fácil de explicar.",
        },
        reflectionPrompt:
          "¿Qué decisión tienes por delante en la que un factor llamativo podría estar pesando más que todo lo demás?",
      },
      exercise: {
        title: "Toma una decisión ponderada",
        description: "Estructura una decisión de equipo realista con criterios y pesos.",
        config: {
          type: "decision",
          instruction:
            "Enumera tus criterios, asigna a cada uno un peso del 1 al 5, puntúa cada opción y mira cuál queda arriba. Anota lo que los puntajes revelan y que tu primer instinto pasó por alto.",
          prompt:
            "Tu equipo debe elegir una herramienta de gestión de proyectos. La opción A es la que la mayoría ya conoce, pero sus reportes son débiles. La opción B tiene reportes e integraciones sólidas, pero una curva de aprendizaje más empinada. La opción C es la más barata, pero obligaría a migrar a mano todos los proyectos existentes.",
          suggestedCriteria: [
            "Facilidad de adopción para el equipo",
            "Reportes y visibilidad",
            "Costo total",
            "Esfuerzo de migración",
            "Integración con las herramientas existentes",
          ],
        },
      },
      quiz: [
        {
          prompt: "¿Por qué definir tus criterios antes de mirar de cerca las opciones?",
          options: [
            "Hace que la decisión sea más rápida",
            "Evita moldear los criterios para justificar una favorita",
            "Asegura que gane la opción más barata",
            "Elimina la necesidad de criterio propio",
          ],
          explanation:
            "Cuando una opción te gusta, es fácil elegir criterios en los que casualmente gana. Fijar los criterios primero mantiene honesta la comparación.",
        },
        {
          prompt:
            "Los puntajes ponderados favorecen la opción A, pero tu intuición prefiere claramente la B. ¿Cuál es la mejor respuesta?",
          options: [
            "Seguir siempre los puntajes",
            "Seguir siempre tu intuición",
            "Preguntarte a qué está reaccionando tu intuición y revisar si falta un criterio o un peso",
            "Promediar ambos resultados",
          ],
          explanation:
            "El desacuerdo es una señal. A menudo tu intuición responde a un factor sin nombrar; nombrarlo mejora el modelo o deja al descubierto un sesgo.",
        },
        {
          prompt: "¿Qué decisión encaja mejor con un enfoque de criterios ponderados?",
          options: [
            "Elegir un proveedor para un contrato de varios años",
            "Elegir dónde almorzar",
            "Decidir si responder un correo ahora",
            "Elegir una tipografía para una diapositiva",
          ],
          explanation:
            "El método requiere esfuerzo, así que rinde en decisiones de alto impacto, con múltiples factores y difíciles de revertir. Las decisiones rápidas y de poco impacto es mejor dejarlas a la intuición.",
        },
      ],
      action: {
        title: "Puntúa una decisión real",
        description:
          "Elige una decisión que tengas por delante, en el trabajo o en lo personal. Enumera de tres a cinco criterios, pondéralos y puntúa al menos dos opciones en una tabla rápida.",
        successCriteria:
          "Tienes una tabla escrita de criterios ponderados y opciones puntuadas, más una frase sobre lo que vas a decidir o lo que te enseñó la tabla.",
      },
    },
    "think-confirmation-bias": {
      title: "Detecta tu sesgo de confirmación",
      description: "Pon a prueba tus creencias buscando la evidencia que podría demostrar que estás equivocado.",
      content: {
        hook: "Cuanto más seguro te sientes, más probable es que solo hayas buscado razones para tener la razón.",
        whyItMatters:
          "Tendemos a notar, buscar y recordar la información que encaja con lo que ya creemos. En el trabajo, eso significa que los proyectos favoritos reciben demasiados recursos, las primeras hipótesis nunca se ponen a prueba y las primeras impresiones sobre las personas se endurecen rápido. Buscar deliberadamente evidencia que te contradiga es una de las formas más simples de pensar con más precisión.",
        coreConcept: {
          title: "Busca lo que demostraría que estás equivocado",
          body: [
            "El sesgo de confirmación es la tendencia a favorecer la información que respalda lo que ya creemos. Influye en lo que buscamos, en cómo interpretamos los datos ambiguos y en qué hechos recordamos después.",
            "La solución empieza por la pregunta que te haces. En lugar de “¿Qué respalda mi postura?”, pregunta: “¿Qué esperaría ver si estuviera equivocado, y lo he buscado?”.",
            "Conviértelo en hábito: antes de comprometerte, escribe una evidencia que te haría cambiar de opinión y luego averigua si existe. También funciona pedirle a alguien que no está de acuerdo que presente su mejor argumento.",
          ],
          keyPoints: [
            "Buscamos, interpretamos y recordamos la evidencia que encaja con nuestras creencias.",
            "Pregúntate qué esperarías ver si estuvieras equivocado.",
            "Decide de antemano qué te haría cambiar de opinión.",
            "Invita el argumento contrario más sólido.",
          ],
        },
        expertInsight: {
          text: "Los experimentos de Peter Wason sobre el descubrimiento de reglas mostraron que las personas tienden a poner a prueba sus hipótesis buscando ejemplos que las confirmen en lugar de intentar refutarlas. Trabajos posteriores de Daniel Kahneman, Amos Tversky y otros sobre heurísticas y sesgos ayudaron a explicar cómo estos errores sistemáticos moldean el juicio cotidiano.",
          source: "Peter Wason; Daniel Kahneman y Amos Tversky",
          sourceDetail: "Investigación sobre la puesta a prueba de hipótesis y el juicio bajo incertidumbre",
        },
        example: {
          situation: "Theo, product manager, cree que una nueva funcionalidad está aumentando la retención de clientes.",
          before:
            "Extrae los datos de retención de los usuarios que adoptaron la funcionalidad, ve que es más alta y lo presenta como prueba.",
          after:
            "Se pregunta: “Si la funcionalidad no importara, ¿qué vería?”. Quizá las personas que adoptan funcionalidades nuevas ya son, simplemente, los usuarios más comprometidos. Compara usuarios comprometidos que la adoptaron y que no, y encuentra un efecto mucho menor de lo que esperaba.",
          whyItWorks:
            "Preguntarse cómo se verían los datos si estuviera equivocado dejó al descubierto una explicación alternativa y le dio a Theo una estimación más honesta.",
        },
        reflectionPrompt:
          "¿Qué creencia sobre tu trabajo sostienes con fuerza? ¿Qué evidencia te haría cambiar de opinión?",
      },
      exercise: {
        title: "Convierte una pregunta confirmatoria en una prueba",
        description: "Reescribe un pedido sesgado para que realmente pueda demostrar que estás equivocado.",
        config: {
          type: "rewrite",
          instruction:
            "Reescribe este pedido para que ponga a prueba la creencia en lugar de confirmarla. Termina con una pregunta.",
          original:
            "¿Me puedes enviar algunos ejemplos de clientes a los que les encantaron los nuevos precios? Quiero mostrarle a la dirección que está funcionando.",
          tips: [
            "Pide evidencia de ambos lados.",
            "Nombra lo que mostraría que no está funcionando.",
            "Usa un lenguaje neutral, que no induzca la respuesta.",
          ],
          maxWords: 45,
          requireQuestion: true,
          keywords: ["queja", "equilibrad", "balancead", "cancel", "no funciona"],
          modelAnswer:
            "Quiero darle a la dirección una lectura honesta de los nuevos precios. ¿Podrías reunir una muestra equilibrada de comentarios y datos, incluidas cancelaciones, cambios a planes menores o quejas desde el cambio, además de las reacciones positivas? ¿Qué nos diría que no funciona?",
        },
      },
      quiz: [
        {
          prompt:
            "Crees que un candidato es fuerte tras una gran primera impresión. ¿Qué paso contrarresta mejor el sesgo de confirmación?",
          options: [
            "Hacer preguntas de seguimiento que le permitan lucirse",
            "Buscar evidencia de que no encaja, usando las mismas preguntas estructuradas que usas con todos",
            "Confiar en tu primera impresión; suele acertar",
            "Preguntarle a un colega al que también le gustó",
          ],
          explanation:
            "Las preguntas estructuradas e iguales para todos, y buscar activamente evidencia en contra, evitan que una primera impresión dirija todo lo que viene después.",
        },
        {
          prompt: "¿Qué pregunta pone mejor a prueba la creencia “Nuestros clientes quieren más funcionalidades”?",
          options: [
            "¿Qué funcionalidades piden más los clientes?",
            "¿Cuántos clientes mencionaron funcionalidades de forma positiva?",
            "¿Qué razón dan los clientes que se fueron o bajaron de plan?",
            "¿Qué funcionalidades de la competencia deberíamos copiar?",
          ],
          explanation:
            "Mirar a los clientes que se fueron podría revelar que el precio, la confiabilidad o la facilidad de uso importan más, lo que cuestionaría la creencia.",
        },
        {
          prompt: "¿Cuál es el hábito más práctico para reducir el sesgo de confirmación?",
          options: [
            "Evitar por completo las opiniones firmes",
            "Reunir la mayor cantidad de datos posible",
            "Confiar solo en datos cuantitativos",
            "Escribir, antes de decidir, qué evidencia te haría cambiar de opinión",
          ],
          explanation:
            "Comprometerte de antemano con lo que te haría cambiar de opinión hace más difícil justificar después la evidencia incómoda. Tener más datos, por sí solo, todavía permite leerlos de forma selectiva.",
        },
      ],
      action: {
        title: "Busca una evidencia que te contradiga",
        description:
          "Elige una creencia sobre la que estés actuando en el trabajo. Escribe qué esperarías ver si fuera falsa y luego dedica diez minutos a buscar exactamente eso, o pregúntale a alguien que no esté de acuerdo.",
        successCriteria:
          "Escribiste una frase de “qué me haría cambiar de opinión” y registraste lo que encontraste, ya sea que confirmara o cuestionara la creencia.",
      },
    },

    /* ───────────────────────── Módulo 3 ───────────────────────── */
    "think-remember-names": {
      title: "Recuerda nombres que no se olvidan",
      description: "Usa la atención, la repetición y asociaciones vívidas para recordar a las personas que conoces.",
      content: {
        hook: "La mayoría de quienes dicen ser malos para los nombres en realidad nunca estaban escuchando cuando se dijo el nombre.",
        whyItMatters:
          "Usar el nombre de alguien transmite atención y respeto, y olvidarlo justo después de una presentación es incómodo para todos. Recordar nombres es sobre todo técnica, no talento. Unos segundos de esfuerzo deliberado en el momento de la presentación marcan una diferencia real.",
        coreConcept: {
          title: "Escúchalo, úsalo, visualízalo",
          body: [
            "Los nombres suelen perderse porque estamos ocupados planeando qué decir después. El primer paso es simplemente concentrarte en el momento de la presentación y, si no lo captaste, preguntar de nuevo enseguida.",
            "Luego usa el nombre pronto y con naturalidad: “Mucho gusto, Daniela”. Decirlo y escucharlo otra vez refuerza el recuerdo mientras está fresco.",
            "Por último, vincula el nombre con una imagen vívida y con algo distintivo de la persona. “Rosa, que dirige logística” se convierte en una rosa que crece dentro de una caja de envío. Cuanto más extraña y visual, mejor se fija.",
          ],
          keyPoints: [
            "Presta toda tu atención en el momento de la presentación.",
            "Repite el nombre pronto y con naturalidad.",
            "Vincula el nombre con una imagen vívida.",
            "Conecta la imagen con un detalle de la persona.",
          ],
        },
        expertInsight: {
          text: "Fergus Craik y Robert Lockhart propusieron que la información procesada con más profundidad, conectándola con un significado o una imagen, se recuerda mejor que la que solo se registra de pasada. Un nombre que solo escuchas se procesa de forma superficial; un nombre que vinculas con una imagen y una persona se procesa en profundidad.",
          source: "Fergus Craik y Robert Lockhart",
          sourceDetail: "Modelo de niveles de procesamiento (1972)",
        },
        example: {
          situation: "Kenji, consultor, conoce a ocho personas nuevas en cinco minutos durante un taller con un cliente.",
          before:
            "Asiente durante las presentaciones mientras ensaya su apertura. Para el primer descanso recuerda un solo nombre y evita dirigirse directamente a nadie.",
          after:
            "Escucha cada nombre, lo repite una vez (“Un gusto conocerte, Farah”) y crea una imagen rápida: Farah, de finanzas, se convierte en un faro hecho de monedas. Para el descanso puede saludar a cinco personas por su nombre.",
          whyItWorks:
            "La atención, la repetición y una imagen vívida y personal convirtieron un sonido fugaz en algo a lo que su memoria podía aferrarse.",
        },
        reflectionPrompt:
          "¿De quién olvidaste el nombre hace poco? ¿Qué pasaba por tu cabeza cuando lo escuchaste?",
      },
      exercise: {
        title: "Recuerda a los presentes",
        description: "Practica recordar nombres y detalles tras una ronda rápida de presentaciones.",
        config: {
          type: "recall",
          instruction:
            "Estudia a estas personas que acabas de conocer en un evento de networking. Luego recuerda tantos nombres y detalles como puedas.",
          items: [
            "Daniela: diseñadora de producto, acaba de mudarse desde Lisboa",
            "Marcus: tiene una cadena de panaderías, le encanta el ciclismo",
            "Priya: científica de datos, habla cuatro idiomas",
            "Owen: abogado de startups, toca el violonchelo",
            "Leila: directora de RR. HH., entrena para un maratón",
            "Tomás: arquitecto que diseña colegios",
            "Grace: inversionista que creció en una granja",
            "Hiro: líder de ventas, colecciona discos de vinilo",
          ],
          studySeconds: 40,
          technique:
            "Con cada persona, di el nombre una vez en tu mente y luego crea una imagen rápida y vívida que vincule el nombre con el detalle: Marcus montando una bicicleta hecha de panes, Owen tocando el violonchelo en una sala de juicios. Lo raro y visual le gana a lo lógico.",
        },
      },
      quiz: [
        {
          prompt:
            "Te presentan a alguien y te das cuenta de inmediato de que no captaste su nombre. ¿Qué es lo mejor?",
          options: [
            "Esperar que salga más adelante en la conversación",
            "Evitar usar su nombre el resto de la charla",
            "Pedirle que lo repita enseguida",
            "Buscarlo en redes sociales después",
          ],
          explanation:
            "Preguntar de inmediato es natural y esperable. Si esperas, después cuesta más preguntar y pasarás la conversación evitando su nombre.",
        },
        {
          prompt: "¿Qué asociación te ayudará más a recordar a “Bella, que trabaja en cumplimiento normativo”?",
          options: [
            "Notar que Bella empieza con B",
            "Una bellota gigante atrapada dentro de un grueso manual de normas",
            "Escribir “Bella, cumplimiento” en tus notas",
            "Repetir “Bella” en silencio diez veces",
          ],
          explanation:
            "Una imagen vívida e inusual que vincula el nombre con un detalle significativo implica un procesamiento más profundo que la repetición mecánica o los rasgos superficiales.",
        },
        {
          prompt: "¿Por qué usar el nombre de alguien al principio de la conversación te ayuda a recordarlo?",
          options: [
            "Te hace parecer más seguro",
            "La etiqueta lo exige",
            "Acorta la conversación",
            "Le da a tu memoria una repetición y una evocación extra de inmediato",
          ],
          explanation:
            "Decirlo en voz alta es un primer intento de práctica que refuerza el recuerdo mientras aún está fresco.",
        },
      ],
      action: {
        title: "Aprende tres nombres nuevos hoy",
        description:
          "En tus próximas reuniones, llamadas o diligencias, aprende el nombre de tres personas que no conoces bien, como un colega, una recepcionista o un barista. Repite cada nombre una vez y crea una imagen para él.",
        successCriteria: "Al final del día, puedes escribir los tres nombres con un detalle de cada persona.",
      },
    },
    "think-spaced-retrieval": {
      title: "Apréndelo una vez, recuérdalo más tiempo",
      description: "Usa la práctica de evocación y el espaciado para recordar lo que aprendes en lugar de releerlo.",
      content: {
        hook: "Releer tus notas se siente productivo. Es una de las formas menos eficaces de recordarlas.",
        whyItMatters:
          "Los profesionales aprenden constantemente, en cursos, libros y reuniones, y olvidan gran parte en pocos días. Dos cambios simples en tu forma de repasar marcan una diferencia considerable: ponerte a prueba en lugar de releer y distribuir tus repasos en el tiempo.",
        coreConcept: {
          title: "Evoca y luego espacia",
          body: [
            "La práctica de evocación consiste en sacar información de tu memoria, respondiendo preguntas o explicando una idea sin mirar, en lugar de volver a meterla releyendo. El esfuerzo de recordar es lo que fortalece el recuerdo.",
            "Espaciar significa repasar a intervalos cada vez más largos: quizá al día siguiente, unos días después y luego una semana o más después. Los recuerdos se desvanecen con el tiempo, y cada repaso bien sincronizado frena ese desvanecimiento.",
            "En la práctica, convierte tus notas en preguntas. En lugar de subrayar “Los pre-mortems revelan riesgos asumiendo el fracaso”, escribe “¿Cómo revela riesgos un pre-mortem?” y respóndela de memoria más adelante.",
          ],
          keyPoints: [
            "Ponte a prueba en lugar de releer.",
            "Convierte tus notas en preguntas.",
            "Espacia los repasos en intervalos cada vez más largos.",
            "Que te cueste recordar es parte de cómo funciona.",
          ],
        },
        expertInsight: {
          text: "Los experimentos de Hermann Ebbinghaus en la década de 1880 describieron cómo la memoria se desvanece con el tiempo, un patrón que hoy se conoce como la curva del olvido, y mostraron que distribuir las repeticiones ralentiza el olvido. Más tarde, Henry Roediger y Jeffrey Karpicke encontraron que practicar la evocación mediante pruebas producía una mejor retención a largo plazo que dedicar el mismo tiempo a volver a estudiar.",
          source: "Hermann Ebbinghaus; Henry Roediger y Jeffrey Karpicke",
          sourceDetail: "Memory (1885); investigación sobre el efecto de la prueba (2006)",
        },
        example: {
          situation: "Zara, nueva gerente de equipo, asiste a un curso de liderazgo de dos días.",
          before:
            "Subraya mucho su cuaderno de trabajo y lo relee la noche siguiente. Tres semanas después solo recuerda un par de ideas.",
          after:
            "Después de cada sesión escribe cinco preguntas en tarjetas. Las responde al día siguiente, de nuevo unos días después y una semana más tarde, y aparta las que le salen con facilidad. Un mes después todavía puede explicarle a su equipo los marcos principales.",
          whyItWorks:
            "Cada repaso obligó a Zara a evocar las ideas, y el espaciado programó esos repasos antes de que los recuerdos se desvanecieran.",
        },
        reflectionPrompt: "¿Qué aprendiste el último mes que te gustaría seguir sabiendo dentro de un año?",
      },
      exercise: {
        title: "Convierte una nota en pregunta",
        description: "Transforma una nota pasiva en una pregunta de evocación con la que puedas ponerte a prueba.",
        config: {
          type: "rewrite",
          instruction:
            "Reescribe esta nota como una pregunta que puedas responder de memoria más adelante. Debe exigirte recordar la idea, no solo reconocerla.",
          original:
            "Nota: Seguridad psicológica = el equipo cree que es seguro asumir riesgos interpersonales (hablar, admitir errores). Los líderes la construyen con el planteamiento del trabajo, admitiendo su falibilidad y haciendo preguntas.",
          tips: [
            "Pide la idea con tus propias palabras.",
            "Prefiere “cómo” o “por qué” a un simple “qué”.",
            "No pongas la respuesta dentro de la pregunta.",
          ],
          maxWords: 30,
          requireQuestion: true,
          keywords: ["cómo", "como", "por qué", "por que", "qué"],
          modelAnswer:
            "¿Qué es la seguridad psicológica y qué tres cosas puede hacer un líder para construirla en su equipo?",
        },
      },
      quiz: [
        {
          prompt: "Tienes un examen de certificación en tres semanas. ¿Qué plan de estudio es más eficaz?",
          options: [
            "Releer el material varias veces la semana anterior",
            "Responder preguntas de práctica de memoria, distribuidas a lo largo de las tres semanas",
            "Subrayar los pasajes clave y repasar lo subrayado cada día",
            "Estudiar todo de golpe en una sola sesión larga el día anterior",
          ],
          explanation:
            "La práctica de evocación distribuida en el tiempo supera a releer y a estudiar de golpe para la retención a largo plazo. Subrayar se siente productivo, pero implica poca evocación.",
        },
        {
          prompt: "Intentas recordar un concepto y te cuesta, pero al final lo logras. ¿Qué significa ese esfuerzo?",
          options: [
            "Deberías pasarte a releer",
            "El concepto es demasiado difícil para ti",
            "Deberías dejar de repasarlo",
            "El esfuerzo de evocar está ayudando a fortalecer el recuerdo",
          ],
          explanation:
            "La evocación con esfuerzo es una ventaja, no un fracaso. Los recuerdos que cuestan algo de trabajo tienden a ser más duraderos.",
        },
        {
          prompt: "¿Qué calendario de repaso aprovecha mejor el espaciado?",
          options: [
            "Cinco veces el primer día",
            "Día 1, día 3, día 7 y luego día 21",
            "Una vez, un mes después",
            "Todos los días, indefinidamente",
          ],
          explanation:
            "Los repasos a intervalos crecientes atrapan los recuerdos antes de que se desvanezcan demasiado, sin perder tiempo en material que ya dominas.",
        },
      ],
      action: {
        title: "Crea cinco tarjetas de evocación",
        description:
          "Toma notas de algo que aprendiste esta semana, como una reunión, un artículo o un curso. Escribe cinco preguntas en tarjetas o en una app y programa un recordatorio para responderlas de memoria mañana.",
        successCriteria:
          "Cinco preguntas están en un lugar donde las verás mañana, con un recordatorio programado para el repaso.",
      },
    },
    "think-memory-palace": {
      title: "Construye un palacio de la memoria",
      description: "Coloca lo que necesitas recordar a lo largo de un recorrido conocido y luego vuelve a recorrerlo.",
      content: {
        hook: "No puedes recordar una lista de diez cosas, pero sí puedes recorrer tu casa con los ojos cerrados.",
        whyItMatters:
          "Nuestra memoria para los lugares y las imágenes es mucho más fuerte que para las listas abstractas. El palacio de la memoria aprovecha esa fortaleza y te permite recordar puntos clave, secuencias o listas sin notas. Es útil para presentaciones, entrevistas y cualquier momento en que necesites cosas en orden.",
        coreConcept: {
          title: "Los lugares guardan imágenes",
          body: [
            "Elige un recorrido que conozcas a la perfección, como tu casa desde la puerta de entrada hasta el dormitorio. Escoge paradas distintas a lo largo de él: la puerta, el espejo del pasillo, la mesa de la cocina, el sofá.",
            "Convierte cada elemento en una imagen vívida y exagerada, y colócala en una parada. Para recordar “presupuesto, contrataciones, cronograma”, imagina una billetera gigante atascada en tu puerta de entrada, una fila de candidatos en tu pasillo y un reloj enorme derritiéndose sobre la mesa de la cocina.",
            "Para recordar, recorre la ruta mentalmente y “mira” lo que hay en cada parada. El recorrido conserva el orden y las imágenes guardan el contenido. Unas pocas prácticas hacen que la técnica se sienta natural.",
          ],
          keyPoints: [
            "Usa un recorrido que conozcas a la perfección.",
            "Convierte cada elemento en una imagen vívida y extraña.",
            "Coloca una imagen en cada parada, en orden.",
            "Recuerda recorriendo la ruta mentalmente.",
          ],
        },
        expertInsight: {
          text: "El método de los loci se remonta a la retórica de la antigua Grecia y Roma. Cicerón atribuye su invención al poeta Simónides de Ceos, y los oradores romanos usaban edificios imaginarios para pronunciar largos discursos de memoria. Los atletas de memoria de competición todavía se apoyan hoy en versiones de este método.",
          source: "Método de los loci",
          sourceDetail: "Descrito por Cicerón en De Oratore",
        },
        example: {
          situation:
            "Adriana, directora de ventas, debe presentar una actualización trimestral de siete puntos sin diapositivas.",
          before: "Escribe los puntos en una tarjeta y no deja de mirarla, con lo que pierde el contacto visual y la fluidez.",
          after:
            "Coloca cada punto a lo largo de su trayecto de cada mañana: una cafetera rota en la reja de su casa para las quejas de clientes, un cohete en la parada del bus para el crecimiento en el nuevo mercado, y así sucesivamente. Durante la presentación recorre la ruta mentalmente y expone los siete puntos en orden.",
          whyItWorks:
            "El recorrido conocido le dio una secuencia confiable, y las imágenes vívidas hicieron que cada punto fuera fácil de recuperar bajo presión.",
        },
        reflectionPrompt: "¿En qué parte de tu trabajo te haría más eficaz recordar una secuencia sin notas?",
      },
      exercise: {
        title: "Recorre el palacio",
        description: "Usa un recorrido conocido para memorizar en orden una lista de puntos clave.",
        config: {
          type: "recall",
          instruction:
            "Memoriza en orden estos diez puntos clave usando un recorrido por tu casa. Luego recuérdalos en secuencia.",
          items: [
            "Bienvenida y propósito",
            "Resultados del último trimestre",
            "El mayor logro con un cliente",
            "Una lección clave aprendida",
            "Nuevo plan de contrataciones",
            "Cambios en el presupuesto",
            "Fecha de lanzamiento del producto",
            "Principal riesgo a vigilar",
            "Pedido de apoyo",
            "Fecha del próximo seguimiento",
          ],
          studySeconds: 45,
          technique:
            "Elige diez paradas a lo largo de un recorrido que conozcas bien, empezando por tu puerta de entrada. Convierte cada punto en una imagen absurda y colócala en la siguiente parada: un tapete de bienvenida gigante en la puerta, un trofeo en el estante del pasillo para los resultados. Para recordar, recorre la ruta mentalmente.",
        },
      },
      quiz: [
        {
          prompt: "¿Por qué el palacio de la memoria funciona bien con listas ordenadas?",
          options: [
            "Requiere menos esfuerzo que tomar notas",
            "Funciona sin ninguna imagen",
            "Los recorridos conocidos tienen una secuencia incorporada, y la memoria espacial es fuerte",
            "Solo funciona con listas muy cortas",
          ],
          explanation:
            "El recorrido conserva el orden, y recordamos bien los lugares y las imágenes vívidas. Requiere algo de esfuerzo, pero sirve para listas largas.",
        },
        {
          prompt:
            "Necesitas recordar “renovación del contrato” con un palacio de la memoria. ¿Qué imagen es la más potente?",
          options: [
            "Las palabras “renovación del contrato” escritas en tu puerta",
            "Una simple hoja de papel sobre tu mesa",
            "Un calendario colgado en la pared",
            "Un contrato gigante al que le brotan hojas verdes y que crece atravesando tu sofá",
          ],
          explanation:
            "Las imágenes exageradas, inusuales y en movimiento son más memorables que el texto plano o los objetos comunes, y el crecimiento captura la idea de “renovación”.",
        },
        {
          prompt: "Al construir tu primer palacio, ¿qué recorrido deberías elegir?",
          options: [
            "Un lugar que visitaste una vez de vacaciones",
            "Tu propia casa o tu trayecto diario",
            "Un edificio imaginario que diseñas en el momento",
            "Las salas de tu oficina que casi nunca usas",
          ],
          explanation:
            "Cuanto mejor conozcas el recorrido, con más confianza podrás transitarlo. Empieza por un lugar por el que podrías moverte con los ojos cerrados.",
        },
      ],
      action: {
        title: "Memoriza tu lista de pendientes de hoy",
        description:
          "Toma tus tres a cinco tareas más importantes de hoy o de mañana. Coloca cada una como una imagen vívida a lo largo de un recorrido por tu casa y luego guarda la lista escrita.",
        successCriteria: "Varias horas después, puedes recordar todas las tareas en orden sin mirar.",
      },
    },
  },
};
