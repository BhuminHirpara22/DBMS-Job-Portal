package schema

type JobSeeker struct {
    ID             int       `json:"id"`
    FirstName      string    `json:"first_name" binding:"required"`
    LastName       string    `json:"last_name" binding:"required"`
    Email          string    `json:"email" binding:"required,email"`
    Password       string    `json:"password" binding:"required,min=6"`
    Resume         string    `json:"resume"`
    ProfilePicture *string   `json:"profile_picture,omitempty"`
    PhoneNumber    *string   `json:"phone_number,omitempty"`
    LinkedinURL    *string   `json:"linkedin_url,omitempty"`
    Location       *string   `json:"location,omitempty"`
    Education      []Education `json:"education" binding:"required,dive"`
    Experience     []Experience `json:"experience" binding:"required,dive"`
}

type Education struct {
    Level          string `json:"education_level"`
    Institution    string `json:"institution_name"`
    FieldOfStudy   string `json:"field_of_study"`
    StartYear      string `json:"start_year"`
    EndYear        string `json:"end_year"`
    Grade          string `json:"grade"`
}

type Experience struct {
    JobTitle     string `json:"job_title"`
    CompanyName  string `json:"company_name"`
    Location     string `json:"location"`
    StartDate    string `json:"start_date"`
    EndDate      string `json:"end_date"`
}


type Employer struct {
    ID            int     `json:"id"`
    CompanyID     int     `json:"company_id"`
    Email         string  `json:"email" binding:"required,email"`
    Password      string  `json:"password" binding:"required,min=6"`
    Description  *string  `json:"description"`
    ContactPerson string  `json:"contact_person"`
    ContactNumber string  `json:"contact_number"`
}

type InputEmployer struct {
    ID            int     `json:"id"`
    CompanyName   string  `json:"company_name" binding:"required"`
    Email         string  `json:"email" binding:"required,email"`
    Password      string  `json:"password" binding:"required,min=6"`
    Description   *string `json:"description"`
    ContactPerson string  `json:"contact_person" binding:"required"`
    ContactNumber string  `json:"contact_number" binding:"required"`
}
type LoginRequest struct {
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
    UserID    int     `json:"user_id"`
    FirstName string `json:"first_name,omitempty"`
    Email     string  `json:"email"`
}
