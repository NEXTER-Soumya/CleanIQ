const mongoose = require('mongoose');

const chartConfigSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true, // e.g. 'bar', 'line', 'pie'
  },
  xKey: {
    type: String,
    required: true
  },
  yKey: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  aggregation: {
    type: String,
    enum: ['sum', 'average', 'count', 'none'],
    default: 'sum'
  }
});

const insightSchema = new mongoose.Schema({
  datasetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dataset',
    required: true
  },
  generatedText: {
    type: [String],
    required: true
  },
  chartConfigs: {
    type: [chartConfigSchema],
    default: []
  },
  suggestedQuestions: [{
    type: String
  }],
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Insight', insightSchema);
