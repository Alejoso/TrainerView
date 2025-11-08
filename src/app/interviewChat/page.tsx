"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

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
            onComplete();
        }
    }, [currentIndex, text, speed, onComplete]);

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

function InterviewChat() {
    const router = useRouter(); 
    const [userName, setUserName] = useState<string | null>(null);
    const [userJob, setUserJob] = useState<string | null>(null);
    const [numberOfQuestions, setNumberOfQuestions] = useState<string | null>(null);
    const [habilidadesUsuario, setHabilidadesUsuario] = useState<any>(null);

    useEffect(() => {
        setUserName(localStorage.getItem("userName"));
        setUserJob(localStorage.getItem("userJob"));
        setNumberOfQuestions(localStorage.getItem("numberOfQuestions"));
       
        const habilidadesGuardadas = localStorage.getItem("habilidadesUsuario");
        if (habilidadesGuardadas) {
            try {
                setHabilidadesUsuario(JSON.parse(habilidadesGuardadas));
                console.log(" Habilidades cargadas:", JSON.parse(habilidadesGuardadas));
            } catch (error) {
                console.error(" Error parseando habilidades:", error);
            }
        } else {
            console.warn(" No se encontraron habilidades en localStorage");
        }
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
                const duration = Math.round((endTime - startTime) / 1000);

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
                                    responseTime: duration,
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

    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    };

    const handleChangeToTextResponse = (questionId: string) => {
        SetQuestions(prevQuestions => 
            prevQuestions.map(q => 
                q.tipoRespuesta === "audio" 
                    ? { ...q, tipoRespuesta: "texto" }
                    : q
            )
        );
        toast.success("Todas las preguntas de audio cambiadas a texto");
    };

    const [questions, SetQuestions] = useState<any[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loadingQuestions, setloadingQuestions] = useState(false);
    const [timerStarted, setTimerStarted] = useState<Set<string>>(new Set());

    const generateQuestions = async () => {
        setloadingQuestions(true);
        console.log("Generando preguntas...")
        console.log("Enviando a GPT:", {
            userName,
            userJob, 
            numberOfQuestions,
            HabilidadesUsuario: {
                habilidadesTecnicas: habilidadesUsuario?.habilidadesTecnicas,
                habilidadesPresion: habilidadesUsuario?.habilidadesPresion
            }
        });
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
                    HabilidadesUsuario: {   
                    habilidadesTecnicas: habilidadesUsuario?.habilidadesTecnicas || "",
                    habilidadesPresion: habilidadesUsuario?.habilidadesPresion || ""
                }
                })
            });

            const data = await res.json();
            setloadingQuestions(false);
            if (!res.ok) {
                toast.error(String(data.error));
            }

            if (res.ok) {
                SetQuestions(data.preguntas);
                localStorage.setItem("preguntas", JSON.stringify(data.preguntas));
            }
        } catch (err: any) {
            console.log(err)
            toast.error(err || "Se produjo un error")
            setloadingQuestions(false);
        }
    }

    let responseTime: number = 0;
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
            if (timerIdRef.current) clearInterval(timerIdRef.current);
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
            setAnswers((prevRespuestas) => {
                const updated = [...prevRespuestas];
                const index = updated.findIndex((r) => r.id === questionId);
                if (index !== -1) {
                    updated[index] = {
                        ...updated[index],
                        isSubmitted: true
                    };
                }
                return updated;
            });

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
            stopRecording(questionId);
        } else if (!recording) {
            startRecording(questionId);
        }
    }

    const [analyzing , setAnalyzing] = useState(false); 
    const handleFinish = async () => {
        setAnalyzing(true); 
        console.log("Generando analisis...")

        try {
            console.log(answers , questions); 

            localStorage.setItem("respuestas" , JSON.stringify(answers)); 
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

    // Nodos para la red neuronal - Patrón diferente para esta vista
    const neuralNodes = [
        { id: 1, x: 5, y: 15 }, { id: 2, x: 20, y: 30 }, { id: 3, x: 35, y: 10 },
        { id: 4, x: 50, y: 25 }, { id: 5, x: 65, y: 40 }, { id: 6, x: 80, y: 20 },
        { id: 7, x: 95, y: 35 }, { id: 8, x: 10, y: 50 }, { id: 9, x: 30, y: 65 },
        { id: 10, x: 55, y: 55 }, { id: 11, x: 75, y: 70 }, { id: 12, x: 90, y: 85 },
    ];

    const neuralConnections = [
        { from: 1, to: 2 }, { from: 1, to: 3 }, { from: 2, to: 4 },
        { from: 3, to: 4 }, { from: 4, to: 5 }, { from: 4, to: 6 },
        { from: 5, to: 6 }, { from: 6, to: 7 }, { from: 2, to: 8 },
        { from: 8, to: 9 }, { from: 9, to: 10 }, { from: 10, to: 11 },
        { from: 11, to: 12 }, { from: 5, to: 10 }, { from: 7, to: 11 },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-900">
            {/* Fondo neural personalizado para chat */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-800"></div>
            
            {/* Red neuronal - Patrón más denso para chat */}
            <div className="absolute inset-0">
                <svg className="w-full h-full opacity-30">
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
                                stroke="url(#chatGradient)"
                                strokeWidth="0.3"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ 
                                    pathLength: 1, 
                                    opacity: [0.2, 0.4, 0.2] 
                                }}
                                transition={{
                                    pathLength: { duration: 3, delay: index * 0.05 },
                                    opacity: { duration: 4, repeat: Infinity, delay: index * 0.05 }
                                }}
                            />
                        );
                    })}
                    
                    <defs>
                        <linearGradient id="chatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6" />
                            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.6" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Nodos neuronales - Más pequeños y numerosos */}
            <div className="absolute inset-0">
                {neuralNodes.map((node) => (
                    <motion.div
                        key={node.id}
                        className="absolute w-2 h-2 bg-blue-300 rounded-full shadow-lg shadow-blue-300/40"
                        style={{
                            left: `${node.x}%`,
                            top: `${node.y}%`,
                        }}
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.7, 0.3],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 3
                        }}
                    />
                ))}
            </div>

            {/* Efectos de luz específicos para chat */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/3 left-2/3 w-48 h-48 bg-indigo-400/5 rounded-full blur-3xl"></div>


            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-4xl relative z-10"
            >
                {/* Header del chat */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-light text-white mb-2">
                        Trainer View
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-slate-300 text-sm">
                        <span><strong className="text-cyan-400">{userName}</strong></span>
                        <span>•</span>
                        <span>Aspira a: <strong className="text-cyan-400">{userJob}</strong></span>
                        <span>•</span>
                        <span>{numberOfQuestions} preguntas</span>
                    </div>
                </motion.div>

                {/* Botón para generar preguntas */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center mb-6"
                >
                    <motion.button
                        onClick={generateQuestions}
                        disabled={loadingQuestions}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-2xl shadow-lg transition-all duration-300 backdrop-blur-sm hover:shadow-blue-500/25 flex items-center gap-3 disabled:opacity-50"
                    >
                        {loadingQuestions ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                />
                                Generando preguntas...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Generar Preguntas
                            </>
                        )}
                    </motion.button>
                </motion.div>

                {/* Contenedor del chat con efecto glass - SIN BARRAS LATERALES */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 max-h-[70vh] overflow-y-auto"
                    style={{ 
                        scrollbarWidth: 'none', /* Firefox */
                        msOverflowStyle: 'none', /* IE and Edge */
                    }}
                >
                    {/* Estilo para ocultar scrollbar en Chrome, Safari y Opera */}
                    <style jsx>{`
                        .overflow-y-auto::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                    
                    <div className="space-y-6">
                        {Array.isArray(questions) && questions.length > 0 ? (
                            questions.slice(0, currentQuestionIndex + 1).map((question, index) => {
                                const { id, textoPregunta, categoria, tipoRespuesta } = question;
                                const respuesta = answers.find((r) => r.id === id);
                                const isLastQuestion = index === currentQuestionIndex;

                                return (
                                    <motion.div
                                        key={id}
                                        className="space-y-4"
                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{
                                            duration: 0.6,
                                            ease: "easeOut",
                                            delay: index * 0.2
                                        }}
                                    >
                                        {/* Mensaje del entrevistador */}
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
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                                                    AI
                                                </div>
                                            </div>
                                            <div className="flex-1 max-w-xl">
                                                <div className="bg-blue-500/20 backdrop-blur-sm rounded-2xl rounded-tl-sm p-4 shadow-lg border border-blue-400/20">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-semibold text-cyan-300">Entrevistador AI</span>
                                                        <span className="text-xs text-blue-300 bg-blue-500/30 px-2 py-1 rounded-full">
                                                            {categoria}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-200 leading-relaxed">
                                                        <TypingText text={textoPregunta} speed={50} 
                                                        onComplete={() => {
                                                            if (isLastQuestion && !respuesta?.isSubmitted && !timerStarted.has(id)) {
                                                                recordResponseTime("Iniciar", id, setAnswers);
                                                                setTimerStarted(prev => new Set(prev).add(id));
                                                            }
                                                        }}/>
                                                    </p>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <span className="text-xs text-blue-300">
                                                            Pregunta {id}/{questions.length}
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
                                                    <div className="bg-slate-600/50 backdrop-blur-sm rounded-2xl rounded-tr-sm p-4 shadow-lg border border-slate-500/20">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="font-semibold text-white">Tú</span>
                                                        </div>
                                                        {isLastQuestion && !respuesta?.isSubmitted ? (
                                                            <div className="flex gap-2 items-center">
                                                                <textarea
                                                                    rows={4}
                                                                    placeholder="Escribe tu respuesta aquí..."
                                                                    onChange={(e) => handleChange(e, id, categoria, 0)}
                                                                    value={respuesta?.textoRespuesta || ""}
                                                                    className="flex-1 bg-slate-500/50 rounded-xl p-3 text-white placeholder-slate-200 border border-slate-400/30 resize-none focus:ring-2 focus:ring-cyan-500 focus:outline-none backdrop-blur-sm"
                                                                />
                                                                <motion.button
                                                                    onClick={() => {
                                                                        recordResponseTime("Detener", id, setAnswers);
                                                                        handleSendResponseText(id); 
                                                                    }}
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    className="p-3 bg-cyan-600 hover:bg-cyan-700 rounded-xl transition-colors duration-200 text-white flex-shrink-0 shadow-lg"
                                                                    title="Enviar respuesta"
                                                                >
                                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                                                        <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                                                                    </svg>
                                                                </motion.button>
                                                            </div>
                                                        ) : respuesta?.isSubmitted && respuesta?.textoRespuesta ? (
                                                            <p className="text-gray-200 leading-relaxed break-words overflow-wrap-anywhere whitespace-pre-wrap">{respuesta.textoRespuesta}</p>
                                                        ) : (
                                                            <p className="text-gray-400 italic">Esperando respuesta...</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center">
                                                        {isLastQuestion && !respuesta?.isSubmitted ? (
                                                            <div className="flex gap-3 items-center">
                                                                <motion.button
                                                                    onClick={() => handleSendResponseAudio(id)}
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    className={`p-4 rounded-xl transition-colors duration-200 text-white shadow-lg ${
                                                                        recording && currentRecordingQuestionId === id
                                                                            ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                                                                            : 'bg-blue-600 hover:bg-blue-700'
                                                                    }`}
                                                                    title={recording && currentRecordingQuestionId === id ? "Detener grabación" : "Grabar respuesta de audio"}
                                                                >
                                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                                                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                                                        <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2" />
                                                                        <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2" />
                                                                    </svg>
                                                                </motion.button>

                                                                <motion.button
                                                                    onClick={() => handleChangeToTextResponse(id)}
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    className="px-4 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-xl transition-colors duration-200 flex items-center gap-2 shadow-lg"
                                                                    title="Cambiar a respuesta por texto"
                                                                >
                                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                                                    </svg>
                                                                    Usar texto
                                                                </motion.button>
                                                            </div>
                                                        ) : respuesta?.isSubmitted ? (
                                                            <div className="bg-slate-600/50 backdrop-blur-sm rounded-2xl rounded-tr-sm p-4 shadow-lg border border-slate-500/20">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="font-semibold text-white">Tú</span>
                                                                    {respuesta.audioDuration && (
                                                                        <span className="text-xs text-cyan-300 bg-cyan-500/30 px-2 py-1 rounded-full">
                                                                            ⏱️ {formatDuration(respuesta.audioDuration)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-gray-200 leading-relaxed break-words overflow-wrap-anywhere whitespace-pre-wrap">
                                                                    🎤 {respuesta.textoRespuesta === "audio_response" ? "Respuesta de audio enviada" : respuesta.textoRespuesta}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <p className="text-gray-400 italic">Esperando respuesta de audio...</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                                                    {userName ? userName[0].toUpperCase() : '👤'}
                                                </div>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-slate-600/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <p className="text-slate-400">
                                    {loadingQuestions ? "Generando preguntas..." : "Presiona el botón para generar preguntas"}
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Botón para analizar respuestas */}
                {questions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex justify-center mt-6"
                    >
                        <motion.button
                            onClick={handleFinish}
                            disabled={analyzing}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 backdrop-blur-sm hover:shadow-emerald-500/25 flex items-center gap-3 disabled:opacity-50"
                        >
                            {analyzing ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                    />
                                    Analizando respuestas...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Finalizar y Analizar
                                </>
                            )}
                        </motion.button>
                    </motion.div>
                )}

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-8 text-slate-400 text-sm"
                >
                    <p>Universidad Eafit @ TrainerView</p>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default InterviewChat;