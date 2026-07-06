package repositories

import (
	"backend-learning-project/internal/models"

	"gorm.io/gorm"
)

// MenuRepo 菜单数据访问
type MenuRepo struct {
	DB *gorm.DB
}

// NewMenuRepo 创建菜单仓库
func NewMenuRepo(db *gorm.DB) *MenuRepo {
	return &MenuRepo{DB: db}
}

// Create 创建菜单
func (r *MenuRepo) Create(menu *models.Menu) error {
	return r.DB.Create(menu).Error
}

// Update 更新菜单
func (r *MenuRepo) Update(menu *models.Menu) error {
	return r.DB.Model(menu).Updates(menu).Error
}

// Delete 删除菜单
func (r *MenuRepo) Delete(id uint) error {
	return r.DB.Delete(&models.Menu{}, id).Error
}

// FindByID 根据 ID 查询
func (r *MenuRepo) FindByID(id uint) (*models.Menu, error) {
	var menu models.Menu
	err := r.DB.First(&menu, id).Error
	return &menu, err
}

// List 菜单列表
func (r *MenuRepo) List() ([]models.Menu, error) {
	var menus []models.Menu
	err := r.DB.Order("sort ASC, id ASC").Find(&menus).Error
	return menus, err
}

// FindByRoleIDs 根据角色 ID 查询菜单
func (r *MenuRepo) FindByRoleIDs(roleIDs []uint) ([]models.Menu, error) {
	var menus []models.Menu
	err := r.DB.Distinct("menus.*").
		Joins("JOIN role_menus ON role_menus.menu_id = menus.id").
		Where("role_menus.role_id IN ?", roleIDs).
		Order("menus.sort ASC, menus.id ASC").
		Find(&menus).Error
	return menus, err
}
