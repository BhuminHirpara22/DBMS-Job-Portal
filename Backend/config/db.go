package config

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

// ConnectPSQL initializes the PostgreSQL connection
func ConnectPSQL() {
	connURL := os.Getenv("DB_URL")
	if connURL == "" {
		fmt.Println("DB_URL is not set!")
		os.Exit(1)
	}

	fmt.Println("Connecting to DB:", connURL)

	var err error
	DB, err = pgxpool.New(context.Background(), connURL)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Connected to the PostgreSQL database!")
}

// GetDB returns the database connection
func GetDB() *pgxpool.Pool {
	if DB == nil {
		fmt.Println("Database connection is not initialized")
		os.Exit(1)
	}
	return DB
}

// CloseDB closes the database connection
func CloseDB() {
	if DB != nil {
		DB.Close()
		fmt.Println("Database connection closed.")
	}
}
