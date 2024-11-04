require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/productos');
const carritoRoutes = require('./routes/carrito');
const ordersRoutes = require('./routes/orders');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Rutas
app.use('/auth', authRoutes);
app.use('/productos', productosRoutes);
app.use('/carrito', carritoRoutes);
app.use('/orders', ordersRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Bienvenido a NicoShopR34');
});

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
