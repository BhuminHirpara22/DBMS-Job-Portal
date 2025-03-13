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