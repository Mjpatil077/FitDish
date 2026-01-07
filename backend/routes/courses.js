const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getChefCourses,
  enrollInCourse,
  getUserEnrollments,
  getCourseEnrollments
} = require('../controllers/courseController');

// Public routes
router.get('/', getAllCourses);
router.get('/:id', getCourse);

// Protected routes
router.post('/', protect, authorize('chef'), createCourse);
router.put('/:id', protect, authorize('chef'), updateCourse);
router.delete('/:id', protect, authorize('chef'), deleteCourse);
router.get('/chef/my-courses', protect, authorize('chef'), getChefCourses);
router.post('/:id/enroll', protect, enrollInCourse);
router.get('/user/my-courses', protect, getUserEnrollments);
router.get('/:id/enrollments', protect, authorize('chef'), getCourseEnrollments);

module.exports = router;

