const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ControllerProduct');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

router.post('/agregar', authenticateToken, authorizeRoles('admin'), (req, res) => ProductController.addProduct(req, res));

router.get('/', (req, res) => ProductController.getProducts(req, res));

module.exports = router;
