package services

import (
	"backend-learning-project/internal/models"
	"backend-learning-project/internal/repositories"
	"backend-learning-project/internal/utils"
	"errors"
)

// UserService 用户服务
type UserService struct {
	Repo *repositories.UserRepo
}

// NewUserService 创建用户服务
func NewUserService(repo *repositories.UserRepo) *UserService {
	return &UserService{Repo: repo}
}

// CreateUserRequest 创建用户请求
type CreateUserRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required,min=6"`
	Nickname string `json:"nickname"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Status   int    `json:"status"`
	DeptID   uint   `json:"dept_id"`
}

// UpdateUserRequest 更新用户请求
type UpdateUserRequest struct {
	Nickname string `json:"nickname"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Status   int    `json:"status"`
	DeptID   uint   `json:"dept_id"`
}

// Create 创建用户
func (s *UserService) Create(req CreateUserRequest) (*models.User, error) {
	// 检查用户名是否已存在
	_, err := s.Repo.FindByUsername(req.Username)
	if err == nil {
		return nil, errors.New("用户名已存在")
	}

	hash, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	user := models.User{
		Username: req.Username,
		Password: hash,
		Nickname: req.Nickname,
		Email:    req.Email,
		Phone:    req.Phone,
		Status:   req.Status,
		DeptID:   req.DeptID,
	}
	if user.Status == 0 {
		user.Status = 1
	}

	if err := s.Repo.Create(&user); err != nil {
		return nil, err
	}
	return s.Repo.FindByID(user.ID)
}

// Update 更新用户
func (s *UserService) Update(id uint, req UpdateUserRequest) (*models.User, error) {
	user, err := s.Repo.FindByID(id)
	if err != nil {
		return nil, errors.New("用户不存在")
	}

	user.Nickname = req.Nickname
	user.Email = req.Email
	user.Phone = req.Phone
	user.Status = req.Status
	user.DeptID = req.DeptID

	if err := s.Repo.Update(user); err != nil {
		return nil, err
	}
	return s.Repo.FindByID(id)
}

// Delete 删除用户
func (s *UserService) Delete(id uint) error {
	return s.Repo.Delete(id)
}

// GetByID 根据 ID 获取用户
func (s *UserService) GetByID(id uint) (*models.User, error) {
	return s.Repo.FindByID(id)
}

// List 用户列表
func (s *UserService) List(page, pageSize int, keyword string) ([]models.User, int64, error) {
	return s.Repo.List(page, pageSize, keyword)
}

// SetRoles 设置用户角色
func (s *UserService) SetRoles(userID uint, roleIDs []uint) error {
	_, err := s.Repo.FindByID(userID)
	if err != nil {
		return errors.New("用户不存在")
	}
	return s.Repo.SetRoles(userID, roleIDs)
}
