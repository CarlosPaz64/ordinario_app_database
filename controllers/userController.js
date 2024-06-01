const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

// Utilidad para enviar una respuesta JSON exitosa
function sendSuccessResponse(res, data) {
    res.status(200).json(data);
}

// Utilidad para enviar una respuesta de error
function sendErrorResponse(res, statusCode, message) {
    res.status(statusCode).json({ error: message });
}

// Utilidad para manejar errores internos del servidor
function handleServerError(res, error) {
    console.error('Error:', error);
    sendErrorResponse(res, 500, 'Error interno del servidor');
}

async function register(req, res) {
    const { nombre, apellidos, correo, contrasenia } = req.body;
    try {
        // Registra el usuario con la contraseña hasheada
        const userId = await userModel.registerUser(nombre, apellidos, correo, contrasenia);
        console.log("Usuario registrado: ", userId);
        
        // Redirige al usuario al login después del registro exitoso
        res.redirect('/usuarios/login');
    } catch (error) {
        console.error(error);
        // Renderiza la página de registro con un mensaje de error
        res.render('register', { error: 'Error al registrar usuario. Inténtalo de nuevo.' });
    }
}

async function loginUser(req, res) {
    const { correo, contrasenia } = req.body;
    console.log('Este es el cuerpo de la solicitud: ', req.body);

    // Verifica si se proporcionaron correo y contraseña
    if (!correo || !contrasenia) {
        return res.render('login', { error: 'Correo y contraseña son requeridos.' });
    }

    try {
        // Intenta encontrar al usuario por correo electrónico
        const usuario = await userModel.findUserByEmail(correo, contrasenia);

        // Si el usuario se encontró, establece la sesión del usuario y redirige a la página de inicio
        if (usuario) {
            req.session.userId = usuario.id;
            return res.redirect('/');
        } else {
            // Si no se encontró el usuario, muestra un mensaje de error
            return res.render('login', { error: 'Usuario no encontrado o contraseña incorrecta.' });
        }
    } catch (error) {
        console.error('Error durante el proceso de inicio de sesión:', error);
        res.render('login', { error: 'Error al iniciar sesión. Inténtalo de nuevo.' });
    }
}


function logoutUser(req, res) {
    req.session.destroy((err) => {
        console.log("Se va a destruir la sesión");
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/login');
    });
}

module.exports = {
    register,
    loginUser,
    logoutUser
    // Agrega otras funciones aquí según sea necesario
};
