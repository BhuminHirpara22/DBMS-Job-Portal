package db

import (
	"context"
	"Backend/config"
	"Backend/internal/schema"
	"errors"
)

// RegisterJobSeeker registers a new job seeker
func RegisterJobSeeker(ctx context.Context, jobSeeker schema.JobSeeker) (int, error) {
	query := `
        INSERT INTO job_seekers (
            id, first_name, last_name, email, password, location, profile_picture, phone_number, linkedin_url
        ) VALUES (
            (SELECT COALESCE(MAX(id), 0) + 1 FROM job_seekers),
            $1, $2, $3, $4, $5, $6, $7, $8
        )
        RETURNING id
    `
	var id int
	err := config.DB.QueryRow(ctx, query, 
		jobSeeker.FirstName, 
		jobSeeker.LastName, 
		jobSeeker.Email, 
		jobSeeker.Password, 
		jobSeeker.Location, 
		jobSeeker.ProfilePicture, 
		jobSeeker.PhoneNumber, 
		jobSeeker.LinkedinURL,
	).Scan(&id)
	
	if err != nil {
		return 0, err
	}
	return id, nil
}

// RegisterEmployer registers a new employer
func RegisterEmployer(ctx context.Context, employer schema.Employer) (int, error) {
	query := `
        INSERT INTO employers (
            id, companyid, email, password, description, contact_person, contact_number
        ) VALUES (
            (SELECT COALESCE(MAX(id), 0) + 1 FROM employers),
            $1, $2, $3, $4, $5, $6
        )
        RETURNING id
    `
	var id int
	err := config.DB.QueryRow(ctx, query, 
		employer.CompanyID, 
		employer.Email, 
		employer.Password, 
		employer.Description, 
		employer.ContactPerson, 
		employer.ContactNumber,
	).Scan(&id)
	
	if err != nil {
		return 0, err
	}
	return id, nil
}

// GetJobSeekerByEmail gets a job seeker by email
func GetJobSeekerByEmail(ctx context.Context, email string) (schema.JobSeeker, error) {
	query := `
		SELECT id, first_name, last_name, email, password, location, profile_picture, phone_number, linkedin_url 
		FROM job_seekers WHERE email = $1
	`
	var jobSeeker schema.JobSeeker
	
	err := config.DB.QueryRow(ctx, query, email).Scan(
		&jobSeeker.ID, 
		&jobSeeker.FirstName, 
		&jobSeeker.LastName, 
		&jobSeeker.Email, 
		&jobSeeker.Password, 
		&jobSeeker.Location, 
		&jobSeeker.ProfilePicture, 
		&jobSeeker.PhoneNumber, 
		&jobSeeker.LinkedinURL,
	)
	
	if err != nil {
		return schema.JobSeeker{}, err
	}
	
	return jobSeeker, nil
}

// GetEmployerByEmail gets an employer by email
func GetEmployerByEmail(ctx context.Context, email string) (schema.Employer, error) {
	query := `
		SELECT id, companyid, email, password, description, contact_person, contact_number 
		FROM employers WHERE email = $1
	`
	var employer schema.Employer
	
	err := config.DB.QueryRow(ctx, query, email).Scan(
		&employer.ID, 
		&employer.CompanyID, 
		&employer.Email, 
		&employer.Password, 
		&employer.Description, 
		&employer.ContactPerson, 
		&employer.ContactNumber,
	)
	
	if err != nil {
		return schema.Employer{}, err
	}
	
	return employer, nil
}

// ValidateJobSeekerCredentials validates job seeker credentials
func ValidateJobSeekerCredentials(ctx context.Context, email, password string) (schema.JobSeeker, error) {
	query := `
		SELECT id, first_name, last_name, email, password, location, profile_picture, phone_number, linkedin_url 
		FROM job_seekers WHERE email = $1
	`
	var jobSeeker schema.JobSeeker
	
	err := config.DB.QueryRow(ctx, query, email).Scan(
		&jobSeeker.ID, 
		&jobSeeker.FirstName, 
		&jobSeeker.LastName, 
		&jobSeeker.Email, 
		&jobSeeker.Password, 
		&jobSeeker.Location, 
		&jobSeeker.ProfilePicture, 
		&jobSeeker.PhoneNumber, 
		&jobSeeker.LinkedinURL,
	)
	
	if err != nil {
		return schema.JobSeeker{}, errors.New("invalid email or password")
	}
	
	// Check password match (You'll need to implement this in helpers)
	// if !helpers.CheckPassword(password, jobSeeker.Password) {
	//     return schema.JobSeeker{}, errors.New("invalid email or password")
	// }
	
	return jobSeeker, nil
}

// ValidateEmployerCredentials validates employer credentials
func ValidateEmployerCredentials(ctx context.Context, email, password string) (schema.Employer, error) {
	query := `
		SELECT id, companyid, email, password, description, contact_person, contact_number 
		FROM employers WHERE email = $1
	`
	var employer schema.Employer
	
	err := config.DB.QueryRow(ctx, query, email).Scan(
		&employer.ID, 
		&employer.CompanyID, 
		&employer.Email, 
		&employer.Password, 
		&employer.Description, 
		&employer.ContactPerson, 
		&employer.ContactNumber,
	)
	
	if err != nil {
		return schema.Employer{}, errors.New("invalid email or password")
	}
	
	// Check password match (You'll need to implement this in helpers)
	// if !helpers.CheckPassword(password, employer.Password) {
	//     return schema.Employer{}, errors.New("invalid email or password")
	// }
	
	return employer, nil
}

// UpdateJobSeeker updates an existing job seeker record.
func UpdateJobSeeker(ctx context.Context, jobSeeker schema.JobSeeker) error {
	query := `
		UPDATE job_seekers 
		SET first_name = $1,
			last_name = $2,
			email = $3,
			password = $4,
			location = $5,
			profile_picture = $6,
			phone_number = $7,
			linkedin_url = $8
		WHERE id = $9
	`
	_, err := config.DB.Exec(ctx, query,
		jobSeeker.FirstName,
		jobSeeker.LastName,
		jobSeeker.Email,
		jobSeeker.Password,
		jobSeeker.Location,
		jobSeeker.ProfilePicture,
		jobSeeker.PhoneNumber,
		jobSeeker.LinkedinURL,
		jobSeeker.ID,
	)
	return err
}

// UpdateEmployer updates an existing employer record.
func UpdateEmployer(ctx context.Context, employer schema.Employer) error {
	query := `
		UPDATE employers 
		SET companyid = $1,
			email = $2,
			password = $3,
			description = $4,
			contact_person = $5,
			contact_number = $6
		WHERE id = $7
	`
	_, err := config.DB.Exec(ctx, query,
		employer.CompanyID,
		employer.Email,
		employer.Password,
		employer.Description,
		employer.ContactPerson,
		employer.ContactNumber,
		employer.ID,
	)
	return err
}
