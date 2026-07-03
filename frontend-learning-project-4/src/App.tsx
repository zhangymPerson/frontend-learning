/**
 * 主应用组件
 *
 * 本文件展示了 React 应用的根组件结构：
 * 1. Provider 包裹 - 提供全局状态
 * 2. 路由配置 - 页面导航
 * 3. 布局结构 - 页面框架
 */

import { RouterProvider } from "react-router-dom";
import { router } from "@/router";
import { TodoProvider } from "@/store/TodoContext";

/**
 * App 根组件
 *
 * 组件树结构：
 * - TodoProvider: 提供全局状态管理
 *   - RouterProvider: 提供路由功能
 *
 * Provider 的顺序很重要：
 * - 外层 Provider 的值可以被内层组件访问
 * - 如果 Router 中的组件需要访问 TodoProvider，
 *   TodoProvider 必须在 RouterProvider 外面
 */
export function App() {
  return (
    <TodoProvider>
      <RouterProvider router={router} />
    </TodoProvider>
  );
}
