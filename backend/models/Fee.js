const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    feeType: {
      type: String,
      enum: ['Tuition', 'Hostel', 'Activity', 'Library', 'Admission', 'Other'],
      required: [true, 'Fee type is required']
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required']
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required']
    },
    paidDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue', 'waived'],
      default: 'pending'
    },
    academicYear: {
      type: String
    },
    term: {
      type: String
    },
    note: {
      type: String,
      trim: true
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Fee', FeeSchema);
