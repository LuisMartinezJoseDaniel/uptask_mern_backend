import express from "express";
// Routing para usuario
const router = express.Router();

import {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil,
} from "../controllers/usuarioController.js";

import checkAuth from "../middleware/checkAuth.js";



// Autenticacion, Registro y Confirmacion de Usuarios

router.post( "/", registrar ); // Nuevo usuario
router.post( "/login", autenticar );
router.get( "/confirmar/:token", confirmar ); //router dinamico confirmar correo

router.post( "/olvide-password", olvidePassword ); // generar nuevo token si el usuario existe por email

// router.get("/olvide-password/:token", comprobarToken);//Ruta para comprobar el token
// router.post("/olvide-password/:token", nuevoPassword);//Ruta para el form de Nuevo passoword
// Es la misma ruta para get y post lo mismo de arriba
router.route( "/olvide-password/:token" ).get( comprobarToken ).post( nuevoPassword );

//* Proteccion de rutas
//* checkAuth -> Middleware para comprobar JWT (que sea valido y exista via headers) -> Luego acceder a perfil
router.get("/perfil", checkAuth, perfil);


export default router