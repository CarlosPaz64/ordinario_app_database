const express = require('express');
const router = express.Router();
const { getTask, updateTask, deleteTask } = require('../controllers/tasksController');

router.get('/:id', getTask);  // Ruta para obtener una tarea específica
router.put('/update-task/:id', updateTask);  // Ruta para actualizar una tarea
router.delete('/:id', deleteTask);  // Ruta para eliminar una tarea

module.exports = router;
