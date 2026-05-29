package handlers

import (
	"net/http"
	"time"

	"ugyen-academy/db"
	"ugyen-academy/models"

	"github.com/gin-gonic/gin"
)

func GetMyAttendance(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var student models.Student
	if err := db.DB.Where("user_id = ?", user.ID).First(&student).Error; err != nil {
		c.JSON(http.StatusOK, []models.Attendance{})
		return
	}

	var records []models.Attendance
	db.DB.Where("student_id = ?", student.ID).Order("date desc").Find(&records)
	c.JSON(http.StatusOK, records)
}

func GetStudentAttendance(c *gin.Context) {
	id := c.Param("id")

	var records []models.Attendance
	db.DB.Where("student_id = ?", id).Order("date desc").Find(&records)
	c.JSON(http.StatusOK, records)
}

type AttendanceStats struct {
	Total      int     `json:"total"`
	Present    int     `json:"present"`
	Absent     int     `json:"absent"`
	Late       int     `json:"late"`
	Excused    int     `json:"excused"`
	Percentage float64 `json:"percentage"`
}

func GetAttendanceStats(c *gin.Context) {
	id := c.Param("id")

	// Try to find student by user_id first (frontend passes user UUID)
	var student models.Student
	if err := db.DB.Where("user_id = ?", id).First(&student).Error; err != nil {
		// Try by student UUID
		if err2 := db.DB.Where("id = ?", id).First(&student).Error; err2 != nil {
			c.JSON(http.StatusOK, AttendanceStats{})
			return
		}
	}

	var records []models.Attendance
	db.DB.Where("student_id = ?", student.ID).Find(&records)

	stats := AttendanceStats{Total: len(records)}
	for _, r := range records {
		switch r.Status {
		case "present":
			stats.Present++
		case "absent":
			stats.Absent++
		case "late":
			stats.Late++
		case "excused":
			stats.Excused++
		}
	}
	if stats.Total > 0 {
		stats.Percentage = float64(stats.Present+stats.Late) / float64(stats.Total) * 100
	}
	c.JSON(http.StatusOK, stats)
}

func MarkAttendance(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var body struct {
		Records []struct {
			StudentID string `json:"studentId"`
			Date      string `json:"date"`
			Subject   string `json:"subject"`
			Status    string `json:"status"`
		} `json:"records"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	count := 0
	for _, r := range body.Records {
		date, err := time.Parse(time.RFC3339, r.Date)
		if err != nil {
			// try date-only format
			date, err = time.Parse("2006-01-02", r.Date)
			if err != nil {
				continue
			}
		}
		record := models.Attendance{
			StudentID:  r.StudentID,
			MarkedByID: user.ID,
			Date:       date,
			Status:     r.Status,
			Subject:    r.Subject,
		}
		if err := db.DB.Create(&record).Error; err == nil {
			count++
		}
	}
	c.JSON(http.StatusCreated, gin.H{"count": count})
}
