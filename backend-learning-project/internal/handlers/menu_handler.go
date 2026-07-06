package handlers

import (
	"backend-learning-project/internal/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// MenuHandler 菜单处理器
type MenuHandler struct {
	Service *services.MenuService
}

// NewMenuHandler 创建菜单处理器
func NewMenuHandler(service *services.MenuService) *MenuHandler {
	return &MenuHandler{Service: service}
}

// Create 创建菜单
func (h *MenuHandler) Create(c *gin.Context) {
	var req services.CreateMenuRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "请求参数错误", "error": err.Error()})
		return
	}

	menu, err := h.Service.Create(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "创建成功", "data": menu})
}

// Update 更新菜单
func (h *MenuHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "ID 参数错误"})
		return
	}

	var req services.UpdateMenuRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "请求参数错误", "error": err.Error()})
		return
	}

	menu, err := h.Service.Update(uint(id), req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "更新成功", "data": menu})
}

// Delete 删除菜单
func (h *MenuHandler) Delete(c *gin.Context) {
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

// GetByID 根据 ID 获取菜单
func (h *MenuHandler) GetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "ID 参数错误"})
		return
	}

	menu, err := h.Service.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": menu})
}

// List 菜单列表
func (h *MenuHandler) List(c *gin.Context) {
	menus, err := h.Service.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "success",
		"data":    menus,
	})
}
