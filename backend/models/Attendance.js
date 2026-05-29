const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    date: {
      type: Date,
      required: [true, 'Date is required']
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'excused'],
      required: [true, 'Status is required']
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      trim: true
    },
    note: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

// Unique index on [student, date, subject]
AttendanceSchema.index({ student: 1, date: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
