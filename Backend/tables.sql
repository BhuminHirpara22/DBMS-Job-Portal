-- Job Seekers Table
CREATE TABLE job_seekers (
    id SERIAL PRIMARY KEY,  --  Auto-increment ID (No need to set manually)
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    resume TEXT DEFAULT NULL,
    location VARCHAR(255) DEFAULT NULL,
    profile_picture TEXT DEFAULT NULL,
    phone_number VARCHAR(15) DEFAULT NULL,
    linkedin_url VARCHAR(255) DEFAULT NULL,
    application_count INT DEFAULT 0,
    interview_count INT DEFAULT 0,
    result_count INT DEFAULT 0
);

-- Companies Table
CREATE TABLE company (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(255),
    website VARCHAR(255),
    logo TEXT
);

-- Employers Table
CREATE TABLE employers (
    id SERIAL PRIMARY KEY,
    companyid INT NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    description TEXT,
    contact_person VARCHAR(255),
    contact_number VARCHAR(15)
);

-- Job Listings Table
CREATE TABLE job_listings (
    id SERIAL PRIMARY KEY,
    employer_id INT REFERENCES employers(id) ON DELETE CASCADE,
    job_title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    job_type VARCHAR(50),
    min_salary NUMERIC,
    max_salary NUMERIC,
    posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP NOT NULL,
    applicant_count INT DEFAULT 0, --  Ensure future records default to 0
    status VARCHAR(50) DEFAULT 'Open',
    job_category VARCHAR(255) NOT NULL
);

-- Requirements Table (🔹 Removed UNIQUE constraint on 'name')
CREATE TABLE requirement (
    id SERIAL PRIMARY KEY,
    job_listing_id INT REFERENCES job_listings(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL
);

-- Job Seeker Skills Table
CREATE TABLE job_seeker_skills (
    id SERIAL PRIMARY KEY,
    job_seeker_id INT REFERENCES job_seekers(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    skill_level VARCHAR(50) NOT NULL CHECK (skill_level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert'))
);

-- Education Table
CREATE TABLE education (
    education_id SERIAL PRIMARY KEY,
    job_seeker_id INT NOT NULL REFERENCES job_seekers(id) ON DELETE CASCADE,
    education_level VARCHAR(100) NOT NULL, 
    institution_name VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(255),
    start_year INT,
    end_year INT,
    grade FLOAT
);

-- Experience Table
CREATE TABLE experience (
    experience_id SERIAL PRIMARY KEY,
    job_seeker_id INT NOT NULL REFERENCES job_seekers(id) ON DELETE CASCADE,
    job_title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE -- NULL if the job is ongoing
);

-- Applications Table (🔹 Status constraint)
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    job_seeker_id INT REFERENCES job_seekers(id) ON DELETE CASCADE,
    job_listing_id INT REFERENCES job_listings(id) ON DELETE CASCADE,
    application_status VARCHAR(50) DEFAULT 'Applied' CHECK (application_status IN ('Applied', 'Interview Scheduled', 'Rejected', 'Accepted')),
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cover_letter TEXT
);

-- Interviews Table (🔹 Status constraint)
CREATE TABLE interviews (
    id SERIAL PRIMARY KEY,
    application_id INT REFERENCES applications(id) ON DELETE CASCADE,
    scheduled_date TIMESTAMP,
    interview_mode VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled')),
    interviewer_name VARCHAR(255),
    interview_link TEXT
);

-- Notifications Table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('job_seeker', 'employer')),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages Table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL,
    sender_type VARCHAR(50) NOT NULL CHECK (sender_type IN ('job_seeker', 'employer')),
    receiver_id INT NOT NULL,
    receiver_type VARCHAR(50) NOT NULL CHECK (receiver_type IN ('job_seeker', 'employer')),
    message TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);

--  Ensure existing `applicant_count` values are 0 where NULL
UPDATE job_listings SET applicant_count = 0 WHERE applicant_count IS NULL;


-- Stored Procedures

