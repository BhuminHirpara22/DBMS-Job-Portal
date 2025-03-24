package router

import (
	"fmt"
	// "net/http"
	"os"
	"time"

	"Backend/internal/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

// Rate limiter settings (100 requests per 10 minutes per IP)
var rateLimiters = make(map[string]*rate.Limiter)
var limit = rate.NewLimiter(10, 20) // Max 10 requests per second, burst up to 20

// LogFormatter formats logs for better debugging
func LogFormatter(params gin.LogFormatterParams) string {
	return fmt.Sprintf("[%s] - %s \"%s %s %s %d %s \"%s\" %s\"\n",
		params.TimeStamp.Format("2006-01-02 15:04:05"),
		params.ClientIP,
		params.Method,
		params.Path,
		params.Request.Proto,
		params.StatusCode,
		params.Latency,
		params.Request.UserAgent(),
		params.ErrorMessage,
	)
}

// SetupRouter initializes the Gin router with middleware and routes
func SetupRouter() *gin.Engine {
	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()

	//  Server Start Message
	fmt.Println("\033[36mGo Gin server started.\033[0m")

	//  Logging Middleware
	router.Use(gin.LoggerWithConfig(gin.LoggerConfig{
		Output:    os.Stdout,
		Formatter: LogFormatter,
	}))

	//  CORS Configuration
	config := cors.Config{
		AllowOrigins:     []string{os.Getenv("WEB_URL")}, // Allowed frontend URL (from .env)
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type", "X-Requested-With", "Accept"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour, // Cache preflight request for 12 hours
	}
	router.Use(cors.New(config))

	//  Rate Limiting Middleware
	router.Use(middleware.RateLimiterMiddleware())

	//  Handle Preflight Requests (OPTIONS)
	router.OPTIONS("/*path", func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", os.Getenv("WEB_URL"))
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
		c.Header("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Requested-With, Accept")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Status(204) // No content response
	})

	//  Register Routes
	SetupRoutes(router)

	return router
}
