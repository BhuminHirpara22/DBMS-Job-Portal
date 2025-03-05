package main

import (
	"fmt"
	"os"

	"Backend/config"
	"Backend/internal/router"
)

func init() {
	config.Init()
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("\033[1;36m%s\033[0m \033[1;32m%s%s\033[0m\n", "Server running on:", "http://localhost:", port)

	r := router.SetupRouter()
	defer config.DB.Close()

	err := r.Run(":" + port)
	if err != nil {
		fmt.Println("Server error:", err)
	}
}
