require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Importar rutas
const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/productos');
const carritoRoutes = require('./routes/carrito'); // Ruta del carrito
const ordersRoutes = require('./routes/orders');


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Usar rutas
app.use('/auth', authRoutes);
app.use('/productos', productosRoutes);
app.use('/carrito', carritoRoutes);  // Asegúrate de usar este enrutador
app.use('/facturas', express.static(path.join(__dirname, 'facturas')));
app.use('/orders', ordersRoutes);


// Rutas adicionales
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// Manejo de rutas no encontradas
app.use((req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal' });
});

app.get('/download-factura/:orderId', (req, res) => {
  const { orderId } = req.params;
  const facturaPath = path.join(__dirname, 'facturas', `factura${orderId}.pdf`);

  if (fs.existsSync(facturaPath)) {
      res.download(facturaPath, `factura_${orderId}.pdf`, (err) => {
          if (err) {
              console.error('Error en la descarga directa de la factura:', err);
              res.status(500).json({ message: 'Error en la descarga de la factura' });
          }
      });
  } else {
      res.status(404).json({ message: 'Factura no encontrada' });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
