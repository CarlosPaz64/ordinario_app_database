const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { checkAuthenticated } = require('../checkAuthenticated/authMiddleware');
const { getTasksByUserId, getRecentTasks, getTasksByStatus } = require('../models/tasksModel'); // Importa la función para obtener los usuarios


// Rutas para registrar usuarios
// Esta ruta renderiza el formulario de registro
router.get('/register', (req, res) => {
    res.render('register');
});

// Esta ruta maneja la solicitud POST para registrar un nuevo usuario
router.post('/register', userController.register);

//Rutas para logear usuarios
// Esta ruta renderiza el formulario de login
router.get('/login', (req, res) => {
    res.render('login'); // Asegúrate de tener una vista llamada 'login' en tu directorio de vistas
});

// Esta ruta maneja la solicitud POST para el inicio de sesión
router.post('/login', userController.loginUser);

// Ruta para desloguear usuarios
// Ruta para cerrar sesión
router.post('/logout', userController.logoutUser);


module.exports = router;
