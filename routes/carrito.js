// routes/carrito.js
const express = require('express');
const router = express.Router();
const { addToCart, checkout } = require('../controllers/purchaseController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const DataBase = require('../controllers/dataBaseController');

// Instancia del controlador de la base de datos del carrito
const cartDb = new DataBase('carritos');

// Ruta para agregar al carrito
router.post('/agregar', authenticateToken, addToCart);

// Ruta para realizar la compra
router.post('/comprar', authenticateToken, checkout);

// Nueva ruta para obtener el contenido del carrito del usuario
router.get('/', authenticateToken, (req, res) => {
    const userId = req.user.id;
    console.log('User ID:', userId);
    const carrito = cartDb.readData().find(c => c.userId === userId);
    console.log('Carrito:', carrito);

    if (!carrito) {
        return res.status(200).json({ productos: [] });
    }

    res.json(carrito);
});


module.exports = router;
