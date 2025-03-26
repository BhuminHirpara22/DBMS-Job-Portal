package db

import (
	"Backend/config"
	"Backend/internal/schema"
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"strconv"

	"github.com/lib/pq"
)

func RegisterJobSeeker(ctx context.Context, jobSeeker schema.JobSeeker) (int, error) {
	fmt.Printf("Starting job seeker registration for email: %s\n", jobSeeker.Email)

	// Convert education to JSONB
	var educationJSON []byte
	if len(jobSeeker.Education) > 0 {
		var err error
		educationJSON, err = json.Marshal(jobSeeker.Education)
		if err != nil {
			fmt.Printf("Error marshaling education: %v\n", err)
			return 0, fmt.Errorf("error marshaling education: %v", err)
		}
		fmt.Printf("Education JSON: %s\n", string(educationJSON))
	}

	// Convert experience to JSONB
	var experienceJSON []byte
	if len(jobSeeker.Experience) > 0 {
		var err error
		experienceJSON, err = json.Marshal(jobSeeker.Experience)
		if err != nil {
			fmt.Printf("Error marshaling experience: %v\n", err)
			return 0, fmt.Errorf("error marshaling experience: %v", err)
		}
		fmt.Printf("Experience JSON: %s\n", string(experienceJSON))
	}

	// Convert skills and levels to arrays if present
	var skills []string
	var skillLevels []string
	if len(jobSeeker.Skills) > 0 {
		skills = make([]string, len(jobSeeker.Skills))
		skillLevels = make([]string, len(jobSeeker.Skills))
		for i, skill := range jobSeeker.Skills {
			skills[i] = skill.SkillName
			skillLevels[i] = skill.SkillProficiency
		}
		fmt.Printf("Skills: %v\n", skills)
		fmt.Printf("Skill Levels: %v\n", skillLevels)
	}

	// Call the signup_job_seeker stored procedure
	query := `
        SELECT signup_job_seeker(
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
        )
    `

	var jobSeekerID int
	err := config.DB.QueryRow(ctx, query,
		jobSeeker.FirstName,
		jobSeeker.LastName,
		jobSeeker.Email,
		jobSeeker.Password,
		jobSeeker.Location,
		jobSeeker.PhoneNumber,
		jobSeeker.LinkedinURL,
		jobSeeker.Resume,
		jobSeeker.ProfilePicture,
		educationJSON,
		experienceJSON,
		pq.Array(skills),
		pq.Array(skillLevels),
	).Scan(&jobSeekerID)

	if err != nil {
		fmt.Printf("Database error: %v\n", err)
		return 0, fmt.Errorf("error registering job seeker: %v", err)
	}
	return jobSeekerID, nil
}

// RegisterEmployer registers a new employer and creates their company profile
func RegisterEmployer(ctx context.Context, employer schema.InputEmployer) (int, error) {
	fmt.Printf("Starting employer registration for email: %s, company ID: %s\n", employer.Email, employer.CompanyID)

	// Convert company_id string to int
	companyID, err := strconv.Atoi(employer.CompanyID)
	if err != nil {
		fmt.Printf("Error converting company ID: %v\n", err)
		return 0, fmt.Errorf("invalid company ID: %v", err)
	}

	// Call the signup_employer stored procedure
	query := `
		SELECT signup_employer(
			$1, $2, $3, $4, $5
		)
	`

	var employerID int
	err = config.DB.QueryRow(ctx, query,
		companyID,
		employer.Email,
		employer.Password,
		employer.ContactPerson,
		employer.ContactNumber,
	).Scan(&employerID)

	if err != nil {
		fmt.Printf("Error registering employer: %v\n", err)
		return 0, fmt.Errorf("error registering employer: %v", err)
	}

	fmt.Printf("Successfully created employer account with ID: %d\n", employerID)
	return employerID, nil
}

