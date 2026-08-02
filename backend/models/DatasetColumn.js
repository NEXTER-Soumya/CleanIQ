const mongoose = require('mongoose');

const datasetColumnSchema = new mongoose.Schema({
  datasetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dataset',
    required: true
  },
  columnName: {
    type: String,
    required: true
  },
  inferredDtype: {
    type: String,
    enum: ['number', 'string', 'date', 'boolean', 'mixed'],
    required: true
  },
  userOverrideDtype: {
    type: String,
    enum: ['number', 'string', 'date', 'boolean', null],
    default: null
  },
  nullCount: {
    type: Number,
    default: 0
  },
  duplicateCount: {
    type: Number,
    default: 0
  },
  misprintedValues: [{
    rowIndex: Number,
    value: mongoose.Schema.Types.Mixed,
    reason: String
  }],
  sampleValues: [mongoose.Schema.Types.Mixed],
  nullHandling: {
    type: String,
    enum: ['drop', 'fill_mean', 'fill_mode', 'leave'],
    default: 'leave'
  }
});

module.exports = mongoose.model('DatasetColumn', datasetColumnSchema);
