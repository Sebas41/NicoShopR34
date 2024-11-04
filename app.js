// Cargar variables de entorno
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

// Importar rutas
const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/productos');
const carritoRoutes = require('./routes/carrito');
const ordersRoutes = require('./routes/orders');

const app = express();

// Middleware
app.use(bodyParser.json());

// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Reemplaza con el origen de tu frontend
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rutas
app.use('/auth', authRoutes);
app.use('/productos', productosRoutes);
app.use('/carrito', carritoRoutes);
app.use('/orders', ordersRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Bienvenido a NicoShopR34');
});

// Documentación de la API con Swagger (Opcional)
const swaggerDocumentPath = path.join(__dirname, 'swagger.json');
if (fs.existsSync(swaggerDocumentPath)) {
  const swaggerDocument = require(swaggerDocumentPath);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal!' });
});

// Iniciar el servidor solo si no está en modo test
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app; // Exportar la app para pruebas
