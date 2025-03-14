package main

import (
	"fmt"
	"log"
	"os"

	"Backend/config"
	"Backend/internal/router"

	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables from .env
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found, using system environment variables")
	}

	// Initialize database connection
	config.ConnectPSQL()
	defer config.CloseDB()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("\033[1;36m%s\033[0m \033[1;32m%s%s\033[0m\n", "Server running on:", "http://localhost:", port)

	r := router.SetupRouter()
	err = r.Run(":" + port)
	if err != nil {
		fmt.Println("Server error:", err)
	}
}
