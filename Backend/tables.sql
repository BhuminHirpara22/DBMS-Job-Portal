-- Final Schema Design

CREATE TABLE job_seekers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    resume TEXT,
    experience TEXT,-- from experience table
    location VARCHAR(255),
    profile_picture TEXT,
    phone_number VARCHAR(10),
    linkedin_url VARCHAR(255),
    -- portfolio_url VARCHAR(255),
    education TEXT-- from
    -- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE company(
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(255),
    website VARCHAR(255),
    logo TEXT
);

CREATE TABLE employers (
    id SERIAL PRIMARY KEY,
    companyid INT NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    -- company_name VARCHAR(255) NOT NULL,
    -- industry VARCHAR(255),
    -- location VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    description TEXT,
    -- website VARCHAR(255),
    -- logo TEXT,
    contact_person VARCHAR(255),
    contact_number VARCHAR(15)
    -- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ✅ 1. Job Seekers Table
CREATE TABLE job_listings (
    id SERIAL PRIMARY KEY,
    employer_id INT REFERENCES employers(id) ON DELETE CASCADE,
    job_title VARCHAR(255) NOT NULL,
    description TEXT,
    -- requirements INT REFERENCES requirement(id) ON DELETE CASCADE,
    location VARCHAR(255),
    job_type VARCHAR(50),
    min_salary NUMERIC,
    max_salary NUMERIC,
    posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP NOT NULL,
    applicant_count INT,
    status VARCHAR(50) DEFAULT 'Open',
    -- remote_available BOOLEAN DEFAULT FALSE,
    job_category VARCHAR(255) UNIQUE NOT NULL
    -- category_id INT REFERENCES job_categories(id),
    -- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE requirement (
    id SERIAL PRIMARY KEY,
    job_listing_id INT REFERENCES job_listings(id) ON DELETE CASCADE,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE job_seeker_skills (
    id SERIAL PRIMARY KEY,
    job_seeker_id INT REFERENCES job_seekers(id) ON DELETE CASCADE,
   	skill_name VARCHAR(100)
    -- UNIQUE(job_seeker_id)
);

CREATE TABLE education (
    education_id SERIAL PRIMARY KEY,
    job_seeker_id INT NOT NULL REFERENCES job_seekers(id) ON DELETE CASCADE,
    education_level VARCHAR(100) NOT NULL,  -- e.g., "Bachelor's Degree", "Master's", "PhD"
    institution_name VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(255),
    start_year INT,
    end_year INT,
    grade float
    -- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE experience (
    experience_id SERIAL PRIMARY KEY,
    job_seeker_id INT NOT NULL REFERENCES job_seekers(id) ON DELETE CASCADE,
    job_title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE  -- NULL if the job is ongoing
    -- description TEXT,
    -- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ✅ 2. Employers Table

-- ✅ 3. Job Categories Table
-- CREATE TABLE job_categories (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(255) UNIQUE NOT NULL
-- );

-- ✅ 4. Job Listings Table


-- ✅ 5. Applications Table
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    job_seeker_id INT REFERENCES job_seekers(id) ON DELETE CASCADE,
    job_listing_id INT REFERENCES job_listings(id) ON DELETE CASCADE,
    application_status VARCHAR(50) DEFAULT 'Applied',
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cover_letter TEXT
    -- feedback TEXT
);

-- ✅ 6. Interviews Table
CREATE TABLE interviews (
    id SERIAL PRIMARY KEY,
    application_id INT REFERENCES applications(id) ON DELETE CASCADE,
    scheduled_date TIMESTAMP,
    interview_mode VARCHAR(50),
    -- notes TEXT,
    status VARCHAR(50) DEFAULT 'Scheduled',
    interviewer_name VARCHAR(255),
    -- feedback TEXT,
    interview_link TEXT
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('job_seeker', 'employer')),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ✅ 11. Messages Table
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
