const express = require('express');
const router = express.Router();
const PurchaseController = require('../controllers/purchaseController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const DataBase = require('../controllers/dataBaseController'); // Asegúrate de importar esta clase correctamente

const orderDb = new DataBase('orders');

// Obtener todas las órdenes
router.get('/', authenticateToken, (req, res) => PurchaseController.getOrders(req, res));

// Historial de compras del usuario autenticado
router.get('/history', authenticateToken, (req, res) => PurchaseController.getPurchaseHistory(req, res));

// Obtener detalles de una orden específica por ID
router.get('/:orderId', authenticateToken, (req, res) => {
    const orderId = parseInt(req.params.orderId);
    const order = orderDb.readData().find(order => order.id === orderId);

    if (!order) {
        return res.status(404).json({ error: 'Orden no encontrada' });
    }

    res.json(order);
});

module.exports = router;
