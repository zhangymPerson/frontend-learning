/**
 * Vue Router 路由配置
 *
 * Vue Router 4.x 是为 Vue 3 设计的路由库
 * 核心概念:
 * - createRouter: 创建路由实例
 * - createWebHistory: 使用 HTML5 History 模式（无 # 号）
 * - 路由守卫: beforeEach, beforeResolve, afterEach
 * - 动态路由: /user/:id 形式的参数路由
 * - 嵌套路由: children 配置子路由
 */
import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

// 路由配置数组 — 使用 RouteRecordRaw 类型确保配置正确
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    // 路由懒加载：使用动态 import() 实现按需加载
    // 这会将组件代码分割到单独的 chunk 中，减小首屏加载体积
    component: () => import("@/views/HomeView.vue"),
    // meta 可以存放自定义数据，常用于权限控制、面包屑等
    meta: { title: "首页 - Composition API 基础", icon: "🏠" },
  },
  {
    path: "/reactive",
    name: "Reactive",
    component: () => import("@/views/ReactiveView.vue"),
    meta: { title: "响应式系统", icon: "⚡" },
  },
  {
    path: "/todo",
    name: "Todo",
    component: () => import("@/views/TodoView.vue"),
    meta: { title: "待办清单", icon: "✅" },
  },
  {
    path: "/lifecycle",
    name: "Lifecycle",
    component: () => import("@/views/LifecycleView.vue"),
    meta: { title: "生命周期钩子", icon: "🔄" },
  },
  {
    path: "/store",
    name: "Store",
    component: () => import("@/views/StoreView.vue"),
    meta: { title: "Pinia 状态管理", icon: "📦" },
  },
  {
    path: "/communication",
    name: "Communication",
    component: () => import("@/views/CommunicationView.vue"),
    meta: { title: "组件通信", icon: "🔗" },
  },
];

// 创建路由实例
const router = createRouter({
  // 使用 HTML5 History 模式，URL 更干净（不需要 #）
  // 生产环境需要服务器配置 fallback（将所有请求指向 index.html）
  history: createWebHistory(),
  routes,
  // 每次路由切换时滚动到页面顶部
  scrollBehavior() {
    return { top: 0 };
  },
});

/**
 * 全局前置守卫 — beforeEach
 * 在每次路由跳转之前执行
 * 常用场景: 登录验证、权限检查、设置页面标题
 */
router.beforeEach((to, _from, next) => {
  // 动态设置页面标题
  const title = to.meta.title as string;
  if (title) {
    document.title = title;
  }
  // 必须调用 next() 才能继续导航
  // next(false) 取消导航，next('/path') 重定向
  next();
});

export default router;
