const DataBase = require('./ControllerDataBase');
const bcrypt = require('bcryptjs');

class UserController {
  constructor() {
    this.userDb = new DataBase('usuarios');
  }

  getAllUsers() {
    return this.userDb.readData();
  }

  addUser(user) {
    const users = this.userDb.readData();
    user.password = bcrypt.hashSync(user.password, 10); // Encriptamos la contraseña
    users.push(user);
    this.userDb.writeData(users);
  }

  getUserByUsername(username) {
    const users = this.userDb.readData();
    return users.find(user => user.username === username);
  }
}

module.exports = new UserController();
