import openai from "../utils/openAI";
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
    //respuestaIdeal: string;
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

    // // ---- Procesar respuestas del usuario con respuestas ideales generadas anteriormente ----
    // for (const pregunta of preguntas) {
    //   const respuesta = respuestas.find((r) => r.id === pregunta.id);
    //   if (respuesta && pregunta.textoPregunta) {

    //     const embeddingRespuesta = await generateEmbeddings(respuesta.textoRespuesta);
    //     const embeddingPregunta = await generateEmbeddings(pregunta.respuestaIdeal);

    //     similitudesCoceno[pregunta.id] = cosineSimilarity(
    //       embeddingRespuesta,
    //       embeddingPregunta
    //     );

    //   }
    // }


    const INSTRUCTION_PROMPT = `
    Contexto: Eres un sistema de evaluación de respuestas de entrevistas. Sigues reglas estrictas basadas en el paper de José Luís Perea Rivera y criterios cuantificables.
Reglas de Evaluación Estrictas:
1. Evaluación de Contenido (60% - Basado en categorías)

Cada categoría tiene criterios específicos y puntuaciones binarias (0 o 1 punto por criterio):

HABILIDADES BLANDAS - 4 criterios (0.25 puntos cada uno = 1 punto total):

    Claridad (0.25): Respuesta tiene ≥ 2 frases completas y es coherente

    Ejemplo concreto (0.25): Menciona una situación específica (ej: "cuando trabajaba en X...")

    Autoconciencia (0.25): Usa palabras de reflexión (ej: "aprendí", "me di cuenta", "mejoraría")

    Vocabulario profesional (0.25): No usa lenguaje informal o coloquial

HABILIDADES TÉCNICAS - 4 criterios (0.25 puntos cada uno):

    Terminología técnica (0.25): Usa ≥ 1 término técnico correcto del área

    Metodología/proceso (0.25): Describe un proceso o método (ej: "siguiendo SCRUM...")

    Experiencia aplicada (0.25): Vincula con experiencia real ("en mi proyecto anterior...")

    Resultado medible (0.25): Menciona un resultado cuantificable ("reduje tiempos en 15%")

TRABAJO BAJO PRESIÓN - 4 criterios (0.25 puntos cada uno):

    Estructura de solución (0.25): Describe pasos específicos para manejar presión

    Control emocional (0.25): Menciona técnicas de manejo de estrés

    Enfoque en resultados (0.25): Prioriza objetivos sobre emociones

    Aprendizaje (0.25): Extrae una lección de la experiencia

2. Evaluación de Tiempo (40% - Rúbrica fija)

    0-40 segundos: 1.0

    41-90 segundos: 0.7

    91-120 segundos: 0.5

    121+ segundos: 0.4

3. Fórmula Matemática Exacta
text

Puntuación = (Σ criterios cumplidos × 0.25) × 0.6 + (Puntuación tiempo × 0.4)

Reglas de Procesamiento:

    Análisis de texto: Buscar patrones específicos, no interpretar significado

    Criterios binarios: Solo "cumple" o "no cumple" basado en elementos observables

    Mínimo de palabras: Respuestas con < 5 palabras = 0 automático en contenido

    Categorización: Usar EXCLUSIVAMENTE la categoría especificada en preguntas[i].categoria

Ejemplo de Aplicación:

Para: "Trabajé usando Agile y JIRA para entregar el proyecto 2 días antes"

    ✓ Terminología técnica (JIRA, Agile)

    ✓ Metodología (Agile)

    ✓ Experiencia aplicada (proyecto real)

    ✓ Resultado medible (2 días antes)

    Puntuación contenido: 4/4 × 0.25 = 1.0 × 0.6 = 0.6
Además el resultado será por categoría. Es decir, sumaras los resultados individuales de cada pregunta y los dividirás por 
el numero de preguntas obtenidas, así, solo tendrás la calificación general de cada categoría y no de preguntas puntuales. 

Reglas de Salida:
- Devuelve SOLO un JSON válido con:
  - Categoria
  - puntuaciónGeneral (promedio de preguntas en esa categoría)
  - DetalleFeedback (máx. 3 frases, resumen claro y accionable)
- NO incluyas explicaciones fuera del JSON.

Ejemplo: 
{
  "Categoria": "Habilidades blandas",
  "puntuaciónGeneral": 0.4,
  "DetalleFeedback": "Las respuestas analizadas fueron demasiado breves, con menos de cinco palabras, lo que automáticamente invalida la evaluación de contenido según los criterios establecidos. Esto impidió evidenciar claridad, ejemplos concretos, autoconciencia o el uso de vocabulario profesional. El único factor que aportó a la puntuación fue el tiempo de respuesta (0 segundos), que según la rúbrica corresponde al máximo valor en tiempo. Sin embargo, la ausencia de desarrollo en las respuestas deja una calificación general baja. Recomendación: elaborar respuestas más extensas, con dos o más frases completas, ejemplos específicos y vocabulario profesional, lo que permitirá demostrar competencias comunicativas y autoconciencia de manera clara y evaluable."
}

A continuación te voy a mostrar un ejemplo de entrada: 
const payload = {
  respuestas: [
    { id: 1, category: "Habilidades blandas", textoRespuesta: "Simon sloan", responseTime: 0, isSubmitted: true },
    { id: 2, category: "Habilidades blandas", textoRespuesta: "Si sñor", responseTime: 0, isSubmitted: true },
    { id: 3, category: "Habilidades blandas", textoRespuesta: "Lider", responseTime: 0, isSubmitted: true }
  ],
  preguntas: [
    { id: 1, textoPregunta: "¿Cómo te aseguras de que tu mensaje sea comprendido correctamente por los demás?", categoria: "Habilidades blandas", respuestaIdeal: "...", tipoRespuesta: "texto" },
    { id: 2, textoPregunta: "Describe una situación en la que tuviste que comunicar una idea difícil. ¿Cómo lo manejaste?", categoria: "Habilidades blandas", respuestaIdeal: "...", tipoRespuesta: "texto" },
    { id: 3, textoPregunta: "¿Qué papel sueles tomar cuando trabajas en equipo?", categoria: "Habilidades blandas", respuestaIdeal: "...", tipoRespuesta: "texto" }
  ]
};
Aquí vas a ignorar los campos de respuesta Ideal en las preguntas.
    `;

    async function evaluarParrafo(contenido: string) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", 
        temperature: 0,       
        top_p: 1,             
        frequency_penalty: 0, 
        presence_penalty: 0,  
        messages: [
          {
            role: "system",
            content: INSTRUCTION_PROMPT
          },
          {
            role: "user",
            content: contenido
          }
        ]
      });
    
      return completion.choices[0].message.content;
    }
    
    const analisis = await evaluarParrafo(JSON.stringify({respuestas , preguntas})); 

    return NextResponse.json({ analisis: analisis });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Error interno en el servidor" },
      { status: 500 }
    );
  }
}