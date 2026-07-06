package routes

import (
	"backend-learning-project/config"
	"backend-learning-project/internal/database"
	"backend-learning-project/internal/handlers"
	"backend-learning-project/internal/middleware"
	"backend-learning-project/internal/repositories"
	"backend-learning-project/internal/services"

	"github.com/gin-gonic/gin"
)

// SetupRoutes 注册所有路由
func SetupRoutes(r *gin.Engine, cfg *config.AppConfig) {
	db := database.DB

	// 仓库实例
	userRepo := repositories.NewUserRepo(db)
	roleRepo := repositories.NewRoleRepo(db)
	permRepo := repositories.NewPermissionRepo(db)
	menuRepo := repositories.NewMenuRepo(db)
	deptRepo := repositories.NewDeptRepo(db)

	// 服务实例
	authService := services.NewAuthService(userRepo, roleRepo, cfg)
	userService := services.NewUserService(userRepo)
	roleService := services.NewRoleService(roleRepo)
	permService := services.NewPermissionService(permRepo)
	menuService := services.NewMenuService(menuRepo)
	deptService := services.NewDeptService(deptRepo)

	// 处理器实例
	authHandler := handlers.NewAuthHandler(authService, cfg)
	versionHandler := handlers.NewVersionHandler()
	userHandler := handlers.NewUserHandler(userService)
	roleHandler := handlers.NewRoleHandler(roleService)
	permHandler := handlers.NewPermissionHandler(permService)
	menuHandler := handlers.NewMenuHandler(menuService)
	deptHandler := handlers.NewDeptHandler(deptService)

	// 公开路由
	api := r.Group("/api")
	{
		api.POST("/login", authHandler.Login)
		api.GET("/version", versionHandler.GetVersion)
	}

	// 需要认证的路由
	authorized := api.Group("")
	authorized.Use(middleware.AuthMiddleware(cfg))
	{
		// 当前用户
		authorized.GET("/me", authHandler.Me)

		// 用户管理
		authorized.GET("/users", middleware.RBACMiddleware("user:list"), userHandler.List)
		authorized.POST("/users", middleware.RBACMiddleware("user:create"), userHandler.Create)
		authorized.GET("/users/:id", middleware.RBACMiddleware("user:list"), userHandler.GetByID)
		authorized.PUT("/users/:id", middleware.RBACMiddleware("user:update"), userHandler.Update)
		authorized.DELETE("/users/:id", middleware.RBACMiddleware("user:delete"), userHandler.Delete)
		authorized.POST("/users/:id/roles", middleware.RBACMiddleware("user:update"), userHandler.SetRoles)

		// 角色管理
		authorized.GET("/roles", middleware.RBACMiddleware("role:list"), roleHandler.List)
		authorized.POST("/roles", middleware.RBACMiddleware("role:create"), roleHandler.Create)
		authorized.GET("/roles/:id", middleware.RBACMiddleware("role:list"), roleHandler.GetByID)
		authorized.PUT("/roles/:id", middleware.RBACMiddleware("role:update"), roleHandler.Update)
		authorized.DELETE("/roles/:id", middleware.RBACMiddleware("role:delete"), roleHandler.Delete)
		authorized.POST("/roles/:id/permissions", middleware.RBACMiddleware("role:update"), roleHandler.SetPermissions)
		authorized.POST("/roles/:id/menus", middleware.RBACMiddleware("role:update"), roleHandler.SetMenus)

		// 权限管理
		authorized.GET("/permissions", middleware.RBACMiddleware("permission:list"), permHandler.List)
		authorized.POST("/permissions", middleware.RBACMiddleware("permission:create"), permHandler.Create)
		authorized.GET("/permissions/:id", middleware.RBACMiddleware("permission:list"), permHandler.GetByID)
		authorized.PUT("/permissions/:id", middleware.RBACMiddleware("permission:update"), permHandler.Update)
		authorized.DELETE("/permissions/:id", middleware.RBACMiddleware("permission:delete"), permHandler.Delete)

		// 菜单管理
		authorized.GET("/menus", middleware.RBACMiddleware("menu:list"), menuHandler.List)
		authorized.POST("/menus", middleware.RBACMiddleware("menu:create"), menuHandler.Create)
		authorized.GET("/menus/:id", middleware.RBACMiddleware("menu:list"), menuHandler.GetByID)
		authorized.PUT("/menus/:id", middleware.RBACMiddleware("menu:update"), menuHandler.Update)
		authorized.DELETE("/menus/:id", middleware.RBACMiddleware("menu:delete"), menuHandler.Delete)

		// 部门管理
		authorized.GET("/depts", middleware.RBACMiddleware("dept:list"), deptHandler.List)
		authorized.POST("/depts", middleware.RBACMiddleware("dept:create"), deptHandler.Create)
		authorized.GET("/depts/:id", middleware.RBACMiddleware("dept:list"), deptHandler.GetByID)
		authorized.PUT("/depts/:id", middleware.RBACMiddleware("dept:update"), deptHandler.Update)
		authorized.DELETE("/depts/:id", middleware.RBACMiddleware("dept:delete"), deptHandler.Delete)
	}
}
