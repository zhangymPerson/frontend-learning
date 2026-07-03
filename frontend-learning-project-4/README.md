# React 学习项目 (frontend-learning-project-4)

这是一个基于 React 18 + TypeScript + Vite 的学习项目，展示了 React 的核心特性和组件交互模式。

## 项目概述

本项目是一个 Todo 应用，包含以下功能：

- ✅ 完整的 Todo 管理（增删改查）
- ✅ 任务筛选和排序
- ✅ 本地存储持久化
- ✅ React Hooks 使用示例
- ✅ Context API 状态管理
- ✅ 表单处理和验证
- ✅ 组件生命周期演示

## 技术栈

- **React 18** - 现代 React，支持并发特性
- **TypeScript** - 类型安全，更好的开发体验
- **Vite** - 极速的开发服务器和构建工具
- **React Router v6** - 声明式路由
- **Context API + useReducer** - 轻量级状态管理

## 项目构建过程

### 1. 创建项目目录结构

```bash
mkdir -p frontend-learning-project-4/{src/{components,pages,store,types,hooks},public}
```

创建的目录结构：

```
frontend-learning-project-4/
├── index.html              # 应用入口 HTML 文件
├── package.json            # 项目依赖和脚本配置
├── tsconfig.json           # TypeScript 编译配置
├── tsconfig.node.json      # Node 环境 TypeScript 配置
├── vite.config.ts          # Vite 构建工具配置
├── tailwind.config.js      # Tailwind CSS 配置
├── postcss.config.js       # PostCSS 配置
├── public/                 # 静态资源目录
└── src/                    # 源代码目录
    ├── main.tsx            # 应用入口文件，渲染根组件
    ├── App.tsx             # 应用根组件，包裹 Provider 和路由
    ├── index.css           # 全局样式文件
    ├── vite-env.d.ts       # Vite 环境类型声明
    ├── types/              # TypeScript 类型定义目录
    │   └── index.ts        # 全局类型定义（Todo、Action、State 等）
    ├── store/              # 状态管理目录
    │   └── TodoContext.tsx # Context + useReducer 状态管理
    ├── router/             # 路由配置目录
    │   └── index.tsx       # React Router 路由配置
    ├── components/         # 可复用组件目录
    │   ├── TodoItem.tsx    # Todo 项组件，展示单个任务
    │   ├── TodoForm.tsx    # Todo 表单组件，创建新任务
    │   ├── TodoFilter.tsx  # 筛选排序组件
    │   ├── TodoStats.tsx   # 统计信息组件
    │   └── TodoList.tsx    # Todo 列表容器组件
    └── pages/              # 页面组件目录
        ├── HomePage.tsx           # 首页，项目介绍和导航
        ├── TodoPage.tsx           # Todo 应用主页面
        ├── HooksDemoPage.tsx      # React Hooks 使用示例
        ├── ContextDemoPage.tsx    # Context API 使用示例
        ├── FormsDemoPage.tsx      # 表单处理示例
        └── LifecycleDemoPage.tsx  # 组件生命周期示例
```

### 2. 创建配置文件

#### package.json

```bash
# 创建 package.json
cat > package.json << 'EOF'
{
  "name": "frontend-learning-project-4",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.3"
  },
  "devDependencies": {
    "@types/react": "^18.2.64",
    "@types/react-dom": "^18.2.21",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.4.2",
    "vite": "^5.1.6"
  }
}
EOF
```

#### tsconfig.json

```bash
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF
```

#### vite.config.ts

```bash
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3001,
    open: true,
  },
});
EOF
```

### 3. 安装依赖

```bash
npm install
```

安装的依赖包括：

**生产依赖：**

- `react@^18.2.0` - React 核心库
- `react-dom@^18.2.0` - React DOM 渲染
- `react-router-dom@^6.22.3` - 路由管理

**开发依赖：**

- `@types/react@^18.2.64` - React 类型定义
- `@types/react-dom@^18.2.21` - React DOM 类型定义
- `@vitejs/plugin-react@^4.2.1` - Vite React 插件
- `typescript@^5.4.2` - TypeScript 编译器
- `vite@^5.1.6` - 构建工具

### 4. 启动开发服务器

```bash
npm run dev
```

服务器启动在 `http://localhost:3001/`

### 5. 构建生产版本

```bash
npm run build
```

构建产物输出到 `dist/` 目录。

### 6. 预览生产版本

```bash
npm run preview
```

## 项目页面

### 1. 首页 (`/`)

- 项目介绍
- 功能特性展示
- 导航卡片

