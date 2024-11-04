const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { readData, writeData } = require('../utils/fileHandler');
const Joi = require('joi');

const SECRET_KEY = process.env.SECRET_KEY || 'claveSuperSecreta';

// Esquema de validación para registro
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'cliente').required()
});

// Esquema de validación para inicio de sesión
const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

// Función para registrar un nuevo usuario
function registerUser(req, res) {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { username, password, role } = req.body;
  const usuarios = readData('usuarios.json');

  const existingUser = usuarios.find(u => u.username === username);
  if (existingUser) {
    return res.status(409).json({ message: 'El usuario ya existe' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = { id: Date.now(), username, password: hashedPassword, role };
  usuarios.push(newUser);
  writeData('usuarios.json', usuarios);

  res.status(201).json({ message: 'Usuario registrado con éxito' });
}

// Función para iniciar sesión
function loginUser(req, res) {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { username, password } = req.body;
  const usuarios = readData('usuarios.json');
  const user = usuarios.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({ message: 'Usuario no encontrado' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Contraseña incorrecta' });
  }

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ message: 'Inicio de sesión exitoso', token });
}

module.exports = { registerUser, loginUser };
