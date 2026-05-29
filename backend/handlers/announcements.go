package handlers

import (
	"net/http"

	"ugyen-academy/db"
	"ugyen-academy/models"

	"github.com/gin-gonic/gin"
)

func GetAnnouncements(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var records []models.Announcement
	query := db.DB.Order("pinned desc, created_at desc")

	switch user.Role {
	case "student":
		query = query.Where("target_audience IN ('all', 'students')")
	case "teacher":
		query = query.Where("target_audience IN ('all', 'staff', 'teachers')")
	case "parent":
		query = query.Where("target_audience IN ('all', 'parents')")
	case "admin":
		// admin sees all
	}

	query.Find(&records)
	c.JSON(http.StatusOK, records)
}

func CreateAnnouncement(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var body struct {
		Title          string `json:"title" binding:"required"`
		Body           string `json:"body"`
		TargetAudience string `json:"targetAudience"`
		TargetClass    string `json:"targetClass"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if body.TargetAudience == "" {
		body.TargetAudience = "all"
	}

	record := models.Announcement{
		Title:          body.Title,
		Body:           body.Body,
		TargetAudience: body.TargetAudience,
		TargetClass:    body.TargetClass,
		PostedByID:     user.ID,
	}
	if err := db.DB.Create(&record).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, record)
}
