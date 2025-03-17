package helpers

import (
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

// Replace this with a secure key from an environment variable in production.
var secretKey = []byte("YourSecretKey")

// HashPassword uses bcrypt to hash the plain-text password.
func HashPassword(password string) (string, error) {
	// bcrypt.DefaultCost is typically 10, providing a good balance of security and performance.
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedBytes), nil
}

// CheckPassword compares the provided plain-text password with a stored bcrypt hash.
func CheckPassword(plainPassword, hashedPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(plainPassword))
	return err == nil
}

// JWTClaims defines the structure of the JWT payload.
type JWTClaims struct {
	UserID   int    `json:"user_id"`
	UserType string `json:"user_type"`
	jwt.RegisteredClaims
}

// GenerateJWT creates a JWT token containing the user’s ID and user type.
// It sets an expiration time (e.g., 24 hours) and signs the token using secretKey.
func GenerateJWT(userID int, userType string) (string, error) {
	// Set custom claims for the token.
	claims := &JWTClaims{
		UserID:   userID,
		UserType: userType,
		RegisteredClaims: jwt.RegisteredClaims{
			// Token expires after 24 hours (adjust as needed).
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			// 'Issuer' is optional but can help with debugging or identifying the issuer of the token.
			Issuer: "your-app-name",
		},
	}

	// Create a new token with the HS256 signing method and the claims defined above.
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token with the secret key.
	signedToken, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}

	return signedToken, nil
}

// -------------------------------------------------------------------
// OPTIONAL: If you want to validate and parse tokens, you can add:

// ValidateToken parses the token string, verifies it with secretKey,
// and returns the JWTClaims if valid.
func ValidateToken(tokenString string) (*JWTClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		// Ensure the signing method is HMAC (HS256).
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return secretKey, nil
	})

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*JWTClaims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token claims")
	}
	return claims, nil
}
