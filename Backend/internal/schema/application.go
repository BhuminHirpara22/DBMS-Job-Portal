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

type ApplicationDetails struct {
	ApplicationID    int       `json:"application_id"`
	FirstName        string    `json:"first_name"`
	LastName         string    `json:"last_name"`
	Email            string    `json:"email"`
	PhoneNumber      string    `json:"phone_number"`
	Resume           *string    `json:"resume"`
	AppliedDate      time.Time `json:"applied_date"`
	CoverLetter      *string    `json:"cover_letter"`
	Education        []EducationDetails `json:"education"`
	Experience       []ExperienceDetails `json:"experience"`
	Skills           []string  `json:"skills"`
}

type EducationDetails struct {
	Level        string `json:"level"`
	Institution  string `json:"institution"`
	FieldOfStudy string `json:"field_of_study"`
	StartYear    int    `json:"start_year"`
	EndYear      int    `json:"end_year"`
	Grade        float64 `json:"grade"`
}

type ExperienceDetails struct {
	JobTitle    string    `json:"job_title"`
	Company     string    `json:"company"`
	Location    string    `json:"location"`
	StartDate   time.Time `json:"start_date"`
	EndDate     *time.Time `json:"end_date"`  // Use pointer to handle NULL values
}
