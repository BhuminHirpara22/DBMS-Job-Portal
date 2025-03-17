package db

import (
	"Backend/config"
	"Backend/internal/schema"
	"context"
)

// StoreNotification inserts a new notification into the database
func StoreNotification(ctx context.Context, notification schema.Notification) error {
	query := `
		INSERT INTO notifications (user_id, user_type, message, is_read)
		VALUES ($1, $2, $3, $4)`

	_, err := config.DB.Exec(ctx, query, notification.UserID, notification.UserType, notification.Message, notification.IsRead)
	return err
}