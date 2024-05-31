const express = require('express');
const router = express.Router();

// Importar rutas específicas
const tasksRoute = require('./tasksRoute');
const usuariosRoute = require('./usuariosRoute');

// Rutas específicas para tareas
router.use('/tasks', tasksRoute);

// Rutas específicas para usuarios
router.use('/usuarios', usuariosRoute);

module.exports = router;