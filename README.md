# Job Portal System: Database Design

This document outlines the database design for the Job Portal System, which connects job seekers with employers and supports functionalities such as job listings, user profiles, applications, and interview scheduling.

## Schema Design

### Core Tables

- **Job Seekers**
  - **Fields:**  
    `id`, `first_name`, `last_name`, `email`, `password`, `resume`, `skills`, `experience`, `location`, `created_at`, `updated_at`

- **Employers**
  - **Fields:**  
    `id`, `company_name`, `industry`, `location`, `email`, `password`, `description`, `website`, `created_at`, `updated_at`

- **Job Listings**
  - **Fields:**  
    `id`, `employer_id` (FK), `job_title`, `description`, `requirements`, `location`, `job_type`, `salary_range`, `posted_date`, `expiry_date`, `created_at`, `updated_at`

- **Applications**
  - **Fields:**  
    `id`, `job_seeker_id` (FK), `job_listing_id` (FK), `application_status`, `applied_date`, `updated_date`

- **Interviews** (Optional)
  - **Fields:**  
    `id`, `application_id` (FK), `scheduled_date`, `interview_mode`, `notes`, `status`

### Relationships and Data Integrity

- **Foreign Keys:**
  - `job_listings.employer_id` references `employers.id`
  - `applications.job_seeker_id` references `job_seekers.id`
  - `applications.job_listing_id` references `job_listings.id`
  - `interviews.application_id` references `applications.id`

- **Normalization:**
  - Data is structured to minimize redundancy, with repetitive elements (such as skills) either stored in JSON fields or normalized into separate tables if needed.

## Indexing Strategy

Indexes are applied to improve query performance on frequently filtered or joined fields:

- **Job Listings:**  
  - Indexes on `job_title`, `location`, and `job_type`

- **Job Seekers:**  
  - Indexes on `skills` (consider a full-text or GIN index if using PostgreSQL) and `location`

- **Applications:**  
  - Indexes on `job_seeker_id`, `job_listing_id`, and `application_status`

- **Employers:**  
  - Indexes on `company_name` and `location`

## Triggers and Transactions

### Triggers

- **Update Application Status on Interview Scheduling:**  
  Automatically updates an application's status to "Interview Scheduled" when an interview record is inserted.

- **Auto-Close Job Listings:**  
  Marks a job listing as "Closed" if the current date exceeds the `expiry_date` (may require a scheduled event depending on the DBMS).

- **Notify on New Application Submission:**  
  Inserts a notification record when a new application is submitted, alerting the employer.

### Transactions

Transactions ensure that multiple related operations are executed atomically, maintaining data consistency:

- **Job Application Process:**  
  Wrap the insertion of a new application and any related updates (e.g., incrementing an applicant counter) within a transaction.

- **Interview Scheduling:**  
  Wrap the insertion of an interview record and the corresponding update to the application status in a transaction to ensure both succeed or fail together.

---

This README provides a concise overview of the database design for the Job Portal System. Future updates will include additional sections covering other system components.
