package db

import (
	"context"
	"log"
	"strconv"
	"strings"
	"time"
	"fmt"
	"Backend/config"
	"Backend/internal/schema"
)

// CreateJob inserts a new job listing and its requirements into the database
func CreateJob(job schema.JobListing, requirements []string) (int, error) {
	db := config.GetDB()

	// ✅ Insert Job Listing
	jobQuery := `
		INSERT INTO job_listings (employer_id, job_title, description, location, job_type, min_salary, max_salary, expiry_date, job_category)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id
	`
	var jobID int
	err := db.QueryRow(context.Background(), jobQuery, 
		job.EmployerID, job.JobTitle, job.Description, job.Location, 
		job.JobType, job.MinSalary, job.MaxSalary, job.ExpiryDate, job.JobCategory,
	).Scan(&jobID)
	if err != nil {
		log.Println("[ERROR] Failed to insert job:", err)
		return 0, err
	}

	// ✅ Insert Job Requirements
	requirementQuery := `
		INSERT INTO requirement (job_listing_id, name)
		VALUES ($1, $2)
	`
	for _, req := range requirements {
		_, err := db.Exec(context.Background(), requirementQuery, jobID, req)
		if err != nil {
			log.Printf("[ERROR] Failed to insert requirement (%s) for JobID=%d: %v\n", req, jobID, err)
			return jobID, err // Job created but some requirements failed
		}
	}

	log.Printf("[SUCCESS] Job Created with ID=%d and Requirements=%v\n", jobID, requirements)
	return jobID, nil
}

// FetchAllJobs retrieves all job listings with pagination
func FetchAllJobs(limit, offset int) ([]schema.JobListing, error) {
	db := config.GetDB()
	query := "SELECT * FROM job_listings ORDER BY posted_date DESC LIMIT $1 OFFSET $2"
	rows, err := db.Query(context.Background(), query, limit, offset)
	if err != nil {
		log.Println("Error fetching jobs:", err)
		return nil, err
	}
	defer rows.Close()

	var jobs []schema.JobListing
	for rows.Next() {
		var job schema.JobListing

		err := rows.Scan(
			&job.ID, &job.EmployerID, &job.JobTitle, &job.Description, &job.Location,
			&job.JobType, &job.MinSalary, &job.MaxSalary, &job.PostedDate, &job.ExpiryDate,
			&job.ApplicantCount, &job.Status, &job.JobCategory,
		)
		if err != nil {
			log.Println("Error scanning job:", err)
			continue
		}
		jobs = append(jobs, job)
	}

	return jobs, nil
}

// FetchJob retrieves a specific job by ID
func FetchJob(jobID int) (*schema.JobListing, error) {
	db := config.GetDB()
	query := "SELECT * FROM job_listings WHERE id = $1"
	row := db.QueryRow(context.Background(), query, jobID)

	var job schema.JobListing
	err := row.Scan(&job.ID, &job.EmployerID, &job.JobTitle, &job.Description, &job.Location, &job.JobType, &job.MinSalary, &job.MaxSalary, &job.PostedDate, &job.ExpiryDate, &job.ApplicantCount, &job.Status, &job.JobCategory)
	if err != nil {
		log.Println("Error fetching job:", err)
		return nil, err
	}
	return &job, nil
}

// FetchJobsByEmployer retrieves all jobs posted by a specific employer
func FetchJobsByEmployer(employerID int) ([]schema.JobListing, error) {
	db := config.GetDB()
	query := "SELECT * FROM job_listings WHERE employer_id = $1 ORDER BY posted_date DESC"

	rows, err := db.Query(context.Background(), query, employerID)
	if err != nil {
		log.Println("Error fetching jobs for employer:", err)
		return nil, err
	}
	defer rows.Close()

	var jobs []schema.JobListing
	for rows.Next() {
		var job schema.JobListing
	
		err := rows.Scan(
			&job.ID, &job.EmployerID, &job.JobTitle, &job.Description, &job.Location,
			&job.JobType, &job.MinSalary, &job.MaxSalary, &job.PostedDate, &job.ExpiryDate,
			&job.ApplicantCount, &job.Status, &job.JobCategory,
		)
		if err != nil {
			log.Println("Error scanning job:", err)
			continue
		}
	
		jobs = append(jobs, job)
	}

	return jobs, nil
}

