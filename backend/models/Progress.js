const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true
    },
    marks: {
      type: Number,
      min: [0, 'Marks cannot be less than 0'],
      max: [100, 'Marks cannot exceed 100']
    },
    grade: {
      type: String
    },
    remarks: {
      type: String,
      trim: true
    },
    term: {
      type: String,
      enum: ['Term 1', 'Term 2', 'Term 3', 'Annual'],
      required: [true, 'Term is required']
    },
    academicYear: {
      type: String
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    assessmentType: {
      type: String,
      enum: ['Classwork', 'Homework', 'Test', 'Midterm', 'Final', 'Project'],
      default: 'Test'
    }
  },
  { timestamps: true }
);

// Pre-save hook to auto-compute grade from marks
ProgressSchema.pre('save', function (next) {
  if (this.marks !== undefined && this.marks !== null) {
    if (this.marks >= 90) this.grade = 'A+';
    else if (this.marks >= 80) this.grade = 'A';
    else if (this.marks >= 70) this.grade = 'B+';
    else if (this.marks >= 60) this.grade = 'B';
    else if (this.marks >= 50) this.grade = 'C';
    else if (this.marks >= 40) this.grade = 'D';
    else this.grade = 'F';
  }
  next();
});

module.exports = mongoose.model('Progress', ProgressSchema);
