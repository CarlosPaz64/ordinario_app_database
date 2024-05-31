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
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(contrasenia, 10); // El segundo argumento es el número de rondas de encriptación

        // Registra el usuario con la contraseña hasheada
        const userId = await userModel.registerUser(nombre, apellidos, correo, hashedPassword);
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

    // Verifica si se proporcionaron correo y contraseña
    if (!correo || !contrasenia) {
        return res.render('login', { error: 'Correo y contraseña son requeridos.' });
    }

    try {
        const user = await userModel.findUserByEmail(correo);
        console.log("Usuario: ", user);

        // Verifica si se encontró al usuario
        if (!user) {
            return res.render('login', { error: 'Usuario no encontrado.' });
        }

        // Compara las contraseñas
        const passwordMatch = await bcrypt.compare(contrasenia, user.contrasenia_hashed);
        console.log("Contraseña: ", passwordMatch);

        // Verifica si la contraseña coincide
        if (!passwordMatch) {
            console.log('Contraseña incorrecta');
            return res.render('login', { error: 'Contraseña incorrecta.' });
        }

        // Establece la sesión del usuario
        req.session.userId = user.id;
        console.log("Este es el usuario: ", req.session.userId);

        // Genera y establece el token JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log("El token de este usuario será: ", token);
        res.cookie('jwt', token, { httpOnly: true, secure: false });

        // Redirige al usuario a la página de inicio
        res.redirect('/');
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
