package controller

import (
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"Backend/internal/db"
	"Backend/internal/schema"
)

// CreateJobController handles job creation with requirements
func CreateJob(c *gin.Context) {
	// Temporary struct for input
	var jobInput struct {
		EmployerID  int      `json:"employer_id"`
		JobTitle    string   `json:"job_title"`
		Description string   `json:"description"`
		Location    string   `json:"location"`
		JobType     string   `json:"job_type"`
		MinSalary   float64  `json:"min_salary"`
		MaxSalary   float64  `json:"max_salary"`
		ExpiryDate  string   `json:"expiry_date"`
		JobCategory string   `json:"job_category"`
		Requirements []string `json:"requirements"` // ✅ Include requirements
	}

	// Bind JSON input
	if err := c.ShouldBindJSON(&jobInput); err != nil {
		log.Println("[ERROR] Invalid job input:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	// ✅ Convert expiry_date to time.Time
	expiryTime, err := time.Parse("2006-01-02", jobInput.ExpiryDate)
	if err != nil {
		log.Println("[ERROR] Invalid expiry_date format:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid expiry_date format. Use YYYY-MM-DD."})
		return
	}

	// ✅ Prepare Job Struct
	job := schema.JobListing{
		EmployerID:  jobInput.EmployerID,
		JobTitle:    jobInput.JobTitle,
		Description: jobInput.Description,
		Location:    jobInput.Location,
		JobType:     jobInput.JobType,
		MinSalary:   jobInput.MinSalary,
		MaxSalary:   jobInput.MaxSalary,
		ExpiryDate:  expiryTime,
		JobCategory: jobInput.JobCategory,
	}

	// ✅ Call DB function to create job with requirements
	jobID, err := db.CreateJob(job, jobInput.Requirements)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create job"})
		return
	}

	log.Printf("[SUCCESS] Job Created: ID=%d with Requirements=%v\n", jobID, jobInput.Requirements)
	c.JSON(http.StatusCreated, gin.H{"job_id": jobID, "message": "Job created successfully"})
}



// FetchAllJobs retrieves all job listings with pagination
func FetchAllJobs(c *gin.Context) {
	limit, err := strconv.Atoi(c.DefaultQuery("limit", "10"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid limit"})
		return
	}
	offset, err := strconv.Atoi(c.DefaultQuery("offset", "0"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid offset"})
		return
	}

	jobs, err := db.FetchAllJobs(limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch jobs"})
		return
	}

	c.JSON(http.StatusOK, jobs)
}

// FetchJob retrieves a single job by ID
func FetchJob(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid job ID"})
		return
	}

	job, err := db.FetchJob(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Job not found"})
		return
	}

	c.JSON(http.StatusOK, job)
}

// FetchJobsByEmployer retrieves jobs created by a specific employer
func FetchJobsByEmployerController(c *gin.Context) {
	employerID, err := strconv.Atoi(c.Query("employer_id"))
	if err != nil || employerID <= 0 {
		log.Println("Invalid employer_id:", employerID)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid employer_id"})
		return
	}

	jobs, err := db.FetchJobsByEmployer(employerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch jobs"})
		return
	}

	c.JSON(http.StatusOK, jobs)
}

// UpdateJob updates an existing job listing
func UpdateJob(c *gin.Context) {
	// Temporary struct for input
	var jobInput struct {
		JobTitle    string   `json:"job_title"`
		Description string   `json:"description"`
		Location    string   `json:"location"`
		JobType     string   `json:"job_type"`
		MinSalary   float64  `json:"min_salary"`
		MaxSalary   float64  `json:"max_salary"`
		ExpiryDate  string   `json:"expiry_date"`
		Status      string   `json:"status"`
		JobCategory string   `json:"job_category"`
		Requirements []string `json:"requirements"` // ✅ Include requirements
	}

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid job ID"})
		return
	}

	// Bind JSON input
	if err := c.ShouldBindJSON(&jobInput); err != nil {
		log.Println("[ERROR] Invalid job input:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	// ✅ Convert expiry_date to time.Time
	expiryTime, err := time.Parse("2006-01-02", jobInput.ExpiryDate)
	if err != nil {
		log.Println("[ERROR] Invalid expiry_date format:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid expiry_date format. Use YYYY-MM-DD."})
		return
	}

	// ✅ Prepare Job Struct
	job := schema.JobListing{
		ID:          id,
		JobTitle:    jobInput.JobTitle,
		Description: jobInput.Description,
		Location:    jobInput.Location,
		JobType:     jobInput.JobType,
		MinSalary:   jobInput.MinSalary,
		MaxSalary:   jobInput.MaxSalary,
		ExpiryDate:  expiryTime,
		Status:      jobInput.Status,
		JobCategory: jobInput.JobCategory,
	}

	// ✅ Call DB function to update job with requirements
	if err := db.UpdateJob(job, jobInput.Requirements); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update job"})
		return
	}

	log.Printf("[SUCCESS] Job Updated: ID=%d with Requirements=%v\n", job.ID, jobInput.Requirements)
	c.JSON(http.StatusOK, gin.H{"message": "Job updated successfully"})
}


