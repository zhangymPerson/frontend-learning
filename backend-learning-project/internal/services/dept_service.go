package services

import (
	"backend-learning-project/internal/models"
	"backend-learning-project/internal/repositories"
	"errors"
)

// DeptService 部门服务
type DeptService struct {
	Repo *repositories.DeptRepo
}

// NewDeptService 创建部门服务
func NewDeptService(repo *repositories.DeptRepo) *DeptService {
	return &DeptService{Repo: repo}
}

// CreateDeptRequest 创建部门请求
type CreateDeptRequest struct {
	Name     string `json:"name" binding:"required"`
	ParentID uint   `json:"parent_id"`
	Sort     int    `json:"sort"`
	Status   int    `json:"status"`
}

// UpdateDeptRequest 更新部门请求
type UpdateDeptRequest struct {
	Name     string `json:"name"`
	ParentID uint   `json:"parent_id"`
	Sort     int    `json:"sort"`
	Status   int    `json:"status"`
}

// Create 创建部门
func (s *DeptService) Create(req CreateDeptRequest) (*models.Dept, error) {
	dept := models.Dept{
		Name:     req.Name,
		ParentID: req.ParentID,
		Sort:     req.Sort,
		Status:   req.Status,
	}
	if dept.Status == 0 {
		dept.Status = 1
	}
	if err := s.Repo.Create(&dept); err != nil {
		return nil, err
	}
	return &dept, nil
}

// Update 更新部门
func (s *DeptService) Update(id uint, req UpdateDeptRequest) (*models.Dept, error) {
	dept, err := s.Repo.FindByID(id)
	if err != nil {
		return nil, errors.New("部门不存在")
	}
	dept.Name = req.Name
	dept.ParentID = req.ParentID
	dept.Sort = req.Sort
	dept.Status = req.Status
	if err := s.Repo.Update(dept); err != nil {
		return nil, err
	}
	return s.Repo.FindByID(id)
}

// Delete 删除部门
func (s *DeptService) Delete(id uint) error {
	return s.Repo.Delete(id)
}

// GetByID 根据 ID 获取部门
func (s *DeptService) GetByID(id uint) (*models.Dept, error) {
	return s.Repo.FindByID(id)
}

// List 部门列表
func (s *DeptService) List(keyword string) ([]models.Dept, error) {
	return s.Repo.List(keyword)
}
