package handlers

import (
	"backend-learning-project/config"
	"backend-learning-project/internal/services"
	"backend-learning-project/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

// AuthHandler 认证处理器
type AuthHandler struct {
	Service *services.AuthService
	Cfg     *config.AppConfig
}

// NewAuthHandler 创建认证处理器
func NewAuthHandler(service *services.AuthService, cfg *config.AppConfig) *AuthHandler {
	return &AuthHandler{Service: service, Cfg: cfg}
}

// Login 登录
func (h *AuthHandler) Login(c *gin.Context) {
	var req services.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "请求参数错误", "error": err.Error()})
		return
	}

	resp, err := h.Service.Login(req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "登录成功", "data": resp})
}

// Me 获取当前用户信息
func (h *AuthHandler) Me(c *gin.Context) {
	claims, exists := c.Get("claims")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "未登录"})
		return
	}
	userClaims := claims.(*utils.Claims)

	user, perms, err := h.Service.GetCurrentUser(userClaims.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": gin.H{
		"user":        user,
		"permissions": perms,
	}})
}
