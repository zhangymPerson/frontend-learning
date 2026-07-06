package repositories

import (
	"backend-learning-project/internal/models"

	"gorm.io/gorm"
)

// PermissionRepo 权限数据访问
type PermissionRepo struct {
	DB *gorm.DB
}

// NewPermissionRepo 创建权限仓库
func NewPermissionRepo(db *gorm.DB) *PermissionRepo {
	return &PermissionRepo{DB: db}
}

// Create 创建权限
func (r *PermissionRepo) Create(perm *models.Permission) error {
	return r.DB.Create(perm).Error
}

// Update 更新权限
func (r *PermissionRepo) Update(perm *models.Permission) error {
	return r.DB.Model(perm).Updates(perm).Error
}

// Delete 删除权限
func (r *PermissionRepo) Delete(id uint) error {
	return r.DB.Delete(&models.Permission{}, id).Error
}

// FindByID 根据 ID 查询
func (r *PermissionRepo) FindByID(id uint) (*models.Permission, error) {
	var perm models.Permission
	err := r.DB.First(&perm, id).Error
	return &perm, err
}

// List 权限列表
func (r *PermissionRepo) List() ([]models.Permission, error) {
	var perms []models.Permission
	err := r.DB.Order("sort ASC, id ASC").Find(&perms).Error
	return perms, err
}

// FindByRoleIDs 根据角色 ID 查询权限
func (r *PermissionRepo) FindByRoleIDs(roleIDs []uint) ([]models.Permission, error) {
	var perms []models.Permission
	err := r.DB.Distinct("permissions.*").
		Joins("JOIN role_permissions ON role_permissions.permission_id = permissions.id").
		Where("role_permissions.role_id IN ?", roleIDs).
		Find(&perms).Error
	return perms, err
}

// FindByCode 根据编码查询权限
func (r *PermissionRepo) FindByCode(code string) (*models.Permission, error) {
	var perm models.Permission
	err := r.DB.Where("code = ?", code).First(&perm).Error
	return &perm, err
}
