# Vue 3 + TypeScript 学习项目

> 一个系统展示 Vue 3 核心知识点的前端学习项目，覆盖 Composition API、响应式系统、生命周期、状态管理、组件通信等重要概念。

## 技术栈

| 技术       | 版本 | 用途     |
| ---------- | ---- | -------- |
| Vue        | 3.4+ | 前端框架 |
| TypeScript | 5.4+ | 类型系统 |
| Vite       | 5.1+ | 构建工具 |
| Vue Router | 4.3+ | 路由管理 |
| Pinia      | 2.1+ | 状态管理 |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器 (端口 3000)
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 构建流程

```
源码 (src/)
  ↓
TypeScript 编译检查 (vue-tsc)
  ↓
Vite 构建 (ESBuild + Rollup)
  ↓
输出 (dist/)
  ├── index.html
  ├── assets/
  │   ├── index-xxx.js    (业务代码)
  │   └── index-xxx.css   (样式)
  └── vite.svg
```

**关键构建配置** (`vite.config.ts`):

- `@vitejs/plugin-vue`: 编译 Vue SFC (单文件组件)
- `resolve.alias`: `@` 映射到 `src/` 目录
- 路由懒加载: 各页面组件自动代码分割

## 项目结构

```
frontend-learning-project-3/
├── index.html                  # HTML 入口
├── package.json                # 依赖和脚本
├── vite.config.ts              # Vite 构建配置
├── tsconfig.json               # TypeScript 配置
├── src/
│   ├── main.ts                 # 应用入口
│   ├── App.vue                 # 根组件
│   ├── env.d.ts                # 类型声明
│   ├── types/
│   │   └── index.ts            # 全局类型定义
│   ├── router/
│   │   └── index.ts            # 路由配置 + 守卫
│   ├── stores/
│   │   └── counter.ts          # Pinia 状态管理
│   ├── views/
│   │   ├── HomeView.vue        # Composition API 基础
│   │   ├── ReactiveView.vue    # 响应式系统深入
│   │   ├── TodoView.vue        # 待办清单 (综合运用)
│   │   ├── LifecycleView.vue   # 生命周期钩子
│   │   ├── StoreView.vue       # Pinia 状态管理
│   │   └── CommunicationView.vue # 组件通信
│   ├── components/
│   │   ├── ChildComponent.vue  # Props + Emits 示例
│   │   ├── CustomInput.vue     # v-model 实现
│   │   ├── SlotDemo.vue        # 插槽演示
│   │   ├── InjectedChild.vue   # provide/inject
│   │   └── LifecycleChild.vue  # 生命周期子组件
│   └── assets/
│       └── style.css           # 全局样式
```

## 关键技术点详解

### 1. Composition API (组合式 API)

**核心文件**: `src/views/HomeView.vue`

Vue 3 最重要的变化是从 Options API 转向 Composition API。

| API          | 用途                     | 示例                                              |
| ------------ | ------------------------ | ------------------------------------------------- |
| `ref()`      | 基本类型响应式           | `const count = ref(0)`                            |
| `reactive()` | 对象深层响应式           | `const user = reactive({ name: '' })`             |
| `computed()` | 计算属性（有缓存）       | `const doubled = computed(() => count.value * 2)` |
| `toRefs()`   | 解构 reactive 保持响应性 | `const { name } = toRefs(user)`                   |

**ref vs reactive 使用场景**:

- `ref`: 适合基本类型 (string, number, boolean)
- `reactive`: 适合对象和数组
- 模板中 `ref` 自动解包，不需要 `.value`
- JS/TS 中 `ref` 必须用 `.value` 访问

### 2. 响应式系统 (Reactivity)

**核心文件**: `src/views/ReactiveView.vue`

Vue 3 使用 `Proxy` 实现响应式（Vue 2 使用 `Object.defineProperty`）。

| API             | 特点                             |
| --------------- | -------------------------------- |
| `watch()`       | 精确监听指定数据源，可获取新旧值 |
| `watchEffect()` | 自动收集依赖，立即执行           |
| `toRaw()`       | 获取代理对象的原始对象           |
| `markRaw()`     | 标记对象永不被代理               |

**watch vs watchEffect**:

```typescript
// watch: 需要手动指定监听目标
watch(searchKeyword, (newVal, oldVal) => {
  // 可以获取旧值
});

// watchEffect: 自动追踪函数内使用的所有响应式数据
watchEffect(() => {
  console.log(width.value, height.value); // 自动监听 width 和 height
});
```

### 3. 生命周期钩子

**核心文件**: `src/views/LifecycleView.vue`, `src/components/LifecycleChild.vue`

