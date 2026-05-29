const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    studentId: {
      type: String,
      unique: true
    },
    class: {
      type: String,
      required: [true, 'Class is required'],
      trim: true
    },
    stream: {
      type: String,
      enum: ['Science', 'Commerce', 'Arts', 'General'],
      default: 'General'
    },
    rollNo: {
      type: Number
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    academicYear: {
      type: String,
      default: () => new Date().getFullYear().toString()
    }
  },
  { timestamps: true }
);

// Pre-save hook to auto-generate studentId in UAXXXX format
StudentSchema.pre('save', async function (next) {
  if (this.studentId) return next();
  try {
    const count = await mongoose.model('Student').countDocuments();
    const padded = String(count + 1).padStart(4, '0');
    this.studentId = `UA${padded}`;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Student', StudentSchema);
