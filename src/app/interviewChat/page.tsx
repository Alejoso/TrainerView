"use client"; 
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast , {Toaster}  from "react-hot-toast";

function interviewChat () 
{
    const [userName, setUserName] = useState<string | null>(null);
    const [userJob, setUserJob] = useState<string | null>(null);
    const [numberOfQuestions, setNumberOfQuestions] = useState<string | null>(null);

    useEffect(() => {
        setUserName(localStorage.getItem("userName"));
        setUserJob(localStorage.getItem("userJob"));
        setNumberOfQuestions(localStorage.getItem("numberOfQuestions"));
    }, []);

    const [answers, setAnswers] = useState<
        { id: string; category: string; textoRespuesta: string; responseTime: number }[]
    >([]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        questionId: string,
        category: string,
        responseTime: number,
    ) => {
        const { value } = e.target;

        setAnswers((prevRespuestas) => {
            const exists = prevRespuestas.findIndex((r) => r.id === questionId);

            if (exists !== -1) {
                // update existing answer
                const updated = [...prevRespuestas];

                updated[exists] = {
                    id: questionId,
                    category: category,
                    textoRespuesta: value,
                    responseTime: 0,
                };

                return updated;
            } else {
                return [
                ...prevRespuestas,
                { id: questionId, category: category, textoRespuesta: value, responseTime: 0 },
                ];
            }
        });


    };

    
    const[questions , SetQuestions] = useState<any[]>([]);

    const generateQuestions = async () => {

        console.log("Generando preguntas...")

        try {
            const res = await fetch("api/gpt", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userName: userName,
                    userJob: userJob,
                    numberOfQuestions: numberOfQuestions,
                })
            });

            const data = await res.json();

            if(!res.ok){
                toast.error(String(data.error));
            }

            if(res.ok){
                console.log(data); 
                SetQuestions(data);
            }
        } catch (err: any) {
            console.log(err)
            toast.error(err || "Se produjo un error")
        }
    }

    function showResponses() {
        console.log(answers);
        console.log(questions); 
    }

    //Luego se descomenta, para no gastar tokens bobamente
    // useEffect(() => {
    //     generateQuestions(); 
    // } , []);
          

    return (
        <div className="min-h-screen bg-zinc-900 text-white p-6">
            <Toaster />

            <div className="max-w-3xl mx-auto space-y-6">
                {/* Encabezado con datos del usuario */}
                <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-blue-400">Simulación de Entrevista</h1>
                <p className="text-gray-400">
                    <span className="font-semibold text-white">{userName}</span> aspirando a{" "}
                    <span className="font-semibold text-white">{userJob}</span>  
                    — {numberOfQuestions} preguntas
                </p>
                </div>

                {/* Botón para generar preguntas */}
                <div className="flex justify-center">
                <button
                    onClick={generateQuestions}
                    className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium shadow-md"
                >
                    Generar preguntas
                </button>
                </div>

                {/* Preguntas */}
                <div className="space-y-6">
                {Array.isArray(questions) && questions.length > 0 ? (
                    questions
                    .filter((q) => q && q.id)
                    .map(({ id, textoPregunta, categoria }) => {
                        const respuesta = answers.find((r) => r.id === id);

                        return (
                        <div
                            key={id}
                            className="p-5 rounded-xl bg-zinc-800 border border-zinc-700 shadow-lg"
                        >
                            <h2 className="text-lg font-semibold text-blue-300 mb-2">
                            Pregunta {id}
                            </h2>
                            <p className="text-gray-200 mb-3">{textoPregunta}</p>
                            <span className="block text-xs text-gray-400 mb-3">
                            Categoría: <span className="text-blue-400">{categoria}</span>
                            </span>
                            <input
                            type="text"
                            placeholder="Escribe tu respuesta aquí..."
                            onChange={(e) => handleChange(e, id, categoria, 0)}
                            value={respuesta?.textoRespuesta || ""}
                            className="mt-1 p-2 w-full rounded-md bg-zinc-700 border border-zinc-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        );
                    })
                ) : (
                    <p className="text-gray-400 text-center">
                    No hay preguntas cargadas todavía.
                    </p>
                )}
                </div>

                {/* Botón para mostrar respuestas */}
                <div className="flex justify-center">
                <button
                    onClick={showResponses}
                    className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition font-medium shadow-md"
                >
                    Mostrar respuestas y preguntas
                </button>
                </div>
            </div>
        </div>
    )
}

export default interviewChat