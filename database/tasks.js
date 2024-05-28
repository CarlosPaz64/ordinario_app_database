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

async function toggleTaskStatus(id) {
    try {
        // Obtener el estatus actual de la tarea
        const [rows] = await pool.query('SELECT estatus FROM tasks WHERE id = ?', [id]);
        if (rows.length === 0) {
            throw new Error('Task not found');
        }

        // Determinar el nuevo estatus
        const currentStatus = rows[0].estatus;
        const newStatus = currentStatus === 'Done' ? 'To do' : 'Done'; // Puedes ajustar esto según tus estados posibles

        // Actualizar el estatus
        await pool.query('UPDATE tasks SET estatus = ? WHERE id = ?', [newStatus, id]);
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

module.exports = {
    createTask,
    getTasksByUserId,
    updateIdTask,
    toggleTaskStatus,
    deleteTask,
    getTaskById
};
