const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

async function register(req, res) {
    const { nombre, apellidos, correo, contrasenia } = req.body;
    try {
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(contrasenia, 10); // El segundo argumento es el número de rondas de encriptación

        // Registra el usuario con la contraseña hasheada
        const userId = await userModel.registerUser(nombre, apellidos, correo, hashedPassword);
        console.log("Usuario registrado: ", userId);
        
        // Redirige al usuario al login después del registro exitoso
        res.redirect('/login');
    } catch (error) {
        console.error(error);
         // Renderiza la página de registro con un mensaje de error
         res.render('register', { error: 'Error al registrar usuario. Inténtalo de nuevo.' });
    }
}


async function loginUser(req, res) {
    const { correo, contrasenia } = req.body;
    try {
        const user = await userModel.findUserByEmail(correo);
        if (!user) {
            console.log('Usuario no encontrado');
            return res.render('login', { error: 'Error al encontrar al usuario. Inténtalo de nuevo.' });
        }
        const passwordMatch = await bcrypt.compare(contrasenia, user.contrasenia_hashed);
        if (!passwordMatch) {
            console.log('Contraseña incorrecta');
            return res.render('login', { error: 'Error al encontrar al usuario. Inténtalo de nuevo.' });
        }
        req.session.userId = user.id;
        console.log('Usuario autenticado:', user.id);
        res.redirect('/');
    } catch (error) {
        console.error('Error durante el proceso de inicio de sesión:', error);
        res.render('login', { error: 'Error al encontrar al usuario. Inténtalo de nuevo.' });
    }
}



function logoutUser(req, res) {
    req.session.destroy((err) => {
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
