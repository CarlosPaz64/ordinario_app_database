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
            res.status(404).send('Usuario no encontrado');
            return;
        }
        // Compara la contraseña ingresada con la contraseña almacenada hasheada
        const passwordMatch = await bcrypt.compare(contrasenia, user.contrasenia_hashed);
        if (!passwordMatch) {
            res.status(401).send('Credenciales inválidas');
            return;
        }
        res.status(200).send(`Bienvenido, ${user.nombre} ${user.apellidos}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al buscar usuario');
    }
}

module.exports = {
    register,
    loginUser
    // Agrega otras funciones aquí según sea necesario
};
