const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Ruta de registro de usuario
router.post('/register', registerUser);

// Ruta de inicio de sesión
router.post('/login', loginUser);

module.exports = router;
