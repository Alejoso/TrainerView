import { NextResponse } from "next/server";
import openai from "../utils/openAI";

export async function POST(request:Request) {
  
  try 
  {
    //Get the .wav that is going to be sent from the front
    const data = await request.formData();
    const file = data.get("file") as File;
  
    if (!file) {
      return NextResponse.json(
        { error: "Error, no se envio ningun audio" },
        { status: 400 }, 
      )
    }
  
    const transcription = await openai.audio.transcriptions.create({
      file, 
      model: "whisper-1",
      language: "es",
    });

    console.log("Texto transcrito:", transcription.text);

    //Return the text transcripted by whisper
    return NextResponse.json({ text: transcription.text });
    
  } catch (error:any)
  {
    console.error("Error transcribiendo: " , error);

    return NextResponse.json(
      {error: error.message ?? "Error interno del servidor"} , 
      {status: 500 },
    )
  }
  
};




