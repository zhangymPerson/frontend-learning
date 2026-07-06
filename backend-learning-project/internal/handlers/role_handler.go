package handlers

import (
	"backend-learning-project/internal/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// RoleHandler 角色处理器
type RoleHandler struct {
	Service *services.RoleService
}

// NewRoleHandler 创建角色处理器
func NewRoleHandler(service *services.RoleService) *RoleHandler {
	return &RoleHandler{Service: service}
}

// Create 创建角色
func (h *RoleHandler) Create(c *gin.Context) {
	var req services.CreateRoleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "请求参数错误", "error": err.Error()})
		return
	}

	role, err := h.Service.Create(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "创建成功", "data": role})
}

// Update 更新角色
func (h *RoleHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "ID 参数错误"})
		return
	}

	var req services.UpdateRoleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "请求参数错误", "error": err.Error()})
		return
	}

	role, err := h.Service.Update(uint(id), req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "更新成功", "data": role})
}

// Delete 删除角色
func (h *RoleHandler) Delete(c *gin.Context) {
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

// GetByID 根据 ID 获取角色
func (h *RoleHandler) GetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "ID 参数错误"})
		return
	}

	role, err := h.Service.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": role})
}

// List 角色列表
func (h *RoleHandler) List(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	keyword := c.Query("keyword")

	roles, total, err := h.Service.List(page, pageSize, keyword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "success",
		"data": gin.H{
			"list":      roles,
			"total":     total,
			"page":      page,
			"page_size": pageSize,
		},
	})
}

// SetPermissions 设置角色权限
func (h *RoleHandler) SetPermissions(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "ID 参数错误"})
		return
	}

	var req struct {
		PermissionIDs []uint `json:"permission_ids" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "请求参数错误", "error": err.Error()})
		return
	}

	if err := h.Service.SetPermissions(uint(id), req.PermissionIDs); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "设置成功"})
}

// SetMenus 设置角色菜单
func (h *RoleHandler) SetMenus(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "ID 参数错误"})
		return
	}

	var req struct {
		MenuIDs []uint `json:"menu_ids" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "请求参数错误", "error": err.Error()})
		return
	}

	if err := h.Service.SetMenus(uint(id), req.MenuIDs); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "设置成功"})
}
