import { NextResponse } from "next/server"
import openai from "../utils/openAI"

export async function POST(request: Request) {
  try {
    const { userName , userJob , numberOfQuestions } = await request.json();

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

  Tu tarea es generar exactamente ${numberOfQuestions} preguntas de entrevista. 
  Las preguntas deben cubrir 3 categorías principales:
  1. Habilidades blandas (comunicación, trabajo en equipo, resolución de problemas, liderazgo, etc.)
  2. Habilidades técnicas sobre el área de trabajo correspondiente a la posición.
  3. trabajo bajo presión ( situación donde hay limite de tiempo para entregar un trabajo, deadlines, etc).
  Estas preguntas deben estar equilibradas, todas no deben ser de una sola categoria.
  El resultado debe entregarse únicamente en un JSON válido que represente una lista de preguntas, 
  sin explicaciones ni texto adicional. 

  Cada pregunta debe tener los siguientes campos:
  - id: número autoincremental empezando en 1
  - categoria: "habilidades blandas" o "habilidades técnicas" o "trabajo bajo presión"
  - textoPregunta: la redacción de la pregunta

  Ejemplo de formato esperado:
  [
    { "id": 1, "categoria": "habilidades blandas", "textoPregunta": "..." },
    { "id": 2, "categoria": "trabajo bajo presión", "textoPregunta": "..." }, 
    { "id": 3, "categoria": "habilidades técnicas", "textoPregunta": "..." }

  ]` 
      }
      ],
    })

    const text = completion.choices?.[0]?.message?.content?.trim() ?? "" //Get the response of gpt

   // Intentar parsear a JSON
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    console.error("Error parseando JSON:", err);
    return NextResponse.json({ error: "Respuesta inválida del modelo" }, { status: 500 });
  }

  // Ahora parsed es un array de objetos (si GPT respondió bien)
  return NextResponse.json(parsed);

  } catch (error: any) {

    console.error("Error en API:", error)

    return NextResponse.json(
      {error: error.message ?? "Error interno del servidor"} , 
      {status: 500 },
    )
  }
}

