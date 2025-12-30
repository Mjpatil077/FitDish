const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort('type name');
    
    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get categories by type
// @route   GET /api/categories/type/:type
// @access  Public
exports.getCategoriesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const categories = await Category.find({ type }).sort('name');
    
    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single category by slug or id with related data
// @route   GET /api/categories/:identifier
// @access  Public
exports.getCategory = async (req, res) => {
  try {
    const { identifier } = req.params;
    let category;
    
    // Try to find by slug first (case-insensitive), then by id
    category = await Category.findOne({ 
      slug: identifier.toLowerCase() 
    });
    if (!category) {
      category = await Category.findById(identifier);
    }
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Fetch related videos and chefs
    const Video = require('../models/Video');
    const User = require('../models/User');
    
    // Get videos for this category
    const relatedVideos = await Video.find({ 
      category: category._id,
      isFree: true 
    })
      .populate('chef', 'name avatar rating')
      .populate('category', 'name type slug imageUrl')
      .sort('-createdAt')
      .limit(12);

    // Get chefs who specialize in this category (match by slug)
    const relatedChefs = await User.find({
      role: 'chef',
      $or: [
        { cuisineSpecialties: category.slug },
        { cuisineSpecialties: category.name.toLowerCase() },
        { cuisineSpecialties: { $regex: new RegExp(category.slug, 'i') } }
      ]
    })
      .select('name avatar rating totalReviews bio cuisineSpecialties isVerified')
      .limit(12);

    res.status(200).json({
      success: true,
      category,
      relatedVideos,
      relatedChefs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

