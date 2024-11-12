const DataBase = require('./dataBaseController');
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
  console.log("User ID en checkout:", userId);

  const allCarts = cartDb.readData();
  console.log("Contenido actual de cartDb:", allCarts);

  const cart = allCarts.find(c => c.userId === userId);
  console.log("Intento de checkout - Carrito encontrado:", cart);

  if (!cart || cart.productos.length === 0) {
      return res.status(400).json({ message: 'Carrito vacío' });
  }

  let total = 0;
  const orderProducts = cart.productos.map(item => {
      const product = productDb.readData().find(p => p.id === item.productoId);

      if (!product || product.cantidad < item.cantidad) {
          return res.status(400).json({ message: `Producto ${product ? product.nombre : item.productoId} no disponible o cantidad insuficiente` });
      }

      product.cantidad -= item.cantidad;
      total += product.precio * item.cantidad;
      return { ...product, cantidad: item.cantidad };
  });

  productDb.writeData(productDb.readData().map(p => {
      const purchasedProduct = orderProducts.find(op => op.id === p.id);
      return purchasedProduct ? { ...p, cantidad: purchasedProduct.cantidad } : p;
  }));

  const order = { id: Date.now(), userId: userId, productos: orderProducts, total, fecha: new Date().toISOString() };
  orderDb.writeData([...orderDb.readData(), order]);

  cart.productos = [];
  cartDb.writeData([...cartDb.readData().filter(c => c.userId !== userId), cart]);

  const facturaPath = generarFactura(order, req.user, orderProducts);
  res.status(201).json({ message: 'Compra realizada con éxito', order, factura: facturaPath });
}

module.exports = { addToCart, checkout };
