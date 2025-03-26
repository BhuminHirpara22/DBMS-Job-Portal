package db

import (
	"Backend/config"
	"Backend/internal/schema"
	"context"
	"errors"
	"time"
)

func GenerateApplicationID(ctx context.Context) (int, error) {
	var newID int
	query := `SELECT generate_application_id()` // Replace with actual stored procedure name
	err := config.DB.QueryRow(ctx, query).Scan(&newID)
	if err != nil {
		return 0, err
	}
	return newID, nil
}

func CreateApplication(ctx context.Context, application schema.Application) (schema.Application, error) {
	query := `
        INSERT INTO applications (job_seeker_id, job_listing_id, application_status, applied_date, cover_letter) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id, job_seeker_id, job_listing_id, application_status, applied_date, cover_letter
    `
	var result schema.Application
	err := config.DB.QueryRow(ctx, query, 
		application.JobSeekerID, 
		application.JobListingID, 
		application.ApplicationStatus, 
		application.AppliedDate, 
		application.CoverLetter,
	).Scan(
		&result.ID, 
		&result.JobSeekerID, 
		&result.JobListingID, 
		&result.ApplicationStatus, 
		&result.AppliedDate, 
		&result.CoverLetter,
	)

	if err != nil {
		return schema.Application{}, err
	}
	return result, nil
}


