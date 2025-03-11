-- Final Schema Design

-- ✅ 1. Job Seekers Table
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
    education TEXT,-- from
    -- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE job_seeker_skills (
    id SERIAL PRIMARY KEY,
    job_seeker_id INT REFERENCES job_seekers(id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE(job_seeker_id, skill_id)
);

CREATE TABLE education (
    education_id SERIAL PRIMARY KEY,
    job_seeker_id INT NOT NULL REFERENCES job_seekers(id) ON DELETE CASCADE,
    education_level VARCHAR(100) NOT NULL,  -- e.g., "Bachelor's Degree", "Master's", "PhD"
    institution_name VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(255),
    start_year INT,
    end_year INT,
    grade float,
    -- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE experience (
    experience_id SERIAL PRIMARY KEY,
    job_seeker_id INT NOT NULL REFERENCES job_seekers(id) ON DELETE CASCADE,
    job_title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE,  -- NULL if the job is ongoing
    -- description TEXT,
    -- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ✅ 2. Employers Table
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
    contact_number VARCHAR(15),
    -- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE company(
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(255),
    website VARCHAR(255),
    logo TEXT,
);

-- ✅ 3. Job Categories Table
-- CREATE TABLE job_categories (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(255) UNIQUE NOT NULL
-- );

-- ✅ 4. Job Listings Table
CREATE TABLE job_listings (
    id SERIAL PRIMARY KEY,
    employer_id INT REFERENCES employers(id) ON DELETE CASCADE,
    job_title VARCHAR(255) NOT NULL,
    description TEXT,
    requirements INT REFERENCES requirement(id) ON DELETE CASCADE,
    location VARCHAR(255),
    job_type VARCHAR(50),
    min_salary NUMERIC,
    max_salary NUMERIC,
    posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP NOT NULL,
    applicant_count INT,
    status VARCHAR(50) DEFAULT 'Open',
    -- remote_available BOOLEAN DEFAULT FALSE,
    job_category VARCHAR(255) UNIQUE NOT NULL,
    -- category_id INT REFERENCES job_categories(id),
    -- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE requirement (
    id SERIAL PRIMARY KEY,
    job_listing_id INT REFERENCES job_listings(id) ON DELETE CASCADE,
    name VARCHAR(255) UNIQUE NOT NULL
);


-- ✅ 5. Applications Table
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    job_seeker_id INT REFERENCES job_seekers(id) ON DELETE CASCADE,
    job_listing_id INT REFERENCES job_listings(id) ON DELETE CASCADE,
    application_status VARCHAR(50) DEFAULT 'Applied',
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cover_letter TEXT,
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

-- ✅ 7. Application Status Log Table
-- CREATE TABLE application_status_log (
--     id SERIAL PRIMARY KEY,
--     application_id INT REFERENCES applications(id) ON DELETE CASCADE,
--     status VARCHAR(50),
--     changed_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- ✅ 8. Requirement Table

-- ✅ 9. Job Seeker Skills Table

-- ✅ 10. Notifications Table
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

-- -- ✅ 12. Saved Jobs Table
-- CREATE TABLE saved_jobs (
--     id SERIAL PRIMARY KEY,
--     job_seeker_id INT REFERENCES job_seekers(id) ON DELETE CASCADE,
--     job_listing_id INT REFERENCES job_listings(id) ON DELETE CASCADE,
--     saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     UNIQUE(job_seeker_id, job_listing_id)
-- );

-- -- ✅ 13. Job Seeker Preferences Table
-- CREATE TABLE job_seeker_preferences (
--     id SERIAL PRIMARY KEY,
--     job_seeker_id INT REFERENCES job_seekers(id) ON DELETE CASCADE,
--     preferred_location VARCHAR(255),
--     preferred_job_type VARCHAR(50),
--     preferred_min_salary NUMERIC,
--     preferred_max_salary NUMERIC
-- );

-- -- ✅ 14. Employer Reviews Table
-- CREATE TABLE employer_reviews (
--     id SERIAL PRIMARY KEY,
--     job_seeker_id INT REFERENCES job_seekers(id) ON DELETE CASCADE,
--     employer_id INT REFERENCES employers(id) ON DELETE CASCADE,
--     rating INT CHECK (rating BETWEEN 1 AND 5),
--     review TEXT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- ✅ Indexing
-- CREATE INDEX idx_job_listings_title ON job_listings(job_title);
-- CREATE INDEX idx_job_listings_location ON job_listings(location);
-- CREATE INDEX idx_job_listings_status ON job_listings(status);
-- CREATE INDEX idx_applications_status ON applications(application_status);
-- CREATE INDEX idx_notifications_user_id ON notifications(user_id);
-- CREATE INDEX idx_messages_sender_receiver ON messages(sender_id, receiver_id);

-- -- ✅ Trigger: Auto-close expired job listings
-- CREATE EVENT auto_close_job_listings
-- ON SCHEDULE EVERY 1 DAY
-- DO
-- BEGIN
--     UPDATE job_listings
--     SET status = 'Closed'
--     WHERE expiry_date < CURDATE() AND status = 'Open';
-- END;

-- -- ✅ Trigger: Update application status when interview is scheduled
-- CREATE TRIGGER update_application_status
-- AFTER INSERT ON interviews
-- FOR EACH ROW
-- BEGIN
--     UPDATE applications
--     SET application_status = 'Interview Scheduled'
--     WHERE id = NEW.application_id;
-- END;

-- -- ✅ Stored Procedure: Apply for a job
-- CREATE PROCEDURE apply_for_job(
--     IN p_job_seeker_id INT,
--     IN p_job_listing_id INT,
--     IN p_cover_letter TEXT
-- )
-- BEGIN
--     START TRANSACTION;
--     INSERT INTO applications (job_seeker_id, job_listing_id, cover_letter)
--     VALUES (p_job_seeker_id, p_job_listing_id, p_cover_letter);

--     UPDATE job_listings
--     SET applicant_count = applicant_count + 1
    
--     WHERE id = p_job_listing_id;

--     INSERT INTO application_status_log (application_id, status)
--     VALUES (LAST_INSERT_ID(), 'Applied');

--     COMMIT;
-- END;

-- -- ✅ Stored Procedure: Schedule Interview
-- CREATE PROCEDURE schedule_interview(
--     IN p_application_id INT,
--     IN p_scheduled_date TIMESTAMP,
--     IN p_interview_mode VARCHAR(50),
--     IN p_interviewer_name VARCHAR(255),
--     IN p_notes TEXT
-- )
-- BEGIN
--     INSERT INTO interviews (application_id, scheduled_date, interview_mode, notes, interviewer_name)
--     VALUES (p_application_id, p_scheduled_date, p_interview_mode, p_notes, p_interviewer_name);

--     UPDATE applications
--     SET application_status = 'Interview Scheduled'
--     WHERE id = p_application_id;

--     INSERT INTO application_status_log (application_id, status)
--     VALUES (p_application_id, 'Interview Scheduled');
-- END;