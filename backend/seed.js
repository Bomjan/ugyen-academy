require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const User         = require("./models/User");
const Student      = require("./models/Student");
const Announcement = require("./models/Announcement");
const Progress     = require("./models/Progress");
const Attendance   = require("./models/Attendance");
const Fee          = require("./models/Fee");
const Book         = require("./models/Book");

const colors = { reset:"\x1b[0m", green:"\x1b[32m", blue:"\x1b[34m", yellow:"\x1b[33m", red:"\x1b[31m", cyan:"\x1b[36m" };
const log = (c, msg) => console.log(`${colors[c]}${msg}${colors.reset}`);

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  log("cyan", "\n🌱  Connected to MongoDB — seeding...\n");

  /* ── Wipe existing data ── */
  await Promise.all([
    User.deleteMany({}), Student.deleteMany({}),
    Announcement.deleteMany({}), Progress.deleteMany({}),
    Attendance.deleteMany({}), Fee.deleteMany({}), Book.deleteMany({}),
  ]);
  log("yellow", "   ✓ Cleared existing data");

  /* ── Users ── */
  const hash = pwd => bcrypt.hashSync(pwd, 10);

  const [admin, teacher, studentUser, parentUser] = await User.insertMany([
    { name: "Admin User",        email: "admin@ua.edu.bt",   password: hash("admin123"),   role: "admin"   },
    { name: "Tashi Wangchuk",    email: "teacher@ua.edu.bt", password: hash("teacher123"), role: "teacher" },
    { name: "Dorji Tenzin",      email: "student@ua.edu.bt", password: hash("student123"), role: "student" },
    { name: "Pema Dorji (Parent)",email: "parent@ua.edu.bt", password: hash("parent123"),  role: "parent"  },
  ]);
  log("green", "   ✓ Created 4 users");

  /* ── Student record ── */
  const student = await Student.create({
    user:         studentUser._id,
    studentId:    "UA0001",
    class:        "Class XI",
    stream:       "Science",
    rollNo:       1,
    parent:       parentUser._id,
    academicYear: "2026",
  });
  log("green", "   ✓ Created student record (UA0001)");

  /* ── Announcements ── */
  await Announcement.insertMany([
    { title: "Welcome to Academic Year 2026", body: "Dear students and parents, welcome to the 2026 academic session at Ugyen Academy. Classes commence on 1st February.", targetAudience: "all",      postedBy: admin._id,   pinned: true  },
    { title: "Class XI Science Orientation",  body: "All Class XI Science students are requested to report to the lab block on Monday at 9 AM for orientation.",          targetAudience: "students", postedBy: teacher._id, pinned: false },
    { title: "Fee Payment Reminder",          body: "Please ensure all Term 1 fees are paid by 15th February to avoid late charges.",                                      targetAudience: "parents",  postedBy: admin._id,   pinned: true  },
    { title: "National School Games 2026",    body: "Selections for the National School Games will be held on 20th February. All interested students must register with Mr. Tashi Phuntsho.", targetAudience: "students", postedBy: admin._id, pinned: false },
  ]);
  log("green", "   ✓ Created 4 announcements");

  /* ── Progress records ── */
  const subjects = [
    { subject: "Physics",     marks: 88, term: "Term 1", assessmentType: "Midterm"  },
    { subject: "Chemistry",   marks: 75, term: "Term 1", assessmentType: "Midterm"  },
    { subject: "Biology",     marks: 92, term: "Term 1", assessmentType: "Midterm"  },
    { subject: "Mathematics", marks: 65, term: "Term 1", assessmentType: "Midterm"  },
    { subject: "English",     marks: 80, term: "Term 1", assessmentType: "Midterm"  },
    { subject: "Physics",     marks: 55, term: "Term 1", assessmentType: "Test",    remarks: "Needs improvement in thermodynamics" },
    { subject: "Chemistry",   marks: 90, term: "Term 1", assessmentType: "Test"     },
    { subject: "Mathematics", marks: 72, term: "Term 1", assessmentType: "Homework" },
  ];
  await Progress.insertMany(subjects.map(s => ({
    student: student._id, recordedBy: teacher._id, academicYear: "2026", ...s,
  })));
  log("green", "   ✓ Created 8 progress records");

  /* ── Attendance ── */
  const today    = new Date();
  const records  = [];
  for (let i = 14; i >= 0; i--) {
    const date   = new Date(today); date.setDate(today.getDate() - i);
    if (date.getDay() === 0 || date.getDay() === 6) continue; // skip weekends
    records.push({
      student:  student._id,
      markedBy: teacher._id,
      date,
      status: i === 5 ? "absent" : i === 10 ? "late" : "present",
    });
  }
  await Attendance.insertMany(records);
  log("green", `   ✓ Created ${records.length} attendance records`);

  /* ── Fees ── */
  await Fee.insertMany([
    { student: student._id, feeType: "Tuition",  amount: 3500, dueDate: new Date("2026-02-15"), status: "paid",    paidDate: new Date("2026-02-10"), academicYear: "2026", term: "Term 1", recordedBy: admin._id },
    { student: student._id, feeType: "Hostel",   amount: 4000, dueDate: new Date("2026-02-15"), status: "paid",    paidDate: new Date("2026-02-10"), academicYear: "2026", term: "Term 1", recordedBy: admin._id },
    { student: student._id, feeType: "Activity", amount: 2000, dueDate: new Date("2026-02-28"), status: "pending", academicYear: "2026", term: "Term 1", recordedBy: admin._id },
    { student: student._id, feeType: "Library",  amount: 1500, dueDate: new Date("2026-01-31"), status: "overdue", academicYear: "2026", term: "Term 1", recordedBy: admin._id },
  ]);
  log("green", "   ✓ Created 4 fee records");

  /* ── Books ── */
  await Book.insertMany([
    { title: "Concepts of Physics Vol. 1", author: "H.C. Verma",          category: "Science",     totalCopies: 5,  availableCopies: 3, isbn: "978-8177091878", publisher: "Bharati Bhawan", shelf: "A1", addedBy: admin._id },
    { title: "Concepts of Physics Vol. 2", author: "H.C. Verma",          category: "Science",     totalCopies: 5,  availableCopies: 5, isbn: "978-8177091885", publisher: "Bharati Bhawan", shelf: "A1", addedBy: admin._id },
    { title: "Organic Chemistry",          author: "O.P. Tandon",          category: "Science",     totalCopies: 3,  availableCopies: 2, isbn: "978-8190819209", publisher: "G.R. Bathla",    shelf: "A2", addedBy: admin._id },
    { title: "Higher Mathematics",         author: "S.L. Loney",           category: "Mathematics", totalCopies: 4,  availableCopies: 4, isbn: "978-8176080123", publisher: "Arihant",         shelf: "B1", addedBy: admin._id },
    { title: "Business Studies",           author: "CBSE",                 category: "Commerce",    totalCopies: 8,  availableCopies: 6, shelf: "C1", addedBy: admin._id },
    { title: "Accountancy Part I",         author: "CBSE",                 category: "Commerce",    totalCopies: 8,  availableCopies: 7, shelf: "C2", addedBy: admin._id },
    { title: "History of Bhutan",          author: "Karma Phuntsho",       category: "History",     totalCopies: 6,  availableCopies: 5, publisher: "Penguin", shelf: "D1", addedBy: admin._id },
    { title: "The Art of Happiness",       author: "Dalai Lama",           category: "General",     totalCopies: 3,  availableCopies: 3, shelf: "E1", addedBy: admin._id },
    { title: "Gross National Happiness",   author: "Sander G. Tideman",    category: "General",     totalCopies: 2,  availableCopies: 2, shelf: "E2", addedBy: admin._id },
    { title: "Animal Farm",                author: "George Orwell",        category: "Fiction",     totalCopies: 4,  availableCopies: 4, isbn: "978-0451526342", shelf: "F1", addedBy: admin._id },
    { title: "To Kill a Mockingbird",      author: "Harper Lee",           category: "Fiction",     totalCopies: 3,  availableCopies: 3, isbn: "978-0061935466", shelf: "F2", addedBy: admin._id },
    { title: "A Brief History of Time",    author: "Stephen Hawking",      category: "Science",     totalCopies: 2,  availableCopies: 2, isbn: "978-0553380163", shelf: "A3", addedBy: admin._id },
  ]);
  log("green", "   ✓ Created 12 books in library");

  /* ── Summary ── */
  console.log(`
╔══════════════════════════════════════════════════╗
║          🎓  UGYEN ACADEMY — SEED COMPLETE        ║
╠══════════════════════════════════════════════════╣
║  Portal URL:   http://localhost:3000/portal/login ║
╠══════════════════════════════════════════════════╣
║  ROLE       EMAIL                  PASSWORD       ║
║  ─────────  ─────────────────────  ───────────    ║
║  Admin      admin@ua.edu.bt        admin123       ║
║  Teacher    teacher@ua.edu.bt      teacher123     ║
║  Student    student@ua.edu.bt      student123     ║
║  Parent     parent@ua.edu.bt       parent123      ║
╚══════════════════════════════════════════════════╝
`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error("\x1b[31mSeed failed:\x1b[0m", err.message);
  process.exit(1);
});
