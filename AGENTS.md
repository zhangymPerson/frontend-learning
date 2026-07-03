# AGENTS.md - 前端学习项目指南

本文档为 AI 代理提供在代码库中工作的关键信息。

## 项目概览

这是一个前端学习教程仓库，包含三个渐进式学习项目：

| 项目 | 技术栈 | 学习目标 |
|------|--------|----------|
| `frontend-learning-project-1/` | 纯 HTML + CSS + JavaScript | 前端基础（无框架、无构建工具） |
| `frontend-learning-project-2/` | HTML + CSS + TypeScript | TypeScript 类型系统 |
| `frontend-learning-project-3/` | Vue 3 + TypeScript + Vite + Pinia + Vue Router | Vue 3 Composition API |

**核心特点**：所有源代码文件都包含大量详细注释，用于教学目的。修改代码时保持注释风格一致。

## 常用命令

### 使用 justfile（推荐）

项目使用 [just](https://just.systems) 作为任务运行器：

```bash
# 查看所有可用任务
just

# 运行项目 1（纯 HTML/JS）
just r1         # 别名: run-project-1

# 构建 + 运行项目 2（TypeScript）
just r2         # 别名: run-project-2，会自动编译 TS
just b2         # 仅构建项目 2
just c2         # 清理项目 2 编译输出

# 运行项目 3（Vue 3）
just r3         # 别名: run-project-3
just b3         # 构建项目 3
just c3         # 清理项目 3

# 清理所有项目
just clear-all

# 交互式任务选择（需要 gum）
just run
```

### 项目 1：纯 HTML/JS

```bash
# 启动本地服务器（端口 8080）
cd frontend-learning-project-1
uv run python3 -m http.server 8080
# 或直接双击 index.html
```

### 项目 2：TypeScript

```bash
cd frontend-learning-project-2

# 编译 TypeScript → JavaScript
tsc

# 监视模式（自动重新编译）
tsc --watch

# 启动本地服务器
uv run python3 -m http.server 8080
```

**重要**：
- 源码在 `ts/` 目录，编译输出到 `js/` 目录
- **不要直接编辑 `js/` 目录下的文件**，它们由 `tsc` 自动生成
- 修改 TypeScript 后必须重新编译才能看到效果

### 项目 3：Vue 3 + Vite

```bash
cd frontend-learning-project-3

# 安装依赖（首次运行需要）
npm install

# 开发模式（端口 3000，自动打开浏览器）
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 项目结构

### 项目 1 结构

```
frontend-learning-project-1/
├── index.html          # 首页
├── js/main.js          # JavaScript 逻辑
├── css/style.css       # 样式（虽然目录结构中有，但实际可能内联）
└── pages/
    ├── about.html      # 关于页面
    └── contact.html    # 联系页面（表单交互）
```

### 项目 2 结构

```
frontend-learning-project-2/
├── index.html
├── tsconfig.json       # TypeScript 配置
├── ts/                 # 源码目录（编辑这里）
│   ├── main.ts         # 主逻辑
│   └── types.ts        # 类型定义
├── js/                 # 编译输出（不要编辑！）
│   └── main.js         # 自动生成
└── pages/
    ├── about.html
    └── contact.html
```

### 项目 3 结构

```
frontend-learning-project-3/
├── index.html              # HTML 入口
├── package.json
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
└── src/
    ├── main.ts             # 应用入口
    ├── App.vue             # 根组件
    ├── env.d.ts            # 类型声明
    ├── types/index.ts      # 全局类型定义
    ├── router/index.ts     # 路由配置
    ├── stores/counter.ts   # Pinia 状态管理
    ├── views/              # 页面组件
    │   ├── HomeView.vue
    │   ├── ReactiveView.vue
    │   ├── TodoView.vue
    │   ├── LifecycleView.vue
    │   ├── StoreView.vue
    │   └── CommunicationView.vue
    └── components/         # 可复用组件
        ├── ChildComponent.vue
        ├── CustomInput.vue
        ├── SlotDemo.vue
        ├── InjectedChild.vue
        └── LifecycleChild.vue
```

## 代码风格与约定

### 注释风格

所有源代码都包含大量教学注释：

```javascript
/*
  【知识点 N】标题
  - 要点 1
  - 要点 2
*/
```

**修改代码时**：
- 保持现有注释风格
- 如果添加新的重要概念，添加对应的知识点注释
- 注释使用中文，与项目风格一致

### TypeScript 配置

项目 2 (`tsconfig.json`):
- `target: "ES2020"` - 编译目标
- `outDir: "./js"` - 输出到 js 目录
- `rootDir: "./ts"` - 源码在 ts 目录
- `strict: true` - 严格模式
- `sourceMap: true` - 生成 source map

项目 3 (`tsconfig.json`):
- `noEmit: true` - 不输出 JS（由 Vite 处理）
- `paths: { "@/*": ["./src/*"] }` - 路径别名

### Vue 3 约定

项目 3 使用 Vue 3 Composition API：

```vue
<script setup lang="ts">
// 使用 <script setup> 语法糖
import { ref, reactive, computed, onMounted } from "vue";

// ref 用于基本类型
const count = ref(0);

// reactive 用于对象
const user = reactive({ name: '' });

// 模板引用
const inputRef = ref<HTMLInputElement | null>(null);
</script>
```

**关键约定**：
- 使用 `<script setup lang="ts">` 语法
- `ref` 用于基本类型，`reactive` 用于对象
- 使用基于类型的 props/emits 声明：
  ```typescript
  defineProps<{ message: string }>();
  defineEmits<{ 'update:message': [value: string] }>();
  ```
- 路由使用懒加载：`() => import('@/views/xxx.vue')`
- 路径别名：`@` 映射到 `src/`

### 文件命名

- Vue 组件：PascalCase（如 `ChildComponent.vue`）
- 视图页面：XxxView.vue（如 `HomeView.vue`）
- TypeScript 文件：camelCase（如 `main.ts`）

## 构建流程

### 项目 2 构建流程

```
ts/*.ts → tsc 编译 → js/*.js
```

运行 `tsc` 时：
1. 读取 `tsconfig.json`
2. 编译 `ts/` 目录下的所有 `.ts` 文件
3. 输出到 `js/` 目录
4. 生成 `.js.map` source map 文件

### 项目 3 构建流程

```
src/ → vue-tsc 类型检查 → vite build → dist/
```

`npm run build` 执行：
1. `vue-tsc --noEmit` - 类型检查（不输出文件）
2. `vite build` - 打包构建
3. 输出到 `dist/` 目录

## 注意事项

### 项目 2 的编译输出

- **不要手动编辑 `js/` 目录**
- 修改 `ts/` 后必须运行 `tsc` 或 `just b2`
- 清理命令 `just c2` 会删除整个 `js/` 目录

### 项目 3 的依赖

- 首次运行需要 `npm install`
- 开发服务器自动热更新
- 构建前会自动运行类型检查

### Git 操作（通过 justfile）

```bash
just fetch    # 从所有远程获取更新
just pull     # 拉取 main 分支
just push     # 推送到多个远程仓库
```

推送会同步到 `origin`、`gitcode`、`gitee` 三个远程仓库。

## 相关文档

- `typescript-react-learning-notes.md` - TypeScript + React 学习笔记（后端工程师视角）
- 各项目目录下的 `README.md` - 详细的启动和学习指南
