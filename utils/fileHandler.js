const fs = require('fs');
const path = require('path');

// Función para leer datos de un archivo JSON
function readData(file) {
  const filePath = path.join(__dirname, '..', 'models', file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

// Función para escribir datos en un archivo JSON
function writeData(file, data) {
  const filePath = path.join(__dirname, '..', 'models', file);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = { readData, writeData };
