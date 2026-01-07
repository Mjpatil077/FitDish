const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getChefAnalytics,
  getEarnings
} = require('../controllers/analyticsController');

router.use(protect);
router.use(authorize('chef'));

router.get('/', getChefAnalytics);
router.get('/earnings', getEarnings);

module.exports = router;

