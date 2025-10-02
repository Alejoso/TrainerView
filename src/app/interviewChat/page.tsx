"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { q } from "framer-motion/client";

// Componente para efecto de typing
function TypingText({ text, speed = 50, onComplete}: { text: string; speed?: number ; onComplete?: () => void; }) {
    const [displayedText, setDisplayedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timer = setTimeout(() => {
                setDisplayedText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, speed);

            return () => clearTimeout(timer);
        } else if (currentIndex === text.length && onComplete) {
            // Solo ejecutar onComplete cuando termine de escribir
            onComplete();
        }
    }, [currentIndex, text, speed, onComplete]);

    // Resetear cuando cambia el texto
    useEffect(() => {
        setDisplayedText("");
        setCurrentIndex(0);
    }, [text]);

    return (
        <span>
            {displayedText}
            {currentIndex < text.length && (
                <span className="animate-pulse">|</span>
            )}
        </span>
    );
}

function interviewChat() {
    const router = useRouter(); 
    const [userName, setUserName] = useState<string | null>(null);
    const [userJob, setUserJob] = useState<string | null>(null);
    const [numberOfQuestions, setNumberOfQuestions] = useState<string | null>(null);

    useEffect(() => {
        setUserName(localStorage.getItem("userName"));
        setUserJob(localStorage.getItem("userJob"));
        setNumberOfQuestions(localStorage.getItem("numberOfQuestions"));
    }, []);

    const [answers, setAnswers] = useState<
        { id: string; category: string; textoRespuesta: string; responseTime: number; isSubmitted?: boolean; audioDuration?: number }[]
    >([]);

    // Estados para grabación de audio
    const [recording, setRecording] = useState(false);
    const [currentRecordingQuestionId, setCurrentRecordingQuestionId] = useState<string | null>(null);
    const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
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
                    responseTime: responseTime,
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

    // Funciones para grabación de audio
    const startRecording = async (questionId: string) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);

            chunksRef.current = [];
            setCurrentRecordingQuestionId(questionId);
            const startTime = Date.now();
            setRecordingStartTime(startTime);

            mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);

            mediaRecorder.onstop = async () => {
                const endTime = Date.now();
                const duration = Math.round((endTime - startTime) / 1000); // duración en segundos

                const blob = new Blob(chunksRef.current, { type: "audio/wav" });
                const file = new File([blob], "grabacion.wav", { type: "audio/wav" });

                const formData = new FormData();
                formData.append("file", file);

                try {
                    const res = await fetch("/api/speechToText", {
                        method: "POST",
                        body: formData,
                    });

                    const data = await res.json();

                    if (res.ok && data.text) {
                        // Guardar la transcripción como respuesta
                        setAnswers((prevRespuestas) => {
                            const exists = prevRespuestas.findIndex((r) => r.id === questionId);
                            const question = questions?.find(q => q.id === questionId);

                            if (exists !== -1) {
                                const updated = [...prevRespuestas];
                                updated[exists] = {
                                    ...updated[exists],
                                    textoRespuesta: data.text,
                                    isSubmitted: true,
                                    audioDuration: duration,
                                    responseTime: duration,   // 👈 aquí igualamos

                                };
                                return updated;
                            } else {
                                return [
                                    ...prevRespuestas,
                                    { id: questionId, category: question?.categoria || "", textoRespuesta: data.text, responseTime: duration, isSubmitted: true, audioDuration: duration },
                                ];
                            }
                        });

                        toast.success("Audio transcrito correctamente");

                        // Avanzar a la siguiente pregunta
                        if (questions && currentQuestionIndex < questions.length - 1) {
                            setCurrentQuestionIndex(currentQuestionIndex + 1);
                        } else {
                            toast.success("¡Entrevista completada!");
                        }
                    } else {
                        toast.error("Error al transcribir el audio");
                    }
                } catch (error) {
                    toast.error("Error al procesar el audio");
                    console.error(error);
                }

                setCurrentRecordingQuestionId(null);
                setRecordingStartTime(null);
            };

            mediaRecorder.start();
            mediaRecorderRef.current = mediaRecorder;
            setRecording(true);
            toast.success("Grabación iniciada");
        } catch (error) {
            toast.error("Error al acceder al micrófono");
            console.error(error);
            setCurrentRecordingQuestionId(null);
            setRecordingStartTime(null);
        }
    };

    const stopRecording = (id: string) => {
        mediaRecorderRef.current?.stop();
        setRecording(false);
        toast.success("Grabación detenida, procesando...");
        recordResponseTime("Detener", id, setAnswers ); 
    };

    // Función para formatear la duración del audio
    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    };

    // Función para cambiar el tipo de respuesta de audio a texto
    const handleChangeToTextResponse = (questionId: string) => {
        // NO detener el cronómetro, solo cambiar el tipo de respuesta
        // El cronómetro debe seguir contando desde donde estaba
        
        // Cambiar el tipo de respuesta de TODAS las preguntas que sean audio a texto
        SetQuestions(prevQuestions => 
            prevQuestions.map(q => 
                q.tipoRespuesta === "audio" 
                    ? { ...q, tipoRespuesta: "texto" }
                    : q
            )
        );
        
        toast.success("Todas las preguntas de audio cambiadas a texto");
    };


    // Preguntas por defecto para evitar gasto de tokens
    // const defaultQuestions = [
    //     {
    //         "id": 1,
    //         "textoPregunta": "¿Cómo te aseguras de que tu mensaje sea comprendido correctamente por los demás?",
    //         "categoria": "Habilidades blandas",
    //         "respuestaIdeal": "Verifico que el mensaje haya sido entendido correctamente utilizando retroalimentación, reformulaciones y adaptando el lenguaje al interlocutor.",
    //         "tipoRespuesta": "audio"
    //       },
    //       {
    //         "id": 2,
    //         "textoPregunta": "Describe una situación en la que tuviste que comunicar una idea difícil. ¿Cómo lo manejaste?",
    //         "categoria": "Habilidades blandas",
    //         "respuestaIdeal": "Preparé el mensaje con anticipación, utilicé un enfoque empático y aseguré un entorno adecuado para facilitar una comunicación efectiva.",
    //         "tipoRespuesta": "audio"
    //       },
    //       {
    //         "id": 3,
    //         "textoPregunta": "¿Qué papel sueles tomar cuando trabajas en equipo?",
    //         "categoria": "Habilidades blandas",
    //         "respuestaIdeal": "Asumo el rol que sea necesario para el equipo, ya sea liderar, colaborar o apoyar, con el fin de alcanzar los objetivos comunes.",
    //         "tipoRespuesta": "audio"
    //       }
    // ];

    const [questions, SetQuestions] = useState<any[]>([]);

    
    // Nuevo estado para controlar la pregunta actual
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loadingQuestions, setloadingQuestions] = useState(false);
    
    // Estado para controlar si ya se inició el cronómetro para cada pregunta
    const [timerStarted, setTimerStarted] = useState<Set<string>>(new Set());

    const generateQuestions = async () => {
        setloadingQuestions(true);
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
            setloadingQuestions(false);
            if (!res.ok) {
                toast.error(String(data.error));
            }

            if (res.ok) {
                SetQuestions(data.preguntas);
            }
        } catch (err: any) {
            console.log(err)
            toast.error(err || "Se produjo un error")
            setloadingQuestions(false);
        }
    }

    function showResponses() {
        console.log(answers);
        console.log(questions);
    }

    let responseTime: number = 0; // aquí guardamos el tiempo de respuesta para cada pregunta

    const timerIdRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);

    const recordResponseTime = (
        modo: "Iniciar" | "Detener",
        id: string,
        setAnswers: React.Dispatch<React.SetStateAction<
            { id: string; category: string; textoRespuesta: string; responseTime: number; isSubmitted?: boolean; audioDuration?: number }[]
        >>
        ) => {
        if (modo === "Iniciar") {
            startTimeRef.current = Date.now();
            if (timerIdRef.current) clearInterval(timerIdRef.current); // evitar duplicados
            timerIdRef.current = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
            console.log("Tiempo transcurrido:", elapsed, "s");
            }, 1000);
        }

        if (modo === "Detener") {
            if (timerIdRef.current) {
            clearInterval(timerIdRef.current);
            timerIdRef.current = null;
            const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
            console.log("Tiempo total:", duration, "s");
            setAnswers(prev =>
                prev.map(ans =>
                ans.id === id ? { ...ans, responseTime: duration } : ans
                )
            );
            }
        }
    };



    const handleSendResponseText = (questionId: string) => {
        const currentAnswer = answers.find((r) => r.id === questionId);
        if (currentAnswer?.textoRespuesta?.trim()) {
            toast.success("Respuesta guardada correctamente");
            // Marcar la pregunta como respondida agregando un flag
            setAnswers((prevRespuestas) => {
                const updated = [...prevRespuestas];
                const index = updated.findIndex((r) => r.id === questionId);
                if (index !== -1) {
                    updated[index] = {
                        ...updated[index],
                        isSubmitted: true // Agregar flag para indicar que fue enviada
                    };
                }
                return updated;
            });

            // Avanzar a la siguiente pregunta inmediatamente
            if (questions && currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                toast.success("¡Entrevista completada!");
            }
        } else {
            toast.error("Por favor escribe una respuesta");
        }
    }

    const handleSendResponseAudio = (questionId: string) => {
        if (recording && currentRecordingQuestionId === questionId) {
            // Si está grabando esta pregunta, detener la grabación
            stopRecording(questionId);
        } else if (!recording) {
            // Si no está grabando, iniciar grabación para esta pregunta
            startRecording(questionId);
        }
    }

    //Luego se descomenta, para no gastar tokens bobamente
    // useEffect(() => {
    //     generateQuestions(); 
    // } , []);

    const [analyzing , setAnalyzing] = useState(false); 
    const handleFinish = async () => {

        setAnalyzing(true); 
        console.log("Generando analisis...")

        try {
            console.log(answers , questions); 

            const res = await fetch("/api/analizeResponses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ respuestas: answers , preguntas: questions })
              });

              const data = await res.json(); 

              setAnalyzing(false); 
              localStorage.setItem("analisis", JSON.stringify(data));
              router.push("/interviewChat/interviewAnalysis")

        } catch (err: any) {
            console.log(err)
            toast.error(err || "Se produjo un error")
            setAnalyzing(false); 
        }
    }; 

    return (
        <div className="min-h-screen bg-zinc-900 text-white p-6">

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
            <div className="flex justify-center mb-4">
                {/* Botón para generar preguntas */}
                <button
                    onClick={generateQuestions} // tu función
                    disabled={loadingQuestions}     // evitas múltiples clicks
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white flex items-center gap-2 disabled:opacity-50"
                    >
                    {loadingQuestions ? (
                        <>
                        <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            />
                            <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                            />
                        </svg>
                        Generando...
                        </>
                    ) : (
                        "Generar Preguntas"
                    )}
                    </button>
            </div>
                </div>

                {/* Contenedor de la conversación */}
                <div className="bg-zinc-800 border border-zinc-600 rounded-xl p-6 shadow-xl max-w-4xl mx-auto">
                    {/* Preguntas visibles hasta el índice actual */}
                    <div className="space-y-6">
                        {Array.isArray(questions) && questions.length > 0 ? (
                            questions.slice(0, currentQuestionIndex + 1).map((question, index) => {
                                const { id, textoPregunta, categoria, tipoRespuesta } = question;
                                const respuesta = answers.find((r) => r.id === id);
                                const isLastQuestion = index === currentQuestionIndex;

                                return (
                                    <motion.div
                                        key={id}
                                        className="max-w-4xl mx-auto space-y-4"
                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{
                                            duration: 0.6,
                                            ease: "easeOut",
                                            delay: index * 0.2
                                        }}
                                    >
                                        {/* Mensaje del entrevistador tipo WhatsApp */}
                                        <motion.div
                                            className="flex items-start gap-3"
                                            initial={{ opacity: 0, x: -30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                duration: 0.5,
                                                ease: "easeOut",
                                                delay: index * 0.2 + 0.1
                                            }}
                                        >
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                    👤
                                                </div>
                                            </div>
                                            <div className="flex-1 max-w-xl">
                                                <div
                                                    className="bg-zinc-700 rounded-2xl rounded-tl-sm p-4 shadow-lg"
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-semibold text-blue-300">Entrevistador</span>
                                                    </div>
                                                    <p className="text-gray-200 leading-relaxed">
                                                        <TypingText text={textoPregunta} speed={50} 
                                                        onComplete={() => {
                                                        // Iniciar el cronómetro cuando termine la animación tanto para texto como para audio
                                                            if (isLastQuestion && !respuesta?.isSubmitted && !timerStarted.has(id)) {
                                                                recordResponseTime("Iniciar", id, setAnswers);
                                                                setTimerStarted(prev => new Set(prev).add(id));
                                                            }
                                                        }}/>
                                                    </p>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className="block text-xs text-gray-400 mb-3">
                                                            Categoría: <span className="text-blue-400">{categoria}</span>
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            {id}/{questions.length}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Respuesta del usuario */}
                                        <motion.div
                                            className="flex items-start gap-3 justify-end"
                                            initial={{ opacity: 0, x: 30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                duration: 0.5,
                                                ease: "easeOut",
                                                delay: index * 0.2 + 0.1 + (textoPregunta.length * 0.05) + 0.3
                                            }}
                                        >
                                            <div className="flex-1 max-w-xl">
                                                {tipoRespuesta === "texto" ? (
                                                    // Respuesta de texto tipo WhatsApp
                                                    <div className="bg-slate-600 rounded-2xl rounded-tr-sm p-4 shadow-lg">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="font-semibold text-white">Tú</span>
                                                        </div>
                                                        {isLastQuestion && !respuesta?.isSubmitted ? (
                                                            // Solo permite input en la última pregunta sin enviar
                                                           
                                                            
                                                            <div className="flex gap-2 items-center">
                                                                <textarea
                                                                    rows={4}
                                                                    placeholder="Escribe tu respuesta aquí..."
                                                                    onChange={(e) => handleChange(e, id, categoria, 0)}
                                                                    value={respuesta?.textoRespuesta || ""}

                                                                    className="flex-1 bg-slate-500 rounded-xl p-3 text-white placeholder-slate-200 border-none resize-none focus:ring-2 focus:ring-white/20 focus:outline-none"
                                                                />
                                                                <button
                                                                    onClick={() => {
                                                                        recordResponseTime("Detener", id, setAnswers);   // Se detiene el tiempo de respuesta para esa pregunta en particular
                                                                        handleSendResponseText(id); 
                                                                    }}
                                                                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-200 text-white flex-shrink-0"
                                                                    title="Enviar respuesta"
                                                                >
                                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                                                        <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        ) : respuesta?.isSubmitted && respuesta?.textoRespuesta ? (
                                                            // Mostrar respuesta ya enviada
                                                            <p className="text-gray-200 leading-relaxed break-words overflow-wrap-anywhere whitespace-pre-wrap">{respuesta.textoRespuesta}</p>
                                                        ) : (
                                                            // Pregunta anterior sin respuesta (no debería pasar)
                                                            <p className="text-gray-400 italic">Esperando respuesta...</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    // Respuesta de audio
                                                    <div className="flex items-center justify-center">
                                                        {isLastQuestion && !respuesta?.isSubmitted ? (
                                                            // Permite la opcion de responder con audio o boton de "En este momento no puedo"
                                                            <div className="flex gap-3 items-center">
                                                                <button
                                                                    onClick={() => handleSendResponseAudio(id)}
                                                                    className={`p-4 rounded-full transition-colors duration-200 text-white ${recording && currentRecordingQuestionId === id
                                                                        ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                                                                        : 'bg-blue-600 hover:bg-blue-700'
                                                                        }`}
                                                                    title={recording && currentRecordingQuestionId === id ? "Detener grabación" : "Grabar respuesta de audio"}
                                                                >
                                                                    <svg
                                                                        width="24"
                                                                        height="24"
                                                                        viewBox="0 0 24 24"
                                                                        fill="currentColor"
                                                                    >
                                                                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                                                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                                                        <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2" />
                                                                        <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2" />
                                                                    </svg>
                                                                </button>

                                                                <button
                                                                    className="px-4 py-2 bg-blue-600 text-white placeholder-slate-200 border-none text-white text-xs rounded-lg transition-colors duration-200 flex items-center gap-2"
                                                                    title="Cambiar a respuesta por texto"
                                                                    onClick={() => handleChangeToTextResponse(id)}
                                                                >
                                                                    <svg
                                                                        width="24"
                                                                        height="24"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeWidth="2"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    >
                                                                        {/* Micrófono */}
                                                                        <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                                                                        <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                                                                        <line x1="12" y1="18" x2="12" y2="22" />
                                                                        <line x1="8" y1="22" x2="16" y2="22" />
                                                                        
                                                                        {/* Círculo tachado */}
                                                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                                                                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="currentColor" strokeWidth="2" />
                                                                    </svg>

                                                                    Responder con texto
                                                                </button>
                                                            </div>
                                                        ) : respuesta?.isSubmitted ? (
                                                            // Audio ya respondido con transcripción
                                                            <div className="bg-slate-600 rounded-2xl rounded-tr-sm p-4 shadow-lg">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="font-semibold text-white">Tú</span>
                                                                    {respuesta.audioDuration && (
                                                                        <span className="text-xs text-gray-300 bg-gray-700 px-2 py-1 rounded-full">
                                                                            ⏱️ {formatDuration(respuesta.audioDuration)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-gray-200 leading-relaxed break-words overflow-wrap-anywhere whitespace-pre-wrap">
                                                                    🎤 {respuesta.textoRespuesta === "audio_response" ? "Respuesta de audio enviada" : respuesta.textoRespuesta}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            // Esperando respuesta
                                                            <p className="text-gray-400 italic">Esperando respuesta de audio...</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                    {userName ? userName[0].toUpperCase() : '🗣️'}
                                                </div>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <p className="text-gray-400 text-center">
                                No hay preguntas cargadas todavía.
                            </p>
                        )}
                    </div>
                </div>

                {/* Botón para mostrar respuestas */}
                <div className="flex justify-center mt-4">
                <button
                    onClick={handleFinish}
                    disabled={analyzing}
                    className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition font-medium shadow-md flex items-center gap-2 disabled:opacity-50"
                    >
                    {analyzing ? (
                        <>
                        <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            />
                            <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                            />
                        </svg>
                        Analizando...
                        </>
                    ) : (
                        "Analizar respuestas"
                    )}
                    </button>
                </div>
            </div>
    )
}

export default interviewChat