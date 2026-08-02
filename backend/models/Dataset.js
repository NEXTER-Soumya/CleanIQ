const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalFilename: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['uploaded', 'cleaned', 'insights_generated'],
    default: 'uploaded'
  },
  storagePath: {
    type: String,
    required: true
  },
  cleanedPath: {
    type: String,
    default: null
  },
  rowCount: {
    type: Number
  },
  columnCount: {
    type: Number
  }
});

module.exports = mongoose.model('Dataset', datasetSchema);
