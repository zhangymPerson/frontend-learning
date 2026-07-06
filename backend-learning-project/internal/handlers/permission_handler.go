package handlers

import (
	"backend-learning-project/internal/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// PermissionHandler 权限处理器
type PermissionHandler struct {
	Service *services.PermissionService
}

// NewPermissionHandler 创建权限处理器
func NewPermissionHandler(service *services.PermissionService) *PermissionHandler {
	return &PermissionHandler{Service: service}
}

// Create 创建权限
func (h *PermissionHandler) Create(c *gin.Context) {
	var req services.CreatePermissionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "请求参数错误", "error": err.Error()})
		return
	}

	perm, err := h.Service.Create(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "创建成功", "data": perm})
}

// Update 更新权限
func (h *PermissionHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "ID 参数错误"})
		return
	}

	var req services.UpdatePermissionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "请求参数错误", "error": err.Error()})
		return
	}

	perm, err := h.Service.Update(uint(id), req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "更新成功", "data": perm})
}

// Delete 删除权限
func (h *PermissionHandler) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "ID 参数错误"})
		return
	}

	if err := h.Service.Delete(uint(id)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "删除成功"})
}

// GetByID 根据 ID 获取权限
func (h *PermissionHandler) GetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "ID 参数错误"})
		return
	}

	perm, err := h.Service.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": perm})
}

// List 权限列表
func (h *PermissionHandler) List(c *gin.Context) {
	perms, err := h.Service.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "success",
		"data":    perms,
	})
}
