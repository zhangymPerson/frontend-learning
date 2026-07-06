# backend-learning-project

基于 Go + Gin + GORM + SQLite 的后端权限管理系统。

## 技术栈

- **Go 1.21+**
- **Gin** - Web 框架
- **GORM** - ORM
- **SQLite** - 数据库
- **JWT** - 身份认证
- **bcrypt** - 密码加密

## 功能模块

- 用户管理
- 角色管理
- 权限管理
- 菜单管理
- 部门管理
- JWT 登录认证
- RBAC 基于权限编码的接口鉴权

## 项目结构

```
backend-learning-project/
├── cmd/server/main.go              # 程序入口
├── config/config.go                # 应用配置
├── internal/
│   ├── database/database.go        # 数据库连接、迁移、初始数据
│   ├── handlers/                   # HTTP 处理器
│   ├── middleware/auth.go          # JWT 认证 & RBAC 鉴权
│   ├── models/models.go            # GORM 数据模型
│   ├── repositories/               # 数据访问层
│   ├── routes/routes.go            # 路由注册
│   ├── services/                   # 业务逻辑层
│   └── utils/utils.go              # 密码 & JWT 工具
├── go.mod
├── go.sum
└── README.md
```

## 快速开始

```bash
cd backend-learning-project

# 下载依赖
go mod tidy

# 编译
go build -o server cmd/server/main.go

# 运行
./server
```

服务默认监听 `:8080`，数据库文件为 `app.db`。

## 默认账号

- 用户名：`admin`
- 密码：`123456`

## 常用 API

### 登录

```bash
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'
```

### 获取当前用户信息

```bash
curl -H "Authorization: Bearer <token>" http://localhost:8080/api/me
```

### 用户管理

```bash
# 列表
curl -H "Authorization: Bearer <token>" "http://localhost:8080/api/users?page=1&page_size=10"

# 创建
curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  http://localhost:8080/api/users \
  -d '{"username":"zhangsan","password":"123456","nickname":"张三","dept_id":1}'

# 更新
curl -X PUT -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  http://localhost:8080/api/users/2 \
  -d '{"nickname":"张三三","dept_id":2}'

# 删除
curl -X DELETE -H "Authorization: Bearer <token>" http://localhost:8080/api/users/2

# 设置角色
curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  http://localhost:8080/api/users/2/roles \
  -d '{"role_ids":[1,2]}'
```

### 角色管理

```bash
# 列表
curl -H "Authorization: Bearer <token>" http://localhost:8080/api/roles

# 创建
curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  http://localhost:8080/api/roles \
  -d '{"name":"普通用户","code":"common_user"}'

# 设置权限
curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  http://localhost:8080/api/roles/2/permissions \
  -d '{"permission_ids":[2,7,12,17,22]}'

# 设置菜单
curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  http://localhost:8080/api/roles/2/menus \
  -d '{"menu_ids":[1,2]}'
```

### 权限管理

```bash
curl -H "Authorization: Bearer <token>" http://localhost:8080/api/permissions
```

### 菜单管理

```bash
curl -H "Authorization: Bearer <token>" http://localhost:8080/api/menus
```

### 部门管理

```bash
curl -H "Authorization: Bearer <token>" http://localhost:8080/api/depts
```

## 权限说明

- 接口通过 `Authorization: Bearer <token>` 进行认证。
- 除登录接口外，其他接口都需要认证。
- 每个管理接口都需要对应的权限编码，例如：
  - 用户查看：`user:list`
  - 用户新增：`user:create`
  - 用户修改：`user:update`
  - 用户删除：`user:delete`
- 角色编码为 `super_admin` 时自动拥有所有权限。

## 数据模型关系

- 用户 - 角色：多对多
- 角色 - 权限：多对多
- 角色 - 菜单：多对多
- 用户 - 部门：多对一
- 权限/菜单/部门：支持 parent_id 自关联，便于构建树形结构