// DeleteJob removes a job listing
func DeleteJob(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid job ID"})
		return
	}

	if err := db.DeleteJob(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete job"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Job deleted successfully"})
}

// FilterJobs handles filtering job listings based on query parameters
func FilterJobs(c *gin.Context) {
	location := strings.TrimSpace(c.Query("location"))
	jobType := strings.TrimSpace(c.Query("job_type"))
	minSalaryStr := c.Query("min_salary")
	maxSalaryStr := c.Query("max_salary")

	// Convert minSalary and maxSalary to float64
	var minSalary, maxSalary float64
	var err error

	if minSalaryStr != "" {
		minSalary, err = strconv.ParseFloat(minSalaryStr, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid min_salary format"})
			return
		}
	}

	if maxSalaryStr != "" {
		maxSalary, err = strconv.ParseFloat(maxSalaryStr, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid max_salary format"})
			return
		}
	}

	jobs, err := db.FilterJobs(location, jobType, minSalary, maxSalary)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to filter jobs", "details": err.Error()})
		return
	}

	if len(jobs) == 0 {
		c.JSON(http.StatusOK, []interface{}{})
		return
	}

	c.JSON(http.StatusOK, jobs)
}

// ApplyJobController handles job applications
func ApplyJobController(c *gin.Context) {
	var application schema.Application

	// Bind JSON request
	if err := c.ShouldBindJSON(&application); err != nil {
		log.Println("[ERROR] Failed to bind JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	// ✅ Log received application data
	log.Printf("[INFO] Received job application: JobSeekerID=%d, JobListingID=%d\n", application.JobSeekerID, application.JobListingID)

	// Validate job_seeker_id & job_listing_id
	if application.JobSeekerID <= 0 || application.JobListingID <= 0 {
		log.Println("[ERROR] Invalid job_seeker_id or job_listing_id")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid job_seeker_id or job_listing_id"})
		return
	}

	// ✅ Call DB function to apply for job
	applicationID, err := db.ApplyJob(application.JobSeekerID, application.JobListingID, application.CoverLetter)
	if err != nil {
		if err.Error() == "you have already applied for this job" {
			log.Printf("[WARN] JobSeekerID=%d has already applied for JobListingID=%d\n", application.JobSeekerID, application.JobListingID)
			c.JSON(http.StatusConflict, gin.H{"error": "You have already applied for this job"})
			return
		}
		log.Printf("[ERROR] Failed to apply for job: JobSeekerID=%d, JobListingID=%d, Error=%v\n", application.JobSeekerID, application.JobListingID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to apply for job"})
		return
	}

	// ✅ Log successful application
	log.Printf("[SUCCESS] JobSeekerID=%d successfully applied for JobListingID=%d (ApplicationID=%d)\n", application.JobSeekerID, application.JobListingID, applicationID)

	c.JSON(http.StatusCreated, gin.H{"application_id": applicationID, "message": "Application submitted successfully"})
}
