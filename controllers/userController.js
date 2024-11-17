// userController.js

const DataBase = require('./dataBaseController');

class UserControllerClass {
  constructor() {
    // Inicializar la base de datos de usuarios
    this.userDb = new DataBase('usuarios');
  }

  /**
   * Obtiene todos los usuarios.
   * @returns {Array} - Lista de usuarios.
   */
  getAllUsers() {
    return this.userDb.readData();
  }

  /**
   * Agrega un nuevo usuario a la base de datos.
   * @param {Object} user - Objeto de usuario.
   */
  addUser(user) {
    const users = this.userDb.readData();
    users.push(user);
    this.userDb.writeData(users);
  }

  /**
   * Obtiene un usuario por su username.
   * @param {string} username - Nombre de usuario.
   * @returns {Object|undefined} - Usuario encontrado o undefined.
   */
  getUserByUsername(username) {
    const users = this.userDb.readData();
    return users.find(user => user.username === username);
  }
}

module.exports = new UserControllerClass();
