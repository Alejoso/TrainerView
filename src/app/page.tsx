"use client" // It has to be due to it is proccess by the server 
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

function HomePage () {

  const [formData , SetFormData] = useState({
    userName: '',
    userJob: '',
  }); 

  const router = useRouter(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        
    const {name , value} = e.target;

    SetFormData((prev) => ({
      ...prev , [name]: value,
    })); 
    
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    
    e.preventDefault(); 
    //LLamada a la api

    if(formData.userJob.trim() === "" || formData.userName.trim() === "") {
      toast.error("Debes de llenar todos los campos")

    } else {
      localStorage.setItem("userName", formData.userName.trim());
      localStorage.setItem("userJob" , formData.userJob.trim());
  
      router.push("/habilities")
    }
  }; 


  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <Toaster/>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-96"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl font-bold text-center text-white mb-6"
        >
          TrainerView
        </motion.h1>

        <motion.form
          onSubmit={onSubmit}
          className="flex flex-col gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15, // animación escalonada de inputs/botón
              },
            },
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="flex flex-col"
          >
            <label htmlFor="userName" className="text-sm text-gray-200 mb-1">
              Nombre
            </label>
            <input
              id="userName"
              type="text"
              placeholder="Alejito pingo"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="flex flex-col"
          >
            <label htmlFor="userJob" className="text-sm text-gray-200 mb-1">
              Trabajo soñado
            </label> 
            <input
              id="userJob"
              type="text"
              placeholder="Ingeniero de cable inalámbrico"
              name="userJob"
              value={formData.userJob}
              onChange={handleChange}
              className="px-4 py-2 rounded-lg bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>

          <motion.button
            type="submit"
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1 },
            }}
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(59,130,246,0.7)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-lg transition-all duration-300"
          >
            Enviar
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  )
}
export default HomePage 