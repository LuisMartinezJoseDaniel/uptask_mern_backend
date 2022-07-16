import mongoose from "mongoose";
import bcrypt from "bcrypt";

const usuarioSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true, //Eliminar espacios de inicio y final
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    token: {
      type: String,
    },
    // Confirmar correo
    confirmado: {
      type: Boolean,
      default: false,
    },
  },
  {
    // Crea dos columnas: creado y actualizado
    timestamps: true,
  }
);
// Mongoose- pre -> middleware antes de guardar a la base de datos
usuarioSchema.pre( 'save', async function ( next ) {
  // isModified -> revisa si el campo ha cambiado
  // !isModified -> Si el password ya esta hasheado
  if ( !this.isModified( 'password' ) ) {
    next(); // No ejecutes el hash en las lineas siguientes, salta al siguiente middleware
  }
  // Si no esta hasheado entonces generar un nuevo salt
  // Hasheo de 10 rondas
  const salt = await bcrypt.genSalt( 10 );
  // Generar hash
  this.password = await bcrypt.hash(this.password, salt);

} );

//Registrar metodos a usuarioSchema
usuarioSchema.methods.comprobarPassword = async function ( passwordFormulario ) {
  // Comprobar password que el usuario escribio con el que password hasheado
  return await bcrypt.compare(passwordFormulario, this.password);
}

// Crear Modelo
const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;