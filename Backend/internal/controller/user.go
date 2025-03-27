package controller

import (
	"Backend/internal/db"
	"Backend/internal/helpers" // Ensure this package provides HashPassword, CheckPassword, GenerateJWT, etc.
	"Backend/internal/schema"
	"context"
	"fmt"
	"net/http"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
)

// ------------------------------
// Registration Handlers
// ------------------------------

// RegisterJobSeeker handles job seeker registration.
// It binds incoming JSON to the JobSeeker struct, hashes the password,
// then calls the database function to insert the new job seeker.
func RegisterJobSeeker(c *gin.Context) {
	// Parse multipart form data
	if err := c.Request.ParseMultipartForm(10 << 20); err != nil { // 10 MB max
		fmt.Printf("Error parsing form: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Error parsing form data",
			"error":   err.Error(),
		})
		return
	}

	var newJobSeeker schema.JobSeeker

	// Bind form data instead of JSON
	// if err := c.ShouldBind(&newJobSeeker); err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{
	// 		"success": false,
	// 		"message": "Invalid request data",
	// 		"error":   err.Error(),
	// 	})
	// 	fmt.Println("Error binding form data:", err)
	// 	return
	// }

	// Get form values
	newJobSeeker.FirstName = c.PostForm("first_name")
	newJobSeeker.LastName = c.PostForm("last_name")
	newJobSeeker.Email = c.PostForm("email")
	newJobSeeker.Password = c.PostForm("password")
	newJobSeeker.PhoneNumber = c.PostForm("phone_number")
	newJobSeeker.LinkedinURL = c.PostForm("linkedin_url")
	newJobSeeker.Location = c.PostForm("location")

	// Validate required fields
	if newJobSeeker.FirstName == "" || newJobSeeker.LastName == "" || newJobSeeker.Email == "" || newJobSeeker.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "All fields are required",
		})
		return
	}

	// Handle education data
	educationLevel := c.PostFormArray("education_level")
	institutionName := c.PostFormArray("institution_name")
	fieldOfStudy := c.PostFormArray("field_of_study")
	startYear := c.PostFormArray("start_year")
	endYear := c.PostFormArray("end_year")
	grade := c.PostFormArray("grade")

	for i := range educationLevel {
		newJobSeeker.Education = append(newJobSeeker.Education, schema.Education{
			Level:        educationLevel[i],
			Institution:  institutionName[i],
			FieldOfStudy: fieldOfStudy[i],
			StartYear:    startYear[i],
			EndYear:      endYear[i],
			Grade:        grade[i],
		})
	}

	// Handle experience data
	jobTitle := c.PostFormArray("job_title")
	companyName := c.PostFormArray("company_name")
	location := c.PostFormArray("location")
	startDate := c.PostFormArray("start_date")
	endDate := c.PostFormArray("end_date")	// Optional

	for i := range jobTitle {
		newJobSeeker.Experience = append(newJobSeeker.Experience, schema.Experience{
			JobTitle:    jobTitle[i],
			CompanyName: companyName[i],
			Location:    location[i],
			StartDate:   startDate[i],
			EndDate:     endDate[i],
		})
	}

	// Handle skills data
	skillName := c.PostFormArray("skill_name")
	skillProficiency := c.PostFormArray("skill_proficiency")

	for i := range skillName {
		newJobSeeker.Skills = append(newJobSeeker.Skills, schema.Skill{
			SkillName:        skillName[i],
			SkillProficiency: skillProficiency[i],
		})
	}


	// Handle resume file upload
	var resumePath string
	file, fileErr := c.FormFile("resume")
	if fileErr == nil && file != nil {
		// Generate a unique filename
		filename := fmt.Sprintf("%s%s", newJobSeeker.Email, filepath.Ext(file.Filename))

		// Save the file
		if err := c.SaveUploadedFile(file, "uploads/Resumes/"+filename); err != nil {
			fmt.Printf("Error saving file: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Error saving resume file",
				"error":   err.Error(),
			})
			return
		}
		resumePath = "uploads/Resumes/" + filename
	} else if fileErr == http.ErrMissingFile {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Resume file is required",
		})
		return
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Error retrieving resume file",
			"error":   fileErr.Error(),
		})
		return
	}

	// Assign resume path to job seeker struct
	newJobSeeker.Resume = &resumePath

	// Hash the provided password
	hashedPassword, err := helpers.HashPassword(newJobSeeker.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Error processing password",
			"error":   err.Error(),
		})
		fmt.Println("Error hashing password:", err)
		return
	}
	newJobSeeker.Password = hashedPassword

	// Insert the new job seeker into the database
	id, err := db.RegisterJobSeeker(context.Background(), newJobSeeker)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Error registering job seeker",
			"error":   err.Error(),
		})
		fmt.Println("Error registering job seeker:", err)
		return
	}

	// Return a success response
	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Job Seeker registered successfully",
		"id":      id,
	})
}

