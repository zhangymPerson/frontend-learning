package main

import (
	"backend-learning-project/config"
	"backend-learning-project/internal/database"
	"backend-learning-project/internal/middleware"
	"backend-learning-project/internal/routes"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.DefaultConfig()

	// 初始化数据库
	if err := database.InitDB(cfg); err != nil {
		log.Fatalf("数据库初始化失败: %v", err)
	}

	// 设置 Gin 模式
	gin.SetMode(gin.ReleaseMode)

	// 创建路由
	r := gin.Default()

	// 注册全局跨域中间件（必须在业务路由之前）
	r.Use(middleware.CORS())

	// 注册路由
	routes.SetupRoutes(r, cfg)

	// 启动服务
	log.Printf("服务启动成功，监听 %s", cfg.Port)
	if err := r.Run(cfg.Port); err != nil {
		log.Fatalf("服务启动失败: %v", err)
	}
}
