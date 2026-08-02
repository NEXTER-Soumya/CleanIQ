/**
 * Data Cleaner Utility
 */

const nullValues = new Set(['', 'null', 'NULL', 'N/A', 'NA', 'n/a', 'NaN', 'undefined']);

const isNull = (val) => {
  if (val === null || val === undefined) return true;
  if (typeof val === 'string' && nullValues.has(val.trim())) return true;
  return false;
};

const calculateMean = (data) => {
  const validNumbers = data.filter(v => !isNull(v) && !isNaN(parseFloat(v))).map(v => parseFloat(v));
  if (validNumbers.length === 0) return 0;
  const sum = validNumbers.reduce((a, b) => a + b, 0);
  return sum / validNumbers.length;
};

const calculateMode = (data) => {
  const counts = {};
  let maxCount = 0;
  let mode = null;
  
  for (const val of data) {
    if (isNull(val)) continue;
    counts[val] = (counts[val] || 0) + 1;
    if (counts[val] > maxCount) {
      maxCount = counts[val];
      mode = val;
    }
  }
  return mode;
};

const cleanDataset = async (rows, headers, columns) => {
  let cleanedRows = [...rows];
  const rowsToDrop = new Set();

  // Handle nulls and casts
  for (const col of columns) {
    const header = col.columnName;
    const nullHandling = col.nullHandling;
    const dtype = col.userOverrideDtype || col.inferredDtype;
    
    const colData = cleanedRows.map(r => r[header]);
    let fillValue = null;

    if (nullHandling === 'fill_mean' && dtype === 'number') {
      fillValue = calculateMean(colData);
    } else if (nullHandling === 'fill_mode' || nullHandling === 'fill_mean') {
      fillValue = calculateMode(colData);
    }

    for (let i = 0; i < cleanedRows.length; i++) {
      if (isNull(cleanedRows[i][header])) {
        if (nullHandling === 'drop') {
          rowsToDrop.add(i);
        } else if (nullHandling === 'fill_mean' || nullHandling === 'fill_mode') {
          cleanedRows[i][header] = fillValue;
        }
      }

      // Cast
      let val = cleanedRows[i][header];
      if (!isNull(val)) {
        if (dtype === 'number') {
          cleanedRows[i][header] = parseFloat(val) || val;
        } else if (dtype === 'boolean') {
          cleanedRows[i][header] = ['true', 'yes', '1'].includes(String(val).toLowerCase()) ? true : 
                                  ['false', 'no', '0'].includes(String(val).toLowerCase()) ? false : val;
        } else if (dtype === 'string') {
          cleanedRows[i][header] = String(val);
        }
      }
    }
  }

  // Remove rows marked for dropping
  cleanedRows = cleanedRows.filter((_, index) => !rowsToDrop.has(index));

  // Remove duplicates
  const seenRows = new Set();
  const finalRows = [];
  
  for (const row of cleanedRows) {
    const rowString = JSON.stringify(row);
    if (!seenRows.has(rowString)) {
      seenRows.add(rowString);
      finalRows.push(row);
    }
  }

  return finalRows;
};

module.exports = { cleanDataset };
