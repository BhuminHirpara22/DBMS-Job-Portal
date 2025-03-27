package controller

import (
	"Backend/internal/db"
	"Backend/internal/schema"
	"context"
	"fmt"
	"net/http"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

// CreateCompanyHandler handles the creation of a new company
func CreateCompanyHandler(c *gin.Context) {
	// Parse multipart form data
	if err := c.Request.ParseMultipartForm(10 << 20); err != nil { // 10 MB max
		fmt.Printf("Error parsing form: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Error parsing form data",
			"error":   err.Error(),
		})
		return
	}

	// Get form values
	companyName := c.PostForm("company_name")
	industry := c.PostForm("industry")
	website := c.PostForm("website")

	// Validate required fields
	if companyName == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Company name is required",
		})
		return
	}

	// Handle logo file upload
	var logoPath string
	file, err := c.FormFile("logo")
	if err == nil && file != nil {
		// Generate a unique filename
		filename := fmt.Sprintf("%s%s", companyName, filepath.Ext(file.Filename))

		// Save the file
		if err := c.SaveUploadedFile(file, "uploads/Logos/"+filename); err != nil {
			fmt.Printf("Error saving file: %v\n", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Error saving logo file",
				"error":   err.Error(),
			})
			return
		}
		logoPath = "uploads/" + filename
	}

	fmt.Printf("Received company data: name=%s, industry=%s, website=%s, logo=%s\n",
		companyName, industry, website, logoPath)

	// Create company struct
	company := schema.Company{
		CompanyName: companyName,
		Industry:    industry,
		Website:     website,
		Logo:        logoPath,
	}

	// Create the company
	result, err := db.CreateCompany(context.Background(), company)
	if err != nil {
		fmt.Printf("Error creating company: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Error creating company",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Company created successfully",
		"company": result,
	})
}

func GetCompanyHandler(c *gin.Context) {
	companies, err := db.GetCompanies(context.Background())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve companies"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"companies": companies})
}
