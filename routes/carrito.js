const express = require('express');
const router = express.Router();
const PurchaseController = require('../controllers/purchaseController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/agregar', authenticateToken, (req, res) => PurchaseController.addToCart(req, res));

router.post('/comprar', authenticateToken, (req, res) => PurchaseController.checkout(req, res));

module.exports = router;
