import openai from "../utils/openAI";
import dbConnect from "../utils/connectDB";
import Item from "../utils/Item";  
import { NextResponse } from "next/server";
import { dot, norm } from "mathjs";
import { generateEmbeddings } from "../utils/generateEmbeddings";

async function insertDara(req:any) {
  await dbConnect();

    try { 
      const item = await Item.create(req.body);
    } catch (error) {
      return NextResponse.json(
        { error: "Error en en la base de datos" },
        { status: 400 }
      );
    }
}

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

    const habilidadesBlandas = preguntas.filter(
      pregunta => pregunta.categoria === "habilidades blandas"
    );
    
    let promedioHailidadesBlandas = 0; 
    let contador = 0;

    // ---- Procesar respuestas del usuario con respuestas ideales generadas anteriormente ----
    for (const pregunta of habilidadesBlandas) {
      const respuesta = respuestas.find((r) => r.id === pregunta.id);
      if (respuesta && pregunta.textoPregunta) {

        const embeddingRespuesta = await generateEmbeddings(respuesta.textoRespuesta);
        const embeddingPregunta = await generateEmbeddings(pregunta.respuestaIdeal);

        promedioHailidadesBlandas += cosineSimilarity(embeddingRespuesta, embeddingPregunta); 
        contador += 1;
      }
    }

    promedioHailidadesBlandas = promedioHailidadesBlandas / contador; 


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
analisis: [
{
  "Categoria": "Habilidades blandas",
  "puntuaciónGeneral": 0.4,
  "DetalleFeedback": "Las respuestas analizadas fueron demasiado breves, con menos de cinco palabras, lo que automáticamente invalida la evaluación de contenido según los criterios establecidos. Esto impidió evidenciar claridad, ejemplos concretos, autoconciencia o el uso de vocabulario profesional. El único factor que aportó a la puntuación fue el tiempo de respuesta (0 segundos), que según la rúbrica corresponde al máximo valor en tiempo. Sin embargo, la ausencia de desarrollo en las respuestas deja una calificación general baja. Recomendación: elaborar respuestas más extensas, con dos o más frases completas, ejemplos específicos y vocabulario profesional, lo que permitirá demostrar competencias comunicativas y autoconciencia de manera clara y evaluable."
},
{
  "Categoria": "Habilidades técnicas",
  "puntuaciónGeneral": 0.7,
  "DetalleFeedback": "Las respuestas analizadas fueron demasiado breves..."
},
{
  "Categoria": "Trabajo bajo presión",
  "puntuaciónGeneral": 0.3,
  "DetalleFeedback": "Las respuestas analizadas fueron demasiado breves..."
}
]

A continuación te voy a mostrar un ejemplo de entrada: 
const payload = {
  respuestas: [
    { id: 1, category: "Habilidades blandas", textoRespuesta: "Simon sloan", responseTime: 0, isSubmitted: true },
    { id: 2, category: "Habilidades blandas", textoRespuesta: "Si señor", responseTime: 0, isSubmitted: true },
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

    
    return NextResponse.json({ analisis: analisis , promedioPreguntasBlandas: promedioHailidadesBlandas });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Error interno en el servidor" },
      { status: 500 }
    );
  }
  
}