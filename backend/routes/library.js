const router = require("express").Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getBooks, getBook, addBook, updateBook, deleteBook,
  issueBook, returnBook, getIssues, getMyIssues, getLibraryStats,
} = require("../controllers/libraryController");

const staff = authorize("admin", "teacher");

router.get   ("/stats",       protect, staff, getLibraryStats);
router.get   ("/my-issues",   protect, authorize("student"), getMyIssues);
router.get   ("/issues",      protect, staff, getIssues);
router.post  ("/issues",      protect, staff, issueBook);
router.put   ("/issues/:id/return", protect, staff, returnBook);

router.route("/").get(protect, getBooks).post(protect, staff, addBook);
router.route("/:id").get(protect, getBook).put(protect, staff, updateBook).delete(protect, authorize("admin"), deleteBook);

module.exports = router;
