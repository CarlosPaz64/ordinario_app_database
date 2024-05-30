const express = require('express');
const router = express.Router();
const { createTask } = require('../models/tasksModel');
const { checkAuthenticated } = require('../checkAuthenticated/authMiddleware');

// Función para obtener la fecha de hoy en la zona horaria local en formato yyyy-mm-dd
function getLocalDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Ruta para crear una nueva tarea
router.post('/', checkAuthenticated, async (req, res) => {
    const { descripcion, fecha_finalizacion, importancia } = req.body;
    const id_usuario = req.session.userId;

    // Obtener la fecha de hoy en formato yyyy-mm-dd
    const today = getLocalDate();
    console.log('Fecha de hoy:', today);
    console.log('Fecha de finalización:', fecha_finalizacion);

    // Verificar si la fecha de finalización es igual a la fecha de hoy
    const estatus = fecha_finalizacion === today ? 'Doing' : 'To do';
    console.log('Estatus determinado:', estatus);

    try {
        await createTask(descripcion, estatus, fecha_finalizacion, importancia, id_usuario);
        res.redirect('/content'); // Redirige a la página principal después de crear la tarea
    } catch (error) {
        console.error('Error al crear la tarea:', error);
        return res.render('content', { error: 'Error al crear la tarea. Inténtalo de nuevo.' });
    }
});

module.exports = router;
