const DataBase = require('./dataBaseController');
const { generarFactura } = require('../utils/generateInvoice');

class PurchaseController {
  constructor() {
    this.cartDb = new DataBase('carritos');
    this.orderDb = new DataBase('orders');
    this.productDb = new DataBase('productos');
  }

  addToCart(req, res) {
    const { productoId, cantidad } = req.body;
    const cart = this.cartDb.readData().find(c => c.userId === req.user.id) || { userId: req.user.id, productos: [] };
    const product = this.productDb.readData().find(p => p.id === productoId);

    if (!product || product.cantidad < cantidad) {
      return res.status(400).json({ message: 'Producto no disponible o cantidad insuficiente' });
    }

    const cartProduct = cart.productos.find(p => p.productoId === productoId);
    if (cartProduct) {
      cartProduct.cantidad += cantidad;
    } else {
      cart.productos.push({ productoId, cantidad });
    }

    this.cartDb.writeData([...this.cartDb.readData(), cart]);
    res.status(201).json({ message: 'Producto agregado al carrito', cart });
  }

  checkout(req, res) {
    const cart = this.cartDb.readData().find(c => c.userId === req.user.id);
    if (!cart || cart.productos.length === 0) {
      return res.status(400).json({ message: 'Carrito vacío' });
    }

    let total = 0;
    const orderProducts = cart.productos.map(item => {
      const product = this.productDb.readData().find(p => p.id === item.productoId);
      total += product.precio * item.cantidad;
      return { ...product, cantidad: item.cantidad };
    });

    const order = { id: Date.now(), userId: req.user.id, productos: orderProducts, total, fecha: new Date().toISOString() };
    this.orderDb.writeData([...this.orderDb.readData(), order]);

    cart.productos = [];
    this.cartDb.writeData([...this.cartDb.readData().filter(c => c.userId !== req.user.id), cart]);

    const facturaPath = generarFactura(order, req.user, orderProducts);
    res.status(201).json({ message: 'Compra realizada con éxito', order, factura: facturaPath });
  }
}

module.exports = new PurchaseController();
