"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";

function HomePage() {
  const [formData, setFormData] = useState({
    userName: '',
    userJob: '',
  }); 

  const router = useRouter(); 

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev, 
      [name]: value,
    })); 
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 

    if(formData.userJob.trim() === "" || formData.userName.trim() === "") {
      toast.error("Debes llenar todos los campos");
    } else {
      localStorage.setItem("userName", formData.userName.trim());
      localStorage.setItem("userJob", formData.userJob.trim());
      router.push("/habilities");
    }
  }; 

  // Nodos para la red neuronal
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-900">
      {/* Fondo base */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/40 to-slate-800"></div>
      
      {/* Red neuronal - Conexiones con tonos azules */}
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

      {/* Nodos neuronales animados - Azules */}
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

      {/* Impulsos de datos viajando por las conexiones - Azules */}
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

      {/* Efectos de luz ambientales - Azules */}
      <div className="absolute top-1/4 -left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'bg-white/10 backdrop-blur-md text-white border border-white/20',
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header minimalista */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c.5.5.759 1.187.704 1.877M5 14.5L3.697 16.78a2.25 2.25 0 01-.704 1.877" />
            </svg>
          </div>
          <h1 className="text-5xl font-light text-white mb-4">
            Trainer View
          </h1>
          <p className="text-slate-300 text-lg">
            Tu agentic de confianza 
          </p>
        </motion.div>

        {/* Card principal con efecto glass */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8"
        >
          <motion.form
            onSubmit={onSubmit}
            className="flex flex-col gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            {/* Campo Nombre */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex flex-col"
            >
              <label htmlFor="userName" className="text-sm font-medium text-slate-300 mb-3">
                Nombre
              </label>
              <input
                id="userName"
                type="text"
                placeholder="Tu nombre completo"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="px-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-slate-400 text-white backdrop-blur-sm"
              />
            </motion.div>

            {/* Campo Trabajo Soñado */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex flex-col"
            >
              <label htmlFor="userJob" className="text-sm font-medium text-slate-300 mb-3">
                Aspiración profesional
              </label> 
              <input
                id="userJob"
                type="text"
                placeholder="Ej: Ingeniero de machine learning"
                name="userJob"
                value={formData.userJob}
                onChange={handleChange}
                className="px-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-slate-400 text-white backdrop-blur-sm"
              />
            </motion.div>

            {/* Indicador de progreso */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-3 text-slate-400 text-sm"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-blue-400 rounded-full"
                />
                <span>Inicializando red neuronal...</span>
              </div>
            </motion.div>

            {/* Botón de envío */}
            <motion.button
              type="submit"
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 },
              }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0px 10px 30px rgba(59, 130, 246, 0.4)" 
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="mt-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-4 rounded-2xl shadow-lg transition-all duration-300 backdrop-blur-sm hover:shadow-blue-500/25"
            >
              Cuentame sobre ti !!
            </motion.button>
          </motion.form>
        </motion.div>

        {/* Footer  */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8 text-slate-400 text-sm"
        >
          <p>Universidad Eafit @ Simón Sloan</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default HomePage;