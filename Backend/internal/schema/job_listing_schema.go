package schema

import "time"

type JobListing struct {
	ID             int       `json:"id"`
	EmployerID     int       `json:"employer_id"`
	JobTitle       string    `json:"job_title"`
	Description    string    `json:"description"`
	Location       string    `json:"location"`
	JobType        string    `json:"job_type"`
	MinSalary      float64   `json:"min_salary"`
	MaxSalary      float64   `json:"max_salary"`
	PostedDate     time.Time `json:"posted_date"`
	ExpiryDate     time.Time    `json:"expiry_date"`  // Change from `time.Time` to `string`
	ApplicantCount int       `json:"applicant_count"`
	Status         string    `json:"status"`
	JobCategory    string    `json:"job_category"`
}

type Application struct {
	ID           int       `json:"id"`
	JobSeekerID  int       `json:"job_seeker_id"`
	JobListingID int       `json:"job_listing_id"`
	ApplicationStatus string `json:"application_status"`
	AppliedDate  time.Time `json:"applied_date"`
	CoverLetter  string    `json:"cover_letter"`
}
