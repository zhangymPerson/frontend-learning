package repositories

import (
	"backend-learning-project/internal/models"

	"gorm.io/gorm"
)

// DeptRepo 部门数据访问
type DeptRepo struct {
	DB *gorm.DB
}

// NewDeptRepo 创建部门仓库
func NewDeptRepo(db *gorm.DB) *DeptRepo {
	return &DeptRepo{DB: db}
}

// Create 创建部门
func (r *DeptRepo) Create(dept *models.Dept) error {
	return r.DB.Create(dept).Error
}

// Update 更新部门
func (r *DeptRepo) Update(dept *models.Dept) error {
	return r.DB.Model(dept).Updates(dept).Error
}

// Delete 删除部门
func (r *DeptRepo) Delete(id uint) error {
	return r.DB.Delete(&models.Dept{}, id).Error
}

// FindByID 根据 ID 查询
func (r *DeptRepo) FindByID(id uint) (*models.Dept, error) {
	var dept models.Dept
	err := r.DB.First(&dept, id).Error
	return &dept, err
}

// List 部门列表
func (r *DeptRepo) List(keyword string) ([]models.Dept, error) {
	var depts []models.Dept
	query := r.DB.Model(&models.Dept{})
	if keyword != "" {
		query = query.Where("name LIKE ?", "%"+keyword+"%")
	}
	err := query.Order("sort ASC, id ASC").Find(&depts).Error
	return depts, err
}
