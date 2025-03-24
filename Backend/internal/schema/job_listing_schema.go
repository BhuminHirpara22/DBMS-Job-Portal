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
	ExpiryDate     time.Time `json:"expiry_date"`
	ApplicantCount int       `json:"applicant_count"`
	Status         string    `json:"status"`
	JobCategory    string    `json:"job_category"`
	Requirements   []string  //  Include job requirements
}

// Exported JobInput struct (Fixes the error)
type JobInput struct {
	EmployerID   int      `json:"employer_id"`
	JobTitle     string   `json:"job_title"`
	Description  string   `json:"description"`
	Location     string   `json:"location"`
	JobType      string   `json:"job_type"`
	MinSalary    float64  `json:"min_salary"`
	MaxSalary    float64  `json:"max_salary"`
	ExpiryDate   string   `json:"expiry_date"`
	JobCategory  string   `json:"job_category"`
	Requirements []string `json:"requirements"` //  Include job requirements
	Status       string   `json:"status"`
}
