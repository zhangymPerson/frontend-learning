package handlers

import (
	"backend-learning-project/internal/version"
	"net/http"

	"github.com/gin-gonic/gin"
)

// VersionHandler 版本信息处理器
type VersionHandler struct{}

// NewVersionHandler 创建版本信息处理器
func NewVersionHandler() *VersionHandler {
	return &VersionHandler{}
}

// GetVersion 返回接口版本信息（无需鉴权）
func (h *VersionHandler) GetVersion(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "success",
		"data":    version.GetInfo(),
	})
}
