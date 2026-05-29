package main

import (
	"log"
	"os"

	"ugyen-academy/db"
	"ugyen-academy/handlers"
	"ugyen-academy/middleware"
	"ugyen-academy/models"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env from parent directory (backend runs from backend/)
	if err := godotenv.Load("../.env"); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	db.Connect()

	// Auto-migrate all models
	if err := db.DB.AutoMigrate(
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

	r := gin.Default()

	// CORS configuration
	clientURL := os.Getenv("CLIENT_URL")
	if clientURL == "" {
		clientURL = "http://localhost:3000"
	}

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{clientURL},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept"},
		ExposeHeaders:    []string{"Authorization"},
		AllowCredentials: true,
	}))

	api := r.Group("/api")

	// Auth routes
	auth := api.Group("/auth")
	{
		auth.POST("/login", handlers.Login)
		auth.POST("/register", handlers.Register)
		auth.GET("/me", middleware.Protect(), handlers.Me)
	}

	// User routes
	users := api.Group("/users", middleware.Protect())
	{
		users.GET("/students/all", middleware.Authorize("admin", "teacher"), handlers.GetStudents)
		users.GET("/teachers/all", middleware.Authorize("admin"), handlers.GetTeachers)
	}

	// Progress routes
	progress := api.Group("/progress", middleware.Protect())
	{
		progress.GET("/my", handlers.GetMyProgress)
		progress.GET("/student/:studentId", middleware.Authorize("admin", "teacher"), handlers.GetStudentProgress)
		progress.POST("", middleware.Authorize("admin", "teacher"), handlers.CreateProgress)
	}

	// Attendance routes
	attendance := api.Group("/attendance", middleware.Protect())
	{
		attendance.GET("/my", handlers.GetMyAttendance)
		attendance.GET("/student/:id", middleware.Authorize("admin", "teacher"), handlers.GetStudentAttendance)
		attendance.GET("/stats/:id", handlers.GetAttendanceStats)
		attendance.POST("", middleware.Authorize("admin", "teacher"), handlers.MarkAttendance)
	}

	// Announcement routes
	announcements := api.Group("/announcements", middleware.Protect())
	{
		announcements.GET("", handlers.GetAnnouncements)
		announcements.POST("", middleware.Authorize("admin", "teacher"), handlers.CreateAnnouncement)
	}

	// Fees routes
	fees := api.Group("/fees", middleware.Protect())
	{
		fees.GET("/my", handlers.GetMyFees)
		fees.GET("/all", middleware.Authorize("admin"), handlers.GetAllFees)
		fees.GET("/parent", middleware.Authorize("parent"), handlers.GetParentFees)
		fees.GET("/summary/:id", handlers.GetFeeSummary)
		fees.POST("", middleware.Authorize("admin"), handlers.CreateFee)
	}

	// Library routes
	library := api.Group("/library", middleware.Protect())
	{
		library.GET("", handlers.GetBooks)
		library.POST("", middleware.Authorize("admin", "teacher"), handlers.AddBook)
		library.GET("/my-issues", handlers.GetMyIssues)
		library.GET("/issues", middleware.Authorize("admin", "teacher"), handlers.GetAllIssues)
		library.POST("/issues", middleware.Authorize("admin", "teacher"), handlers.IssueBook)
		library.PUT("/issues/:id/return", middleware.Authorize("admin", "teacher"), handlers.ReturnBook)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
