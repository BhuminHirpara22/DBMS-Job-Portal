package router

import (
	"os"
	"time"

	"Backend/internal/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// SetupRouter initializes the Gin router with middleware and routes
func SetupRouter() *gin.Engine {
	// Always run in release mode
	gin.SetMode(gin.ReleaseMode)

	router := gin.New()

	// CORS Configuration
	config := cors.Config{
		AllowOrigins:     []string{os.Getenv("WEB_URL")},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type", "X-Requested-With", "Accept"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}
	router.Use(cors.New(config))

	// Health Check Route (no rate limit)
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Rate Limiting Middleware (skip for health check)
	router.Use(func(c *gin.Context) {
		if c.Request.URL.Path != "/health" {
			middleware.RateLimiterMiddleware()(c)
		} else {
			c.Next()
		}
	})

	// Handle Preflight Requests (OPTIONS)
	router.OPTIONS("/*path", func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", os.Getenv("WEB_URL"))
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
		c.Header("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Requested-With, Accept")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Status(204)
	})

	// Register Routes
	SetupRoutes(router)

	return router
}
