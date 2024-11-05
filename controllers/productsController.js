const DataBase = require('./ControllerDataBase');
const Joi = require('joi');

const productSchema = Joi.object({
  nombre: Joi.string().min(1).required(),
  descripcion: Joi.string().min(1).required(),
  precio: Joi.number().positive().required(),
  cantidad: Joi.number().integer().min(0).required()
});

class ProductController {
  constructor() {
    this.productDb = new DataBase('productos');
  }

  addProduct(req, res) {
    const { error } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newProduct = { id: Date.now(), ...req.body };
    const products = this.productDb.readData();
    products.push(newProduct);
    this.productDb.writeData(products);
    res.status(201).json({ message: 'Producto agregado con éxito', product: newProduct });
  }

  getProducts(req, res) {
    res.json(this.productDb.readData());
  }
}

module.exports = new ProductController();
