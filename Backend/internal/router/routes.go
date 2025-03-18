package router

import (
	"Backend/internal/controller"
	"net/http"
	"github.com/gin-gonic/gin"
	"Backend/internal/middleware" // Import middleware for authentication
)

func home(c *gin.Context) {
	c.Writer.WriteHeader(http.StatusOK)
}

func SetupRoutes(router *gin.Engine) {

	// Home route
	router.GET("/", home)
	
	// Group routes for application
	applicationGroup := router.Group("/application")
	{
		applicationGroup.POST("/add_application", controller.CreateApplicationHandler)
		applicationGroup.GET("/get_seeker_application/:id", controller.GetSeekerApplicationHandler)
		applicationGroup.GET("/get_job_application/:id", controller.GetJobApplicationHandler)
		applicationGroup.PATCH("/add_result/:id",controller.UpdateApplicationStatusHandler)
		applicationGroup.GET("/get_result/:id",controller.GetResultHandler)
		applicationGroup.GET("/get_application_count/:id",controller.GetSeekerApplicationCountHandler)
		applicationGroup.GET("/get_result_count/:id",controller.GetResultCountHandler)
	}

	// Group routes for interview
	interviewGroup := router.Group("/interview")
	{
		interviewGroup.POST("/schedule_interview", controller.ScheduleInterviewHandler)
		interviewGroup.GET("/get_interview/:id", controller.GetInterviewHandler)
		interviewGroup.GET("/get_seeker_interview/:id", controller.GetSeekerInterviewHandler)
		interviewGroup.PATCH("/update_interview",controller.UpdateInterviewHandler)
		interviewGroup.GET("/get_interview_count/:id",controller.GetSeekerInterviewCountHandler)
	}

	// Group routes for user authentication and user profile management
	userGroup := router.Group("/user")
	{
		userGroup.POST("/register/jobseeker", controller.RegisterJobSeeker)
		userGroup.POST("/register/employer", controller.RegisterEmployer)
		userGroup.POST("/seeker_login", controller.SeekerLoginHandler)
		userGroup.POST("/employer_login", controller.EmployerLoginHandler)
		userGroup.PUT("/update_jobseeker/:id", controller.UpdateJobSeekerProfile)
		userGroup.PUT("/update_employer/:id", controller.UpdateEmployerProfile)
		userGroup.DELETE("/delete_jobseeker/:id", controller.DeleteJobSeeker) 
		userGroup.DELETE("/delete_employer/:id", controller.DeleteEmployerHandler) 
		userGroup.POST("/logout", controller.LogoutHandler)  
	}

	notificationGroup := router.Group("/notification")
	{
		notificationGroup.GET("/get_notifications/:id",controller.GetNotificationsHandler)
	}

	// Employer Routes (Restricted)
	employerRoutes := router.Group("/employer")
	employerRoutes.Use(middleware.AuthMiddleware("employer")) // Secure with employer authentication
	{
		employerRoutes.POST("/jobs", controller.CreateJob)                 // Employer can post jobs
		employerRoutes.GET("/jobs", controller.FetchJobsByEmployer) // Fetch jobs posted by employer
		employerRoutes.PUT("/jobs/:id", controller.UpdateJob)              // Employer can update jobs
		employerRoutes.DELETE("/jobs/:id", controller.DeleteJob)           // Employer can delete jobs
	}

	// Job Seeker Routes (Restricted)
	jobSeekerRoutes := router.Group("/job_seeker")
	jobSeekerRoutes.Use(middleware.AuthMiddleware("job_seeker")) // Secure with job seeker authentication
	{
		jobSeekerRoutes.GET("/jobs", controller.FetchAllJobs)        // Job seeker can view jobs
		jobSeekerRoutes.GET("/jobs/:id", controller.FetchJob)       // Job seeker can view a job
		jobSeekerRoutes.GET("/jobs/filter", controller.FilterJobs)   // Job seeker can filter jobs
		jobSeekerRoutes.POST("/apply", controller.ApplyJob) // Job seeker can apply for jobs
	}

	// Public Routes (No authentication required)
	publicRoutes := router.Group("/jobs")
	{
		publicRoutes.GET("/", controller.FetchAllJobs)   // Anyone can view jobs
		publicRoutes.GET("/:id", controller.FetchJob)   // Anyone can view a job
		publicRoutes.GET("/filter", controller.FilterJobs) // Anyone can filter jobs
	}
}
