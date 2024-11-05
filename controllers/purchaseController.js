const { readData } = require('../utils/fileHandler');
const { generarFactura } = require('../utils/generateInvoice');

// Función para obtener el historial de compras del usuario
function obtenerOrdenes(req, res) {
  const userId = req.user.id;
  const orders = readData('orders.json');
  const usuarios = readData('usuarios.json');
  const productos = readData('productos.json');

  const ordenesUsuario = orders.filter(order => order.userId === userId).map(order => {
    const usuario = usuarios.find(u => u.id === order.userId);
    const productosOrden = order.productos.map(item => {
      const producto = productos.find(p => p.id === item.productoId);
      return { ...producto, cantidad: item.cantidad };
    });
    const facturaPath = generarFactura(order, usuario, productos);
    return { ...order, factura: facturaPath, productos: productosOrden };
  });

  res.json(ordenesUsuario);
}

module.exports = { obtenerOrdenes };
