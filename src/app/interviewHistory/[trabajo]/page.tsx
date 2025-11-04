"use client"; 
import Link from "next/link";
import { notFound } from "next/navigation";
import { use ,useEffect, useState } from "react";

interface Props {
    params: Promise<{ trabajo: string }>;
  }
  
  export default function TrabajoPage({ params }: Props) {
    const nombreTrabajo = use(params).trabajo
    const [loading , setloading] = useState<boolean>(true); 
    const [gotInterviews , setGotInterviews] = useState<boolean>(false); 
    interface Interview {
        _id: string;
        fecha: string;
        promedioGeneral: number;
        habilidadesBlandas: number;
        habilidadesTecnicas: number;
        trabajoBajoPresion: number;
        analisis: Record<string, any>;   // 👈 Aquí viene el objeto del análisis
        preguntas: { textoPregunta: string }[];
        respuestas: { textoRespuesta: string }[];
      }

    const [interviews , setInterviews] = useState<Interview[]>([]); 

    if (!nombreTrabajo) return notFound();
    console.log("Estos son los param" , nombreTrabajo); 
    
    async function getInterviews() {
        try {
            const res = await fetch("/api/manageHistory/getInterviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  trabajo: nombreTrabajo,
                  usuario: 1, 
                }),
              });
          
              const data = await res.json();
              setInterviews(data.entrevistas || []);
            

        } catch (error:any){
            console.log(error); 
            
        } finally {
            setloading(false);
            setGotInterviews(true); 
        }
    }

    useEffect (() => {
        if(gotInterviews == false) getInterviews(); 
    })

    if (loading) return <p className="text-gray-500">Cargando trabajos...</p>;


    return (

        <div className="grid gap-4 mt-4">
        {interviews.map((e, index) => (
            <Link
            key={index}
            href={`/interviewHistory/${nombreTrabajo}/${e._id}`}
            target="_blank" // 👉 abre en otra pestaña
            className="block border rounded-lg p-4 shadow hover:bg-gray-100 transition"
            onClick={() => localStorage.setItem("entrevistaDetalle", JSON.stringify(e))}
            >
            <p><b>Fecha:</b> {new Date(e.fecha).toLocaleDateString()}</p>
            <p><b>Promedio general:</b> {e.promedioGeneral}</p>
            <p><b>Habilidades blandas:</b> {e.habilidadesBlandas}</p>
            <p><b>Habilidades técnicas:</b> {e.habilidadesTecnicas}</p>
            <p><b>Trabajo bajo presión:</b> {e.trabajoBajoPresion}</p>
            </Link>
        ))}
        </div>

    );
  }
  