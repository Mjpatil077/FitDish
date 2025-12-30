const Video = require('../models/Video');

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
exports.getAllVideos = async (req, res) => {
  try {
    const { category, chefId, isFree } = req.query;
    let query = {};

    if (isFree === 'true') {
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

    const videos = await Video.find(query)
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

    const videos = await Video.find({ category: category._id })
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

