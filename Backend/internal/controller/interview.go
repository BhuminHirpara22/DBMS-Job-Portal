package controller

import (
	"Backend/internal/db"
	"Backend/internal/schema"
	"Backend/internal/helpers"
	"context"
	"net/http"
	"strconv"
	"fmt"

	"github.com/gin-gonic/gin"
)

// ScheduleInterviewHandler schedules an interview and sends an email notification
func ScheduleInterviewHandler(c *gin.Context) {
	var interview schema.Interview
	if err := c.ShouldBindJSON(&interview); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}
	// Step 1: Generate a new application ID
	// newID, err := db.GenerateInterviewID(context.Background())
	// if err != nil {
	// 	fmt.Println(err)
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate interview ID"})
	// 	return
	// }

	// Step 2: Assign the generated ID to the application struct
	// interview.ID = newID

	// Step 2: Schedule the interview
	result, err := db.ScheduleInterview(context.Background(), interview)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to schedule interview"})
		return
	}

	// Step 3: Fetch the application details
	application, err := db.GetApplication(context.Background(), interview.ApplicationID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch application details"})
		return
	}

	// Step 4: Create a notification for the job seeker
	message := fmt.Sprintf("Your interview for application %d has been scheduled.", application.ID)

	notificationID, err := db.GenerateNotificationID(context.Background())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate notification ID"})
		return
	}

	notification := schema.Notification{
		ID:       notificationID,
		UserID:   application.JobSeekerID,
		UserType: "job_seeker",
		Message:  message,
		IsRead:   false,
	}

	err = db.StoreNotification(context.Background(), notification)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store notification"})
		return
	}

	// Step 5: Send email notification in a goroutine
	go func() {
		// Fetch job seeker details
		jobseeker, err := db.GetJobSeeker(context.Background(), application.JobSeekerID)
		if err != nil {
			fmt.Println("Failed to fetch job seeker details:", err)
			return
		}

		// Prepare email content
		emailMessage := fmt.Sprintf(`
Your interview for application <strong>#%d</strong> has been scheduled.<br>
📅 <strong>Date:</strong> %s<br>
⏰ <strong>Mode:</strong> %s<br>
We look forward to meeting you!
`, application.ID, interview.ScheduledDate,interview.InterviewMode)

		// Send the email
		err = helpers.SendMail(jobseeker.Email, emailMessage)
		if err != nil {
			fmt.Println("Failed to send email:", err)
		} else {
			fmt.Println("Email sent successfully to:", jobseeker.Email)
		}
	}()

	// Step 6: Return success response
	c.JSON(http.StatusOK, gin.H{
		"message":   "Interview scheduled successfully",
		"interview": result,
	})
}

func GetSeekerInterviewHandler(c *gin.Context) {
	seekerID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid interview ID"})
		return
	}

	interviews, err := db.GetSeekerInterviews(context.Background(), seekerID)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve interviews"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"interviews": interviews})
}

func GetInterviewHandler(c *gin.Context) {
	applicationID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid interview ID"})
		return
	}

	interviews, err := db.GetInterviews(context.Background(), applicationID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve interviews"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"interviews": interviews})
}


func UpdateInterviewHandler(c *gin.Context) {
	var interview schema.Interview
	if err := c.ShouldBindJSON(&interview); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	result, err := db.UpdateInterview(context.Background(), interview)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update interview"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Interview updated successfully", "interview": result})
}

// GetSeekerInterviewCountHandler handles the request to get the count of a seeker's interviews
func GetSeekerInterviewCountHandler(c *gin.Context) {
	seekerID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid job seeker ID"})
		return
	}

	count, err := db.GetSeekerInterviewCount(context.Background(), seekerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve interview count"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"job_seeker_id": seekerID, "interview_count": count})
}