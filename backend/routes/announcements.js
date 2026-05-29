const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { protect, authorize } = require('../middleware/auth');

// @route  POST /api/announcements
// @desc   Create an announcement
// @access Private (admin, teacher)
router.post('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const announcement = await Announcement.create({
      ...req.body,
      postedBy: req.user._id
    });
    await announcement.populate('postedBy', 'name email role');
    res.status(201).json({ success: true, data: announcement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

// @route  GET /api/announcements
// @desc   Get announcements relevant to the current user's role
// @access Private
router.get('/', protect, async (req, res) => {
  try {
    const role = req.user.role;

    // Build audience filter
    const audienceFilter = ['all'];
    if (role === 'teacher') audienceFilter.push('teachers');
    if (role === 'student') audienceFilter.push('students');
    if (role === 'parent') audienceFilter.push('parents');
    if (role === 'admin') {
      audienceFilter.push('teachers', 'students', 'parents', 'class');
    }

    const query = {
      targetAudience: { $in: audienceFilter },
      $or: [{ expiresAt: { $exists: false } }, { expiresAt: null }, { expiresAt: { $gte: new Date() } }]
    };

    const announcements = await Announcement.find(query)
      .populate('postedBy', 'name email role')
      .sort({ pinned: -1, createdAt: -1 });

    res.json({ success: true, data: announcements });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

// @route  PUT /api/announcements/:id
// @desc   Update an announcement (own, unless admin)
// @access Private (admin, teacher)
router.put('/:id', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    let announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    // Teachers can only update their own announcements
    if (
      req.user.role === 'teacher' &&
      announcement.postedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this announcement' });
    }

    announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('postedBy', 'name email role');

    res.json({ success: true, data: announcement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

// @route  DELETE /api/announcements/:id
// @desc   Delete an announcement
// @access Private (admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    res.json({ success: true, data: {} });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || 'Server Error' });
  }
});

module.exports = router;
