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
		applicationGroup.GET("/get_application/:id", controller.GetApplicationHandler)
	}

	// Group routes for interview
	interviewGroup := router.Group("/interview")
	{
		interviewGroup.POST("/schedule_interview", controller.ScheduleInterviewHandler)
		interviewGroup.GET("/get_interview/:id", controller.GetInterviewHandler)
		interviewGroup.PATCH("/update_interview",controller.UpdateInterviewHandler)
	}
}
