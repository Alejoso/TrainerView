"use client"; 
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface CategoriaData {
  Categoria: string;
  puntuaciónGeneral: number;
  DetalleFeedback: string;
}

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
    if (percent >= 80) return "#22c55e";
    if (percent >= 60) return "#eab308";
    return "#ef4444";
  };

  const getEmoji = (percent: number) => {
    if (percent >= 80) return "🚀";
    if (percent >= 60) return "📊";
    return "🎯";
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
          stroke="#374151"
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
            className="text-lg"
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

  const [dataInserted, setdataInserted] = useState<boolean>(false);


  const calcularPorcentajeFinal = (categoria: CategoriaData): number => {
    if (categoria.Categoria.toLowerCase() === "habilidades blandas") {
      return Math.round((categoria.puntuaciónGeneral * 0.7 + promedioBlandas * 0.3) * 100);
    }
    return Math.round(categoria.puntuaciónGeneral * 100);
  };

  const calcularPromedioGeneral = (categorias: CategoriaData[]): number => {
    if (categorias.length === 0) return 0;
    const total = categorias.reduce((sum, cat) => sum + calcularPorcentajeFinal(cat), 0);
    return Math.round(total / categorias.length);
  };

  useEffect(() => {


    const storedAnalisis = localStorage.getItem("analisis");

    if (storedAnalisis) {
      try {
        const parsed = JSON.parse(storedAnalisis);
        const categoriasParsed = JSON.parse(parsed.analisis);
        setCategorias(categoriasParsed.analisis || categoriasParsed);
        setPromedioBlandas(parsed.promedioPreguntasBlandas || 0);
      } catch (error) {
        console.error("Error parseando el análisis:", error);
      }
    }
  }, []);

  if (!categorias) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-900">
        <div className="text-white text-xl backdrop-blur-sm bg-white/10 rounded-2xl p-8">Cargando análisis...</div>
      </div>
    );
  }

  const promedioGeneral = calcularPromedioGeneral(categorias);


  async function insertDataBase() {
    try {
      const analisis_entrada = JSON.parse(localStorage.getItem("analisis") || "{}"); 
      const preguntas_entrada = JSON.parse(localStorage.getItem("preguntas") || "{}" )
      const respuestas_entrada = JSON.parse(localStorage.getItem("respuestas") || "{}" )
      const trabajo = localStorage.getItem("userJob"); 

      if (analisis_entrada === "{}" || preguntas_entrada === "{}" || respuestas_entrada === "{}")
      {
        console.log("Error, campos vacios");
        return; 
      }

      const promedio = promedioGeneral; 

      const habilidadesBlandas = categorias!.find(
        (c) => c.Categoria.toLowerCase() === "habilidades blandas"
      );

      const trabajoBajoPresion = categorias!.find(
        (c) => c.Categoria.toLowerCase() === "trabajo bajo presión"
      );

      const habilidadesTecnicas = categorias!.find(
        (c) => c.Categoria.toLowerCase() === "habilidades técnicas"
      );

      const hB = calcularPorcentajeFinal(habilidadesBlandas!);
      const tP = calcularPorcentajeFinal(trabajoBajoPresion!); 
      const hT = calcularPorcentajeFinal(habilidadesTecnicas!);

      const date = new Date(); 

      await fetch("/api/InsertInterview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analisis_entrada, preguntas_entrada, respuestas_entrada , date,  promedio, hB, tP, hT , trabajo}),
      });


    }
    catch(error:any)
    {
      console.log(error); 
    }
  }

  // if (typeof window !== "undefined" && !sessionStorage.getItem("inserted")) {
  //   insertDataBase();
  //   sessionStorage.setItem("inserted", "true");
  //   console.log("Se incerto yuppi");
  // }

  if (typeof window !== "undefined" && dataInserted === false) {
    insertDataBase();
    console.log("Se incerto yuppi");
    setdataInserted(true); 
  }


  // Nodos para el fondo de análisis (patrón diferente)
  const analysisNodes = [
    { id: 1, x: 5, y: 10 }, { id: 2, x: 15, y: 25 }, { id: 3, x: 25, y: 15 },
    { id: 4, x: 35, y: 30 }, { id: 5, x: 45, y: 20 }, { id: 6, x: 55, y: 35 },
    { id: 7, x: 65, y: 25 }, { id: 8, x: 75, y: 40 }, { id: 9, x: 85, y: 30 },
    { id: 10, x: 95, y: 45 }, { id: 11, x: 10, y: 60 }, { id: 12, x: 20, y: 75 },
    { id: 13, x: 30, y: 65 }, { id: 14, x: 40, y: 80 }, { id: 15, x: 50, y: 70 },
    { id: 16, x: 60, y: 85 }, { id: 17, x: 70, y: 75 }, { id: 18, x: 80, y: 90 },
    { id: 19, x: 90, y: 80 }, { id: 20, x: 5, y: 95 }
  ];

  const analysisConnections = [
    { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 },
    { from: 4, to: 5 }, { from: 5, to: 6 }, { from: 6, to: 7 },
    { from: 7, to: 8 }, { from: 8, to: 9 }, { from: 9, to: 10 },
    { from: 11, to: 12 }, { from: 12, to: 13 }, { from: 13, to: 14 },
    { from: 14, to: 15 }, { from: 15, to: 16 }, { from: 16, to: 17 },
    { from: 17, to: 18 }, { from: 18, to: 19 }, { from: 19, to: 20 },
    { from: 1, to: 11 }, { from: 5, to: 15 }, { from: 10, to: 20 }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-900">
      {/* Fondo neural para análisis */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-800"></div>
      
      {/* Red neuronal específica para análisis */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-25">
          {analysisConnections.map((connection, index) => {
            const fromNode = analysisNodes.find(node => node.id === connection.from);
            const toNode = analysisNodes.find(node => node.id === connection.to);
            
            if (!fromNode || !toNode) return null;
            
            return (
              <motion.line
                key={index}
                x1={`${fromNode.x}%`}
                y1={`${fromNode.y}%`}
                x2={`${toNode.x}%`}
                y2={`${toNode.y}%`}
                stroke="url(#analysisGradient)"
                strokeWidth="0.2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: [0.1, 0.3, 0.1] 
                }}
                transition={{
                  pathLength: { duration: 4, delay: index * 0.05 },
                  opacity: { duration: 5, repeat: Infinity, delay: index * 0.05 }
                }}
              />
            );
          })}
          
          <defs>
            <linearGradient id="analysisGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Nodos de análisis */}
      <div className="absolute inset-0">
        {analysisNodes.map((node) => (
          <motion.div
            key={node.id}
            className="absolute w-1.5 h-1.5 bg-emerald-400 rounded-full"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
            }}
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 4
            }}
          />
        ))}
      </div>

      {/* Efectos de luz para análisis */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-6xl relative z-10"
      >
        {/* Header del análisis */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/25">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          
          <div className="flex justify-center items-center gap-8 mb-6">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
              <RingChart percentage={promedioGeneral} size={140} strokeWidth={16} />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-light text-white mb-2">Análisis de Entrevista</h1>
              <h3 className="text-2xl font-semibold text-emerald-400 mb-2">Resultados Detallados</h3>
              <p className="text-slate-300">
                Evaluación basada en {categorias.length} categoría{categorias.length !== 1 ? "s" : ""} de competencia
              </p>
            </div>
          </div>
          
          <div className="w-32 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 mx-auto rounded-full"></div>
        </motion.div>

        {/* Grid de Categorías */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {categorias.map((categoria, index) => {
            const porcentajeFinal = calcularPorcentajeFinal(categoria);
            return (
              <motion.div 
                key={categoria.Categoria}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold text-white mb-3">{categoria.Categoria}</h2>
                  <div className="flex justify-center">
                    <RingChart percentage={porcentajeFinal} size={100} strokeWidth={12} />
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Evaluación
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed bg-white/5 rounded-xl p-4 border border-white/10">
                    {categoria.DetalleFeedback}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Panel de Métricas */}
        <motion.div 
          className="bg-white/10 backdrop-blur-md rounded-3xl p-6 mb-8 border border-white/20 shadow-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-white mb-6 text-center flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Métricas de Rendimiento
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-2xl font-bold text-emerald-400 mb-1">{categorias.length}</div>
              <div className="text-sm text-slate-300">Categorías Evaluadas</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-2xl font-bold text-blue-400 mb-1">{promedioGeneral}%</div>
              <div className="text-sm text-slate-300">Puntuación General</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {categorias.filter(cat => calcularPorcentajeFinal(cat) >= 80).length}
              </div>
              <div className="text-sm text-slate-300">Áreas Destacadas</div>
            </div>
          </div>
        </motion.div>

        {/* Leyenda de Calificaciones */}
        <motion.div 
          className="bg-white/10 backdrop-blur-md rounded-3xl p-6 mb-8 border border-white/20 shadow-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-white mb-6 text-center">Escala de Evaluación</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
              <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white text-sm font-bold">0-59</span>
              </div>
              <span className="text-sm text-red-300 font-semibold block mb-1">En Desarrollo</span>
              <p className="text-xs text-red-200">Oportunidad de mejora</p>
            </div>
            <div className="text-center p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
              <div className="w-8 h-8 bg-yellow-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white text-sm font-bold">60-79</span>
              </div>
              <span className="text-sm text-yellow-300 font-semibold block mb-1">Competente</span>
              <p className="text-xs text-yellow-200">Nivel satisfactorio</p>
            </div>
            <div className="text-center p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
              <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white text-sm font-bold">80-100</span>
              </div>
              <span className="text-sm text-green-300 font-semibold block mb-1">Destacado</span>
              <p className="text-xs text-green-200">Excelente desempeño</p>
            </div>
          </div>
        </motion.div>

        {/* Botón de acción */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <motion.button 
            onClick={() => router.back()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg transition-all duration-300 backdrop-blur-sm hover:shadow-emerald-500/25 flex items-center gap-3 mx-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a la Entrevista
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="text-center mt-8 text-slate-400 text-sm"
        >
          <p>Universidad Eafit @ Simón Sloan</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default InterviewAnalysis;