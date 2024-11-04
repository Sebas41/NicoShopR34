const express = require('express');
const router = express.Router();

// Simulación de base de datos de carritos
let carritos = [];

// Ruta para agregar un producto al carrito
router.post('/agregar', (req, res) => {
  const { userId, productoId, cantidad } = req.body;

  if (!userId || !productoId || !cantidad) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  // Busca el carrito del usuario o crea uno nuevo
  let carrito = carritos.find(c => c.userId === userId);
  if (!carrito) {
    carrito = { userId, productos: [] };
    carritos.push(carrito);
  }

  // Agrega el producto al carrito
  carrito.productos.push({ productoId, cantidad });
  res.status(201).json({ message: 'Producto agregado al carrito', carrito });
});

// Ruta para ver el carrito
router.get('/:userId', (req, res) => {
  console.log('Carritos actuales:', carritos);
  const { userId } = req.params;
  const carrito = carritos.find(c => c.userId == userId);

  if (!carrito) {
    return res.status(404).json({ message: 'Carrito no encontrado' });
  }

  res.json(carrito);
});

router.post('/comprar', (req, res) => {
    const { userId } = req.body;
    const carrito = carritos.find(c => c.userId === userId);
  
    if (!carrito || carrito.productos.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío o no existe' });
    }
  
    // Generar la factura (simulada)
    const factura = {
      userId,
      productos: carrito.productos,
      total: carrito.productos.reduce((sum, p) => sum + (p.cantidad * 100), 0), // Simulación de precios
      fecha: new Date().toISOString()
    };
  
    // Limpia el carrito
    carrito.productos = [];
  
    res.status(201).json({ message: 'Compra realizada con éxito', factura });
  });
  
module.exports = router;