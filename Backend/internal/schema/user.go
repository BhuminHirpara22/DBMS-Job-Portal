package schema

import "time"

type JobSeeker struct {
	ID             int          `json:"id"`
	FirstName      string       `json:"first_name" binding:"required"`
	LastName       string       `json:"last_name" binding:"required"`
	Email          string       `json:"email" binding:"required,email"`
	Password       string       `json:"password" binding:"required,min=6"`
	Resume         string       `json:"resume,omitempty"`
	ProfilePicture *string      `json:"profile_picture,omitempty"`
	PhoneNumber    *string      `json:"phone_number,omitempty"`
	LinkedinURL    *string      `json:"linkedin_url,omitempty"`
	Location       *string      `json:"location,omitempty"`
	Education      []Education  `json:"education,omitempty"`
	Experience     []Experience `json:"experience,omitempty"`
	Skills         []Skill      `json:"skills,omitempty"`
}

type JobSeekerInput struct {
	FirstName      string       `json:"first_name" binding:"required"`
	LastName       string       `json:"last_name" binding:"required"`
	Email          string       `json:"email" binding:"required,email"`
	Resume         string       `json:"resume,omitempty"`
	ProfilePicture *string      `json:"profile_picture,omitempty"`
	PhoneNumber    *string      `json:"phone_number,omitempty"`
	LinkedinURL    *string      `json:"linkedin_url,omitempty"`
	Location       *string      `json:"location,omitempty"`
	Education      []Education  `json:"education,omitempty"`
	Experience     []Experience `json:"experience,omitempty"`
	Skills         []Skill      `json:"skills,omitempty"`
}

type Education struct {
	Level        string `json:"education_level" binding:"required"`
	Institution  string `json:"institution_name" binding:"required"`
	FieldOfStudy string `json:"field_of_study" binding:"required"`
	StartYear    string `json:"start_year" binding:"required"`
	EndYear      string `json:"end_year" binding:"required"`
	Grade        string `json:"grade,omitempty"`
}

type Experience struct {
	JobTitle    string `json:"job_title" binding:"required"`
	CompanyName string `json:"company_name" binding:"required"`
	Location    string `json:"location,omitempty"`
	StartDate   time.Time `json:"start_date" binding:"required"`
	EndDate     *time.Time `json:"end_date,omitempty"`
}

type Skill struct {
	ID               int    `json:"id"`
	SkillName        string `json:"name" binding:"required"`
	SkillProficiency string `json:"level" binding:"required"`
}

// Employer represents an employer in the system
type Employer struct {
	ID            int     `json:"id" db:"id"`
	CompanyID     int     `json:"company_id" db:"companyid" binding:"required"`
	Email         string  `json:"email" db:"email" binding:"required,email"`
	Password      string  `json:"password" db:"password" binding:"required,min=6"`
	Description   *string `json:"description,omitempty" db:"description"`
	ContactPerson *string `json:"contact_person,omitempty" db:"contact_person"`
	ContactNumber *string `json:"contact_number,omitempty" db:"contact_number"`
	// Company information
	CompanyName string  `json:"company_name" db:"company_name"`
	Industry    *string `json:"industry,omitempty" db:"industry"`
	Website     *string `json:"website,omitempty" db:"website"`
	Location    *string `json:"location,omitempty" db:"location"`
}

// InputEmployer represents the input data for employer registration
type InputEmployer struct {
	CompanyID       string `json:"company_id" binding:"required"`
	ContactPerson   string `json:"contact_person" binding:"required"`
	Email           string `json:"email" binding:"required,email"`
	ContactNumber   string `json:"contact_number" binding:"required"`
	Password        string `json:"password" binding:"required,min=6"`
	ConfirmPassword string `json:"confirmPassword" binding:"required,eqfield=Password"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	UserID    int    `json:"user_id"`
	FirstName string `json:"first_name,omitempty"`
	Email     string `json:"email"`
}