const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategory,
  getCategoriesByType
} = require('../controllers/categoryController');

// Public routes
router.get('/', getAllCategories);
router.get('/type/:type', getCategoriesByType);
router.get('/:identifier', getCategory);

module.exports = router;

