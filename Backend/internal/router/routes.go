package router

import (
	"Backend/internal/controller"
	"net/http"

	"github.com/gin-gonic/gin"
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
		userGroup.POST("/login", controller.LoginHandler)
		userGroup.PUT("/jobseeker/:id", controller.UpdateJobSeekerProfile)
		userGroup.PUT("/employer/:id", controller.UpdateEmployerProfile)
		userGroup.DELETE("/user/:id", controller.DeleteUser) 
		userGroup.POST("/logout", controller.LogoutHandler)  
	}
}