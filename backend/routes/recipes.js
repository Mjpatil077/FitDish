const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe
} = require('../controllers/recipeController');

// Public routes
router.get('/', getAllRecipes);
router.get('/:id', getRecipe);

// Protected routes
router.post('/', protect, authorize('chef'), createRecipe);
router.put('/:id', protect, authorize('chef'), updateRecipe);
router.delete('/:id', protect, authorize('chef'), deleteRecipe);

module.exports = router;

