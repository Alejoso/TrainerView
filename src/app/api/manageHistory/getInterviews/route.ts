import dbConnect from "../../utils/connectDB";
import { NextResponse } from "next/server";
import Entrevista from "../../utils/Item";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { trabajoParam, usuario } = await req.json();

    if (!trabajoParam || !usuario) {
      return NextResponse.json(
        { error: "Faltan parámetros (trabajo o usuario)" },
        { status: 400 }
      );
    }

    const trabajo = decodeURIComponent(trabajoParam); 

    // Buscar todas las entrevistas que coincidan con el usuario y el trabajo
    const entrevistas = await Entrevista.find({ trabajo, usuario });

    if (entrevistas.length === 0) {
      console.log("No encontre :(")
      return NextResponse.json(
        { message: "No hay entrevistas registradas para ese trabajo" },
        { status: 404 }
      );
    }

    return NextResponse.json({ entrevistas }, { status: 200 });
  } catch (error: any) {
    console.error("Error obteniendo entrevistas:", error);
    return NextResponse.json(
      { error: "Error obteniendo entrevistas", details: error.message },
      { status: 500 }
    );
  }
}

