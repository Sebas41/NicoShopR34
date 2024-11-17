// createAdmin.js

const crypto = require('crypto');
const UserController = require('./controllers/userController');

// Datos del administrador
const username = 'admin'; // Cambia esto según prefieras
const password = 'admin123'; // Cambia esto por una contraseña segura

// Verificar si el usuario ya existe
const existingUser = UserController.getUserByUsername(username);
if (existingUser) {
    console.log('El usuario administrador ya existe.');
    process.exit(0);
}

// Generar salt y hash
const salt = crypto.randomBytes(16).toString('hex');
const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');

// Crear el objeto de usuario administrador
const adminUser = {
    id: Date.now(),
    username,
    password: hashedPassword,
    salt,
    role: 'admin'
};

// Agregar el usuario a la base de datos
UserController.addUser(adminUser);

console.log(`Usuario administrador creado con éxito:
    Username: ${adminUser.username}
    Password: ${password}
`);
