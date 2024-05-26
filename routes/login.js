const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Esta ruta renderiza el formulario de login
router.get('/', (req, res) => {
    res.render('login'); // Asegúrate de tener una vista llamada 'login' en tu directorio de vistas
});

// Esta ruta maneja la solicitud POST para el inicio de sesión
router.post('/', userController.loginUser);

module.exports = router;
