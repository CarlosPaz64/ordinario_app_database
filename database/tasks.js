const pool = require('./database');

// Función para crear una nueva tarea
async function createTask(descripcion, estatus, fecha_finalizacion, importancia, id_usuario) {
    try {
        const query = 'INSERT INTO tasks (descripcion, estatus, fecha_finalizacion, importancia, id_usuario) VALUES (?, ?, ?, ?, ?)';
        const values = [descripcion, estatus, fecha_finalizacion, importancia, id_usuario];
        const [result] = await pool.query(query, values);
        return result.insertId; // Retorna el ID de la nueva tarea creada
    } catch (error) {
        throw error; // Lanza el error para manejarlo en la ruta
    }
}

// Función para obtener las tareas por usuario
async function getTasksByUserId(id_usuario) {
    try {
        const query = 'SELECT * FROM tasks WHERE id_usuario = ?';
        const [rows] = await pool.query(query, [id_usuario]);
        return rows;
    } catch (error) {
        throw error; // Lanza el error para manejarlo en la ruta
    }
}

// Función para actualizar una tarea
async function updateIdTask(id, descripcion, estatus, fecha_finalizacion, importancia) {
    try {
        await pool.query(
            'UPDATE tasks SET descripcion = ?, estatus = ?, fecha_finalizacion = ?, importancia = ? WHERE id = ?',
            [descripcion, estatus, fecha_finalizacion, importancia, id]
        );
        return true; // Retorna true si la actualización fue exitosa
    } catch (error) {
        throw error; // Lanza el error para manejarlo en el servidor
    }
}

// Función que llama a las tasks por su ID
async function getTaskById(id) {
    try {
        const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
        return rows[0]; // Asume que ID es único y devuelve la primera coincidencia
    } catch (error) {
        throw error; // Lanza el error para manejarlo en el servidor
    }
}

// Declarar un objeto para almacenar el estado anterior de las tareas marcadas como "Done"
const previousStatus = {};

async function toggleTaskStatus(id) {
    try {
        // Obtener el estatus actual de la tarea
        const [rows] = await pool.query('SELECT estatus FROM tasks WHERE id = ?', [id]);
        if (rows.length === 0) {
            throw new Error('Task not found');
        }

        // Determinar el nuevo estatus
        const currentStatus = rows[0].estatus;
        let newStatus;

        // Determinar el nuevo estatus basado en el estatus actual
        switch (currentStatus) {
            case 'Done':
                // Si la tarea estaba 'Done', volver al estado anterior almacenado
                newStatus = previousStatus[id];
                break;
            case 'Doing':
                newStatus = 'Done'; // Si estaba 'Doing', cambiar a 'Done'
                break;
            case 'To do':
                newStatus = 'Done'; // Si estaba 'To do', cambiar a 'Done'
                break;
            default:
                throw new Error('Invalid task status');
        }

        // Actualizar el estatus
        await pool.query('UPDATE tasks SET estatus = ? WHERE id = ?', [newStatus, id]);

        // Actualizar el registro del estado anterior si se ha cambiado a "Done"
        if (currentStatus !== 'Done') {
            previousStatus[id] = currentStatus;
        }

        return newStatus; // Retorna el nuevo estatus
    } catch (error) {
        throw error; // Lanza el error para manejarlo en el servidor
    }
}



// Función para eliminar una tarea
async function deleteTask(id) {
    try {
        await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
        return true; // Retorna true si la eliminación fue exitosa
    } catch (error) {
        throw error; // Lanza el error para manejarlo en el servidor
    }
}

// Función para obtener las tareas por usuario y agruparlas por estatus
async function getTasksByStatus(id_usuario) {
    try {
        const query = `
            SELECT 
                estatus, 
                COUNT(*) as count 
            FROM 
                tasks 
            WHERE 
                id_usuario = ? 
            GROUP BY 
                estatus
        `;
        const [rows] = await pool.query(query, [id_usuario]);
        return rows;
    } catch (error) {
        throw error;
    }
}

// Función para obtener las tareas recientes de un usuario
async function getRecentTasks(id_usuario, limit = 5) {
    try {
        const query = `
            SELECT * 
            FROM 
                tasks 
            WHERE 
                id_usuario = ? 
            ORDER BY 
                fecha_finalizacion DESC 
            LIMIT ?
        `;
        const [rows] = await pool.query(query, [id_usuario, limit]);
        return rows;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createTask,
    getTasksByUserId,
    updateIdTask,
    toggleTaskStatus,
    deleteTask,
    getTaskById,
    getRecentTasks,
    getTasksByStatus
};
