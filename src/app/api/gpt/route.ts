import { NextResponse } from "next/server"
import openai from "../utils/openAI"

const preguntasEstandar = [
  {
    "id": 100,
    "categoria": "habilidades blandas",
    "textoPregunta": "¿Cómo te aseguras de que tu mensaje sea comprendido correctamente por los demás?",
    "respuestaIdeal": "Verifico que el mensaje haya sido entendido correctamente utilizando retroalimentación, reformulaciones y adaptando el lenguaje al interlocutor.",
    "tipoRespuesta": "audio"
  },
  {
    "id": 101,
    "categoria": "habilidades blandas",
    "textoPregunta": "Describe una situación en la que tuviste que comunicar una idea difícil. ¿Cómo lo manejaste?",
    "respuestaIdeal": "Preparé el mensaje con anticipación, utilicé un enfoque empático y aseguré un entorno adecuado para facilitar una comunicación efectiva.",
    "tipoRespuesta": "audio"
  },
  {
    "id": 102,
    "categoria": "habilidades blandas",
    "textoPregunta": "¿Qué papel sueles tomar cuando trabajas en equipo?",
    "respuestaIdeal": "Asumo el rol que sea necesario para el equipo, ya sea liderar, colaborar o apoyar, con el fin de alcanzar los objetivos comunes.",
    "tipoRespuesta": "audio"
  },
  {
    "id": 103,
    "categoria": "habilidades blandas",
    "textoPregunta": "Describe una vez en la que ayudaste a resolver un conflicto dentro de un equipo.",
    "respuestaIdeal": "Facilité el diálogo entre las partes, escuchando activamente y proponiendo soluciones orientadas a restaurar la colaboración.",
    "tipoRespuesta": "audio"
  },
  {
    "id": 104,
    "categoria": "habilidades blandas",
    "textoPregunta": "¿Cómo reaccionas ante críticas constructivas?",
    "respuestaIdeal": "Recibo las críticas constructivas con apertura, las analizo objetivamente y las uso como una oportunidad de mejora.",
    "tipoRespuesta": "audio"
  },
  {
    "id": 105,
    "categoria": "habilidades blandas",
    "textoPregunta": "Describe una situación en la que tuviste que manejar tus emociones en un entorno profesional.",
    "respuestaIdeal": "Gestioné mis emociones de forma consciente para mantener una actitud profesional y enfocada, a pesar de la tensión del momento.",
    "tipoRespuesta": "audio"
  },
  {
    "id": 106,
    "categoria": "habilidades blandas",
    "textoPregunta": "¿Cómo manejas los cambios inesperados en el trabajo?",
    "respuestaIdeal": "Adapto mis planes rápidamente, reorganizo prioridades y mantengo una actitud flexible ante los cambios imprevistos.",
    "tipoRespuesta": "audio"
  },
  {
    "id": 107,
    "categoria": "habilidades blandas",
    "textoPregunta": "Cuéntame sobre una vez que tuviste que aprender algo nuevo rápidamente para cumplir con una tarea.",
    "respuestaIdeal": "Identifiqué lo esencial que debía aprender, consulté recursos adecuados y apliqué el conocimiento en el menor tiempo posible.",
    "tipoRespuesta": "audio"
  },
  {
    "id": 108,
    "categoria": "habilidades blandas",
    "textoPregunta": "¿Cómo abordas un problema cuando no tienes una solución inmediata?",
    "respuestaIdeal": "Analizo la situación, recopilo información relevante, considero diversas alternativas y colaboro con otros si es necesario.",
    "tipoRespuesta": "audio"
  },
  {
    "id": 109,
    "categoria": "habilidades blandas",
    "textoPregunta": "¿Puedes contarme una experiencia donde tuviste que tomar una decisión difícil bajo presión?",
    "respuestaIdeal": "Evalué la situación bajo presión, prioricé la información clave, consideré las consecuencias y tomé una decisión alineada con los objetivos.",
    "tipoRespuesta": "audio"
  },
  {
    "id": 110,
    "categoria": "habilidades blandas",
    "textoPregunta": "¿Cómo organizas tus prioridades cuando tienes múltiples tareas con fechas límite cercanas?",
    "respuestaIdeal": "Establezco prioridades según urgencia e impacto, planifico el tiempo de forma eficiente y utilizo herramientas de organización si es necesario.",
    "tipoRespuesta": "audio"
  },
  {
    "id": 111,
    "categoria": "habilidades blandas",
    "textoPregunta": "¿Alguna vez perdiste una fecha de entrega? ¿Qué aprendiste de esa experiencia?",
    "respuestaIdeal": "Reconocí el error, reflexioné sobre las causas y apliqué mejoras en mi organización personal para evitar que vuelva a ocurrir.",
    "tipoRespuesta": "audio"
  },
  {
    "id": 112,
    "categoria": "habilidades blandas",
    "textoPregunta": "¿Cómo demuestras empatía hacia tus compañeros de trabajo o clientes?",
    "respuestaIdeal": "Escucho activamente, reconozco las emociones de los demás y respondo de forma considerada y respetuosa.",
    "tipoRespuesta": "audio"
  },
  {
    "id": 113,
    "categoria": "habilidades blandas",
    "textoPregunta": "Describe una ocasión en la que escuchar activamente marcó la diferencia en la resolución de un problema.",
    "respuestaIdeal": "Escuchar con atención permitió comprender la raíz del problema y facilitar una solución más efectiva y adecuada.",
    "tipoRespuesta": "audio"
  },
  {
    "id": 114,
    "categoria": "habilidades blandas",
    "textoPregunta": "¿Has liderado alguna vez un proyecto o equipo? ¿Qué aprendiste de esa experiencia?",
    "respuestaIdeal": "La experiencia de liderar me permitió desarrollar habilidades para motivar, delegar, tomar decisiones y comunicar de forma clara y efectiva.",
    "tipoRespuesta": "audio"
  },
  {
    "id": 115,
    "categoria": "habilidades blandas",
    "textoPregunta": "¿Cómo motivas a los demás cuando el ánimo del equipo está bajo?",
    "respuestaIdeal": "Escucho sus preocupaciones, ofrezco apoyo emocional y enfoco al equipo en metas claras y alcanzables.",
    "tipoRespuesta": "audio"
  },
  {
    "id": 116,
    "categria": "habilidades blandas",
    "textoPregunta": "¿Qué haces cuando identificas una oportunidad de mejora en tu entorno laboral?",
    "respuestaIdeal": "Analizo la situación, propongo ideas de mejora viables y las comparto con las personas pertinentes para su implementación.",
    "tipoRespuesta": "audio"
  },
  {
    "id": 117,
    "categoria": "habilidades blandas",
    "textoPregunta": "Cuéntame sobre una vez en la que asumiste responsabilidades más allá de tu rol.",
    "respuestaIdeal": "Asumí tareas adicionales de manera proactiva cuando identifiqué una necesidad, contribuyendo al logro de los objetivos del grupo.",
    "tipoRespuesta": "audio"
  },
  {
    "id": 118,
    "categoria": "habilidades blandas",
    "textoPregunta": "¿Has propuesto una idea nueva que fue implementada? ¿Cómo surgió esa idea?",
    "respuestaIdeal": "Detecté una oportunidad de mejora, generé una propuesta innovadora y la presenté de forma estructurada hasta que fue implementada.",
    "tipoRespuesta": "audio"
  },
  {
    "id": 119,
    "categoria": "habilidades blandas",
    "textoPregunta": "¿Cómo fomentas la creatividad en tu entorno de trabajo?",
    "respuestaIdeal": "Promuevo un entorno abierto a nuevas ideas, aliento la experimentación y valoro las contribuciones innovadoras de los demás.",
    "tipoRespuesta": "audio"
  }
];

