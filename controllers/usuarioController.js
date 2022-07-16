import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js";

// req.body -> Solo para formulario
// req.params -> extraer datos de la URL

const registrar = async (req, res) => {
  // Evitar registros duplicados
  const { email } = req.body;
  // Buscar un usuario por email
  const existeUsuario = await Usuario.findOne({ email });

  if (existeUsuario) {
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({ msg: error.message });//Esto se muestra en el FRONT
  }

  try {
    // Crear un objeto y se le pasa los valores del formulario
    const usuario = new Usuario(req.body);
    // Generar token Unico para confirmar la cuenta
    usuario.token = generarId();
    // save() -> Guardarlo o modificarlo -> pasa por el middleware pre('save') para el hash del password
    await usuario.save();
    // Enviar el email de confirmacion
    emailRegistro( {
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token
    } );

    
    res.json( {
      msg: "Usuario creado correctamente, Revista tu email para confirmar tu cuenta",
    }); //Enviar respuesta en json al front
  } catch (error) {
    console.log(error);
  }
};

//* Formulario de Inicio Sesion
const autenticar = async (req, res) => {
  // Comprobar si el usuario existe POSTMAN-> ENVIAR COMO JSON y seleccionar raw
  const { email, password } = req.body;

  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    // Notificar al usuario que no existe el correo
    const error = new Error("El usuario no existe");
    res.status(404).json({ msg: error.message });
  }
  //* Comprobar si el el correo esta confirmado
  if (!usuario.confirmado) {
    //! Notificar al usuario que no ha confirmado su cuenta
    const error = new Error("Tu cuenta no ha sido confirmada");
    res.status(403).json({ msg: error.message }); // 403-> Forbiden -> Solicitud rechazada
  }
  //* Comprobar el password
  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id), //* Este token es para mantener la sesion VIVA, en caso de cambiar de password se reestablece
    });
  } else {
    const error = new Error("El password es incorrecto");
    res.status(403).json({ msg: error.message });
  }
};

// router.get("/confirmar/:token", confirmar);
const confirmar = async (req, res) => {
  // express genera la variable dinamica :token-> token
  const { token } = req.params;
  const usuarioConfirmar = await Usuario.findOne({ token });

  if (!usuarioConfirmar) {
    const error = new Error( "Token no válido" );
    // Al hacer la peticion mediante axios, se retorna el msg
    return res.status(403).json({ msg: error.message });
  }
  try {
    // Si el token existe cambiar el usuario a confirmado
    usuarioConfirmar.confirmado = true;
    usuarioConfirmar.token = ""; //El token es de un solo uso, al confirmar se elimina
    await usuarioConfirmar.save(); // Actualizar el usuario
    return res.json({ msg: "Usuario confirmado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

//* Esto se ejecuta cuando el usuario ingrese su email en un input
const olvidePassword = async (req, res) => {
  const { email } = req.body;
  //* Buscar un usuario por email
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    // Notificar al usuario que no existe el correo
    const error = new Error("El usuario no existe");
    res.status(404).json({ msg: error.message });
  }
  try {
    // Generar un nuevo token
    usuario.token = generarId();
    await usuario.save(); // Actualizar el usuario
    
    //* Enviar el email
    emailOlvidePassword({
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token,
    });
    
    res.json( { msg: "Hemos enviado un email con las instrucciones" } );
  } catch (error) {
    console.log(error);
  }
};

// Solamente para comprobar el token para mostrar el form de cambiar password
const comprobarToken = async (req, res) => {
  const { token } = req.params; // Extraer token de la URL
  // Buscar un usuario por token
  const tokenValido = await Usuario.findOne({ token });
  if (!tokenValido) {
    // Notificar al usuario que no existe el correo
    const error = new Error("Token no válido");
    res.status(404).json({ msg: error.message });
  } else {
    res.json({ msg: "Token valido y el Usuario existe" });
  }
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  // Buscar un usuario por token
  const usuario = await Usuario.findOne({ token });

  if (!usuario) {
    // Notificar al usuario que el token no es valido
    const error = new Error("Token no válido");
    res.status(404).json({ msg: error.message });
  } else {
    try {
      usuario.password = password; // Reestablecer el password
      usuario.token = ""; // Eliminar el token ya que se reestablecio el password
      await usuario.save(); // Volver a hashear el password

      res.json({ msg: "Password modificado correctamente" });
    } catch (error) {
      console.log(error);
    }
  }
};

// Pasar por checkAuth, mediante el JWT se accede a perfil
const perfil = async (req, res) => {
  const { usuario } = req; // Sesion creada del middleware de checkAuth
  res.json(usuario);
};

export {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil,
};
