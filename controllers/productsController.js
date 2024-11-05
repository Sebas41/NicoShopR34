const { readData, writeData } = require('../utils/fileHandler');
const Joi = require('joi');

// Esquema de validación para agregar productos
const productoSchema = Joi.object({
  nombre: Joi.string().min(1).required(),
  descripcion: Joi.string().min(1).required(),
  precio: Joi.number().positive().required(),
  cantidad: Joi.number().integer().min(0).required()
});

// Función para agregar un nuevo producto
function agregarProducto(req, res) {
  const { error } = productoSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { nombre, descripcion, precio, cantidad } = req.body;
  const productos = readData('productos.json');

  const nuevoProducto = {
    id: Date.now(),
    nombre,
    descripcion,
    precio: parseFloat(precio),
    cantidad: parseInt(cantidad)
  };

  productos.push(nuevoProducto);
  writeData('productos.json', productos);

  res.status(201).json({ message: 'Producto agregado con éxito', producto: nuevoProducto });
}

// Función para obtener la lista de productos
function obtenerProductos(req, res) {
  const productos = readData('productos.json');
  res.json(productos);
}

module.exports = { agregarProducto, obtenerProductos };
