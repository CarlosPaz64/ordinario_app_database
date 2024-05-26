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
async function updateTask(id, descripcion, estatus, fecha_finalizacion, importancia) {
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

// Función para actualizar el estatus de una tarea a 'Done'
async function markTaskAsDone(id) {
    try {
        await pool.query('UPDATE tasks SET estatus = ? WHERE id = ?', ['Done', id]);
        return true; // Retorna true si la actualización fue exitosa
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

module.exports = {
    createTask,
    getTasksByUserId,
    updateTask,
    markTaskAsDone,
    deleteTask
};
