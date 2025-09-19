"use client";
import { useState, useRef } from "react";

export default function AudioTestPage() {
  const [recording, setRecording] = useState(false);
  const [text, setText] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null); //This is the reference to the MediaRecorder object. In charge of getting the audio. Use ref is used saving data between renders
  const chunksRef = useRef<BlobPart[]>([]); //Here are saved the little chunks of audio until we pause.


  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); //Ask for permission to use the microphone
    const mediaRecorder = new MediaRecorder(stream); //Creates a media recorder

    chunksRef.current = []; //Empty the chunks

    mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data); //When the media recorder gets audio data, we save then into the array

    mediaRecorder.onstop = async () => {
      //Get all the chunks together and save as a .wav file
      const blob = new Blob(chunksRef.current, { type: "audio/wav" }); 
      const file = new File([blob], "grabacion.wav", { type: "audio/wav" }); 

      //Send the file to the backend
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/speechToText", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setText(data.text);
    };


    mediaRecorder.start(); //Starts recording
    mediaRecorderRef.current = mediaRecorder; //sets the reference
    setRecording(true); //Sets the state
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop(); //Stop the current recording which activates the backend flow
    setRecording(false); //Set state to false
  };

  return (
    <div className="p-6">
      <button
        onClick={recording ? stopRecording : startRecording}
        className="p-3 bg-blue-600 text-white rounded-lg"
      >
        {recording ? "Detener grabación" : "Iniciar grabación"}
      </button>

      {text && (
        <div className="mt-4 p-3 border rounded bg-gray-100">
          <h2 className="font-bold">Transcripción:</h2>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
}
