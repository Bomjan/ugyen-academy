package handlers

import (
	"net/http"
	"time"

	"ugyen-academy/db"
	"ugyen-academy/models"

	"github.com/gin-gonic/gin"
)

func GetMyFees(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var student models.Student
	if err := db.DB.Where("user_id = ?", user.ID).First(&student).Error; err != nil {
		c.JSON(http.StatusOK, []models.Fee{})
		return
	}

	var fees []models.Fee
	db.DB.Where("student_id = ?", student.ID).Order("due_date desc").Find(&fees)
	c.JSON(http.StatusOK, fees)
}

func GetAllFees(c *gin.Context) {
	var fees []models.Fee
	db.DB.Order("due_date desc").Find(&fees)
	c.JSON(http.StatusOK, fees)
}

func GetParentFees(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var students []models.Student
	db.DB.Where("parent_id = ?", user.ID).Find(&students)

	if len(students) == 0 {
		c.JSON(http.StatusOK, []models.Fee{})
		return
	}

	ids := make([]string, 0, len(students))
	for _, s := range students {
		ids = append(ids, s.ID)
	}

	var fees []models.Fee
	db.DB.Where("student_id IN ?", ids).Order("due_date desc").Find(&fees)
	c.JSON(http.StatusOK, fees)
}

type FeeSummary struct {
	Total   float64 `json:"total"`
	Paid    float64 `json:"paid"`
	Pending float64 `json:"pending"`
	Overdue float64 `json:"overdue"`
}

func GetFeeSummary(c *gin.Context) {
	id := c.Param("id")

	// Try by user_id first (frontend passes user UUID)
	var student models.Student
	if err := db.DB.Where("user_id = ?", id).First(&student).Error; err != nil {
		// Try by student UUID
		if err2 := db.DB.Where("id = ?", id).First(&student).Error; err2 != nil {
			c.JSON(http.StatusOK, FeeSummary{})
			return
		}
	}

	var fees []models.Fee
	db.DB.Where("student_id = ?", student.ID).Find(&fees)

	now := time.Now()
	summary := FeeSummary{}
	for _, f := range fees {
		summary.Total += f.Amount
		switch f.Status {
		case "paid":
			summary.Paid += f.Amount
		case "pending":
			if f.DueDate.Before(now) {
				summary.Overdue += f.Amount
			} else {
				summary.Pending += f.Amount
			}
		case "overdue":
			summary.Overdue += f.Amount
		}
	}
	c.JSON(http.StatusOK, summary)
}

func CreateFee(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var body struct {
		StudentID    string  `json:"studentId" binding:"required"`
		FeeType      string  `json:"feeType" binding:"required"`
		Amount       float64 `json:"amount" binding:"required"`
		DueDate      string  `json:"dueDate"`
		Status       string  `json:"status"`
		AcademicYear string  `json:"academicYear"`
		Term         string  `json:"term"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	dueDate := time.Now().AddDate(0, 1, 0)
	if body.DueDate != "" {
		if t, err := time.Parse(time.RFC3339, body.DueDate); err == nil {
			dueDate = t
		} else if t, err := time.Parse("2006-01-02", body.DueDate); err == nil {
			dueDate = t
		}
	}

	status := body.Status
	if status == "" {
		status = "pending"
	}

	fee := models.Fee{
		StudentID:    body.StudentID,
		FeeType:      body.FeeType,
		Amount:       body.Amount,
		DueDate:      dueDate,
		Status:       status,
		AcademicYear: body.AcademicYear,
		Term:         body.Term,
		RecordedByID: user.ID,
	}
	if err := db.DB.Create(&fee).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, fee)
}
