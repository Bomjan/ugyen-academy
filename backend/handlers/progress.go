package handlers

import (
	"net/http"

	"ugyen-academy/db"
	"ugyen-academy/models"

	"github.com/gin-gonic/gin"
)

func GetMyProgress(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var student models.Student
	if err := db.DB.Where("user_id = ?", user.ID).First(&student).Error; err != nil {
		c.JSON(http.StatusOK, []models.Progress{})
		return
	}

	var records []models.Progress
	db.DB.Where("student_id = ?", student.ID).Order("created_at desc").Find(&records)
	c.JSON(http.StatusOK, records)
}

func GetStudentProgress(c *gin.Context) {
	studentID := c.Param("studentId")

	var records []models.Progress
	db.DB.Where("student_id = ?", studentID).Order("created_at desc").Find(&records)
	c.JSON(http.StatusOK, records)
}

func CreateProgress(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var body struct {
		StudentID      string  `json:"studentId" binding:"required"`
		Subject        string  `json:"subject" binding:"required"`
		Marks          float64 `json:"marks"`
		Term           string  `json:"term"`
		AssessmentType string  `json:"assessmentType"`
		Remarks        string  `json:"remarks"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	record := models.Progress{
		StudentID:      body.StudentID,
		RecordedByID:   user.ID,
		Subject:        body.Subject,
		Marks:          body.Marks,
		Term:           body.Term,
		AssessmentType: body.AssessmentType,
		Remarks:        body.Remarks,
	}
	if err := db.DB.Create(&record).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, record)
}
