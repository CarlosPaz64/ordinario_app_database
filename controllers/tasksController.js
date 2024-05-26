const tasksModel = require('../models/tasksModel'); // Asegúrate de importar el modelo adecuado

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
    try {
        await tasksModel.deleteTask(taskId);
        res.redirect('/content'); // Redirige a la página principal después de eliminar la tarea
    } catch (error) {
        console.error('Error al borrar la tarea:', error);
        return res.render('content', { error: 'Error al borrar la tarea. Inténtalo de nuevo.' });
    }
}

module.exports = { updateTask, markTaskAsDone, deleteTask };
