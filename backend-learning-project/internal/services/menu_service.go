package services

import (
	"backend-learning-project/internal/models"
	"backend-learning-project/internal/repositories"
	"errors"
)

// MenuService 菜单服务
type MenuService struct {
	Repo *repositories.MenuRepo
}

// NewMenuService 创建菜单服务
func NewMenuService(repo *repositories.MenuRepo) *MenuService {
	return &MenuService{Repo: repo}
}

// CreateMenuRequest 创建菜单请求
type CreateMenuRequest struct {
	Name      string `json:"name" binding:"required"`
	Path      string `json:"path"`
	Component string `json:"component"`
	Icon      string `json:"icon"`
	Sort      int    `json:"sort"`
	ParentID  uint   `json:"parent_id"`
	Status    int    `json:"status"`
}

// UpdateMenuRequest 更新菜单请求
type UpdateMenuRequest struct {
	Name      string `json:"name"`
	Path      string `json:"path"`
	Component string `json:"component"`
	Icon      string `json:"icon"`
	Sort      int    `json:"sort"`
	ParentID  uint   `json:"parent_id"`
	Status    int    `json:"status"`
}

// Create 创建菜单
func (s *MenuService) Create(req CreateMenuRequest) (*models.Menu, error) {
	menu := models.Menu{
		Name:      req.Name,
		Path:      req.Path,
		Component: req.Component,
		Icon:      req.Icon,
		Sort:      req.Sort,
		ParentID:  req.ParentID,
		Status:    req.Status,
	}
	if menu.Status == 0 {
		menu.Status = 1
	}
	if err := s.Repo.Create(&menu); err != nil {
		return nil, err
	}
	return &menu, nil
}

// Update 更新菜单
func (s *MenuService) Update(id uint, req UpdateMenuRequest) (*models.Menu, error) {
	menu, err := s.Repo.FindByID(id)
	if err != nil {
		return nil, errors.New("菜单不存在")
	}
	menu.Name = req.Name
	menu.Path = req.Path
	menu.Component = req.Component
	menu.Icon = req.Icon
	menu.Sort = req.Sort
	menu.ParentID = req.ParentID
	menu.Status = req.Status
	if err := s.Repo.Update(menu); err != nil {
		return nil, err
	}
	return s.Repo.FindByID(id)
}

// Delete 删除菜单
func (s *MenuService) Delete(id uint) error {
	return s.Repo.Delete(id)
}

// GetByID 根据 ID 获取菜单
func (s *MenuService) GetByID(id uint) (*models.Menu, error) {
	return s.Repo.FindByID(id)
}

// List 菜单列表
func (s *MenuService) List() ([]models.Menu, error) {
	return s.Repo.List()
}
