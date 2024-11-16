const DataBase = require('./dataBaseController');
const path = require('path');
const fs = require('fs');
const { generarFactura } = require('../utils/generateInvoice');

const cartDb = new DataBase('carritos');
const orderDb = new DataBase('orders');
const productDb = new DataBase('productos');

function addToCart(req, res) {
  const { productoId, cantidad } = req.body;
  const userId = req.user.id;


  if (cantidad <= 0) {
    return res.status(400).json({ message: 'La cantidad debe ser mayor a cero' });
  }

  // Lee todos los carritos desde el archivo
  let allCarts = cartDb.readData();

  // Busca o crea un carrito para el usuario
  let cart = allCarts.find(c => c.userId === userId);

  // Busca el producto
  const product = productDb.readData().find(p => p.id === productoId);

  if (!cart) {
      cart = { userId, productos: [] };
  }

  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  } else if (product.cantidad < cantidad) {
      return res.status(400).json({ message: 'Producto no disponible o cantidad insuficiente' });
  }

  const cartProduct = cart.productos.find(p => p.productoId === productoId);
  const totalCantidadEnCarrito = cartProduct ? cartProduct.cantidad + cantidad : cantidad;

  if (totalCantidadEnCarrito > product.cantidad) {
    return res.status(400).json({ 
    message: `No puedes agregar más de ${product.cantidad} unidades de este producto al carrito.` 
  });
  }
  // Actualizar la cantidad en el carrito o agregar el producto
  if (cartProduct) {
    cartProduct.cantidad += cantidad;
  } else {
    cart.productos.push({ productoId, cantidad });
  }

  // Actualizar el carrito en la base de datos
  allCarts = allCarts.filter(c => c.userId !== userId);
  allCarts.push(cart);
  cartDb.writeData(allCarts);

  res.status(201).json({ message: 'Producto agregado al carrito', cart });
}


function checkout(req, res) {
    const userId = req.user.id;
    const allCarts = cartDb.readData();
    const cart = allCarts.find(c => c.userId === userId);

    if (!cart || cart.productos.length === 0) {
        return res.status(400).json({ message: 'Carrito vacío' });
    }

    let total = 0;

    // Cargar la lista de productos y actualizar las cantidades disponibles
    const products = productDb.readData();

    const orderProducts = cart.productos.map(item => {
        const product = products.find(p => p.id === item.productoId);
        if (!product || product.cantidad < item.cantidad) {
            return res.status(400).json({ message: `Producto ${item.productoId} no disponible o cantidad insuficiente` });
        }

        // Reducir la cantidad disponible del producto
        product.cantidad -= item.cantidad;

        total += product.precio * item.cantidad;

        return { ...product, cantidad: item.cantidad };
    });

    // Guardar los cambios en la base de datos de productos
    productDb.writeData(products);

    // Crear una nueva orden
    const order = {
        id: Date.now(),
        userId,
        productos: orderProducts,
        total,
        fecha: new Date().toISOString(),
    };

    // Guardar la orden en la base de datos de órdenes
    orderDb.writeData([...orderDb.readData(), order]);

    // Vaciar el carrito del usuario
    cart.productos = [];
    cartDb.writeData(allCarts.map(c => (c.userId === userId ? cart : c)));

    // Generar factura
    const facturaPath = generarFactura(order, req.user, orderProducts);

    res.status(201).json({ message: 'Compra realizada con éxito', facturaUrl: `/facturas/${path.basename(facturaPath)}` });
}

function getPurchaseHistory(req, res) {
    const { id: userId, role } = req.user; // Obtén el ID y el rol del usuario autenticado
    const allOrders = orderDb.readData();

    if (role === 'admin') {
        // Si es administrador, devolver todas las órdenes
        return res.status(200).json(allOrders);
    }

    // Si es cliente, devolver solo sus órdenes
    const userOrders = allOrders.filter(order => order.userId === userId);

    if (!userOrders || userOrders.length === 0) {
        return res.status(404).json({ message: 'No tienes compras registradas.' });
    }

    res.status(200).json(userOrders);
}


module.exports = { addToCart, checkout, getPurchaseHistory };
