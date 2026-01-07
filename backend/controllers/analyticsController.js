const Video = require('../models/Video');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Booking = require('../models/Booking');
const Earning = require('../models/Earning');
const WatchHistory = require('../models/WatchHistory');

// @desc    Get chef analytics
// @route   GET /api/analytics
// @access  Private (Chef)
exports.getChefAnalytics = async (req, res) => {
  try {
    const chefId = req.user.id;

    // Get video stats
    const videos = await Video.find({ chef: chefId });
    const totalViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);
    const totalVideos = videos.length;

    // Get course stats
    const courses = await Course.find({ chef: chefId });
    const totalEnrollments = courses.reduce((sum, c) => sum + (c.enrolledCount || 0), 0);
    const totalCourses = courses.length;

    // Get session stats
    const sessions = await Booking.find({ chef: chefId });
    const totalStudents = new Set(sessions.map(s => s.user.toString())).size;

    // Get views by category
    const videosWithCategory = await Video.find({ chef: chefId })
      .populate('category', 'name');
    
    const viewsByCategory = {};
    videosWithCategory.forEach(video => {
      const catName = video.category?.name || 'Unknown';
      viewsByCategory[catName] = (viewsByCategory[catName] || 0) + (video.views || 0);
    });

    // Get most popular video
    const mostPopularVideo = videos.length > 0 
      ? videos.reduce((max, v) => (v.views || 0) > (max.views || 0) ? v : max)
      : null;

    res.status(200).json({
      success: true,
      analytics: {
        totalVideos,
        totalViews,
        totalCourses,
        totalEnrollments,
        totalStudents,
        viewsByCategory,
        mostPopularVideo: mostPopularVideo ? {
          title: mostPopularVideo.title,
          views: mostPopularVideo.views
        } : null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get chef earnings
// @route   GET /api/analytics/earnings
// @access  Private (Chef)
exports.getEarnings = async (req, res) => {
  try {
    const { period = 'all' } = req.query;
    let dateFilter = {};

    if (period === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dateFilter.date = { $gte: today };
    } else if (period === 'month') {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      dateFilter.date = { $gte: startOfMonth };
    }

    const earnings = await Earning.find({ 
      chef: req.user.id,
      ...dateFilter
    }).sort('-date');

    const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);

    // Breakdown by source
    const breakdown = {
      video: earnings.filter(e => e.source === 'video').reduce((sum, e) => sum + e.amount, 0),
      course: earnings.filter(e => e.source === 'course').reduce((sum, e) => sum + e.amount, 0),
      session: earnings.filter(e => e.source === 'session').reduce((sum, e) => sum + e.amount, 0)
    };

    res.status(200).json({
      success: true,
      totalEarnings,
      breakdown,
      earnings: earnings.slice(0, 50)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

