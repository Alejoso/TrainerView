import { NextResponse } from "next/server";
import { dot, norm } from "mathjs";
import { generateEmbeddings } from "../utils/generateEmbeddings";


const preguntasEstandar = [
  {
    "id": 1,
    "textoPregunta": "¿Cómo te aseguras de que tu mensaje sea comprendido correctamente por los demás?",
    "respuestaIdeal": "Verifico que el mensaje haya sido entendido correctamente utilizando retroalimentación, reformulaciones y adaptando el lenguaje al interlocutor.",
    "tipoRespuesta": "texto"
  },
  {
    "id": 2,
    "textoPregunta": "Describe una situación en la que tuviste que comunicar una idea difícil. ¿Cómo lo manejaste?",
    "respuestaIdeal": "Preparé el mensaje con anticipación, utilicé un enfoque empático y aseguré un entorno adecuado para facilitar una comunicación efectiva.",
    "tipoRespuesta": "audio"
  },
  {
    "id": 3,
    "textoPregunta": "¿Qué papel sueles tomar cuando trabajas en equipo?",
    "respuestaIdeal": "Asumo el rol que sea necesario para el equipo, ya sea liderar, colaborar o apoyar, con el fin de alcanzar los objetivos comunes.",
    "tipoRespuesta": "texto"
  },
  {
    "id": 4,
    "textoPregunta": "Describe una vez en la que ayudaste a resolver un conflicto dentro de un equipo.",
    "respuestaIdeal": "Facilité el diálogo entre las partes, escuchando activamente y proponiendo soluciones orientadas a restaurar la colaboración.",
    "tipoRespuesta": "audio"
  },
  {
    "id": 5,
    "textoPregunta": "¿Cómo reaccionas ante críticas constructivas?",
    "respuestaIdeal": "Recibo las críticas constructivas con apertura, las analizo objetivamente y las uso como una oportunidad de mejora.",
    "tipoRespuesta": "texto"
  },
  {
    "id": 6,
    "textoPregunta": "Describe una situación en la que tuviste que manejar tus emociones en un entorno profesional.",
    "respuestaIdeal": "Gestioné mis emociones de forma consciente para mantener una actitud profesional y enfocada, a pesar de la tensión del momento.",
    "tipoRespuesta": "audio"
  },
  {
    "id": 7,
    "textoPregunta": "¿Cómo manejas los cambios inesperados en el trabajo?",
    "respuestaIdeal": "Adapto mis planes rápidamente, reorganizo prioridades y mantengo una actitud flexible ante los cambios imprevistos.",
    "tipoRespuesta": "texto"
  },
  {
    "id": 8,
    "textoPregunta": "Cuéntame sobre una vez que tuviste que aprender algo nuevo rápidamente para cumplir con una tarea.",
    "respuestaIdeal": "Identifiqué lo esencial que debía aprender, consulté recursos adecuados y apliqué el conocimiento en el menor tiempo posible.",
    "tipoRespuesta": "audio"
  },
  {
    "id": 9,
    "textoPregunta": "¿Cómo abordas un problema cuando no tienes una solución inmediata?",
    "respuestaIdeal": "Analizo la situación, recopilo información relevante, considero diversas alternativas y colaboro con otros si es necesario.",
    "tipoRespuesta": "texto"
  },
  {
    "id": 10,
    "textoPregunta": "¿Puedes contarme una experiencia donde tuviste que tomar una decisión difícil bajo presión?",
    "respuestaIdeal": "Evalué la situación bajo presión, prioricé la información clave, consideré las consecuencias y tomé una decisión alineada con los objetivos.",
    "tipoRespuesta": "audio"
  },
  {
    "id": 11,
    "textoPregunta": "¿Cómo organizas tus prioridades cuando tienes múltiples tareas con fechas límite cercanas?",
    "respuestaIdeal": "Establezco prioridades según urgencia e impacto, planifico el tiempo de forma eficiente y utilizo herramientas de organización si es necesario.",
    "tipoRespuesta": "texto"
  },
  {
    "id": 12,
    "textoPregunta": "¿Alguna vez perdiste una fecha de entrega? ¿Qué aprendiste de esa experiencia?",
    "respuestaIdeal": "Reconocí el error, reflexioné sobre las causas y apliqué mejoras en mi organización personal para evitar que vuelva a ocurrir.",
    "tipoRespuesta": "audio"
  },
  {
    "id": 13,
    "textoPregunta": "¿Cómo demuestras empatía hacia tus compañeros de trabajo o clientes?",
    "respuestaIdeal": "Escucho activamente, reconozco las emociones de los demás y respondo de forma considerada y respetuosa.",
    "tipoRespuesta": "texto"
  },
  {
    "id": 14,
    "textoPregunta": "Describe una ocasión en la que escuchar activamente marcó la diferencia en la resolución de un problema.",
    "respuestaIdeal": "Escuchar con atención permitió comprender la raíz del problema y facilitar una solución más efectiva y adecuada.",
    "tipoRespuesta": "audio"
  },
  {
    "id": 15,
    "textoPregunta": "¿Has liderado alguna vez un proyecto o equipo? ¿Qué aprendiste de esa experiencia?",
    "respuestaIdeal": "La experiencia de liderar me permitió desarrollar habilidades para motivar, delegar, tomar decisiones y comunicar de forma clara y efectiva.",
    "tipoRespuesta": "texto"
  },
  {
    "id": 16,
    "textoPregunta": "¿Cómo motivas a los demás cuando el ánimo del equipo está bajo?",
    "respuestaIdeal": "Escucho sus preocupaciones, ofrezco apoyo emocional y enfoco al equipo en metas claras y alcanzables.",
    "tipoRespuesta": "audio"
  },
  {
    "id": 17,
    "textoPregunta": "¿Qué haces cuando identificas una oportunidad de mejora en tu entorno laboral?",
    "respuestaIdeal": "Analizo la situación, propongo ideas de mejora viables y las comparto con las personas pertinentes para su implementación.",
    "tipoRespuesta": "texto"
  },
  {
    "id": 18,
    "textoPregunta": "Cuéntame sobre una vez en la que asumiste responsabilidades más allá de tu rol.",
    "respuestaIdeal": "Asumí tareas adicionales de manera proactiva cuando identifiqué una necesidad, contribuyendo al logro de los objetivos del grupo.",
    "tipoRespuesta": "audio"
  },
  {
    "id": 19,
    "textoPregunta": "¿Has propuesto una idea nueva que fue implementada? ¿Cómo surgió esa idea?",
    "respuestaIdeal": "Detecté una oportunidad de mejora, generé una propuesta innovadora y la presenté de forma estructurada hasta que fue implementada.",
    "tipoRespuesta": "texto"
  },
  {
    "id": 20,
    "textoPregunta": "¿Cómo fomentas la creatividad en tu entorno de trabajo?",
    "respuestaIdeal": "Promuevo un entorno abierto a nuevas ideas, aliento la experimentación y valoro las contribuciones innovadoras de los demás.",
    "tipoRespuesta": "audio"
  }
]
; 


