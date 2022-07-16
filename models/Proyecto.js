import mongoose from "mongoose";

const proyectosSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
      required: true,
    },
    descripcion: {
      type: String,
      trim: true,
      required: true,
    },
    fechaEntrega: {
      type: Date,
      default: Date.now(),
    },
    cliente: {
      type: String,
      trim: true,
      required: true,
    },
    creador: {
      // Quien coloca nuevas tareas de tipo Usurio, se acceder por medio de ObjectId
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario", //Tal cual se definio en el mongoose.model
    },
    colaboradores: [
      // Array de Usuarios
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario", //Tal cual se definio en el mongoose.model
      },
    ],
  },
  // created_At, updated_At
  { timestamps: true }
);

const Proyecto = mongoose.model( "Proyecto", proyectosSchema );

export default Proyecto