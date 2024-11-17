// controllers/productosController.js

const DataBase = require('./dataBaseController');

class ProductosControllerClass {
    constructor() {
        this.productosDb = new DataBase('productos');
    }

    agregarProducto(req, res) {
        const { nombre, descripcion, precio, cantidad } = req.body;
        let imagen = '';
    
        // Comprobar si `req.file` está presente y almacenar la ruta de la imagen
        if (req.file) {
            console.log("Archivo de imagen recibido:", req.file);
            imagen = `/uploads/${req.file.filename}`; // Guarda la ruta relativa de la imagen
        } else {
            console.log("Archivo de imagen no recibido.");
        }
    
        const nuevoProducto = {
            id: Date.now(),
            nombre,
            descripcion,
            precio: parseFloat(precio),
            cantidad: parseInt(cantidad, 10),
            imagen // Guarda la ruta de la imagen en lugar de Base64
        };
    
        const productos = this.productosDb.readData();
        productos.push(nuevoProducto);
        this.productosDb.writeData(productos);
    
        res.status(201).json({ message: 'Producto agregado con éxito', producto: nuevoProducto });
    }
y    

    listarProductos(req, res) {
        const productos = this.productosDb.readData();
        res.json(productos);
    }
}

module.exports = new ProductosControllerClass();
