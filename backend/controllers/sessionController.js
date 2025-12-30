const Session = require('../models/Session');

// @desc    Create session
// @route   POST /api/sessions
// @access  Private (Chef)
exports.createSession = async (req, res) => {
  try {
    req.body.chef = req.user.id;
    const session = await Session.create(req.body);

    res.status(201).json({
      success: true,
      session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all sessions
// @route   GET /api/sessions
// @access  Public
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ 
      isActive: true,
      scheduledAt: { $gte: new Date() }
    })
      .populate('chef', 'name avatar rating cuisineSpecialties')
      .sort('scheduledAt');

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single session
// @route   GET /api/sessions/:id
// @access  Public
exports.getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('chef', 'name avatar bio rating cuisineSpecialties experience');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.status(200).json({
      success: true,
      session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private (Chef)
exports.updateSession = async (req, res) => {
  try {
    let session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Make sure chef owns the session
    if (session.chef.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this session'
      });
    }

    session = await Session.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private (Chef)
exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Make sure chef owns the session
    if (session.chef.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this session'
      });
    }

    await session.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get chef's sessions
// @route   GET /api/sessions/chef/my-sessions
// @access  Private (Chef)
exports.getChefSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ chef: req.user.id })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

