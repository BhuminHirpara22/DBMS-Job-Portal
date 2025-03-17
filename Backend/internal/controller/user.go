package controllers

import (
	"context"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"Backend/config"
	"Backend/internal/db"
	"Backend/internal/schema"
	"Backend/internal/helpers" // Ensure this package provides HashPassword, CheckPassword, GenerateJWT, etc.
)

// ------------------------------
// Registration Handlers
// ------------------------------

// RegisterJobSeeker handles job seeker registration.
// It binds incoming JSON to the JobSeeker struct, hashes the password,
// then calls the database function to insert the new job seeker.
func RegisterJobSeeker(c *gin.Context) {
	var newJobSeeker schema.JobSeeker
	if err := c.ShouldBindJSON(&newJobSeeker); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Hash the provided password for security.
	hashedPassword, err := helpers.HashPassword(newJobSeeker.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error hashing password"})
		return
	}
	newJobSeeker.Password = hashedPassword

	// Insert the new job seeker into the database.
	id, err := db.RegisterJobSeeker(context.Background(), newJobSeeker)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Return a success response with the new user's ID.
	c.JSON(http.StatusCreated, gin.H{"message": "Job Seeker registered successfully", "id": id})
}

// RegisterEmployer handles employer registration.
// It follows a similar process as job seeker registration.
func RegisterEmployer(c *gin.Context) {
	var newEmployer schema.Employer
	if err := c.ShouldBindJSON(&newEmployer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Hash the provided password.
	hashedPassword, err := helpers.HashPassword(newEmployer.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error hashing password"})
		return
	}
	newEmployer.Password = hashedPassword

	// Insert the new employer into the database.
	id, err := db.RegisterEmployer(context.Background(), newEmployer)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Employer registered successfully", "id": id})
}

// ------------------------------
// Login Handler
// ------------------------------

// LoginHandler handles login requests for both job seekers and employers.
// It validates credentials, checks the password using helper functions,
// generates a JWT token on success, and sends back the login response.
func LoginHandler(c *gin.Context) {
	var loginReq schema.LoginRequest
	if err := c.ShouldBindJSON(&loginReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var token string
	var userID int
	var firstName string

	// Determine user type from the login request.
	switch loginReq.UserType {
	case "job_seeker":
		// Validate job seeker credentials from the DB.
		jobSeeker, err := db.ValidateJobSeekerCredentials(context.Background(), loginReq.Email, loginReq.Password)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
			return
		}
		// Verify the provided password matches the stored hash.
		if !helpers.CheckPassword(loginReq.Password, jobSeeker.Password) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
			return
		}
		userID = jobSeeker.ID
		firstName = jobSeeker.FirstName

	case "employer":
		// Validate employer credentials.
		employer, err := db.ValidateEmployerCredentials(context.Background(), loginReq.Email, loginReq.Password)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
			return
		}
		if !helpers.CheckPassword(loginReq.Password, employer.Password) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
			return
		}
		userID = employer.ID

	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user type"})
		return
	}

	// Generate a JWT token to be used for authenticated requests.
	token, err := helpers.GenerateJWT(userID, loginReq.UserType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// Return the login response with token and user details.
	c.JSON(http.StatusOK, schema.LoginResponse{
		Token:     token,
		UserID:    userID,
		UserType:  loginReq.UserType,
		FirstName: firstName,
		Email:     loginReq.Email,
	})
}

// ------------------------------
// Update Handlers
// ------------------------------

// UpdateJobSeekerProfile handles updating a job seeker's profile.
// It extracts the user ID from the URL, binds the request body,
// optionally hashes the new password, and updates the record in the database.
func UpdateJobSeekerProfile(c *gin.Context) {
	// Extract the job seeker ID from the URL parameter.
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID parameter"})
		return
	}

	var jobSeeker schema.JobSeeker
	if err := c.ShouldBindJSON(&jobSeeker); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set the ID to ensure we update the correct record.
	jobSeeker.ID = id

	// If the password is provided for update, hash it.
	if jobSeeker.Password != "" {
		hashedPassword, err := helpers.HashPassword(jobSeeker.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error hashing password"})
			return
		}
		jobSeeker.Password = hashedPassword
	}

	// Call the DB function to update the job seeker record.
	if err := db.UpdateJobSeeker(context.Background(), jobSeeker); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Job Seeker profile updated successfully"})
}

// UpdateEmployerProfile handles updating an employer's profile.
// It follows the same pattern as the job seeker update.
func UpdateEmployerProfile(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID parameter"})
		return
	}

	var employer schema.Employer
	if err := c.ShouldBindJSON(&employer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	employer.ID = id

	// Hash the password if it's provided.
	if employer.Password != "" {
		hashedPassword, err := helpers.HashPassword(employer.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error hashing password"})
			return
		}
		employer.Password = hashedPassword
	}

	if err := db.UpdateEmployer(context.Background(), employer); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Employer profile updated successfully"})
}
