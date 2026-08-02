const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const xlsx = require('xlsx');
const Dataset = require('../models/Dataset');
const DatasetColumn = require('../models/DatasetColumn');
const { analyzeDataset } = require('../utils/dataAnalyzer');
const { cleanDataset: cleanDataUtil } = require('../utils/dataCleaner');
const ai = require('../config/gemini');
const Insight = require('../models/Insight');

const uploadDataset = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const originalFilename = req.file.originalname;
    const ext = path.extname(originalFilename).toLowerCase();
    
    let rows = [];
    let headers = [];

    if (ext === '.csv') {
      const csvData = fs.readFileSync(filePath, 'utf8');
      const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });
      rows = parsed.data;
      headers = parsed.meta.fields;
    } else if (ext === '.xlsx' || ext === '.xls') {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      rows = xlsx.utils.sheet_to_json(sheet);
      if (rows.length > 0) {
        headers = Object.keys(rows[0]);
      }
    } else {
      return res.status(400).json({ error: 'Unsupported file format' });
    }

    const analysis = await analyzeDataset(rows, headers);

    const dataset = await Dataset.create({
      userId: req.user._id,
      originalFilename,
      storagePath: filePath,
      rowCount: rows.length,
      columnCount: headers.length
    });

    const columnDocs = analysis.columns.map(col => ({
      datasetId: dataset._id,
      columnName: col.columnName,
      inferredDtype: col.inferredDtype,
      nullCount: col.nullCount,
      misprintedValues: col.misprintedValues,
      sampleValues: col.sampleValues,
      duplicateCount: 0 
    }));

    const insertedColumns = await DatasetColumn.insertMany(columnDocs);

    res.status(201).json({
      message: 'Dataset uploaded and analyzed',
      datasetId: dataset._id,
      analysis: {
        totalRows: dataset.rowCount,
        totalDuplicates: analysis.totalDuplicates,
        columns: insertedColumns
      }
    });

  } catch (error) {
    next(error);
  }
};

const getDatasetReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dataset = await Dataset.findById(id);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }

    const columns = await DatasetColumn.find({ datasetId: id });
    
    res.json({ dataset, columns });
  } catch (error) {
    next(error);
  }
};

const updateColumn = async (req, res, next) => {
  try {
    const { id, columnId } = req.params;
    const { userOverrideDtype, nullHandling } = req.body;

    const column = await DatasetColumn.findOne({ _id: columnId, datasetId: id });
    if (!column) {
      return res.status(404).json({ error: 'Column not found' });
    }

    if (userOverrideDtype !== undefined) column.userOverrideDtype = userOverrideDtype;
    if (nullHandling !== undefined) column.nullHandling = nullHandling;

    await column.save();

    res.json({ message: 'Column updated successfully', column });
  } catch (error) {
    next(error);
  }
};

const cleanDataset = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dataset = await Dataset.findById(id);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }

    const columns = await DatasetColumn.find({ datasetId: id });

    // Re-parse
    const ext = path.extname(dataset.originalFilename).toLowerCase();
    let rows = [];
    let headers = [];

    if (ext === '.csv') {
      const csvData = fs.readFileSync(dataset.storagePath, 'utf8');
      const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });
      rows = parsed.data;
      headers = parsed.meta.fields;
    } else {
      const workbook = xlsx.readFile(dataset.storagePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      rows = xlsx.utils.sheet_to_json(sheet);
      if (rows.length > 0) {
        headers = Object.keys(rows[0]);
      }
    }

    const cleanedRows = await cleanDataUtil(rows, headers, columns);

    // Save cleaned file
    const cleanedDir = path.join(path.dirname(dataset.storagePath), 'cleaned');
    if (!fs.existsSync(cleanedDir)) {
      fs.mkdirSync(cleanedDir, { recursive: true });
    }

    const cleanedFilename = `cleaned_${path.basename(dataset.storagePath)}`;
    const cleanedPath = path.join(cleanedDir, cleanedFilename);

    if (ext === '.csv') {
      const csvStr = Papa.unparse(cleanedRows);
      fs.writeFileSync(cleanedPath, csvStr);
    } else {
      const newSheet = xlsx.utils.json_to_sheet(cleanedRows);
      const newWorkbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(newWorkbook, newSheet, 'Cleaned Data');
      xlsx.writeFile(newWorkbook, cleanedPath);
    }

    dataset.status = 'cleaned';
    dataset.cleanedPath = cleanedPath;
    await dataset.save();

    req.user.datasetsCleanedCount += 1;
    await req.user.save();

    res.json({
      message: 'Dataset cleaned successfully',
      cleanedRowCount: cleanedRows.length,
      dataset
    });

  } catch (error) {
    next(error);
  }
};

