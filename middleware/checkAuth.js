import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

// next -> permite ir al siguiente middleware, si no se usa, se queda en este middleware y no pasa a perfil

const checkAuth = async ( req, res, next ) => {
  // En los headers se envia el JWT || undefined
  //* Se extraer desde el front con axios, mandando la config-> clienteAxios(url, datos, config)
  const autorizacion = req.headers.authorization;
  let token;

  //* Si existe la autorizacion, Bearer-> convencion para enviar tokens (POSTMAN)
  if (autorizacion && autorizacion.startsWith("Bearer")) {

    try {
      token = autorizacion.split(" ")[1]; //* Obtener token ['bearer', token]

      // Verificar que el token sea valido como JWT
      // Retorna el payload o la data, con el id del usuario fecha que se presento, fecha de expiracion
      const decoded = jwt.verify( token, process.env.JWT_SECRET );  
      
      // 1. Buscar el usuario en la base de datos
      // 2. Crear una sesion para el usuario en el request sin los campos con el "-"
      req.usuario = await Usuario.findById(decoded.id).select(
        "-password -token -confirmado -createdAt -updatedAt -__v"
      );

      return next(); // Ir al siguiente middleware
    } catch (error) {
      // En caso de que el token haya expirado o no sea un JWT valido
      console.log(error);
      return res.status(404).json({ msg: "Hubo un error" });
    }
  }
  // En caso de no enviar JWT de sesion
  if (!token) {
    const error = new Error("Token no válido");
    // 401 -> Unauthorized
    return res.status(401).json({ msg: error.message });
  }

  next(); // Ve al siguiente middleware
};

export default checkAuth;
