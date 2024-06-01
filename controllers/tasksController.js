const tasksModel = require('../models/tasksModel'); // Asegúrate de importar el modelo adecuado

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

// Controlador para obtener una tarea
async function getTask(req, res) {
    const taskId = req.params.id;
    try {
        const task = await tasksModel.updateTask(taskId);
        if (task) {
            sendSuccessResponse(res, task);
        } else {
            sendErrorResponse(res, 404, 'Tarea no encontrada');
        }
    } catch (error) {
        handleServerError(res, error);
    }
}

// Función para obtener la fecha de hoy en la zona horaria local en formato yyyy-mm-dd
function getLocalDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Controlador para editar la tarea
async function updateTask(req, res) {
    const taskId = req.params.id;
    console.log("Id de la tarea: ", taskId);
    const { descripcion, fecha_finalizacion, importancia } = req.body;

    // Obtener la fecha de hoy en formato yyyy-mm-dd
    const today = getLocalDate();

    // Verificar si la fecha de finalización es igual a la fecha de hoy
    const estatus = fecha_finalizacion === today ? 'Doing' : 'To do';

    try {
        console.log("Intentado de actualizar la tarea: ", req.body);
        await tasksModel.updateTask(taskId, descripcion, estatus, fecha_finalizacion, importancia);
        res.redirect('/content'); // Redirige a la página principal después de actualizar la tarea
    } catch (error) {
        console.error('Error al actualizar la tarea:', error);
        sendErrorResponse(res, 500, 'Error al actualizar la tarea. Inténtalo de nuevo.');
    }
}

// Controlador para marcar una tarea como completada
async function markTaskAsDone(req, res) {
    const taskId = req.params.id;
    console.log("Tarea para poner como 'Done' con el ID: ", taskId);
    try {
        const newStatus = await tasksModel.toggleTaskStatus(taskId);
        console.log("El nuevo estatus de la tarea será: ", newStatus);
        sendSuccessResponse(res, { success: true, status: newStatus });
    } catch (error) {
        console.error('Error al cambiar el estatus de la tarea:', error);
        sendErrorResponse(res, 500, 'Error al cambiar el estatus de la tarea. Inténtalo de nuevo.');
    }
}

// Controlador para eliminar una tarea
async function deleteTask(req, res) {
    const taskId = req.params.id;
    console.log('Received request to delete task with id:', taskId);
    try {
        const result = await tasksModel.deleteTask(taskId);
        if (result) {
            sendSuccessResponse(res, { message: 'Task deleted successfully' });
        } else {
            sendErrorResponse(res, 404, 'Tarea no encontrada');
        }
    } catch (error) {
        console.error('Error al borrar la tarea:', error);
        handleServerError(res, error);
    }
}

module.exports = { updateTask, markTaskAsDone, deleteTask, getTask };