export async function POST(request: Request) {
  try {
    const { userName , userJob , numberOfQuestions, HabilidadesUsuario} = await request.json();
    const habilidadesTecnicas = HabilidadesUsuario?.habilidadesTecnicas || "";
    const habilidadesPresion = HabilidadesUsuario?.habilidadesPresion || "";
    
    console.log(" INICIANDO GENERACIÓN DE PREGUNTAS");
    console.log(" Datos recibidos:", {
      userName,
      userJob, 
      numberOfQuestions,
      habilidadesTecnicas,
      habilidadesPresion
    });

    let gptQuestions; 
    let randomQuestions; 

    if (numberOfQuestions % 3 === 0) {
      // divisible exacto entre 3
      gptQuestions = 2 * (numberOfQuestions / 3); // 2/3
      randomQuestions = numberOfQuestions / 3;    // 1/3
    
      console.log({ gptQuestions, randomQuestions });

    } else {
      // no divisible exacto → redondeamos
      gptQuestions = Math.floor((2 * numberOfQuestions) / 3);
      randomQuestions = numberOfQuestions - gptQuestions;
    
      console.log({ gptQuestions, randomQuestions });
    }

    if(!userName || userName.trim() === "" || !userJob || userJob.trim() === "" || !numberOfQuestions || numberOfQuestions.trim() === "" )
    {
      return NextResponse.json(
        { error: "Error, faltan campos necesarios" },
        { status: 400 }, 
      )
    }

    //This is the promp configuration
    const completion = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        { role: "user", content: `Eres un entrevistador profesional. 
  Vas a entrevistar a una persona llamada "${userName}" para la posición de "${userJob}". 

  Tu tarea es generar exactamente ${gptQuestions} preguntas de entrevista. 
  Las preguntas deben cubrir 2 categorías principales:
  1. Habilidades técnicas sobre el área de trabajo correspondiente a la posición.
  2. trabajo bajo presión ( situación donde hay limite de tiempo para entregar un trabajo, deadlines, etc).
  Estas preguntas deben estar equilibradas, todas no deben ser de una sola categoria.
  El resultado debe entregarse únicamente en un JSON válido que represente una lista de preguntas, 
  sin explicaciones ni texto adicional. Por cierto, tendrás presentes las siguientes caracteristicas del usuario y con base en ellas formularás preguntas que ayuden a suplir sus dificultades o ampliar sus fortalezas en las categorias: 
  1. habilidades técnicas: ${habilidadesTecnicas}
  2. habildades bajo presión: ${habilidadesPresion}

  Si no recibes nada, ignora esta ultima indicación. 

  Cada pregunta debe tener los siguientes campos:
  - id: número autoincremental empezando en 1
  - categoria: "habilidades técnicas" o "trabajo bajo presión"
  - textoPregunta: la redacción de la pregunta
  - respuestaIdeal: Un campo de una cadena de texto vacia
  - tipoRespuesta: audio o texto

  En trabajo bajo presión solo envía tipos de respuesta audio. Mientras que, en habilidades tecnicas puedes colocar de tipo texto un 33% de las veces.

  Ejemplo de formato esperado:
  [
    { "id": 1, "categoria": "trabajo bajo presión", "textoPregunta": "..." , "respuestaIdeal": "" , "tipoRespuesta": "audio"
    { "id": 2, "categoria": "habilidades técnicas", "textoPregunta": "..." , "respuestaIdeal": "" , "tipoRespuesta": "texto" }

  ]` 
      }
      ],
    })

    const text = completion.choices?.[0]?.message?.content?.trim() ?? "" //Get the response of gpt
    
    // Número de preguntas random que quieres
    function getRandomPreguntas(cantidad: number) {
      const idsDisponibles = preguntasEstandar.map(p => p.id); // [1..20]

      // Mezclamos el array (Fisher-Yates shuffle)
      for (let i = idsDisponibles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [idsDisponibles[i], idsDisponibles[j]] = [idsDisponibles[j], idsDisponibles[i]];
      }

      // Tomamos los primeros 'cantidad' elementos sin repetir
      const idsElegidos = idsDisponibles.slice(0, cantidad);

      // Devolvemos las preguntas completas
      return preguntasEstandar.filter(p => idsElegidos.includes(p.id));
    }

    const preguntasRandom = getRandomPreguntas(randomQuestions);


    let parsed;
    try {
      parsed = JSON.parse(text); // esto viene de GPT
    } catch (err) {
      console.error("Error parseando JSON:", err);
      return NextResponse.json({ error: "Respuesta inválida del modelo" }, { status: 500 });
    }

    // Concatenar: GPT + Random
    const preguntasFinales = parsed.concat(preguntasRandom);

    // Armar response final
    return NextResponse.json({
      preguntas: preguntasFinales
    });

  } catch (error: any) {

    console.error("Error en API:", error)

    return NextResponse.json(
      {error: error.message ?? "Error interno del servidor"} , 
      {status: 500 },
    )
  }
}

