package schema

// import "time"

type JobSeeker struct {
    ID             int       `json:"id"`
    FirstName      string    `json:"first_name" binding:"required"`
    LastName       string    `json:"last_name" binding:"required"`
    Email          string    `json:"email" binding:"required,email"`
    Password       string    `json:"password" binding:"required,min=6"`
    Resume         string    `json:"resume"`
    Location       string    `json:"location"`
    ProfilePicture string    `json:"profile_picture"`
    PhoneNumber    string    `json:"phone_number"`
    LinkedinURL    string    `json:"linkedin_url"`
}

type Employer struct {
    ID             int    `json:"id"`
    CompanyID      int    `json:"company_id" binding:"required"`
    Email          string `json:"email" binding:"required,email"`
    Password       string `json:"password" binding:"required,min=6"`
    Description    string `json:"description"`
    ContactPerson  string `json:"contact_person"`
    ContactNumber  string `json:"contact_number"`
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