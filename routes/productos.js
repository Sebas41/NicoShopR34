const express = require('express');
const router = express.Router();

// Simulación de base de datos de productos (puedes usar un archivo JSON o base de datos)
let productos = [];

// Ruta para agregar un nuevo producto (solo para administradores)
router.post('/agregar', (req, res) => {
  const { nombre, descripcion, precio, cantidad } = req.body;
  
  if (!nombre || !descripcion || !precio || !cantidad) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  const nuevoProducto = { id: productos.length + 1, nombre, descripcion, precio, cantidad };
  productos.push(nuevoProducto);
  res.status(201).json({ message: 'Producto agregado con éxito', producto: nuevoProducto });
});

// Ruta para obtener la lista de productos
router.get('/', (req, res) => {
  res.json(productos);
});

module.exports = router;
