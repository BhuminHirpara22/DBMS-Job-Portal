package db

import (
	"Backend/config"
	"Backend/internal/schema"
	"context"
	"fmt"
)

func GenerateCompanyID(ctx context.Context) (int, error) {
	var newID int
	query := `SELECT generate_company_id()` // Replace with actual stored procedure name
	err := config.DB.QueryRow(ctx, query).Scan(&newID)
	if err != nil {
		return 0, err
	}
	return newID, nil
}

func CreateCompany(ctx context.Context, company schema.Company) (schema.Company, error) {
	fmt.Printf("Creating company: %+v\n", company)

	query := `
		INSERT INTO company (company_name, industry, website, logo) 
		VALUES ($1, $2, $3, $4) 
		RETURNING id, company_name, industry, website, logo
	`

	var result schema.Company
	err := config.DB.QueryRow(ctx, query,
		company.CompanyName,
		company.Industry,
		company.Website,
		company.Logo,
	).Scan(
		&result.ID,
		&result.CompanyName,
		&result.Industry,
		&result.Website,
		&result.Logo,
	)

	if err != nil {
		fmt.Printf("Error creating company: %v\n", err)
		return schema.Company{}, fmt.Errorf("error creating company: %v", err)
	}

	fmt.Printf("Successfully created company with ID: %d\n", result.ID)
	return result, nil
}

func GetCompanies(ctx context.Context) ([]schema.Company, error) {
	query := `
		SELECT id, company_name, industry, website, logo
		FROM company
		ORDER BY company_name
	`

	rows, err := config.DB.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("error querying companies: %v", err)
	}
	defer rows.Close()

	var companies []schema.Company
	for rows.Next() {
		var company schema.Company
		err := rows.Scan(
			&company.ID,
			&company.CompanyName,
			&company.Industry,
			&company.Website,
			&company.Logo,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning company row: %v", err)
		}
		companies = append(companies, company)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating company rows: %v", err)
	}

	return companies, nil
}
