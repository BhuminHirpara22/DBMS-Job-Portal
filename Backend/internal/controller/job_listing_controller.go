package controller

import (
	"Backend/internal/db"
	"Backend/internal/schema"
	"Backend/internal/helpers"

	// "fmt"
	"context"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"
	"fmt"

	"github.com/gin-gonic/gin"
)

// CreateJobController handles job creation with requirements
func CreateJob(c *gin.Context) {
	var jobInput schema.JobInput

	//  Bind JSON input
	if err := c.ShouldBindJSON(&jobInput); err != nil {
		log.Println("[ERROR] CreateJob - Invalid JSON input:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	//  Validate employer ID
	if jobInput.EmployerID <= 0 {
		log.Println("[ERROR] CreateJob - Invalid employer ID:", jobInput.EmployerID)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid employer ID"})
		return
	}

	//  Convert expiry_date to time.Time
	expiryTime, err := time.Parse("2006-01-02", jobInput.ExpiryDate)
	if err != nil {
		log.Println("[ERROR] CreateJob - Invalid expiry_date format:", jobInput.ExpiryDate)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid expiry_date format. Use YYYY-MM-DD."})
		return
	}

	//  Prepare Job Struct
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

	//  Call DB function to create job with requirements
	jobID, err := db.CreateJob(job, jobInput.Requirements)
	if err != nil {
		log.Println("[ERROR] CreateJob - Failed to insert job:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create job"})
		return
	}

	log.Printf("[SUCCESS] CreateJob - Job ID=%d Created with Requirements=%v\n", jobID, jobInput.Requirements)
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
func FetchJobsByEmployer(c *gin.Context) {
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
	var jobInput schema.JobInput

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

	//  Convert expiry_date to time.Time
	expiryTime, err := time.Parse("2006-01-02", jobInput.ExpiryDate)
	if err != nil {
		log.Println("[ERROR] Invalid expiry_date format:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid expiry_date format. Use YYYY-MM-DD."})
		return
	}

	//  Prepare Job Struct
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

	//  Call DB function to update job with requirements
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
	skills := c.QueryArray("skills") //  Get multiple skills as an array
	minSalaryStr := c.Query("min_salary")
	maxSalaryStr := c.Query("max_salary")

	// Convert minSalary and maxSalary to float64
	var minSalary, maxSalary float64
	var err error

	if minSalaryStr != "" {
		minSalary, err = strconv.ParseFloat(minSalaryStr, 64)
		if err != nil {
			log.Println("[ERROR] FilterJobs - Invalid min_salary:", minSalaryStr)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid min_salary format"})
			return
		}
	}

	if maxSalaryStr != "" {
		maxSalary, err = strconv.ParseFloat(maxSalaryStr, 64)
		if err != nil {
			log.Println("[ERROR] FilterJobs - Invalid max_salary:", maxSalaryStr)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid max_salary format"})
			return
		}
	}

	//  Fetch filtered jobs from database, including skills filtering
	jobs, err := db.FilterJobs(location, jobType, minSalary, maxSalary, skills)
	if err != nil {
		log.Println("[ERROR] FilterJobs - Failed to filter jobs:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to filter jobs", "details": err.Error()})
		return
	}

	//  If no jobs found, return empty array instead of null
	if len(jobs) == 0 {
		c.JSON(http.StatusOK, []interface{}{})
		return
	}

	c.JSON(http.StatusOK, jobs)
}

// ApplyJobController handles job applications
func ApplyJob(c *gin.Context) {
	var application schema.Application

	// Bind JSON request
	if err := c.ShouldBindJSON(&application); err != nil {
		log.Println("[ERROR] Failed to bind JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid input",
			"error":   err.Error(),
		})
		return
	}

	// Validate job_seeker_id & job_listing_id
	if application.JobSeekerID <= 0 || application.JobListingID <= 0 {
		log.Println("[ERROR] Invalid job_seeker_id or job_listing_id")
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid job seeker ID or job listing ID",
		})
		return
	}

	//  Call DB function to apply for job
	applicationID, err := db.ApplyJob(application.JobSeekerID, application.JobListingID, application.CoverLetter)
	if err != nil {
		if err.Error() == "you have already applied for this job" {
			log.Printf("[WARN] JobSeekerID=%d has already applied for JobListingID=%d\n", application.JobSeekerID, application.JobListingID)
			c.JSON(http.StatusConflict, gin.H{
				"success": false,
				"message": "You have already applied for this job",
				"error":   "Duplicate application",
			})
			return
		}
		log.Printf("[ERROR] Failed to apply for job: JobSeekerID=%d, JobListingID=%d, Error=%v\n", application.JobSeekerID, application.JobListingID, err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to apply for job",
			"error":   err.Error(),
		})
		return
	}

	// Create a notification for the job seeker
	message := fmt.Sprintf("Your application %d has been created successfully.", applicationID)
	notificationID, err := db.GenerateNotificationID(context.Background())
	notification := schema.Notification{
		ID:       notificationID,
		UserID:   application.JobSeekerID,
		UserType: "job_seeker",
		Message:  message,
		IsRead:   false,
	}

	err = db.StoreNotification(context.Background(), notification)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store notification"})
		return
	}

	// Send mail notification in a goroutine
	go func() {
		jobseeker, err := db.GetJobSeeker(c, application.JobSeekerID)
		if err != nil {
			fmt.Println("Failed to fetch job seeker:", err)
			return
		}

		err = helpers.SendMail(jobseeker.Email, message)
		if err != nil {
			fmt.Println("Failed to send email:", err)
		}
	}()


	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Application submitted successfully",
		"data": gin.H{
			"application_id": applicationID,
		},
	})
}

// GetAllJobsThatSeekerApplied retrieves all jobs that a specific job seeker has applied for
func GetAllJobsThatSeekerApplied(c *gin.Context) {
	jobSeekerID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid job seeker ID"})
		return
	}

	jobs, err := db.GetAllJobsThatSeekerApplied(jobSeekerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get jobs"})
		return
	}

	c.JSON(http.StatusOK, jobs)
}