// UpdateJob modifies an existing job listing and updates its requirements
func UpdateJob(job schema.JobListing, requirements []string) error {
	db := config.GetDB()

	// Step 1: Update the Job Listing
	query := `
		UPDATE job_listings 
		SET job_title = $1, description = $2, location = $3, job_type = $4, 
		    min_salary = $5, max_salary = $6, expiry_date = $7, status = $8, job_category = $9
		WHERE id = $10
	`
	_, err := db.Exec(context.Background(), query, 
		job.JobTitle, job.Description, job.Location, job.JobType, 
		job.MinSalary, job.MaxSalary, job.ExpiryDate, job.Status, job.JobCategory, job.ID,
	)
	if err != nil {
		log.Println("[ERROR] Failed to update job:", err)
		return err
	}

	// Step 2: Remove Existing Requirements
	deleteReqQuery := "DELETE FROM requirement WHERE job_listing_id = $1"
	_, err = db.Exec(context.Background(), deleteReqQuery, job.ID)
	if err != nil {
		log.Println("[ERROR] Failed to delete old requirements for JobID:", job.ID, err)
		return err
	}

	// Step 3: Insert New Requirements (if provided)
	if len(requirements) > 0 {
		reqQuery := "INSERT INTO requirement (job_listing_id, name) VALUES ($1, $2)"
		for _, req := range requirements {
			_, err := db.Exec(context.Background(), reqQuery, job.ID, req)
			if err != nil {
				log.Printf("[ERROR] Failed to insert requirement (%s) for JobID=%d: %v\n", req, job.ID, err)
				return err // Job updated, but some requirements may fail
			}
		}
	}

	log.Printf("[SUCCESS] Job Updated: ID=%d with Requirements=%v\n", job.ID, requirements)
	return nil
}


// DeleteJob removes a job listing
func DeleteJob(jobID int) error {
	db := config.GetDB()
	query := "DELETE FROM job_listings WHERE id = $1"
	_, err := db.Exec(context.Background(), query, jobID)
	if err != nil {
		log.Println("Error deleting job:", err)
		return err
	}
	return nil
}

// FilterJobs filters job listings based on provided criteria
func FilterJobs(location, jobType string, minSalary, maxSalary float64) ([]schema.JobListing, error) {
	db := config.GetDB()
	query := "SELECT * FROM job_listings WHERE 1=1"

	var args []interface{}
	argIndex := 1

	if location != "" {
		query += " AND LOWER(location) LIKE LOWER($" + strconv.Itoa(argIndex) + ")"
		args = append(args, "%"+strings.ToLower(strings.TrimSpace(location))+"%")
		argIndex++
	}

	if jobType != "" {
		query += " AND LOWER(job_type) LIKE LOWER($" + strconv.Itoa(argIndex) + ")"
		args = append(args, "%"+strings.ToLower(strings.TrimSpace(jobType))+"%")
		argIndex++
	}

	if minSalary > 0 {
		query += " AND min_salary >= $" + strconv.Itoa(argIndex)
		args = append(args, minSalary)
		argIndex++
	}

	if maxSalary > 0 {
		query += " AND max_salary <= $" + strconv.Itoa(argIndex)
		args = append(args, maxSalary)
		argIndex++
	}

	query += " ORDER BY posted_date DESC"

	// **Debugging: Print SQL query and parameters**
	log.Println("Executing Query:", query)
	log.Println("Query Parameters:", args)

	rows, err := db.Query(context.Background(), query, args...)
	if err != nil {
		log.Println("Error filtering jobs:", err)
		return nil, err
	}
	defer rows.Close()

	var jobs []schema.JobListing
	for rows.Next() {
		var job schema.JobListing
		err := rows.Scan(&job.ID, &job.EmployerID, &job.JobTitle, &job.Description, &job.Location, &job.JobType, &job.MinSalary, &job.MaxSalary, &job.PostedDate, &job.ExpiryDate, &job.ApplicantCount, &job.Status, &job.JobCategory)
		if err != nil {
			log.Println("Error scanning job:", err)
			continue
		}
		jobs = append(jobs, job)
	}
	return jobs, nil
}

// ApplyJob allows a job seeker to apply for a job
func ApplyJob(jobSeekerID, jobListingID int, coverLetter string) (int, error) {
	db := config.GetDB()

	// ✅ Step 1: Check if the job seeker has already applied
	var exists bool
	checkQuery := `
		SELECT EXISTS (
			SELECT 1 FROM applications WHERE job_seeker_id = $1 AND job_listing_id = $2
		)
	`
	err := db.QueryRow(context.Background(), checkQuery, jobSeekerID, jobListingID).Scan(&exists)
	if err != nil {
		log.Println("Error checking existing application:", err)
		return 0, err
	}

	if exists {
		log.Println("Job seeker has already applied for this job")
		return 0, fmt.Errorf("you have already applied for this job")
	}

	// ✅ Step 2: Insert application if it doesn't exist
	insertQuery := `
		INSERT INTO applications (job_seeker_id, job_listing_id, application_status, applied_date, cover_letter)
		VALUES ($1, $2, 'Applied', $3, $4) RETURNING id
	`

	appliedDate := time.Now()
	var applicationID int
	err = db.QueryRow(context.Background(), insertQuery, jobSeekerID, jobListingID, appliedDate, coverLetter).Scan(&applicationID)
	if err != nil {
		log.Println("Error applying for job:", err)
		return 0, err
	}

	// ✅ Step 3: Update applicant count in `job_listings`
	updateQuery := `
		UPDATE job_listings
		SET applicant_count = COALESCE(applicant_count, 0) + 1
		WHERE id = $1
	`
	_, err = db.Exec(context.Background(), updateQuery, jobListingID)
	if err != nil {
		log.Println("Error updating applicant count:", err)
		return 0, err
	}

	return applicationID, nil
}

