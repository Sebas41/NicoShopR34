const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { readData, writeData } = require('../utils/fileHandler');

const SECRET_KEY = 'claveSuperSecreta'; // En producción, usa variables de entorno

// Función para registrar un nuevo usuario
function registerUser(req, res) {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

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
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

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
