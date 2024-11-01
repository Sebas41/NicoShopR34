const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Funciones para registrar e iniciar sesión
const secretKey = 'secretKey123'; // Usa una clave más segura en producción

function generarToken(usuario) {
  return jwt.sign({ id: usuario.id }, secretKey, { expiresIn: '1h' });
}

module.exports = { generarToken };