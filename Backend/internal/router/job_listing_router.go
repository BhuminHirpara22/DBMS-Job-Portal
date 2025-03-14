package router

import (
	"github.com/gin-gonic/gin"
	"Backend/internal/controller"
	"Backend/internal/middleware" // Import middleware for authentication
)

// SetupRoutesJobListing defines the routes
func SetupRoutesJobListing(router *gin.Engine) {

	// Employer Routes (Restricted)
	employerRoutes := router.Group("/employer")
	employerRoutes.Use(middleware.AuthMiddleware("employer")) // Secure with employer authentication
	{
		employerRoutes.POST("/jobs", controller.CreateJob)                 // Employer can post jobs
		employerRoutes.GET("/jobs", controller.FetchJobsByEmployerController) // Fetch jobs posted by employer
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
		jobSeekerRoutes.POST("/apply", controller.ApplyJobController) // Job seeker can apply for jobs
	}

	// Public Routes (No authentication required)
	publicRoutes := router.Group("/jobs")
	{
		publicRoutes.GET("/", controller.FetchAllJobs)   // Anyone can view jobs
		publicRoutes.GET("/:id", controller.FetchJob)   // Anyone can view a job
		publicRoutes.GET("/filter", controller.FilterJobs) // Anyone can filter jobs
	}
}