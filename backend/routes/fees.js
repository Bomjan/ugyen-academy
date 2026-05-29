const express = require('express');
const router = express.Router();
const Fee = require('../models/Fee');
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/auth');

// @route  POST /api/fees
// @desc   Create a fee record
// @access Private (admin)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const fee = await Fee.create({ ...req.body, recordedBy: req.user._id });
    res.status(201).json({ success: true, data: fee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

// @route  GET /api/fees/my
// @desc   Get own fees (for students)
// @access Private (student)
router.get('/my', protect, authorize('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found' });
    }

    const fees = await Fee.find({ student: student._id })
      .populate('recordedBy', 'name email')
      .sort({ dueDate: -1 });

    res.json({ success: true, data: fees });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

// @route  GET /api/fees/parent
// @desc   Get fees for all children of the logged-in parent
// @access Private (parent)
router.get('/parent', protect, authorize('parent'), async (req, res) => {
  try {
    const children = await Student.find({ parent: req.user._id });
    const childIds = children.map((c) => c._id);

    const fees = await Fee.find({ student: { $in: childIds } })
      .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
      .populate('recordedBy', 'name email')
      .sort({ dueDate: -1 });

    res.json({ success: true, data: fees });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

// @route  GET /api/fees/summary/:studentId
// @desc   Get fee summary for a student { total, paid, pending, overdue }
// @access Private
router.get('/summary/:studentId', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Access control
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

    const fees = await Fee.find({ student: req.params.studentId });
    const summary = {
      total: fees.reduce((sum, f) => sum + f.amount, 0),
      paid: fees.filter((f) => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0),
      pending: fees.filter((f) => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0),
      overdue: fees.filter((f) => f.status === 'overdue').reduce((sum, f) => sum + f.amount, 0),
      waived: fees.filter((f) => f.status === 'waived').reduce((sum, f) => sum + f.amount, 0)
    };

    res.json({ success: true, data: summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

// @route  GET /api/fees/student/:studentId
// @desc   Get fee records for a student
// @access Private
router.get('/student/:studentId', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Access control: parent/student see own; admin sees all
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

    const fees = await Fee.find({ student: req.params.studentId })
      .populate('recordedBy', 'name email')
      .sort({ dueDate: -1 });

    res.json({ success: true, data: fees });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

// @route  PUT /api/fees/:id
// @desc   Update a fee record (mark as paid, etc.)
// @access Private (admin)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('recordedBy', 'name email');

    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee record not found' });
    }

    res.json({ success: true, data: fee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

module.exports = router;
