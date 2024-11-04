const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'claveSuperSecreta';

function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado, falta el token' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Agrega la información del usuario decodificado a la solicitud
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

module.exports = authMiddleware;
