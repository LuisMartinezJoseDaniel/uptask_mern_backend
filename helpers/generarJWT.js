import jwt from "jsonwebtoken";

// JWT -> NO ALMACENAR PASSWORD O METODOS DE PAGO
const generarJWT = (id) => {
  // (DATA, PALABRA SECRETA DE ENV (Para firmar el token), OPCIONES)
  // Generar un JWT por medio del ID
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    //Vigencia del token, dependiendo de que tan sensible sea la info, se coloca el tiempo (30d-> 30 dias)
    expiresIn: "30d",
  });
}

export default generarJWT