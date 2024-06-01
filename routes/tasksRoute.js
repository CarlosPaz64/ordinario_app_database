const express = require('express');
const router = express.Router();
const { getTask, updateTask, deleteTask, markTaskAsDone} = require('../controllers/tasksController');
const { createTask, getTasksByStatus, getRecentTasks, getTasksByUserId } = require('../models/tasksModel');
const { checkAuthenticated } = require('../checkAuthenticated/authMiddleware');


router.get('/:id', getTask);  // Ruta para obtener una tarea específica
router.post('/update-task/:id', updateTask);  // Ruta para actualizar una tarea
router.delete('/:id', deleteTask);  // Ruta para eliminar una tarea
router.post('/:id/toggle-status', markTaskAsDone); // Ruta para marcar como hecha una tarea
router.get('/status/:id_usuario', getTasksByStatus); // Ruta para llamar a las tareas por su estatus
router.get('/recent/:id_usuario', getRecentTasks); // Ruta para llamar a las tareas recientes
router.get('/user/:id_usuario', getTasksByUserId); // Ruta para llamar a las tareas por el id del usuario

// Función para obtener la fecha de hoy en la zona horaria local en formato yyyy-mm-dd
function getLocalDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Ruta para crear una nueva tarea
router.post('/create-task', checkAuthenticated, async (req, res) => {
    const { descripcion, fecha_finalizacion, importancia } = req.body;
    const id_usuario = req.session.userId;

    // Obtener la fecha de hoy en formato yyyy-mm-dd
    const today = getLocalDate();
    console.log('Fecha de hoy:', today);
    console.log('Fecha de finalización:', fecha_finalizacion);

    // Verificar si la fecha de finalización es igual a la fecha de hoy
    const estatus = fecha_finalizacion === today ? 'Doing' : 'To do';
    console.log('Estatus determinado:', estatus);

    console.log("ID del usuario que crea la tarea: ", id_usuario);

    try {
        await createTask(descripcion, estatus, fecha_finalizacion, importancia, id_usuario);
        res.redirect('/content'); // Redirige a la página principal después de crear la tarea
    } catch (error) {
        console.error('Error al crear la tarea:', error);
        return res.render('content', { error: 'Error al crear la tarea. Inténtalo de nuevo.' });
    }
});


module.exports = router;
