"use client"; 
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

function InterviewHistory() {
  
  const [trabajos, setTrabajos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [gotJobs , setGotJobs] = useState(false); 

  const router = useRouter(); 

  async function getJobs() {
    setLoading
    try {
      const res = await fetch("/api/manageHistory/getJobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuario: 1 }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        console.error("Error:", data.error);
        return;
      }
  
      setTrabajos(data.trabajos); 

    } catch (err) {
      console.error("Error al hacer fetch:", err);
    }
    finally {
      setLoading(false);
      setGotJobs(true); 
    }

  }

  useEffect (() => {
    if(gotJobs == false)
      getJobs(); 
    
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
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/40 to-slate-800"></div>
            
            {/* Red neuronal - Conexiones */}
            <div className="absolute inset-0">
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
            <div className="absolute inset-0">
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
            <div className="absolute inset-0">
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

        {/* Conditional Content */}
          {loading ? (
            <div className="flex justify-center items-center h-[60vh]">
              <p className="text-slate-400 text-xl animate-pulse">
                Cargando trabajos...
              </p>
            </div>
          ) : trabajos.length === 0 ? (
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
            animate={{ opacity: 1, y: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center text-4xl md:text-6xl font-bold mb-12 text-white"
          >
            Historial de Entrevistas
          </motion.h1>

          {/* Grid of Interviews */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {trabajos.map((trabajo, index) => (
              <motion.div
                key={index}
                onClick={() =>
                  router.push(`/interviewHistory/${encodeURIComponent(trabajo)}`)
                }
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.97 }}
                className="cursor-pointer bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 
                          rounded-2xl p-6 shadow-lg shadow-blue-500/10 hover:shadow-cyan-500/20 
                          transition-all duration-300 text-center"
              >
                <h2 className="text-xl font-semibold text-cyan-400 mb-2">{trabajo}</h2>
                <p className="text-slate-400 text-sm">Haz clic para revisar entrevistas de este trabajo</p>
              </motion.div>
            ))}
          </motion.div>
          </div>
        )}
    </div>
  );
}

export default InterviewHistory;