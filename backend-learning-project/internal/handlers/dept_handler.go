package handlers

import (
	"backend-learning-project/internal/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// DeptHandler 部门处理器
type DeptHandler struct {
	Service *services.DeptService
}

// NewDeptHandler 创建部门处理器
func NewDeptHandler(service *services.DeptService) *DeptHandler {
	return &DeptHandler{Service: service}
}

// Create 创建部门
func (h *DeptHandler) Create(c *gin.Context) {
	var req services.CreateDeptRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "请求参数错误", "error": err.Error()})
		return
	}

	dept, err := h.Service.Create(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "创建成功", "data": dept})
}

// Update 更新部门
func (h *DeptHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "ID 参数错误"})
		return
	}

	var req services.UpdateDeptRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "请求参数错误", "error": err.Error()})
		return
	}

	dept, err := h.Service.Update(uint(id), req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "更新成功", "data": dept})
}

// Delete 删除部门
func (h *DeptHandler) Delete(c *gin.Context) {
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

// GetByID 根据 ID 获取部门
func (h *DeptHandler) GetByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "ID 参数错误"})
		return
	}

	dept, err := h.Service.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "success", "data": dept})
}

// List 部门列表
func (h *DeptHandler) List(c *gin.Context) {
	keyword := c.Query("keyword")
	depts, err := h.Service.List(keyword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "success",
		"data":    depts,
	})
}
