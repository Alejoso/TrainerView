"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
      <div className="relative min-h-screen bg-slate-900 text-white py-16 px-6 md:px-12 overflow-x-hidden">
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
    <div className="relative min-h-screen bg-slate-900 text-white py-16 px-6 md:px-12 overflow-x-hidden">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center text-4xl md:text-6xl font-bold mb-12 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]"
      >
        Detalle de la entrevista{" "}
        <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
          {entrevista.trabajo}
        </span>
      </motion.h1>
  
      {/* Emphasized Summary Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 -mt-8 mb-16"
      >
        {/* Fecha */}
        <div className="text-center mb-10">
          <p className="text-2xl md:text-3xl font-semibold text-white drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]">
            📅 Fecha de la entrevista
          </p>
          <p className="text-4xl md:text-5xl font-bold text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] mt-2">
            {new Date(entrevista.fecha).toLocaleDateString()}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto px-4">
          {/* Promedio General */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center 
                          shadow-md hover:shadow-cyan-500/20 transition-all duration-300">
            <p className="text-slate-400 text-sm uppercase tracking-wide">Promedio general</p>
            <p className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
              {entrevista.promedioGeneral}
              <span className="text-slate-400 text-lg font-medium">%</span>
            </p>
          </div>

          {/* Habilidades Blandas */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center 
                          shadow-md hover:shadow-blue-500/20 transition-all duration-300">
            <p className="text-slate-400 text-sm uppercase tracking-wide">Habilidades blandas</p>
            <p className="text-3xl font-bold text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]">
              {entrevista.habilidadesBlandas}
              <span className="text-slate-400 text-lg font-medium">%</span>
            </p>
          </div>

          {/* Habilidades Técnicas */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center 
                          shadow-md hover:shadow-cyan-500/20 transition-all duration-300">
            <p className="text-slate-400 text-sm uppercase tracking-wide">Habilidades técnicas</p>
            <p className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
              {entrevista.habilidadesTecnicas}
              <span className="text-slate-400 text-lg font-medium">%</span>
            </p>
          </div>

          {/* Trabajo bajo presión */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center 
                          shadow-md hover:shadow-blue-500/20 transition-all duration-300">
            <p className="text-slate-400 text-sm uppercase tracking-wide">Trabajo bajo presión</p>
            <p className="text-3xl font-bold text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]">
              {entrevista.trabajoBajoPresion}
              <span className="text-slate-400 text-lg font-medium">%</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8 shadow-lg shadow-blue-500/10 hover:shadow-cyan-500/20 transition-all duration-300">
  
        {/* Analysis Section */}
        {entrevista.analisis && entrevista.analisis.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4 text-white drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
              🧠 Retroalimentación de la entrevista
            </h2>
            {entrevista.analisis[0].analisis.map((a: any, index: number) => (
              <div
                key={index}
                className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 mb-4 shadow-md hover:shadow-cyan-500/20 transition-all duration-300"
              >
                <h3 className="text-cyan-400 font-semibold text-lg mb-1">{a.Categoria}</h3>
                <p className="text-slate-300 text-base leading-relaxed">{a.DetalleFeedback}</p>
              </div>
            ))}
          </div>
        )}
  
        {/* Questions Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 text-white drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
            💬 Preguntas y respuestas
          </h2>
  
          {entrevista.preguntas && entrevista.preguntas.length > 0 ? (
            entrevista.preguntas.map((pregunta: any, index: number) => {
              const respuesta = entrevista.respuestas?.[index];
              return (
                <div
                  key={index}
                  className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 mb-4 shadow-md hover:shadow-blue-500/20 transition-all duration-300"
                >
                  <p className="font-medium text-slate-200 text-lg mb-2">
                    <span className="text-cyan-400 font-semibold">
                      Pregunta {index + 1}:
                    </span>{" "}
                    {pregunta.textoPregunta}
                  </p>
                  <p className="text-slate-300 text-base leading-relaxed">
                    <span className="text-blue-400 font-semibold">Respuesta:</span>{" "}
                    {respuesta ? respuesta.textoRespuesta : "Sin respuesta"}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-slate-400 text-center text-lg">
              No se encontraron preguntas para esta entrevista.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
