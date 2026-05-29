const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title:       { type: String, required: [true, "Title is required"], trim: true },
  author:      { type: String, required: [true, "Author is required"], trim: true },
  isbn:        { type: String, unique: true, sparse: true, trim: true },
  category:    { type: String, enum: ["Science","Mathematics","Literature","History","Geography","Arts","Commerce","Sports","General","Reference","Fiction","Non-Fiction"], default: "General" },
  publisher:   { type: String },
  publishYear: { type: Number },
  totalCopies: { type: Number, default: 1, min: 1 },
  availableCopies: { type: Number, default: 1, min: 0 },
  language:    { type: String, default: "English" },
  shelf:       { type: String },
  description: { type: String },
  coverImage:  { type: String },
  addedBy:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

BookSchema.virtual("isAvailable").get(function () {
  return this.availableCopies > 0;
});

module.exports = mongoose.model("Book", BookSchema);
