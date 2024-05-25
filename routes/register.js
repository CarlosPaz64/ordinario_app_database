const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Esta ruta renderiza el formulario de registro
router.get('/', (req, res) => {
    res.render('register');
});

// Esta ruta maneja la solicitud POST para registrar un nuevo usuario
router.post('/', userController.register);

module.exports = router;
