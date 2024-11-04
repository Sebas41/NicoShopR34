const express = require('express');
const router = express.Router();
const { agregarProducto, obtenerProductos } = require('../controllers/productosController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

// Ruta para agregar un nuevo producto (solo para administradores)
router.post('/agregar', authenticateToken, authorizeRoles('admin'), agregarProducto);

// Ruta para obtener la lista de productos
router.get('/', obtenerProductos);

module.exports = router;