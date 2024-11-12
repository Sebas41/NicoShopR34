const express = require('express');
const router = express.Router();
const PurchaseController = require('../controllers/purchaseController');
const authenticateToken = require('../middlewares/authMiddleware');
const orderDb = new DataBase('orders');

router.get('/', authenticateToken, (req, res) => PurchaseController.getOrders(req, res));

router.get('/:orderId', (req, res) => {
    const orderId = parseInt(req.params.orderId);
    const order = orderDb.readData().find(order => order.id === orderId);

    if (!order) {
        return res.status(404).json({ error: 'Orden no encontrada' });
    }

    res.json(order);  // Asegúrate de que esta línea envía los datos de la factura en formato JSON
});
module.exports = router;
