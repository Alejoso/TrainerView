"use client";
import { useEffect, useState } from "react";

export default function EntrevistaDetallePage() {
    interface Interview {
        _id: string;
        trabajo: string; 
        fecha: string;
        promedioGeneral: number;
        habilidadesBlandas: number;
        habilidadesTecnicas: number;
        trabajoBajoPresion: number;
        analisis: Record<string, any>;   // 👈 Aquí viene el objeto del análisis
        preguntas: { textoPregunta: string }[];
        respuestas: { textoRespuesta: string }[];
      }

  const [entrevista, setEntrevista] = useState<Interview>();

  useEffect(() => {
    const stored = localStorage.getItem("entrevistaDetalle");
    if (stored) setEntrevista(JSON.parse(stored));
  }, []);

  if (!entrevista) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-600">
          No se encontraron datos de la entrevista 😕
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Regresa al historial y vuelve a abrir la entrevista.
        </p>
      </div>
    );
  }

  console.log(entrevista.analisis[0].analisis)

  return (
    
    <div className="max-w-2xl mx-auto mt-10 border rounded-lg p-6 shadow">
      <h1 className="text-2xl font-bold mb-4">Detalle de Entrevista</h1>
      <p><b>Trabajo:</b> {entrevista.trabajo}</p>
      <p><b>Fecha:</b> {new Date(entrevista.fecha).toLocaleDateString()}</p>
      <p><b>Promedio general:</b> {entrevista.promedioGeneral}</p>
      <p><b>Habilidades blandas:</b> {entrevista.habilidadesBlandas}</p>
      <p><b>Habilidades técnicas:</b> {entrevista.habilidadesTecnicas}</p>
      <p><b>Trabajo bajo presión:</b> {entrevista.trabajoBajoPresion}</p>



        <div className="mt-8">
        {entrevista.analisis && entrevista.analisis.length > 0 && (
        <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">🧠 Análisis de la entrevista</h2>

            {entrevista.analisis[0].analisis.map((a: any, index: number) => (
            <div
                key={index}
                className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm bg-gray-50"
            >
                <h3 className="font-semibold text-lg text-gray-800">{a.Categoria}</h3>
                <p className="text-gray-700">{a.DetalleFeedback}</p>
            </div>
            ))}
        </div>
        )}
        </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Preguntas y respuestas</h2>
        
        {entrevista.preguntas && entrevista.preguntas.length > 0 ? (
            entrevista.preguntas.map((pregunta: any, index: number) => {
            const respuesta = entrevista.respuestas?.[index];
            return (
                <div
                key={index}
                className="border rounded-lg p-4 mb-3 bg-gray-50 shadow-sm"
                >
                <p className="font-medium text-gray-800">
                    <b>Pregunta {index + 1}:</b> {pregunta.textoPregunta}
                </p>
                <p className="mt-2 text-gray-700">
                    <b>Respuesta:</b> {respuesta ? respuesta.textoRespuesta : "Sin respuesta"}
                </p>
                </div>
            );
            })
        ) : (
            <p className="text-gray-600">No se encontraron preguntas para esta entrevista.</p>
        )}
        </div>
    </div>
  );
}
