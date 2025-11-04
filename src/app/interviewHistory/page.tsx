"use client"; 
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

function InterviewHistory() {
  
  const [trabajos, setTrabajos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [gotJobs , setGotJobs] = useState(false); 

  const router = useRouter(); 

  async function getJobs() {
    setLoading
    try {
      const res = await fetch("/api/manageHistory/getJobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuario: 1 }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        console.error("Error:", data.error);
        return;
      }
  
      setTrabajos(data.trabajos); 

    } catch (err) {
      console.error("Error al hacer fetch:", err);
    }
    finally {
      setLoading(false);
      setGotJobs(true); 
    }

  }

  useEffect (() => {
    if(gotJobs == false)
      getJobs(); 
    
  })

 if (loading) return <p className="text-gray-500">Cargando trabajos...</p>;

 if (trabajos.length === 0)
  return <p className="text-gray-600">No tienes entrevistas realizadas aún....</p>;



  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
      {trabajos.map((trabajo, index) => (
        <div
          key={index}
          onClick={() => router.push(`/interviewHistory/${encodeURIComponent(trabajo)}`)}
          className="cursor-pointer p-4 bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-transform hover:-translate-y-1 duration-200"
        >
          <h2 className="text-lg font-semibold text-gray-800">{trabajo}</h2>
        </div>
      ))}
    </div>
  );
}

export default InterviewHistory;