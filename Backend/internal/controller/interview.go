package controller

import (
	"Backend/internal/db"
	"Backend/internal/schema"
	"context"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func ScheduleInterviewHandler(c *gin.Context) {
	var interview schema.Interview
	if err := c.ShouldBindJSON(&interview); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}
	// Step 1: Generate a new application ID
	newID, err := db.GenerateInterviewID(context.Background())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate interview ID"})
		return
	}

	// Step 2: Assign the generated ID to the application struct
	interview.ID = newID

	result, err := db.ScheduleInterview(context.Background(), interview)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to schedule interview"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Interview scheduled successfully", "interview": result})
}

func GetInterviewHandler(c *gin.Context) {
	interviewID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid interview ID"})
		return
	}

	interviews, err := db.GetInterviews(context.Background(), interviewID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve interviews"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"interviews": interviews})
}


func UpdateInterviewHandler(c *gin.Context) {
	var interview schema.Interview
	if err := c.ShouldBindJSON(&interview); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	result, err := db.UpdateInterview(context.Background(), interview)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update interview"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Interview updated successfully", "interview": result})
}
