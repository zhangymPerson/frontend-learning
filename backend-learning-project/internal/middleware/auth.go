package middleware

import (
	"backend-learning-project/config"
	"backend-learning-project/internal/database"
	"backend-learning-project/internal/models"
	"backend-learning-project/internal/repositories"
	"backend-learning-project/internal/utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware JWT 认证中间件
func AuthMiddleware(cfg *config.AppConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "缺少 Authorization 头"})
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "Authorization 格式错误"})
			c.Abort()
			return
		}

		claims, err := utils.ParseToken(parts[1], cfg)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "Token 无效或已过期"})
			c.Abort()
			return
		}

		c.Set("claims", claims)
		c.Next()
	}
}

// RBACMiddleware 基于权限编码的鉴权中间件
func RBACMiddleware(requiredCode string) gin.HandlerFunc {
	return func(c *gin.Context) {
		claims, exists := c.Get("claims")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "未登录"})
			c.Abort()
			return
		}

		userClaims := claims.(*utils.Claims)
		roleIDs := userClaims.RoleIDs

		// 超级管理员直接放行
		roleRepo := repositories.NewRoleRepo(database.DB)
		roles, err := roleRepo.FindByIDs(roleIDs)
		if err == nil {
			for _, role := range roles {
				if role.Code == "super_admin" {
					c.Next()
					return
				}
			}
		}

		// 查询用户拥有的所有权限编码
		permRepo := repositories.NewPermissionRepo(database.DB)
		perms, err := permRepo.FindByRoleIDs(roleIDs)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "权限查询失败"})
			c.Abort()
			return
		}

		for _, perm := range perms {
			if perm.Code == requiredCode {
				c.Next()
				return
			}
		}

		c.JSON(http.StatusForbidden, gin.H{"code": 403, "message": "没有权限: " + requiredCode})
		c.Abort()
	}
}

// GetCurrentUserID 获取当前用户 ID
func GetCurrentUserID(c *gin.Context) uint {
	claims, exists := c.Get("claims")
	if !exists {
		return 0
	}
	return claims.(*utils.Claims).UserID
}

// GetCurrentUser 获取当前用户
func GetCurrentUser(c *gin.Context) (*models.User, error) {
	userID := GetCurrentUserID(c)
	if userID == 0 {
		return nil, nil
	}
	userRepo := repositories.NewUserRepo(database.DB)
	return userRepo.FindByID(userID)
}
