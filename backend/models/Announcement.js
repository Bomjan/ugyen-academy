const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    body: {
      type: String,
      required: [true, 'Body is required']
    },
    targetAudience: {
      type: String,
      enum: ['all', 'teachers', 'students', 'parents', 'class'],
      default: 'all'
    },
    targetClass: {
      type: String,
      trim: true
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    pinned: {
      type: Boolean,
      default: false
    },
    expiresAt: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Announcement', AnnouncementSchema);
