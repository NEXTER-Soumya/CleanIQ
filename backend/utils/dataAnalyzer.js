/**
 * Data Analyzer Utility
 */

const nullValues = new Set(['', 'null', 'NULL', 'N/A', 'NA', 'n/a', 'NaN', 'undefined']);

const isNull = (val) => {
  if (val === null || val === undefined) return true;
  if (typeof val === 'string' && nullValues.has(val.trim())) return true;
  return false;
};

const inferDtypeAndMisprints = (columnData) => {
  let numberCount = 0;
  let dateCount = 0;
  let booleanCount = 0;
  let stringCount = 0;
  let totalValid = 0;
  
  const sampleValues = [];

  // First pass to infer type and get samples
  for (const item of columnData) {
    if (isNull(item)) continue;
    
    totalValid++;
    if (sampleValues.length < 5) sampleValues.push(item);

    if (typeof item === 'boolean' || ['true', 'false', 'yes', 'no', '1', '0'].includes(String(item).toLowerCase())) {
      booleanCount++;
    } else if (!isNaN(parseFloat(item)) && isFinite(item)) {
      numberCount++;
    } else if (!isNaN(Date.parse(item))) {
      dateCount++;
    } else {
      stringCount++;
    }
  }

  if (totalValid === 0) return { inferredDtype: 'string', sampleValues };

  let inferredDtype = 'string';
  if (numberCount / totalValid > 0.8) inferredDtype = 'number';
  else if (dateCount / totalValid > 0.8) inferredDtype = 'date';
  else if (booleanCount / totalValid > 0.8) inferredDtype = 'boolean';
  else if (numberCount > 0 && stringCount > 0) inferredDtype = 'mixed';

  const misprintedValues = [];
  
  // Second pass for misprints if type is strict
  if (['number', 'date', 'boolean'].includes(inferredDtype)) {
    for (let i = 0; i < columnData.length; i++) {
      const item = columnData[i];
      if (isNull(item)) continue;
      
      let isMisprint = false;
      let reason = '';

      if (inferredDtype === 'number' && (isNaN(parseFloat(item)) || !isFinite(item))) {
        isMisprint = true;
        reason = `Expected number, got '${item}'`;
      } else if (inferredDtype === 'date' && isNaN(Date.parse(item))) {
        isMisprint = true;
        reason = `Inconsistent date format: '${item}'`;
      } else if (inferredDtype === 'boolean' && !['true', 'false', 'yes', 'no', '1', '0', true, false].includes(typeof item === 'string' ? item.toLowerCase() : item)) {
        isMisprint = true;
        reason = `Expected boolean, got '${item}'`;
      }

      if (isMisprint) {
        misprintedValues.push({ rowIndex: i, value: item, reason });
      }
    }
  }

  return { inferredDtype, misprintedValues, sampleValues };
};

const analyzeDataset = async (rows, headers) => {
  const columns = [];
  
  for (const header of headers) {
    const columnData = rows.map(row => row[header]);
    
    const nullCount = columnData.filter(isNull).length;
    const { inferredDtype, misprintedValues, sampleValues } = inferDtypeAndMisprints(columnData);
    
    columns.push({
      columnName: header,
      inferredDtype,
      nullCount,
      misprintedValues,
      sampleValues,
      duplicateCount: 0 // handled row-wise generally, but keeping struct per requirements
    });
  }

  // Detect duplicate rows
  const seenRows = new Set();
  const duplicateRowIndices = [];
  
  for (let i = 0; i < rows.length; i++) {
    const rowString = JSON.stringify(rows[i]);
    if (seenRows.has(rowString)) {
      duplicateRowIndices.push(i);
    } else {
      seenRows.add(rowString);
    }
  }

  return {
    columns,
    duplicateRowIndices,
    totalDuplicates: duplicateRowIndices.length
  };
};

module.exports = { analyzeDataset };
