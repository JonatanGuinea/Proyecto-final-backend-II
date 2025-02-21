
import nodemailer from 'nodemailer';
import config from './config.js';

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.GMAIL_APP_USER,
        pass: config.GMAIL_APP_PASS
    }
})

export const notifySuccessRegistration = async (to) => {
    return await transport.sendMail({
        from: `ProyectoFinal Jonatan Guinea <${config.GMAIL_APP_USER}>`,
        to: to,
        subject: 'Registro exitoso!',
        html: `
            <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¡Bienvenido!</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color:rgb(68, 50, 50);
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            background: #fff;
            margin: 20px auto;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .logo {
            width: 120px;
        }
        h1 {
            color: #333;
        }
        p {
            color: #555;
            font-size: 16px;
        }
        .button {
            display: inline-block;
            background: #007bff;
            color: #fff;
            padding: 12px 20px;
            text-decoration: none;
            font-size: 16px;
            border-radius: 5px;
            margin-top: 15px;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="https://example.com/logo.png" alt="Logo" class="logo">
        <h1>¡Bienvenido a nuestra comunidad!</h1>
        <p>Hola, estamos encantados de tenerte con nosotros. Ahora formas parte de una comunidad increíble donde recibirás las mejores ofertas y novedades.</p>
        <p>Haz clic en el botón de abajo para explorar más:</p>
        <a href="https://example.com" class="button">Explorar</a>
        <p class="footer">Este email es solo un simulacro.</p>
    </div>
</body>
</html>

        `});
}
