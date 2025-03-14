INSERT INTO job_seekers (first_name, last_name, email, password, resume, location, profile_picture, phone_number, linkedin_url, education) VALUES
('John', 'Doe', 'john.doe@example.com', 'hashed_password', 'resume_link_1', 'New York', 'profile_pic_1.jpg', '1234567890', 'https://linkedin.com/in/johndoe', 'Bachelors in Computer Science'),
('Jane', 'Smith', 'jane.smith@example.com', 'hashed_password', 'resume_link_2', 'San Francisco', 'profile_pic_2.jpg', '0987654321', 'https://linkedin.com/in/janesmith', 'Masters in AI'),
('Michael', 'Johnson', 'michael.johnson@example.com', 'hashed_password', 'resume_link_3', 'Chicago', 'profile_pic_3.jpg', '1122334455', 'https://linkedin.com/in/michaeljohnson', 'Bachelors in Data Science'),
('Emily', 'Davis', 'emily.davis@example.com', 'hashed_password', 'resume_link_4', 'Boston', 'profile_pic_4.jpg', '4455667788', 'https://linkedin.com/in/emilydavis', 'Masters in Cybersecurity'),
('Chris', 'Brown', 'chris.brown@example.com', 'hashed_password', 'resume_link_5', 'Seattle', 'profile_pic_5.jpg', '6677889900', 'https://linkedin.com/in/chrisbrown', 'Bachelors in Finance');

INSERT INTO company (company_name, industry, website, logo) VALUES
('TechCorp', 'Software Development', 'https://techcorp.com', 'logo_techcorp.png'),
('HealthPlus', 'Healthcare', 'https://healthplus.com', 'logo_healthplus.png'),
('FinServe', 'Finance', 'https://finserve.com', 'logo_finserve.png'),
('CyberSec', 'Cybersecurity', 'https://cybersec.com', 'logo_cybersec.png'),
('EduTech', 'Education', 'https://edutech.com', 'logo_edutech.png');

INSERT INTO employers (companyid, email, password, description, contact_person, contact_number) VALUES
(1, 'recruiter1@techcorp.com', 'hashed_password', 'We hire top software talent.', 'Alice Johnson', '9876543210'),
(2, 'recruiter2@healthplus.com', 'hashed_password', 'Join our healthcare team.', 'Bob Williams', '1234567899'),
(3, 'recruiter3@finserve.com', 'hashed_password', 'Finance jobs available.', 'Charlie Brown', '9871236540'),
(4, 'recruiter4@cybersec.com', 'hashed_password', 'Cybersecurity experts needed.', 'Derek White', '5566778899'),
(5, 'recruiter5@edutech.com', 'hashed_password', 'Education platform hiring.', 'Eva Green', '6677889901');

INSERT INTO job_listings (employer_id, job_title, description, location, job_type, min_salary, max_salary, expiry_date, job_category) VALUES
(1, 'Software Engineer', 'Develop scalable web applications.', 'New York', 'Remote', 80000, 120000, '2025-12-31', 'Engineering'),
(2, 'Backend Developer', 'Build APIs and microservices.', 'San Francisco', 'Hybrid', 90000, 130000, '2025-11-30', 'Software Development'),
(3, 'Data Scientist', 'Analyze large datasets.', 'Chicago', 'Onsite', 85000, 125000, '2025-10-15', 'Data Science'),
(4, 'Cybersecurity Analyst', 'Ensure security compliance.', 'Seattle', 'Remote', 85000, 120000, '2025-09-15', 'Cybersecurity'),
(5, 'Education Consultant', 'Develop learning programs.', 'Boston', 'Hybrid', 60000, 90000, '2025-07-31', 'Education');

INSERT INTO requirement (job_listing_id, name) VALUES
(1, 'Python'),
(1, 'JavaScript'),
(2, 'Go'),
(3, 'Machine Learning'),
(4, 'Network Security'),
(5, 'Instructional Design');

INSERT INTO job_seeker_skills (job_seeker_id, skill_name) VALUES
(1, 'Python'),
(1, 'ReactJS'),
(2, 'Machine Learning'),
(2, 'SQL'),
(3, 'Financial Analysis'),
(4, 'Cybersecurity'),
(5, 'Education Technology');

INSERT INTO education (job_seeker_id, education_level, institution_name, field_of_study, start_year, end_year, grade) VALUES
(1, 'Bachelors', 'MIT', 'Computer Science', 2015, 2019, 3.8),
(2, 'Masters', 'Stanford', 'Artificial Intelligence', 2018, 2020, 3.9),
(3, 'Bachelors', 'Harvard', 'Finance', 2016, 2020, 3.7),
(4, 'Masters', 'NYU', 'Cybersecurity', 2017, 2019, 3.8),
(5, 'Bachelors', 'Berkeley', 'Education', 2014, 2018, 3.6);

INSERT INTO experience (job_seeker_id, job_title, company_name, location, start_date, end_date) VALUES
(1, 'Software Developer', 'Google', 'New York', '2019-06-01', '2023-06-01'),
(2, 'Data Analyst', 'Facebook', 'San Francisco', '2020-07-01', '2023-07-01'),
(3, 'Financial Advisor', 'Goldman Sachs', 'Chicago', '2020-05-01', '2023-05-01'),
(4, 'Cybersecurity Engineer', 'IBM', 'Seattle', '2018-03-01', NULL),
(5, 'Education Consultant', 'EdX', 'Boston', '2017-08-01', '2022-12-01');

INSERT INTO applications (job_seeker_id, job_listing_id, application_status, applied_date, cover_letter) VALUES
(1, 1, 'Applied', '2025-01-15', 'Looking forward to this role!'),
(2, 2, 'Interview Scheduled', '2025-01-16', 'Passionate about backend development.'),
(3, 3, 'Rejected', '2025-01-17', 'Data-driven approach in finance.'),
(4, 4, 'Applied', '2025-01-18', 'Excited about cybersecurity.'),
(5, 5, 'Applied', '2025-01-19', 'Eager to contribute to education technology.');

INSERT INTO interviews (application_id, scheduled_date, interview_mode, status, interviewer_name, interview_link) VALUES
(2, '2025-02-10 10:00:00', 'Online', 'Scheduled', 'Dr. Smith', 'https://meet.zoom.com/interview1'),
(4, '2025-03-15 14:00:00', 'Onsite', 'Scheduled', 'Mr. Anderson', 'https://meet.zoom.com/interview2');

INSERT INTO notifications (user_id, user_type, message, is_read) VALUES
(1, 'job_seeker', 'Your application for Software Engineer has been received.', false),
(2, 'job_seeker', 'Your interview for Backend Developer is scheduled.', false),
(3, 'employer', 'New application for Financial Analyst.', false),
(4, 'job_seeker', 'Your interview for Cybersecurity Analyst is confirmed.', false);

INSERT INTO messages (sender_id, sender_type, receiver_id, receiver_type, message, is_read) VALUES
(1, 'job_seeker', 3, 'employer', 'I would like to know more about the role.', false),
(3, 'employer', 1, 'job_seeker', 'Please share your availability for an interview.', true),
(2, 'job_seeker', 4, 'employer', 'What are the key skills needed?', false),
(4, 'employer', 2, 'job_seeker', 'Let’s schedule a call to discuss further.', true);