const generateInsights = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dataset = await Dataset.findById(id);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }

    if (dataset.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Use cleaned data if available, else fallback to original
    const dataPath = dataset.cleanedPath || dataset.storagePath;
    if (!fs.existsSync(dataPath)) {
      return res.status(404).json({ error: 'Dataset file not found on disk' });
    }

    // Parse the file
    const ext = path.extname(dataPath).toLowerCase();
    let rows = [];
    if (ext === '.csv') {
      const csvData = fs.readFileSync(dataPath, 'utf8');
      const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });
      rows = parsed.data;
    } else {
      const workbook = xlsx.readFile(dataPath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      rows = xlsx.utils.sheet_to_json(sheet);
    }

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Dataset is empty' });
    }

    const headers = Object.keys(rows[0]);
    
    // Compute summary stats to send to AI
    const summaryStats = {};
    headers.forEach(header => {
      summaryStats[header] = {
        type: 'unknown',
        nonNullCount: 0,
        sampleValues: []
      };
    });

    // We'll just infer type based on first few non-null values
    // and collect up to 10 unique values for categorical, or min/max/mean for numeric.
    for (const header of headers) {
      const values = rows.map(r => r[header]).filter(v => v !== null && v !== undefined && v !== '');
      summaryStats[header].nonNullCount = values.length;
      if (values.length === 0) continue;

      // Check if mostly numeric
      const numericValues = values.map(v => Number(v)).filter(v => !isNaN(v));
      if (numericValues.length > values.length * 0.8) {
        summaryStats[header].type = 'numeric';
        const sum = numericValues.reduce((a, b) => a + b, 0);
        summaryStats[header].mean = sum / numericValues.length;
        summaryStats[header].min = Math.min(...numericValues);
        summaryStats[header].max = Math.max(...numericValues);
      } else {
        summaryStats[header].type = 'categorical';
        // count frequencies
        const counts = {};
        values.forEach(v => {
          counts[v] = (counts[v] || 0) + 1;
        });
        const topCategories = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(entry => `${entry[0]} (${entry[1]})`);
        summaryStats[header].topCategories = topCategories;
      }
    }

    if (!ai) {
      // For local testing if API key is not set, just return mock data
      const mockInsight = await Insight.create({
        datasetId: id,
        generatedText: [
          "This is a mock insight because Gemini API key is missing.",
          "The dataset has " + headers.length + " columns."
        ],
        chartConfigs: [
          { type: 'bar', xKey: headers[0], yKey: headers[1] || headers[0], title: 'Mock Chart' }
        ]
      });
      return res.json(mockInsight);
    }

const prompt = `
You are a data analyst AI. Analyze the following dataset summary statistics and provide 5 to 8 insightful written observations about the data.

Summary Statistics (JSON):
${JSON.stringify(summaryStats, null, 2)}

Respond ONLY with a valid JSON object (no markdown, no backticks). The JSON structure MUST be:
{
  "generatedText": ["insight 1", "insight 2", "insight 3", "insight 4", "insight 5"],
  "suggestedQuestions": ["Question 1?", "Question 2?", "Question 3?", "Question 4?"]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    let textResponse = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Strip markdown formatting if AI still adds it
    if (textResponse.startsWith('```json')) {
      textResponse = textResponse.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (textResponse.startsWith('```')) {
      textResponse = textResponse.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }
    
    let parsedResult;
    try {
      parsedResult = JSON.parse(textResponse);
    } catch (err) {
      console.error("Failed to parse Gemini response:", textResponse);
      return res.status(500).json({ error: 'AI returned invalid JSON' });
    }

    const insight = await Insight.create({
      datasetId: id,
      generatedText: parsedResult.generatedText || [],
      chartConfigs: parsedResult.chartConfigs || [],
      suggestedQuestions: parsedResult.suggestedQuestions || []
    });

    dataset.status = 'insights_generated';
    await dataset.save();

    res.status(201).json(insight);
  } catch (error) {
    next(error);
  }
};

