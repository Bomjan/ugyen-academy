const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/auth');

// @route  POST /api/progress
// @desc   Create a progress record
// @access Private (teacher, admin)
router.post('/', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const progressData = { ...req.body, recordedBy: req.user._id };
    const progress = await Progress.create(progressData);
    await progress.populate('student');
    res.status(201).json({ success: true, data: progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

// @route  GET /api/progress/my
// @desc   Get own progress (for students)
// @access Private (student)
router.get('/my', protect, authorize('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found' });
    }

    const progress = await Progress.find({ student: student._id })
      .populate('student')
      .populate('recordedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

// @route  GET /api/progress/class/:class
// @desc   Get all progress for a class
// @access Private (teacher, admin)
router.get('/class/:class', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const students = await Student.find({ class: req.params.class });
    const studentIds = students.map((s) => s._id);

    const progress = await Progress.find({ student: { $in: studentIds } })
      .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
      .populate('recordedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

// @route  GET /api/progress/student/:studentId
// @desc   Get all progress for a student
// @access Private
router.get('/student/:studentId', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Access control: admin/teacher see all; student sees own; parent sees child's
    if (req.user.role === 'student') {
      const ownStudent = await Student.findOne({ user: req.user._id });
      if (!ownStudent || ownStudent._id.toString() !== req.params.studentId) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    } else if (req.user.role === 'parent') {
      if (!student.parent || student.parent.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    const progress = await Progress.find({ student: req.params.studentId })
      .populate('student')
      .populate('recordedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

// @route  PUT /api/progress/:id
// @desc   Update a progress record
// @access Private (teacher, admin)
router.put('/:id', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    let progress = await Progress.findById(req.params.id);
    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress record not found' });
    }

    Object.assign(progress, req.body);
    await progress.save(); // triggers pre-save grade calculation

    res.json({ success: true, data: progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

// @route  DELETE /api/progress/:id
// @desc   Delete a progress record
// @access Private (admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const progress = await Progress.findByIdAndDelete(req.params.id);
    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress record not found' });
    }
    res.json({ success: true, data: {} });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

module.exports = router;
