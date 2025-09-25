"use client"; 
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface CategoriaData {
  Categoria: string;
  puntuaciónGeneral: number;
  DetalleFeedback: string;
}

// Array de categorías
type AnalysisData = CategoriaData[];

interface RingChartProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
}

function RingChart({ percentage, size = 120, strokeWidth = 12, showPercentage = true }: RingChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = (percent: number) => {
    if (percent >= 80) return "#4CAF50";
    if (percent >= 60) return "#FF9800";
    return "#F44336";
  };

  const getEmoji = (percent: number) => {
    if (percent >= 80) return "😊";
    if (percent >= 60) return "😐";
    return "😞";
  };

  return (
    <div className="relative inline-block">
      <motion.svg
        width={size}
        height={size}
        className="rotate-[-90deg]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(percentage)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </motion.svg>
      
      {showPercentage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className="text-2xl font-bold"
            style={{ color: getColor(percentage) }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {percentage}%
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            {getEmoji(percentage)}
          </motion.span>
        </div>
      )}
    </div>
  );
}

function InterviewAnalysis() {
  const [categorias, setCategorias] = useState<AnalysisData | null>(null);
  const [promedioBlandas, setPromedioBlandas] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const storedAnalisis = localStorage.getItem("analisis");
    if (storedAnalisis) {
      try {
        const parsed = JSON.parse(storedAnalisis);
        // Parseamos el array de categorías
        const categoriasParsed = JSON.parse(parsed.analisis);
        setCategorias(categoriasParsed.analisis || categoriasParsed);
        // Guardamos el promedio de Habilidades Blandas
        setPromedioBlandas(parsed.promedioPreguntasBlandas || 0);
      } catch (error) {
        console.error("Error parseando el análisis:", error);
      }
    }
  }, []);

  // Función para calcular el porcentaje final
  const calcularPorcentajeFinal = (categoria: CategoriaData): number => {
    if (categoria.Categoria.toLowerCase() === "habilidades blandas") {
      return Math.round((categoria.puntuaciónGeneral * 0.7 + promedioBlandas * 0.3) * 100);
    }
    return Math.round(categoria.puntuaciónGeneral * 100);
  };

  // Calcular promedio general de todas las categorías
  const calcularPromedioGeneral = (categorias: CategoriaData[]): number => {
    if (categorias.length === 0) return 0;
    const total = categorias.reduce((sum, cat) => sum + calcularPorcentajeFinal(cat), 0);
    return Math.round(total / categorias.length);
  };

  if (!categorias) {
    return (
      <div className="h-screen flex justify-center items-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        <div className="text-white text-xl">Cargando análisis...</div>
      </div>
    );
  }

  const promedioGeneral = calcularPromedioGeneral(categorias);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header con Promedio General */}
        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold text-white mb-2">Análisis de la Entrevista</h1>
          
          <div className="flex justify-center items-center gap-6 mb-4">
            <div className="bg-zinc-800 rounded-full p-4 shadow-2xl">
              <RingChart percentage={promedioGeneral} size={100} strokeWidth={12} />
            </div>
            <div className="text-left">
              <h3 className="text-2xl font-semibold text-white">Promedio General</h3>
              <p className="text-gray-300">Evaluación basada en {categorias.length} categoría{categorias.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
        </motion.div>

        {/* Grid de Categorías */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {categorias.map((categoria, index) => {
            const porcentajeFinal = calcularPorcentajeFinal(categoria);
            return (
              <motion.div key={categoria.Categoria} className="bg-zinc-800 rounded-2xl p-6 shadow-2xl" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-white mb-4">{categoria.Categoria}</h2>
                  <div className="flex justify-center mb-4">
                    <RingChart percentage={porcentajeFinal} size={140} strokeWidth={14} />
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Feedback:</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{categoria.DetalleFeedback}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Leyenda de colores */}
        <motion.div className="bg-zinc-800 rounded-2xl p-6 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }}>
          <h3 className="text-lg font-semibold text-white mb-4 text-center">Leyenda de Calificaciones</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-6 h-6 bg-red-500 rounded-full mx-auto mb-2"></div>
              <span className="text-sm text-gray-300 font-semibold">0-59%</span>
              <p className="text-xs text-gray-400 mt-1">Necesita mejorar</p>
            </div>
            <div className="text-center">
              <div className="w-6 h-6 bg-orange-500 rounded-full mx-auto mb-2"></div>
              <span className="text-sm text-gray-300 font-semibold">60-79%</span>
              <p className="text-xs text-gray-400 mt-1">Aceptable</p>
            </div>
            <div className="text-center">
              <div className="w-6 h-6 bg-green-500 rounded-full mx-auto mb-2"></div>
              <span className="text-sm text-gray-300 font-semibold">80-100%</span>
              <p className="text-xs text-gray-400 mt-1">Excelente</p>
            </div>
          </div>
        </motion.div>

        {/* Botón */}
        <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.5 }}>
          <button onClick={() => router.back()} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
            Volver a la Entrevista
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default InterviewAnalysis;
