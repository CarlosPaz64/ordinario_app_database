const axios = require('axios');
const dotenv = require('dotenv');

// Configura DotEnv
dotenv.config();

class Usuario {
    constructor(id, nombre, apellidos, correo) {
        this.id = id;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.correo = correo;
    }
}

// Función para registrar un nuevo usuario
async function registerUser(nombre, apellidos, correo, contrasenia_hashed, token) {
    const axiosConfig = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const response = await axios.post(`${process.env.BASE_URL}/usuarios/register`, {
            nombre,
            apellidos,
            correo,
            contrasenia_hashed
        }, axiosConfig);

        return response.data.id; // Retorna el ID del nuevo usuario registrado
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        throw error; // Lanza el error para manejarlo en el servidor
    }
}

// Función para buscar un usuario por correo electrónico
async function findUserByEmail(correo, token) {
    const axiosConfig = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const response = await axios.get(`${process.env.BASE_URL}/usuarios/login`, axiosConfig);
        const userData = response.data;
        return new Usuario(userData.id, userData.nombre, userData.apellidos, userData.correo);
    } catch (error) {
        console.error('Error al buscar usuario por correo electrónico:', error);
        throw error; // Lanza el error para manejarlo en el servidor
    }
}

// Función para buscar un usuario por su ID
async function findUserById(userId, token) {
    const axiosConfig = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const response = await axios.get(`${process.env.BASE_URL}/usuarios/${userId}`, axiosConfig);
        const userData = response.data;
        return new Usuario(userData.id, userData.nombre, userData.apellidos, userData.correo);
    } catch (error) {
        console.error('Error al buscar usuario por ID:', error);
        throw error; // Lanza el error para manejarlo en el servidor
    }
}

module.exports = {
    registerUser,
    findUserByEmail,
    findUserById
};
