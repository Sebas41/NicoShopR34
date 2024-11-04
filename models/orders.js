const express = require('express');
const router = express.Router();
const { obtenerOrdenes } = require('../controllers/ordersController');
const authenticateToken = require('../middlewares/authMiddleware');

// Ruta para obtener el historial de compras
router.get('/', authenticateToken, obtenerOrdenes);

module.exports = router;
