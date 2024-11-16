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

  // Lee todos los carritos desde el archivo
  let allCarts = cartDb.readData();

  // Busca o crea un carrito para el usuario
  let cart = allCarts.find(c => c.userId === userId);
  if (!cart) {
      cart = { userId, productos: [] };
  }

  const product = productDb.readData().find(p => p.id === productoId);
  if (!product || product.cantidad < cantidad) {
      return res.status(400).json({ message: 'Producto no disponible o cantidad insuficiente' });
  }

  const cartProduct = cart.productos.find(p => p.productoId === productoId);
  if (cartProduct) {
      cartProduct.cantidad += cantidad;
  } else {
      cart.productos.push({ productoId, cantidad });
  }

  allCarts = allCarts.filter(c => c.userId !== userId);
  allCarts.push(cart);
  cartDb.writeData(allCarts);  // Asegúrate de que esto escriba correctamente

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



module.exports = { addToCart, checkout };
