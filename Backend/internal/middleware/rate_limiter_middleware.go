package middleware

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

var rateLimiters = make(map[string]*rate.Limiter)

func RateLimiterMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		clientIP := c.ClientIP()

		if _, exists := rateLimiters[clientIP]; !exists {
			rateLimiters[clientIP] = rate.NewLimiter(rate.Every(5*time.Minute/100), 5) // 100 requests per 10 min
		}

		if !rateLimiters[clientIP].Allow() {
			c.JSON(http.StatusTooManyRequests, gin.H{"error": "Too many requests. Please try again later."})
			c.Abort()
			return
		}

		c.Next()
	}
}