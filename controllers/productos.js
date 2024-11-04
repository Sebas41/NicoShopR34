const { readData, writeData } = require('../utils/fileHandler');

// Función para agregar un nuevo producto
function agregarProducto(req, res) {
  const { nombre, descripcion, precio, cantidad } = req.body;

  if (!nombre || !descripcion || !precio || !cantidad) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

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
