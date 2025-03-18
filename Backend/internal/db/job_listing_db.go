package db

import (
	"context"
	"log"
	// "strconv"
	"strings"
	// "time"
	// "fmt"
	"Backend/config"
	"Backend/internal/schema"
)

// CreateJob inserts a new job listing and its requirements into the database
// CreateJob inserts a new job listing using a stored procedure
func CreateJob(job schema.JobListing, requirements []string) (int, error) {
	db := config.GetDB()

	// ✅ Call Stored Procedure for Job Insertion
	var jobID int
	err := db.QueryRow(context.Background(), "SELECT create_job($1, $2, $3, $4, $5, $6, $7, $8, $9)", 
		job.EmployerID, job.JobTitle, job.Description, job.Location, 
		job.JobType, job.MinSalary, job.MaxSalary, job.ExpiryDate, job.JobCategory,
	).Scan(&jobID)

	if err != nil {
		log.Println("[ERROR] Failed to insert job:", err)
		return 0, err
	}

	// ✅ Call Stored Procedure for Each Requirement
	for _, req := range requirements {
		_, err := db.Exec(context.Background(), "SELECT add_requirement($1, $2)", jobID, req)
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
	query := "SELECT * FROM fetch_open_jobs($1, $2)"
	rows, err := db.Query(context.Background(), query, limit, offset)
	if err != nil {
		log.Println("[ERROR] FetchAllJobs - Error fetching jobs:", err)
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
			log.Println("[ERROR] FetchAllJobs - Error scanning job:", err)
			continue
		}
		jobs = append(jobs, job)
	}

	log.Printf("[SUCCESS] FetchAllJobs - %d open jobs retrieved\n", len(jobs))
	return jobs, nil
}

// FetchJob retrieves a specific job by ID
func FetchJob(jobID int) (*schema.JobListing, error) {
	db := config.GetDB()
	query := "SELECT * FROM fetch_open_job($1)"
	row := db.QueryRow(context.Background(), query, jobID)

	var job schema.JobListing
	var requirements []string // ✅ Ensure this matches TEXT[] returned from SQL

	err := row.Scan(&job.ID, &job.EmployerID, &job.JobTitle, &job.Description, &job.Location,
		&job.JobType, &job.MinSalary, &job.MaxSalary, &job.PostedDate, &job.ExpiryDate,
		&job.ApplicantCount, &job.Status, &job.JobCategory, &requirements)
	if err != nil {
		log.Println("[ERROR] FetchJob - Error fetching job:", err)
		return nil, err
	}

	// ✅ Assign requirements to JobListing struct
	job.Requirements = requirements

	log.Printf("[SUCCESS] FetchJob - Job ID %d retrieved\n", jobID)
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
func FilterJobs(location, jobType string, minSalary, maxSalary float64, skills []string) ([]schema.JobListing, error) {
	db := config.GetDB()

	// Convert Go slice to PostgreSQL array format {skill1,skill2,skill3}
	var skillsArray interface{}
	if len(skills) > 0 {
		skillsArray = "{ " + strings.Join(skills, ", ") + " }"
	} else {
		skillsArray = nil
	}

	query := "SELECT * FROM filter_jobs($1, $2, $3, $4, $5)"
	rows, err := db.Query(context.Background(), query, location, jobType, minSalary, maxSalary, skillsArray)
	if err != nil {
		log.Println("[ERROR] FilterJobs - Error filtering jobs:", err)
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
			log.Println("[ERROR] FilterJobs - Error scanning job:", err)
			continue
		}
		jobs = append(jobs, job)
	}

	log.Printf("[SUCCESS] FilterJobs - %d open jobs retrieved\n", len(jobs))
	return jobs, nil
}

// ApplyJob allows a job seeker to apply for a job using a stored procedure
func ApplyJob(jobSeekerID, jobListingID int, coverLetter string) (int, error) {
	db := config.GetDB()

	var applicationID int
	err := db.QueryRow(context.Background(), "SELECT apply_for_job($1, $2, $3)", 
		jobSeekerID, jobListingID, coverLetter,
	).Scan(&applicationID)

	if err != nil {
		log.Println("[ERROR] Failed to apply for job:", err)
		return 0, err
	}

	log.Printf("[SUCCESS] Job Application Submitted: JobSeekerID=%d, JobID=%d\n", jobSeekerID, jobListingID)
	return applicationID, nil
}
