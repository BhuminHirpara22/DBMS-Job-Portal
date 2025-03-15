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
