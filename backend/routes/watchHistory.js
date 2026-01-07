const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getWatchHistory,
  addToWatchHistory,
  updateWatchProgress,
  getRecentWatches
} = require('../controllers/watchHistoryController');

router.use(protect);

router.get('/', getWatchHistory);
router.get('/recent', getRecentWatches);
router.post('/', addToWatchHistory);
router.put('/:videoId', updateWatchProgress);

module.exports = router;

