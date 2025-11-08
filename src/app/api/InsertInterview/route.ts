import dbConnect from "../utils/connectDB";
import { NextResponse } from "next/server";
import Entrevista from "../utils/Item";

export async function POST(req: Request) {
    try {
      // Connect to the database
      await dbConnect();
  
      // Get JSON body from the request
      const {
        analisis_entrada,
        preguntas_entrada,
        respuestas_entrada,
        date,
        promedio,
        hB,
        tP,
        hT,
        trabajo,
      } = await req.json();

      const analisisNoLimpio = JSON.parse(analisis_entrada.analisis)


      if(!analisisNoLimpio || !preguntas_entrada || !respuestas_entrada)
      {
        return NextResponse.json(
            { error: "Error, faltan campos"},
            { status: 400 }
          );
      }
      
      const analisis = analisisNoLimpio.analisis.map((p:any) => ({
        Categoria: p.Categoria,
        puntuaciónGeneral: p.puntuaciónGeneral,
        DetalleFeedback: p.DetalleFeedback,
      }))

      console.log(analisis)

      const preguntas = preguntas_entrada.map((p:any) => ({
        id: p.id,
        categoria: p.categoria,
        textoPregunta: p.textoPregunta,
      }));


      const respuestas = respuestas_entrada.map((p:any) => ({
        id: p.id,
        categoria: p.category,
        textoRespuesta: p.textoRespuesta,
      }));
  
      // Insert into MongoDB
      const nuevaEntrevista = await Entrevista.create({
        usuario: 1, 
        trabajo: trabajo,
        fecha: date ? new Date(date) : new Date(),
        habilidadesBlandas: hB,
        trabajoBajoPresion: tP,
        habilidadesTecnicas: hT,
        promedioGeneral: promedio,
        analisis,
        preguntas,
        respuestas,
      });
  
      return NextResponse.json(
        { message: "Entrevista insertada correctamente", data: nuevaEntrevista },
        { status: 200 }
      );
    } catch (error: any) {
      console.error("Error inserting entrevista:", error);
      return NextResponse.json(
        { error: "Error inserting entrevista", details: error.message },
        { status: 500 }
      );
    }
  }