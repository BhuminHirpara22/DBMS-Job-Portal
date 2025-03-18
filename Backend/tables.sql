-- Job Seekers Table
CREATE TABLE job_seekers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    resume TEXT,
    experience TEXT, -- from experience table
    location VARCHAR(255),
    profile_picture TEXT,
    phone_number VARCHAR(10),
    linkedin_url VARCHAR(255),
    education TEXT -- from education table
    applicatiom_count INT DEFAULT 0,
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
    applicant_count INT DEFAULT 0, -- ✅ Ensure future records default to 0
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
    skill_name VARCHAR(100)
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

-- ✅ Ensure existing `applicant_count` values are 0 where NULL
UPDATE job_listings SET applicant_count = 0 WHERE applicant_count IS NULL;


-- Stored Procedures

-- ✅ Function to Create a Job Listing
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


-- ✅ Function to Add a Requirement to a Job
CREATE OR REPLACE FUNCTION add_requirement(
    job_listing_id INT, 
    requirement_name VARCHAR
) RETURNS VOID AS $$
BEGIN
    INSERT INTO requirement (job_listing_id, name) 
    VALUES (job_listing_id, requirement_name);
END;
$$ LANGUAGE plpgsql;


-- ✅ Function for Applying to a Job
CREATE OR REPLACE FUNCTION apply_for_job(
    job_seeker_id INT, 
    job_listing_id INT, 
    cover_letter TEXT
) RETURNS INT AS $$
DECLARE 
    new_application_id INT;
    already_applied BOOLEAN;
BEGIN
    -- Check if user already applied
    SELECT EXISTS (
        SELECT 1 FROM applications WHERE job_seeker_id = apply_for_job.job_seeker_id 
        AND job_listing_id = apply_for_job.job_listing_id
    ) INTO already_applied;

    IF already_applied THEN
        RAISE EXCEPTION 'User has already applied for this job';
    END IF;

    -- Insert application
    INSERT INTO applications (
        job_seeker_id, job_listing_id, application_status, applied_date, cover_letter
    ) VALUES (
        job_seeker_id, job_listing_id, 'Applied', NOW(), cover_letter
    ) RETURNING id INTO new_application_id;

    -- Update job applicant count
    UPDATE job_listings 
    SET applicant_count = COALESCE(applicant_count, 0) + 1 
    WHERE id = job_listing_id;

    RETURN new_application_id;
END;
$$ LANGUAGE plpgsql;


-- ✅ Function to Fetch Open Jobs (with Pagination)
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



-- ✅ Function to Filter Jobs with Skills
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


-- ✅ Trigger to Increment Applicant Count
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


-- ✅ Trigger to Prevent Expired Job Applications
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


-- ✅ Trigger to Close Expired Jobs
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


-- ✅ Trigger to Prevent Duplicate Applications
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



-- Function to prevent duplicate job postings
CREATE OR REPLACE FUNCTION prevent_duplicate_jobs() RETURNS TRIGGER AS $$
DECLARE 
    duplicate_exists BOOLEAN;
BEGIN
    -- Check if a duplicate job already exists
    SELECT EXISTS (
        SELECT 1 
        FROM job_listings 
        WHERE employer_id = NEW.employer_id
        AND job_title = NEW.job_title
        AND description = NEW.description
        AND location = NEW.location
        AND job_type = NEW.job_type
        AND min_salary = NEW.min_salary
        AND max_salary = NEW.max_salary
        AND job_category = NEW.job_category
        AND status = 'Open'
    ) INTO duplicate_exists;

    -- If a duplicate exists, prevent insertion
    IF duplicate_exists THEN
        RAISE EXCEPTION 'Duplicate job listing already exists';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call prevent_duplicate_jobs before inserting a new job
CREATE TRIGGER trigger_prevent_duplicate_jobs
BEFORE INSERT ON job_listings
FOR EACH ROW
EXECUTE FUNCTION prevent_duplicate_jobs();
-

-- Function to delete old duplicate job postings before inserting a new one
CREATE OR REPLACE FUNCTION delete_old_duplicate_jobs() RETURNS TRIGGER AS $$
BEGIN
    -- Delete older duplicates before inserting the new one
    DELETE FROM job_listings
    WHERE employer_id = NEW.employer_id
    AND job_title = NEW.job_title
    AND description = NEW.description
    AND location = NEW.location
    AND job_type = NEW.job_type
    AND min_salary = NEW.min_salary
    AND max_salary = NEW.max_salary
    AND job_category = NEW.job_category
    AND status = 'Open';

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call delete_old_duplicate_jobs before inserting a new job
CREATE TRIGGER trigger_delete_old_duplicate_jobs
BEFORE INSERT ON job_listings
FOR EACH ROW
EXECUTE FUNCTION delete_old_duplicate_jobs();
