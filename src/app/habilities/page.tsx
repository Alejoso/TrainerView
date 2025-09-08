"use client"; 
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

function habilities()
{
    const router = useRouter(); 

    const [formData , SetFormData] = useState({
        comunication: "",
        underPreassure: "",
        technical: "",
    })
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        
        const {name , value} = e.target;

        SetFormData((prev) => ({
        ...prev , [name]: value,
        })); 
    
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    
        e.preventDefault(); 
        //LLamada a la api
        router.push("/questions")
    }; 

    
    
    return (
        <div className="h-screen flex justify-center items-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-[28rem]"
        >
            <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl font-bold text-center text-white mb-6"
            >
            Características
            </motion.h1>

            <motion.form
            onSubmit={onSubmit}
            className="flex flex-col gap-4"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                transition: { staggerChildren: 0.15 },
                },
            }}
            >
            {/* Comunicación */}
            <motion.div
                variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
                }}
                className="flex flex-col"
            >
                <label className="text-sm text-gray-200 mb-1">Comunicación</label>
                <input
                type="text"
                name="comunication"
                placeholder="Soy malito hablando"
                onChange={handleChange}
                value={formData.comunication}
                className="px-4 py-2 rounded-lg bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </motion.div>

            {/* Trabajo bajo presión */}
            <motion.div
                variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
                }}
                className="flex flex-col"
            >
                <label className="text-sm text-gray-200 mb-1">Trabajo Bajo Presión</label>
                <input
                type="text"
                name="underPreassure"
                placeholder="Me va mal cuando miden el tiempo"
                onChange={handleChange}
                value={formData.underPreassure}
                className="px-4 py-2 rounded-lg bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </motion.div>

            {/* Habilidades técnicas */}
            <motion.div
                variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
                }}
                className="flex flex-col"
            >
                <label className="text-sm text-gray-200 mb-1">Habilidades Técnicas</label>
                <input
                type="text"
                name="technical"
                placeholder="Me va mal tirando Front"
                onChange={handleChange}
                value={formData.technical}
                className="px-4 py-2 rounded-lg bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </motion.div>

            {/* Botón */}
            <motion.button
                type="submit"
                variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 },
                }}
                whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 15px rgba(59,130,246,0.7)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-lg transition-all duration-300"
            >
                Ingresar Características
            </motion.button>
            </motion.form>
        </motion.div>
        </div>
    )
}
export default habilities; 