const WatchHistory = require('../models/WatchHistory');

// @desc    Get user watch history
// @route   GET /api/watch-history
// @access  Private
exports.getWatchHistory = async (req, res) => {
  try {
    const watchHistory = await WatchHistory.find({ user: req.user.id })
      .populate('video', 'title thumbnail duration caloriesEstimate')
      .populate('video.chef', 'name')
      .populate('video.category', 'name slug')
      .sort('-watchedAt')
      .limit(50);

    res.status(200).json({
      success: true,
      count: watchHistory.length,
      watchHistory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get recent watches
// @route   GET /api/watch-history/recent
// @access  Private
exports.getRecentWatches = async (req, res) => {
  try {
    const recentWatches = await WatchHistory.find({ user: req.user.id })
      .populate('video', 'title thumbnail duration youtubeEmbedUrl')
      .populate('video.chef', 'name avatar')
      .sort('-watchedAt')
      .limit(6);

    res.status(200).json({
      success: true,
      count: recentWatches.length,
      recentWatches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add to watch history
// @route   POST /api/watch-history
// @access  Private
exports.addToWatchHistory = async (req, res) => {
  try {
    const { videoId, progress } = req.body;

    let watchHistory = await WatchHistory.findOne({
      user: req.user.id,
      video: videoId
    });

    if (watchHistory) {
      watchHistory.progress = progress || watchHistory.progress;
      watchHistory.watchedAt = new Date();
      watchHistory.completed = progress >= 90;
      await watchHistory.save();
    } else {
      watchHistory = await WatchHistory.create({
        user: req.user.id,
        video: videoId,
        progress: progress || 0,
        completed: progress >= 90
      });
    }

    res.status(200).json({
      success: true,
      watchHistory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update watch progress
// @route   PUT /api/watch-history/:videoId
// @access  Private
exports.updateWatchProgress = async (req, res) => {
  try {
    const { progress } = req.body;

    let watchHistory = await WatchHistory.findOne({
      user: req.user.id,
      video: req.params.videoId
    });

    if (!watchHistory) {
      watchHistory = await WatchHistory.create({
        user: req.user.id,
        video: req.params.videoId,
        progress: progress || 0
      });
    } else {
      watchHistory.progress = progress;
      watchHistory.watchedAt = new Date();
      watchHistory.completed = progress >= 90;
      await watchHistory.save();
    }

    res.status(200).json({
      success: true,
      watchHistory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