const deleteDataset = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dataset = await Dataset.findOne({ _id: id, userId: req.user._id });
    
    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }

    // Delete associated columns and insights
    await DatasetColumn.deleteMany({ datasetId: id });
    await Insight.deleteOne({ datasetId: id });
    
    // Delete the dataset itself
    await Dataset.deleteOne({ _id: id });

    res.status(200).json({ message: 'Dataset deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getInsights = async (req, res, next) => {
  try {
    const { id } = req.params;
    const insight = await Insight.findOne({ datasetId: id }).sort({ generatedAt: -1 });
    if (!insight) {
      return res.status(404).json({ error: 'Insights not found' });
    }
    res.json(insight);
  } catch (error) {
    next(error);
  }
};

const getDatasetData = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dataset = await Dataset.findById(id);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }

    const dataPath = dataset.cleanedPath || dataset.storagePath;
    if (!fs.existsSync(dataPath)) {
      return res.status(404).json({ error: 'Data file not found' });
    }

    const ext = path.extname(dataPath).toLowerCase();
    let rows = [];
    if (ext === '.csv') {
      const csvData = fs.readFileSync(dataPath, 'utf8');
      const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });
      rows = parsed.data;
    } else {
      const workbook = xlsx.readFile(dataPath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      rows = xlsx.utils.sheet_to_json(sheet);
    }
    
    const nullValues = new Set(['', 'null', 'NULL', 'N/A', 'NA', 'n/a', 'NaN', 'undefined']);
    let totalNulls = 0;
    const seenRows = new Set();
    let totalDuplicates = 0;

    for (const row of rows) {
      const rowStr = JSON.stringify(row);
      if (seenRows.has(rowStr)) {
        totalDuplicates++;
      } else {
        seenRows.add(rowStr);
      }
      for (const key in row) {
        const val = row[key];
        if (val === null || val === undefined) {
          totalNulls++;
        } else if (typeof val === 'string' && nullValues.has(val.trim())) {
          totalNulls++;
        }
      }
    }

    // For performance, limit to 500 rows for charting if it's very large
    res.json({
      data: rows.slice(0, 500),
      stats: {
        totalRows: rows.length,
        totalColumns: rows.length > 0 ? Object.keys(rows[0]).length : 0,
        totalNulls,
        totalDuplicates
      }
    });
  } catch (error) {
    next(error);
  }
};

const getDatasets = async (req, res, next) => {
  try {
    const datasets = await Dataset.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(datasets);
  } catch (error) {
    next(error);
  }
};

const downloadDataset = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { format } = req.query; // 'csv' or 'xlsx'
    
    const dataset = await Dataset.findById(id);
    if (!dataset) {
      return res.status(404).json({ error: 'Dataset not found' });
    }
    if (dataset.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const dataPath = dataset.cleanedPath || dataset.storagePath;
    if (!fs.existsSync(dataPath)) {
      return res.status(404).json({ error: 'Data file not found' });
    }

    const ext = path.extname(dataPath).toLowerCase();
    
    // If they request the same format it's stored in, just send the file
    if ((format === 'csv' && ext === '.csv') || (format === 'xlsx' && (ext === '.xlsx' || ext === '.xls'))) {
      return res.download(dataPath, `CleanIQ_Dataset_${dataset.originalFilename.replace(/\.[^/.]+$/, "")}.${format}`);
    }

    // Otherwise, convert
    let rows = [];
    if (ext === '.csv') {
      const csvData = fs.readFileSync(dataPath, 'utf8');
      const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });
      rows = parsed.data;
    } else {
      const workbook = xlsx.readFile(dataPath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      rows = xlsx.utils.sheet_to_json(sheet);
    }

    const baseName = path.basename(dataset.originalFilename, ext);
    if (format === 'csv') {
      const csvStr = Papa.unparse(rows);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="CleanIQ_Dataset_${baseName}.csv"`);
      return res.send(csvStr);
    } else if (format === 'xlsx') {
      const newSheet = xlsx.utils.json_to_sheet(rows);
      const newWorkbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(newWorkbook, newSheet, 'Data');
      const buffer = xlsx.write(newWorkbook, { type: 'buffer', bookType: 'xlsx' });
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="CleanIQ_Dataset_${baseName}.xlsx"`);
      return res.send(buffer);
    } else {
      return res.status(400).json({ error: 'Unsupported format requested' });
    }
  } catch (error) {
    next(error);
  }
};

const askQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { prompt: userPrompt } = req.body;
    
    if (!userPrompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const dataset = await Dataset.findById(id);
    if (!dataset) return res.status(404).json({ error: 'Dataset not found' });
    if (dataset.userId.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Not authorized' });

    const dataPath = dataset.cleanedPath || dataset.storagePath;
    if (!fs.existsSync(dataPath)) return res.status(404).json({ error: 'Dataset file not found' });

    const ext = path.extname(dataPath).toLowerCase();
    let rows = [];
    if (ext === '.csv') {
      const csvData = fs.readFileSync(dataPath, 'utf8');
      rows = Papa.parse(csvData, { header: true, skipEmptyLines: true }).data;
    } else {
      const workbook = xlsx.readFile(dataPath);
      rows = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    }
    if (rows.length === 0) return res.status(400).json({ error: 'Dataset is empty' });

    const headers = Object.keys(rows[0]);
    const summaryStats = {};
    headers.forEach(header => {
      summaryStats[header] = { type: 'unknown', nonNullCount: 0, sampleValues: [] };
    });

    for (const header of headers) {
      const values = rows.map(r => r[header]).filter(v => v !== null && v !== undefined && v !== '');
      summaryStats[header].nonNullCount = values.length;
      if (values.length === 0) continue;

      const numericValues = values.map(v => Number(v)).filter(v => !isNaN(v));
      if (numericValues.length > values.length * 0.8) {
        summaryStats[header].type = 'numeric';
        const sum = numericValues.reduce((a, b) => a + b, 0);
        summaryStats[header].mean = sum / numericValues.length;
        summaryStats[header].min = Math.min(...numericValues);
        summaryStats[header].max = Math.max(...numericValues);
      } else {
        summaryStats[header].type = 'categorical';
        const counts = {};
        values.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
        summaryStats[header].topCategories = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(entry => `${entry[0]} (${entry[1]})`);
      }
    }

    if (!ai) return res.status(500).json({ error: 'AI not configured' });

    const prompt = `
You are a data analyst AI. The user has a dataset with the following summary statistics:
${JSON.stringify(summaryStats, null, 2)}

The user asks: "${userPrompt}"

Answer their question by providing 1 or 2 written insights answering their question directly, and exactly 1 chart configuration that visually represents the answer. If a chart doesn't make sense, you can omit the chart config.
IMPORTANT: When grouping data (like "average age by gender"), you MUST specify "aggregation": "average".

Respond ONLY with a valid JSON object:
{
  "generatedText": ["your answer..."],
  "chartConfigs": [
    { "type": "bar" | "line" | "pie", "xKey": "columnNameForX", "yKey": "columnNameForY", "title": "Chart Title", "aggregation": "sum" | "average" | "count" | "none" }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    let textResponse = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (textResponse.startsWith('```json')) {
      textResponse = textResponse.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (textResponse.startsWith('```')) {
      textResponse = textResponse.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }
    
    let parsedResult;
    try {
      parsedResult = JSON.parse(textResponse);
    } catch (err) {
      return res.status(500).json({ error: 'AI returned invalid JSON' });
    }

    res.status(200).json(parsedResult);
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadDataset, getDatasets, getDatasetReport, updateColumn, cleanDataset, generateInsights, getInsights, getDatasetData, deleteDataset, downloadDataset, askQuestion };
