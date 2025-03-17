package db

import (
	"Backend/config"
	"Backend/internal/schema"
	"context"
)

func GenerateNotificationID(ctx context.Context) (int, error) {
	var newID int
	query := `SELECT generate_notification_id()` // Replace with actual stored procedure name
	err := config.DB.QueryRow(ctx, query).Scan(&newID)
	if err != nil {
		return 0, err
	}
	return newID, nil
}

// StoreNotification inserts a new notification into the database
func StoreNotification(ctx context.Context, notification schema.Notification) error {
	query := `
		INSERT INTO notifications (id,user_id, user_type, message, is_read)
		VALUES ($1, $2, $3, $4, $5)`

	_, err := config.DB.Exec(ctx, query, notification.ID, notification.UserID, notification.UserType, notification.Message, notification.IsRead)
	return err
}

func GetNotifications(ctx context.Context, seekerID int) ([]schema.Notification, error) {
	var notifications []schema.Notification
	query := `SELECT id, user_id, user_type, message, is_read, created_at 
			  FROM notifications WHERE user_type = 'job_seeker' AND user_id = $1 
			  ORDER BY created_at DESC`

	rows, err := config.DB.Query(ctx, query, seekerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var notification schema.Notification
		if err := rows.Scan(&notification.ID, &notification.UserID, &notification.UserType, 
			&notification.Message, &notification.IsRead, &notification.CreatedAt); err != nil {
			return nil, err
		}
		notifications = append(notifications, notification)
	}

	return notifications, nil
}

func UpdateNotificationStatus(ctx context.Context, seekerID int) error {
	query := `UPDATE notifications SET is_read = true WHERE user_id = $1 AND user_type = 'job_seeker' AND is_read = false`
	_, err := config.DB.Exec(ctx, query, seekerID)
	return err
}
