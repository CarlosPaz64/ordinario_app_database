const axios = require('axios');
const dotenv = require('dotenv');

// Configura DotEnv
dotenv.config();

class Tarea {
    constructor(id, descripcion, estatus, fecha_finalizacion, importancia, id_usuario) {
        this.id = id;
        this.descripcion = descripcion;
        this.estatus = estatus;
        this.fecha_finalizacion = fecha_finalizacion;
        this.importancia = importancia;
        this.id_usuario = id_usuario;
    }
}

// Función para crear una nueva tarea
async function createTask(descripcion, estatus, fecha_finalizacion, importancia, id_usuario, token) {
    const axiosConfig = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const response = await axios.post(`${process.env.BASE_URL}/tasks/create-task`, {
            descripcion,
            estatus,
            fecha_finalizacion,
            importancia,
            id_usuario
        }, axiosConfig);

        return response.data.id; // Retorna el ID de la nueva tarea creada
    } catch (error) {
        console.error('Error al crear tarea:', error);
        throw error; // Lanza el error para manejarlo en la ruta
    }
}

// Función para obtener las tareas por usuario
async function getTasksByUserId(id_usuario, token) {
    const axiosConfig = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const response = await axios.get(`${process.env.BASE_URL}/tasks/user/${id_usuario}`, axiosConfig);
        return response.data.map(task => new Tarea(
            task.id,
            task.descripcion,
            task.estatus,
            task.fecha_finalizacion,
            task.importancia,
            task.id_usuario
        ));
    } catch (error) {
        console.error('Error al obtener tareas por usuario:', error);
        throw error; // Lanza el error para manejarlo en la ruta
    }
}

// Función para actualizar una tarea
async function updateTask(id, descripcion, estatus, fecha_finalizacion, importancia, token) {
    const axiosConfig = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        await axios.post(`${process.env.BASE_URL}/tasks/update-task/${id}`, {
            descripcion,
            estatus,
            fecha_finalizacion,
            importancia
        }, axiosConfig);

        return true; // Retorna true si la actualización fue exitosa
    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        throw error; // Lanza el error para manejarlo en el servidor
    }
}

// Función para obtener una tarea por su ID
async function getTaskById(id, token) {
    const axiosConfig = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const response = await axios.get(`${process.env.BASE_URL}/tasks/${id}`, axiosConfig);
        const task = response.data;
        return new Tarea(
            task.id,
            task.descripcion,
            task.estatus,
            task.fecha_finalizacion,
            task.importancia,
            task.id_usuario
        );
    } catch (error) {
        console.error('Error al obtener tarea por ID:', error);
        throw error; // Lanza el error para manejarlo en el servidor
    }
}

// Declarar un objeto para almacenar el estado anterior de las tareas marcadas como "Done"
const previousStatus = {};

async function toggleTaskStatus(id, token) {
    const axiosConfig = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        // Obtener el estatus actual de la tarea
        const response = await axios.get(`${process.env.BASE_URL}/tasks/${id}`, axiosConfig);
        const currentStatus = response.data.estatus;
        let newStatus;

        // Determinar el nuevo estatus basado en el estatus actual
        switch (currentStatus) {
            case 'Done':
                // Si la tarea estaba 'Done', volver al estado anterior almacenado
                newStatus = previousStatus[id];
                break;
            case 'Doing':
            case 'To do':
                newStatus = 'Done'; // Cambiar a 'Done'
                break;
            default:
                throw new Error('Invalid task status');
        }

        // Actualizar el estatus
        await axios.put(`${process.env.BASE_URL}/tasks/${id}/status`, { estatus: newStatus }, axiosConfig);

        // Actualizar el registro del estado anterior si se ha cambiado a "Done"
        if (currentStatus !== 'Done') {
            previousStatus[id] = currentStatus;
        }

        return newStatus; // Retorna el nuevo estatus
    } catch (error) {
        console.error('Error al cambiar el estado de la tarea:', error);
        throw error; // Lanza el error para manejarlo en el servidor
    }
}

// Función para eliminar una tarea
async function deleteTask(id, token) {
    const axiosConfig = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        await axios.delete(`${process.env.BASE_URL}/tasks/${id}`, axiosConfig);
        return true; // Retorna true si la eliminación fue exitosa
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        throw error; // Lanza el error para manejarlo en el servidor
    }
}

// Función para obtener las tareas por usuario y agruparlas por estatus
async function getTasksByStatus(id_usuario, token) {
    const axiosConfig = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const response = await axios.get(`${process.env.BASE_URL}/tasks/status/${id_usuario}`, axiosConfig);
        return response.data;
    } catch (error) {
        console.error('Error al obtener tareas por estatus:', error);
        throw error;
    }
}

// Función para obtener las tareas recientes de un usuario
async function getRecentTasks(id_usuario, token) {
    const axiosConfig = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const response = await axios.get(`${process.env.BASE_URL}/tasks/recent/${id_usuario}`, axiosConfig);
        return response.data.map(task => new Tarea(
            task.id,
            task.descripcion,
            task.estatus,
            task.fecha_finalizacion,
            task.importancia,
            task.id_usuario
        ));
    } catch (error) {
        console.error('Error al obtener tareas recientes:', error);
        throw error;
    }
}

module.exports = {
    createTask,
    getTasksByUserId,
    updateTask,
    toggleTaskStatus,
    deleteTask,
    getTaskById,
    getRecentTasks,
    getTasksByStatus
};
