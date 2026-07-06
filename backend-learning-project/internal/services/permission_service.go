package services

import (
	"backend-learning-project/internal/models"
	"backend-learning-project/internal/repositories"
	"errors"
)

// PermissionService 权限服务
type PermissionService struct {
	Repo *repositories.PermissionRepo
}

// NewPermissionService 创建权限服务
func NewPermissionService(repo *repositories.PermissionRepo) *PermissionService {
	return &PermissionService{Repo: repo}
}

// CreatePermissionRequest 创建权限请求
type CreatePermissionRequest struct {
	Name     string `json:"name" binding:"required"`
	Code     string `json:"code" binding:"required"`
	Type     string `json:"type"`
	ParentID uint   `json:"parent_id"`
	Path     string `json:"path"`
	Method   string `json:"method"`
	Sort     int    `json:"sort"`
	Status   int    `json:"status"`
}

// UpdatePermissionRequest 更新权限请求
type UpdatePermissionRequest struct {
	Name     string `json:"name"`
	Code     string `json:"code"`
	Type     string `json:"type"`
	ParentID uint   `json:"parent_id"`
	Path     string `json:"path"`
	Method   string `json:"method"`
	Sort     int    `json:"sort"`
	Status   int    `json:"status"`
}

// Create 创建权限
func (s *PermissionService) Create(req CreatePermissionRequest) (*models.Permission, error) {
	perm := models.Permission{
		Name:     req.Name,
		Code:     req.Code,
		Type:     req.Type,
		ParentID: req.ParentID,
		Path:     req.Path,
		Method:   req.Method,
		Sort:     req.Sort,
		Status:   req.Status,
	}
	if perm.Status == 0 {
		perm.Status = 1
	}
	if perm.Type == "" {
		perm.Type = "api"
	}
	if err := s.Repo.Create(&perm); err != nil {
		return nil, err
	}
	return &perm, nil
}

// Update 更新权限
func (s *PermissionService) Update(id uint, req UpdatePermissionRequest) (*models.Permission, error) {
	perm, err := s.Repo.FindByID(id)
	if err != nil {
		return nil, errors.New("权限不存在")
	}
	perm.Name = req.Name
	perm.Code = req.Code
	perm.Type = req.Type
	perm.ParentID = req.ParentID
	perm.Path = req.Path
	perm.Method = req.Method
	perm.Sort = req.Sort
	perm.Status = req.Status
	if err := s.Repo.Update(perm); err != nil {
		return nil, err
	}
	return s.Repo.FindByID(id)
}

// Delete 删除权限
func (s *PermissionService) Delete(id uint) error {
	return s.Repo.Delete(id)
}

// GetByID 根据 ID 获取权限
func (s *PermissionService) GetByID(id uint) (*models.Permission, error) {
	return s.Repo.FindByID(id)
}

// List 权限列表
func (s *PermissionService) List() ([]models.Permission, error) {
	return s.Repo.List()
}
