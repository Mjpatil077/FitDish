const Video = require('../models/Video');

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public (limited for non-logged-in users)
exports.getAllVideos = async (req, res) => {
  try {
    const { category, chefId, isFree } = req.query;
    let query = {};

    // For non-logged-in users, only show free videos (limit to 5)
    // For logged-in users, show all videos
    if (!req.user) {
      query.isFree = true;
    } else if (isFree === 'true') {
      query.isFree = true;
    }

    if (category) {
      // Find category by name or slug
      const Category = require('../models/Category');
      const categoryDoc = await Category.findOne({ 
        $or: [
          { name: category },
          { slug: category.toLowerCase() }
        ]
      });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    if (chefId) {
      query.chef = chefId;
    }

    let videos = await Video.find(query)
      .populate('chef', 'name avatar rating')
      .populate('category', 'name type slug imageUrl')
      .sort('-createdAt');

    // Limit free videos for non-logged-in users
    if (!req.user && videos.length > 5) {
      videos = videos.slice(0, 5);
    }

    res.status(200).json({
      success: true,
      count: videos.length,
      videos,
      isLimited: !req.user && videos.length >= 5
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single video
// @route   GET /api/videos/:id
// @access  Public
exports.getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('chef', 'name avatar bio rating cuisineSpecialties')
      .populate('category', 'name type slug imageUrl');

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    // Increment views
    video.views += 1;
    await video.save();

    res.status(200).json({
      success: true,
      video
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get videos by category
// @route   GET /api/videos/category/:categorySlug
// @access  Public
exports.getVideosByCategory = async (req, res) => {
  try {
    const Category = require('../models/Category');
    const category = await Category.findOne({ slug: req.params.categorySlug });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    let query = { category: category._id };
    
    // For non-logged-in users, only show free videos
    if (!req.user) {
      query.isFree = true;
    }

    let videos = await Video.find(query)
      .populate('chef', 'name avatar rating')
      .populate('category', 'name type slug imageUrl')
      .sort('-createdAt');

    // Limit free videos for non-logged-in users
    if (!req.user && videos.length > 5) {
      videos = videos.slice(0, 5);
    }

    res.status(200).json({
      success: true,
      count: videos.length,
      videos,
      isLimited: !req.user && videos.length >= 5
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get my videos (for chef)
// @route   GET /api/videos/chef/me
// @access  Private (Chef)
exports.getMyVideos = async (req, res) => {
  try {
    const videos = await Video.find({ chef: req.user.id })
      .populate('chef', 'name avatar rating')
      .populate('category', 'name type slug imageUrl')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: videos.length,
      videos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get videos by chef
// @route   GET /api/videos/chef/:chefId
// @access  Public
exports.getVideosByChef = async (req, res) => {
  try {
    const videos = await Video.find({ chef: req.params.chefId })
      .populate('chef', 'name avatar rating')
      .populate('category', 'name type slug imageUrl')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: videos.length,
      videos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

