/**
 * 路由配置文件
 *
 * 本文件展示了 React Router v6 的使用方法：
 * 1. createBrowserRouter - 创建路由器实例
 * 2. 路由嵌套 - 父子路由结构
 * 3. 布局组件 - Outlet 的使用
 * 4. 懒加载 - 路由级代码分割
 */

import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";

/**
 * 懒加载页面组件
 *
 * 使用 React.lazy 实现路由级别的代码分割
 * 好处：
 * - 减少初始加载体积
 * - 按需加载，提升首屏性能
 *
 * 注意：懒加载组件需要配合 Suspense 使用
 */
const HomePage = lazy(() => import("@/pages/HomePage"));
const TodoPage = lazy(() => import("@/pages/TodoPage"));
const HooksDemoPage = lazy(() => import("@/pages/HooksDemoPage"));
const ContextDemoPage = lazy(() => import("@/pages/ContextDemoPage"));
const FormsDemoPage = lazy(() => import("@/pages/FormsDemoPage"));
const LifecycleDemoPage = lazy(() => import("@/pages/LifecycleDemoPage"));

/**
 * 加载指示器组件
 *
 * 在懒加载组件加载完成前显示
 */
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
}

/**
 * 懒加载包装器
 *
 * 统一处理懒加载组件的 Suspense 包裹
 */
function LazyPage({
  component: Component,
}: {
  component: React.LazyExoticComponent<() => JSX.Element>;
}) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  );
}

/**
 * 路由配置数组
 *
 * 使用类型注解确保配置正确
 * 每个路由对象包含：
 * - path: URL 路径
 * - element: 对应的组件
 * - children: 子路由（可选）
 */
const routes: RouteObject[] = [
  {
    path: "/",
    element: <LazyPage component={HomePage} />,
  },
  {
    path: "/todo",
    element: <LazyPage component={TodoPage} />,
  },
  {
    path: "/hooks",
    element: <LazyPage component={HooksDemoPage} />,
  },
  {
    path: "/context",
    element: <LazyPage component={ContextDemoPage} />,
  },
  {
    path: "/forms",
    element: <LazyPage component={FormsDemoPage} />,
  },
  {
    path: "/lifecycle",
    element: <LazyPage component={LifecycleDemoPage} />,
  },
  // 404 页面处理
  {
    path: "*",
    element: (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-gray-400">404</h1>
        <p className="text-gray-500 mt-2">页面未找到</p>
      </div>
    ),
  },
];

/**
 * 创建路由器实例
 *
 * createBrowserRouter 是 React Router v6 推荐的路由创建方式
 * 支持：
 * - 数据路由（loader/action）
 * - 更好的类型推断
 * - 错误处理
 */
export const router = createBrowserRouter(routes);