func GetSeekerApplications(ctx context.Context, jobSeekerID int) ([]schema.ApplicationandJob, error) {
	query := `
		SELECT a.id, a.job_seeker_id, a.job_listing_id, a.application_status, a.applied_date, 
		       a.cover_letter, j.job_title, j.location, j.min_salary, j.max_salary, c.company_name
		FROM applications a
		JOIN job_listings j ON a.job_listing_id = j.id
		JOIN employers e ON j.employer_id = e.id
		JOIN company c ON e.companyid = c.id
		WHERE a.job_seeker_id=$1 AND a.application_status = 'Applied'
	`

	rows, err := config.DB.Query(ctx, query, jobSeekerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var applications []schema.ApplicationandJob
	for rows.Next() {
		var application schema.ApplicationandJob
		err := rows.Scan(&application.ID, &application.JobSeekerID, &application.JobListingID, &application.ApplicationStatus, &application.AppliedDate, &application.CoverLetter, &application.JobTitle, &application.Location, &application.MinSalary, &application.MaxSalary, &application.Company)
		if err != nil {
			return nil, err
		}
		applications = append(applications, application)
	}

	// Check if no records were found
	if len(applications) == 0 {
		return nil, errors.New("no applications found")
	}

	return applications, nil
}

func GetJobApplications(ctx context.Context, jobListingID int) ([]schema.ApplicationDetails, error) {
	var applications []schema.ApplicationDetails

	// Fetch basic application and job seeker details
	query := `
	SELECT 
	    a.id AS application_id, 
	    js.id AS job_seeker_id,
	    js.first_name, 
	    js.last_name, 
	    js.email, 
	    js.phone_number, 
	    js.resume,
	    a.applied_date,
	    a.cover_letter
	FROM applications a
	JOIN job_seekers js ON a.job_seeker_id = js.id
	WHERE a.job_listing_id = $1`

	rows, err := config.DB.Query(ctx, query, jobListingID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Map to track job seeker IDs to avoid redundant queries
	jobSeekerMap := make(map[int]*schema.ApplicationDetails)

	for rows.Next() {
		var app schema.ApplicationDetails
		var jobSeekerID int

		err := rows.Scan(
			&app.ApplicationID, &jobSeekerID, &app.FirstName, &app.LastName, &app.Email,
			&app.PhoneNumber, &app.Resume, &app.AppliedDate, &app.CoverLetter,
		)
		if err != nil {
			return nil, err
		}

		// Add the application to the map
		jobSeekerMap[jobSeekerID] = &app
		applications = append(applications, app)
	}

	// Iterate over the applications and fetch education, experience, and skills
	for i := range applications {
		jobSeekerID := applications[i].ApplicationID

		// Fetch education details
		educationQuery := `
		SELECT 
		    education_level, 
		    institution_name, 
		    field_of_study, 
		    start_year, 
		    end_year, 
		    grade
		FROM education 
		WHERE job_seeker_id = $1`

		eduRows, err := config.DB.Query(ctx, educationQuery, jobSeekerID)
		if err != nil {
			return nil, err
		}
		defer eduRows.Close()

		for eduRows.Next() {
			var edu schema.EducationDetails
			if err := eduRows.Scan(&edu.Level, &edu.Institution, &edu.FieldOfStudy, &edu.StartYear, &edu.EndYear, &edu.Grade); err != nil {
				return nil, err
			}
			applications[i].Education = append(applications[i].Education, edu)
		}

		// Fetch experience details
		experienceQuery := `
		SELECT 
		    job_title, 
		    company_name, 
		    location, 
		    start_date, 
		    end_date
		FROM experience 
		WHERE job_seeker_id = $1`

		expRows, err := config.DB.Query(ctx, experienceQuery, jobSeekerID)
		if err != nil {
			return nil, err
		}
		defer expRows.Close()

		for expRows.Next() {
			var exp schema.ExperienceDetails
			var endDate *time.Time

			if err := expRows.Scan(&exp.JobTitle, &exp.Company, &exp.Location, &exp.StartDate, &endDate); err != nil {
				return nil, err
			}

			exp.EndDate = endDate
			applications[i].Experience = append(applications[i].Experience, exp)
		}

		// Fetch skills
		skillsQuery := `
		SELECT skill_name 
		FROM job_seeker_skills 
		WHERE job_seeker_id = $1`

		skillRows, err := config.DB.Query(ctx, skillsQuery, jobSeekerID)
		if err != nil {
			return nil, err
		}
		defer skillRows.Close()

		for skillRows.Next() {
			var skill string
			if err := skillRows.Scan(&skill); err != nil {
				return nil, err
			}
			applications[i].Skills = append(applications[i].Skills, skill)
		}
	}

	return applications, nil
}



func GetApplication(ctx context.Context, applicationID int) (schema.Application, error) {
	var app schema.Application

	query := `SELECT id, job_seeker_id, job_listing_id, application_status, applied_date, cover_letter 
			  FROM applications WHERE id = $1`

	err := config.DB.QueryRow(ctx, query, applicationID).Scan(
		&app.ID,
		&app.JobSeekerID,
		&app.JobListingID,
		&app.ApplicationStatus,
		&app.AppliedDate,
		&app.CoverLetter,
	)

	if err != nil {
		return schema.Application{}, err
	}

	return app, nil
}

func UpdateApplicationStatus(ctx context.Context, applicationID int, status string) (schema.Application, error) {
	// Update the application status
	query := `UPDATE applications SET application_status = $1 WHERE id = $2 RETURNING *`
	var updatedApplication schema.Application
	err := config.DB.QueryRow(ctx, query, status, applicationID).Scan(
		&updatedApplication.ID,
		&updatedApplication.JobSeekerID,
		&updatedApplication.JobListingID,
		&updatedApplication.ApplicationStatus,
		&updatedApplication.AppliedDate,
		&updatedApplication.CoverLetter,
	)
	if err != nil {
		return schema.Application{}, err
	}
	return updatedApplication, nil
}

func GetResults(ctx context.Context, jobSeekerID int) ([]schema.ApplicationandJob, error) {
	query := `
		SELECT a.id, a.job_seeker_id, a.job_listing_id, a.application_status, a.applied_date, 
		       a.cover_letter, j.job_title, j.location, j.min_salary, j.max_salary, c.company_name
		FROM applications a
		JOIN job_listings j ON a.job_listing_id = j.id
		JOIN employers e ON j.employer_id = e.id
		JOIN company c ON e.companyid = c.id
		WHERE a.job_seeker_id=$1 AND a.application_status = 'Applied'
	`

	rows, err := config.DB.Query(ctx, query, jobSeekerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var applications []schema.ApplicationandJob
	for rows.Next() {
		var application schema.ApplicationandJob
		err := rows.Scan(&application.ID, &application.JobSeekerID, &application.JobListingID, &application.ApplicationStatus, &application.AppliedDate, &application.CoverLetter, &application.JobTitle, &application.Location, &application.MinSalary, &application.MaxSalary, &application.Company)
		if err != nil {
			return nil, err
		}
		applications = append(applications, application)
	}

	// Check if no records were found
	if len(applications) == 0 {
		return nil, errors.New("no applications found")
	}

	return applications, nil
}

// GetSeekerApplicationCount retrieves the count of applications for a given seeker
func GetSeekerApplicationCount(ctx context.Context, seekerID int) (int, error) {
	query := `SELECT application_count FROM job_seekers WHERE id=$1`
	var count int
	err := config.DB.QueryRow(ctx, query, seekerID).Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}

// GetSeekerApplicationCount retrieves the count of applications for a given seeker
func GetResultCount(ctx context.Context, seekerID int) (int, error) {
	query := `SELECT result_count FROM job_seekers WHERE id=$1`
	var count int
	err := config.DB.QueryRow(ctx, query, seekerID).Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}
