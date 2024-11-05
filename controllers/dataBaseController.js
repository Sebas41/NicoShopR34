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
    const data = fs.readFileSync(this.filePath);
    return JSON.parse(data);
  }

  writeData(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }
}

module.exports = DataBase;
