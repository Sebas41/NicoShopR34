const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generarFactura(orden, usuario, productos) {
  const doc = new PDFDocument();
  const facturaPath = path.join(__dirname, '..', 'facturas', `factura${orden.id}.pdf`);

  if (!fs.existsSync(path.join(__dirname, '..', 'facturas'))) {
    fs.mkdirSync(path.join(__dirname, '..', 'facturas'));
  }

  doc.pipe(fs.createWriteStream(facturaPath));

  doc.fontSize(20).text('Factura de Compra', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`ID de Orden: ${orden.id}`);
  doc.text(`Fecha: ${orden.fecha}`);
  doc.text(`Cliente: ${usuario.username}`);
  doc.moveDown();

  doc.text('Productos:', { underline: true });
  orden.productos.forEach(item => {
    doc.text(`${item.nombre} - Cantidad: ${item.cantidad} - Precio Unitario: $${item.precio}`);
  });
  doc.moveDown();

  // Total
  doc.text(`Total a Pagar: $${orden.total}`, { bold: true });

  doc.end();

  return facturaPath;
}

module.exports = { generarFactura };
