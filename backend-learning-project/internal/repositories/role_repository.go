package repositories

import (
	"backend-learning-project/internal/models"

	"gorm.io/gorm"
)

// RoleRepo 角色数据访问
type RoleRepo struct {
	DB *gorm.DB
}

// NewRoleRepo 创建角色仓库
func NewRoleRepo(db *gorm.DB) *RoleRepo {
	return &RoleRepo{DB: db}
}

// Create 创建角色
func (r *RoleRepo) Create(role *models.Role) error {
	return r.DB.Create(role).Error
}

// Update 更新角色
func (r *RoleRepo) Update(role *models.Role) error {
	return r.DB.Model(role).Updates(role).Error
}

// Delete 删除角色
func (r *RoleRepo) Delete(id uint) error {
	return r.DB.Delete(&models.Role{}, id).Error
}

// FindByID 根据 ID 查询
func (r *RoleRepo) FindByID(id uint) (*models.Role, error) {
	var role models.Role
	err := r.DB.Preload("Permissions").Preload("Menus").First(&role, id).Error
	return &role, err
}

// List 角色列表
func (r *RoleRepo) List(page, pageSize int, keyword string) ([]models.Role, int64, error) {
	var roles []models.Role
	var total int64

	query := r.DB.Model(&models.Role{})
	if keyword != "" {
		query = query.Where("name LIKE ? OR code LIKE ?", "%"+keyword+"%", "%"+keyword+"%")
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if page > 0 && pageSize > 0 {
		offset := (page - 1) * pageSize
		query = query.Offset(offset).Limit(pageSize)
	}

	err := query.Order("sort ASC, id DESC").Find(&roles).Error
	return roles, total, err
}

// SetPermissions 设置角色权限
func (r *RoleRepo) SetPermissions(roleID uint, permIDs []uint) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		var role models.Role
		if err := tx.First(&role, roleID).Error; err != nil {
			return err
		}
		var perms []models.Permission
		if err := tx.Where("id IN ?", permIDs).Find(&perms).Error; err != nil {
			return err
		}
		return tx.Model(&role).Association("Permissions").Replace(perms)
	})
}

// SetMenus 设置角色菜单
func (r *RoleRepo) SetMenus(roleID uint, menuIDs []uint) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		var role models.Role
		if err := tx.First(&role, roleID).Error; err != nil {
			return err
		}
		var menus []models.Menu
		if err := tx.Where("id IN ?", menuIDs).Find(&menus).Error; err != nil {
			return err
		}
		return tx.Model(&role).Association("Menus").Replace(menus)
	})
}

// FindByIDs 批量查询角色
func (r *RoleRepo) FindByIDs(ids []uint) ([]models.Role, error) {
	var roles []models.Role
	err := r.DB.Where("id IN ?", ids).Find(&roles).Error
	return roles, err
}

// FindByCodes 根据编码查询角色
func (r *RoleRepo) FindByCodes(codes []string) ([]models.Role, error) {
	var roles []models.Role
	err := r.DB.Where("code IN ?", codes).Find(&roles).Error
	return roles, err
}
