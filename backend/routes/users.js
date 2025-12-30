const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  updateProfile,
  getUserProfile,
  getSavedRecipes,
  saveRecipe,
  removeSavedRecipe
} = require('../controllers/userController');

router.use(protect);

router.get('/profile', getUserProfile);
router.put('/profile', updateProfile);
router.get('/saved-recipes', getSavedRecipes);
router.post('/saved-recipes/:recipeId', saveRecipe);
router.delete('/saved-recipes/:recipeId', removeSavedRecipe);

module.exports = router;