export async function POST(request: Request) {

  interface Answer {
    id: number;
    category: string;
    textoRespuesta: string;
    responseTime: number;
    isSubmitted: boolean;
  }
  
  interface Question {
    id: number;
    categoria: string;
    textoPregunta: string;
    respuestaIdeal: string;
    tipoRespuesta: string;
  }

  try {
    const { respuestas, preguntas }: { respuestas: Answer[]; preguntas: Question[] } =
      await request.json();
    const similitudesCoceno: { [key: number]: number } = {};

    if (!respuestas || !preguntas) {
      return NextResponse.json(
        { error: "Error, faltan campos necesarios" },
        { status: 400 }
      );
    }

    function cosineSimilarity(a: number[], b: number[]): number {
      return Number(dot(a, b)) / (Number(norm(a)) * Number(norm(b)));
    }

    // ---- Procesar preguntas con await ----
    for (const pregunta of preguntas) {
      const respuesta = respuestas.find((r) => r.id === pregunta.id);
      if (respuesta && pregunta.textoPregunta) {

        const embeddingRespuesta = await generateEmbeddings(respuesta.textoRespuesta);
        const embeddingPregunta = await generateEmbeddings(pregunta.respuestaIdeal);

        similitudesCoceno[pregunta.id] = cosineSimilarity(
          embeddingRespuesta,
          embeddingPregunta
        );

        console.log(similitudesCoceno)
      }
    }

    return NextResponse.json({ ok: true, similitudesCoceno });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Error interno en el servidor" },
      { status: 500 }
    );
  }
}