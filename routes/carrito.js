const express = require('express');
const router = express.Router();
const { agregarAlCarrito, verCarrito, comprar } = require('../controllers/carritoController');
const authenticateToken = require('../middlewares/authMiddleware');

// Ruta para agregar un producto al carrito
router.post('/agregar', authenticateToken, agregarAlCarrito);

// Ruta para ver el carrito
router.get('/', authenticateToken, verCarrito);

// Ruta para realizar la compra
router.post('/comprar', authenticateToken, comprar);

module.exports = router;