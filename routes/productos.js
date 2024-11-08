const express = require('express');
const router = express.Router();
const ProductosController = require('../controllers/productosController');
const { authenticateToken, authorizeAdmin } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento en disco para multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); // Asegúrate de que la carpeta 'public/uploads' exista
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Guardar con un nombre único
    }
});

const upload = multer({ storage: storage });

// Ruta para agregar un producto, utilizando multer para procesar la imagen
router.post('/agregar', authenticateToken, authorizeAdmin, upload.single('productImage'), (req, res) => {
    ProductosController.agregarProducto(req, res);
});

// Ruta para listar productos
router.get('/', (req, res) => ProductosController.listarProductos(req, res));

module.exports = router;
