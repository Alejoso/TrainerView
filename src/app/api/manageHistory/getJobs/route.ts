import dbConnect from "../../utils/connectDB";
import { NextResponse } from "next/server";
import Entrevista from "../../utils/Item";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { usuario } = await req.json();

    if (!usuario) {
      return NextResponse.json(
        { error: "Falta el campo 'usuario' en el body" },
        { status: 400 }
      );
    }

    // Buscar solo el campo 'trabajo' de los registros del usuario
    const trabajos = await Entrevista.distinct("trabajo", { usuario });

    return NextResponse.json({ trabajos }, { status: 200 });
  } catch (error: any) {
    console.error("Error al obtener trabajos:", error);
    return NextResponse.json(
      { error: "Error al obtener trabajos", details: error.message },
      { status: 500 }
    );
  }
}