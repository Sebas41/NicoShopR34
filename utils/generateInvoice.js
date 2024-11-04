const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generarFactura(orden, usuario, productos) {
  const doc = new PDFDocument();
  const facturaPath = path.join(__dirname, '..', 'facturas', `factura_${orden.id}.pdf`);

  // Asegurar que la carpeta de facturas exista
  if (!fs.existsSync(path.join(__dirname, '..', 'facturas'))) {
    fs.mkdirSync(path.join(__dirname, '..', 'facturas'));
  }

  doc.pipe(fs.createWriteStream(facturaPath));

  // Encabezado
  doc.fontSize(20).text('Factura de Compra', { align: 'center' });
  doc.moveDown();

  // Información del usuario
  doc.fontSize(12).text(`ID de Orden: ${orden.id}`);
  doc.text(`Fecha: ${orden.fecha}`);
  doc.text(`Cliente: ${usuario.username}`);
  doc.moveDown();

  // Tabla de productos
  doc.text('Productos:', { underline: true });
  orden.productos.forEach(item => {
    const producto = productos.find(p => p.id === item.productoId);
    doc.text(`${producto.nombre} - Cantidad: ${item.cantidad} - Precio Unitario: $${producto.precio}`);
  });
  doc.moveDown();

  // Total
  doc.text(`Total a Pagar: $${orden.total}`, { bold: true });

  doc.end();

  return facturaPath;
}

module.exports = { generarFactura };
