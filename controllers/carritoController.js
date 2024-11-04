const { readData, writeData } = require('../utils/fileHandler');
const Joi = require('joi');

// Esquema de validación para agregar al carrito
const agregarCarritoSchema = Joi.object({
  productoId: Joi.number().required(),
  cantidad: Joi.number().integer().min(1).required()
});

// Función para agregar un producto al carrito
function agregarAlCarrito(req, res) {
  const { error } = agregarCarritoSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const userId = req.user.id;
  const { productoId, cantidad } = req.body;

  const carritos = readData('carritos.json');
  let carrito = carritos.find(c => c.userId === userId);

  if (!carrito) {
    carrito = { userId, productos: [] };
    carritos.push(carrito);
  }

  const productos = readData('productos.json');
  const producto = productos.find(p => p.id === productoId);

  if (!producto) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  if (producto.cantidad < cantidad) {
    return res.status(400).json({ message: 'Cantidad solicitada no disponible' });
  }

  const itemExistente = carrito.productos.find(p => p.productoId === productoId);
  if (itemExistente) {
    itemExistente.cantidad += cantidad;
  } else {
    carrito.productos.push({ productoId, cantidad });
  }

  writeData('carritos.json', carritos);
  res.status(201).json({ message: 'Producto agregado al carrito', carrito });
}

// Función para ver el carrito
function verCarrito(req, res) {
  const userId = req.user.id;
  const carritos = readData('carritos.json');
  const carrito = carritos.find(c => c.userId === userId);

  if (!carrito) {
    return res.status(404).json({ message: 'Carrito no encontrado' });
  }

  const productos = readData('productos.json');
  const carritoDetallado = carrito.productos.map(item => {
    const producto = productos.find(p => p.id === item.productoId);
    return {
      ...item,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio
    };
  });

  res.json({ userId, productos: carritoDetallado });
}

// Función para realizar la compra
function comprar(req, res) {
  const userId = req.user.id;
  const carritos = readData('carritos.json');
  const carrito = carritos.find(c => c.userId === userId);

  if (!carrito || carrito.productos.length === 0) {
    return res.status(400).json({ message: 'El carrito está vacío o no existe' });
  }

  const productos = readData('productos.json');

  // Verificar disponibilidad y actualizar inventario
  for (let item of carrito.productos) {
    const producto = productos.find(p => p.id === item.productoId);
    if (producto.cantidad < item.cantidad) {
      return res.status(400).json({ message: `Producto ${producto.nombre} no tiene suficiente stock` });
    }
    producto.cantidad -= item.cantidad;
  }

  writeData('productos.json', productos);

  // Calcular total
  const total = carrito.productos.reduce((sum, item) => {
    const producto = productos.find(p => p.id === item.productoId);
    return sum + (producto.precio * item.cantidad);
  }, 0);

  // Crear orden
  const orders = readData('orders.json');
  const nuevaOrden = {
    id: Date.now(),
    userId,
    productos: carrito.productos,
    total,
    fecha: new Date().toISOString()
  };
  orders.push(nuevaOrden);
  writeData('orders.json', orders);

  // Limpiar carrito
  carrito.productos = [];
  writeData('carritos.json', carritos);

  res.status(201).json({ message: 'Compra realizada con éxito', orden: nuevaOrden });
}

module.exports = { agregarAlCarrito, verCarrito, comprar };
