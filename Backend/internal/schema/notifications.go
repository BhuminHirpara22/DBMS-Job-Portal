package schema

import "time"

type Notification struct {
    ID        int       `json:"id" db:"id"`
    UserID    int       `json:"user_id" db:"user_id"`
    UserType  string    `json:"user_type" db:"user_type"`
    Message   string    `json:"message" db:"message"`
    IsRead    bool      `json:"is_read" db:"is_read"`
    CreatedAt time.Time `json:"created_at" db:"created_at"`
}