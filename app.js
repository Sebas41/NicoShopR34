const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/productos');
const carritoRoutes = require('./routes/carrito');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Rutas
app.use('/auth', authRoutes);
app.use('/productos', productosRoutes);
app.use('/carrito', carritoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
})

app.get('/', (req, res) => {
    res.send('Bienvenido a NicoShopR34');
})


