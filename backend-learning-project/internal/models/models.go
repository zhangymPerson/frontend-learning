package models

import (
	"gorm.io/gorm"
)

// User 用户模型
type User struct {
	gorm.Model
	Username string `json:"username" gorm:"uniqueIndex;not null;comment:用户名"`
	Password string `json:"-" gorm:"not null;comment:密码"`
	Nickname string `json:"nickname" gorm:"comment:昵称"`
	Email    string `json:"email" gorm:"comment:邮箱"`
	Phone    string `json:"phone" gorm:"comment:手机号"`
	Status   int    `json:"status" gorm:"default:1;comment:状态 1启用 0禁用"`
	DeptID   uint   `json:"dept_id" gorm:"comment:部门ID"`
	Dept     Dept   `json:"dept,omitempty" gorm:"foreignKey:DeptID"`
	Roles    []Role `json:"roles,omitempty" gorm:"many2many:user_roles;"`
}

// Role 角色模型
type Role struct {
	gorm.Model
	Name        string       `json:"name" gorm:"not null;comment:角色名称"`
	Code        string       `json:"code" gorm:"uniqueIndex;not null;comment:角色编码"`
	Sort        int          `json:"sort" gorm:"default:0;comment:排序"`
	Status      int          `json:"status" gorm:"default:1;comment:状态 1启用 0禁用"`
	Users       []User       `json:"users,omitempty" gorm:"many2many:user_roles;"`
	Permissions []Permission `json:"permissions,omitempty" gorm:"many2many:role_permissions;"`
	Menus       []Menu       `json:"menus,omitempty" gorm:"many2many:role_menus;"`
}

// Permission 权限模型（接口权限）
type Permission struct {
	gorm.Model
	Name     string `json:"name" gorm:"not null;comment:权限名称"`
	Code     string `json:"code" gorm:"uniqueIndex;not null;comment:权限编码"`
	Type     string `json:"type" gorm:"comment:类型 menu/button/api"`
	ParentID uint   `json:"parent_id" gorm:"comment:父级ID"`
	Path     string `json:"path" gorm:"comment:请求路径"`
	Method   string `json:"method" gorm:"comment:请求方法 GET/POST/PUT/DELETE"`
	Sort     int    `json:"sort" gorm:"default:0;comment:排序"`
	Status   int    `json:"status" gorm:"default:1;comment:状态"`
	Roles    []Role `json:"roles,omitempty" gorm:"many2many:role_permissions;"`
}

// Menu 菜单模型（前端菜单）
type Menu struct {
	gorm.Model
	Name      string `json:"name" gorm:"not null;comment:菜单名称"`
	Path      string `json:"path" gorm:"comment:路由路径"`
	Component string `json:"component" gorm:"comment:组件路径"`
	Icon      string `json:"icon" gorm:"comment:图标"`
	Sort      int    `json:"sort" gorm:"default:0;comment:排序"`
	ParentID  uint   `json:"parent_id" gorm:"comment:父级ID"`
	Status    int    `json:"status" gorm:"default:1;comment:状态"`
	Roles     []Role `json:"roles,omitempty" gorm:"many2many:role_menus;"`
}

// Dept 部门模型
type Dept struct {
	gorm.Model
	Name     string `json:"name" gorm:"not null;comment:部门名称"`
	ParentID uint   `json:"parent_id" gorm:"comment:父级ID"`
	Sort     int    `json:"sort" gorm:"default:0;comment:排序"`
	Status   int    `json:"status" gorm:"default:1;comment:状态"`
}

// UserRole 用户角色关联
type UserRole struct {
	UserID uint `gorm:"primaryKey"`
	RoleID uint `gorm:"primaryKey"`
}

// RolePermission 角色权限关联
type RolePermission struct {
	RoleID       uint `gorm:"primaryKey"`
	PermissionID uint `gorm:"primaryKey"`
}

// RoleMenu 角色菜单关联
type RoleMenu struct {
	RoleID uint `gorm:"primaryKey"`
	MenuID uint `gorm:"primaryKey"`
}

// TableName 自定义用户角色表名
func (UserRole) TableName() string {
	return "user_roles"
}

// TableName 自定义角色权限表名
func (RolePermission) TableName() string {
	return "role_permissions"
}

// TableName 自定义角色菜单表名
func (RoleMenu) TableName() string {
	return "role_menus"
}
