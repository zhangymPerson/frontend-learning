package repositories

import (
	"backend-learning-project/internal/models"

	"gorm.io/gorm"
)

// UserRepo 用户数据访问
type UserRepo struct {
	DB *gorm.DB
}

// NewUserRepo 创建用户仓库
func NewUserRepo(db *gorm.DB) *UserRepo {
	return &UserRepo{DB: db}
}

// Create 创建用户
func (r *UserRepo) Create(user *models.User) error {
	return r.DB.Create(user).Error
}

// Update 更新用户
func (r *UserRepo) Update(user *models.User) error {
	return r.DB.Model(user).Updates(user).Error
}

// Delete 删除用户
func (r *UserRepo) Delete(id uint) error {
	return r.DB.Delete(&models.User{}, id).Error
}

// FindByID 根据 ID 查询
func (r *UserRepo) FindByID(id uint) (*models.User, error) {
	var user models.User
	err := r.DB.Preload("Dept").Preload("Roles").First(&user, id).Error
	return &user, err
}

// FindByUsername 根据用户名查询
func (r *UserRepo) FindByUsername(username string) (*models.User, error) {
	var user models.User
	err := r.DB.Where("username = ?", username).First(&user).Error
	return &user, err
}

// List 用户列表
func (r *UserRepo) List(page, pageSize int, keyword string) ([]models.User, int64, error) {
	var users []models.User
	var total int64

	query := r.DB.Model(&models.User{}).Preload("Dept").Preload("Roles")
	if keyword != "" {
		query = query.Where("username LIKE ? OR nickname LIKE ?", "%"+keyword+"%", "%"+keyword+"%")
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if page > 0 && pageSize > 0 {
		offset := (page - 1) * pageSize
		query = query.Offset(offset).Limit(pageSize)
	}

	err := query.Order("id DESC").Find(&users).Error
	return users, total, err
}

// SetRoles 设置用户角色
func (r *UserRepo) SetRoles(userID uint, roleIDs []uint) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		var user models.User
		if err := tx.First(&user, userID).Error; err != nil {
			return err
		}
		var roles []models.Role
		if err := tx.Where("id IN ?", roleIDs).Find(&roles).Error; err != nil {
			return err
		}
		return tx.Model(&user).Association("Roles").Replace(roles)
	})
}
