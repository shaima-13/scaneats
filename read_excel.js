const xlsx = require('xlsx');
const workbook = xlsx.readFile('Indian Food Ingredients Dataset.xlsx');
const sheet_name_list = workbook.SheetNames;
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
console.log(JSON.stringify(data.slice(0, 2), null, 2));