```
组件创建:  beforeCreate → created → onBeforeMount → onMounted
数据更新:  onBeforeUpdate → onUpdated
组件销毁:  onBeforeUnmount → onUnmounted
```

**父子组件生命周期顺序**:

- 挂载: 父 beforeMount → 子全部挂载 → 父 mounted
- 卸载: 父 beforeUnmount → 子全部卸载 → 父 unmounted

### 4. Pinia 状态管理

**核心文件**: `src/stores/counter.ts`, `src/views/StoreView.vue`

Pinia 是 Vue 3 官方推荐的状态管理库，相比 Vuex:

- 完整 TypeScript 支持，无需额外类型声明
- 没有 mutations，直接在 actions 中修改状态
- 支持 Composition API 风格 (setup store)
- 轻量 (~1KB)

**核心用法**:

```typescript
// 定义 Store
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)           // state
  const double = computed(...)   // getter
  function increment() { ... }   // action
  return { count, double, increment }
})

// 使用 Store
const store = useCounterStore()
const { count } = storeToRefs(store)  // 解构保持响应性
store.increment()                      // actions 可直接解构
```

### 5. 组件通信

**核心文件**: `src/views/CommunicationView.vue`, `src/components/`

| 方式           | 方向        | 适用场景               |
| -------------- | ----------- | ---------------------- |
| Props          | 父 → 子     | 数据传递（单向数据流） |
| Emits          | 子 → 父     | 事件通知               |
| v-model        | 双向        | 表单输入绑定           |
| Slots          | 父 → 子     | 内容分发               |
| provide/inject | 祖先 → 后代 | 跨层级传递             |
| Pinia          | 任意组件    | 全局共享状态           |

**defineProps + defineEmits 类型声明**:

```typescript
// 基于类型的 props 声明
defineProps<{ message: string; count: number }>();

// 基于类型的 emits 声明
defineEmits<{
  "update:message": [value: string];
  "update:count": [value: number];
}>();
```

### 6. Vue Router

**核心文件**: `src/router/index.ts`

- `createRouter` + `createWebHistory`: 创建路由实例
- 路由懒加载: `component: () => import('./views/Xxx.vue')`
- 路由守卫: `router.beforeEach()` 做权限检查
- 路由元信息: `meta` 字段存放自定义数据

### 7. TypeScript 集成

**核心文件**: `src/types/index.ts`, `src/env.d.ts`

- Vue 3 对 TypeScript 有原生支持
- `<script setup lang="ts">` 开启 TypeScript
- `defineProps<T>()` 使用泛型声明 props 类型
- 泛型接口 `ApiResponse<T>` 支持灵活的数据类型

## 业务代码文件介绍

| 文件                    | 职责                 | 涵盖知识点                          |
| ----------------------- | -------------------- | ----------------------------------- |
| `main.ts`               | 应用入口，注册插件   | createApp, use(), mount             |
| `App.vue`               | 根组件，导航布局     | router-link, router-view            |
| `router/index.ts`       | 路由配置             | 懒加载, 守卫, meta                  |
| `stores/counter.ts`     | 全局计数器状态       | Pinia setup store, ref, computed    |
| `types/index.ts`        | 全局类型定义         | TypeScript 接口, 泛型               |
| `HomeView.vue`          | Composition API 基础 | ref, reactive, 模板引用             |
| `ReactiveView.vue`      | 响应式系统           | watch, watchEffect, toRaw           |
| `TodoView.vue`          | 待办清单             | 综合运用 computed, watch, v-model   |
| `LifecycleView.vue`     | 生命周期             | 所有生命周期钩子                    |
| `StoreView.vue`         | 状态管理演示         | storeToRefs, $subscribe             |
| `CommunicationView.vue` | 组件通信             | props, emits, slots, provide/inject |
| `ChildComponent.vue`    | 子组件               | defineProps, defineEmits            |
| `CustomInput.vue`       | 自定义输入           | v-model 实现原理                    |
| `SlotDemo.vue`          | 插槽演示             | 默认/具名/作用域插槽                |
| `InjectedChild.vue`     | 注入组件             | inject 使用                         |
| `LifecycleChild.vue`    | 生命周期子组件       | 父子组件生命周期顺序                |

## 学习路径建议

1. **入门**: `HomeView.vue` → 理解 ref, reactive, computed
2. **进阶**: `ReactiveView.vue` → 理解 watch, watchEffect
3. **实战**: `TodoView.vue` → 综合运用所学知识
4. **深入**: `LifecycleView.vue` → 理解组件生命周期
5. **架构**: `StoreView.vue` → 全局状态管理
6. **通信**: `CommunicationView.vue` → 组件间数据流动

## License

MIT
