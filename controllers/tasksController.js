const tasksModel = require('../models/tasksModel'); // Asegúrate de importar el modelo adecuado

// Controlador para obtener una tarea
async function getTask(req, res) {
    const taskId = req.params.id;
    try {
        const task = await tasksModel.getTaskById(taskId);
        if (task) {
            res.status(200).json(task);
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ error: 'Error fetching task. Please try again.' });
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

// Función para editar la tarea
async function updateTask (req, res) {
    const taskId = req.params.id;
    console.log("Id de la tarea: ", taskId);
    const { descripcion, fecha_finalizacion, importancia } = req.body;

    // Obtener la fecha de hoy en formato yyyy-mm-dd
    const today = getLocalDate();

    // Verificar si la fecha de finalización es igual a la fecha de hoy
    const estatus = fecha_finalizacion === today ? 'Doing' : 'To do';

    try {
        console.log("Intentado de actualizar la tarea: ", req.body);
        await tasksModel.updateIdTask(taskId, descripcion, estatus, fecha_finalizacion, importancia);
        res.redirect('/content'); // Redirige a la página principal después de actualizar la tarea
    } catch (error) {
        console.error('Error al actualizar la tarea:', error);
        return res.render('content', { error: 'Error al actualizar la tarea. Inténtalo de nuevo.' });
    }
};

async function markTaskAsDone(req, res) {
    const taskId = req.params.id;
    try {
        await tasksModel.markTaskAsDone(taskId);
        res.redirect('/content'); // Redirige a la página principal después de cambiar el estado de la tarea
    } catch (error) {
        console.error('Error al cambiar el estatus de la tarea:', error);
        return res.render('content', { error: 'Error al cambiar el estatus la tarea. Inténtalo de nuevo.' });
    }
}

async function deleteTask(req, res) {
    const taskId = req.params.id;
    console.log('Received request to delete task with id:', taskId);
    try {
        const result = await tasksModel.deleteTask(taskId);
        if (result) {
            res.status(200).json({ message: 'Task deleted successfully' });
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        console.error('Error al borrar la tarea:', error);
        res.status(500).json({ error: 'Error deleting task. Please try again.' });
    }
}
module.exports = { updateTask, markTaskAsDone, deleteTask, getTask };
