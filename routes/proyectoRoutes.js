import express from "express";

import {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  agregarColaborador,
  eliminarColaborador,
  
} from "../controllers/proyectoController.js";

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

// El usuario debe estar autenticado 
router
  .route("/")
  .get(checkAuth, obtenerProyectos) // Listar proyectos despuesde autenticar
  .post(checkAuth, nuevoProyecto); // Crear un nuevo proyecto

// CRUD DE UN PROYECTO
router
  .route("/:id")
  .get(checkAuth, obtenerProyecto)  // Show del proyecto y listado de tareas
  .put( checkAuth, editarProyecto )  // On Update, editar el proyecto
  .delete ( checkAuth, eliminarProyecto );


router.post( "/agregar-colaborador/:id", checkAuth, agregarColaborador );
router.post( "/eliminar-colaborador", checkAuth, eliminarColaborador ); // Ya que solo se eliminara un colaborador y no a todos
export default router;
