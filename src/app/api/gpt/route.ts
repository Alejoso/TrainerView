import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"
import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

if (!openai.apiKey) {
  throw new Error("OPENAI_API_KEY is not defined")
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    const completion = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        { role: "user", content: prompt?.trim() ? prompt.trim() : "Dame un chiste corto de programador" }
      ],
    })

    console.log(completion.choices);

    const text = completion.choices?.[0]?.message?.content?.trim() ?? ""

    return NextResponse.json({ message: text })
  } catch (error: any) {
    console.error("Error en API:", error)
    return NextResponse.json(
      { error: error.message ?? "Error interno del servidor" },
      { status: 500 }
    )
  }
}

