package router

import (
	"fmt"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

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

	// ✅ Server Start Message
	fmt.Println("\033[36mGo Gin server started.\033[0m")

	// ✅ Logging Middleware
	router.Use(gin.LoggerWithConfig(gin.LoggerConfig{
		Output:    os.Stdout,
		Formatter: LogFormatter,
	}))

	// ✅ CORS Configuration
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{os.Getenv("WEB_URL")}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE"}
	config.AllowHeaders = []string{"X-Requested-With", "Content-Type", "Accept", "Authorization"}
	config.AllowCredentials = true
	router.Use(cors.New(config))

	// ✅ Register Routes
	SetupRoutes(router)         // General routes
	SetupRoutesJobListing(router) // Job Listing related routes

	return router
}
