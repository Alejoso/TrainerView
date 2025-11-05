// app/promotion/page.tsx
"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function PromotionPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Colores de Trainerview 
  const trainerviewColors = {
    primary: '#0f172a',     // slate-900
    secondary: '#1e293b',   // slate-800
    accent: '#2563eb',      // blue-600
    highlight: '#06b6d4',   // cyan-500
    light: '#f8fafc'        // slate-50
  };

  const sections = [
    {
      id: 'hero',
      title: 'TRAINERVIEW',
      subtitle: 'ENTREVISTAS TÉCNICAS CON IA',
      description: 'Domina tus entrevistas técnicas con simulacros realistas y feedback instantáneo impulsado por IA',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      number: '01'
    },
    {
      id: 'problem',
      title: 'EL DESAFÍO',
      subtitle: 'PREPARACIÓN INEFECTIVA',
      description: 'La práctica tradicional no prepara para entrevistas técnicas reales con preguntas específicas y feedback relevante',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
      number: '02'
    },
    {
      id: 'solution',
      title: 'LA SOLUCIÓN',
      subtitle: 'PRÁCTICA INTELIGENTE',
      description: 'Entrenamiento personalizado con IA que simula entrevistas reales y proporciona análisis detallado',
      background: 'linear-gradient(135deg, #334155 0%, #475569 50%, #64748b 100%)',
      number: '03'
    },
    {
      id: 'demo',
      title: 'EXPERIMENTA',
      subtitle: 'INTERFAZ INMERSIVA',
      description: 'Chat interactivo con IA que guía tu preparación como un entrevistador real',
      background: 'linear-gradient(135deg, #475569 0%, #64748b 50%, #94a3b8 100%)',
      number: '04'
    },
    {
      id: 'start',
      title: 'COMIENZA',
      subtitle: 'GRATIS Y ACCESIBLE',
      description: 'Únete a miles de desarrolladores que están transformando sus carreras con TrainerView',
      background: 'linear-gradient(135deg, #64748b 0%, #475569 50%, #0f172a 100%)',
      number: '05'
    }
  ];

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = Math.sign(e.deltaY);
      const newSection = Math.max(0, Math.min(sections.length - 1, currentSection + delta));
      setCurrentSection(newSection);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentSection(prev => Math.min(sections.length - 1, prev + 1));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSection(prev => Math.max(0, prev - 1));
      }
    };

    sectionsRef.current[currentSection]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    
    setTimeout(() => setIsLoading(false), 1000);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSection]);

  // Navbar que coincide con la app
  const TrainerViewNavbar = () => (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="fixed top-0 w-full z-50 px-8 py-6"
    >
      <div className="flex justify-between items-center">
        {/* Logo de TrainerView */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-3 cursor-pointer"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <span className="text-white font-bold text-sm">TV</span>
          </div>
          <span className="text-white font-semibold text-lg bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            TrainerView
          </span>
        </motion.div>

        {/* Navegación */}
        <div className="hidden md:flex items-center space-x-8">
          {sections.map((section, index) => (
            <motion.button
              key={section.id}
              onClick={() => setCurrentSection(index)}
              className={`text-sm font-medium transition-all duration-300 ${
                currentSection === index 
                  ? 'text-cyan-400' 
                  : 'text-slate-300 hover:text-cyan-300'
              }`}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {section.number}
            </motion.button>
          ))}
        </div>
        
        {/* CTA Buttons */}
        <div className="flex items-center space-x-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/interviewHistory"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-2xl font-semibold text-sm hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg shadow-blue-500/25 backdrop-blur-sm"
          >
            Ver historial
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/interviewStart"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-2xl font-semibold text-sm hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg shadow-blue-500/25 backdrop-blur-sm"
          >
            Comenzar Entrevista
          </Link>
        </motion.div>
      </div>
    </div>
    </motion.nav>
  );

  // Loader con identidad TrainerView
  const TrainerViewLoader = () => (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      onAnimationComplete={() => setIsLoading(false)}
      className="fixed inset-0 bg-slate-900 z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25"
      >
        <motion.span 
          className="text-white font-bold text-xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          TV
        </motion.span>
      </motion.div>
    </motion.div>
  );

  // Componente de sección
  const Section = ({ section, index }: { section: typeof sections[0], index: number }) => (
    <motion.section
      ref={el => sectionsRef.current[index] = el}
      id={section.id}
      className="h-screen w-screen flex-shrink-0 flex items-center justify-center relative overflow-hidden"
      style={{ background: section.background }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Efectos de fondo similares a la app */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Número de sección sutil */}
      <motion.div
        className="absolute left-8 bottom-8 text-slate-600 text-8xl font-black"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        {section.number}
      </motion.div>

      {/* Contenido principal */}
      <div className="text-center max-w-4xl mx-auto px-8 relative z-10">
        <motion.h2
          className="text-5xl md:text-7xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {section.title}
        </motion.h2>
        
        <motion.p
          className="text-xl text-cyan-400 font-semibold tracking-wide mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {section.subtitle}
        </motion.p>

        <motion.p
          className="text-lg text-slate-300 font-light mb-12 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {section.description}
        </motion.p>

        <SectionContent section={section} index={index} />
      </div>
    </motion.section>
  );

  // Contenido específico para cada sección
  const SectionContent = ({ section, index }: { section: typeof sections[0], index: number }) => {
    switch (index) {
      case 0: // Hero
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/interviewStart"
                  className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-2xl shadow-blue-500/25"
                >
                  Comenzar Entrevista Gratis
                </Link>
              </motion.div>
              
              <div className="flex justify-center space-x-6 text-slate-400 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Sin registro</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Comienza ya</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>100% Gratuito</span>
                </div>
              </div>
            </div>
            
            <motion.p
              className="text-slate-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Desliza o usa las flechas para explorar
            </motion.p>
          </motion.div>
        );

      case 1: // Problem
        return (
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50"
              >
                <div className="text-cyan-400 text-4xl mb-4">🤔</div>
                <h3 className="text-white text-xl font-semibold mb-4">Problemas Comunes</h3>
                <ul className="text-slate-300 space-y-3 text-left">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Nervios y falta de confianza</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Preparación genérica e inefectiva</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Falta de feedback realista</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50"
              >
                <div className="text-cyan-400 text-4xl mb-4">💼</div>
                <h3 className="text-white text-xl font-semibold mb-4">Consecuencias</h3>
                <ul className="text-slate-300 space-y-3 text-left">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Oportunidades perdidas</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Procesos más largos</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Frustración constante</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        );

      case 2: // Solution
        return (
          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: '🤖',
                  title: 'IA Adaptativa',
                  description: 'Se ajusta a tu nivel y stack tecnológico'
                },
                {
                  icon: '💬',
                  title: 'Feedback Instantáneo',
                  description: 'Análisis detallado de cada respuesta'
                },
                {
                  icon: '🎯',
                  title: 'Personalizado',
                  description: 'Preguntas específicas para tu perfil'
                }
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 + i * 0.2 }}
                  className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50 text-center hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-cyan-400 text-lg font-semibold mb-3">{feature.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 3: // Demo
        return (
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50">
              <div className="text-center mb-6">
                <div className="text-cyan-400 text-4xl mb-4">💻</div>
                <h3 className="text-white text-xl font-semibold mb-2">Experiencia Inmersiva</h3>
                <p className="text-slate-300">Chat realista con IA como entrevistador</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">AI</span>
                  </div>
                  <div className="bg-slate-700/50 rounded-2xl rounded-tl-none p-4 flex-1">
                    <p className="text-slate-200 text-sm">
                      "Cuéntame sobre un proyecto donde usaste JavaScript y React..."
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 justify-end">
                  <div className="bg-cyan-500/20 rounded-2xl rounded-tr-none p-4 max-w-xs">
                    <p className="text-slate-200 text-sm">
                      "Desarrollé una aplicación de gestión de tareas con React..."
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">TÚ</span>
                  </div>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/interviewStart"
                  className="block w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-semibold text-center hover:from-blue-700 hover:to-cyan-700 transition-all duration-300"
                >
                  Probar Demo Interactivo
                </Link>
              </motion.div>
            </div>
          </motion.div>
        );

      case 4: // Start
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/interviewStart"
                  className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-2xl shadow-blue-500/25"
                >
                  Comenzar Ahora - 100% Gratis
                </Link>
              </motion.div>
              
              <div className="grid grid-cols-3 gap-4 text-slate-300 text-sm">
                <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="text-green-400 text-2xl mb-2">✓</div>
                  <div>Sin registro</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="text-green-400 text-2xl mb-2">⚡</div>
                  <div>Inmediato</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="text-green-400 text-2xl mb-2">🎯</div>
                  <div>Personalizado</div>
                </div>
              </div>
            </div>

            <motion.p
              className="text-slate-400 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Únete a miles de desarrolladores que están transformando sus carreras
            </motion.p>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && <TrainerViewLoader />}
      </AnimatePresence>

      <TrainerViewNavbar />

      <motion.main
        ref={containerRef}
        className="flex h-screen overflow-x-hidden snap-x snap-mandatory"
        style={{
          scrollBehavior: 'smooth',
          scrollSnapType: 'x mandatory'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {sections.map((section, index) => (
          <Section key={section.id} section={section} index={index} />
        ))}
      </motion.main>

      {/* Indicador de progreso */}
      <motion.div
        className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex flex-col space-y-4">
          {sections.map((section, index) => (
            <motion.button
              key={section.id}
              onClick={() => setCurrentSection(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSection === index 
                  ? 'bg-cyan-400 scale-125 shadow-lg shadow-cyan-400/25' 
                  : 'bg-slate-600 hover:bg-cyan-300'
              }`}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.8 }}
            />
          ))}
        </div>
      </motion.div>
    </>
  );
}