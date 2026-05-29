package handlers

import (
	"net/http"

	"ugyen-academy/db"
	"ugyen-academy/models"

	"github.com/gin-gonic/gin"
)

type StudentListItem struct {
	ID           string `json:"_id"`
	Name         string `json:"name"`
	Email        string `json:"email"`
	Class        string `json:"class"`
	Stream       string `json:"stream"`
	StudentID    string `json:"studentId"`
	AcademicYear string `json:"academicYear"`
}

func GetStudents(c *gin.Context) {
	var students []models.Student
	if err := db.DB.Preload("User").Find(&students).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	result := make([]StudentListItem, 0, len(students))
	for _, s := range students {
		result = append(result, StudentListItem{
			ID:           s.ID,
			Name:         s.User.Name,
			Email:        s.User.Email,
			Class:        s.Class,
			Stream:       s.Stream,
			StudentID:    s.StudentID,
			AcademicYear: s.AcademicYear,
		})
	}
	c.JSON(http.StatusOK, result)
}

type TeacherListItem struct {
	ID    string `json:"_id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Role  string `json:"role"`
}

func GetTeachers(c *gin.Context) {
	var users []models.User
	if err := db.DB.Where("role = ?", "teacher").Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	result := make([]TeacherListItem, 0, len(users))
	for _, u := range users {
		result = append(result, TeacherListItem{
			ID:    u.ID,
			Name:  u.Name,
			Email: u.Email,
			Role:  u.Role,
		})
	}
	c.JSON(http.StatusOK, result)
}
