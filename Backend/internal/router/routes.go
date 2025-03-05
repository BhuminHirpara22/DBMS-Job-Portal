package router

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func home(c *gin.Context) {
	c.Writer.WriteHeader(http.StatusOK)
}

func SetupRoutes(router *gin.Engine) {

	// Home route
	router.GET("/", home)
}
