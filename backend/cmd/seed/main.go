package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"ugyen-academy/models"

	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

const (
	reset  = "\x1b[0m"
	green  = "\x1b[32m"
	blue   = "\x1b[34m"
	yellow = "\x1b[33m"
	red    = "\x1b[31m"
	cyan   = "\x1b[36m"
)

func colored(color, msg string) {
	fmt.Printf("%s%s%s\n", color, msg, reset)
}

func hashPassword(pwd string) string {
	h, err := bcrypt.GenerateFromPassword([]byte(pwd), 10)
	if err != nil {
		log.Fatalf("bcrypt error: %v", err)
	}
	return string(h)
}

func main() {
	// Load .env from ../../.env (seed runs from backend/)
	if err := godotenv.Load("../.env"); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL is not set")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		log.Fatalf("Failed to connect to DB: %v", err)
	}

	colored(cyan, "\n🌱  Connected to PostgreSQL — seeding...")
	fmt.Println()

	// Auto-migrate
	if err := db.AutoMigrate(
		&models.User{},
		&models.Student{},
		&models.Progress{},
		&models.Attendance{},
		&models.Announcement{},
		&models.Fee{},
		&models.Book{},
		&models.BookIssue{},
	); err != nil {
		log.Fatalf("AutoMigrate failed: %v", err)
	}

	// Wipe all tables
	db.Exec("DELETE FROM book_issues")
	db.Exec("DELETE FROM books")
	db.Exec("DELETE FROM fees")
	db.Exec("DELETE FROM attendances")
	db.Exec("DELETE FROM progresses")
	db.Exec("DELETE FROM announcements")
	db.Exec("DELETE FROM students")
	db.Exec("DELETE FROM users")
	colored(yellow, "   ✓ Cleared existing data")

	// Users
	users := []models.User{
		{Name: "Admin User", Email: "admin@ua.edu.bt", Password: hashPassword("admin123"), Role: "admin"},
		{Name: "Tashi Wangchuk", Email: "teacher@ua.edu.bt", Password: hashPassword("teacher123"), Role: "teacher"},
		{Name: "Dorji Tenzin", Email: "student@ua.edu.bt", Password: hashPassword("student123"), Role: "student"},
		{Name: "Pema Dorji (Parent)", Email: "parent@ua.edu.bt", Password: hashPassword("parent123"), Role: "parent"},
	}
	for i := range users {
		if err := db.Create(&users[i]).Error; err != nil {
			log.Fatalf("Failed to create user %s: %v", users[i].Email, err)
		}
	}
	adminUser := users[0]
	teacherUser := users[1]
	studentUser := users[2]
	parentUser := users[3]
	colored(green, "   ✓ Created 4 users")

	// Student record
	student := models.Student{
		UserID:       studentUser.ID,
		StudentID:    "UA0001",
		Class:        "Class XI",
		Stream:       "Science",
		RollNo:       1,
		ParentID:     parentUser.ID,
		AcademicYear: "2026",
	}
	if err := db.Create(&student).Error; err != nil {
		log.Fatalf("Failed to create student: %v", err)
	}
	colored(green, "   ✓ Created student record (UA0001)")

	// Announcements
	announcements := []models.Announcement{
		{
			Title:          "Welcome to Academic Year 2026",
			Body:           "Dear students and parents, welcome to the 2026 academic session at Ugyen Academy. Classes commence on 1st February.",
			TargetAudience: "all",
			PostedByID:     adminUser.ID,
			Pinned:         true,
		},
		{
			Title:          "Class XI Science Orientation",
			Body:           "All Class XI Science students are requested to report to the lab block on Monday at 9 AM for orientation.",
			TargetAudience: "students",
			PostedByID:     teacherUser.ID,
			Pinned:         false,
		},
		{
			Title:          "Fee Payment Reminder",
			Body:           "Please ensure all Term 1 fees are paid by 15th February to avoid late charges.",
			TargetAudience: "parents",
			PostedByID:     adminUser.ID,
			Pinned:         true,
		},
		{
			Title:          "National School Games 2026",
			Body:           "Selections for the National School Games will be held on 20th February. All interested students must register with Mr. Tashi Phuntsho.",
			TargetAudience: "students",
			PostedByID:     adminUser.ID,
			Pinned:         false,
		},
	}
	for i := range announcements {
		db.Create(&announcements[i])
	}
	colored(green, "   ✓ Created 4 announcements")

	// Progress records
	type progData struct {
		subject, term, assessmentType, remarks string
		marks                                  float64
	}
	progRecords := []progData{
		{"Physics", "Term 1", "Midterm", "", 88},
		{"Chemistry", "Term 1", "Midterm", "", 75},
		{"Biology", "Term 1", "Midterm", "", 92},
		{"Mathematics", "Term 1", "Midterm", "", 65},
		{"English", "Term 1", "Midterm", "", 80},
		{"Physics", "Term 1", "Test", "Needs improvement in thermodynamics", 55},
		{"Chemistry", "Term 1", "Test", "", 90},
		{"Mathematics", "Term 1", "Homework", "", 72},
	}
	for _, p := range progRecords {
		db.Create(&models.Progress{
			StudentID:      student.ID,
			RecordedByID:   teacherUser.ID,
			Subject:        p.subject,
			Marks:          p.marks,
			Term:           p.term,
			AssessmentType: p.assessmentType,
			Remarks:        p.remarks,
			AcademicYear:   "2026",
		})
	}
	colored(green, "   ✓ Created 8 progress records")

	// Attendance records
	statuses := []string{"present", "present", "present", "late", "present", "absent", "present", "present", "present", "present"}
	subjects := []string{"Physics", "Chemistry", "Biology", "Mathematics", "English", "Physics", "Chemistry", "Biology", "Mathematics", "English"}
	today := time.Now()
	attCount := 0
	for i := 14; i >= 0; i-- {
		date := today.AddDate(0, 0, -i)
		if date.Weekday() == time.Saturday || date.Weekday() == time.Sunday {
			continue
		}
		idx := attCount % len(statuses)
		db.Create(&models.Attendance{
			StudentID:  student.ID,
			MarkedByID: teacherUser.ID,
			Date:       date,
			Status:     statuses[idx],
			Subject:    subjects[idx],
		})
		attCount++
		if attCount >= 10 {
			break
		}
	}
	colored(green, fmt.Sprintf("   ✓ Created %d attendance records", attCount))

	// Fee records
	fees := []struct {
		feeType, term, status string
		amount                float64
		daysOffset            int
	}{
		{"Tuition Fee", "Term 1", "paid", 15000, -30},
		{"Activity Fee", "Term 1", "paid", 2000, -30},
		{"Tuition Fee", "Term 2", "pending", 15000, 30},
		{"Examination Fee", "Term 1", "overdue", 500, -10},
	}
	for _, f := range fees {
		dueDate := today.AddDate(0, 0, f.daysOffset)
		fee := models.Fee{
			StudentID:    student.ID,
			FeeType:      f.feeType,
			Amount:       f.amount,
			DueDate:      dueDate,
			Status:       f.status,
			AcademicYear: "2026",
			Term:         f.term,
			RecordedByID: adminUser.ID,
		}
		if f.status == "paid" {
			paidDate := dueDate.AddDate(0, 0, -5)
			fee.PaidDate = &paidDate
		}
		db.Create(&fee)
	}
	colored(green, "   ✓ Created 4 fee records")

	// Books
	books := []models.Book{
		{Title: "Physics for Class XI", Author: "H.C. Verma", Category: "Textbook", TotalCopies: 10, AvailableCopies: 8, ISBN: "978-8177091878", Shelf: "A1"},
		{Title: "Organic Chemistry", Author: "Morrison & Boyd", Category: "Textbook", TotalCopies: 8, AvailableCopies: 6, ISBN: "978-0136436690", Shelf: "A2"},
		{Title: "Biology Concepts", Author: "Campbell", Category: "Textbook", TotalCopies: 12, AvailableCopies: 10, ISBN: "978-0134093413", Shelf: "A3"},
		{Title: "Mathematics Class XI", Author: "R.D. Sharma", Category: "Textbook", TotalCopies: 15, AvailableCopies: 12, ISBN: "978-8193624807", Shelf: "A4"},
		{Title: "English Literature", Author: "Various", Category: "Textbook", TotalCopies: 10, AvailableCopies: 9, ISBN: "978-0199536559", Shelf: "B1"},
		{Title: "The Alchemist", Author: "Paulo Coelho", Category: "Fiction", TotalCopies: 5, AvailableCopies: 4, ISBN: "978-0062315007", Shelf: "C1"},
		{Title: "A Brief History of Time", Author: "Stephen Hawking", Category: "Science", TotalCopies: 3, AvailableCopies: 3, ISBN: "978-0553380163", Shelf: "D1"},
		{Title: "The Bhutanese Way", Author: "Karma Ura", Category: "Culture", TotalCopies: 4, AvailableCopies: 4, ISBN: "978-9993636038", Shelf: "E1"},
		{Title: "Fundamentals of Computer Science", Author: "Reema Thareja", Category: "Textbook", TotalCopies: 8, AvailableCopies: 7, ISBN: "978-0199452057", Shelf: "A5"},
		{Title: "Druk History", Author: "Michael Aris", Category: "History", TotalCopies: 3, AvailableCopies: 2, ISBN: "978-0856683176", Shelf: "E2"},
		{Title: "Environmental Science", Author: "Anil Kumar De", Category: "Textbook", TotalCopies: 6, AvailableCopies: 5, ISBN: "978-8120341654", Shelf: "A6"},
		{Title: "Gross National Happiness", Author: "Dasho Karma Ura", Category: "Philosophy", TotalCopies: 4, AvailableCopies: 4, ISBN: "978-9993636052", Shelf: "F1"},
	}
	for i := range books {
		books[i].AddedByID = adminUser.ID
		db.Create(&books[i])
	}
	colored(green, "   ✓ Created 12 books")

	// Summary
	fmt.Println()
	colored(cyan, "╔══════════════════════════════════════╗")
	colored(cyan, "║        SEED SUMMARY                  ║")
	colored(cyan, "╠══════════════════════════════════════╣")
	colored(blue, "║  Users         : 4                   ║")
	colored(blue, "║  Students      : 1 (UA0001)          ║")
	colored(blue, "║  Announcements : 4                   ║")
	colored(blue, "║  Progress      : 8 records           ║")
	colored(blue, fmt.Sprintf("║  Attendance    : %d records          ║", attCount))
	colored(blue, "║  Fees          : 4 records           ║")
	colored(blue, "║  Books         : 12                  ║")
	colored(cyan, "╠══════════════════════════════════════╣")
	colored(green, "║  LOGIN CREDENTIALS                   ║")
	colored(green, "║  admin@ua.edu.bt    / admin123       ║")
	colored(green, "║  teacher@ua.edu.bt  / teacher123     ║")
	colored(green, "║  student@ua.edu.bt  / student123     ║")
	colored(green, "║  parent@ua.edu.bt   / parent123      ║")
	colored(cyan, "╚══════════════════════════════════════╝")
	fmt.Println()
}
