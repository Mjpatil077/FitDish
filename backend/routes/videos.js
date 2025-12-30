const express = require('express');
const router = express.Router();
const {
  getAllVideos,
  getVideo,
  getVideosByCategory,
  getVideosByChef
} = require('../controllers/videoController');

// Public routes
router.get('/', getAllVideos);
router.get('/category/:categorySlug', getVideosByCategory);
router.get('/chef/:chefId', getVideosByChef);
router.get('/:id', getVideo);

module.exports = router;

