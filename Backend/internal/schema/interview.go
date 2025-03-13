package schema

import "time" 

type Interview struct {
	ID              int    `json:"id"`
	ApplicationID   int    `json:"application_id"`
	ScheduledDate   time.Time `json:"scheduled_date"`
	InterviewMode   string `json:"interview_mode"`
	Status         string `json:"status"`
	InterviewerName string `json:"interviewer_name"`
	InterviewLink   string `json:"interview_link"`
}