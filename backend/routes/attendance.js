const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/auth');

// @route  POST /api/attendance
// @desc   Mark attendance (single or bulk array)
// @access Private (teacher, admin)
router.post('/', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const records = Array.isArray(req.body) ? req.body : [req.body];
    const withMarker = records.map((r) => ({ ...r, markedBy: req.user._id }));

    const created = [];
    for (const record of withMarker) {
      try {
        const doc = await Attendance.create(record);
        created.push(doc);
      } catch (err) {
        // Skip duplicates (unique index violation) silently or collect errors
        if (err.code !== 11000) throw err;
      }
    }

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

// @route  GET /api/attendance/my
// @desc   Get own attendance (for students)
// @access Private (student)
router.get('/my', protect, authorize('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found' });
    }

    const query = { student: student._id };
    if (req.query.startDate || req.query.endDate) {
      query.date = {};
      if (req.query.startDate) query.date.$gte = new Date(req.query.startDate);
      if (req.query.endDate) query.date.$lte = new Date(req.query.endDate);
    }

    const attendance = await Attendance.find(query)
      .populate('markedBy', 'name email')
      .sort({ date: -1 });

    res.json({ success: true, data: attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

// @route  GET /api/attendance/stats/:studentId
// @desc   Get attendance stats for a student
// @access Private
router.get('/stats/:studentId', protect, async (req, res) => {
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

    const records = await Attendance.find({ student: req.params.studentId });
    const total = records.length;
    const present = records.filter((r) => r.status === 'present').length;
    const absent = records.filter((r) => r.status === 'absent').length;
    const late = records.filter((r) => r.status === 'late').length;
    const excused = records.filter((r) => r.status === 'excused').length;
    const percentage = total > 0 ? ((present + late) / total * 100).toFixed(2) : '0.00';

    res.json({
      success: true,
      data: { total, present, absent, late, excused, percentage: parseFloat(percentage) }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

// @route  GET /api/attendance/class/:class
// @desc   Get class attendance for a date (?date=)
// @access Private (teacher, admin)
router.get('/class/:class', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const students = await Student.find({ class: req.params.class });
    const studentIds = students.map((s) => s._id);

    const query = { student: { $in: studentIds } };
    if (req.query.date) {
      const start = new Date(req.query.date);
      const end = new Date(req.query.date);
      end.setDate(end.getDate() + 1);
      query.date = { $gte: start, $lt: end };
    }

    const attendance = await Attendance.find(query)
      .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
      .populate('markedBy', 'name email')
      .sort({ date: -1 });

    res.json({ success: true, data: attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

// @route  GET /api/attendance/student/:studentId
// @desc   Get attendance for a student with optional date range
// @access Private
router.get('/student/:studentId', protect, async (req, res) => {
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

    const query = { student: req.params.studentId };
    if (req.query.startDate || req.query.endDate) {
      query.date = {};
      if (req.query.startDate) query.date.$gte = new Date(req.query.startDate);
      if (req.query.endDate) query.date.$lte = new Date(req.query.endDate);
    }

    const attendance = await Attendance.find(query)
      .populate('markedBy', 'name email')
      .sort({ date: -1 });

    res.json({ success: true, data: attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

// @route  PUT /api/attendance/:id
// @desc   Update an attendance record
// @access Private (teacher, admin)
router.put('/:id', protect, authorize('teacher', 'admin'), async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('markedBy', 'name email');

    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    res.json({ success: true, data: attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

module.exports = router;
