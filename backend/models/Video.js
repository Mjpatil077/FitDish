const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  chef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  categorySlug: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  caloriesEstimate: {
    type: Number,
    default: 0
  },
  youtubeEmbedUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  isFree: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  thumbnail: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Video', videoSchema);

