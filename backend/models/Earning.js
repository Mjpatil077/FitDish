const mongoose = require('mongoose');

const earningSchema = new mongoose.Schema({
  chef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  source: {
    type: String,
    enum: ['video', 'course', 'session'],
    required: true
  },
  sourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for efficient queries
earningSchema.index({ chef: 1, date: -1 });
earningSchema.index({ chef: 1, source: 1 });

module.exports = mongoose.model('Earning', earningSchema);

