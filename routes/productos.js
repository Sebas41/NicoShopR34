const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta para agregar un nuevo producto (solo para administradores)
router.post('/agregar', authMiddleware, (req, res) => {
  const { nombre, descripcion, precio, cantidad } = req.body;
  
  // Solo admins pueden agregar productos
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Permiso denegado' });
  }

  if (!nombre || !descripcion || !precio || !cantidad) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  const nuevoProducto = { id: productos.length + 1, nombre, descripcion, precio, cantidad };
  productos.push(nuevoProducto);
  res.status(201).json({ message: 'Producto agregado con éxito', producto: nuevoProducto });
});

module.exports = router;
