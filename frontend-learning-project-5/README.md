# 前端学习项目 5 - React + Ant Design 管理系统

## 项目简介

这是一个基于 **React + TypeScript + Vite + Ant Design** 的简约后台管理系统，包含：

1. **首页大屏**：展示全屏背景图和功能介绍
2. **管理端**：登录后的后台管理页面，包含数据概览和用户管理

## 技术栈

| 技术         | 版本    | 说明      |
| ------------ | ------- | --------- |
| React        | ^19.2.7 | UI 框架   |
| TypeScript   | ~6.0.2  | 类型系统  |
| Vite         | ^8.1.1  | 构建工具  |
| Ant Design   | ^6.5.0  | UI 组件库 |
| React Router | ^7.18.1 | 路由管理  |

## 项目创建过程

### 1. 创建 Vite 项目

```bash
npm create vite@latest frontend-learning-project-5 -- --template react-ts
```

**说明**：

- `npm create vite@latest`：使用最新版 Vite 创建项目
- `frontend-learning-project-5`：项目名称
- `--template react-ts`：使用 React + TypeScript 模板

### 2. 安装基础依赖

```bash
cd frontend-learning-project-5
npm install
```

**安装的依赖**：

- `react` 和 `react-dom`：React 核心库
- `@vitejs/plugin-react`：Vite 的 React 插件
- `typescript`：TypeScript 编译器
- `@types/react` 和 `@types/react-dom`：React 类型定义

### 3. 安装项目所需依赖

```bash
npm install react-router-dom antd @ant-design/icons
```

**依赖说明**：

| 包名                | 作用              | 引入方式                                                          |
| ------------------- | ----------------- | ----------------------------------------------------------------- |
| `react-router-dom`  | 前端路由管理      | `import { BrowserRouter, Routes, Route } from 'react-router-dom'` |
| `antd`              | Ant Design 组件库 | `import { Button, Layout, Menu } from 'antd'`                     |
| `@ant-design/icons` | Ant Design 图标库 | `import { UserOutlined } from '@ant-design/icons'`                |

## 项目结构

```
frontend-learning-project-5/
├── index.html              # HTML 入口
├── package.json            # 项目配置
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
└── src/
    ├── main.tsx            # 应用入口（配置路由和主题）
    ├── App.tsx             # 根组件（路由配置和登录状态）
    ├── App.css             # 全局样式
    ├── index.css           # 基础样式
    ├── layouts/
    │   ├── AdminLayout.tsx # 管理端布局（侧边栏 + 顶部栏）
    │   └── AdminLayout.css # 布局样式
    └── pages/
        ├── LandingPage.tsx  # 首页大屏
        ├── LandingPage.css  # 首页样式
        ├── LoginPage.tsx    # 登录页面
        ├── LoginPage.css    # 登录样式
        ├── DashboardPage.tsx # 数据概览
        └── UserPage.tsx     # 用户管理
```

## 启动项目

### 开发模式

```bash
npm run dev
```

- 默认启动在 `http://localhost:5173`
- 支持热更新（修改代码自动刷新）

### 构建生产版本

```bash
npm run build
```

- 输出到 `dist/` 目录
- 包含代码压缩和优化

### 预览构建结果

```bash
npm run preview
```

## 功能说明

### 页面路由

| 路径           | 页面     | 说明                           |
| -------------- | -------- | ------------------------------ |
| `/`            | 首页大屏 | 全屏背景图，展示系统介绍       |
| `/login`       | 登录页   | 用户名密码登录（admin/123456） |
| `/admin`       | 数据概览 | 登录后的首页，展示统计卡片     |
| `/admin/users` | 用户管理 | 用户列表表格                   |

### 登录信息

- **用户名**：`admin`
- **密码**：`123456`

## 核心知识点

本项目代码中包含详细注释，涵盖以下 React 和 Ant Design 核心概念：

### React 基础

- `useState`：状态管理
- `useEffect`：副作用处理
- `useContext`：跨组件数据传递
- `createContext`：创建 Context
- 条件渲染：根据状态显示不同内容

### React Router

- `BrowserRouter`：路由容器
- `Routes` 和 `Route`：路由定义
- `useNavigate`：编程式导航
- `useLocation`：获取当前路径
- `Outlet`：子路由渲染占位
- `Navigate`：重定向组件

### Ant Design 组件

- `Layout`：页面布局（Header/Sider/Content）
- `Menu`：导航菜单
- `Form` / `Input` / `Button`：表单元素
- `Card`：卡片容器
- `Table`：数据表格
- `Statistic`：统计数值
- `Tag`：标签
- `Popconfirm`：确认气泡框
- `message`：全局提示
- `theme.useToken`：主题系统

## 注意事项

1. 首次运行需要执行 `npm install` 安装依赖
2. 修改代码后保存会自动热更新
3. 登录状态使用内存存储，刷新页面会重置
4. 网络图片来自 Unsplash，需要联网才能显示
