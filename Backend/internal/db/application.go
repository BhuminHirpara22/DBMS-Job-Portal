package db

import (
	"context"
	"Backend/config"
	"Backend/internal/schema"
	"errors"
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


func GetApplications(ctx context.Context, applicationID int) ([]schema.Application, error) {
	query := `SELECT * FROM applications WHERE id=$1`
	rows, err := config.DB.Query(ctx, query, applicationID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var applications []schema.Application
	for rows.Next() {
		var application schema.Application
		err := rows.Scan(&application.ID, &application.JobSeekerID, &application.JobListingID, &application.ApplicationStatus, &application.AppliedDate, &application.CoverLetter)
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

