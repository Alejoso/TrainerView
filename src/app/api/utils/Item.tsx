import mongoose from 'mongoose';


const entrevistaSchema = new mongoose.Schema({
  usuario: Number,
  trabajo: String,
  fecha: Date,
  habilidadesBlandas: Number,
  trabajoBajoPresion: Number,
  habilidadesTecnicas: Number,
  promedioGeneral: Number, 
  analisis: [
    {
      Categoria: String,
      puntuaciónGeneral: Number,
      DetalleFeedback: String,
    },
  ],
  preguntas: [
    {
      id: Number,
      categoria: String,
      textoPregunta: String,
    },
  ],
  respuestas: [
    {
      id: Number,
      categoria: String,
      textoRespuesta: String,
    },
  ],
});

const Entrevista =
  mongoose.models.Entrevista ||
  mongoose.model("Entrevista", entrevistaSchema, "Entrevistas");

export default Entrevista; 

