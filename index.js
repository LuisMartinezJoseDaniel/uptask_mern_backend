import express from "express"; // Habilitar en el JSON como "TYPE Module"
import dotenv from "dotenv";
import cors from "cors";
// Para archivos externos es necesario el .js
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";


const app = express();
app.use( express.json() ); // sustituye a body-parser

dotenv.config(); // Variables de entorno

conectarDB();

//Configurar CORS
//Aceptar conexiones del front end utilizando un whiteList para conectarse a la BD
const whiteList = [process.env.FRONTEND_URL]; 
const corsOptions = {
  // origin-> origen de la peticion frontEnd (URL)
  // callback -> Enviar errores
  origin: function ( origin, callback ) {
    // Si el origin pertenece a la lista blanca se consultar la API
    if ( whiteList.includes( origin ) ) {
      // Consultar la API
      // null-> no hay mensaje de error, true-> permitir el acceso
      callback( null, true );
    } else {
      // No esta permitido
      callback(new Error('Error de CORS'))
    }
  }
}

app.use( cors( corsOptions ) );

// Routing
// Use -> Soporta a todos los verbos POST, GET, PUT, PATCH, DELETE
app.use( "/api/usuarios", usuarioRoutes );

app.use( "/api/proyectos", proyectoRoutes );

app.use( "/api/tareas",  tareaRoutes );

// Se crea en el servidor de produccion automaticamente en caso de no existir se usa en local
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
  