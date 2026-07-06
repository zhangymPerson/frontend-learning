package config

import (
	"time"
)

// AppConfig 应用配置
type AppConfig struct {
	Port       string
	DBPath     string
	JWTSecret  string
	JWTExpires time.Duration
}

// DefaultConfig 返回默认配置
func DefaultConfig() *AppConfig {
	return &AppConfig{
		Port:       ":8080",
		DBPath:     "app.db",
		JWTSecret:  "your-secret-key-change-in-production",
		JWTExpires: time.Hour * 24,
	}
}
