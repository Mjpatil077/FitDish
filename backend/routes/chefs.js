const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllChefs,
  getChefProfile,
  updateChefProfile,
  getChefSessions,
  getChefReviews
} = require('../controllers/chefController');

// Public routes
router.get('/', getAllChefs);
router.get('/:id', getChefProfile);
router.get('/:id/sessions', getChefSessions);
router.get('/:id/reviews', getChefReviews);

// Protected routes (chef only)
router.put('/profile', protect, authorize('chef'), updateChefProfile);

module.exports = router;

