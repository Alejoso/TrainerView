"use client"; 
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";


function interviewAnalysis()
{

    const [analisis , SetAnalisis] = useState<any>(null); 
    
    useEffect(() => {
        const analisis = JSON.parse(localStorage.getItem("analisis") || "{}");
        SetAnalisis(analisis); 
    }, []);

    console.log(analisis); 

    return (
        <div className="h-screen flex justify-center items-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        </div>
    )
}
export default interviewAnalysis; 