--  Function to Create a Job Listing
CREATE OR REPLACE FUNCTION create_job(
    employer_id INT, 
    job_title VARCHAR, 
    description TEXT, 
    location VARCHAR, 
    job_type VARCHAR, 
    min_salary NUMERIC, 
    max_salary NUMERIC, 
    expiry_date DATE, 
    job_category VARCHAR
) RETURNS INT AS $$
DECLARE 
    new_job_id INT;
BEGIN
    INSERT INTO job_listings (
        employer_id, job_title, description, location, job_type, 
        min_salary, max_salary, expiry_date, job_category
    ) 
    VALUES (
        employer_id, job_title, description, location, job_type, 
        min_salary, max_salary, expiry_date, job_category
    ) 
    RETURNING id INTO new_job_id;

    RETURN new_job_id;
END;
$$ LANGUAGE plpgsql;


--  Function to Add a Requirement to a Job
CREATE OR REPLACE FUNCTION add_requirement(
    job_listing_id INT, 
    requirement_name VARCHAR
) RETURNS VOID AS $$
BEGIN
    INSERT INTO requirement (job_listing_id, name) 
    VALUES (job_listing_id, requirement_name);
END;
$$ LANGUAGE plpgsql;


-- Function for Applying to a Job
CREATE OR REPLACE FUNCTION apply_for_job(
    p_job_seeker_id INT, 
    p_job_listing_id INT, 
    p_cover_letter TEXT
) RETURNS INT AS $$
DECLARE 
    new_application_id INT;
    already_applied BOOLEAN;
BEGIN
    -- Check if the user has already applied
    SELECT EXISTS (
        SELECT 1 FROM applications 
        WHERE applications.job_seeker_id = p_job_seeker_id 
        AND applications.job_listing_id = p_job_listing_id
    ) INTO already_applied;

    IF already_applied THEN
        RAISE EXCEPTION 'User has already applied for this job';
    END IF;

    -- Insert application
    INSERT INTO applications (
        job_seeker_id, job_listing_id, application_status, applied_date, cover_letter
    ) VALUES (
        p_job_seeker_id, p_job_listing_id, 'Applied', NOW(), p_cover_letter
    ) RETURNING id INTO new_application_id;

    RETURN new_application_id;
END;
$$ LANGUAGE plpgsql;

--  Function to Fetch Open Jobs (with Pagination)
CREATE OR REPLACE FUNCTION fetch_open_jobs(p_limit INT, p_offset INT)
RETURNS TABLE (
    id INT,
    employer_id INT,
    job_title VARCHAR,
    description TEXT,
    location VARCHAR,
    job_type VARCHAR,
    min_salary NUMERIC,
    max_salary NUMERIC,
    posted_date TIMESTAMP,
    expiry_date TIMESTAMP,
    applicant_count INT,
    status VARCHAR,
    job_category VARCHAR
) AS $$
BEGIN
    RETURN QUERY 
    SELECT * 
    FROM job_listings 
    WHERE job_listings.status = 'Open' 
      AND job_listings.expiry_date >= CURRENT_DATE
    ORDER BY job_listings.posted_date DESC;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION fetch_open_job(p_job_id INT)
RETURNS TABLE (
    id INT,
    employer_id INT,
    job_title VARCHAR,
    description TEXT,
    location VARCHAR,
    job_type VARCHAR,
    min_salary NUMERIC,
    max_salary NUMERIC,
    posted_date TIMESTAMP,
    expiry_date TIMESTAMP,
    applicant_count INT,
    status VARCHAR,
    job_category VARCHAR,
    requirements TEXT[]
) AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        jl.id, jl.employer_id, jl.job_title, jl.description, 
        jl.location, jl.job_type, jl.min_salary, jl.max_salary, 
        jl.posted_date, jl.expiry_date, jl.applicant_count, 
        jl.status, jl.job_category,
        COALESCE(array_agg(r.name::TEXT) FILTER (WHERE r.name IS NOT NULL), '{}') AS requirements
    FROM job_listings jl
    LEFT JOIN requirement r ON jl.id = r.job_listing_id
    WHERE jl.id = p_job_id 
      AND jl.status = 'Open' 
      AND jl.expiry_date >= CURRENT_DATE
    GROUP BY jl.id;
END;
$$ LANGUAGE plpgsql;



