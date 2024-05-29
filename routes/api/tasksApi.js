const express = require('express');
const router = express.Router();
const { checkAuthenticated } = require('../../checkAuthenticated/authMiddleware');
const { getTasksByUserId, createTask, updateTask, deleteTask } = require('../../database/tasks');

// Obtener todas las tareas del usuario autenticado
router.get('/', checkAuthenticated, async (req, res) => {
    try {
        const tasks = await getTasksByUserId(req.session.userId);
        res.json(tasks);
    } catch (error) {
        console.error('Error al obtener las tareas:', error);
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
});

// Crear una nueva tarea
router.post('/', checkAuthenticated, async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTask = await createTask(req.session.userId, title, description);
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error al crear la tarea:', error);
        res.status(500).json({ error: 'Error al crear la tarea' });
    }
});

// Actualizar una tarea existente
router.put('/:id', checkAuthenticated, async (req, res) => {
    try {
        const taskId = req.params.id;
        const updatedTask = await updateTask(taskId, req.body);
        res.json(updatedTask);
    } catch (error) {
        console.error('Error al actualizar la tarea:', error);
        res.status(500).json({ error: 'Error al actualizar la tarea' });
    }
});

// Eliminar una tarea
router.delete('/:id', checkAuthenticated, async (req, res) => {
    try {
        const taskId = req.params.id;
        await deleteTask(taskId);
        res.status(204).end();
    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
});

module.exports = router;
