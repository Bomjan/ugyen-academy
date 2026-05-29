const mongoose = require("mongoose");

const BookIssueSchema = new mongoose.Schema({
  book:       { type: mongoose.Schema.Types.ObjectId, ref: "Book",    required: true },
  student:    { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  issuedBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User",    required: true },
  issuedAt:   { type: Date, default: Date.now },
  dueDate:    { type: Date, required: true },
  returnedAt: { type: Date },
  status:     { type: String, enum: ["issued","returned","overdue"], default: "issued" },
  fine:       { type: Number, default: 0 },
  notes:      { type: String },
}, { timestamps: true });

/* Auto-mark overdue */
BookIssueSchema.pre("save", function (next) {
  if (this.status === "issued" && new Date() > this.dueDate) {
    this.status = "overdue";
    const days  = Math.ceil((new Date() - this.dueDate) / (1000 * 60 * 60 * 24));
    this.fine   = days * 5; /* Nu. 5 per day */
  }
  next();
});

module.exports = mongoose.model("BookIssue", BookIssueSchema);
