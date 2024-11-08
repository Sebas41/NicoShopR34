// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY || 'claveSuperSecreta';

/**
 * Middleware para verificar el token JWT.
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado: Token no proporcionado' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        req.user = user; // Agrega la información del usuario al objeto de solicitud
        next();
    });
}

/**
 * Middleware para verificar si el usuario tiene rol de administrador.
 */
function authorizeAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado: Requiere permisos de administrador' });
    }
    next();
}

module.exports = { authenticateToken, authorizeAdmin };
