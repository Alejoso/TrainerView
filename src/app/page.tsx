"use client" // It has to be due to it is proccess by the server 
import React from "react";
import { useState } from "react";
function HomePage () {
  const [prompt , setPrompt] = useState ('') //It starts empty 
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => { // So now it understand e is a event 
    e.preventDefault() 
    console.log(prompt)
    const response = await fetch("/api/gpt", {
      method: 'POST',
      headers : {
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({prompt})
    })
    const data = await response.json()
    console.log(data)
  }
  return (
    <div className='bg-zinc-950 h-screen flex justify-center items-center'>
      <form onSubmit={onSubmit}>
        <input type="text" 
          className="p-2 block bg-neutral-700 text-white w-full rounded-md "
          placeholder="Ingresa un prompt"
          onChange={ e => setPrompt(e.target.value)}
        />
        <button className="bg-green-500 p-2 rounded-md block mt-2 text-white">
          Generate
        </button>
      </form>
    </div>
  )
}
export default HomePage 