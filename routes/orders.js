const express = require('express');
const router = express.Router();
const PurchaseController = require('../controllers/purchaseController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/', authenticateToken, (req, res) => PurchaseController.getOrders(req, res));

module.exports = router;
