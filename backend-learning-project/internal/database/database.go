package database

import (
	"backend-learning-project/config"
	"backend-learning-project/internal/models"
	"fmt"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// DB 全局数据库实例
var DB *gorm.DB

// InitDB 初始化数据库连接
func InitDB(cfg *config.AppConfig) error {
	var err error
	DB, err = gorm.Open(sqlite.Open(cfg.DBPath), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return fmt.Errorf("连接数据库失败: %w", err)
	}

	// 自动迁移
	if err := autoMigrate(); err != nil {
		return fmt.Errorf("数据库迁移失败: %w", err)
	}

	// 初始化默认数据
	if err := seed(); err != nil {
		return fmt.Errorf("初始化默认数据失败: %w", err)
	}

	return nil
}

// autoMigrate 自动建表
func autoMigrate() error {
	return DB.AutoMigrate(
		&models.User{},
		&models.Role{},
		&models.Permission{},
		&models.Menu{},
		&models.Dept{},
		&models.UserRole{},
		&models.RolePermission{},
		&models.RoleMenu{},
	)
}

// seed 初始化默认数据
func seed() error {
	var count int64
	DB.Model(&models.User{}).Count(&count)
	if count > 0 {
		return nil
	}

	// 默认部门
	dept := models.Dept{Name: "总部", Sort: 0}
	if err := DB.Create(&dept).Error; err != nil {
		return err
	}

	// 默认角色：超级管理员
	adminRole := models.Role{Name: "超级管理员", Code: "super_admin", Sort: 0}
	if err := DB.Create(&adminRole).Error; err != nil {
		return err
	}

	// 默认权限
	perms := []models.Permission{
		{Name: "用户管理", Code: "user:manage", Type: "menu"},
		{Name: "用户查看", Code: "user:list", Type: "api", Path: "/api/users", Method: "GET"},
		{Name: "用户新增", Code: "user:create", Type: "api", Path: "/api/users", Method: "POST"},
		{Name: "用户修改", Code: "user:update", Type: "api", Path: "/api/users/:id", Method: "PUT"},
		{Name: "用户删除", Code: "user:delete", Type: "api", Path: "/api/users/:id", Method: "DELETE"},

		{Name: "角色管理", Code: "role:manage", Type: "menu"},
		{Name: "角色查看", Code: "role:list", Type: "api", Path: "/api/roles", Method: "GET"},
		{Name: "角色新增", Code: "role:create", Type: "api", Path: "/api/roles", Method: "POST"},
		{Name: "角色修改", Code: "role:update", Type: "api", Path: "/api/roles/:id", Method: "PUT"},
		{Name: "角色删除", Code: "role:delete", Type: "api", Path: "/api/roles/:id", Method: "DELETE"},

		{Name: "权限管理", Code: "permission:manage", Type: "menu"},
		{Name: "权限查看", Code: "permission:list", Type: "api", Path: "/api/permissions", Method: "GET"},
		{Name: "权限新增", Code: "permission:create", Type: "api", Path: "/api/permissions", Method: "POST"},
		{Name: "权限修改", Code: "permission:update", Type: "api", Path: "/api/permissions/:id", Method: "PUT"},
		{Name: "权限删除", Code: "permission:delete", Type: "api", Path: "/api/permissions/:id", Method: "DELETE"},

		{Name: "菜单管理", Code: "menu:manage", Type: "menu"},
		{Name: "菜单查看", Code: "menu:list", Type: "api", Path: "/api/menus", Method: "GET"},
		{Name: "菜单新增", Code: "menu:create", Type: "api", Path: "/api/menus", Method: "POST"},
		{Name: "菜单修改", Code: "menu:update", Type: "api", Path: "/api/menus/:id", Method: "PUT"},
		{Name: "菜单删除", Code: "menu:delete", Type: "api", Path: "/api/menus/:id", Method: "DELETE"},

		{Name: "部门管理", Code: "dept:manage", Type: "menu"},
		{Name: "部门查看", Code: "dept:list", Type: "api", Path: "/api/depts", Method: "GET"},
		{Name: "部门新增", Code: "dept:create", Type: "api", Path: "/api/depts", Method: "POST"},
		{Name: "部门修改", Code: "dept:update", Type: "api", Path: "/api/depts/:id", Method: "PUT"},
		{Name: "部门删除", Code: "dept:delete", Type: "api", Path: "/api/depts/:id", Method: "DELETE"},
	}
	if err := DB.Create(&perms).Error; err != nil {
		return err
	}

	// 为超级管理员分配所有权限
	var allPerms []models.Permission
	if err := DB.Find(&allPerms).Error; err != nil {
		return err
	}
	if err := DB.Model(&adminRole).Association("Permissions").Append(&allPerms); err != nil {
		return err
	}

	// 默认菜单
	menus := []models.Menu{
		{Name: "系统管理", Path: "/system", Component: "Layout", Icon: "Setting", Sort: 1},
		{Name: "用户管理", Path: "/system/users", Component: "system/user/index", Icon: "User", Sort: 2, ParentID: 1},
		{Name: "角色管理", Path: "/system/roles", Component: "system/role/index", Icon: "Role", Sort: 3, ParentID: 1},
		{Name: "权限管理", Path: "/system/permissions", Component: "system/permission/index", Icon: "Permission", Sort: 4, ParentID: 1},
		{Name: "菜单管理", Path: "/system/menus", Component: "system/menu/index", Icon: "Menu", Sort: 5, ParentID: 1},
		{Name: "部门管理", Path: "/system/depts", Component: "system/dept/index", Icon: "Dept", Sort: 6, ParentID: 1},
	}
	if err := DB.Create(&menus).Error; err != nil {
		return err
	}

	var allMenus []models.Menu
	if err := DB.Find(&allMenus).Error; err != nil {
		return err
	}
	if err := DB.Model(&adminRole).Association("Menus").Append(&allMenus); err != nil {
		return err
	}

	// 默认管理员用户 admin/123456
	adminUser := models.User{
		Username: "admin",
		Password: "$2a$10$NX7GAB0bApynRoLfufjDCusV5w8/KeA4N6llUm2U6quCIW3BUb60y", // 123456
		Nickname: "管理员",
		Email:    "admin@example.com",
		Status:   1,
		DeptID:   dept.ID,
	}
	if err := DB.Create(&adminUser).Error; err != nil {
		return err
	}
	if err := DB.Model(&adminUser).Association("Roles").Append(&adminRole); err != nil {
		return err
	}

	return nil
}
