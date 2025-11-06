"use client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";
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

interface Props {
    params: Promise<{ trabajo: string }>;
}

export default function TrabajoPage({ params }: Props) {
    const nombreTrabajo = use(params).trabajo
    const [loading, setloading] = useState<boolean>(true);
    const [gotInterviews, setGotInterviews] = useState<boolean>(false);
    const [mode, setMode] = useState<"list" | "charts">("list");
    interface Interview {
        _id: string;
        fecha: string;
        promedioGeneral: number;
        habilidadesBlandas: number;
        habilidadesTecnicas: number;
        trabajoBajoPresion: number;
        analisis: Record<string, any>;  // 👈 Aquí viene el objeto del análisis
        preguntas: { textoPregunta: string }[];
        respuestas: { textoRespuesta: string }[];
    }

    const [interviews, setInterviews] = useState<Interview[]>([]);

    const labels = ["Comunicación", "Trabajo bajo presión", "Habilidades técnicas"];

    const sorted = [...interviews].sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
    const last = sorted[0];

    const lastValues = last
        ? [last.habilidadesBlandas ?? 0, last.trabajoBajoPresion ?? 0, last.habilidadesTecnicas ?? 0]
        : [0, 0, 0];

    const avgValues = interviews.length
        ? [
            Math.round((interviews.reduce((s, e) => s + (e.habilidadesBlandas ?? 0), 0) / interviews.length) * 10) / 10,
            Math.round((interviews.reduce((s, e) => s + (e.trabajoBajoPresion ?? 0), 0) / interviews.length) * 10) / 10,
            Math.round((interviews.reduce((s, e) => s + (e.habilidadesTecnicas ?? 0), 0) / interviews.length) * 10) / 10,
        ]
        : [0, 0, 0];

    const data = {
        labels,
        datasets: [
            {
                label: "Última entrevista",
                data: lastValues,
                backgroundColor: (ctx: any) => {
                    const chart = ctx.chart;
                    const { ctx: c, chartArea } = chart;
                    if (!chartArea) return "rgba(59,130,246,0.7)";
                    const g = c.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                    g.addColorStop(0, "rgba(59,130,246,0.65)");
                    g.addColorStop(1, "rgba(56,189,248,0.85)");
                    return g;
                },
                borderColor: "rgba(186,230,253,0.9)",
                borderWidth: 1,
                borderRadius: 8,
                barThickness: 48,
            },
            {
                label: "Promedio",
                data: avgValues,
                backgroundColor: (ctx: any) => {
                    const index = ctx.dataIndex;
                    const colors = [
                        "rgba(250, 204, 21, 0.6)",
                        "rgba(239, 68, 68, 0.6)",
                        "rgba(34, 197, 94, 0.6)",
                    ];
                    return colors[index] || "rgba(255,255,255,0.1)";
                },
                borderColor: (ctx: any) => {
                    const index = ctx.dataIndex;
                    const borders = [
                        "rgba(250, 204, 21, 0.9)",
                        "rgba(239, 68, 68, 0.9)",
                        "rgba(34, 197, 94, 0.9)",
                    ];
                    return borders[index] || "rgba(255,255,255,0.5)";
                },
                borderWidth: 1.5,
                borderRadius: 8,
                barThickness: 36,
            },
        ],
    };

    const options: ChartOptions<"bar"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
                labels: {
                    color: "rgba(255,255,255,0.85)",
                    font: { size: 13, weight: 600 },
                    boxWidth: 14,
                    boxHeight: 14,
                    usePointStyle: true,
                    pointStyle: "rectRounded",
                    padding: 20,
                },
            },
            tooltip: {
                enabled: true,
                backgroundColor: "rgba(15,23,42,0.9)",
                borderColor: "rgba(59,130,246,0.8)",
                borderWidth: 1,
                titleFont: { weight: "bold" },
                bodyFont: { size: 13 },
                callbacks: {
                    label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}%`,
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


    if (!nombreTrabajo) return notFound();
    console.log("Estos son los param", nombreTrabajo);

    async function getInterviews() {
        try {
            const res = await fetch("/api/manageHistory/getInterviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    trabajo: nombreTrabajo,
                    usuario: 1,
                }),
            });

            const data = await res.json();
            setInterviews(data.entrevistas || []);


        } catch (error: any) {
            console.log(error);

        } finally {
            setloading(false);
            setGotInterviews(true);
        }
    }

    useEffect(() => {
        if (gotInterviews == false) getInterviews();
    })


    const neuralNodes = [
        { id: 1, x: 10, y: 20 },
        { id: 2, x: 25, y: 40 },
        { id: 3, x: 40, y: 15 },
        { id: 4, x: 60, y: 35 },
        { id: 5, x: 75, y: 25 },
        { id: 6, x: 90, y: 45 },
        { id: 7, x: 15, y: 60 },
        { id: 8, x: 35, y: 75 },
        { id: 9, x: 55, y: 55 },
        { id: 10, x: 80, y: 65 },
        { id: 11, x: 45, y: 85 },
        { id: 12, x: 70, y: 90 },
    ];

    // Conexiones entre nodos
    const neuralConnections = [
        { from: 1, to: 2 }, { from: 1, to: 3 }, { from: 2, to: 4 },
        { from: 3, to: 4 }, { from: 4, to: 5 }, { from: 4, to: 6 },
        { from: 5, to: 6 }, { from: 1, to: 7 }, { from: 7, to: 8 },
        { from: 8, to: 9 }, { from: 9, to: 10 }, { from: 9, to: 11 },
        { from: 10, to: 12 }, { from: 11, to: 12 }, { from: 3, to: 9 },
        { from: 6, to: 10 }, { from: 2, to: 7 }, { from: 5, to: 11 },
    ];


    return (
        <div className="relative min-h-screen bg-slate-900 text-white py-16 px-6 md:px-12 overflow-x-hidden">

            {/* Fondo base */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/40 to-slate-800 -z-10"></div>
            {/* Red neuronal - Conexiones */}
            <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full opacity-40">
                    {neuralConnections.map((connection, index) => {
                        const fromNode = neuralNodes.find(node => node.id === connection.from);
                        const toNode = neuralNodes.find(node => node.id === connection.to);

                        if (!fromNode || !toNode) return null;

                        return (
                            <motion.line
                                key={index}
                                x1={`${fromNode.x}%`}
                                y1={`${fromNode.y}%`}
                                x2={`${toNode.x}%`}
                                y2={`${toNode.y}%`}
                                stroke="url(#neuralGradient)"
                                strokeWidth="0.5"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{
                                    pathLength: 1,
                                    opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{
                                    pathLength: { duration: 2, delay: index * 0.1 },
                                    opacity: { duration: 3, repeat: Infinity, delay: index * 0.1 }
                                }}
                            />
                        );
                    })}

                    {/* Gradiente azul para las conexiones */}
                    <defs>
                        <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Nodos neuronales animados */}
            <div className="absolute inset-0 pointer-events-none">
                {neuralNodes.map((node) => (
                    <motion.div
                        key={node.id}
                        className="absolute w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"
                        style={{
                            left: `${node.x}%`,
                            top: `${node.y}%`,
                        }}
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.4, 0.8, 0.4],
                            boxShadow: [
                                '0 0 10px rgba(59, 130, 246, 0.3)',
                                '0 0 20px rgba(59, 130, 246, 0.6)',
                                '0 0 10px rgba(59, 130, 246, 0.3)'
                            ]
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                    />
                ))}
            </div>

            {/* Impulsos de datos viajando por las conexiones */}
            <div className="absolute inset-0 pointer-events-none">
                {neuralConnections.map((connection, index) => {
                    const fromNode = neuralNodes.find(node => node.id === connection.from);
                    const toNode = neuralNodes.find(node => node.id === connection.to);

                    if (!fromNode || !toNode) return null;

                    return (
                        <motion.div
                            key={`pulse-${index}`}
                            className="absolute w-2 h-2 bg-blue-300 rounded-full shadow-lg shadow-blue-300"
                            style={{
                                left: `${fromNode.x}%`,
                                top: `${fromNode.y}%`,
                            }}
                            animate={{
                                left: [`${fromNode.x}%`, `${toNode.x}%`],
                                top: [`${fromNode.y}%`, `${toNode.y}%`],
                                opacity: [0, 1, 0]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: Math.random() * 5,
                                ease: "linear"
                            }}
                        />
                    );
                })}
            </div>

            {/* Efectos de luz ambientales */}
            <div className="absolute top-1/4 -left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

            {loading ? (
                <div className="flex justify-center items-center h-[60vh]">
                    <p className="text-slate-400 text-xl animate-pulse">
                        Cargando entrevistas...
                    </p>
                </div>
            ) : interviews.length === 0 ? (
                <div className="flex justify-center items-center h-[60vh]">
                    <p className="text-slate-500 text-xl">
                        No tienes entrevistas realizadas aún...
                    </p>
                </div>
            ) : (
                <div>
                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center text-4xl md:text-6xl font-bold mb-12 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]"
                    >
                        Entrevistas para{" "}
                        <span className="text-cyan-400 ">
                            {nombreTrabajo}
                        </span>
                    </motion.h1>

                    {/* Toggle: Lista / Gráficas */}
                    <div className="flex justify-end mb-6">
                        <div className="inline-flex rounded-xl bg-slate-800/60 p-1 ring-1 ring-white/10">
                            <button
                                onClick={() => setMode("list")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${mode === "list" ? "bg-cyan-500/20 text-cyan-300" : "text-white/70 hover:text-white"
                                    }`}
                            >
                                Lista
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

                    {/* List of Interviews */}
                    {/* View switch */}
                    {mode === "list" ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                        >
                            {interviews.map((e, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.05, y: -4 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="relative cursor-pointer flex flex-col items-center justify-center text-center 
                   bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 
                   rounded-2xl p-6 shadow-lg shadow-blue-500/10 hover:shadow-cyan-500/20 
                   transition-all duration-300 min-h-[120px]"
                                >
                                    <div className="absolute top-3 left-4 text-cyan-400 font-bold text-2xl">
                                        {index + 1}
                                    </div>

                                    <Link
                                        href={`/interviewHistory/${nombreTrabajo}/${e._id}`}
                                        target="_blank"
                                        onClick={() => localStorage.setItem("entrevistaDetalle", JSON.stringify(e))}
                                        className="w-full"
                                    >
                                        <p className="text-slate-200 text-xl mb-1">
                                            <span className="text-cyan-400 font-semibold">Fecha:</span>{" "}
                                            {new Date(e.fecha).toLocaleDateString()}
                                        </p>
                                        <p className="text-slate-200 text-xl">
                                            <span className="text-cyan-400 font-semibold">Calificación general:</span>{" "}
                                            {e.promedioGeneral}
                                            <span className="text-white text-lg font-medium">%</span>
                                        </p>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        // ===== GRÁFICAS =====
                        <div className="rounded-2xl p-6 bg-white/5 ring-1 ring-white/10 shadow-[0_0_80px_-20px_rgba(59,130,246,0.6)]">
                            <div className="flex items-end justify-between mb-4">
                                <h2 className="text-xl font-semibold">Resumen por categorías</h2>
                                <span className="text-sm text-white/60">
                                    Última entrevista vs Promedio - Basado en {interviews.length} Entrevistas
                                </span>
                            </div>
                            <div className="relative h-72">
                                <div className="absolute inset-0 -z-10 blur-3xl opacity-35 bg-cyan-400/30 rounded-2xl" />
                                <div className="relative h-72">
                                    <div className="absolute inset-0 -z-10 blur-3xl opacity-35 bg-cyan-400/30 rounded-2xl" />
                                    <Bar data={data} options={options} />
                                </div>
                                <div className="h-full grid place-items-center text-white/70">Gráficas</div>
                            </div>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}
