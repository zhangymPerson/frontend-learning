package services

import (
	"backend-learning-project/config"
	"backend-learning-project/internal/models"
	"backend-learning-project/internal/repositories"
	"backend-learning-project/internal/utils"
	"errors"
)

// AuthService 认证服务
type AuthService struct {
	UserRepo *repositories.UserRepo
	RoleRepo *repositories.RoleRepo
	Cfg      *config.AppConfig
}

// NewAuthService 创建认证服务
func NewAuthService(userRepo *repositories.UserRepo, roleRepo *repositories.RoleRepo, cfg *config.AppConfig) *AuthService {
	return &AuthService{UserRepo: userRepo, RoleRepo: roleRepo, Cfg: cfg}
}

// LoginRequest 登录请求
type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// LoginResponse 登录响应
type LoginResponse struct {
	Token string        `json:"token"`
	User  models.User   `json:"user"`
	Menus []models.Menu `json:"menus"`
}

// Login 用户登录
func (s *AuthService) Login(req LoginRequest) (*LoginResponse, error) {
	user, err := s.UserRepo.FindByUsername(req.Username)
	if err != nil {
		return nil, errors.New("用户名或密码错误")
	}

	if user.Status != 1 {
		return nil, errors.New("账号已被禁用")
	}

	if !utils.CheckPassword(req.Password, user.Password) {
		return nil, errors.New("用户名或密码错误")
	}

	// 加载角色
	loadedUser, err := s.UserRepo.FindByID(user.ID)
	if err != nil {
		return nil, err
	}

	roleIDs := make([]uint, 0, len(loadedUser.Roles))
	for _, role := range loadedUser.Roles {
		roleIDs = append(roleIDs, role.ID)
	}

	token, err := utils.GenerateToken(user.ID, user.Username, roleIDs, s.Cfg)
	if err != nil {
		return nil, err
	}

	// 获取菜单
	var menus []models.Menu
	if len(roleIDs) > 0 {
		menuRepo := repositories.NewMenuRepo(s.UserRepo.DB)
		menus, _ = menuRepo.FindByRoleIDs(roleIDs)
	}

	return &LoginResponse{
		Token: token,
		User:  *loadedUser,
		Menus: menus,
	}, nil
}

// GetCurrentUser 获取当前用户信息
func (s *AuthService) GetCurrentUser(userID uint) (*models.User, []models.Permission, error) {
	user, err := s.UserRepo.FindByID(userID)
	if err != nil {
		return nil, nil, err
	}

	roleIDs := make([]uint, 0, len(user.Roles))
	for _, role := range user.Roles {
		roleIDs = append(roleIDs, role.ID)
	}

	var perms []models.Permission
	if len(roleIDs) > 0 {
		permRepo := repositories.NewPermissionRepo(s.UserRepo.DB)
		perms, _ = permRepo.FindByRoleIDs(roleIDs)
	}

	return user, perms, nil
}
