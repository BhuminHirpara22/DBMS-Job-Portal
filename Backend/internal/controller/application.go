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

func GetApplicationHandler(c *gin.Context) {
	applicationID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid application ID"})
		return
	}

	applications, err := db.GetApplications(context.Background(), applicationID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve applications"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"applications": applications})
}
