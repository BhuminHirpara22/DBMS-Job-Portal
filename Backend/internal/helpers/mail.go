package helpers

import (
	"fmt"
	"net/smtp"
	"strings"
)

// SendMail sends an email notification with HTML formatting and headers
func SendMail(mailID string, message string) error {
	smtpServer := "smtp.gmail.com"
	port := "587"
	senderEmail := "noreply.dazzledate@gmail.com"
	senderPassword := "aebzowaupuudvahh" // App password (no spaces)

	auth := smtp.PlainAuth("", senderEmail, senderPassword, smtpServer)

	// HTML Email Body
	htmlMessage := fmt.Sprintf(`
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        h2 { color: #4CAF50; }
        p { font-size: 16px; }
        .footer { margin-top: 20px; font-size: 14px; color: #777; }
        a { color: #4CAF50; text-decoration: none; }
    </style>
</head>
<body>
    <h2>Job Portal Notification</h2>
    <p>%s</p>
    <div class="footer">
        <hr>
        <p>Best regards,<br>
        <strong>DazzleDate Job Portal Team</strong></p>
        <p>Contact us: <a href="mailto:support@dazzledate.com">support@dazzledate.com</a></p>
        <p>123 Job Street, Tech City, TX 75001</p>
        <p>To unsubscribe, click <a href="https://dazzledate.com/unsubscribe">here</a></p>
    </div>
</body>
</html>
`, message)

	// Email headers
	headers := []string{
		"From: " + senderEmail,
		"To: " + mailID,
		"Subject: Job Portal Notification",
		"Reply-To: support@dazzledate.com",
		"MIME-Version: 1.0",
		"Content-Type: text/html; charset=UTF-8",
	}

	// Combine headers and message
	emailBody := strings.Join(headers, "\r\n") + "\r\n\r\n" + htmlMessage

	// Send the email
	err := smtp.SendMail(smtpServer+":"+port, auth, senderEmail, []string{mailID}, []byte(emailBody))
	if err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}
	return nil
}
