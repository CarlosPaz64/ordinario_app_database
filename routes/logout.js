const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Ruta para cerrar sesión
router.post('/', userController.logoutUser);

module.exports = router;
