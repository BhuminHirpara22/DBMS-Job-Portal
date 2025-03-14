package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware ensures only authorized users access specific routes
func AuthMiddleware(userType string) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization") // Read token from headers

		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: No token provided"})
			c.Abort()
			return
		}

		// Example: Validate token and extract role
		// In real use, replace this with JWT validation
		role := validateToken(token)
		if role != userType {
			c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden: Access denied"})
			c.Abort()
			return
		}

		c.Next() // Proceed to route
	}
}

// Mock function to simulate token validation
func validateToken(token string) string {
	if token == "employer-token" {
		return "employer"
	} else if token == "job-seeker-token" {
		return "job_seeker"
	}
	return ""
}
