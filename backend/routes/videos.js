const express = require('express');
const router = express.Router();
const { optionalAuth, protect } = require('../middleware/auth');
const {
  getAllVideos,
  getVideo,
  getVideosByCategory,
  getVideosByChef,
  getMyVideos
} = require('../controllers/videoController');

// Public routes (with optional auth for full access)
router.get('/', optionalAuth, getAllVideos);
router.get('/category/:categorySlug', optionalAuth, getVideosByCategory);
router.get('/chef/me', protect, getMyVideos);
router.get('/chef/:chefId', optionalAuth, getVideosByChef);
router.get('/:id', optionalAuth, getVideo);

module.exports = router;

