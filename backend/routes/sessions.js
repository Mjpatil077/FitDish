const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createSession,
  getAllSessions,
  getSession,
  updateSession,
  deleteSession,
  getChefSessions
} = require('../controllers/sessionController');

// Public routes
router.get('/', getAllSessions);
router.get('/:id', getSession);

// Protected routes
router.post('/', protect, authorize('chef'), createSession);
router.get('/chef/my-sessions', protect, authorize('chef'), getChefSessions);
router.put('/:id', protect, authorize('chef'), updateSession);
router.delete('/:id', protect, authorize('chef'), deleteSession);

module.exports = router;

