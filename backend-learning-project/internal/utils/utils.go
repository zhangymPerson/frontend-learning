package utils

import (
	"backend-learning-project/config"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// HashPassword 密码加密
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

// CheckPassword 校验密码
func CheckPassword(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// Claims JWT 声明
type Claims struct {
	UserID   uint   `json:"user_id"`
	Username string `json:"username"`
	RoleIDs  []uint `json:"role_ids"`
	jwt.RegisteredClaims
}

// GenerateToken 生成 JWT
func GenerateToken(userID uint, username string, roleIDs []uint, cfg *config.AppConfig) (string, error) {
	claims := Claims{
		UserID:   userID,
		Username: username,
		RoleIDs:  roleIDs,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(cfg.JWTExpires)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "backend-learning-project",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(cfg.JWTSecret))
}

// ParseToken 解析 JWT
func ParseToken(tokenString string, cfg *config.AppConfig) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(cfg.JWTSecret), nil
	})
	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}
	return nil, errors.New("invalid token")
}
