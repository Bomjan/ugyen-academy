package handlers

import (
	"net/http"
	"time"

	"ugyen-academy/db"
	"ugyen-academy/models"

	"github.com/gin-gonic/gin"
)

func GetBooks(c *gin.Context) {
	var books []models.Book
	db.DB.Order("created_at desc").Find(&books)
	c.JSON(http.StatusOK, books)
}

func AddBook(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var body struct {
		Title       string `json:"title" binding:"required"`
		Author      string `json:"author"`
		Category    string `json:"category"`
		TotalCopies int    `json:"totalCopies"`
		ISBN        string `json:"isbn"`
		Publisher   string `json:"publisher"`
		Shelf       string `json:"shelf"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	copies := body.TotalCopies
	if copies <= 0 {
		copies = 1
	}

	book := models.Book{
		Title:           body.Title,
		Author:          body.Author,
		Category:        body.Category,
		TotalCopies:     copies,
		AvailableCopies: copies,
		ISBN:            body.ISBN,
		Publisher:       body.Publisher,
		Shelf:           body.Shelf,
		AddedByID:       user.ID,
	}
	if err := db.DB.Create(&book).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, book)
}

type IssueResponse struct {
	ID        string         `json:"_id"`
	Book      models.Book    `json:"book"`
	IssuedAt  time.Time      `json:"issuedAt"`
	DueDate   time.Time      `json:"dueDate"`
	Status    string         `json:"status"`
	Fine      float64        `json:"fine"`
}

func GetMyIssues(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var student models.Student
	if err := db.DB.Where("user_id = ?", user.ID).First(&student).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{"data": []IssueResponse{}})
		return
	}

	var issues []models.BookIssue
	db.DB.Preload("Book").Where("student_id = ?", student.ID).Order("issued_at desc").Find(&issues)

	result := make([]IssueResponse, 0, len(issues))
	for _, i := range issues {
		result = append(result, IssueResponse{
			ID:       i.ID,
			Book:     i.Book,
			IssuedAt: i.IssuedAt,
			DueDate:  i.DueDate,
			Status:   i.Status,
			Fine:     i.Fine,
		})
	}
	c.JSON(http.StatusOK, gin.H{"data": result})
}

func GetAllIssues(c *gin.Context) {
	var issues []models.BookIssue
	db.DB.Preload("Book").Order("issued_at desc").Find(&issues)

	result := make([]IssueResponse, 0, len(issues))
	for _, i := range issues {
		result = append(result, IssueResponse{
			ID:       i.ID,
			Book:     i.Book,
			IssuedAt: i.IssuedAt,
			DueDate:  i.DueDate,
			Status:   i.Status,
			Fine:     i.Fine,
		})
	}
	c.JSON(http.StatusOK, result)
}

func IssueBook(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var body struct {
		BookID    string `json:"bookId" binding:"required"`
		StudentID string `json:"studentId" binding:"required"`
		DueDate   string `json:"dueDate"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var book models.Book
	if err := db.DB.First(&book, "id = ?", body.BookID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	}
	if book.AvailableCopies <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No copies available"})
		return
	}

	dueDate := time.Now().AddDate(0, 0, 14)
	if body.DueDate != "" {
		if t, err := time.Parse(time.RFC3339, body.DueDate); err == nil {
			dueDate = t
		} else if t, err := time.Parse("2006-01-02", body.DueDate); err == nil {
			dueDate = t
		}
	}

	issue := models.BookIssue{
		BookID:     body.BookID,
		StudentID:  body.StudentID,
		IssuedByID: user.ID,
		IssuedAt:   time.Now(),
		DueDate:    dueDate,
		Status:     "issued",
	}

	if err := db.DB.Create(&issue).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	db.DB.Model(&book).Update("available_copies", book.AvailableCopies-1)
	db.DB.Preload("Book").First(&issue, "id = ?", issue.ID)
	c.JSON(http.StatusCreated, issue)
}

func ReturnBook(c *gin.Context) {
	id := c.Param("id")

	var issue models.BookIssue
	if err := db.DB.Preload("Book").First(&issue, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Issue not found"})
		return
	}

	now := time.Now()
	issue.Status = "returned"
	issue.ReturnedAt = &now

	db.DB.Save(&issue)
	db.DB.Model(&models.Book{}).Where("id = ?", issue.BookID).
		Update("available_copies", issue.Book.AvailableCopies+1)

	c.JSON(http.StatusOK, issue)
}