// RegisterEmployer handles employer registration.
// It follows a similar process as job seeker registration.
func RegisterEmployer(c *gin.Context) {
	var newEmployer schema.InputEmployer

	if err := c.ShouldBindJSON(&newEmployer); err != nil {
		fmt.Printf("Error binding JSON: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request data",
			"error":   err.Error(),
		})
		return
	}

	fmt.Printf("Received employer data: %+v\n", newEmployer)

	// Hash the provided password.
	hashedPassword, err := helpers.HashPassword(newEmployer.Password)
	if err != nil {
		fmt.Printf("Error hashing password: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Error processing password",
			"error":   err.Error(),
		})
		return
	}
	newEmployer.Password = hashedPassword

	// Insert the new employer into the database.
	id, err := db.RegisterEmployer(context.Background(), newEmployer)
	if err != nil {
		fmt.Printf("Error registering employer: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Error registering employer",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Employer registered successfully",
		"id":      id,
	})
}

// ------------------------------
// Login Handler
// ------------------------------

// LoginHandler handles login requests for both job seekers and employers.
// It validates credentials, checks the password using helper functions,
// generates a JWT token on success, and sends back the login response.
func SeekerLoginHandler(c *gin.Context) {
	var loginReq schema.LoginRequest
	if err := c.ShouldBindJSON(&loginReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var userID int
	var firstName string

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

	// Return the login response with token and user details.
	c.JSON(http.StatusOK, schema.LoginResponse{
		UserID:    userID,
		FirstName: firstName,
		Email:     loginReq.Email,
	})
}

func EmployerLoginHandler(c *gin.Context) {
	var loginReq schema.LoginRequest
	if err := c.ShouldBindJSON(&loginReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var userID int
	var firstName string
	fmt.Println("Employer login")
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

	// Return the login response with token and user details.
	c.JSON(http.StatusOK, schema.LoginResponse{
		UserID:    userID,
		FirstName: firstName,
		Email:     loginReq.Email,
	})
}

func GetJobSeekerHandler(c *gin.Context) {
	id, err := strconv.Atoi(c.Param(("id")))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID parameter"})
		return
	}

	jobseeker, err := db.GetJobSeeker(c, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"profile": jobseeker})
}

func GetEmployerHandler(c *gin.Context) {
	id, err := strconv.Atoi(c.Param(("id")))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID parameter"})
		return
	}

	employer, err := db.GetEmployer(c, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"profile": employer})
}

// ------------------------------
// Update Handlers
// ------------------------------

// UpdateJobSeekerProfile handles updating a job seeker's profile.
// It extracts the user ID from the URL, binds the request body,
// optionally hashes the new password, and updates the record in the database.
func UpdateJobSeekerProfile(c *gin.Context) {
	// Extract the job seeker ID from the URL parameter.
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID parameter"})
		return
	}

	jobSeeker,err := db.GetJobSeeker(c, id)
	var jobSeekerInput schema.JobSeekerInput
	if err := c.ShouldBindJSON(&jobSeekerInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	jobSeeker.FirstName = jobSeekerInput.FirstName
	jobSeeker.LastName = jobSeekerInput.LastName
	jobSeeker.Location = jobSeekerInput.Location
	jobSeeker.PhoneNumber = jobSeekerInput.PhoneNumber
	jobSeeker.Email = jobSeekerInput.Email
	jobSeeker.Skills = jobSeekerInput.Skills
	jobSeeker.Experience = jobSeekerInput.Experience
	jobSeeker.Education = jobSeekerInput.Education
	jobSeeker.LinkedinURL = jobSeekerInput.LinkedinURL
	jobSeeker.Resume = jobSeekerInput.Resume
	jobSeeker.ProfilePicture = jobSeekerInput.ProfilePicture

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

	jobSeeker.Password = "" // Don't return the password in the response

	c.JSON(http.StatusOK, gin.H{"message": "Job Seeker profile updated successfully","profile": jobSeeker})
}
// UpdateEmployerProfile handles updating an employer's profile.
// It follows the same pattern as the job seeker update.
func UpdateEmployerProfile(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
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

// DeleteUser handles deleting a user (job seeker or employer).
func DeleteJobSeeker(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	err = db.DeleteJobSeeker(context.Background(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

func DeleteEmployerHandler(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	userType := c.Query("type") // Expecting "job_seeker" or "employer"
	if userType != "job_seeker" && userType != "employer" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user type"})
		return
	}

	err = db.DeleteEmployer(context.Background(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

// LogoutHandler simply invalidates the token client-side.
func LogoutHandler(c *gin.Context) {
	// Invalidate token logic (on frontend)
	c.JSON(http.StatusOK, gin.H{"message": "Logout successful"})
}
