"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
const Bar = dynamic(() => import("react-chartjs-2").then(m => m.Bar), { ssr: false });


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
  const [mode, setMode] = useState<"details" | "charts">("details");

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

  const labels = ["Comunicación", "Trabajo bajo presión", "Habilidades técnicas"];
  const singleValues = entrevista
    ? [
      entrevista.habilidadesBlandas ?? 0,
      entrevista.trabajoBajoPresion ?? 0,
      entrevista.habilidadesTecnicas ?? 0,
    ]
    : [0, 0, 0];

  const data = {
    labels,
    datasets: [
      {
        label: "Esta entrevista",
        data: singleValues,
        backgroundColor: (ctx: any) => {
          const i = ctx.dataIndex;
          const fill = [
            "rgba(250, 204, 21, 0.70)",
            "rgba(239, 68, 68, 0.70)",
            "rgba(34, 197, 94, 0.70)",
          ];
          return fill[i] ?? "rgba(255,255,255,0.15)";
        },
        borderColor: (ctx: any) => {
          const i = ctx.dataIndex;
          const stroke = [
            "rgba(250, 204, 21, 0.95)",
            "rgba(239, 68, 68, 0.95)",
            "rgba(34, 197, 94, 0.95)",
          ];
          return stroke[i] ?? "rgba(255,255,255,0.4)";
        },
        borderWidth: 1.5,
        borderRadius: 8,
        barThickness: 56,
      },
    ],
  };


  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(15,23,42,0.9)",
        borderColor: "rgba(59,130,246,0.8)",
        borderWidth: 1,
        titleFont: { weight: "bold" },
        bodyFont: { size: 13 },
        callbacks: {
          title: (items) => (items?.[0]?.label as string) ?? "",
          label: (ctx) => `${ctx.formattedValue}%`,
        },
      },
    },
    animation: { duration: 400 },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "rgba(255,255,255,0.85)", font: { weight: 600 } },
        border: { display: false },
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: "rgba(255,255,255,0.08)" },
        border: { display: false },
        ticks: {
          color: "rgba(255,255,255,0.6)",
          stepSize: 20,
          callback: (v: number | string) => `${v}%`,
        },
      },
    },
  };

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

      {/* Toggle: Detalles / Gráficas */}
      <div className="flex justify-end mb-6">
        <div className="inline-flex rounded-xl bg-slate-800/60 p-1 ring-1 ring-white/10">
          <button
            onClick={() => setMode("details")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${mode === "details" ? "bg-cyan-500/20 text-cyan-300" : "text-white/70 hover:text-white"
              }`}
          >
            Detalles
          </button>
          <button
            onClick={() => setMode("charts")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${mode === "charts" ? "bg-cyan-500/20 text-cyan-300" : "text-white/70 hover:text-white"
              }`}
          >
            Gráficas
          </button>
        </div>
      </div>

      {/* Fecha */}
      <div className="text-center mb-10">
        <p className="text-2xl md:text-3xl font-semibold text-white drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]">
          📅 Fecha de la entrevista
        </p>
        <p className="text-4xl md:text-5xl font-bold text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] mt-2">
          {new Date(entrevista.fecha).toLocaleDateString()}
        </p>
      </div>

      {/* Switch */}
      {mode === "details" ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto px-4 mb-12">
          {/* Promedio General */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center shadow-md hover:shadow-cyan-500/20 transition-all duration-300">
            <p className="text-slate-400 text-sm uppercase tracking-wide">Promedio general</p>
            <p className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
              {entrevista.promedioGeneral}<span className="text-slate-400 text-lg font-medium">%</span>
            </p>
          </div>

          {/* Habilidades Blandas */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center shadow-md hover:shadow-blue-500/20 transition-all duration-300">
            <p className="text-slate-400 text-sm uppercase tracking-wide">Habilidades blandas</p>
            <p className="text-3xl font-bold text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]">
              {entrevista.habilidadesBlandas}<span className="text-slate-400 text-lg font-medium">%</span>
            </p>
          </div>

          {/* Habilidades Técnicas */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center shadow-md hover:shadow-cyan-500/20 transition-all duration-300">
            <p className="text-slate-400 text-sm uppercase tracking-wide">Habilidades técnicas</p>
            <p className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
              {entrevista.habilidadesTecnicas}<span className="text-slate-400 text-lg font-medium">%</span>
            </p>
          </div>

          {/* Trabajo bajo presión */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center shadow-md hover:shadow-blue-500/20 transition-all duration-300">
            <p className="text-slate-400 text-sm uppercase tracking-wide">Trabajo bajo presión</p>
            <p className="text-3xl font-bold text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]">
              {entrevista.trabajoBajoPresion}<span className="text-slate-400 text-lg font-medium">%</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl p-6 bg-white/5 ring-1 ring-white/10 shadow-[0_0_80px_-20px_rgba(59,130,246,0.6)] mb-12">
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-xl font-semibold">Resumen de esta entrevista</h2>
            <span className="text-sm text-white/60">{new Date(entrevista.fecha).toLocaleDateString()}</span>
          </div>

          {/* Leyenda custom */}
          <div className="flex flex-wrap gap-4 mb-2 text-sm text-white/80">
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: "rgba(250, 204, 21, 0.9)" }} />
              Comunicación
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: "rgba(239, 68, 68, 0.9)" }} />
              Trabajo bajo presión
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: "rgba(34, 197, 94, 0.9)" }} />
              Habilidades técnicas
            </span>
          </div>

          <div className="relative h-72">
            <div className="absolute inset-0 -z-10 blur-3xl opacity-35 bg-cyan-400/30 rounded-2xl" />
            <Bar data={data} options={options} />
          </div>
        </div>
      )}


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
