import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";

const agregarTarea = async (req, res) => {
  const { proyecto } = req.body;
  try {
    const existeProyecto = await Proyecto.findById(proyecto);
    if (!existeProyecto) {
      const error = new Error("El proyecto no existe");
      return res.status(404).json({ msg: error.message });
    }
    const creador = existeProyecto.creador.toString();
    const usuario = req.usuario._id.toString();

    if (creador !== usuario) {
      const error = new Error("No tienes los permisos para añadir tareas");
      return res.status(401).json({ msg: error.message });
    }
    // Almacenar la tarea
    try {
      // Segunda forma de almacenar con moongoose
      const tareaAlmacenada = await Tarea.create(req.body);

      return res.json(tareaAlmacenada);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};
const obtenerTarea = async (req, res) => {
  const { id } = req.params;

  // Inner Join en mongo-> extraer todo el proyecto(todos los campos) con pupulate con la propiedad a la cual se relacionan
  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  const { creador } = tarea.proyecto;
  // Pendiente colaboradores
  if (creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Accion no válida");
    return res.status(403).json({ msg: error.message });
  }

  res.json(tarea);
};
const actualizarTarea = async (req, res) => {
  const { id } = req.params;

  // Inner Join en mongo-> extraer todo el proyecto(todos los campos) con pupulate con la propiedad a la cual se relacionan
  const tarea = await Tarea.findById(id).populate("proyecto");
  
  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  const { creador } = tarea.proyecto;

  if (creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Accion no válida");
    return res.status(403).json({ msg: error.message });
  }
  // Actualizar campos
  tarea.nombre = req.body.nombre || tarea.nombre;
  tarea.descripcion = req.body.descripcion || tarea.descripcion;
  tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;
  tarea.prioridad = req.body.prioridad || tarea.prioridad;
  // tarea.estado = req.body.estado || tarea.estado;

  try {
    const tareaAlmacenada = await tarea.save();
    res.json(tareaAlmacenada);
  } catch (error) {
    console.log(error);
  }
};
const eliminarTarea = async (req, res) => {
  const { id } = req.params;

  // Inner Join en mongo-> extraer todo el proyecto(todos los campos) con pupulate con la propiedad a la cual se relacionan
  const tarea = await Tarea.findById(id).populate("proyecto");
  
  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  const { creador } = tarea.proyecto;

  if (creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Accion no válida");
    return res.status(403).json({ msg: error.message });
  }

  try {
    // await Tarea.deleteOne( tarea ); //Primera forma
    await tarea.deleteOne(); // Segunda forma
    res.json({ msg: "Proyecto eliminado" });
  } catch (error) {
    console.log(error)
  }

};
const cambiarEstadoTarea = async (req, res) => {};

export {
  agregarTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstadoTarea,
};
