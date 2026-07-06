package services

import (
	"backend-learning-project/internal/models"
	"backend-learning-project/internal/repositories"
	"errors"
)

// RoleService 角色服务
type RoleService struct {
	Repo *repositories.RoleRepo
}

// NewRoleService 创建角色服务
func NewRoleService(repo *repositories.RoleRepo) *RoleService {
	return &RoleService{Repo: repo}
}

// CreateRoleRequest 创建角色请求
type CreateRoleRequest struct {
	Name   string `json:"name" binding:"required"`
	Code   string `json:"code" binding:"required"`
	Sort   int    `json:"sort"`
	Status int    `json:"status"`
}

// UpdateRoleRequest 更新角色请求
type UpdateRoleRequest struct {
	Name   string `json:"name"`
	Code   string `json:"code"`
	Sort   int    `json:"sort"`
	Status int    `json:"status"`
}

// Create 创建角色
func (s *RoleService) Create(req CreateRoleRequest) (*models.Role, error) {
	role := models.Role{
		Name:   req.Name,
		Code:   req.Code,
		Sort:   req.Sort,
		Status: req.Status,
	}
	if role.Status == 0 {
		role.Status = 1
	}
	if err := s.Repo.Create(&role); err != nil {
		return nil, err
	}
	return &role, nil
}

// Update 更新角色
func (s *RoleService) Update(id uint, req UpdateRoleRequest) (*models.Role, error) {
	role, err := s.Repo.FindByID(id)
	if err != nil {
		return nil, errors.New("角色不存在")
	}
	role.Name = req.Name
	role.Code = req.Code
	role.Sort = req.Sort
	role.Status = req.Status
	if err := s.Repo.Update(role); err != nil {
		return nil, err
	}
	return s.Repo.FindByID(id)
}

// Delete 删除角色
func (s *RoleService) Delete(id uint) error {
	return s.Repo.Delete(id)
}

// GetByID 根据 ID 获取角色
func (s *RoleService) GetByID(id uint) (*models.Role, error) {
	return s.Repo.FindByID(id)
}

// List 角色列表
func (s *RoleService) List(page, pageSize int, keyword string) ([]models.Role, int64, error) {
	return s.Repo.List(page, pageSize, keyword)
}

// SetPermissions 设置角色权限
func (s *RoleService) SetPermissions(roleID uint, permIDs []uint) error {
	_, err := s.Repo.FindByID(roleID)
	if err != nil {
		return errors.New("角色不存在")
	}
	return s.Repo.SetPermissions(roleID, permIDs)
}

// SetMenus 设置角色菜单
func (s *RoleService) SetMenus(roleID uint, menuIDs []uint) error {
	_, err := s.Repo.FindByID(roleID)
	if err != nil {
		return errors.New("角色不存在")
	}
	return s.Repo.SetMenus(roleID, menuIDs)
}
