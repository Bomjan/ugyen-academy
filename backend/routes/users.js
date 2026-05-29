const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/auth');

// @route  GET /api/users/students/all
// @desc   Get all students with their User populated
// @access Private (admin, teacher)
// NOTE: This route must be defined BEFORE /:id to avoid matching "students" as an id
router.get('/students/all', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const students = await Student.find()
      .populate('user', 'name email phone role createdAt')
      .populate('parent', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

// @route  GET /api/users
// @desc   List all users with pagination (?page=&limit=&role=)
// @access Private (admin)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.role) filter.role = req.query.role;

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

// @route  GET /api/users/:id
// @desc   Get user by id
// @access Private (admin)
router.get('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

// @route  PUT /api/users/:id/role
// @desc   Update user role
// @access Private (admin)
router.put('/:id/role', protect, authorize('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'teacher', 'student', 'parent'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

module.exports = router;
