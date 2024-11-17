// authController.js

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const UserController = require('./userController');
const Joi = require('joi');

const SECRET_KEY = process.env.SECRET_KEY || 'claveSuperSecreta';

// Esquemas de validación usando Joi
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
  /**
   * Registra un nuevo usuario.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  registerUser(req, res) {
    // Validar los datos de entrada
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, password, role } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = UserController.getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: 'El usuario ya existe' });
    }

    // Generar un salt aleatorio
    const salt = crypto.randomBytes(16).toString('hex');

    // Hashear la contraseña usando pbkdf2Sync
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');

    // Crear el objeto de usuario
    const newUser = {
      id: Date.now(),
      username,
      password: hashedPassword,
      salt,
      role
    };

    // Agregar el usuario a la base de datos
    UserController.addUser(newUser);

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  }

  /**
   * Inicia sesión de un usuario existente.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   */
  loginUser(req, res) {
    // Validar los datos de entrada
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, password } = req.body;

    // Buscar el usuario por username
    const user = UserController.getUserByUsername(username);


    // Verificar si el usuario existe
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // Hashear la contraseña ingresada usando el salt almacenado
    const hashedPassword = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha256').toString('hex');
    // Comparar las contraseñas hasheadas
    if (hashedPassword !== user.password) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    console.log('Token generado:', token); // Para depuración

    res.json({ message: 'Inicio de sesión exitoso', token });
  }
}

module.exports = new AuthController();
