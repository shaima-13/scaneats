const xlsx = require('xlsx');
const fs = require('fs');
const workbook = xlsx.readFile('Indian Food Ingredients Dataset.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);
const jsonData = JSON.stringify(data, null, 2);
fs.writeFileSync('src/data/localProducts.json', jsonData, 'utf8');
console.log('Successfully wrote src/data/localProducts.json');