--  Function to Filter Jobs with Skills
CREATE OR REPLACE FUNCTION filter_jobs(
    p_location VARCHAR DEFAULT NULL,
    p_job_type VARCHAR DEFAULT NULL,
    p_min_salary NUMERIC DEFAULT 0,
    p_max_salary NUMERIC DEFAULT 0,
    p_skills TEXT[] DEFAULT NULL
)
RETURNS TABLE (
    id INT,
    employer_id INT,
    job_title VARCHAR,
    description TEXT,
    location VARCHAR,
    job_type VARCHAR,
    min_salary NUMERIC,
    max_salary NUMERIC,
    posted_date TIMESTAMP,
    expiry_date TIMESTAMP,
    applicant_count INT,
    status VARCHAR,
    job_category VARCHAR
) AS $$
BEGIN
    RETURN QUERY 
    SELECT DISTINCT jl.*
    FROM job_listings jl
    LEFT JOIN requirement r ON jl.id = r.job_listing_id
    WHERE jl.status = 'Open' 
      AND jl.expiry_date >= CURRENT_DATE
      AND (p_location IS NULL OR LOWER(jl.location) LIKE LOWER('%' || p_location || '%'))
      AND (p_job_type IS NULL OR LOWER(jl.job_type) LIKE LOWER('%' || p_job_type || '%'))
      AND (p_min_salary = 0 OR jl.min_salary >= p_min_salary)
      AND (p_max_salary = 0 OR jl.max_salary <= p_max_salary)
      AND (p_skills IS NULL OR EXISTS (
          SELECT 1 FROM requirement req 
          WHERE req.job_listing_id = jl.id 
          AND req.name = ANY(p_skills) 
      ))
    ORDER BY jl.posted_date DESC;
END;
$$ LANGUAGE plpgsql;


--  Trigger to Increment Applicant Count
CREATE OR REPLACE FUNCTION update_applicant_count() RETURNS TRIGGER AS $$
BEGIN
    UPDATE job_listings
    SET applicant_count = COALESCE(applicant_count, 0) + 1
    WHERE id = NEW.job_listing_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_applicant_count
AFTER INSERT ON applications
FOR EACH ROW
EXECUTE FUNCTION update_applicant_count();


--  Trigger to Prevent Expired Job Applications
CREATE OR REPLACE FUNCTION prevent_expired_applications() RETURNS TRIGGER AS $$
DECLARE job_expiry DATE;
BEGIN
    SELECT expiry_date INTO job_expiry FROM job_listings WHERE id = NEW.job_listing_id;
    
    IF job_expiry < CURRENT_DATE THEN
        RAISE EXCEPTION 'Job application cannot be submitted as the job is expired';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prevent_expired_applications
BEFORE INSERT ON applications
FOR EACH ROW
EXECUTE FUNCTION prevent_expired_applications();


--  Trigger to Close Expired Jobs
CREATE OR REPLACE FUNCTION close_expired_jobs() RETURNS TRIGGER AS $$
BEGIN
    UPDATE job_listings
    SET status = 'Closed'
    WHERE job_listings.expiry_date < CURRENT_DATE 
      AND job_listings.status != 'Closed';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_close_expired_jobs
BEFORE UPDATE ON job_listings
FOR EACH ROW
EXECUTE FUNCTION close_expired_jobs();


--  Trigger to Prevent Duplicate Applications
CREATE OR REPLACE FUNCTION prevent_duplicate_applications() RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM applications 
        WHERE job_seeker_id = NEW.job_seeker_id 
        AND job_listing_id = NEW.job_listing_id
    ) THEN
        RAISE EXCEPTION 'You have already applied for this job';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prevent_duplicate_applications
BEFORE INSERT ON applications
FOR EACH ROW
EXECUTE FUNCTION prevent_duplicate_applications();


CREATE OR REPLACE FUNCTION update_application_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Case 1: New Application Added
    IF TG_OP = 'INSERT' THEN
        UPDATE job_seekers
        SET application_count = application_count + 1
        WHERE id = NEW.job_seeker_id;
    
    -- Case 2: Application Status Updated from 'Applied' to 'Approved' or 'Rejected'
    ELSIF TG_OP = 'UPDATE' AND OLD.application_status = 'Applied' AND NEW.application_status IN ('Approved', 'Rejected') THEN
        UPDATE job_seekers
        SET application_count = application_count - 1,
            result_count = result_count + 1
        WHERE id = NEW.job_seeker_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER application_status_update_trigger
