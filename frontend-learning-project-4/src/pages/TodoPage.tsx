/**
 * Todo 应用主页面
 *
 * 本页面整合所有 Todo 相关组件，展示：
 * 1. 组件组合
 * 2. 布局设计
 * 3. Provider 的使用
 */

import { TodoForm } from "@/components/TodoForm";
import { TodoFilter } from "@/components/TodoFilter";
import { TodoList } from "@/components/TodoList";
import { TodoStats } from "@/components/TodoStats";
import { Link } from "react-router-dom";

export default function TodoPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部导航 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-blue-500 hover:text-blue-600">
            ← 返回首页
          </Link>
          <h1 className="text-xl font-semibold text-gray-800">Todo 应用</h1>
          <div className="w-16"></div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 统计信息 */}
        <TodoStats />

        {/* 添加表单 */}
        <TodoForm />

        {/* 筛选和排序 */}
        <TodoFilter />

        {/* Todo 列表 */}
        <TodoList />
      </main>
    </div>
  );
}
