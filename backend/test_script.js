const fs = require('fs');
const Papa = require('papaparse');
const { cleanDataset } = require('./utils/dataCleaner');

const csvData = fs.readFileSync('C:/Users/Dell/.gemini/antigravity/brain/37da7d40-8690-4865-b5fb-5519453fcfe0/scratch/test.csv', 'utf8');
const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });
const rows = parsed.data;
const headers = parsed.meta.fields;

const columns = [
  { columnName: 'id', nullHandling: 'leave', inferredDtype: 'number' },
  { columnName: 'name', nullHandling: 'drop', inferredDtype: 'string' },
  { columnName: 'age', nullHandling: 'drop', inferredDtype: 'number' }
];

cleanDataset(rows, headers, columns).then(cleanedRows => {
  console.log('Original rows:', rows.length);
  console.log('Cleaned rows:', cleanedRows.length);
  console.log(cleanedRows);
}).catch(console.error);
