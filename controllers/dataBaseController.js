const fs = require('fs');
const path = require('path');

class DataBase {
  constructor(fileName) {
    this.filePath = path.join(__dirname, '..', 'models', `${fileName}.json`);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]));
    }
  }

  readData() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al leer el archivo:', error);
      return [];
    }
  }

  writeData(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }
}

module.exports = DataBase;