### 2. Todo 应用 (`/todo`)

- 完整的 Todo CRUD 功能
- 统计信息展示
- 筛选和排序
- 本地存储持久化

**数据流转说明：**

```
用户操作 → Component → useTodoActions() → dispatch(action)
                                                    ↓
                                              TodoReducer
                                                    ↓
                                              newState → Context Provider
                                                    ↓
                                              useTodoState() → Component 重渲染
```

### 3. Hooks 示例 (`/hooks`)

展示 React 核心 Hooks 的用法：

| Hook          | 用途                           |
| ------------- | ------------------------------ |
| `useState`    | 组件内部状态管理               |
| `useEffect`   | 副作用处理（数据获取、订阅等） |
| `useCallback` | 函数缓存，避免不必要的重渲染   |
| `useMemo`     | 值缓存，避免重复计算           |
| `useRef`      | 引用保持，不触发重渲染         |
| `useReducer`  | 复杂状态管理                   |

### 4. Context 示例 (`/context`)

- 多层 Context 嵌套
- useContext 消费
- Provider 值传递

### 5. 表单处理 (`/forms`)

- 受控组件
- 表单验证
- 动态字段

### 6. 生命周期 (`/lifecycle`)

- 挂载阶段
- 更新阶段
- 卸载阶段
- 清理函数

## 核心概念说明

### Context API 状态管理

本项目使用 `Context + useReducer` 模式管理状态：

```typescript
// 创建 Context
const TodoStateContext = createContext<TodoState | null>(null);
const TodoDispatchContext = createContext<Actions | null>(null);

// Provider 组件
export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  // ...副作用处理
  return (
    <TodoStateContext.Provider value={state}>
      <TodoDispatchContext.Provider value={actions}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  );
}

// 自定义 Hooks
export function useTodoState() {
  return useContext(TodoStateContext);
}
export function useTodoActions() {
  return useContext(TodoDispatchContext);
}
```

**优势：**

- 无需引入第三方库
- TypeScript 类型支持完善
- 适合中小型应用

### 数据转换示例

#### 1. 优先级排序权重转换

```typescript
const priorityWeight: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

// 字符串优先级转为数字进行比较
comparison = priorityWeight[a.priority] - priorityWeight[b.priority];
```

#### 2. 表单数据转换

```typescript
// 空字符串转为 undefined
description: formData.description.trim() || undefined;

// 字符串转为数字
age: value === "" ? "" : Number(value);
```

#### 3. 本地存储序列化

```typescript
// 保存：对象 → JSON 字符串
localStorage.setItem("todos", JSON.stringify(todos));

// 加载：JSON 字符串 → 对象
const todos = JSON.parse(savedTodos) as Todo[];
```

## 开发命令总结

| 命令              | 说明                        |
| ----------------- | --------------------------- |
| `npm install`     | 安装项目依赖                |
| `npm run dev`     | 启动开发服务器（端口 3001） |
| `npm run build`   | 构建生产版本                |
| `npm run preview` | 预览生产构建                |

## 项目特点

1. **中文注释**：所有代码注释使用中文，详细说明关键逻辑
2. **类型安全**：完整的 TypeScript 类型定义
3. **组件化**：组件职责单一，便于复用
4. **性能优化**：使用 memo、useCallback、useMemo 减少不必要的重渲染
5. **本地持久化**：Todo 数据自动保存到 localStorage

## 学习要点

### React 核心概念

- **组件**：函数组件 + Hooks
- **Props**：父传子的数据流
- **State**：组件内部状态
- **Context**：跨组件数据共享
- **生命周期**：useEffect 模拟类组件生命周期

### 数据流

```
             ┌──────────────┐
             │   Action    │
             └──────┬───────┘
                    │
                    ▼
             ┌──────────────┐
             │   Reducer    │ ← 纯函数，返回新状态
             └──────┬───────┘
                    │
                    ▼
             ┌──────────────┐
             │    State     │
             └──────┬───────┘
                    │
                    ▼
             ┌──────────────┐
             │    View      │ ← 组件根据状态渲染
             └──────────────┘
```

### 组件通信模式

1. **父 → 子**：Props 传递
2. **子 → 父**：回调函数
3. **跨层级**：Context API
4. **全局状态**：useReducer + Context

## 扩展建议

1. 添加 Tailwind CSS：`npm install -D tailwindcss postcss autoprefixer`
2. 添加测试框架：`npm install -D vitest @testing-library/react`
3. 添加 ESLint：`npm install -D eslint @typescript-eslint/eslint-plugin`

## 许可证

MIT
