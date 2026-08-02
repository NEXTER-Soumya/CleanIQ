const fs = require('fs');
const Papa = require('papaparse');
const { cleanDataset } = require('./utils/dataCleaner');

// create a dummy csv
fs.writeFileSync('test_debug.csv', `id,name,age,salary
1,Alice,25,50000
2,,30,60000
3,Charlie,,70000
4,David,40,
5,Eve,45,90000`);

const csvData = fs.readFileSync('test_debug.csv', 'utf8');
const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });
const rows = parsed.data;
const headers = parsed.meta.fields;

const columns = [
  { columnName: 'id', nullHandling: 'leave', inferredDtype: 'number' },
  { columnName: 'name', nullHandling: 'drop', inferredDtype: 'string' },
  { columnName: 'age', nullHandling: 'drop', inferredDtype: 'number' },
  { columnName: 'salary', nullHandling: 'leave', inferredDtype: 'number' }
];

cleanDataset(rows, headers, columns).then(cleanedRows => {
  console.log('Original rows:', rows.length);
  console.log('Cleaned rows:', cleanedRows.length);
  console.log(Papa.unparse(cleanedRows));
}).catch(console.error);
