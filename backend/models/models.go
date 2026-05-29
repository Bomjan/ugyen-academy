package models

import "time"

type User struct {
	ID        string    `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"_id"`
	Name      string    `gorm:"not null" json:"name"`
	Email     string    `gorm:"uniqueIndex;not null" json:"email"`
	Password  string    `gorm:"not null" json:"-"`
	Role      string    `gorm:"not null;default:'student'" json:"role"`
	Phone     string    `json:"phone"`
	CreatedAt time.Time `json:"createdAt"`
}

type Student struct {
	ID          string    `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"_id"`
	UserID      string    `gorm:"type:uuid;not null;index" json:"userId"`
	User        User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
	StudentID   string    `gorm:"uniqueIndex" json:"studentId"`
	Class       string    `json:"class"`
	Stream      string    `json:"stream"`
	RollNo      int       `json:"rollNo"`
	ParentID    string    `gorm:"type:uuid" json:"parentId"`
	AcademicYear string   `json:"academicYear"`
	CreatedAt   time.Time `json:"createdAt"`
}

type Progress struct {
	ID             string    `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"_id"`
	StudentID      string    `gorm:"type:uuid;not null;index" json:"studentId"`
	RecordedByID   string    `gorm:"type:uuid" json:"recordedById"`
	Subject        string    `gorm:"not null" json:"subject"`
	Marks          float64   `json:"marks"`
	Term           string    `json:"term"`
	AssessmentType string    `json:"assessmentType"`
	Remarks        string    `json:"remarks"`
	AcademicYear   string    `json:"academicYear"`
	CreatedAt      time.Time `json:"createdAt"`
}

type Attendance struct {
	ID          string    `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"_id"`
	StudentID   string    `gorm:"type:uuid;not null;index" json:"studentId"`
	MarkedByID  string    `gorm:"type:uuid" json:"markedById"`
	Date        time.Time `json:"date"`
	Status      string    `gorm:"not null" json:"status"`
	Subject     string    `json:"subject"`
	CreatedAt   time.Time `json:"createdAt"`
}

type Announcement struct {
	ID             string    `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"_id"`
	Title          string    `gorm:"not null" json:"title"`
	Body           string    `json:"body"`
	TargetAudience string    `gorm:"default:'all'" json:"targetAudience"`
	TargetClass    string    `json:"targetClass"`
	PostedByID     string    `gorm:"type:uuid" json:"postedById"`
	Pinned         bool      `gorm:"default:false" json:"pinned"`
	CreatedAt      time.Time `json:"createdAt"`
}

type Fee struct {
	ID           string     `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"_id"`
	StudentID    string     `gorm:"type:uuid;not null;index" json:"studentId"`
	FeeType      string     `gorm:"not null" json:"feeType"`
	Description  string     `json:"description"`
	Amount       float64    `gorm:"not null" json:"amount"`
	DueDate      time.Time  `json:"dueDate"`
	Status       string     `gorm:"not null;default:'pending'" json:"status"`
	PaidDate     *time.Time `json:"paidDate"`
	AcademicYear string     `json:"academicYear"`
	Term         string     `json:"term"`
	RecordedByID string     `gorm:"type:uuid" json:"recordedById"`
	CreatedAt    time.Time  `json:"createdAt"`
}

type Book struct {
	ID              string    `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"_id"`
	Title           string    `gorm:"not null" json:"title"`
	Author          string    `json:"author"`
	Category        string    `json:"category"`
	TotalCopies     int       `gorm:"default:1" json:"totalCopies"`
	AvailableCopies int       `gorm:"default:1" json:"availableCopies"`
	ISBN            string    `json:"isbn"`
	Publisher       string    `json:"publisher"`
	Shelf           string    `json:"shelf"`
	AddedByID       string    `gorm:"type:uuid" json:"addedById"`
	CreatedAt       time.Time `json:"createdAt"`
}

type BookIssue struct {
	ID         string     `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"_id"`
	BookID     string     `gorm:"type:uuid;not null;index" json:"bookId"`
	Book       Book       `gorm:"foreignKey:BookID" json:"book"`
	StudentID  string     `gorm:"type:uuid;not null;index" json:"studentId"`
	IssuedByID string     `gorm:"type:uuid" json:"issuedById"`
	IssuedAt   time.Time  `json:"issuedAt"`
	DueDate    time.Time  `json:"dueDate"`
	ReturnedAt *time.Time `json:"returnedAt"`
	Status     string     `gorm:"not null;default:'issued'" json:"status"`
	Fine       float64    `gorm:"default:0" json:"fine"`
	CreatedAt  time.Time  `json:"createdAt"`
}
