const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserController = require('./ControllerUser');
const Joi = require('joi');

const SECRET_KEY = process.env.SECRET_KEY || 'claveSuperSecreta';

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'cliente').required()
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

class AuthController {
  registerUser(req, res) {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, password, role } = req.body;
    const existingUser = UserController.getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: 'El usuario ya existe' });
    }

    UserController.addUser({ id: Date.now(), username, password, role });
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  }

  loginUser(req, res) {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, password } = req.body;
    const user = UserController.getUserByUsername(username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Inicio de sesión exitoso', token });
  }
}

module.exports = new AuthController();
