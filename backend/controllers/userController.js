const User = require('../models/User');
const Recipe = require('../models/Recipe');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { dietType, fitnessGoals } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { dietType, fitnessGoals },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get saved recipes
// @route   GET /api/users/saved-recipes
// @access  Private
exports.getSavedRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedRecipes');
    res.status(200).json({
      success: true,
      recipes: user.savedRecipes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Save recipe
// @route   POST /api/users/saved-recipes/:recipeId
// @access  Private
exports.saveRecipe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.savedRecipes.includes(req.params.recipeId)) {
      return res.status(400).json({
        success: false,
        message: 'Recipe already saved'
      });
    }

    user.savedRecipes.push(req.params.recipeId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Recipe saved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove saved recipe
// @route   DELETE /api/users/saved-recipes/:recipeId
// @access  Private
exports.removeSavedRecipe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.savedRecipes = user.savedRecipes.filter(
      id => id.toString() !== req.params.recipeId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Recipe removed from saved'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

