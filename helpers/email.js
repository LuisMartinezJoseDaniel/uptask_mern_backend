import nodemailer from "nodemailer";

export const emailRegistro = async ({ nombre, email, token }) => {
  // Informacion del cliente de mailtrap en variables de entorno

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  } );
  
  // Informacion del Email
  const info = await transport.sendMail({
    from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
    to: email, // Hacia que correo enviar
    subject: "UpTask - Comprueba tu cuenta", // Asunto
    text: "Comprueba tu cuenta en UpTask",
    html: `<p>Hola: ${nombre} Comprueba tu cuenta en UpTask </p>
      <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:</p>
      <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar mi cuenta</a>
      <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
      `,
  });
};

export const emailOlvidePassword = async ({ nombre, email, token }) => {
  // Informacion del cliente de mailtrap

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  // Informacion del Email
  await transport.sendMail({
    from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
    to: email, // Hacia que correo enviar
    subject: "UpTask - Restablece tu password", // Asunto
    text: "Restablece tu password",
    html: `<p>Hola: ${nombre} has solicitado reestablecer tu password </p>
      <p>Sigue el siguiente enlace para generar un nuevo password:</p>
      <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>
      <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>
      `,
  });
};
