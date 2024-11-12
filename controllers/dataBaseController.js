// dataBaseController.js

const fs = require('fs');
const path = require('path');

class DataBase {
  /**
   * Crea una instancia de DataBase.
   * @param {string} fileName - Nombre del archivo JSON (sin extensión).
   */
  constructor(fileName) {
    this.filePath = path.join(__dirname, '..', 'models', `${fileName}.json`);
    // Si el archivo no existe, crearlo con un arreglo vacío
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]));
    }
  }

  /**
   * Lee los datos del archivo JSON.
   * @returns {Array} - Datos almacenados.
   */
  readData() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error(`Error leyendo el archivo ${this.filePath}:`, err);
      return [];
    }
  }

  /**
   * Escribe datos en el archivo JSON.
   * @param {Array} data - Datos a escribir.
   */
  writeData(data) {
    try {
        console.log(`Escribiendo datos en ${this.filePath}`);
        console.log("Datos que se van a escribir:", JSON.stringify(data, null, 2));
        fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
        console.log(`Datos escritos correctamente en ${this.filePath}`);
    } catch (err) {
        console.error(`Error escribiendo en el archivo ${this.filePath}:`, err);
    }
  }
}

module.exports = DataBase;
