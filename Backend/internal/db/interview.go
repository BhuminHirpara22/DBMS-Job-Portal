package db

import (
	"context"
	"Backend/config"
	"Backend/internal/schema"
)

func GenerateInterviewID(ctx context.Context) (int, error) {
	var newID int
	query := `SELECT generate_interview_id()` // Replace with actual stored procedure name
	err := config.DB.QueryRow(ctx, query).Scan(&newID)
	if err != nil {
		return 0, err
	}
	return newID, nil
}

func ScheduleInterview(ctx context.Context, interview schema.Interview) (schema.Interview, error) {
	query := `INSERT INTO interviews (application_id, scheduled_date, interview_mode, interviewer_name, interview_link) VALUES ($1, $2, $3, $4, $5) RETURNING *`
	var result schema.Interview
	err := config.DB.QueryRow(ctx, query, interview.ApplicationID, interview.ScheduledDate, interview.InterviewMode, interview.InterviewerName, interview.InterviewLink).Scan(&result.ID, &result.ApplicationID, &result.ScheduledDate, &result.InterviewMode, &result.Status, &result.InterviewerName, &result.InterviewLink)
	if err != nil {
		return schema.Interview{}, err
	}
	return result, nil
}

func GetInterviews(ctx context.Context, interviewID int) ([]schema.Interview, error) {
	query := `SELECT * FROM interviews WHERE id=$1`
	rows, err := config.DB.Query(ctx, query, interviewID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var interviews []schema.Interview
	for rows.Next() {
		var interview schema.Interview
		err := rows.Scan(&interview.ID, &interview.ApplicationID, &interview.ScheduledDate, &interview.InterviewMode, &interview.Status, &interview.InterviewerName, &interview.InterviewLink)
		if err != nil {
			return nil, err
		}
		interviews = append(interviews, interview)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return interviews, nil
}

func UpdateInterview(ctx context.Context, interview schema.Interview) (schema.Interview, error) {
	query := `UPDATE interviews SET scheduled_date=$1, interview_mode=$2, interviewer_name=$3, interview_link=$4 WHERE id=$5 RETURNING *`
	var result schema.Interview
	err := config.DB.QueryRow(ctx, query, interview.ScheduledDate, interview.InterviewMode, interview.InterviewerName, interview.InterviewLink, interview.ID).Scan(&result.ID, &result.ApplicationID, &result.ScheduledDate, &result.InterviewMode, &result.Status, &result.InterviewerName, &result.InterviewLink)
	if err != nil {
		return schema.Interview{}, err
	}
	return result, nil
}