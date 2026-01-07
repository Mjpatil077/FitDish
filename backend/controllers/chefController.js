const chefs = [
  {
    _id: "c1",
    name: "Chef Riddhi",
    bio: "Healthy Indian cooking expert",
    cuisineSpecialties: ["Gujarati", "Indian"],
    rating: 4.9,
    totalReviews: 120,
    experience: 8,
    isVerified: true,
    avatar: "https://i.pravatar.cc/150?img=10"
  }
];

const Session = require('../models/Session');
const Review = require('../models/Review');

// @desc    Get all chefs
// @route   GET /api/chefs
// @access  Public
exports.getAllChefs = async (req, res) => {
  res.json({
    success: true,
    count: chefs.length,
    chefs
  });
};


// @desc    Get chef profile
// @route   GET /api/chefs/:id
// @access  Public
exports.getChefProfile = async (req, res) => {
  try {
    const chef = await User.findById(req.params.id);
    
    if (!chef || chef.role !== 'chef') {
      return res.status(404).json({
        success: false,
        message: 'Chef not found'
      });
    }

    res.status(200).json({
      success: true,
      chef
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update chef profile
// @route   PUT /api/chefs/profile
// @access  Private (Chef)
exports.updateChefProfile = async (req, res) => {
  try {
    const { bio, cuisineSpecialties, experience, avatar } = req.body;
    
    const chef = await User.findByIdAndUpdate(
      req.user.id,
      { bio, cuisineSpecialties, experience, avatar },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      chef
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get chef sessions
// @route   GET /api/chefs/:id/sessions
// @access  Public
exports.getChefSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ 
      chef: req.params.id,
      isActive: true,
      scheduledAt: { $gte: new Date() }
    }).sort('scheduledAt');

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get chef reviews
// @route   GET /api/chefs/:id/reviews
// @access  Public
exports.getChefReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ chef: req.params.id })
      .populate('user', 'name avatar')
      .sort('-createdAt')
      .limit(10);

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