AFTER INSERT OR UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION update_application_counts();

CREATE OR REPLACE FUNCTION update_interview_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Case 1: New Interview Added
    IF TG_OP = 'INSERT' THEN
        UPDATE job_seekers
        SET interview_count = interview_count + 1
        WHERE id = (SELECT job_seeker_id FROM applications WHERE id = NEW.application_id);

    -- Case 2: Interview Deleted
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE job_seekers
        SET interview_count = interview_count - 1
        WHERE id = (SELECT job_seeker_id FROM applications WHERE id = OLD.application_id);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER interview_count_trigger
AFTER INSERT OR DELETE ON interviews
FOR EACH ROW
EXECUTE FUNCTION update_interview_counts();

CREATE OR REPLACE FUNCTION generate_notification_id()
RETURNS INT AS $$
DECLARE
    new_id INT;
BEGIN
    -- Get the next available ID
    SELECT COALESCE(MAX(id), 0) + 1 INTO new_id FROM notifications;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION generate_notification_id()
RETURNS INT AS $$
DECLARE
    new_id INT;
BEGIN
    -- Get the next available ID
    SELECT COALESCE(MAX(id), 0) + 1 INTO new_id FROM notifications;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION generate_notification_id()
RETURNS INT AS $$
DECLARE
    new_id INT;
BEGIN
    -- Get the next available ID
    SELECT COALESCE(MAX(id), 0) + 1 INTO new_id FROM notifications;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Function for Job Seeker Signup
CREATE OR REPLACE FUNCTION signup_job_seeker(
    p_first_name VARCHAR,
    p_last_name VARCHAR,
    p_email VARCHAR,
    p_password VARCHAR,
    p_location VARCHAR DEFAULT NULL,
    p_phone_number VARCHAR DEFAULT NULL,
    p_linkedin_url VARCHAR DEFAULT NULL,
    p_resume TEXT DEFAULT NULL,
    p_profile_picture TEXT DEFAULT NULL,
    p_education JSONB DEFAULT NULL,
    p_experience JSONB DEFAULT NULL,
    p_skills TEXT[] DEFAULT NULL,
    p_skill_levels TEXT[] DEFAULT NULL
) RETURNS INT AS $$
DECLARE
    new_user_id INT;
    edu_record JSONB;
    exp_record JSONB;
    skill TEXT;
    skill_level TEXT;
BEGIN
    -- Check if email already exists
    IF EXISTS (SELECT 1 FROM job_seekers WHERE email = p_email) THEN
        RAISE EXCEPTION 'Email already registered';
    END IF;

    -- Insert new user
    INSERT INTO job_seekers (
        first_name, last_name, email, password,
        location, phone_number, linkedin_url, resume, profile_picture   
    ) VALUES (
        p_first_name, p_last_name, p_email, p_password,
        p_location, p_phone_number, p_linkedin_url, p_resume, p_profile_picture
    ) RETURNING id INTO new_user_id;

    -- Insert Education records if provided
    IF p_education IS NOT NULL THEN
        FOR edu_record IN SELECT * FROM jsonb_array_elements(p_education)
        LOOP
            INSERT INTO education (
                job_seeker_id, education_level, institution_name, 
                field_of_study, start_year, end_year, grade
            ) VALUES (
                new_user_id,
                (edu_record->>'education_level')::VARCHAR,
                (edu_record->>'institution_name')::VARCHAR,
                (edu_record->>'field_of_study')::VARCHAR,
                (edu_record->>'start_year')::INT,
                (edu_record->>'end_year')::INT,
                (edu_record->>'grade')::FLOAT
            );
        END LOOP;
    END IF;

    -- Insert Experience records if provided
    IF p_experience IS NOT NULL THEN
        FOR exp_record IN SELECT * FROM jsonb_array_elements(p_experience)
        LOOP
            INSERT INTO experience (
                job_seeker_id, job_title, company_name, 
                location, start_date, end_date
            ) VALUES (
                new_user_id,
                (exp_record->>'job_title')::VARCHAR,
                (exp_record->>'company_name')::VARCHAR,
                (exp_record->>'location')::VARCHAR,
                (exp_record->>'start_date')::DATE,
                CASE 
                    WHEN exp_record->>'end_date' IS NULL THEN NULL
                    ELSE (exp_record->>'end_date')::DATE
                END
            );
        END LOOP;
    END IF;

    -- Insert Skills if provided
    IF p_skills IS NOT NULL AND p_skill_levels IS NOT NULL THEN
        FOR i IN 1..array_length(p_skills, 1)
        LOOP
            skill := p_skills[i];
            skill_level := p_skill_levels[i];
            
            -- Validate skill level
            IF skill_level NOT IN ('Beginner', 'Intermediate', 'Advanced', 'Expert') THEN
                RAISE EXCEPTION 'Invalid skill level: %', skill_level;
            END IF;

            INSERT INTO job_seeker_skills (
                job_seeker_id, skill_name, skill_level
            ) VALUES (
                new_user_id, skill, skill_level
            );
        END LOOP;
    END IF;

    RETURN new_user_id;
EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'Email already registered';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error during signup: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Function for Employer Signup
CREATE OR REPLACE FUNCTION signup_employer(
    p_company_id INT,
    p_email VARCHAR(255),
    p_password VARCHAR(255),
    p_contact_person VARCHAR(255) DEFAULT NULL,
    p_contact_number VARCHAR(15) DEFAULT NULL
) RETURNS INT AS $$
DECLARE
    new_employer_id INT;
BEGIN
    -- Validate required parameters
    IF p_company_id IS NULL THEN
        RAISE EXCEPTION 'Company ID is required';
    END IF;
    
    IF p_email IS NULL OR p_email = '' THEN
        RAISE EXCEPTION 'Email is required';
    END IF;
    
    IF p_password IS NULL OR p_password = '' THEN
        RAISE EXCEPTION 'Password is required';
    END IF;

    -- Check if company exists
    IF NOT EXISTS (SELECT 1 FROM company WHERE id = p_company_id) THEN
        RAISE EXCEPTION 'Company with ID % not found', p_company_id;
    END IF;

    -- Check if email already exists
    IF EXISTS (SELECT 1 FROM employers WHERE email = p_email) THEN
        RAISE EXCEPTION 'Email already registered';
    END IF;

    -- Insert new employer
    INSERT INTO employers (
        companyid, email, password, contact_person, contact_number
    ) VALUES (
        p_company_id, p_email, p_password, p_contact_person, p_contact_number
    ) RETURNING id INTO new_employer_id;

    RETURN new_employer_id;
EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'Email already registered';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error during signup: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;


-- Create a clustered index on job_seekers.location (for location-based searches).
CREATE INDEX IF NOT EXISTS idx_job_seekers_location ON job_seekers(location);
CLUSTER job_seekers USING idx_job_seekers_location;

-- Create a clustered index on employers.companyid (for efficient joins with the company table).
CREATE INDEX IF NOT EXISTS idx_employers_companyid ON employers(companyid);
CLUSTER employers USING idx_employers_companyid;

-- Create a normal index on job_listings.job_title to improve searches by job title.
CREATE INDEX IF NOT EXISTS idx_job_listings_job_title ON job_listings(job_title);

-- Create a clustered index on job_listings.status to quickly filter by job status.
CREATE INDEX IF NOT EXISTS idx_job_listings_status ON job_listings(status);
CLUSTER job_listings USING idx_job_listings_status;

CREATE INDEX IF NOT EXISTS idx_company_industry ON company(industry);

CREATE INDEX IF NOT EXISTS idx_job_listings_job_type ON job_listings(job_type);

CREATE INDEX IF NOT EXISTS idx_job_seeker_skills_skill_name ON job_seeker_skills(skill_name);

CREATE INDEX IF NOT EXISTS idx_education_institution ON education(institution_name);

CREATE INDEX IF NOT EXISTS idx_experience_company_name ON experience(company_name);

