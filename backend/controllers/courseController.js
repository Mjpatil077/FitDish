const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Video = require('../models/Video');
const Earning = require('../models/Earning');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getAllCourses = async (req, res) => {
  try {
    const { category, chefId, difficulty } = req.query;
    let query = { isPublished: true };

    if (category) {
      const Category = require('../models/Category');
      const categoryDoc = await Category.findOne({ slug: category.toLowerCase() });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    if (chefId) {
      query.chef = chefId;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    const courses = await Course.find(query)
      .populate('chef', 'name avatar rating')
      .populate('category', 'name slug imageUrl')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('chef', 'name avatar bio rating cuisineSpecialties')
      .populate('category', 'name slug imageUrl')
      .populate('videos', 'title duration caloriesEstimate youtubeEmbedUrl thumbnail');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is enrolled (if authenticated)
    let enrollment = null;
    if (req.user) {
      enrollment = await Enrollment.findOne({
        user: req.user.id,
        course: course._id
      });
    }

    res.status(200).json({
      success: true,
      course,
      enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private (Chef)
exports.createCourse = async (req, res) => {
  try {
    req.body.chef = req.user.id;
    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Chef)
exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.chef.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Chef)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.chef.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get chef's courses
// @route   GET /api/courses/chef/my-courses
// @access  Private (Chef)
exports.getChefCourses = async (req, res) => {
  try {
    const courses = await Course.find({ chef: req.user.id })
      .populate('category', 'name slug')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private
exports.enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: req.user.id,
      course: course._id
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      user: req.user.id,
      course: course._id,
      progress: 0
    });

    // Update course enrollment count
    course.enrolledCount += 1;
    await course.save();

    // Create earning record for chef
    if (course.price > 0) {
      await Earning.create({
        chef: course.chef,
        source: 'course',
        sourceId: course._id,
        amount: course.price,
        description: `Course enrollment: ${course.title}`
      });
    }

    res.status(201).json({
      success: true,
      enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user enrollments
// @route   GET /api/courses/user/my-courses
// @access  Private
exports.getUserEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id })
      .populate('course', 'title thumbnail duration price difficulty')
      .populate('course.chef', 'name avatar')
      .populate('course.category', 'name slug')
      .sort('-enrolledAt');

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get course enrollments (for chef)
// @route   GET /api/courses/:id/enrollments
// @access  Private (Chef)
exports.getCourseEnrollments = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course || course.chef.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const enrollments = await Enrollment.find({ course: course._id })
      .populate('user', 'name email')
      .sort('-enrolledAt');

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

