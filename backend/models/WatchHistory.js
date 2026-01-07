const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  progress: {
    type: Number, // percentage 0-100
    default: 0,
    min: 0,
    max: 100
  },
  watchedAt: {
    type: Date,
    default: Date.now
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
watchHistorySchema.index({ user: 1, watchedAt: -1 });
watchHistorySchema.index({ user: 1, video: 1 }, { unique: true });

module.exports = mongoose.model('WatchHistory', watchHistorySchema);

