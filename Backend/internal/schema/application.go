package schema

import "time"

type Application struct {
	ID               int    `json:"id"`
	JobSeekerID      int    `json:"job_seeker_id"`
	JobListingID     int    `json:"job_listing_id"`
	ApplicationStatus string `json:"application_status"`
	AppliedDate      time.Time `json:"applied_date"`
	CoverLetter      string `json:"cover_letter"`
}

type ApplicationandJob struct {
	ID               int    `json:"id"`
	JobSeekerID      int    `json:"job_seeker_id"`
	JobListingID     int    `json:"job_listing_id"`
	ApplicationStatus string `json:"application_status"`
	AppliedDate      time.Time `json:"applied_date"`
	CoverLetter      string `json:"cover_letter"`
	JobTitle    	 string   `json:"job_title"`
	Location    	 string   `json:"location"`
	MinSalary   	 float64  `json:"min_salary"`
	MaxSalary   	 float64  `json:"max_salary"`
	Company          string   `json:"company"`
}