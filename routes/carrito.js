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

router.delete('/eliminar', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { productoId } = req.body; // Asegúrate de que el frontend envíe el productoId en el body

    const carrito = cartDb.readData().find(c => c.userId === userId);
    if (!carrito) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    // Filtra el producto del carrito
    carrito.productos = carrito.productos.filter(p => p.productoId !== productoId);

    // Guarda los cambios en el archivo JSON
    cartDb.writeData([
        ...cartDb.readData().filter(c => c.userId !== userId),
        carrito
    ]);

    res.status(200).json({ message: 'Producto eliminado del carrito' });
});



module.exports = router;
