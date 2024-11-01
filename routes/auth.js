const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Clave secreta para JWT (en producción, usa una variable de entorno)
const SECRET_KEY = 'claveSuperSecreta';

// Simulación de base de datos de usuarios (puedes reemplazar esto con un archivo JSON o base de datos)
let usuarios = [];

// Ruta de registro de usuario
router.post('/register', (req, res) => {
  const { username, password, role } = req.body; // role puede ser 'admin' o 'cliente'
  const hashedPassword = bcrypt.hashSync(password, 10);

  usuarios.push({ username, password: hashedPassword, role });
  res.status(201).json({ message: 'Usuario registrado con éxito' });
});

// Ruta de inicio de sesión
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = usuarios.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({ message: 'Usuario no encontrado' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Contraseña incorrecta' });
  }

  const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ message: 'Inicio de sesión exitoso', token });
});

module.exports = router;