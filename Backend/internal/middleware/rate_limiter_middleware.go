package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

var (
	rateLimiters = make(map[string]*rate.Limiter)
	mu           sync.RWMutex
)

// getLimiter returns a rate limiter for the given IP address
func getLimiter(ip string) *rate.Limiter {
	mu.Lock()
	defer mu.Unlock()

	limiter, exists := rateLimiters[ip]
	if !exists {
		// Create a new limiter: 100 requests per second with burst of 100
		limiter = rate.NewLimiter(rate.Every(time.Second), 100)
		rateLimiters[ip] = limiter
	}
	return limiter
}

// RateLimiterMiddleware implements rate limiting per IP address
func RateLimiterMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()
		limiter := getLimiter(ip)

		if !limiter.Allow() {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"success": false,
				"message": "Too many requests. Please try again later.",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
