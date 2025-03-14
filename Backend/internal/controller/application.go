package controller

import (
	"Backend/internal/db"
	"Backend/internal/schema"
	"context"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreateApplicationHandler(c *gin.Context) {
	var application schema.Application
	if err := c.ShouldBindJSON(&application); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// Step 1: Generate a new application ID
	newID, err := db.GenerateApplicationID(context.Background())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate application ID"})
		return
	}

	// Step 2: Assign the generated ID to the application struct
	application.ID = newID

	// Step 3: Create the application in the database
	result, err := db.CreateApplication(context.Background(), application)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create application"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Application created successfully", "application": result})
}

func GetSeekerApplicationHandler(c *gin.Context) {
	seekerID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid job seeker ID"})
		return
	}

	applications, err := db.GetSeekerApplications(context.Background(), seekerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve applications"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"applications": applications})
}

func GetJobApplicationHandler(c *gin.Context) {
	jobID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid job listing ID"})
		return
	}

	applications, err := db.GetJobApplications(context.Background(), jobID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve applications"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"applications": applications})
}

func UpdateApplicationStatusHandler(c *gin.Context) {
	// Parse application ID from URL parameter
	applicationID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid application ID"})
		return
	}

	// Parse request body for new status
	var requestBody struct {
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	// Validate status
	if requestBody.Status != "Approved" && requestBody.Status != "Rejected" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status. Allowed values: 'Approved' or 'Rejected'"})
		return
	}

	// Update application status in the database and return updated application
	updatedApplication, err := db.UpdateApplicationStatus(context.Background(), applicationID, requestBody.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update application status"})
		return
	}

	err = db.DeleteInterview(context.Background(), applicationID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete interview"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":     "Application status updated successfully",
		"application": updatedApplication,
	})
}
