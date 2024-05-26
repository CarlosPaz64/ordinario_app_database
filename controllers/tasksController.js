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

// Controladores para las tareas
async function updateTask(req, res) {
    const { id, descripcion, estatus, fecha_finalizacion, importancia } = req.body;
    try {
        await tasksModel.updateTask(id, descripcion, estatus, fecha_finalizacion, importancia);
        res.redirect('/content'); // Redirige a la página principal después de editar la tarea
    } catch (error) {
        console.error('Error al editar la tarea:', error);
        return res.render('content', { error: 'Error al editar la tarea. Inténtalo de nuevo.' });
    }
}

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
