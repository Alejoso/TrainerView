"use client"; 
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast , {Toaster} from "react-hot-toast";


function QuestionsQuantity() {
    
    const router = useRouter(); 
    const userName = localStorage.getItem("userName"); 

    const [numberOfQuestions , SetNumberOfQuestions] = useState<number | string>("")
    const [inputValue, setInputValue] = useState("");
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (value === "") {
            SetNumberOfQuestions(""); // Leave a blank space
        } else {
            SetNumberOfQuestions(Number(value));
        }
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    
        e.preventDefault(); 
        
        if(!numberOfQuestions || Number(numberOfQuestions) <= 0){
            toast.error("Numero invalido de preguntas")
        } 
        
        else {

            if(Number(numberOfQuestions) > 4) { //4 for testing and dont waste tokens
                toast.error("No puedes tener más de 35 preguntas")
            } else {
                //Save the questions in a global variable
                localStorage.setItem("numberOfQuestions" , String(numberOfQuestions))
                router.push("/interviewChat")
            }

        }

    }; 

    return (
        <div className="h-screen flex justify-center items-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
            <Toaster/>
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
                className="text-2xl font-semibold text-center text-white mb-6"
                >
                ¿Cuántas preguntas quieres responder hoy{" "}
                <span className="text-blue-400 font-bold">{userName}</span>?
                </motion.h1>

                <motion.form
                onSubmit={onSubmit}
                className="flex flex-col gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.15 } },
                }}
                >
                {/* Input número */}
                <motion.input
                    type="number"
                    name="numberOfQuestions"
                    placeholder="Menos de 100 porfa"
                    value={numberOfQuestions}
                    onChange={handleChange}
                    variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                    }}
                    className="px-4 py-2 rounded-lg bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />

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
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-lg transition-all duration-300"
                >
                    Empezar
                </motion.button>
                </motion.form>
            </motion.div>
        </div>
    )
}

export default QuestionsQuantity; 