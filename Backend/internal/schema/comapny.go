package schema

type Company struct {
	ID               int    `json:"id"`
	CompanyName      string    `json:"company_name"`
	Industry     	 string    `json:"industry"`
	Website  		 string `json:"website"`
	Descrption       string `json:"description"`
	Logo      		 string `json:"logo"`
}