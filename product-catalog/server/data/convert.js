let csvToJson = require('convert-csv-to-json');

let input = 'data.csv';
let output = 'data.json';

csvToJson.generateJsonFileFromCsv(input, output);