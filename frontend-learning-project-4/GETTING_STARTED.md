# React 项目入门指南

> 这是一份写给前端初学者的文档，帮助你理解这个 React 项目是如何组织和运行的。

## 目录

1. [项目是什么？](#项目是什么)
2. [项目结构详解](#项目结构详解)
3. [页面是如何组织起来的](#页面是如何组织起来的)
4. [数据是如何流动的](#数据是如何流动的)
5. [如何开发一个新页面](#如何开发一个新页面)
6. [常见问题排查思路](#常见问题排查思路)
7. [学习建议](#学习建议)

---

## 项目是什么？

这是一个 **React Todo 应用**，简单说就是一个"待办事项管理工具"。你可以：

- 添加任务（比如"学习 React"）
- 标记任务完成
- 删除任务
- 筛选和排序任务

但这个项目不仅仅是 Todo 应用，它还包含了多个**示例页面**，展示了 React 的各种核心功能：

| 页面         | 学什么                           |
| ------------ | -------------------------------- |
| 首页         | 基础布局和导航                   |
| Todo 应用    | 完整的增删改查、状态管理         |
| Hooks 示例   | useState、useEffect 等 Hook 用法 |
| Context 示例 | 跨组件数据共享                   |
| 表单处理     | 表单验证和数据收集               |
| 生命周期     | 组件的挂载、更新、卸载           |

---

## 项目结构详解

### 顶层文件：配置和入口

```
frontend-learning-project-4/
├── index.html          # 网页入口，浏览器最先加载这个文件
├── package.json        # 项目配置：依赖什么库、有什么命令
├── vite.config.ts      # 构建工具配置
├── tsconfig.json       # TypeScript 配置
└── tailwind.config.js  # CSS 框架配置
```

**简单理解：**

- `index.html` 是网页的"骨架"，里面只有一个 `<div id="root"></div>`
- React 会把整个应用塞进这个 `root` 里
- 其他配置文件告诉工具如何编译和打包代码

### src 目录：源代码

```
src/
├── main.tsx            # 起点，把 App 组件渲染到页面
├── App.tsx             # 根组件，包裹全局 Provider 和路由
├── index.css           # 全局样式
│
├── types/              # 类型定义（TypeScript 的类型）
│   └── index.ts
│
├── store/              # 状态管理（全局数据）
│   └── TodoContext.tsx
│
├── router/             # 路由配置（页面地址映射）
│   └── index.tsx
│
├── components/         # 可复用的小组件
│   ├── TodoItem.tsx
│   ├── TodoForm.tsx
│   └── ...
│
└── pages/              # 页面组件
    ├── HomePage.tsx
    ├── TodoPage.tsx
    └── ...
```

**分层理解：**

```
pages/（页面）─────→ 使用 components/（组件）─────→ 读取 store/（数据）
    │                    │                              │
    └── 整合组件          └── 展示 UI                    └── 管理状态
```

---

## 页面是如何组织起来的

### 第一步：浏览器加载

```
浏览器访问 http://localhost:3001
         ↓
    加载 index.html
         ↓
    执行 <script src="/src/main.tsx">
         ↓
    main.tsx 渲染 <App />
```

### 第二步：App 组件启动

```tsx
// App.tsx
export function App() {
  return (
    <TodoProvider>
      {" "}
      {/* 提供全局数据 */}
      <RouterProvider /> {/* 提供路由，根据 URL 显示不同页面 */}
    </TodoProvider>
  );
}
```

**关键点：**

1. `TodoProvider` 是"数据仓库"，让所有组件都能访问 Todo 数据
2. `RouterProvider` 是"导航员"，根据 URL 地址决定显示哪个页面

### 第三步：路由匹配页面

```tsx
// router/index.tsx
const routes = [
  { path: "/", element: <HomePage /> }, // 首页
  { path: "/todo", element: <TodoPage /> }, // Todo 页
  { path: "/hooks", element: <HooksDemoPage /> },
  // ...
];
```

**当访问 `/todo` 时：**

```
URL 是 /todo
     ↓
Router 找到匹配的路由 { path: '/todo', element: <TodoPage /> }
     ↓
渲染 TodoPage 组件
```

### 第四步：页面使用组件

```tsx
// pages/TodoPage.tsx
export default function TodoPage() {
  return (
    <div>
      <TodoStats /> {/* 统计信息组件 */}
      <TodoForm /> {/* 添加表单组件 */}
      <TodoFilter /> {/* 筛选组件 */}
      <TodoList /> {/* 列表组件 */}
    </div>
  );
}
```

**组件复用示意：**

```
TodoPage
├── TodoStats（统计）
├── TodoForm（表单）
├── TodoFilter（筛选）
└── TodoList（列表）
    └── TodoItem × N（每个 Todo 项）
```

---

## 数据是如何流动的

### 核心概念：单向数据流

```
用户操作 → 更新状态 → 重新渲染 UI
   ↑                          │
   └──────────────────────────┘
```

### 示例：点击"完成"按钮

```
1. 用户点击复选框
       ↓
2. 调用 toggleTodo(id)
       ↓
3. dispatch({ type: 'TOGGLE_TODO', payload: id })
       ↓
4. Reducer 计算新状态
       ↓
5. Context 更新，通知所有使用该数据的组件
       ↓
6. TodoItem 重新渲染，显示"已完成"样式
```

### 代码对应关系

```tsx
// 1. 组件从 Context 获取操作函数
const { toggleTodo } = useTodoActions();

// 2. 点击时调用
<button onClick={() => toggleTodo(todo.id)}>

// 3. toggleTodo 内部 dispatch action
dispatch({ type: 'TOGGLE_TODO', payload: id });

// 4. Reducer 处理
case 'TOGGLE_TODO':
  return {
    ...state,
    todos: state.todos.map(todo =>
      todo.id === action.payload
        ? { ...todo, status: todo.status === 'completed' ? 'pending' : 'completed' }
        : todo
    )
  };

// 5. 组件重新渲染
```

---

## 如何开发一个新页面

假设你要添加一个"设置页面" (`/settings`)：

### 步骤 1：创建页面组件

```tsx
// src/pages/SettingsPage.tsx
import { Link } from "react-router-dom";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link to="/" className="text-blue-500">
            ← 返回首页
          </Link>
        </div>
      </nav>

      {/* 页面内容 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">设置</h1>
        {/* 你的设置内容 */}
      </main>
    </div>
  );
}
```

### 步骤 2：添加路由

```tsx
// src/router/index.tsx
import SettingsPage from "@/pages/SettingsPage";

const routes: RouteObject[] = [
  { path: "/", element: <HomePage /> },
  { path: "/todo", element: <TodoPage /> },
  { path: "/settings", element: <SettingsPage /> }, // 添加这行
  // ...
];
```

### 步骤 3：添加导航链接

```tsx
// src/pages/HomePage.tsx
const navCards = [
  { to: "/todo", title: "Todo 应用", icon: "📝" },
  { to: "/settings", title: "设置", icon: "⚙️" }, // 添加这行
];
```

### 步骤 4：如果需要全局数据

```tsx
// 如果设置需要全局状态，可以在 store/ 创建新的 Context
// src/store/SettingsContext.tsx

import { createContext, useContext, useState, type ReactNode } from "react";

interface Settings {
  theme: "light" | "dark";
  language: "zh" | "en";
}

const SettingsContext = createContext<{
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
} | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    theme: "light",
    language: "zh",
  });

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
```

然后在 `App.tsx` 中包裹：

```tsx
export function App() {
  return (
    <SettingsProvider>
      {" "}
      {/* 添加全局设置 */}
      <TodoProvider>
        <RouterProvider />
      </TodoProvider>
    </SettingsProvider>
  );
}
```

### 开发新页面的检查清单

- [ ] 创建 `src/pages/xxxPage.tsx`
- [ ] 在 `router/index.tsx` 添加路由
- [ ] 在首页添加导航链接
- [ ] 如需全局数据，创建 `store/xxxContext.tsx`
- [ ] 在 `App.tsx` 添加 Provider

---

## 常见问题排查思路

### 问题 1：页面空白，什么都不显示

**排查步骤：**

```
1. 打开浏览器控制台（F12），看有没有红色错误
     ↓
2. 如果有错误，点击错误信息定位到代码位置
     ↓
3. 常见原因：
   - 组件没有 export default
   - 导入路径错误（检查 @/ 别名是否正确）
   - JSX 语法错误（标签没闭合、属性名拼写错误）
```

### 问题 2：样式不生效

**排查步骤：**

```
1. 检查 class 名是否正确
   - Tailwind CSS 类名必须完全匹配（如 bg-white 不是 bg-White）
     ↓
2. 检查是否安装了 Tailwind CSS
   - package.json 中是否有 tailwindcss
   - 是否有 tailwind.config.js 和 postcss.config.js
     ↓
3. 检查 index.css 是否引入了 Tailwind 指令
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
```

### 问题 3：点击按钮没反应

**排查步骤：**

```
1. 检查事件是否绑定正确
   <button onClick={handleClick}>  // 正确
   <button onClick="handleClick">  // 错误，应该是 {} 不是 ""
     ↓
2. 检查函数是否定义
   const handleClick = () => { console.log('clicked'); };
     ↓
3. 检查控制台是否有错误（可能阻止了事件执行）
```

### 问题 4：数据不更新

**排查步骤：**

```
1. 确认是否调用了正确的更新函数
   const { toggleTodo } = useTodoActions();  // 获取更新函数
   toggleTodo(id);  // 调用它
     ↓
2. 检查 Context 是否正确包裹
   // App.tsx 中必须有 Provider
   <TodoProvider>
     {children}
   </TodoProvider>
     ↓
3. 检查组件是否使用了正确的 Hook
   const { todos } = useTodoState();  // 订阅数据
```

### 问题 5：TypeScript 报错

**常见错误：**

```
错误: 'xxx' is possibly 'null'
解决: 使用可选链或类型守卫
  - xxx?.property
  - if (xxx) { xxx.property }

错误: Type 'string' is not assignable to type 'Priority'
解决: 添加类型断言
  - value as Priority
  - 'high' as Priority
```

### 问题 6：路由不工作

**排查步骤：**

```
1. 检查路由配置
   { path: '/settings', element: <SettingsPage /> }
     ↓
2. 检查链接是否正确
   <Link to="/settings">  // 注意开头要有 /
     ↓
3. 检查 App.tsx 是否有 RouterProvider
```

### 调试技巧

#### 1. 使用 console.log

```tsx
const handleClick = () => {
  console.log("按钮被点击了");
  console.log("当前数据：", todos);
};
```

#### 2. 使用 React DevTools

1. 安装浏览器扩展 "React Developer Tools"
2. 打开控制台，切换到 "Components" 标签
3. 点击组件，查看 props、state、context

#### 3. 检查网络请求

如果涉及 API 调用，检查 "Network" 标签：

- 请求是否发出
- 响应是什么
- 状态码是多少

---

## 学习建议

### 学习路线

```
1. 先理解基础概念
   - 组件是什么
   - Props 和 State 的区别
   - JSX 语法

2. 学习 Hooks
   - useState（最基础）
   - useEffect（副作用）
   - useContext（跨组件通信）

3. 理解状态管理
   - Context API
   - useReducer

4. 学习路由
   - React Router 基础
   - 动态路由
```

### 推荐练习

1. **修改现有组件**
   - 给 TodoItem 添加"编辑"功能
   - 给 TodoForm 添加更多字段

2. **创建新页面**
   - 添加"关于我们"页面
   - 添加"帮助"页面

3. **扩展功能**
   - 添加深色模式切换
   - 添加多语言支持

### 有用的资源

- [React 官方文档](https://react.dev)（强烈推荐，写得很好）
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [React Router 文档](https://reactrouter.com)

---

## 快速参考

### 常用命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览生产构建
```

### 项目技术栈

| 技术         | 作用     |
| ------------ | -------- |
| React 18     | UI 框架  |
| TypeScript   | 类型检查 |
| Vite         | 构建工具 |
| React Router | 路由管理 |
| Tailwind CSS | 样式框架 |
| Context API  | 状态管理 |

### 关键文件速查

| 文件                        | 作用     |
| --------------------------- | -------- |
| `src/main.tsx`              | 应用入口 |
| `src/App.tsx`               | 根组件   |
| `src/router/index.tsx`      | 路由配置 |
| `src/store/TodoContext.tsx` | 全局状态 |
| `src/types/index.ts`        | 类型定义 |

---

## 总结

这个项目展示了 React 开发的核心模式：

1. **组件化**：把 UI 拆成小组件，组合成页面
2. **数据驱动**：状态变化触发 UI 更新
3. **单向数据流**：数据从上往下流动
4. **关注点分离**：UI、状态、路由分开管理

理解了这些，你就掌握了 React 开发的基础！

---

**有问题？** 打开浏览器控制台（F12），大多数错误都会在那里显示。
