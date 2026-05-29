const Book      = require("../models/Book");
const BookIssue = require("../models/BookIssue");
const Student   = require("../models/Student");

/* ── Books ── */
exports.getBooks = async (req, res) => {
  const { search, category, available } = req.query;
  const query = {};
  if (search)    query.$or = [{ title: new RegExp(search, "i") }, { author: new RegExp(search, "i") }, { isbn: new RegExp(search, "i") }];
  if (category)  query.category = category;
  if (available === "true") query.availableCopies = { $gt: 0 };

  const books = await Book.find(query).populate("addedBy", "name").sort({ createdAt: -1 });
  res.json({ success: true, count: books.length, data: books });
};

exports.getBook = async (req, res) => {
  const book = await Book.findById(req.params.id).populate("addedBy", "name");
  if (!book) return res.status(404).json({ success: false, message: "Book not found" });
  res.json({ success: true, data: book });
};

exports.addBook = async (req, res) => {
  const book = await Book.create({ ...req.body, addedBy: req.user._id });
  res.status(201).json({ success: true, data: book });
};

exports.updateBook = async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!book) return res.status(404).json({ success: false, message: "Book not found" });
  res.json({ success: true, data: book });
};

exports.deleteBook = async (req, res) => {
  const active = await BookIssue.findOne({ book: req.params.id, status: { $in: ["issued", "overdue"] } });
  if (active) return res.status(400).json({ success: false, message: "Cannot delete — book is currently issued" });
  await Book.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Book removed" });
};

/* ── Issues ── */
exports.issueBook = async (req, res) => {
  const { bookId, studentId, dueDate } = req.body;

  const book = await Book.findById(bookId);
  if (!book)                      return res.status(404).json({ success: false, message: "Book not found" });
  if (book.availableCopies < 1)   return res.status(400).json({ success: false, message: "No copies available" });

  const existing = await BookIssue.findOne({ book: bookId, student: studentId, status: { $in: ["issued","overdue"] } });
  if (existing) return res.status(400).json({ success: false, message: "Student already has this book" });

  const issue = await BookIssue.create({ book: bookId, student: studentId, issuedBy: req.user._id, dueDate: dueDate || new Date(Date.now() + 14 * 86400000) });
  book.availableCopies -= 1;
  await book.save();

  await issue.populate([{ path: "book", select: "title author" }, { path: "student", populate: { path: "user", select: "name" } }]);
  res.status(201).json({ success: true, data: issue });
};

exports.returnBook = async (req, res) => {
  const issue = await BookIssue.findById(req.params.id).populate("book");
  if (!issue) return res.status(404).json({ success: false, message: "Issue record not found" });
  if (issue.status === "returned") return res.status(400).json({ success: false, message: "Already returned" });

  issue.returnedAt = new Date();
  issue.status     = "returned";
  if (issue.fine > 0 && req.body.finePaid) issue.fine = 0;
  await issue.save();

  await Book.findByIdAndUpdate(issue.book._id, { $inc: { availableCopies: 1 } });
  res.json({ success: true, data: issue });
};

exports.getIssues = async (req, res) => {
  const { status, studentId } = req.query;
  const query = {};
  if (status)    query.status    = status;
  if (studentId) query.student   = studentId;

  const issues = await BookIssue.find(query)
    .populate("book", "title author isbn")
    .populate({ path: "student", populate: { path: "user", select: "name" } })
    .populate("issuedBy", "name")
    .sort({ createdAt: -1 });
  res.json({ success: true, count: issues.length, data: issues });
};

exports.getMyIssues = async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });
  if (!student) return res.status(404).json({ success: false, message: "Student record not found" });
  const issues = await BookIssue.find({ student: student._id })
    .populate("book", "title author isbn category")
    .sort({ createdAt: -1 });
  res.json({ success: true, data: issues });
};

exports.getLibraryStats = async (req, res) => {
  const [totalBooks, totalIssued, overdue, totalCopies] = await Promise.all([
    Book.countDocuments(),
    BookIssue.countDocuments({ status: "issued" }),
    BookIssue.countDocuments({ status: "overdue" }),
    Book.aggregate([{ $group: { _id: null, total: { $sum: "$totalCopies" }, available: { $sum: "$availableCopies" } } }]),
  ]);
  res.json({ success: true, data: { totalBooks, totalIssued, overdue, totalCopies: totalCopies[0]?.total || 0, availableCopies: totalCopies[0]?.available || 0 } });
};
