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


func GetSeekerApplications(ctx context.Context, jobSeekerID int) ([]schema.Application, error) {
	query := `SELECT * FROM applications WHERE job_seeker_id=$1`
	rows, err := config.DB.Query(ctx, query, jobSeekerID)
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

func GetJobApplications(ctx context.Context, jobID int) ([]schema.Application, error) {
	query := `SELECT * FROM applications WHERE job_listing_id=$1`
	rows, err := config.DB.Query(ctx, query, jobID)
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


