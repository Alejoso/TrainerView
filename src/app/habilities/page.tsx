"use client"; 
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Habilities() {
    const router = useRouter(); 
    const [formData, setFormData] = useState({
        comunication: "",
        underPreassure: "",
        technical: "",
    });
    const [activeCategory, setActiveCategory] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev, 
            [name]: value,
        })); 
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        const habilidadesData ={
            habilidadesComunicacion : formData.comunication, 
            habilidadesPresion: formData.underPreassure, 
            habilidadesTecnicas : formData.technical, 
        }
        localStorage.setItem("habilidadesUsuario", JSON.stringify(habilidadesData))
        await new Promise(resolve => setTimeout(resolve, 800));
        router.push("/questions");
    }; 

    const categories = [
        {
            id: 0,
            name: "Comunicación",
            icon: "💬",
            gradient: "from-emerald-500 to-teal-600",
            description: "Cómo expresas y transmites ideas"
        },
        {
            id: 1, 
            name: "Resiliencia",
            icon: "⚡",
            gradient: "from-blue-500 to-cyan-600",
            description: "Desempeño en situaciones desafiantes"
        },
        {
            id: 2,
            name: "Tecnología", 
            icon: "🔧",
            gradient: "from-violet-500 to-purple-600",
            description: "Competencias técnicas especializadas"
        }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-900">
            {/* Fondo tecnológico elegante */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-800"></div>
            
            {/* Red de conexiones */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24%,rgba(59,130,246,0.1)_25%,rgba(59,130,246,0.1)_26%,transparent_27%,transparent_74%,rgba(59,130,246,0.1)_75%,rgba(59,130,246,0.1)_76%,transparent_77%)] bg-[size:40px_40px]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(59,130,246,0.1)_25%,rgba(59,130,246,0.1)_26%,transparent_27%,transparent_74%,rgba(59,130,246,0.1)_75%,rgba(59,130,246,0.1)_76%,transparent_77%)] bg-[size:40px_40px]"></div>
            </div>

            {/* Partículas flotantes */}
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`
                        }}
                    />
                ))}
            </div>

            {/* Efectos de luz */}
            <div className="absolute top-1/4 -left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>

            {/* Container principal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-2xl relative z-10"
            >
                {/* Header minimalista */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-12"
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c.5.5.759 1.187.704 1.877M5 14.5L3.697 16.78a2.25 2.25 0 01-.704 1.877" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-light text-white mb-3">
                        Trainer View
                    </h1>
                    <p className="text-slate-300 text-lg">
                        Define tu perfil profesional
                    </p>
                </motion.div>

                {/* Card principal con efecto glass */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8"
                >
                    {/* Navegación elegante */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-white/10 rounded-2xl p-1 flex backdrop-blur-sm">
                            {categories.map((category, index) => (
                                <motion.button
                                    key={category.id}
                                    onClick={() => setActiveCategory(index)}
                                    className={`relative px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                                        activeCategory === index 
                                            ? "text-white" 
                                            : "text-slate-300 hover:text-white"
                                    }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {activeCategory === index && (
                                        <motion.div
                                            layoutId="activeCategory"
                                            className={`absolute inset-0 bg-gradient-to-r ${category.gradient} rounded-xl`}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        <span>{category.icon}</span>
                                        {category.name}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Contenido del formulario */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            {/* Header de la categoría */}
                            <div className="text-center mb-8">
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    className={`w-12 h-12 bg-gradient-to-r ${categories[activeCategory].gradient} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg`}
                                >
                                    <span className="text-xl">{categories[activeCategory].icon}</span>
                                </motion.div>
                                <h2 className="text-2xl font-semibold text-white mb-2">
                                    {categories[activeCategory].name}
                                </h2>
                                <p className="text-slate-300">
                                    {categories[activeCategory].description}
                                </p>
                            </div>

                            {/* Campo de entrada */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <label className="block text-sm font-medium text-slate-300 mb-3">
                                    Describe tu enfoque
                                </label>
                                <input
                                    type="text"
                                    name={Object.keys(formData)[activeCategory]}
                                    value={formData[Object.keys(formData)[activeCategory] as keyof typeof formData]}
                                    onChange={handleChange}
                                    placeholder={`Ej: Mi experiencia en ${categories[activeCategory].name.toLowerCase()}...`}
                                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-slate-400 text-white backdrop-blur-sm"
                                />
                            </motion.div>

                            {/* Indicador de AI */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex items-center justify-center gap-3 text-slate-400 text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="w-2 h-2 bg-cyan-400 rounded-full"
                                    />
                                    <span>AI analysis ready</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Botón de acción */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 pt-6 border-t border-white/10"
                    >
                        <div className="flex justify-between items-center">
                            {/* Progreso sutil */}
                            <div className="flex items-center gap-4 text-sm text-slate-400">
                                <span>Paso {activeCategory + 1} de {categories.length}</span>
                                <div className="flex gap-1">
                                    {categories.map((_, index) => (
                                        <div
                                            key={index}
                                            className={`w-2 h-2 rounded-full transition-colors ${
                                                index <= activeCategory 
                                                    ? `bg-gradient-to-r ${categories[activeCategory].gradient.split(' ')[0]} ${categories[activeCategory].gradient.split(' ')[2]}`
                                                    : "bg-white/20"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <motion.button
                                onClick={(e: any) => {
                                    if (activeCategory < categories.length - 1) {
                                        setActiveCategory(prev => prev + 1);
                                    } else {
                                        onSubmit(e);
                                    }
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`px-8 py-3 text-white rounded-2xl font-medium transition-all hover:shadow-lg backdrop-blur-sm ${
                                    activeCategory === categories.length - 1 
                                        ? "bg-gradient-to-r from-emerald-600 to-teal-600" 
                                        : "bg-gradient-to-r from-blue-600 to-cyan-600"
                                }`}
                            >
                                {activeCategory < categories.length - 1 ? (
                                    <span className="flex items-center gap-2">
                                        Siguiente
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                ) : (
                                    "Completar Perfil"
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Footer elegante */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-8 text-slate-400 text-sm"
                >
                    <p>Universidad Eafit @ TrainerView</p>
                </motion.div>
            </motion.div>
        </div>
    );
}