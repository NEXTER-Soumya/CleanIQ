const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    default: ''
  },
  realName: {
    type: String,
    default: ''
  },
  profession: {
    type: String,
    default: ''
  },
  profilePicture: {
    type: String,
    default: ''
  },
  subscriptionExpiry: {
    type: Date,
    default: null
  },
  activePlan: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free'
  },
  datasetsCleanedCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
