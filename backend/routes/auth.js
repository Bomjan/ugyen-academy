const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');

// Helper to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route  POST /api/auth/register
// @desc   Register a new user
// @access Public
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    try {
      const { name, email, password, role, phone, class: studentClass, stream, rollNo, parentStudentId } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
      }

      const user = await User.create({ name, email, password, role: role || 'student', phone });

      // If registering a student, create Student document
      if (user.role === 'student') {
        await Student.create({
          user: user._id,
          class: studentClass || 'Class I',
          stream: stream || 'General',
          rollNo: rollNo || undefined,
          academicYear: new Date().getFullYear().toString()
        });
      }

      // If registering a parent, optionally link to a student by studentId
      if (user.role === 'parent' && parentStudentId) {
        await Student.findOneAndUpdate(
          { studentId: parentStudentId },
          { parent: user._id }
        );
      }

      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message || 'Server Error' });
    }
  }
);

// @route  POST /api/auth/login
// @desc   Login user
// @access Public
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = generateToken(user._id);

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message || 'Server Error' });
    }
  }
);

// @route  GET /api/auth/me
// @desc   Get current logged-in user
// @access Private
router.get('/me', protect, async (req, res) => {
  try {
    let userData = req.user.toObject();

    if (req.user.role === 'student') {
      const studentData = await Student.findOne({ user: req.user._id })
        .populate('user', 'name email phone role')
        .populate('parent', 'name email phone');
      userData.student = studentData;
    }

    res.json({ success: true, data: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

module.exports = router;