// GetJobSeekerByEmail gets a job seeker by email
func GetJobSeeker(ctx context.Context, id int) (schema.JobSeeker, error) {
	// Fetch main JobSeeker details
	query := `
		SELECT id, first_name, last_name, email, password, location, profile_picture, phone_number, linkedin_url 
		FROM job_seekers WHERE id = $1
	`

	var jobSeeker schema.JobSeeker

	err := config.DB.QueryRow(ctx, query, id).Scan(
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

	// Fetch Skills
	skillQuery := `
		SELECT id, skill_name, skill_level 
		FROM job_seeker_skills 
		WHERE job_seeker_id = $1
	`
	rows, err := config.DB.Query(ctx, skillQuery, id)
	if err != nil {
		return schema.JobSeeker{}, err
	}
	defer rows.Close()

	var skills []schema.Skill
	for rows.Next() {
		var skill schema.Skill
		err := rows.Scan(&skill.ID, &skill.SkillName, &skill.SkillProficiency)
		if err != nil {
			return schema.JobSeeker{}, err
		}
		skills = append(skills, skill)
	}
	jobSeeker.Skills = skills

	// Fetch Education
	educationQuery := `
		SELECT education_level, institution_name, field_of_study, start_year, end_year, grade
		FROM education
		WHERE job_seeker_id = $1
	`
	eduRows, err := config.DB.Query(ctx, educationQuery, id)
	if err != nil {
		return schema.JobSeeker{}, err
	}
	defer eduRows.Close()

	var education []schema.Education
	for eduRows.Next() {
		var edu schema.Education
		err := eduRows.Scan(
			&edu.Level,
			&edu.Institution,
			&edu.FieldOfStudy,
			&edu.StartYear,
			&edu.EndYear,
			&edu.Grade,
		)
		if err != nil {
			return schema.JobSeeker{}, err
		}
		education = append(education, edu)
	}
	jobSeeker.Education = education

	// Fetch Experience
	experienceQuery := `
		SELECT job_title, company_name, location, start_date, end_date
		FROM experience
		WHERE job_seeker_id = $1
	`
	expRows, err := config.DB.Query(ctx, experienceQuery, id)
	if err != nil {
		return schema.JobSeeker{}, err
	}
	defer expRows.Close()

	var experience []schema.Experience
	for expRows.Next() {
		var exp schema.Experience
		err := expRows.Scan(
			&exp.JobTitle,
			&exp.CompanyName,
			&exp.Location,
			&exp.StartDate,
			&exp.EndDate,
		)
		if err != nil {
			return schema.JobSeeker{}, err
		}
		experience = append(experience, exp)
	}
	jobSeeker.Experience = experience

	return jobSeeker, nil
}


// GetEmployer gets an employer by ID with their company information
func GetEmployer(ctx context.Context, id int) (schema.Employer, error) {
	query := `
		SELECT 
			e.id, 
			e.companyid, 
			e.email, 
			e.password, 
			e.description, 
			e.contact_person, 
			e.contact_number,
			c.company_name,
			c.industry,
			c.website
		FROM employers e
		JOIN company c ON e.companyid = c.id
		WHERE e.id = $1
	`
	var employer schema.Employer

	err := config.DB.QueryRow(ctx, query, id).Scan(
		&employer.ID,
		&employer.CompanyID,
		&employer.Email,
		&employer.Password,
		&employer.Description,
		&employer.ContactPerson,
		&employer.ContactNumber,
		&employer.CompanyName,
		&employer.Industry,
		&employer.Website,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return schema.Employer{}, fmt.Errorf("employer with ID %d not found", id)
		}
		return schema.Employer{}, fmt.Errorf("error fetching employer: %v", err)
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
	// Start a transaction
	tx, err := config.DB.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	// Update job_seeker details
	jobSeekerQuery := `
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
	_, err = tx.Exec(ctx, jobSeekerQuery,
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
	if err != nil {
		return err
	}
	// Update Skills
	_, err = tx.Exec(ctx, `DELETE FROM job_seeker_skills WHERE job_seeker_id = $1`, jobSeeker.ID)
	if err != nil {
		return err
	}
	for _, skill := range jobSeeker.Skills {
		_, err = tx.Exec(ctx, `
			INSERT INTO job_seeker_skills (job_seeker_id, skill_name, skill_level)
			VALUES ($1, $2, $3)`,
			jobSeeker.ID, skill.SkillName, skill.SkillProficiency)
		if err != nil {
			return err
		}
	}

	// Update Education
	_, err = tx.Exec(ctx, `DELETE FROM education WHERE job_seeker_id = $1`, jobSeeker.ID)
	if err != nil {
		return err
	}
	for _, edu := range jobSeeker.Education {
		_, err = tx.Exec(ctx, `
			INSERT INTO education (job_seeker_id, education_level, institution_name, field_of_study, start_year, end_year, grade)
			VALUES ($1, $2, $3, $4, $5, $6, $7)`,
			jobSeeker.ID, edu.Level, edu.Institution, edu.FieldOfStudy, edu.StartYear, edu.EndYear, edu.Grade)
		if err != nil {
			return err
		}
	}

	// Update Experience
	_, err = tx.Exec(ctx, `DELETE FROM experience WHERE job_seeker_id = $1`, jobSeeker.ID)
	if err != nil {
		return err
	}
	for _, exp := range jobSeeker.Experience {
		_, err = tx.Exec(ctx, `
			INSERT INTO experience (job_seeker_id, job_title, company_name, location, start_date, end_date)
			VALUES ($1, $2, $3, $4, $5, $6)`,
			jobSeeker.ID, exp.JobTitle, exp.CompanyName, exp.Location, exp.StartDate, exp.EndDate)
		if err != nil {
			return err
		}
	}

	// Commit transaction
	err = tx.Commit(ctx)
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

func DeleteJobSeeker(ctx context.Context, userID int) error {
	// var query string

	query := "DELETE FROM job_seekers WHERE id = $1"

	_, err := config.DB.Exec(ctx, query, userID)
	return err
}

func DeleteEmployer(ctx context.Context, userID int) error {
	// var query string

	query := "DELETE FROM employers WHERE id = $1"

	_, err := config.DB.Exec(ctx, query, userID)
	return err
}
