package db

import (
    "database/sql"
    "errors"
    
    "github.com/BhuminHirpara22/DBMS-Job-Portal/models"
    "github.com/BhuminHirpara22/DBMS-Job-Portal/helpers"
)

func RegisterJobSeeker(db *sql.DB, jobSeeker *models.JobSeeker) (int, error) {
    hashedPassword, err := helpers.HashPassword(jobSeeker.Password)
    if err != nil {
        return 0, err
    }
    
    var id int
    
    err = db.QueryRow(
        "INSERT INTO job_seekers (first_name, last_name, email, password, location, profile_picture, phone_number, linkedin_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
        jobSeeker.FirstName, jobSeeker.LastName, jobSeeker.Email, hashedPassword, jobSeeker.Location, jobSeeker.ProfilePicture, jobSeeker.PhoneNumber, jobSeeker.LinkedinURL,
    ).Scan(&id)
    
    return id, err
}

func RegisterEmployer(db *sql.DB, employer *models.Employer) (int, error) {
    hashedPassword, err := helpers.HashPassword(employer.Password)
    if err != nil {
        return 0, err
    }
    
    var id int
    
    err = db.QueryRow(
        "INSERT INTO employers (companyid, email, password, description, contact_person, contact_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
        employer.CompanyID, employer.Email, hashedPassword, employer.Description, employer.ContactPerson, employer.ContactNumber,
    ).Scan(&id)
    
    return id, err
}

func GetJobSeekerByEmail(db *sql.DB, email string) (*models.JobSeeker, error) {
    jobSeeker := &models.JobSeeker{}
    
    err := db.QueryRow(
        "SELECT id, first_name, last_name, email, password, location, profile_picture, phone_number, linkedin_url FROM job_seekers WHERE email = $1",
        email,
    ).Scan(&jobSeeker.ID, &jobSeeker.FirstName, &jobSeeker.LastName, &jobSeeker.Email, &jobSeeker.Password, &jobSeeker.Location, &jobSeeker.ProfilePicture, &jobSeeker.PhoneNumber, &jobSeeker.LinkedinURL)
    
    if err != nil {
        return nil, err
    }
    
    return jobSeeker, nil
}

func GetEmployerByEmail(db *sql.DB, email string) (*models.Employer, error) {
    employer := &models.Employer{}
    
    err := db.QueryRow(
        "SELECT id, companyid, email, password, description, contact_person, contact_number FROM employers WHERE email = $1",
        email,
    ).Scan(&employer.ID, &employer.CompanyID, &employer.Email, &employer.Password, &employer.Description, &employer.ContactPerson, &employer.ContactNumber)
    
    if err != nil {
        return nil, err
    }
    
    return employer, nil
}