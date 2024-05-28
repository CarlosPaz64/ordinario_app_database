const express = require('express');
const router = express.Router();
const { getTask, updateTask, deleteTask, markTaskAsDone } = require('../controllers/tasksController');

router.get('/:id', getTask);  // Ruta para obtener una tarea específica
router.post('/update-task/:id', updateTask);  // Ruta para actualizar una tarea
router.delete('/:id', deleteTask);  // Ruta para eliminar una tarea
router.post('/:id/toggle-status', markTaskAsDone); // Ruta para marcar como hecha una tarea

module.exports = router;
