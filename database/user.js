const pool = require('./database');

// Función para registrar un nuevo usuario
async function registerUser(nombre, apellidos, correo, contrasenia_hashed) {
    try {
        const [result, fields] = await pool.query(
            'INSERT INTO users (nombre, apellidos, correo, contrasenia_hashed) VALUES (?, ?, ?, ?)',
            [nombre, apellidos, correo, contrasenia_hashed]
        );
        return result.insertId; // Retorna el ID del nuevo usuario registrado
    } catch (error) {
        throw error; // Lanza el error para manejarlo en el servidor
    }
}

// Función para buscar un usuario por correo electrónico
async function findUserByEmail(correo) {
    try {
        const [result, fields] = await pool.query('SELECT * FROM users WHERE correo = ?', [correo]);
        return result[0]; // Retorna el primer usuario encontrado (si existe)
    } catch (error) {
        throw error; // Lanza el error para manejarlo en el servidor
    }
}

// Otras funciones relacionadas con la autenticación de usuarios

module.exports = {
    registerUser,
    findUserByEmail
    // Agrega otras funciones aquí según sea necesario
};
