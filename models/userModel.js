const axios = require('axios');
const dotenv = require('dotenv');

// Configura DotEnv
dotenv.config();

class Usuario {
    constructor(id, nombre, apellidos, correo, contrasenia) {
        this.id = id;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.correo = correo;
        this.contrasenia = contrasenia;
    }
}

// Función para registrar un nuevo usuario
async function registerUser(nombre, apellidos, correo, contrasenia) {

    try {
        const response = await axios.post(`${process.env.BASE_URL}/usuarios/register`, {
            nombre,
            apellidos,
            correo,
            contrasenia
        },);

        return response.data.id; // Retorna el ID del nuevo usuario registrado
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        throw error; // Lanza el error para manejarlo en el servidor
    }
}

// Función para buscar un usuario por correo electrónico
async function findUserByEmail(correo, contrasenia) {
    try {
        const response = await axios.post(`${process.env.BASE_URL}/usuarios/login`, { correo, contrasenia });
        const userData = response.data;
        return new Usuario(userData.id, userData.nombre, userData.apellidos, userData.correo, userData.contrasenia_hashed);
    } catch (error) {
        console.error('Error al buscar usuario por correo electrónico:', error);
        throw error; // Lanza el error para manejarlo en el servidor
    }
}


// Función para buscar un usuario por su ID
async function findUserById(userId) {
    try {
        // Realiza una solicitud GET al backend para obtener los datos del usuario por su ID
        const response = await axios.get(`${process.env.BASE_URL}/usuarios/${userId}`);
        
        // Verifica si la respuesta tiene datos y devuelve los datos del usuario si los hay
        if (response && response.data) {
            const userData = response.data;
            // Aquí puedes devolver los datos del usuario de la forma adecuada
            // Por ejemplo, podrías devolver un objeto con las propiedades del usuario
            return {
                id: userData.id,
                nombre: userData.nombre,
                apellidos: userData.apellidos,
                correo: userData.correo
            };
        } else {
            // Si la respuesta no tiene datos, lanza una excepción indicando que no se encontró el usuario
            throw new Error('Usuario no encontrado');
        }
    } catch (error) {
        // Maneja cualquier error que pueda ocurrir durante la solicitud GET
        console.error('Error al buscar usuario por ID:', error);
        // Lanza el error para manejarlo en el servidor
        throw error;
    }
}

module.exports = {
    registerUser,
    findUserByEmail,
    findUserById
};
