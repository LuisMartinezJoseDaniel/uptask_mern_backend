import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";
import Usuario from "../models/Usuario.js";

// Listar todos los proyectos del usuario autenticado
const obtenerProyectos = async (req, res) => {
  // Filtrar proyectos por el usuario que ha iniciado sesion
  const proyectos = await Proyecto.find().where("creador").equals(req.usuario);

  res.json(proyectos);
};

const nuevoProyecto = async (req, res) => {
  // Instanciar el proyecto con la informacion del request
  const proyecto = new Proyecto( req.body );
  //*req.usuario -> Proviene del middleware de checkauth
  proyecto.creador = req.usuario._id; //De la sesion extraer el usuario

  try {
    const proyectoAlmacendo = await proyecto.save(); // guardar el proyecto
    res.json(proyectoAlmacendo); // Regresar al usuario la respuesta
  } catch (error) {
    console.log(error);
  }
};

// Listar un proyecto y sus tareas /api/proyectos/:id
const obtenerProyecto = async (req, res) => {
  const { id } = req.params; // Extrar el id del proyecto
  try {
    // Al treaer de la base de datos el objeto se vuelve inmutable
    const proyecto = await Proyecto.findById(id); // buscar por id en la base de datos
    if (!proyecto) {
      const error = new Error("Proyecto no encontrado");
      return res.status(404).json({ msg: error.message });
    }
    const creador = proyecto.creador.toString();
    const usuario = req.usuario._id.toString();

    // Faltan colaboradores
    // Verificar si el creador del proyecto es quien ha iniciado sesion
    // Asegurar que aunque se tenga el id del proyecto, sea el usuario que inicio sesion el creador del mismo o colaborador
    if (creador !== usuario) {
      const error = new Error("Acción no válida");
      return res.status(404).json({ msg: error.message });
    }

    // Obtener las tareas de un proyecto EVITAR UN SEGUNDO LLAMADO CON LA FUNCIONDE OBTENER TAREAS
    const tareas = await Tarea.find().where("proyecto").equals(proyecto._id);
    // Proyecto es un objeto inmutable, sin embargo, podemos enviarlo directamente en la respuesta
    return res.json({
      proyecto,
      tareas,
    });
  } catch (error) {
    const { message } = new Error("El id del proyecto no es válido");
    return res.status(404).json({ msg: message });
  }
};

const editarProyecto = async (req, res) => {
  const { id } = req.params; // Extrar el id del proyecto

  try {
    const proyecto = await Proyecto.findById(id); // buscar por id en la base de datos
    if (!proyecto) {
      const error = new Error("Proyecto no encontrado");
      return res.status(404).json({ msg: error.message });
    }
    const creador = proyecto.creador.toString();
    const usuario = req.usuario._id.toString();
    // Verificar si el creador del proyecto es quien ha iniciado sesion
    // Asegurar que aunque se tenga el id del proyecto, sea el usuario que inicio sesion el creador del mismo o colaborador
    if (creador !== usuario) {
      const error = new Error("Acción no válida");
      return res.status(404).json({ msg: error.message });
    }

    // Extraer los elementos del formulario para actualizarlos
    const { nombre, descripcion, fechaEntrega, cliente } = req.body; // Extraer los campos actualizados

    proyecto.nombre = nombre || proyecto.nombre; // Actualizar la propiedad si existe
    proyecto.descripcion = descripcion || proyecto.descripcion; // Actualizar la propiedad si existe
    proyecto.fechaEntrega = fechaEntrega || proyecto.fechaEntrega; // Actualizar la propiedad si existe
    proyecto.cliente = cliente || proyecto.cliente; //  Actualizar la propiedad si existe

    try {
      const proyectoActualizado = await proyecto.save();
      res.json(proyectoActualizado);
    } catch (error) {
      console.log(error);
    }

    return res.json(proyecto);
  } catch (error) {
    const { message } = new Error("El id del proyecto no es válido");
    return res.status(404).json({ msg: message });
  }
};

const eliminarProyecto = async (req, res) => {
  const { id } = req.params; // Extrar el id del proyecto
  try {
    const proyecto = await Proyecto.findById(id); // buscar por id en la base de datos
    if (!proyecto) {
      const error = new Error("Proyecto no encontrado");
      return res.status(404).json({ msg: error.message });
    }
    const creador = proyecto.creador.toString();
    const usuario = req.usuario._id.toString();
    // Verificar si el creador del proyecto es quien ha iniciado sesion
    // Asegurar que aunque se tenga el id del proyecto, sea el usuario que inicio sesion el creador del mismo o colaborador
    if (creador !== usuario) {
      const error = new Error("Acción no válida");
      return res.status(404).json({ msg: error.message });
    }
    try {
      await proyecto.deleteOne();
      res.json({ msg: "Proyecto eliminado" });
    } catch (error) {
      console.log(error);
    }

    return res.json(proyecto);
  } catch (error) {
    const { message } = new Error("El id del proyecto no es válido");
    return res.status(404).json({ msg: message });
  }
};

const agregarColaborador = async (req, res) => {};

const eliminarColaborador = async (req, res) => {};


export {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  agregarColaborador,
  eliminarColaborador,
  
};
