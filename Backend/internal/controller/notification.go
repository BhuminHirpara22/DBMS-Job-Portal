package controller

import (
	"Backend/internal/db"
	"context"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetNotificationsHandler(c *gin.Context) {
	seekerID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	notifications, err := db.GetNotifications(context.Background(), seekerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch notifications"})
		return
	}
	err = db.UpdateNotificationStatus(context.Background(), seekerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update notification status"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"notifications": notifications})
}